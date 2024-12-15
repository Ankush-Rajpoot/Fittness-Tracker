import { google } from 'googleapis';
import { FitnessData } from '../models/googleFitUser.model.js';
import { User } from '../models/user.model.js';
import dotenv from "dotenv";
import passport from 'passport';
import { generateAccessAndRefereshTokens } from '../controllers/user.controller.js';
import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError.js';

dotenv.config();

export const fetchGoogleFitData = async (user) => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );
  oauth2Client.setCredentials({
    access_token: user.accessToken,
    refresh_token: user.refreshToken
  });

  const fitness = google.fitness({ 
    version: 'v1', 
    auth: oauth2Client 
  });

  const fourteenDaysInMillis = 14 * 24 * 60 * 60 * 1000;
  const startTimeMillis = Date.now() - fourteenDaysInMillis;
  const endTimeMillis = Date.now();

  try {
    const response = await fitness.users.dataset.aggregate({
      userId: 'me',
      requestBody: {
        aggregateBy: [
          { dataTypeName: "com.google.step_count.delta" },
          { dataTypeName: "com.google.blood_glucose" },
          { dataTypeName: "com.google.blood_pressure" },
          { dataTypeName: "com.google.heart_rate.bpm" },
          { dataTypeName: "com.google.weight" },
          { dataTypeName: "com.google.height" },
          { dataTypeName: "com.google.sleep.segment" },
          { dataTypeName: "com.google.body.fat.percentage" },
          { dataTypeName: "com.google.menstruation" }
        ],
        bucketByTime: { durationMillis: 86400000 },
        startTimeMillis,
        endTimeMillis
      }
    });

    const fitnessData = response.data.bucket.map(data => {
      const date = new Date(parseInt(data.startTimeMillis));
      const formattedEntry = {
        user: user._id,
        date: date,
        stepCount: 0,
        glucoseLevel: 0,
        bloodPressure: [],
        heartRate: 0,
        weight: 0,
        height: 0,
        bodyFat: 0,
        menstrualCycle: '',
        sleepHours: 0
      };

      data.dataset.forEach(dataset => {
        if (dataset.point && dataset.point.length > 0) {
          const point = dataset.point[0];
          const value = point.value;

          switch (dataset.dataSourceId) {
            case "derived:com.google.step_count.delta:com.google.android.gms:aggregated":
              formattedEntry.stepCount = value[0]?.intVal || 0;
              break;
            case "derived:com.google.blood_glucose.summary:com.google.android.gms:aggregated":
              formattedEntry.glucoseLevel = value && value[0]?.fpVal ? value[0].fpVal * 10 : 0;
              break;
            case "derived:com.google.blood_pressure.summary:com.google.android.gms:aggregated":
              const bpValues = value && value.filter(v => v.fpVal);
              formattedEntry.bloodPressure = bpValues ? 
                bpValues.map(v => v.fpVal).slice(0, 2) : 
                [];
              break;
            case "derived:com.google.heart_rate.summary:com.google.android.gms:aggregated":
              formattedEntry.heartRate = value && value[0]?.fpVal ? value[0].fpVal : 0;
              break;
            case "derived:com.google.weight.summary:com.google.android.gms:aggregated":
              formattedEntry.weight = value && value[0]?.fpVal ? value[0].fpVal : 0;
              break;
            case "derived:com.google.height.summary:com.google.android.gms:aggregated":
              formattedEntry.height = value && value[0]?.fpVal ? value[0].fpVal * 100 : 0;
              break;
            case "derived:com.google.body.fat.percentage.summary:com.google.android.gms:aggregated":
              formattedEntry.bodyFat = value && value[0]?.fpVal ? value[0].fpVal : 0;
              break;
            case "derived:com.google.menstruation:com.google.android.gms:aggregated":
              formattedEntry.menstrualCycle = value && value[0]?.intVal ? 
                value[0].intVal.toString() : '';
              break;
            case "derived:com.google.sleep.segment:com.google.android.gms:merged":
              formattedEntry.sleepHours = value[0]?.intVal || 0;
              break;
          }
        }
      });

      return formattedEntry;
    });

    return await FitnessData.insertMany(fitnessData);

  } catch (error) {
    console.error("Error in fetchGoogleFitData:", error);
    if (error.code === 401 || (error.response && error.response.data.error === 'invalid_grant')) {
      const incomingRefreshToken = user.refreshToken;
      if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request");
      }

      try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
        const refreshedUser = await User.findById(decodedToken?._id);

        if (!refreshedUser) {
          throw new ApiError(401, "Invalid refresh token");
        }

        if (incomingRefreshToken !== refreshedUser?.refreshToken) {
          throw new ApiError(401, "Refresh token is expired or used");
        }

        const { accessToken, newRefreshToken } = await generateAccessAndRefereshTokens(refreshedUser._id);
        refreshedUser.accessToken = accessToken;
        refreshedUser.refreshToken = newRefreshToken;
        await refreshedUser.save();

        oauth2Client.setCredentials({
          access_token: refreshedUser.accessToken,
          refresh_token: refreshedUser.refreshToken
        });

        return fetchGoogleFitData(refreshedUser);
      } catch (error) {
        console.error("Error refreshing token:", error);
        throw new ApiError(401, error?.message || "Invalid refresh token");
      }
    }
    throw error;
  }
};
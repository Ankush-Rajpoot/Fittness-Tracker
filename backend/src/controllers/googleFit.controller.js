// controllers/fitnessController.js
import { fetchGoogleFitData } from '../services/googleFitService.js';
import { FitnessData } from '../models/googleFitUser.model.js';

export const getFitnessData = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const savedFitnessData = await fetchGoogleFitData(req.user);
    console.log("Fetched fitness data:", savedFitnessData);

    res.status(200).json({
      message: "Fitness data fetched and saved successfully",
      data: savedFitnessData,
    });
  } catch (error) {
    console.error("Error fetching fitness data:", error);
    res.status(500).json({
      message: "Error fetching fitness data",
      error: error.message,
    });
  }
};

export const getFitnessDataHistory = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const fitnessDataHistory = await FitnessData.find({ user: req.user._id }).sort({ date: -1 });

    res.status(200).json({
      message: "Fitness data history retrieved successfully",
      data: fitnessDataHistory,
    });
  } catch (error) {
    console.error("Error retrieving fitness data history:", error);
    res.status(500).json({
      message: "Error retrieving fitness data history",
      error: error.message,
    });
  }
};
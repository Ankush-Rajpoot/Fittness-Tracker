import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import { Workout } from "../models/workout.model.js";
import { Progress } from "../models/progress.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"

const generateAccessAndRefereshTokens = async(userId) =>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        user.accessToken = accessToken
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

const registerUser = asyncHandler( async (req, res) => {

    const {fullName, email, password } = req.body
    //console.log("email: ", email);

    if (
        [fullName, email,password].some((field) => field?.trim() === "")
    ){
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({email})

    if (existedUser) {
        throw new ApiError(409, "User with email already exists")
    }
    
    const user = await User.create({
        fullName,
        email, 
        password,
    })


    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id);
    const createdUser=await User.findById(user._id)
    .select(
        "-password -refreshToken -accessToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }
    const options = { httpOnly: true, secure: true };

    return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )

})

const loginUser = asyncHandler(async (req, res) =>{

    const {email, password} = req.body

    if (!email) {
        throw new ApiError(400, "email is required")
    }
    

    const user = await User.findOne({email})

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

   const isPasswordValid = await user.isPasswordCorrect(password)

   if (!isPasswordValid) {
    throw new ApiError(401, "Invalid password")
    }

   const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken -accessToken");
    user.lastLogin=new Date();
    await user.save();


    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )

})

const logoutUser = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken?._id)
    
        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }
    
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
            
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefereshTokens(user._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200, 
                {accessToken, refreshToken: newRefreshToken},
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }

})

const getCurrentUser = asyncHandler(async(req, res) => {
    return res
    .status(200)
    .json(new ApiResponse(
        200,
        req.user,
        "User fetched successfully"
    ))
})

const getUserDashboard = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Calculate total calories burnt
    const totalCaloriesBurnt = await Workout.aggregate([
      { $match: { user: user._id } },
      {
        $group: {
          _id: null,
          totalCaloriesBurnt: { $sum: "$caloriesBurned" },
        },
      },
    ]);

    // Calculate total number of workouts
    const totalWorkouts = await Workout.countDocuments({
      user: userId,
    });

    // Calculate average calories burnt per workout
    const avgCaloriesBurntPerWorkout =
      totalCaloriesBurnt.length > 0
        ? totalCaloriesBurnt[0].totalCaloriesBurnt / totalWorkouts
        : 0;

    // Calculate total active minutes (sum of durations)
    const totalActiveMinutes = await Workout.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: userId,
          totalActiveMinutes: { $sum: "$duration" },
        },
      },
    ]);
    console.log(totalActiveMinutes);

    


    // Fetch category of workouts
    const categoryCalories = await Workout.aggregate([
      { $match: { user: user._id } },
      {
        $group: {
          _id: "$category",
          totalCaloriesBurnt: { $sum: "$caloriesBurned" },
          totalWorkouts: { $sum: 1 },
        },
      },
    ]);

    // Format category data for pie chart and stats
    const pieChartData = categoryCalories.map((category, index) => ({
      id: index,
      value: category.totalCaloriesBurnt,
      label: category._id,
    }));

    const bodyPartStats = categoryCalories.map((category) => ({
      bodyPart: category._id,
      totalCaloriesBurnt: category.totalCaloriesBurnt,
      totalWorkouts: category.totalWorkouts,
    }));

    // Correct day mapping logic for backend
    const weeks = [];
    const caloriesBurnt = [];
    const totalActiveDaysResult = await Workout.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
        },
      },
      {
        $count: "totalActiveDays",
      },
    ]);
    const totalActiveDays = totalActiveDaysResult.length > 0 ? totalActiveDaysResult[0].totalActiveDays : 0;
    let currentStreak = 0;
    let streakBroken = false;

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

      const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);

      const dayData = await Workout.aggregate([
        {
          $match: {
            user: user._id,
            createdAt: { $gte: startOfDay, $lt: endOfDay },
          },
        },
        {
          $group: {
            _id: userId,
            totalCaloriesBurnt: { $sum: '$caloriesBurned' },
            totalActiveMinutes: { $sum: '$duration' },
          },
        },
      ]);
      // console.log(dayData);
      weeks.push(dayName);
      caloriesBurnt.push(dayData[0]?.totalCaloriesBurnt || 0);

      if (dayData.length > 0) {
        if (dayName !== 'Sun' && !streakBroken) {
          currentStreak++;
        }
      } else if (dayName !== 'Sun' && dayData.length === 0) {
        streakBroken = true;
      }
    }

    // Send response including total active minutes
    return res.status(200).json({
      totalCaloriesBurnt:
        totalCaloriesBurnt.length > 0
          ? totalCaloriesBurnt[0].totalCaloriesBurnt
          : 0,
      totalWorkouts: totalWorkouts,
      avgCaloriesBurntPerWorkout: avgCaloriesBurntPerWorkout,
      totalActiveMinutes: totalActiveMinutes.length > 0 ? totalActiveMinutes[0].totalActiveMinutes : 0, // Include active minutes here
      totalActiveDays: totalActiveDays,
      currentStreak: currentStreak,
      totalWeeksCaloriesBurnt: {
        weeks: weeks,
        caloriesBurned: caloriesBurnt,
      },
      pieChartData: pieChartData,
      bodyPartStats: bodyPartStats, // Include body part stats
    });
  } catch (err) {
    next(err);
  }
};

const getWorkoutsByDate = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    const user = await User.findById(userId);
    let date = req.query.date ? new Date(req.query.date) : new Date();

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Set start and end of the day to cover the full day
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // Query the workouts based on the user and date range
    const todaysWorkouts = await Workout.find({
      user: userId, // Adjust field name if necessary
      createdAt: { $gte: startOfDay, $lt: endOfDay }, // Make sure the field name matches
    });

    // Calculate the total calories burnt
    const totalCaloriesBurnt = todaysWorkouts.reduce(
      (total, workout) => total + workout.caloriesBurned, 0
    );

    // Calculate total active minutes
    const totalActiveMinutes = todaysWorkouts.reduce(
      (total, workout) => total + workout.duration, 0
    );

    // Group workouts by category for pie chart
    const categoryCalories = await Workout.aggregate([
      { $match: { user: user._id, createdAt: { $gte: startOfDay, $lt: endOfDay } } },
      {
        $group: {
          _id: "$category",
          totalCaloriesBurnt: { $sum: "$caloriesBurned" },
        },
      },
    ]);

    // Format category data for pie chart
    const pieChartData = categoryCalories.map((category, index) => ({
      id: index,
      value: category.totalCaloriesBurnt,
      label: category._id,
    }));

    return res.status(200).json({ 
      todaysWorkouts, 
      totalCaloriesBurnt, 
      totalActiveMinutes, 
      pieChartData 
    });
  } catch (err) {
    next(err);
  }
};

const addWorkout = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { workoutString } = req.body;

  if (!workoutString) {
    return res.status(400).json({ message: "Workout string is missing" });
  }

  const lines = workoutString
    .split("\n")
    .map(line => line.trim())
    .filter(line => line !== "");

  const parsedWorkouts = [];
  let currentCategory = "";

  lines.forEach(line => {
    if (line.startsWith("#")) {
      currentCategory = line.substring(1).trim(); // Update the category
    } else {
      const parts = line.split(";").map(part => part.trim());
      if (parts.length < 4) {
        throw new Error(`Invalid workout format at line ${lines.indexOf(line) + 1}`);
      }

      const workoutDetails = parseWorkoutLine(parts);
      workoutDetails.category = currentCategory;
      parsedWorkouts.push(workoutDetails);
    }
  });

  for (const workout of parsedWorkouts) {
    workout.caloriesBurned = calculateCaloriesBurnt(workout);
    await Workout.create({ ...workout, user: userId });
    await updateProgress(userId, workout); // Update or create progress
  }

  res.status(201).json({
    message: "Workouts added and progress updated successfully",
    workouts: parsedWorkouts,
  });
});

const updateProgress = async (userId, workout) => {
  const { category, sets, reps, weight, workoutName } = workout;

  let progress = await Progress.findOne({ userId, bodyPart: category });

  if (progress) {
    const date = new Date().toLocaleDateString();
    const existingEntry = progress.entries.find(entry => new Date(entry.date).toLocaleDateString() === date);

    if (existingEntry) {
      existingEntry.weight += weight;
      existingEntry.sets += sets;
      existingEntry.reps += reps;
      existingEntry.workoutName += `, ${workoutName}`;
    } else {
      progress.entries.push({ date: new Date(), weight, sets, reps, workoutName });
    }

    progress.totalWeight += weight;
    progress.totalSets += sets;
    progress.totalReps += reps;
    progress.latestDate = new Date();
  } else {
    progress = new Progress({
      userId,
      bodyPart: category,
      totalWeight: weight,
      totalSets: sets,
      totalReps: reps,
      entries: [{ date: new Date(), weight, sets, reps, workoutName }],
    });
  }

  await progress.save();
};

const calculateProgress = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  const progressData = await Progress.find({ userId });

  if (progressData.length === 0) {
    return res.status(404).json({ message: "No progress data found for this user." });
  }

  const insights = progressData.map((record) => {
    const { bodyPart, totalWeight, totalSets, totalReps, entries, latestDate } = record;

    const numberOfEntries = entries.length;
    const firstEntryWeight = entries[0]?.weight || 0;
    const latestEntryWeight = entries[numberOfEntries - 1]?.weight || 0;

    const improvementPercentage = firstEntryWeight
      ? ((latestEntryWeight - firstEntryWeight) / firstEntryWeight) * 100
      : 0;

    return {
      bodyPart,
      totalWeight,
      totalSets,
      totalReps,
      numberOfEntries,
      latestDate: new Date(latestDate).toISOString(), // Ensure ISO format
      improvementPercentage: improvementPercentage.toFixed(2),
      entries: entries.map((entry) => ({
        date: new Date(entry.date).toISOString(),
        weight: entry.weight,
        workoutName: entry.workoutName || 'Unknown', // Ensure workout name is included
      })),
    };
  });

  res.status(200).json(insights);
});

// Parse workout line
const parseWorkoutLine = parts => ({
  workoutName: parts[0],
  sets: parseInt(parts[1].split("sets")[0].trim()),
  reps: parseInt(parts[1].split("sets")[1].split("reps")[0].trim()),
  weight: parseFloat(parts[2].split("kg")[0].trim()),
  duration: parseFloat(parts[3].split("min")[0].trim()),
});

// Calculate calories burnt
const calculateCaloriesBurnt = workout => {
  const duration = parseFloat(workout.duration);
  const weight = parseFloat(workout.weight);
  const caloriesPerMinute = 5; // Sample value
  return duration * caloriesPerMinute * weight;
}

const checkAuth = asyncHandler(async (req, res) => {
	try {
		const user = await User.findById(req.user._id).select("-password");
		if (!user) {
			return res.status(400).json({ success: false, message: "User not found" });
		}

		res.status(200).json({ success: true, user });
	} catch (error) {
		console.log("Error in checkAuth ", error);
		res.status(400).json({ success: false, message: error.message });
	}
});

const getUserProfile = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const user = await User.findById(userId).select("-password -refreshToken -accessToken");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Calculate current streak
  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

  const workoutsToday = await Workout.find({
    user: userId,
    createdAt: { $gte: startOfDay, $lt: endOfDay },
  });
  // console.log(workoutsToday);

  const currentStreak = workoutsToday.length > 0 ? user.currentStreak + 1 : 0;
// console.log(currentStreak);
  // Calculate total active days including Sundays
  const totalActiveDays = await Workout.aggregate([
    { $match: { user: userId } },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
          day: { $dayOfMonth: "$createdAt" },
        },
      },
    },
    {
      $count: "totalActiveDays",
    },
  ]);
  console.log(totalActiveDays);

  // Calculate total active minutes
  const totalActiveMinutes = await Workout.aggregate([
    { $match: { user: userId } },
    {
      $group: {
        _id: null,
        totalActiveMinutes: { $sum: "$duration" },
      },
    },
  ]);
  console.log(totalActiveMinutes);

  res.status(200).json(new ApiResponse(200,{
    fullName: user.fullName,
    email: user.email,
    joinedDate: user.createdAt,
    lastLogin: user.lastLogin,
    currentStreak: currentStreak,
    totalActiveDays: totalActiveDays.length > 0 ? totalActiveDays[0].totalActiveDays : 0,
    totalActiveMinutes: totalActiveMinutes.length > 0 ? totalActiveMinutes[0].totalActiveMinutes : 0,
  }, "User profile fetched successfully"));
});

const getExercisesByBodyPart = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { bodyPart } = req.params;

  if (!bodyPart) {
    throw new ApiError(400, "Body part is required");
  }

  const exercises = await Workout.find({ user: userId, category: bodyPart });

  if (!exercises.length) {
    throw new ApiError(404, "No exercises found for this body part");
  }

  const exerciseData = exercises.map((exercise) => ({
    name: exercise.workoutName,
    caloriesBurned: exercise.caloriesBurned,
    sets: exercise.sets,
    reps: exercise.reps,
  }));
  console.log(exerciseData);

  res.status(200).json(new ApiResponse(200, exerciseData, "Exercises fetched successfully"));
});

const getExercisesByDateAndBodyPart = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { date, bodyPart } = req.query;

  if (!date || !bodyPart) {
    throw new ApiError(400, "Date and body part are required");
  }

  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const exercises = await Workout.find({
    user: userId,
    category: bodyPart,
    createdAt: { $gte: startOfDay, $lt: endOfDay },
  });

  if (!exercises.length) {
    throw new ApiError(404, "No exercises found for this body part on the specified date");
  }

  const exerciseData = exercises.map((exercise) => ({
    workoutName: exercise.workoutName,
    reps: exercise.reps,
    sets: exercise.sets,
    duration: exercise.duration,
    caloriesBurned: exercise.caloriesBurned,
    date: exercise.createdAt, // Include the date
  }));

  res.status(200).json(new ApiResponse(200, exerciseData, "Exercises fetched successfully"));
});

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    getCurrentUser,
    addWorkout,
    getUserDashboard,
    getWorkoutsByDate,
    parseWorkoutLine,
    calculateCaloriesBurnt,
    calculateProgress,
    generateAccessAndRefereshTokens,
    checkAuth,
    getUserProfile,
    updateProgress,
    getExercisesByBodyPart,
    getExercisesByDateAndBodyPart
}
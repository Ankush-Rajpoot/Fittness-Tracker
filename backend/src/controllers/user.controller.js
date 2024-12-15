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

// const getUserDashboard = async (req, res, next) => {
//     try {
//       const userId = req.user?._id;
//       const user = await User.findById(userId);
//       if (!user) {
//         throw new ApiError(404,"User not found")
//       }
  
//       const currentDateFormatted = new Date();
//       const startToday = new Date(
//         currentDateFormatted.getFullYear(),
//         currentDateFormatted.getMonth(),
//         currentDateFormatted.getDate()
//       );
//       const endToday = new Date(
//         currentDateFormatted.getFullYear(),
//         currentDateFormatted.getMonth(),
//         currentDateFormatted.getDate() + 1
//       );
  
//       //calculte total calories burnt
//       const totalCaloriesBurnt = await Workout.aggregate([
//         { $match: { user: user._id, date: { $gte: startToday, $lt: endToday } } },
//         {
//           $group: {
//             _id: null,
//             totalCaloriesBurnt: { $sum: "$caloriesBurned" },
//           },
//         },
//       ]);
  
//       //Calculate total no of workouts
//       const totalWorkouts = await Workout.countDocuments({
//         user: userId,
//         date: { $gte: startToday, $lt: endToday },
//       });
  
//       //Calculate average calories burnt per workout
//       const avgCaloriesBurntPerWorkout =
//         totalCaloriesBurnt.length > 0
//           ? totalCaloriesBurnt[0].totalCaloriesBurnt / totalWorkouts
//           : 0;
  
//       // Fetch category of workouts
//       const categoryCalories = await Workout.aggregate([
//         { $match: { user: user._id, date: { $gte: startToday, $lt: endToday } } },
//         {
//           $group: {
//             _id: "$category",
//             totalCaloriesBurnt: { $sum: "$caloriesBurned" },
//           },
//         },
//       ]);
  
//       //Format category data for pie chart
  
//       const pieChartData = categoryCalories.map((category, index) => ({
//         id: index,
//         value: category.totalCaloriesBurnt,
//         label: category._id,
//       }));
  
//       const weeks = [];
//       const caloriesBurnt = [];
//       for (let i = 6; i >= 0; i--) {
//         const date = new Date(
//           currentDateFormatted.getTime() - i * 24 * 60 * 60 * 1000
//         );
//         weeks.push(`${date.getDate()}th`);
  
//         const startOfDay = new Date(
//           date.getFullYear(),
//           date.getMonth(),
//           date.getDate()
//         );
//         const endOfDay = new Date(
//           date.getFullYear(),
//           date.getMonth(),
//           date.getDate() + 1
//         );
  
//         const weekData = await Workout.aggregate([
//           {
//             $match: {
//               user: user._id,
//               date: { $gte: startOfDay, $lt: endOfDay },
//             },
//           },
//           {
//             $group: {
//               _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
//               totalCaloriesBurnt: { $sum: "$caloriesBurned" },
//             },
//           },
//           {
//             $sort: { _id: 1 }, // Sort by date in ascending order
//           },
//         ]);
  
//         caloriesBurnt.push(
//           weekData[0]?.totalCaloriesBurnt ? weekData[0]?.totalCaloriesBurnt : 0
//         );
//       }
  
//       return res
//       .status(200)
//       .json({
//         totalCaloriesBurnt:
//           totalCaloriesBurnt.length > 0
//             ? totalCaloriesBurnt[0].totalCaloriesBurnt
//             : 0,
//         totalWorkouts: totalWorkouts,
//         avgCaloriesBurntPerWorkout: avgCaloriesBurntPerWorkout,
//         totalWeeksCaloriesBurnt: {
//           weeks: weeks,
//           caloriesBurned: caloriesBurnt,
//         },
//         pieChartData: pieChartData,
//       });
//     }
//     catch (err) {
//       next(err);
//     }
//   };
  
const getUserDashboard = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404,"User not found")
    }

    const currentDateFormatted = new Date();
    const startToday = new Date(
      currentDateFormatted.getFullYear(),
      currentDateFormatted.getMonth(),
      currentDateFormatted.getDate()
    );
    const endToday = new Date(
      currentDateFormatted.getFullYear(),
      currentDateFormatted.getMonth(),
      currentDateFormatted.getDate() + 1
    );

    // Calculate total calories burnt
    const totalCaloriesBurnt = await Workout.aggregate([
      { $match: { user: user._id, date: { $gte: startToday, $lt: endToday } } },
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
      date: { $gte: startToday, $lt: endToday },
    });

    // Calculate average calories burnt per workout
    const avgCaloriesBurntPerWorkout =
      totalCaloriesBurnt.length > 0
        ? totalCaloriesBurnt[0].totalCaloriesBurnt / totalWorkouts
        : 0;

    // Calculate total active minutes (sum of durations)
    const totalActiveMinutes = await Workout.aggregate([
      { $match: { user: user._id, date: { $gte: startToday, $lt: endToday } } },
      {
        $group: {
          _id: null,
          totalActiveMinutes: { $sum: "$duration" },
        },
      },
    ]);

    // Fetch category of workouts
    const categoryCalories = await Workout.aggregate([
      { $match: { user: user._id, date: { $gte: startToday, $lt: endToday } } },
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

   // Correct day mapping logic for backend
const weeks = [];
const caloriesBurnt = [];
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
        date: { $gte: startOfDay, $lt: endOfDay },
      },
    },
    {
      $group: {
        _id: null,
        totalCaloriesBurnt: { $sum: '$caloriesBurned' },
      },
    },
  ]);

  weeks.push(dayName);
  caloriesBurnt.push(dayData[0]?.totalCaloriesBurnt || 0);
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
      totalWeeksCaloriesBurnt: {
        weeks: weeks,
        caloriesBurned: caloriesBurnt,
      },
      pieChartData: pieChartData,
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

        return res.status(200).json({ todaysWorkouts, totalCaloriesBurnt });
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
  const { category, sets, reps, weight } = workout;

  let progress = await Progress.findOne({ userId, bodyPart: category });

  if (progress) {
    progress.totalWeight += weight;
    progress.totalSets += sets;
    progress.totalReps += reps;
    progress.entries.push({ date: new Date(), weight, sets, reps });
    progress.latestDate = new Date();
  } else {
    progress = new Progress({
      userId,
      bodyPart: category,
      totalWeight: weight,
      totalSets: sets,
      totalReps: reps,
      entries: [{ date: new Date(), weight, sets, reps }],
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
    checkAuth
}
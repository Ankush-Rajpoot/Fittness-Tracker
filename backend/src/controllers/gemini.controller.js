import { GoogleGenerativeAI } from "@google/generative-ai";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const chatWithGemini = asyncHandler(async (req, res) => {
  const { userInput } = req.body;
  console.log("User Input:", userInput);

  if (!userInput) {
    throw new ApiError(400, "User input is required");
  }

  try {
    const result = await model.generateContent(`You are a fitness assistant. Answer the following question based on the knowledge of this fitness project: ${userInput}`);
    const response = await result.response;
    const text = response.text();
    console.log("Gemini Response:", text);
    return res.status(200).json(new ApiResponse(200, { response: text }, "Response generated successfully"));
  } catch (error) {
    console.error("Error generating response from Gemini:", error.response ? error.response.data : error.message);
    throw new ApiError(500, "Error generating response from Gemini");
  }
});

export { chatWithGemini };



// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { asyncHandler } from "../utils/asyncHandler.js";
// import { ApiError } from "../utils/ApiError.js";
// import { ApiResponse } from "../utils/ApiResponse.js";
// import { getUserDashboard, getWorkoutsByDate, calculateProgress, getUserProfile } from "./user.controller.js"; // Import necessary functions
// import dotenv from "dotenv";
// dotenv.config();

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// const removeCircularReferences = (obj) => {
//   const seen = new WeakSet();
//   return JSON.parse(
//     JSON.stringify(obj, (key, value) => {
//       if (typeof value === "object" && value !== null) {
//         if (seen.has(value)) return undefined;
//         seen.add(value);
//       }
//       return value;
//     })
//   );
// };

// const chatWithGemini = asyncHandler(async (req, res) => {
//   const { userInput } = req.body;
//   console.log("User Input:", userInput);

//   if (!userInput) {
//     throw new ApiError(400, "User input is required");
//   }

//   try {
//     // Fetch user data
//     const userId = req.user?._id;
//     const dashboardData = await getUserDashboard({ user: { _id: userId } }, res, () => {});
//     const workoutsByDate = await getWorkoutsByDate({ user: { _id: userId }, query: { date: new Date() } }, res, () => {});
//     const progressData = await calculateProgress({ params: { id: userId } }, res, () => {});
//     const userProfile = await getUserProfile({ user: { _id: userId } }, res, () => {});

//     // Combine all user data
//     const userData = {
//       dashboardData,
//       workoutsByDate,
//       progressData,
//       userProfile,
//     };

//     // Remove circular references
//     const safeUserData = removeCircularReferences(userData);

//     // Generate response based on user data
//     const result = await model.generateContent(
//       `You are a fitness assistant. Based on the following user data: ${JSON.stringify(safeUserData)}, answer the following question: ${userInput}`
//     );
//     const response = await result.response;
//     const text = response.text();
//     console.log("Gemini Response:", text);
//     return res
//       .status(200)
//       .json(new ApiResponse(200, { response: text }, "Response generated successfully"));
//   } catch (error) {
//     console.error(
//       "Error generating response from Gemini:",
//       error.response ? error.response.data : error.message
//     );
//     throw new ApiError(500, "Error generating response from Gemini");
//   }
// });

// export { chatWithGemini };

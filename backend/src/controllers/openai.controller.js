import OpenAI from "openai";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const chatWithGPT = asyncHandler(async (req, res) => {
  const { userInput } = req.body;
  console.log("User Input:", userInput);

  if (!userInput) {
    throw new ApiError(400, "User input is required");
  }

  try {
    const response = await openai.completions.create({
      model: "gpt-4o-mini",
      prompt: `You are a fitness assistant. Answer the following question based on the knowledge of this fitness project: ${userInput}`,
      max_tokens: 150,
      temperature: 0.7,
    });

    const gptResponse = response.choices[0].text.trim();
    console.log("GPT Response:", gptResponse);
    return res.status(200).json(new ApiResponse(200, { response: gptResponse }, "Response generated successfully"));
  } catch (error) {
    console.error("Error generating response from OpenAI:", error.response ? error.response.data : error.message);
    throw new ApiError(500, "Error generating response from OpenAI");
  }
});

export { chatWithGPT };

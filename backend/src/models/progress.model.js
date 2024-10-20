import mongoose from "mongoose"

const ProgressSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    bodyPart: { type: String, required: true }, // Category of the workout
    totalWeight: { type: Number, default: 0 },
    totalSets: { type: Number, default: 0 },
    totalReps: { type: Number, default: 0 },
    entries: [
        {
        date: { type: Date, default: Date.now },
        weight: { type: Number },
        sets: { type: Number },
        reps: { type: Number },
        },
    ],
    latestDate: { type: Date, default: Date.now },
});

export const Progress = mongoose.model("Progress", ProgressSchema);


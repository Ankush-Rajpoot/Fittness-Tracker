import mongoose from 'mongoose';

const FitnessDataSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  stepCount: {
    type: Number,
    default: 0
  },
  height: {
    type: Number,
    default: 0
  },
  weight: {
    type: Number,
    default: 0
  },
  menstrualCycle: {
    type: String,
    default: ''
  },
  heartRate: {
    type: Number,
    default: 0
  },
  glucoseLevel: {
    type: Number,
    default: 0
  },
  bodyFat: {
    type: Number,
    default: 0
  },
  bloodPressure: {
    type: [Number],
    default: []
  },
  sleepHours: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

export const FitnessData = mongoose.model('FitnessData', FitnessDataSchema);
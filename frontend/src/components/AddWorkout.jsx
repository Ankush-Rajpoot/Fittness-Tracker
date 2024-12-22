import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from './ui/button';
import { addWorkout } from '../auth.js';

const bodyParts = {
  Chest: [
    'Bench Press',
    'Incline Bench Press',
    'Decline Bench Press',
    'Chest Fly',
    'Cable Crossovers',
    'Push Up',
    'Dumbbell Pullover',
    'Pec Deck Machine',
    'Chest Dips',
    'Smith Machine Bench Press'
  ],
  Back: [
    'Pull Up',
    'Chin Up',
    'Deadlift',
    'Barbell Row',
    'Dumbbell Row',
    'Lat Pulldown',
    'Seated Cable Row',
    'T-Bar Row',
    'Face Pulls',
    'Single-Arm Dumbbell Row',
    'Inverted Row'
  ],
  Shoulders: [
    'Shoulder Press',
    'Overhead Press',
    'Arnold Press',
    'Lateral Raise',
    'Front Raise',
    'Reverse Fly',
    'Face Pulls',
    'Upright Row',
    'Dumbbell Shoulder Press',
    'Cable Lateral Raise'
  ],
  Traps: [
    'Shrugs',
    'Barbell Shrugs',
    'Farmer’s Carry',
    'Face Pulls',
    'High Pull',
    'Rack Pulls',
    'Dumbbell Shrugs',
    'Smith Machine Shrugs'
  ],
  RearDelts: [
    'Reverse Fly',
    'Face Pulls',
    'Rear Delt Row',
    'Dumbbell Rear Delt Fly',
    'Cable Rear Delt Fly',
    'Bent-Over Reverse Fly',
    'Rear Delt Machine Fly'
  ],
  Biceps: [
    'Bicep Curl',
    'Hammer Curl',
    'Concentration Curl',
    'Preacher Curl',
    'Incline Dumbbell Curl',
    'Cable Curl',
    'Spider Curl',
    'Reverse Curl',
    'EZ-Bar Curl',
    'Zottman Curl'
  ],
  Triceps: [
    'Tricep Extension',
    'Overhead Tricep Extension',
    'Skull Crushers',
    'Close-Grip Bench Press',
    'Dumbbell Kickbacks',
    'Cable Pushdowns',
    'Dips',
    'Reverse Tricep Pushdown',
    'Tricep Dips',
    'Rope Pushdowns'
  ],
  Legs: [
    'Squat',
    'Front Squat',
    'Leg Press',
    'Lunge',
    'Deadlift',
    'Romanian Deadlift',
    'Bulgarian Split Squat',
    'Hamstring Curl',
    'Calf Raise',
    'Step-Ups',
    'Leg Extension',
    'Goblet Squat'
  ],
  Glutes: [
    'Hip Thrust',
    'Glute Bridge',
    'Cable Kickbacks',
    'Sumo Deadlift',
    'Donkey Kicks',
    'Step-Ups',
    'Single-Leg Glute Bridge',
    'Fire Hydrants'
  ],
  Core: [
    'Plank',
    'Side Plank',
    'Russian Twist',
    'Leg Raise',
    'Bicycle Crunch',
    'Mountain Climbers',
    'Ab Rollout',
    'Hanging Knee Raise',
    'Sit-Up',
    'V-Up'
  ],
  Forearms: [
    'Wrist Curls',
    'Reverse Wrist Curls',
    'Farmer’s Carry',
    'Dead Hang',
    'Plate Pinch',
    'Reverse Curl',
    'Towel Pull-Up',
    'Finger Curls'
  ],
  Neck: [
    'Neck Flexion',
    'Neck Extension',
    'Lateral Neck Flexion',
    'Shrugs',
    'Neck Bridge',
    'Neck Harness'
  ]
};


const AddWorkout = ({ onClose }) => {
  const [selectedBodyPart, setSelectedBodyPart] = useState('');
  const [selectedWorkout, setSelectedWorkout] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [duration, setDuration] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const workoutString = `#${selectedBodyPart}\n${selectedWorkout}; ${sets} sets ${reps} reps; ${weight} kg; ${duration} min`;
    try {
      const result = await addWorkout(workoutString); 
      if (result) {
        onClose(); 
      }
    } catch (error) {
      console.error('Error adding workout:', error);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gradient-to-b from-black to-gray-900 rounded-xl p-6 w-full max-w-lg mx-4"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Add New Workout</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Body Part
              </label>
              <select
                value={selectedBodyPart}
                onChange={(e) => {
                  setSelectedBodyPart(e.target.value);
                  setSelectedWorkout('');
                }}
                className="w-full px-3 py-2 bg-black-300 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
              >
                <option value="" disabled>Select Body Part</option>
                {Object.keys(bodyParts).map((bodyPart) => (
                  <option key={bodyPart} value={bodyPart}>
                    {bodyPart}
                  </option>
                ))}
              </select>
            </div>
            {selectedBodyPart && (
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Workout Name
                </label>
                <select
                  value={selectedWorkout}
                  onChange={(e) => setSelectedWorkout(e.target.value)}
                  className="w-full px-3 py-2 bg-black-300 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
                >
                  <option value="" disabled>Select Workout</option>
                  {bodyParts[selectedBodyPart].map((workout) => (
                    <option key={workout} value={workout}>
                      {workout}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Sets
              </label>
              <input
                type="number"
                value={sets}
                onChange={(e) => setSets(e.target.value)}
                className="w-full px-3 py-2 bg-black-300 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="e.g., 3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Reps
              </label>
              <input
                type="number"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                className="w-full px-3 py-2 bg-black-300 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="e.g., 10"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Weight (kg)
              </label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full px-3 py-2 bg-black-300 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="e.g., 80"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Duration (min)
              </label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-3 py-2 bg-black-300 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="e.g., 15"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
                className="bg-white hover:bg-black hover:text-white text-black"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-purple-600 hover:bg-black"
              >
                Add Workout
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddWorkout;

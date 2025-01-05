import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Dumbbell } from 'lucide-react';
import { Button } from './ui/button';
import { addWorkout } from '../auth.js';
import Typewriter from './Typewriter'; // Correct import
import addWorkoutVideo from "../assets/addWorkoutVideo.mp4"
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

const motivationalQuotes = [
  "Push yourself, because no one else is going to do it for you.",
  "Success starts with self-discipline.",
  "The body achieves what the mind believes.",
  "Train insane or remain the same.",
  "No pain, no gain. Shut up and train."
];

const inputClasses = "w-full px-4 py-3 bg-gray-900 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all duration-200 hover:bg-black";
const labelClasses = "block text-sm font-medium text-gray-300 mb-2";

const AddWorkout = ({ onClose }) => {
  const [selectedBodyPart, setSelectedBodyPart] = useState('');
  const [selectedWorkout, setSelectedWorkout] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [duration, setDuration] = useState('');
  const [displayedQuote, setDisplayedQuote] = useState('');

  useEffect(() => {
    const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    setDisplayedQuote(randomQuote);
  }, [onClose]);

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
    <div className="min-h-screen flex items-center justify-center">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-gradient-to-br from-gray-950 to-black rounded-2xl p-8 w-full max-w-5xl mx-4 flex flex-col md:flex-row gap-8 shadow-2xl border border-gray-800"
          >
            {/* Form Section */}
            <div className="w-full md:w-1/2">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Dumbbell className="h-6 w-6 text-purple-500" />
                  Add New Workout
                </h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white hover:bg-gray-800 p-2 rounded-full transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className={labelClasses}>Body Part</label>
                  <select
                    value={selectedBodyPart}
                    onChange={(e) => {
                      setSelectedBodyPart(e.target.value);
                      setSelectedWorkout('');
                    }}
                    className={inputClasses}
                  >
                    <option value="" disabled>Select Body Part</option>
                    {Object.keys(bodyParts).map((bodyPart) => (
                      <option key={bodyPart} value={bodyPart}>{bodyPart}</option>
                    ))}
                  </select>
                </div>

                {selectedBodyPart && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <label className={labelClasses}>Workout Name</label>
                    <select
                      value={selectedWorkout}
                      onChange={(e) => setSelectedWorkout(e.target.value)}
                      className={inputClasses}
                    >
                      <option value="" disabled>Select Workout</option>
                      {bodyParts[selectedBodyPart].map((workout) => (
                        <option key={workout} value={workout}>{workout}</option>
                      ))}
                    </select>
                  </motion.div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClasses}>Sets</label>
                    <input
                      type="number"
                      value={sets}
                      onChange={(e) => setSets(e.target.value)}
                      className={inputClasses}
                      placeholder="e.g., 3"
                      min="1"
                    />
                  </div>
                  <div>
                    <label className={labelClasses}>Reps</label>
                    <input
                      type="number"
                      value={reps}
                      onChange={(e) => setReps(e.target.value)}
                      className={inputClasses}
                      placeholder="e.g., 10"
                      min="1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClasses}>Weight (kg)</label>
                    <input
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className={inputClasses}
                      placeholder="e.g., 80"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className={labelClasses}>Duration (min)</label>
                    <input
                      type="number"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className={inputClasses}
                      placeholder="e.g., 15"
                      min="1"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4 mt-8">
                  <Button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2.5 bg-gray-800 text-white hover:bg-gray-700 transition-colors rounded-lg"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="px-6 py-2.5 bg-purple-600 text-white hover:bg-purple-700 transition-colors rounded-lg"
                  >
                    Add Workout
                  </Button>
                </div>
              </form>
            </div>

            {/* Video and Typewriter Section */}
            <div className="w-full md:w-1/2 flex-col hidden md:flex">
              <div className="w-full mb-6 rounded-xl overflow-hidden shadow-2xl border border-gray-800">
                <video
                  src={addWorkoutVideo}
                  autoPlay 
                  loop 
                  muted 
                  className="w-full h-64 object-cover"
                />
              </div>
              <div className="text-center p-6 bg-gray-900 rounded-xl border border-gray-800">
                <div className="text-xl font-semibold text-white">
                  <Typewriter
                    texts={[displayedQuote]}
                    period={2000}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AddWorkout;

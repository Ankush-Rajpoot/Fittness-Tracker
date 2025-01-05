import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Dumbbell, 
  Shield, 
  Heart, 
  Footprints, 
  Shirt,
  Activity,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { getExercisesByBodyPart, getUserDashboard } from '../auth.js';

// Utility Functions
const iconMap = {
  Arms: Dumbbell,
  Legs: Footprints,
  Core: Activity,
  Chest: Shirt,
  Back: Shield,
  Cardio: Heart,
};

const getIconForBodyPart = (bodyPart) => {
  return iconMap[bodyPart] || Dumbbell;
};

const calculateTotals = (stats) => {
  return {
    totalCalories: stats.reduce((sum, stat) => sum + stat.totalCaloriesBurnt, 0),
    totalWorkouts: stats.reduce((sum, stat) => sum + stat.totalWorkouts, 0),
    totalActiveMinutes: stats.reduce((sum, stat) => sum + (stat.totalActiveMinutes || 0), 0),
    avgCaloriesBurntPerWorkout: stats.reduce((sum, stat) => sum + stat.totalCaloriesBurnt, 0) / stats.reduce((sum, stat) => sum + stat.totalWorkouts, 0) || 0,
  };
};

const sumExercises = (exercises) => {
  const exerciseMap = {};

  exercises.forEach((exercise) => {
    if (exerciseMap[exercise.name]) {
      exerciseMap[exercise.name].caloriesBurned += exercise.caloriesBurned;
      exerciseMap[exercise.name].sets += exercise.sets;
      exerciseMap[exercise.name].reps += exercise.reps;
      exerciseMap[exercise.name].count += 1;
    } else {
      exerciseMap[exercise.name] = { ...exercise, count: 1 };
    }
  });

  return Object.values(exerciseMap);
};

const BodyStat = () => {
  const [bodyPartStats, setBodyPartStats] = useState([]);
  const [selectedBodyPart, setSelectedBodyPart] = useState(null);
  const [exercises, setExercises] = useState([]);
  // const [totalActiveDays, setTotalActiveDays] = useState(0);
  const [totalActiveMinutes, setTotalActiveMinutes] = useState(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await getUserDashboard();
        setBodyPartStats(data.bodyPartStats);
        // setTotalActiveDays(data.totalActiveDays);
        setTotalActiveMinutes(data.totalActiveMinutes);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  const { totalCalories, totalWorkouts, avgCaloriesBurntPerWorkout } = calculateTotals(bodyPartStats);

  useEffect(() => {
    const loadExercises = async () => {
      if (selectedBodyPart) {
        const { data } = await getExercisesByBodyPart(selectedBodyPart);
        setExercises(sumExercises(data));
      } else {
        setExercises([]);
      }
    };

    loadExercises();
  }, [selectedBodyPart]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      {/* Main Stats Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-black backdrop-blur-sm rounded-2xl p-6"
      >
        {/* Summary Stats */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-b from-black to-gray-800 rounded-xl p-4">
            <p className="text-gray-300">Total Calories Burnt</p>
            <p className="text-3xl font-bold text-purple-600">{totalCalories}</p>
          </div>
          <div className="bg-gradient-to-b from-black to-gray-800 rounded-xl p-4">
            <p className="text-gray-300">Total Workouts</p>
            <p className="text-3xl font-bold text-purple-600">{totalWorkouts}</p>
          </div>
          <div className="bg-gradient-to-b from-black to-gray-800 rounded-xl p-4">
            <p className="text-gray-300">Total Active Minutes</p>
            <p className="text-3xl font-bold text-purple-600">{totalActiveMinutes}</p>
          </div>
          <div className="bg-gradient-to-b from-black to-gray-800 rounded-xl p-4">
            <p className="text-gray-300">Avg Calories per Workout</p>
            <p className="text-3xl font-bold text-purple-600">{avgCaloriesBurntPerWorkout.toFixed(2)}</p>
          </div>
         
        </div>

        {/* Body Part Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bodyPartStats.map((stat, index) => {
            const Icon = getIconForBodyPart(stat.bodyPart);
            const isSelected = selectedBodyPart === stat.bodyPart;

            return (
              <motion.div
                key={stat.bodyPart}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative bg-gray-800/30 rounded-xl p-4 group hover:bg-gradient-to-b from-black to-gray-950 transition-all"
              >
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setSelectedBodyPart(isSelected ? null : stat.bodyPart)}
                >
                  <div className="flex items-center space-x-4">
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse",
                      }}
                      className={`p-3 rounded-full bg-gray-900/50 ${stat.color} group-hover:bg-gray-900`}
                    >
                      <Icon className="h-6 w-6" />
                    </motion.div>
                    <div>
                      <h3 className="text-xl font-semibold text-white group-hover:text-purple-400 transition-colors">
                        {stat.bodyPart}
                      </h3>
                      <div className="flex items-center space-x-4 mt-1">
                        <p className="text-gray-400">
                          <span className="font-bold text-purple-500">{stat.totalWorkouts}</span> workouts
                        </p>
                        <p className="text-gray-400">
                          <span className="font-bold text-orange-500">{stat.totalCaloriesBurnt}</span> kcal
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 w-full md:w-48">
                    <div className="flex-1 h-2 bg-gray-900/50 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(stat.totalWorkouts / totalWorkouts) * 100}%` }}
                        transition={{ duration: 1, delay: index * 0.2 }}
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                      />
                    </div>
                    {isSelected ? (
                      <ChevronUp className="w-5 h-5 text-purple-400 transition-colors" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400 transition-colors" />
                    )}
                  </div>
                </div>

                <AnimatePresence>
                  {isSelected && exercises.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="absolute bg-black border border-gray-800 p-4 mt-2 w-full z-10 rounded-lg shadow-xl"
                    >
                      <h4 className="text-lg font-semibold text-purple-400 mb-3">Exercises</h4>
                      <div className="grid gap-3 max-h-[200px] overflow-y-auto">
                        {exercises.map((exercise, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-gray-900/50 rounded-lg p-3 hover:bg-gray-900/70 transition-colors"
                          >
                            <p className="font-semibold text-white mb-1">{exercise.name} (x{exercise.count})</p>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <p className="text-gray-400">
                                Calories: <span className="text-orange-500 font-medium">{exercise.caloriesBurned} kcal</span>
                              </p>
                              <p className="text-gray-400">
                                Sets: <span className="text-purple-500 font-medium">{exercise.sets}</span> × Reps: <span className="text-purple-500 font-medium">{exercise.reps}</span>
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BodyStat;



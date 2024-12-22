import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Dumbbell, 
  Shield, 
  Heart, 
  Footprints, 
  Shirt,
  Activity
} from 'lucide-react';
import Exercise from './Exercise.jsx';
import { getExercisesByBodyPart } from '../auth.js';

const BodyStat = ({ bodyPartStats }) => {
  const [selectedBodyPart, setSelectedBodyPart] = useState(null);
  const [exercises, setExercises] = useState([]);

  const totalCalories = bodyPartStats.reduce((sum, stat) => sum + stat.totalCaloriesBurnt, 0);
  const totalWorkouts = bodyPartStats.reduce((sum, stat) => sum + stat.totalWorkouts, 0);

  const iconMap = {
    Arms: Dumbbell,
    Legs: Footprints,
    Core: Activity,
    Chest: Shirt,
    Back: Shield,
    Cardio: Heart,
  };

  const handleBodyPartClick = async (bodyPart) => {
    if (selectedBodyPart === bodyPart) {
      setSelectedBodyPart(null);
      setExercises([]);
    } else {
      setSelectedBodyPart(bodyPart);
      const data = await getExercisesByBodyPart(bodyPart);
      setExercises(data.data);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="max-w-4xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-center space-x-3 mb-8">
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
        </motion.div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
          Workout Statistics
        </h1>
      </div>

      {/* Main Stats Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-black backdrop-blur-sm rounded-2xl p-6 border border-gray-800"
      >
        {/* Summary Stats */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-800/50 rounded-xl p-4">
            <p className="text-gray-400">Total Calories Burnt</p>
            <p className="text-3xl font-bold text-orange-500">{totalCalories}</p>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-4">
            <p className="text-gray-400">Total Workouts</p>
            <p className="text-3xl font-bold text-purple-500">{totalWorkouts}</p>
          </div>
        </div>

        {/* Body Part Stats */}
        <div className="space-y-4">
          {bodyPartStats.map((stat, index) => {
            const Icon = iconMap[stat.bodyPart] || Dumbbell;
            return (
              <motion.div
                key={stat.bodyPart}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800/30 rounded-xl p-4 flex items-center justify-between group hover:bg-gray-800/50 transition-all relative cursor-pointer"
                onClick={() => handleBodyPartClick(stat.bodyPart)}
              >
                <div className="flex items-center space-x-4">
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse"
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
                
                <div className="w-32 md:w-48">
                  <div className="h-2 bg-gray-900/50 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(stat.totalWorkouts / totalWorkouts) * 100}%` }}
                      transition={{ duration: 1, delay: index * 0.2 }}
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                    />
                  </div>
                </div>

                {selectedBodyPart === stat.bodyPart && exercises.length > 0 && (
                  <Exercise exercises={exercises} />
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BodyStat;



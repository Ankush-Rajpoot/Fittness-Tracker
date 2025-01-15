import { motion } from 'framer-motion';
import { Calendar, Dumbbell, Clock, Flame } from 'lucide-react';

const container = {
  hidden: { opacity: 0, y: -10 },
  show: { opacity: 1, y: 0 },
};

const item = {
  hidden: { opacity: 0, y: -10 },
  show: { opacity: 1, y: 0 },
};

const DayExercise = ({ exercises, position }) => {
  const workoutDate = exercises.length > 0 ? new Date(exercises[0].date).toLocaleDateString() : "Invalid Date";

  return (
    <motion.div
      className="absolute bg-black/80 p-4 md:p-6 rounded-xl shadow-2xl overflow-y-auto border border-gray-700 
                 max-w-[90%] md:max-w-md lg:max-w-lg 
                 w-full md:w-auto max-h-screen md:max-h-[32rem]"
      style={{
        top: position.top || '50%',
        left: position.left || '50%',
        transform: `translate(-50%, -50%)`,
      }}
      initial="hidden"
      animate="show"
      exit="hidden"
      variants={container}
    >
      {/* Header Section */}
      <div className="flex items-center gap-2 mb-4 md:mb-6">
        <Calendar className="w-5 h-5 md:w-6 md:h-6 text-purple-500" />
        <h4 className="text-lg md:text-xl font-bold text-white truncate">
          {workoutDate}
        </h4>
      </div>

      {/* Exercises List */}
      <div className="space-y-3 md:space-y-4">
        {exercises.map((ex, index) => (
          <motion.div
            key={index}
            variants={item}
            className="bg-gray-800/50 p-3 md:p-4 rounded-lg border border-gray-700/50 
                       hover:border-purple-500/50 transition-all duration-300"
          >
            {/* Exercise Title and Intensity */}
            <div className="flex justify-between items-start mb-2 md:mb-3">
              <h5 className="text-sm md:text-lg font-semibold text-purple-400 truncate">
                {ex.workoutName}
              </h5>
              <span
                className={`px-2 py-1 rounded text-xs font-medium truncate ${
                  ex.intensity === 'High'
                    ? 'bg-red-500/20 text-red-400'
                    : ex.intensity === 'Medium'
                    ? 'bg-yellow-500/20 text-yellow-400'
                    : 'bg-green-500/20 text-green-400'
                }`}
              >
                {ex.intensity}
              </span>
            </div>

            {/* Exercise Details */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
              <div className="flex items-center gap-1.5 md:gap-2">
                <Dumbbell className="w-4 h-4 text-gray-400" />
                <span className="text-xs md:text-sm text-gray-300 truncate">
                  {ex.sets} × {ex.reps} reps
                </span>
              </div>
              <div className="flex items-center gap-1.5 md:gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-xs md:text-sm text-gray-300 truncate">
                  {ex.duration} min
                </span>
              </div>
              <div className="flex items-center gap-1.5 md:gap-2 col-span-2 md:col-span-3">
                <Flame className="w-4 h-4 text-orange-500" />
                <span className="text-xs md:text-sm text-gray-300 truncate">
                  {ex.caloriesBurned} kcal burned
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default DayExercise;

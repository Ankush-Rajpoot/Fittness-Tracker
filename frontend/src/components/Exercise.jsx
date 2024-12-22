import { motion } from 'framer-motion';

const Exercise = ({ exercises }) => {
  return (
    <div className="absolute top-0 left-full ml-4 bg-gray-900 p-4 rounded-lg shadow-lg z-10">
      <h4 className="text-lg font-semibold text-white mb-2">Exercises</h4>
      <ul className="space-y-2">
        {exercises.map((exercise, idx) => (
          <li key={idx} className="text-gray-400">
            <p className="font-bold text-white">{exercise.name}</p>
            <p>Calories Burned: {exercise.caloriesBurned} kcal</p>
            <p>Sets: {exercise.sets}, Reps: {exercise.reps}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Exercise;

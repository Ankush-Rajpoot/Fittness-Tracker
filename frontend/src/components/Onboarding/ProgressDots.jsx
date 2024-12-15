import { motion } from 'framer-motion';

export const ProgressDots = ({ totalScreens, currentScreen }) => (
  <div className="flex justify-center space-x-2 mb-8">
    {[...Array(totalScreens)].map((_, index) => (
      <motion.div
        key={index}
        className={`h-2 rounded-full ${
          index === currentScreen ? 'w-8 bg-purple-600' : 'w-2 bg-gray-600'
        }`}
        animate={{ opacity: index === currentScreen ? 1 : 0.5 }}
      />
    ))}
  </div>
);

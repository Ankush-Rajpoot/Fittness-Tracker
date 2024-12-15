import { motion, AnimatePresence } from 'framer-motion';

export const ScreenContent = ({ screens, currentScreen }) => (
  <AnimatePresence mode="wait">
    <motion.div
      key={currentScreen}
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3 }}
      className="text-center"
    >
      <h1 className="text-3xl font-bold mb-2 gradient-text">
        {screens[currentScreen].title}
      </h1>
      <p className="text-gray-400 mb-8">
        {screens[currentScreen].subtitle}
      </p>

      {screens.map((Screen, index) => (
        currentScreen === index && <Screen.component key={index} />
      ))}
    </motion.div>
  </AnimatePresence>
);

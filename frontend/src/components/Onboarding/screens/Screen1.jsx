import { motion } from 'framer-motion';
import { Dumbbell } from 'lucide-react';

const Screen1 = () => (
  <div className="relative h-64 mb-8">
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      animate={{
        scale: [1, 1.2, 1],
        rotate: [0, 360],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        repeatType: "reverse",
      }}
    >
      <Dumbbell className="w-24 h-24 text-purple-600" />
    </motion.div>
    
    <motion.div
      className="absolute inset-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="w-32 h-32 rounded-full bg-purple-500/10 animate-pulse" />
      </div>
    </motion.div>
  </div>
)

export default Screen1;

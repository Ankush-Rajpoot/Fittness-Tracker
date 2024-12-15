import { motion } from 'framer-motion';
import { Trophy, Star } from 'lucide-react';

const Screen3 = () => (
  <div className="relative h-64 mb-8">
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
    >
      <div className="relative">
        <Trophy className="w-24 h-24 text-purple-600" />
        
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              top: -20 + i * 20,
              left: 40 - i * 40,
            }}
            animate={{
              y: [-10, 10],
              rotate: [-10, 10],
            }}
            transition={{
              duration: 2,
              delay: i * 0.2,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            <Star className="w-6 h-6 text-yellow-500 " fill="currentColor" />
          </motion.div>
        ))}
      </div>
    </motion.div>
  </div>
)

export default Screen3;

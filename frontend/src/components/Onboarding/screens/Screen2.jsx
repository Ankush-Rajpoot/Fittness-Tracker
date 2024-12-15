import { motion } from 'framer-motion';
import { LineChart, TrendingUp } from 'lucide-react';

const Screen2 = () => (
  <div className="relative h-64 mb-8">
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="relative">
        <LineChart className="w-24 h-24 text-purple-600" />
        <motion.div
          className="absolute top-1/2 right-0"
          animate={{
            y: [-10, 10],
            x: [0, 10],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          <TrendingUp className="w-8 h-8 text-green-500" />
        </motion.div>
      </div>
    </motion.div>
  </div>
)

export default Screen2;

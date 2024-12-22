import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, Legend, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

import { Flame, Dumbbell, Timer, Loader2 } from 'lucide-react';
import { getUserDashboard, getWorkoutsByDate } from '../auth.js'; 
import BodyStat from './BodyStat';

const Dashboard = ({ refresh, setRefresh }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pieChartData, setPieChartData] = useState([]);

  const fetchDashboardData = async () => {
    try {
      const data = await getUserDashboard();
      setDashboardData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const fetchWorkoutsByDate = async (date) => {
    try {
      const data = await getWorkoutsByDate(date);
      setPieChartData(data.pieChartData);
    } catch (error) {
      console.error('Error fetching workouts by date:', error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    fetchWorkoutsByDate(new Date());
  }, []);

  useEffect(() => {
    if (refresh) {
      fetchDashboardData();
      fetchWorkoutsByDate(new Date());
      setRefresh(false);
    }
  }, [refresh, setRefresh]);

  if (loading) {
     return <Loader2 className="animate-spin" />;
  }

  const {
    totalCaloriesBurnt,
    totalWorkouts,
    avgCaloriesBurntPerWorkout,
    totalActiveMinutes,
    totalWeeksCaloriesBurnt,
    bodyPartStats,
  } = dashboardData;

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#845EC2', '#FF6F91', '#FFC75F'];

  const weeklyData = totalWeeksCaloriesBurnt.caloriesBurned.map((calories, index) => ({
    name: totalWeeksCaloriesBurnt.weeks[index],
    calories: calories,
  }));

  const stats = [
    {
      icon: <Flame className="h-6 w-6 text-orange-500" />,
      label: 'Calories Burned',
      value: totalCaloriesBurnt,
      change: '+12.5%',
      color: 'text-orange-500',
    },
    {
      icon: <Dumbbell className="h-6 w-6 text-purple-500" />,
      label: 'Workouts',
      value: totalWorkouts,
      change: '+3',
      color: 'text-purple-500',
    },
    {
      icon: <Timer className="h-6 w-6 text-green-500" />,
      label: 'Active Minutes',
      value: totalActiveMinutes,
      change: '+45',
      color: 'text-green-500',
    },
    {
      icon: <Dumbbell className="h-6 w-6 text-blue-500" />,
      label: 'Avg Calories per Workout',
      value: avgCaloriesBurntPerWorkout,
      change: '+5%',
      color: 'text-blue-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.01 }}
            whileHover={{ scale: 1.05 }}
            className="bg-black rounded-xl p-6 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    ease: 'linear',
                  }}
                >
                  {stat.icon}
                </motion.div>
                <div>
                  <p className="text-gray-400">{stat.label}</p>
                  <h3 className={`text-2xl font-bold ${stat.color}`}>{stat.value}</h3>
                </div>
              </div>
              <motion.span
                className="text-green-500"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                {stat.change}
              </motion.span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Weekly Progress Chart */}
      <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6"
        >
          {/* Weekly Progress Chart */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-black rounded-xl p-4 md:p-6"
          >
            <h2 className="text-xl text-gray-400 font-bold mb-4">Weekly Progress</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: '#888888' }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fill: '#888888' }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'black',
                      border: 'solid 1px',
                      borderRadius: '18px',
                      padding: '8px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="calories"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    dot={{ fill: '#8b5cf6', r: 4 }}
                    activeDot={{ r: 6, fill: '#a78bfa' }}
                    isAnimationActive={true}
                    animationBegin={0}
                    animationDuration={3000}
                    animationEasing="ease-in-out"
                    animationId="line-chart"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Pie Chart */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-black rounded-xl p-4 md:p-6"
          >
            <h2 className="text-xl text-gray-400 font-bold mb-4">Calories by Workout Category</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    dataKey="value"
                    nameKey="label"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    label={({ label, value }) => `${label}: ${value}`}
                    isAnimationActive={true}
                    animationBegin={0}
                    animationDuration={3000}
                    animationEasing="ease-in-out"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    wrapperStyle={{
                      color: 'white',
                      fontSize: '12px',
                      marginTop: '10px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </motion.div>

      {/* Body Part Stats */}
      <BodyStat bodyPartStats={bodyPartStats} />
    </div>
  );
};

export default Dashboard;

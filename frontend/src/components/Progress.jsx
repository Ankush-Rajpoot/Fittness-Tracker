import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  CartesianGrid,
  Legend,
} from 'recharts';
import { Calendar, Dumbbell, Hash, Repeat, TrendingUp, Loader2, AlertCircle, ClipboardList, ChevronDown, ChevronUp } from 'lucide-react';
import { calculateProgress, getCurrentUser } from "../auth"; 



const DetailedChart = ({ data, bodyPart }) => (
  <motion.div
    initial={{ opacity: 0, height: 0 }}
    animate={{ opacity: 1, height: 'auto' }}
    exit={{ opacity: 0, height: 0 }}
    transition={{ duration: 0.3 }}
    className="mt-6 bg-gradient-to-b from-gray-900 to-black rounded-xl p-6"
  >
    <h4 className="text-lg font-semibold text-white mb-4">{bodyPart} Progress Timeline</h4>
    <div className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis
            dataKey="date"
            tick={{ fill: '#888888' }}
            tickFormatter={(value) => new Date(value).toLocaleDateString()}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fill: '#888888' }}
            tickLine={false}
            axisLine={false}
            label={{ value: 'Weight (kg)', angle: -90, position: 'insideLeft', fill: '#888888' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1a1a1a",
              border: "1px solid #444",
              borderRadius: "8px",
              padding: "8px",
            }}
            formatter={(value) => [`${value} kg`, 'Weight']}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="weight"
            name="Weight"
            stroke="#8b5cf6"
            strokeWidth={2}
            dot={{ fill: '#8b5cf6', r: 4 }}
            activeDot={{ r: 6, fill: '#a78bfa' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </motion.div>
);

const StatItem = ({ icon: Icon, label, value, className = "" }) => (
  <div className="flex items-center space-x-2 text-gray-400">
    <Icon className="w-4 h-4" />
    <span className="font-semibold">{label}:</span>
    <span className={className}>{value}</span>
  </div>
);

const ProgressCard = ({ record, index, onToggleDetails, isExpanded }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    className="bg-black backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-800"
  >
    <div 
      className="flex justify-between items-start cursor-pointer"
      onClick={() => onToggleDetails(record.bodyPart)}
    >
      <h4 className="text-xl font-bold text-white mb-4">{record.bodyPart}</h4>
      {isExpanded ? (
        <ChevronUp className="w-5 h-5 text-gray-400" />
      ) : (
        <ChevronDown className="w-5 h-5 text-gray-400" />
      )}
    </div>
    <div className="space-y-3">
      <StatItem
        icon={Calendar}
        label="Latest"
        value={new Date(record.latestDate).toLocaleDateString()}
      />
      <StatItem
        icon={Dumbbell}
        label="Weight"
        value={`${record.totalWeight} kg`}
      />
      <StatItem
        icon={Hash}
        label="Sets"
        value={record.totalSets}
      />
      <StatItem
        icon={Repeat}
        label="Reps"
        value={record.totalReps}
      />
      <StatItem
        icon={TrendingUp}
        label="Improvement"
        value={`${record.improvementPercentage}%`}
        className={parseFloat(record.improvementPercentage) >= 0 ? "text-green-400" : "text-red-400"}
      />
    </div>
    <AnimatePresence>
      {isExpanded && (
        <DetailedChart data={record.entries} bodyPart={record.bodyPart} />
      )}
    </AnimatePresence>
  </motion.div>
);

const Progress = () => {
  const [userId, setUserId] = useState(null);
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCard, setExpandedCard] = useState(null);

  useEffect(() => {
        const fetchUser = async () => {
          try {
            const user = await getCurrentUser();
            console.log("User:", user);
            setUserId(user.data._id); 
            console.log("User ID:", userId);
          } catch (err) {
            console.error("Error fetching user:", err);
            setError("Unable to fetch user data.");
          }
        };
    
        fetchUser();
      }, []);

      useEffect(() => {
        const fetchProgress = async () => {
          try {
            if (!userId) throw new Error("User ID is not available.");
            const response = await calculateProgress(userId);
            setProgressData(response);
          } catch (err) {
            console.error("Error fetching progress:", err);
            setError("Failed to load progress data");
          } finally {
            setLoading(false);
          }
        };
      
        if (userId) fetchProgress();
      }, [userId]);
      

  const handleToggleDetails = (bodyPart) => {
    setExpandedCard(expandedCard === bodyPart ? null : bodyPart);
  };

  if (loading) return <Loader2 className="animate-spin" />;
  if (error) return <AlertCircle className="text-red-400" />;
  if (!progressData?.length) return <ClipboardList />;

  const chartData = progressData.map(record => ({
    bodyPart: record.bodyPart,
    improvementPercentage: parseFloat(record.improvementPercentage),
  }));

  return (
    <div className="space-y-8 p-6">
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-b from-gray-900 to-black backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-800"
      >
        <h3 className="text-xl font-bold text-white mb-4">Overall Progress</h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
              <PolarGrid stroke="#333" />
              <PolarAngleAxis 
                dataKey="bodyPart" 
                stroke="white" 
                fontSize={12}
                tickLine={false}
                tick={{ fill: '#fff' }}
              />
              <PolarRadiusAxis 
                stroke="white" 
                fontSize={10}
                tickFormatter={(value) => `${value}%`}
                tickLine={false}
                tick={{ fill: '#fff' }}
              />
              <Radar
                name="Improvement"
                dataKey="improvementPercentage"
                stroke="#FF6F91"
                fill="#FF6F91"
                fillOpacity={0.5}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #444",
                  borderRadius: "8px",
                  padding: "8px",
                }}
                formatter={(value) => [`${value}%`, "Improvement"]}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
      <div className="grid grid-cols-1 gap-6">
        {progressData.map((record, index) => (
          <ProgressCard
            key={record.bodyPart}
            record={record}
            index={index}
            onToggleDetails={handleToggleDetails}
            isExpanded={expandedCard === record.bodyPart}
          />
        ))}
      </div>
    </div>
  );
};

export default Progress;

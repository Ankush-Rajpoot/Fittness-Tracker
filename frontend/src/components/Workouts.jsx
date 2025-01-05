import { useState, useEffect, useRef } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addDays, subDays } from 'date-fns';
import { getWorkoutsByDate } from '../auth.js'; 
import gsap from 'gsap';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, Sector } from 'recharts';
import { Skeleton } from "@/components/ui/skeleton";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#845EC2', '#FF6F91', '#FFC75F'];

const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.label}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#fff">{`Calories ${value}`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
        {`(Rate ${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

const Workouts = ({ refresh, setRefresh }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [workouts, setWorkouts] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const cardsRef = useRef([]); 

  useEffect(() => {
    const fetchWorkouts = async () => {
      setLoading(true);
      try {
        const data = await getWorkoutsByDate(format(selectedDate, 'yyyy-MM-dd'));
        setWorkouts(data.todaysWorkouts || []);
        setPieChartData(data.pieChartData || []);
      } catch (error) {
        console.error('Error fetching workouts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, [selectedDate, refresh]);

  useEffect(() => {
    if (refresh) {
      setRefresh(false);
    }
  }, [refresh, setRefresh]);

  const handleMouseEnterCard = (index) => {
    gsap.to(cardsRef.current[index], {
      scale: 1.05,
      duration: 0.12,
      ease: 'power1.out',
    });
  };

  const handleMouseLeaveCard = (index) => {
    gsap.to(cardsRef.current[index], {
      scale: 1,
      duration: 0.3,
      ease: 'power1.out',
    });
  };

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  if (loading) {
    return (
      <div className="space-y-6 px-4 lg:px-16">
        {/* Date Navigation Skeleton */}
        <div className="flex items-center justify-between bg-black rounded-xl p-4 shadow-md">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <Skeleton className="h-6 w-48 rounded-lg" />
          <Skeleton className="h-10 w-10 rounded-lg" />
        </div>

        {/* Workouts List Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-40 bg-gray-800 rounded-xl" />
          ))}
        </div>

        {/* Pie Chart Skeleton */}
        <Skeleton className="h-[300px] bg-gray-800 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4 lg:px-16">
      {/* Date Navigation */}
      <div className="flex items-center justify-between bg-black rounded-xl p-4 shadow-md">
        <button
          onClick={() => setSelectedDate(subDays(selectedDate, 1))}
          className="p-2 hover:bg-gray-800 rounded-lg transition-transform transform hover:scale-110"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-purple-500" />
          <span className="text-lg font-medium">
            {format(selectedDate, 'MMMM d, yyyy')}
          </span>
        </div>

        <button
          onClick={() => setSelectedDate(addDays(selectedDate, 1))}
          className="p-2 hover:bg-gray-800 rounded-lg transition-transform transform hover:scale-110"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Workouts List */}
      <div>
        {workouts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workouts.map((workout, index) => (
              <div
                key={workout._id}
                ref={(el) => (cardsRef.current[index] = el)} 
                className="bg-black rounded-xl p-6 shadow-lg transition-transform transform border border-gray-800"
                onMouseEnter={() => handleMouseEnterCard(index)} 
                onMouseLeave={() => handleMouseLeaveCard(index)} 
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium">{workout.workoutName}</h3>
                    <p className="text-gray-400">{workout.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-purple-500 font-medium">
                      {workout.caloriesBurned} cal
                    </p>
                    <p className="text-sm text-gray-400">
                      {workout.duration} minutes
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">Sets</p>
                    <p className="font-medium">{workout.sets}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Reps</p>
                    <p className="font-medium">{workout.reps}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Weight</p>
                    <p className="font-medium">{workout.weight} kg</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400">
            No workouts recorded for this date
          </div>
        )}
      </div>

      {/* Pie Chart */}
      {pieChartData.length > 0 && (
        <div className="bg-black rounded-xl p-6 shadow-lg">
          <h2 className="text-xl text-gray-400 font-bold mb-4">Calories by Workout Category</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  data={pieChartData}
                  dataKey="value"
                  nameKey="label"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  onMouseEnter={onPieEnter}
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
        </div>
      )}
    </div>
  );
};

export default Workouts;

import { useState, useEffect, useRef } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addDays, subDays } from 'date-fns';
import { getWorkoutsByDate } from '../auth.js'; 
import gsap from 'gsap';

const Workouts = ({ refresh, setRefresh }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(false);

  const cardsRef = useRef([]); 

  useEffect(() => {
    const fetchWorkouts = async () => {
      setLoading(true);
      try {
        const data = await getWorkoutsByDate(format(selectedDate, 'yyyy-MM-dd'));
        setWorkouts(data.todaysWorkouts || []);
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
        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading...</div>
        ) : workouts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workouts.map((workout, index) => (
              <div
                key={workout._id}
                ref={(el) => (cardsRef.current[index] = el)} 
                className="bg-black rounded-xl p-6 shadow-lg transition-transform transform"
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
    </div>
  );
};

export default Workouts;

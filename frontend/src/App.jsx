import { useState, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Workouts from "./components/Workouts";
import Progress from "./components/Progress";
import AddWorkout from "./components/AddWorkout";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Layout from "./components/Layout";
import OnboardingScreen from "./components/Onboarding/OnboardingScreen"; // Import OnboardingScreen component
import Profile from "./components/Profile"; // Import Profile component

function App() {
  const [showAddWorkout, setShowAddWorkout] = useState(false);
  const [refreshDashboard, setRefreshDashboard] = useState(false);
  const [refreshWorkouts, setRefreshWorkouts] = useState(false);
  const [refreshProgress, setRefreshProgress] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true); // Add state for onboarding
  const location = useLocation(); // Get the current route

  // Check if the current route is login or signup
  const isAuthRoute = ["/login", "/signup"].includes(location.pathname);

  useEffect(() => {
    const hasSeenOnboarding = sessionStorage.getItem("hasSeenOnboarding");
    if (hasSeenOnboarding) {
      setShowOnboarding(false);
    }
  }, []);

  const handleOnboardingComplete = () => {
    sessionStorage.setItem("hasSeenOnboarding", "true");
    setShowOnboarding(false);
  };

  const handleWorkoutAdded = () => {
    setShowAddWorkout(false);
    setRefreshDashboard(true); // Trigger dashboard refresh
    setRefreshWorkouts(true); // Trigger workouts refresh
    setRefreshProgress(true); // Trigger progress refresh
  };

  if (showOnboarding) {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/"
          element={
            <Layout
              showAddWorkout={showAddWorkout}
              setShowAddWorkout={setShowAddWorkout}
              refreshDashboard={refreshDashboard}
              setRefreshDashboard={setRefreshDashboard}
            />
          }
        >
          <Route path="dashboard" element={<Dashboard refresh={refreshDashboard} setRefresh={setRefreshDashboard} />} />
          <Route path="workouts" element={<Workouts refresh={refreshWorkouts} setRefresh={setRefreshWorkouts} />} />
          <Route path="progress" element={<Progress refresh={refreshProgress} setRefresh={setRefreshProgress} />} />
          <Route path="profile" element={<Profile />} /> {/* Add Profile route */}
        </Route>
      </Routes>

      {showAddWorkout && <AddWorkout onClose={handleWorkoutAdded} />}
    </div>
  );
}

export default App;






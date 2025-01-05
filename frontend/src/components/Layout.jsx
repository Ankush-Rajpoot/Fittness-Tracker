import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dumbbell, Activity, PieChart, Plus, Menu, X, User } from "lucide-react";
import { useNavigate, Outlet } from "react-router-dom";
import { Button } from "./ui/button";
import Logout from "./Logout";
import Chatbot from './chatBot';

const Layout = ({ showAddWorkout, setShowAddWorkout, refreshDashboard, setRefreshDashboard }) => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-black p-4 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <motion.div
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.3 }}
            >
              <Dumbbell className="h-8 w-8 text-purple-500" />
            </motion.div>
            <h1 className="text-xl font-bold text-white">UFit</h1>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={toggleSidebar}
            className="text-white p-2"
          >
            {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </motion.button>
        </div>
      </div>

      {/* Sidebar */}
      <AnimatePresence>
        {(isSidebarOpen || !window.matchMedia("(max-width: 1024px)").matches) && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", bounce: 0.4 }}
            className={`fixed lg:relative w-64 bg-gradient-to-b from-black to-gray-950 h-screen overflow-y-auto z-40 
              ${isSidebarOpen ? "block" : "hidden lg:block"} ${
              window.innerWidth < 1024 ? 'bg-opacity-75 backdrop-blur-sm' : ''
            }`}
            style={{ opacity: window.innerWidth < 1024 ? 0.9 : 1 }} // Reduce opacity on mobile screens
          >
            <div className="p-6 pt-20 lg:pt-6">
              <div className="hidden lg:flex items-center space-x-2 mb-8">
                <motion.div
                  whileHover={{ rotate: 180 }}
                  transition={{ duration: 0.3 }}
                >
                  <Dumbbell className="h-8 w-8 text-purple-500" />
                </motion.div>
                <h1 className="text-xl font-bold text-white">UFit</h1>
              </div>

              <nav className="space-y-2">
                <NavItem
                  icon={<Activity />}
                  label="Dashboard"
                  active={activeTab === "dashboard"}
                  onClick={() => {
                    setActiveTab("dashboard");
                    if (window.innerWidth < 1024) setIsSidebarOpen(false);
                    navigate("/dashboard");
                  }}
                />
                <NavItem
                  icon={<Dumbbell />}
                  label="Workouts"
                  active={activeTab === "workouts"}
                  onClick={() => {
                    setActiveTab("workouts");
                    if (window.innerWidth < 1024) setIsSidebarOpen(false);
                    navigate("/workouts");
                  }}
                />
                <NavItem
                  icon={<PieChart />}
                  label="Progress"
                  active={activeTab === "progress"}
                  onClick={() => {
                    setActiveTab("progress");
                    if (window.innerWidth < 1024) setIsSidebarOpen(false);
                    navigate("/progress");
                  }}
                />
                <NavItem
                  icon={<User />}
                  label="Profile"
                  active={activeTab === "profile"}
                  onClick={() => {
                    setActiveTab("profile");
                    if (window.innerWidth < 1024) setIsSidebarOpen(false);
                    navigate("/profile");
                  }}
                />
                <div className="border-t border-gray-700 pt-4">
                  <Logout />
                </div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 overflow-auto pt-20 lg:pt-0">
        <div className="p-4 md:p-8">
          <header className="flex justify-end items-center mb-8">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => setShowAddWorkout(true)}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Add Workout</span>
              </Button>
            </motion.div>
          </header>

          <main>
            <Outlet />
            <Chatbot />
          </main>
        </div>
      </div>
    </div>
  );
};

const NavItem = ({ icon, label, active, onClick }) => (
  <motion.button
    whileHover={{ scale: 1.05, x: 10 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`w-full flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors ${
      active ? "bg-purple-600 text-white" : "text-gray-400 hover:bg-[#2E2E2E]"
    }`}
  >
    <motion.div
      animate={{ rotate: [0, 360] }}
      transition={{
        repeat: Infinity,
        duration: 1.5,
        ease: 'linear',
      }}
    >
      {icon}
    </motion.div>
    <span>{label}</span>
  </motion.button>
);

export default Layout;

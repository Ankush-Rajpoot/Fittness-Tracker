import { useNavigate } from "react-router-dom";
import { userStore } from "../store/APIStore.js";
import { LogOut } from "lucide-react"; // Import the LogOut icon

const Logout = () => {
  const logoutUser = userStore((state) => state.logoutUser);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser(); // Call the logout function from the store
      navigate("/login"); // Redirect to login page
    } catch (err) {
      console.error("Error during logout:", err);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full flex items-center space-x-2 px-4 py-3 rounded-lg text-gray-400 hover:bg-[#2E2E2E] hover:text-white"
    >
      <LogOut className="h-4 w-4" /> {/* Add the LogOut icon */}
      <span>Logout</span>
    </button>
  );
};

export default Logout;

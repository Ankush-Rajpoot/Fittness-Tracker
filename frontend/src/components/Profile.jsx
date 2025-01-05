import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, Weight, Ruler, Edit2, Save, Camera } from 'lucide-react';
import { getUserProfile } from '../auth.js';
import { Button } from './ui/button';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await getUserProfile();
        setProfile(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleSave = () => {
    // Here you would typically make an API call to update the profile
    setIsEditing(false);
  };

  const StatItem = ({ icon: Icon, label, value }) => (
    <div className="flex items-center space-x-3 text-gray-300">
      <Icon className="w-5 h-5 text-purple-600" />
      <span className="font-medium">{label}:</span>
      {isEditing && label !== 'Email' ? (
        <input
          type="text"
          value={value}
          onChange={(e) => 
            setProfile(prev => ({ ...prev, [label.toLowerCase()]: e.target.value }))
          }
          className="bg-gray-800 px-2 py-1 rounded"
        />
      ) : (
        <span>{value}</span>
      )}
    </div>
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-b from-gray-900 to-black rounded-xl p-6 shadow-lg"
      >
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold gradient-text">Profile</h2>
          <Button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isEditing ? (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save
              </>
            ) : (
              <>
                <Edit2 className="w-4 h-4 mr-2" />
                Edit
              </>
            )}
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Avatar Section */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <img
                src={profile.avatar || 'https://via.placeholder.com/150'}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover"
              />
              {isEditing && (
                <button className="absolute bottom-0 right-0 p-2 bg-red-600 rounded-full hover:bg-red-700 transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Profile Details */}
          <div className="flex-1 space-y-4">
            <StatItem icon={User} label="Full Name" value={profile.fullName} />
            <StatItem icon={Mail} label="Email" value={profile.email} />
            <StatItem icon={Calendar} label="Joined Date" value={new Date(profile.joinedDate).toLocaleDateString()} />
            <StatItem icon={Calendar} label="Last Login" value={new Date(profile.lastLogin).toLocaleDateString()} />
            <StatItem icon={Calendar} label="Current Streak" value={`${profile.currentStreak} days`} />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;


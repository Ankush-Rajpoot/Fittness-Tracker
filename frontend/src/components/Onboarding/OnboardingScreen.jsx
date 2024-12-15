import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProgressDots } from './ProgressDots';
import { ScreenContent } from './ScreenContent';
import { NavigationButtons } from './NavigationButtons';
import { useOnboardingScreens } from './useOnboardingScreens';

const OnboardingScreen = ({ onComplete }) => {
  const [currentScreen, setCurrentScreen] = useState(0);
  const { screens } = useOnboardingScreens();
  const navigate = useNavigate();

  useEffect(() => {
    // Show onboarding screen to every user once they visit the web app
    setCurrentScreen(0);
  }, []);

  const nextScreen = () => {
    if (currentScreen === screens.length - 1) {
      onComplete();
      navigate("/login"); // Redirect to login after onboarding
    } else {
      setCurrentScreen(prev => prev + 1);
    }
  };

  const prevScreen = () => {
    setCurrentScreen(prev => prev - 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <ProgressDots 
          totalScreens={screens.length} 
          currentScreen={currentScreen} 
        />

        <ScreenContent 
          screens={screens} 
          currentScreen={currentScreen} 
        />

        <NavigationButtons 
          currentScreen={currentScreen} 
          totalScreens={screens.length}
          onNext={nextScreen}
          onPrev={prevScreen}
        />
      </div>
    </div>
  );
};

export default OnboardingScreen;

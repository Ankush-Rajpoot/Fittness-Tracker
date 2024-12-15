import Screen1 from './screens/Screen1';
import Screen2 from './screens/Screen2';
import Screen3 from './screens/Screen3';

export const useOnboardingScreens = () => {
  const screens = [
    {
      component: Screen1,
      title: "Track Your Fitness Journey",
      subtitle: "Welcome to your personal fitness companion"
    },
    {
      component: Screen2,
      title: "Monitor Your Progress",
      subtitle: "See your improvements over time"
    },
    {
      component: Screen3,
      title: "Achieve Your Goals",
      subtitle: "Set and crush your fitness targets"
    }
  ];

  return { screens };
};

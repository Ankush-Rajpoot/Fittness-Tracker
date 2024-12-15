import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';

export const NavigationButtons = ({ currentScreen, totalScreens, onNext, onPrev }) => (
  <div className="flex justify-between mt-8">
    {currentScreen > 0 ? (
      <Button
        onClick={onPrev}
        variant="ghost"
        className="bg-purple-600 hover:bg-purple-700"
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
    ) : (
      <span className="invisible">
        <Button variant="ghost">Back</Button>
      </span>
    )}

    <Button
      onClick={onNext}
      className="bg-purple-600 hover:bg-purple-700"
    >
      {currentScreen === totalScreens - 1 ? 'Get Started' : 'Next'}
      <ChevronRight className="ml-2 h-4 w-4" />
    </Button>
  </div>
);

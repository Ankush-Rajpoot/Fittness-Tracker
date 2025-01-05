import { MessageCircle, X } from 'lucide-react';
import { Button } from '../ui/button';

const ChatbotButton = ({ isOpen, onClick }) => {
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-purple-600 hover:bg-purple-700 shadow-lg"
    >
      {isOpen ? (
        <X className="h-6 w-6" />
      ) : (
        <MessageCircle className="h-6 w-6" />
      )}
    </Button>
  );
};

export default ChatbotButton;
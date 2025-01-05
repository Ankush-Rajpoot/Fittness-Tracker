import { useState } from 'react';
import ChatbotButton from './chatBotButton';
import ChatWindow from './chatWindow';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <ChatWindow isOpen={isOpen} />
      <ChatbotButton isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
    </>
  );
};

export default Chatbot;
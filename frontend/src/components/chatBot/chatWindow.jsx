import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send } from 'lucide-react';
import ChatMessage from './chatMessage.jsx';
import { Button } from '../ui/button';
import axios from 'axios';

const ChatWindow = ({ isOpen }) => {
  const [messages, setMessages] = useState([
    { text: "Hi! I'm your fitness assistant. How can I help you today?", isUser: false }
  ]);
  const [input, setInput] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { text: input, isUser: true }]);
    const userInput = input;
    setInput('');

    try {
      const res = await axios.post("http://localhost:5000/api/v1/openai/chat", { userInput });
      const botResponse = res.data.data.response;

      // Add bot response
      setMessages(prev => [...prev, { text: botResponse, isUser: false }]);
    } catch (error) {
      console.error("Error fetching response from OpenAI:", error);
      setMessages(prev => [...prev, { text: "Sorry, something went wrong. Please try again later.", isUser: false }]);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-24 right-6 w-96 h-[600px] bg-gradient-to-b from-black to-gray-950 rounded-lg shadow-xl border border-gray-800 flex flex-col"
        >
          {/* Header
          <div className="p-4 border-b border-purple-600">
            <h3 className="text-lg font-semibold">Fitness Assistant</h3>
          </div> */}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <ChatMessage
                key={index}
                message={message.text}
                isUser={message.isUser}
              />
            ))}
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-800 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-black border-2 border-gray-600 rounded-lg px-4 py-2 focus:outline-none"
            />  
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
              <Send className="h-5 w-5" />
            </Button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatWindow;
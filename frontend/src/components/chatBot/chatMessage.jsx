import { motion } from 'framer-motion';
import { User, Bot } from 'lucide-react';

const ChatMessage = ({ message, isUser }) => {
  const formatMessage = (text) => {
    const lines = text.split('\n').filter(line => line.trim() !== '');
    return lines.map((line, index) => {
      if (line.startsWith('*')) {
        return (
          <li key={index} className="list-disc list-inside">
            {line.substring(1).trim()}
          </li>
        );
      }
      return <p key={index}>{line}</p>;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-start gap-2 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
        isUser ? 'bg-purple-600' : 'bg-gray-700'
      }`}>
        {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
      </div>
      <div className={`max-w-[80%] rounded-lg px-4 py-2 ${
        isUser ? 'bg-gray-600 text-white' : 'bg-gray-800 text-gray-100'
      }`}>
        <ul className="space-y-1">
          {formatMessage(message)}
        </ul>
      </div>
    </motion.div>
  );
};

export default ChatMessage;
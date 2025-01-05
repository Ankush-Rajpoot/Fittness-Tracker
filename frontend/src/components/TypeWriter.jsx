import React, { useEffect, useState } from 'react';

const Typewriter = ({ texts, period }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(Math.floor(Math.random() * texts.length));
  const [typingSpeed, setTypingSpeed] = useState(200);

  useEffect(() => {
    const handleTyping = () => {
      const i = loopNum % texts.length;
      const fullText = texts[i];
      setDisplayedText((prev) => isDeleting ? fullText.substring(0, prev.length - 1) : fullText.substring(0, prev.length + 1));
      setTypingSpeed(isDeleting ? 100 : 200);

      if (!isDeleting && displayedText === fullText) {
        setTimeout(() => setIsDeleting(true), period);
      } else if (isDeleting && displayedText === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }
    };

    const typingTimer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(typingTimer);
  }, [displayedText, isDeleting, loopNum, texts, typingSpeed, period]);

  return (
    <h1 className="typewrite">
        <span className="wrap">{displayedText}</span>
    </h1>
  );
};

export default Typewriter;

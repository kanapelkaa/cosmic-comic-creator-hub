
import { useState, useEffect } from 'react';

export const useVisitorCount = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Get current count
    const savedCount = localStorage.getItem('visitorCount');
    const currentCount = savedCount ? parseInt(savedCount) : 0;
    
    // Increment count
    const newCount = currentCount + 1;
    setCount(newCount);
    localStorage.setItem('visitorCount', newCount.toString());
  }, []);

  return count;
};

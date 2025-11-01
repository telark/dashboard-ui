import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedPageWrapperProps {
  children: React.ReactNode;
}

const AnimatedPageWrapper: React.FC<AnimatedPageWrapperProps> = React.memo(({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
      }}
      style={{
        width: '100%',
        height: '100%',
      }}
    >
      {children}
    </motion.div>
  );
});

AnimatedPageWrapper.displayName = 'AnimatedPageWrapper';

export default AnimatedPageWrapper;


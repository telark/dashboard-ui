import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedPageWrapperProps {
  children: React.ReactNode;
}

const AnimatedPageWrapper: React.FC<AnimatedPageWrapperProps> = React.memo(({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 0.15,
        ease: 'easeOut',
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

import React from 'react';
import { motion } from 'framer-motion';
import { DEFAULT_COLORS, SUCCESS_MESSAGES } from '../../constants';

interface WelcomeProps {
  onComplete?: () => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onComplete }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
          style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'linear-gradient(45deg, #20C997, #17a2b8)',
            margin: '0 auto 32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 32px rgba(32, 201, 151, 0.3)',
          }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6, duration: 0.4, ease: 'easeOut' }}
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <motion.div
              initial={{ rotate: -180, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.5, ease: 'easeOut' }}
              style={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                background: DEFAULT_COLORS.SUCCESS,
              }}
            />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
          style={{
            fontSize: 28,
            color: '#ffffff',
            fontWeight: 700,
            marginBottom: 8,
            textShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          {SUCCESS_MESSAGES.WELCOME}
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8, ease: 'easeOut' }}
          style={{
            fontSize: 16,
            color: 'rgba(255,255,255,0.8)',
            fontWeight: 400,
            textShadow: '0 1px 2px rgba(0,0,0,0.1)',
          }}
        >
          {SUCCESS_MESSAGES.WELCOME_SUBTITLE}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Welcome;

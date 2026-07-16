import React, { useState } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ConfigProvider, theme as antdTheme } from 'antd';
import { LIGHT_TOKENS, DARK_TOKENS } from '../../constants/theme';
import { BrandPanel } from '../login/BrandPanel';
import { CompactBanner } from '../login/CompactBanner';
import { AuthContainer } from './AuthContainer';
import './auth.css';

const CARD_TRANSITION = {
  initial: { opacity: 0, y: 10, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -10, scale: 0.98 },
  transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] },
} as const;

export const AuthLayout: React.FC = () => {
  const location = useLocation();
  // Outlet would re-render the exiting card with the incoming route's content
  // mid-animation; useOutlet resolves to that route's own element instead.
  const outlet = useOutlet();
  const [isDark] = useState(() => localStorage.getItem('auth-theme') === 'dark');

  return (
    <ConfigProvider
      wave={{ disabled: true }}
      theme={{
        cssVar: { key: 'telark-auth' },
        hashed: false,
        algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        token: isDark ? DARK_TOKENS : LIGHT_TOKENS,
      }}
    >
      <div className="auth-root" data-theme={isDark ? 'dark' : 'light'}>
        <AuthContainer leftPanel={<BrandPanel />} compactBanner={<CompactBanner />}>
          {/* mode="wait" lets the outgoing card finish before the next enters, so
              the two never overlap while the card height changes between pages. */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={location.pathname}
              {...CARD_TRANSITION}
              style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
            >
              {/* No Suspense boundary here: the route-level one in AppRoutes
                  already covers this exact lazy(Login/Register) chunk. A second
                  boundary around the same async wait doesn't protect against
                  anything extra — it just flashes a second, different-looking
                  spinner right after the first one on a cold load. */}
              {outlet}
            </motion.div>
          </AnimatePresence>
        </AuthContainer>
      </div>
    </ConfigProvider>
  );
};

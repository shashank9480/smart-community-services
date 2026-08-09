import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
  glowColor?: string;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  className = '',
  onClick,
  hoverEffect = true,
  glowColor,
}) => {
  return (
    <motion.div
      onClick={onClick}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      whileHover={
        hoverEffect
          ? {
              y: -4,
              scale: 1.01,
              transition: { duration: 0.2, ease: 'easeOut' },
            }
          : undefined
      }
      whileTap={onClick ? { scale: 0.98 } : undefined}
      className={`relative overflow-hidden rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm transition-shadow hover:shadow-md ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {glowColor && (
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{ backgroundColor: glowColor }}
        />
      )}
      {children}
    </motion.div>
  );
};

export default AnimatedCard;

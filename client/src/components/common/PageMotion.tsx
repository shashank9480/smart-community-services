import React from 'react';
import { motion, Variants } from 'framer-motion';

interface PageMotionProps {
  children: React.ReactNode;
  className?: string;
  stagger?: boolean;
}

export const containerVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: [0.25, 0.1, 0.25, 1],
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
};

export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 14, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

export const PageMotion: React.FC<PageMotionProps> = ({
  children,
  className = '',
  stagger = true,
}) => {
  return (
    <motion.div
      variants={stagger ? containerVariants : undefined}
      initial="hidden"
      animate="show"
      exit="exit"
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const MotionItem: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
};

export default PageMotion;

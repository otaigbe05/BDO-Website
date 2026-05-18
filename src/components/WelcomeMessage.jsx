import React from 'react';
import { motion } from 'framer-motion';

const WelcomeMessage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="p-4 bg-primary/10 border-l-4 border-primary rounded-r-lg"
    >
      <p className='text-base md:text-lg text-foreground max-w-2xl mx-auto'>
        Hello there! I'm <span className='font-semibold text-primary'>Horizons</span>, your AI coding companion.
        I'm here to help you build amazing web applications!
      </p>
    </motion.div>
  );
};

export default WelcomeMessage;
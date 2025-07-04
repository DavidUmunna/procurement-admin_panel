import React from "react";
import { motion } from "framer-motion";
import HeroImage from "../../components/assets/management.jpeg"; // adjust if needed

const Hero = () => {
  return (
    <motion.div
      className="max-w-7xl flex justify-center mx-auto px-4 sm:px-6 lg:px-8 py-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        {/* Left: Text Section */}
        <motion.div
          className="text-center md:text-left"
          initial={{ x: -50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h1 className="text-4xl font-extrabold text-gray-800 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Simplify Your Resource Management
          </h1>
          <p className="mt-5 max-w-lg text-xl text-gray-500 ml-30">
            Track Requests, manage approvals, and optimize resources in one powerful platform.
          </p>
        </motion.div>

        {/* Right: Image Section */}
        <motion.div
          className="flex justify-center"
          initial={{ x: 50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <img
            rel="preload"
            src={HeroImage}
            alt="Hero"
            className="w-full max-w-md rounded-lg"
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Hero;

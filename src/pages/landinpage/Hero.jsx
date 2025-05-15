import React from "react";
import HeroImage from "../../components/assets/management.jpeg"; // adjust if needed

const Hero = () => {
  return (
    <div className="max-w-7xl flex justify-center mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left: Text Section */}
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-extrabold text-gray-800 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Simplify Your Resource Management
          </h1>
          <p className="mt-5 max-w-lg text-xl text-gray-500 ml-30">
                Track Requests, manage approvals, and optimize resources in one powerful platform.
          </p>
          <div className="mt-8 flex justify-center md:justify-start space-x-3">
            <button className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10">
              Start Free Trial
            </button>
            <button className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10">
              See Demo
            </button>
          </div>
        </div>

        {/* Right: Image Section */}
        <div className="flex justify-center">
          <img src={HeroImage} alt="Hero" className="w-full max-w-md rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default Hero;

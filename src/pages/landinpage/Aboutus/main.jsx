/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react"
import { motion } from "framer-motion"

const Aboutus=()=>{
    return(
        <div>
            {/* About Us Section */}
            <section id="about" className="py-20 bg-gray-50 dark:bg-gray-900">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                  <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
                    About <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-500 to-blue-600">ResourceFlow</span>
                  </h2>
                  <p className="mt-4 max-w-2xl text-xl text-gray-600 dark:text-gray-300 mx-auto">
                    Streamlining resource management for modern teams
                  </p>
                </div>
            
                <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-2">
                  {/* Company Story */}
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg"
                  >
                    <div className="w-16 h-16 bg-gradient-to-r from-gray-500 to-blue-600 rounded-lg flex items-center justify-center mb-6">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Story</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Founded in 2025, ResourceFlow was born from our team's frustration with expensive resource management tools.
                      We set out to build an intuitive platform that empowers teams to focus on their work, not paperwork.
                    </p>
                  </motion.div>
            
                  {/* Mission */}
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg"
                  >
                    <div className="w-16 h-16 bg-gradient-to-r from-gray-500 to-blue-600 rounded-lg flex items-center justify-center mb-6">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      To eliminate resource management headaches with elegant software that's powerful yet simple.
                      We believe great tools should fade into the background and let people do their best work.
                    </p>
                  </motion.div>
                </div>
            
                {/* Team Section */}
                
              </div>
            </section>
        </div>
    )
}

export default Aboutus
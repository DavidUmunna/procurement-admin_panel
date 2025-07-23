import React from 'react';

const UserDetailsSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 animate-pulse mt-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card Skeleton */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="h-40 bg-gray-200"></div>
            <div className="px-6 pb-8 relative">
              <div className="flex justify-center -mt-16">
                <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-300"></div>
              </div>
              
              <div className="text-center mt-4 space-y-2">
                <div className="h-6 bg-gray-300 rounded mx-auto w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded mx-auto w-1/2"></div>
              </div>
              
              <div className="mt-6 space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="h-5 w-5 bg-gray-300 rounded-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="h-5 w-5 bg-gray-300 rounded-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="h-5 w-5 bg-gray-300 rounded-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Analytics Skeleton */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[1, 2, 3].map((item) => (
                <div key={item} className="bg-white rounded-xl shadow-md p-6">
                  <div className="h-12 w-12 bg-gray-300 rounded-full mx-auto"></div>
                  <div className="mt-3 h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                  <div className="mt-2 h-8 bg-gray-300 rounded w-1/2 mx-auto"></div>
                </div>
              ))}
            </div>

            {/* Request Details Skeleton */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6 space-y-6">
                <div className="bg-gray-100 rounded-lg p-5">
                  <div className="h-5 bg-gray-300 rounded w-1/2 mx-auto"></div>
                </div>
                
                {/* Request Sections */}
                {[1, 2, 3, 4].map((section) => (
                  <div key={section} className="space-y-3">
                    <div className="bg-gray-100 rounded-lg p-4 flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-gray-300 rounded-lg"></div>
                        <div>
                          <div className="h-4 bg-gray-300 rounded w-24"></div>
                          <div className="mt-1 h-5 bg-gray-400 rounded w-16"></div>
                        </div>
                      </div>
                      <div className="h-5 w-5 bg-gray-300 rounded-full"></div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      {[1, 2].map((item) => (
                        <div key={item} className="flex justify-between py-2">
                          <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-16"></div>
                            <div className="h-3 bg-gray-200 rounded w-32"></div>
                          </div>
                          <div className="h-3 bg-gray-200 rounded w-20"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsSkeleton;
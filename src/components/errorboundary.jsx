import React from  "react"




function Fallback({error}){
    return (
        <div  className=" flex justify-center items-center min-h-screen" role="alert">
            <div className="flex justify-center">
              <div className="flex flex-col items-center space-y-2">
                <p className="font-extrabold">Something went wrong</p>
                <p className="font-extrabold">Refresh Page</p>
              </div>
            </div>

             {error?.message && (
          <pre className="text-sm text-red-500">{error.message}</pre>
        )}

        </div>
    )
}
export default Fallback
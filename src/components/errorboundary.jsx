import React from  "react"




function Fallback({error}){
    return (
        <div  className=" flex justify-center items-center min-h-screen" role="alert">
            <p className="flex justify-center align-middle font-extrabold font">Something went Wrong</p>
            <p className="flex justify-center align-middle font-extrabold font">Refresh Page</p>
             {error?.message && (
          <pre className="text-sm text-red-500">{error.message}</pre>
        )}

        </div>
    )
}
export default Fallback
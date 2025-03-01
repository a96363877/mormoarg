import * as React from "react"

interface FullPageLoaderProps {
  isLoading: boolean
}

const FullPageLoader: React.FC<FullPageLoaderProps> = ({ isLoading }) => {
  if (!isLoading) return null

  return (
    <div className="z-50 flex justify-center ">
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100/50 bg-opacity-0 ">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
    </div>
    fgd
    </div>
  )
}

export default FullPageLoader


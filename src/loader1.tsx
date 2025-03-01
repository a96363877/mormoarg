import * as React from "react"

interface FullPageLoaderProps {
  isLoading: boolean
}

const FullPageLoader: React.FC<FullPageLoaderProps> = ({ isLoading }) => {
  if (!isLoading) return null

  return (
    <div className="loader-container">
      <div className="loader "></div>
    </div>
  )
}

export default FullPageLoader


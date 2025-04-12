import * as React from "react";

interface FullPageLoaderProps {
  isLoading: boolean;
}

const FullPageLoader: React.FC<FullPageLoaderProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-10 z-50">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
};

export default FullPageLoader;

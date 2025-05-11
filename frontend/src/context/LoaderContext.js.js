import { createContext, useState } from "react";

const LoaderContext = createContext();

export default LoaderContext;

export const LoaderProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  const showLoader = () => setLoading(true);
  const hideLoader = () => setLoading(false);

  return (
    <LoaderContext.Provider value={{ loading, showLoader, hideLoader }}>
      {children}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="loader border-t-4 border-white border-solid rounded-full w-12 h-12 animate-spin" />
        </div>
      )}
    </LoaderContext.Provider>
  );
};

// A standardized wrapper to enforce the 1380px max-width and edge padding globally
const GlobalWrapper = ({ children, className = '' }) => {
  return (
    <div className={`global-container ${className}`}>
      {children}
    </div>
  );
};

export default GlobalWrapper;

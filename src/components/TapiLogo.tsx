export const TapiLogo: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <img 
      src="/tapi_logo.png"
      alt="Tapi Logo"
      className={className}
      style={{ 
        objectFit: 'contain'
      }}
    />
  );
};
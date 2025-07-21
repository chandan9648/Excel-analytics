
export const Card = ({ children, className }) => {
  return (
    <div className={`flex h-screen w-screen items-center justify-center  bg-green-200 fixed ${className}`}>
      {children}
    </div>
  );
};
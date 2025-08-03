
export const Card = ({ children, className }) => {
  return (
    <div className={`flex h-screen w-screen items-center justify-center  bg-linear-65 from-purple-500 to-green-500 fixed ${className}`}>
      {children}
    </div>
  );
};
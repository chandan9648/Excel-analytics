import React from "react";

export const Card = ({ children, className }) => {
  return (
    <div className={`flex h-screen w-screen items-center justify-center  bg-green-100 ${className}`}>
      {children}
    </div>
  );
};
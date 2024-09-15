import React from "react";

const PageLayout = ({ children }) => {
  return (
    <div className="bg-body-bg py-8 overflow-y-auto max-w-[1440px] px-2 md:px-5 flex-1 h-full">
      {children}
    </div>
  );
};

export default PageLayout;

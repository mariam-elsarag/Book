import React from "react";
import Search from "../components/Search";

const TableHeader = ({
  searchApi = "",
  children,
  setData,
  setNext,
  setPrev,
  searchPlaceholder = "",
}) => {
  return (
    <div className="flex items-center gap-6">
      <Search
        apiLink={searchApi}
        setData={setData}
        setNext={setNext}
        setPrev={setPrev}
        searchPlaceholder={searchPlaceholder}
      />
      {children}
    </div>
  );
};

export default TableHeader;

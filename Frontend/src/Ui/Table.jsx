import React, { useState } from "react";
import { Accordion, AccordionTab } from "primereact/accordion";
import { MdKeyboardArrowDown } from "react-icons/md";
import { useMediaQuery } from "react-responsive";

const Table = ({ columns, data, noFields, actionList }) => {
  const isMediumOrLarger = useMediaQuery({ query: "(min-width: 786px)" });

  return (
    <>
      {isMediumOrLarger ? (
        <TableDesktop
          columns={columns}
          data={data}
          actionList={actionList}
          noFields={noFields}
        />
      ) : (
        <TableMobile columns={columns} data={data} actionList={actionList} />
      )}
    </>
  );
};

const TableDesktop = ({ columns, data, noFields, actionList }) => {
  return (
    <div className="border border-dark-grey rounded-lg p-4">
      <header
        className={`w-full grid ${noFields} border-b border-dark-grey pb-1`}
      >
        {columns?.map((item, index) => (
          <span className="text-neutral-700 capitalize" key={index}>
            {item}
          </span>
        ))}
      </header>
      {/* Body */}
      <section className="mt-2">
        {data?.length > 0 ? (
          data.map((row, rowIndex) => (
            <fieldset
              key={rowIndex}
              className={`border-b border-extra-light-grey py-2 grid ${noFields}`}
            >
              {columns.map((col, colIndex) => (
                <span key={colIndex} className="text-xs text-neutral-700">
                  {row?.[col] || "-"}
                </span>
              ))}
              <div className="flex items-center justify-center gap-2">
                {actionList?.map((actionItem) => (
                  <span
                    key={actionItem?.id}
                    onClick={() => actionItem?.action(row)}
                    className="cursor-pointer"
                  >
                    {actionItem?.icon}
                  </span>
                ))}
              </div>
            </fieldset>
          ))
        ) : (
          <p className="text-center text-black mt-4">No data available</p>
        )}
      </section>
    </div>
  );
};

const TableMobile = ({ columns, data, actionList }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const onAccordionChange = (e) => {
    setActiveIndex(e.index);
  };

  return (
    <div className="">
      <Accordion activeIndex={activeIndex} onTabChange={onAccordionChange}>
        {data?.map((row, index) => (
          <AccordionTab
            key={index}
            header={
              <div className="flex items-center justify-between">
                <h2
                  className={`${
                    activeIndex === index ? "text-primary" : "text-gray-500"
                  } text-xs`}
                >
                  {row?.[columns[0]]}
                </h2>
                <span
                  className={`flex w-fit ${
                    activeIndex === index ? "rotate-180" : ""
                  }`}
                >
                  <MdKeyboardArrowDown
                    size={20}
                    color={
                      activeIndex === index
                        ? "var(--primary)"
                        : "var(--dark-grey)"
                    }
                  />
                </span>
              </div>
            }
          >
            <ul className="m-0">
              {columns.slice(1).map((col, colIndex) => (
                <li
                  key={colIndex}
                  className="py-2 px-1 w-full flex items-center justify-between"
                >
                  <span className="text-xs text-grey-400 font-bold capitalize ">
                    {col}
                  </span>
                  <span className="text-grey-400 font-normal text-xs">
                    {row?.[col] || "-"}
                  </span>
                </li>
              ))}
              <div className="flex items-center justify-between gap-2 mt-2">
                <span className="text-xs text-grey-400 font-bold capitalize ">
                  Action
                </span>
                <div className="flex items-center gap-2">
                  {actionList?.map((actionItem) => (
                    <span
                      key={actionItem?.id}
                      onClick={() => actionItem?.action(row)}
                      className="cursor-pointer"
                    >
                      {actionItem?.icon}
                    </span>
                  ))}
                </div>
              </div>
            </ul>
          </AccordionTab>
        ))}
      </Accordion>
    </div>
  );
};

export default Table;

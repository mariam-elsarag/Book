import React from "react";

const Table = ({
  headerColumns,
  headerClassName,
  columns,
  data,
  actionList,
  renderColumn,
}) => {
  return (
    <>
      <TableDesktop
        headerColumns={headerColumns}
        columns={columns}
        data={data}
        actionList={actionList}
        renderColumn={renderColumn}
        headerClassName={headerClassName}
      />
    </>
  );
};

const TableDesktop = ({
  headerColumns,
  columns,
  data,
  actionList,
  renderColumn,
  headerClassName = "",
}) => {
  return (
    <div className="border border-dark-grey rounded-lg p-4 overflow-x-auto">
      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr className="border-b border-dark-grey">
            {headerColumns?.map((item, index) => (
              <th
                key={index}
                className={`${headerClassName} text-natural-light capitalize text-left py-2 px-4`}
              >
                {item}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data?.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b border-extra-light-grey">
                {columns.map((col, colIndex) => (
                  <td
                    key={colIndex}
                    className="text-nowrap text-xs text-neutral-700 py-2 px-4"
                  >
                    {renderColumn && renderColumn[col]
                      ? renderColumn[col](row[col], row)
                      : row?.[col] || "-"}
                  </td>
                ))}
                <td className="flex items-center justify-center gap-2 py-2 px-4">
                  {actionList?.map((actionItem) => (
                    <span
                      key={actionItem?.id}
                      onClick={() => actionItem?.action(row)}
                      className="cursor-pointer"
                    >
                      {actionItem?.icon}
                    </span>
                  ))}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length + 1}
                className="text-center text-black py-4"
              >
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;

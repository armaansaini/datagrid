"use client";

import { useEffect, useState } from "react";

import { DataType } from "../types/datagrid.types";
import "../styles/datagrid.css";

import { DATA } from "../data/datagrid.data";

const TableRow = ({
  index,
  row,
  isChecked,
  onRowClick,
}: {
  index: number;
  isChecked: boolean;
  onRowClick: (n: number) => void;
  row: DataType;
}) => (
  <tr className="datagrid-row" onClick={() => onRowClick(index)}>
    <td className="checkbox-column">
      <input type="checkbox" readOnly checked={isChecked} />
    </td>
    <td className="name-column">{row.name}</td>
    <td className="device-column">{row.device}</td>
    <td className="path-column">{row.path}</td>
    <td className="status-column">
      {row.status === "available" ? <span className="green-dot" /> : null}
      &nbsp;{row.status}
    </td>
  </tr>
);

export default function Datagrid() {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [isDownloadDisabled, setIsDownloadDisabled] = useState<boolean>(false);
  const [isSelectedAll, setIsSelectedAll] = useState<boolean>(false);

  const download = () => {
    if (isDownloadDisabled || selectedRows.length === 0) return;
    const downloadRows = selectedRows.map((index) => DATA[index]);
    let downloadData = "";

    downloadRows.forEach((row) => {
      downloadData += `Name: ${row.name} Device: ${row.device} Path: ${row.path} \n\n`;
    });

    alert(downloadData);
  };

  useEffect(() => {
    if (selectedRows.length === DATA.length) {
      setIsSelectedAll(true);
    } else {
      setIsSelectedAll(false);
    }

    setIsDownloadDisabled(false);
    selectedRows.forEach((row) => {
      if (DATA[row].status !== "available") {
        setIsDownloadDisabled(true);
        return;
      }
    });
  }, [selectedRows]);

  const onRowClick = (index: number) => {
    setSelectedRows((prevSelectedRows) => {
      if (prevSelectedRows.includes(index)) {
        return prevSelectedRows.filter((i) => i !== index);
      } else {
        return [...prevSelectedRows, index];
      }
    });
  };

  const selectAllRows = () => {
    if (isSelectedAll) setSelectedRows([]);
    else {
      const notIncludedIndexes: number[] = [];
      DATA.map((_, index) => {
        if (!selectedRows.includes(index)) {
          notIncludedIndexes.push(index);
        }
      });

      setSelectedRows((prevSelectedRows) => [
        ...prevSelectedRows,
        ...notIncludedIndexes,
      ]);
    }
  };

  return (
    <div style={{ overflow: "scroll" }}>
      <table className="datagrid-table">
        <thead>
          {/* select all and download button */}
          <tr className="datagrid-header">
            <th colSpan={5} className="header-container">
              <div style={{ width: "40px" }}>
                <input
                  type="checkbox"
                  checked={isSelectedAll}
                  onChange={selectAllRows}
                />
              </div>
              &nbsp;{selectedRows.length === 0 ? "None" : selectedRows.length}{" "}
              Selected
              <button
                onClick={download}
                className="download-button"
                disabled={isDownloadDisabled || selectedRows.length === 0}
              >
                &darr;Download Selected
              </button>
            </th>
          </tr>

          {/* datagrid header */}
          <tr className="datagrid-header">
            <th className="checkbox-column" style={{ opacity: 0 }}></th>
            <th className="name-column">Name</th>
            <th className="device-column">Device</th>
            <th className="path-column">Path</th>
            <th className="status-column">Status</th>
          </tr>
        </thead>

        {/* datagrid body */}
        <tbody>
          {DATA.map((row, index) => (
            <TableRow
              index={index}
              key={index}
              isChecked={selectedRows.includes(index)}
              row={row}
              onRowClick={onRowClick}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

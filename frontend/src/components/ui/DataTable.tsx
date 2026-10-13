"use client";

import { COLORS } from "@/styles/colors";

export interface DataTableColumn<T> {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  getRowKey: (item: T) => string;
  emptyMessage?: string;
}

export default function DataTable<T>({
  columns,
  data,
  getRowKey,
  emptyMessage = "No records found.",
}: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="px-6 py-14 text-center">
        <p
          className="text-sm"
          style={{
            color: COLORS.grey[500],
          }}
        >
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead
          style={{
            backgroundColor: COLORS.grey[50],
          }}
        >
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-6 py-3 font-medium"
                style={{
                  color: COLORS.grey[700],
                }}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((item) => (
            <tr
              key={getRowKey(item)}
              className="border-t"
              style={{
                borderColor: COLORS.grey[200],
              }}
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className="px-6 py-4"
                  style={{
                    color: COLORS.grey[600],
                  }}
                >
                  {column.render
                    ? column.render(item)
                    : String(item[column.key as keyof T] ?? "-")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

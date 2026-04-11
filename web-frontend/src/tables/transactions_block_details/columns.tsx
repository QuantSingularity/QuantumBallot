import type { ColumnDef } from "@tanstack/react-table";
import type { Transaction } from "@/data_types";

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "id",
    header: "#",
    cell: ({ row }) => (
      <span className="text-gray-400 text-sm">{row.original.id}</span>
    ),
  },
  {
    accessorKey: "transactionHash",
    header: "Hash",
    cell: ({ row }) => {
      const hash: string = row.getValue("transactionHash") ?? "";
      return hash ? (
        <span className="font-mono text-xs text-gray-600">
          {hash.substring(0, 16)}…
        </span>
      ) : (
        <span className="text-gray-300">—</span>
      );
    },
  },
  {
    accessorKey: "identifier",
    header: "Vote ID",
    cell: ({ row }) => {
      const id: string = row.getValue("identifier") ?? "";
      return id ? (
        <span className="font-mono text-xs text-gray-600">
          {id.substring(0, 9)}
        </span>
      ) : (
        <span className="text-gray-300">—</span>
      );
    },
  },
  {
    accessorKey: "choiceCode",
    header: "Vote",
    cell: ({ row }) => {
      const code: string = row.getValue("choiceCode") ?? "";
      const display = code === "-" ? "" : code;
      return display ? (
        <span className="font-mono text-xs text-gray-600">
          {display.substring(0, 9)}
        </span>
      ) : (
        <span className="text-gray-300">—</span>
      );
    },
  },
  {
    accessorKey: "voteTime",
    header: "Date and Time",
    cell: ({ row }) => {
      const raw: string = row.getValue("voteTime") ?? "";
      const ts = parseInt(raw, 10);
      if (isNaN(ts) || ts <= 0) return <span className="text-gray-300">—</span>;
      return (
        <span className="text-xs text-gray-600">
          {new Date(ts).toLocaleString()}
        </span>
      );
    },
  },
];

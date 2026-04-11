import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Voter } from "@/data_types";
import CustomDropMenuVoters from "./CustomDropMenuVoters";

export const columns: ColumnDef<Voter>[] = [
  {
    accessorKey: "id",
    header: "#",
    cell: ({ row }) => (
      <span className="text-gray-400 text-sm">{row.original.id}</span>
    ),
  },
  {
    accessorKey: "identifier",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Identifier
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="font-mono text-xs text-gray-700 break-all">
        {row.original.identifier}
      </span>
    ),
  },
  {
    accessorKey: "electoralId",
    header: "Electoral ID",
    cell: ({ row }) => (
      <span className="font-mono text-xs text-gray-500">
        {row.original.electoralId ?? "—"}
      </span>
    ),
  },
  {
    accessorKey: "choiceCode",
    header: "Choice Code",
    cell: ({ row }) => (
      <span className="text-sm text-gray-600">{row.original.choiceCode || "—"}</span>
    ),
  },
  {
    accessorKey: "state",
    header: "State",
    cell: ({ row }) => {
      const voted = row.original.state === "true";
      return (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
            voted ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
          }`}
        >
          {voted ? "Voted" : "Pending"}
        </span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <CustomDropMenuVoters voter={row.original} />,
  },
];

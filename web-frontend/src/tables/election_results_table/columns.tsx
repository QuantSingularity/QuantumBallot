import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CandidateResults } from "@/data_types";
import ProgressBar from "./ProgressBar";

export const columns: ColumnDef<CandidateResults>[] = [
  {
    accessorKey: "id",
    header: "#",
    cell: ({ row }) => <span className="text-gray-400 text-sm">{row.original.id}</span>,
  },
  {
    accessorKey: "candidate",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Candidate
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="font-medium text-gray-800">{row.original.candidate}</span>
    ),
  },
  {
    accessorKey: "party",
    header: "Party",
    cell: ({ row }) => (
      <span className="text-gray-600 text-sm">{row.original.party}</span>
    ),
  },
  {
    accessorKey: "numVotes",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Votes
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="font-semibold text-gray-700">
        {Number(row.original.numVotes).toLocaleString()}
      </span>
    ),
  },
  {
    accessorKey: "percentage",
    header: "Percentage",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 min-w-[120px]">
        <ProgressBar value={row.original.percentage} />
        <span className="text-xs font-semibold text-red-600 w-12 text-right">
          {Number(row.original.percentage).toFixed(2)}%
        </span>
      </div>
    ),
  },
];

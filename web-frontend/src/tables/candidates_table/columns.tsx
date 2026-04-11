import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Candidate } from "@/data_types";
import CustomDropMenuCandidate from "./CustomDropMenuCandidate";

export const columns: ColumnDef<Candidate>[] = [
  {
    accessorKey: "id",
    header: "#",
    cell: ({ row }) => (
      <span className="text-gray-400 text-sm">{row.original.id}</span>
    ),
  },
  {
    accessorKey: "candidadePhoto",
    header: "Photo",
    cell: ({ row }) =>
      row.original.candidadePhoto ? (
        <img
          src={row.original.candidadePhoto}
          alt={row.original.name}
          className="w-10 h-10 rounded-full object-cover"
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
          N/A
        </div>
      ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="font-medium text-gray-800">{row.original.name}</span>
    ),
  },
  {
    accessorKey: "acronym",
    header: "Acronym",
    cell: ({ row }) => (
      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
        {row.original.acronym}
      </span>
    ),
  },
  {
    accessorKey: "party",
    header: "Party",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        {row.original.partyImage && (
          <img
            src={row.original.partyImage}
            alt={row.original.party}
            className="w-6 h-6 rounded-full object-cover"
          />
        )}
        <span className="text-sm text-gray-600">{row.original.party}</span>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const colors: Record<string, string> = {
        active: "bg-green-100 text-green-700",
        inactive: "bg-gray-100 text-gray-500",
        pending: "bg-yellow-100 text-yellow-700",
      };
      return (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${colors[status] ?? "bg-gray-100 text-gray-500"}`}
        >
          {status}
        </span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <CustomDropMenuCandidate candidate={row.original} />,
  },
];

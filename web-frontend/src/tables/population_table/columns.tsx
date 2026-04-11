/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Citizen } from "@/data_types";
import CustomDropMenuPopulation from "./CustomDropMenuPopulation";

export type { Citizen };

export const columns: ColumnDef<Citizen>[] = [
  {
    accessorKey: "id",
    header: "#",
    cell: ({ row }) => (
      <span className="text-gray-400 text-sm">{row.original.id}</span>
    ),
  },
  {
    accessorKey: "electoralId",
    header: "Electoral ID",
    cell: ({ row }) => (
      <span className="font-mono text-xs text-gray-600">{row.original.electoralId}</span>
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
    accessorKey: "province",
    header: "Province",
    cell: ({ row }) => (
      <span className="text-sm text-gray-600">{row.original.province}</span>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <span className="text-sm text-gray-500">{row.original.email}</span>
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
        suspended: "bg-red-100 text-red-600",
      };
      return (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${colors[status] ?? "bg-gray-100 text-gray-500"}`}
        >
          {status || "—"}
        </span>
      );
    },
  },
  {
    accessorKey: "verification",
    header: "Verification",
    cell: ({ row }) => {
      const v = row.original.verification;
      const colors: Record<string, string> = {
        verified: "bg-green-100 text-green-700",
        pending: "bg-yellow-100 text-yellow-600",
        rejected: "bg-red-100 text-red-600",
      };
      return (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${colors[v] ?? "bg-gray-100 text-gray-500"}`}
        >
          {v || "—"}
        </span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <CustomDropMenuPopulation
        citizen={row.original}
        setData={(row.original as any).setData}
        toast={(row.original as any).toast}
      />
    ),
  },
];

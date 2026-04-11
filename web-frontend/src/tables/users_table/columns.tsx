import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { User } from "@/data_types";
import CustomDropMenuUser from "./CustomDropMenuUser";
import personPlaceholder from "@/assets/person.png";

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: "#",
    cell: ({ row }) => (
      <span className="text-gray-400 text-sm">{row.original.id}</span>
    ),
  },
  {
    accessorKey: "photo",
    header: "Photo",
    cell: ({ row }) => {
      const url = (row.original as any).photo;
      return (
        <img
          src={url || personPlaceholder}
          alt={(row.original as any).name ?? "User"}
          className="h-9 w-9 rounded-full object-cover ring-1 ring-gray-200"
        />
      );
    },
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
      <span className="font-medium text-gray-800">
        {(row.original as any).name}
      </span>
    ),
  },
  {
    accessorKey: "username",
    header: "Username",
    cell: ({ row }) => (
      <span className="text-sm text-gray-500">
        {(row.original as any).username}
      </span>
    ),
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = (row.original as any).role;
      return (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
            role === "admin"
              ? "bg-red-100 text-red-700"
              : "bg-blue-100 text-blue-600"
          }`}
        >
          {role}
        </span>
      );
    },
  },
  {
    accessorKey: "timestamp",
    header: "Created",
    cell: ({ row }) => (
      <span className="text-xs text-gray-400">
        {(row.original as any).timestamp}
      </span>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <CustomDropMenuUser user={row.original} />,
  },
];

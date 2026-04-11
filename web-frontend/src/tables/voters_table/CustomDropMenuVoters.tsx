import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Voter } from "@/data_types";
import RevealVoter from "./reveal-voter";

type CustomDropMenuVotersProps = {
  voter: Voter;
};

export default function CustomDropMenuVoters({
  voter,
}: CustomDropMenuVotersProps) {
  const [isRevealOpen, setIsRevealOpen] = useState(false);

  return (
    <>
      <RevealVoter
        isOpen={isRevealOpen}
        onOpenChange={setIsRevealOpen}
        voter={voter}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() =>
              navigator.clipboard
                .writeText(voter.identifier ?? "")
                .catch(() => {})
            }
          >
            Copy Identifier
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsRevealOpen(true)}>
            Reveal Voter Details
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

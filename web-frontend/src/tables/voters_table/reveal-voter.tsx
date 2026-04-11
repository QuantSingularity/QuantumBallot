import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Voter } from "@/data_types";

type RevealVoterProps = {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  voter?: Voter;
};

export default function RevealVoter({ isOpen, onOpenChange, voter }: RevealVoterProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Voter Details</DialogTitle>
          <DialogDescription>
            Detailed information for this voter record.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-2">
          {voter ? (
            <>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Identifier
                </span>
                <span className="font-mono text-sm text-gray-800 break-all">
                  {voter.identifier}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Electoral ID
                </span>
                <span className="font-mono text-sm text-gray-800">
                  {voter.electoralId ?? "—"}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Choice Code
                </span>
                <span className="text-sm text-gray-800">
                  {voter.choiceCode || "—"}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  State
                </span>
                <span
                  className={`inline-flex w-fit items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    voter.state === "true"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {voter.state === "true" ? "Voted" : "Pending"}
                </span>
              </div>
            </>
          ) : (
            <p className="text-sm text-gray-400">No voter information available.</p>
          )}
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange?.(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

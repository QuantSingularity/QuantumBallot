import * as qrcode from "qrcode";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type VerificationModalProps = {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  url: string;
};

export default function VerificationDialog({
  isOpen,
  onOpenChange,
  url,
}: VerificationModalProps) {
  const [qrCodeURL, setQrCodeURL] = useState<string>("");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!url || !isOpen) return;
    setError(false);
    qrcode.toDataURL(url, (err, data) => {
      if (err) {
        console.error(err);
        setError(true);
      } else {
        setQrCodeURL(data);
      }
    });
  }, [url, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Voter Verification</DialogTitle>
          <DialogDescription>
            Scan the QR Code to verify this voter.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center items-center py-4">
          {error ? (
            <p className="text-sm text-red-500">Failed to generate QR code.</p>
          ) : qrCodeURL ? (
            <img
              src={qrCodeURL}
              alt="QR Code"
              className="w-56 h-56 rounded-lg"
            />
          ) : (
            <div className="w-56 h-56 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400" />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange?.(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

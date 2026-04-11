import { CheckIcon, ClipboardIcon } from "lucide-react";
import * as React from "react";
import { Button, type ButtonProps } from "./button";
import { type Event, trackEvent } from "./events";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

export function BlockCopyButton({
  event,
  name,
  code,
  ...props
}: {
  event: Event["name"];
  name: string;
  code: string;
} & ButtonProps) {
  const [hasCopied, setHasCopied] = React.useState(false);

  // Reset after 2s from when copy was triggered (not just on mount)
  React.useEffect(() => {
    if (!hasCopied) return;
    const timer = setTimeout(() => setHasCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [hasCopied]);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            variant="outline"
            className="h-7 w-7 rounded-[5px] p-2 [&_svg]:size-3.5"
            onClick={() => {
              navigator.clipboard.writeText(code).catch(() => {});
              trackEvent({ name: event, properties: { name } });
              setHasCopied(true);
            }}
            {...props}
          >
            <span className="sr-only">Copy</span>
            {hasCopied ? <CheckIcon /> : <ClipboardIcon />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>Copy code</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

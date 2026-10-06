import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm",
          "text-slate-900 placeholder:text-slate-400",
          "border-slate-300",
          "outline-none transition",
          "focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20",
          "disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-60",
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";

export { Input };

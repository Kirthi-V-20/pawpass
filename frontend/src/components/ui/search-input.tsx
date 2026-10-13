"use client";

import * as React from "react";
import { Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { COLORS } from "@/styles/colors";
import { localize } from "@/utils/localize";
import { Input } from "@/components/ui/input";

interface SearchInputProps extends Omit<
  React.ComponentProps<typeof Input>,
  "type"
> {
  onSearchChange?: (value: string) => void;
}

export function SearchInput({
  value,
  defaultValue,
  onChange,
  onSearchChange,
  className,
  placeholder = localize.common.search_placeholder,
  ...props
}: SearchInputProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(event);
    onSearchChange?.(event.target.value);
  };

  return (
    <div className="relative w-full">
      <Search
        size={18}
        color={COLORS.grey[500]}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
      />

      <Input
        type="search"
        value={value}
        defaultValue={defaultValue}
        onChange={handleChange}
        placeholder={placeholder}
        className={cn("pl-10 pr-3", className)}
        {...props}
      />
    </div>
  );
}

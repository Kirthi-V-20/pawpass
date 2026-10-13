import * as React from "react";

import { cn } from "@/lib/utils";
import { COLORS } from "@/styles/colors";

type BadgeStatus =
  | "UP_TO_DATE"
  | "DUE_SOON"
  | "OVERDUE"
  | "ACTIVE"
  | "COMPLETED"
  | "LOST"
  | "FOUND";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: BadgeStatus;
  children: React.ReactNode;
}

const statusStyles: Record<
  BadgeStatus,
  {
    background: string;
    text: string;
  }
> = {
  UP_TO_DATE: {
    background: `${COLORS.status.green}1A`,
    text: COLORS.status.green,
  },
  DUE_SOON: {
    background: `${COLORS.status.yellow}1A`,
    text: COLORS.status.yellow,
  },
  OVERDUE: {
    background: `${COLORS.status.red}1A`,
    text: COLORS.status.red,
  },
  ACTIVE: {
    background: `${COLORS.status.green}1A`,
    text: COLORS.status.green,
  },
  COMPLETED: {
    background: `${COLORS.grey[200]}`,
    text: COLORS.grey[700],
  },
  LOST: {
    background: `${COLORS.status.red}1A`,
    text: COLORS.status.red,
  },
  FOUND: {
    background: `${COLORS.status.green}1A`,
    text: COLORS.status.green,
  },
};

export function Badge({ status, children, className, ...props }: BadgeProps) {
  const styles = statusStyles[status];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium",
        className,
      )}
      style={{
        backgroundColor: styles.background,
        color: styles.text,
      }}
      {...props}
    >
      {children}
    </span>
  );
}

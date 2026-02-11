import * as React from "react";
import { Tooltip as RechartsTooltip } from "recharts";
import type { TooltipProps } from "recharts";
import { cn } from "@aetherlabs/ui";

export type ChartConfig = Record<
  string,
  {
    label?: string;
    color?: string;
  }
>;

const ChartConfigContext = React.createContext<ChartConfig | null>(null);

function useChartConfig() {
  return React.useContext(ChartConfigContext) ?? {};
}

function ChartContainer({
  className,
  config,
  children,
  style,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { config: ChartConfig }) {
  const colorVars = React.useMemo(() => {
    const entries = Object.entries(config).map(([key, value]) => [
      `--color-${key}`,
      value.color ?? "hsl(var(--primary))",
    ]);
    return Object.fromEntries(entries);
  }, [config]);

  return (
    <ChartConfigContext.Provider value={config}>
      <div
        className={cn("w-full", className)}
        style={{ ...colorVars, ...style }}
        {...props}
      >
        {children}
      </div>
    </ChartConfigContext.Provider>
  );
}

const ChartTooltip = RechartsTooltip;

function ChartTooltipContent({
  active,
  payload,
  label,
  indicator = "dot",
  className,
}: TooltipProps<number, string> & {
  indicator?: "dot" | "line";
  className?: string;
}) {
  const config = useChartConfig();

  if (!active || !payload?.length) return null;

  return (
    <div
      className={cn(
        "rounded-lg border bg-background px-3 py-2 text-xs shadow-sm",
        className
      )}
    >
      {label && <div className="mb-1 text-muted-foreground">{label}</div>}
      <div className="grid gap-1">
        {payload.map((item) => {
          const key = item.dataKey?.toString() ?? "";
          const color = config[key]?.color ?? item.color;
          return (
            <div key={key} className="flex items-center gap-2">
              <span
                className={cn(
                  "inline-block size-2 rounded-full",
                  indicator === "line" && "h-0.5 w-3 rounded-none"
                )}
                style={{ background: color }}
              />
              <span className="text-foreground">
                {config[key]?.label ?? key}
              </span>
              <span className="ml-auto font-medium text-foreground">
                {item.value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export { ChartContainer, ChartTooltip, ChartTooltipContent };

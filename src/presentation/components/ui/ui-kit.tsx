import type { ReactNode } from "react";

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {subtitle ? <p className="text-sm text-muted-foreground mt-1">{subtitle}</p> : null}
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-lg border border-border bg-surface shadow-[0_1px_3px_rgba(0,0,0,0.06)] ${className}`}
    >
      {children}
    </div>
  );
}

type Tone = "neutral" | "success" | "warning" | "danger" | "info" | "primary";

const toneClass: Record<Tone, string> = {
  neutral: "bg-muted text-foreground/80",
  success: "bg-success-bg text-success",
  warning: "bg-warning-bg text-warning",
  danger: "bg-danger-bg text-danger",
  info: "bg-info-bg text-info",
  primary: "bg-primary-light text-primary",
};

export function Badge({
  children,
  tone = "neutral",
  className = "",
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${toneClass[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

export function Btn({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md";
}) {
  const variants: Record<string, string> = {
    primary: "bg-primary text-primary-foreground hover:bg-primary-hover",
    secondary: "bg-surface border border-border-strong text-foreground hover:bg-muted",
    outline: "border border-primary text-primary hover:bg-primary-light",
    ghost: "text-foreground/80 hover:bg-muted",
    danger: "bg-danger text-white hover:opacity-90",
  };
  const sizes: Record<string, string> = {
    sm: "h-8 px-2.5 text-xs",
    md: "h-9 px-3.5 text-sm",
  };
  return (
    <button
      className={`inline-flex items-center justify-center gap-1.5 rounded-md font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

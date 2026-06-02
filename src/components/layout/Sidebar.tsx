import { Link, useRouterState } from "@tanstack/react-router";
import {
  Home, KeyRound, Boxes, Activity, Server, TerminalSquare,
  LayoutTemplate, Container, CreditCard, Settings, Cpu,
} from "lucide-react";
import type { ComponentType, SVGProps } from "react";

type NavItem = { to: string; label: string; icon: ComponentType<SVGProps<SVGSVGElement>> };
type NavSection = { label?: string; items: NavItem[] };

const sections: NavSection[] = [
  { items: [{ to: "/dashboard", label: "Dashboard", icon: Home }] },
  {
    label: "Inferência",
    items: [
      { to: "/api/keys", label: "API Keys", icon: KeyRound },
      { to: "/api/catalog", label: "Catálogo de Modelos", icon: Boxes },
      { to: "/api/usage", label: "Em Uso", icon: Activity },
    ],
  },
  {
    label: "Pods",
    items: [
      { to: "/pods", label: "Meus Pods", icon: Server },
      { to: "/pods/ssh-keys", label: "Chaves SSH", icon: TerminalSquare },
      { to: "/pods/templates", label: "Templates", icon: LayoutTemplate },
      { to: "/pods/images", label: "Minhas Imagens", icon: Container },
    ],
  },
  {
    label: "Conta",
    items: [
      { to: "/billing", label: "Billing", icon: CreditCard },
      { to: "/settings", label: "Configurações", icon: Settings },
    ],
  },
];

export function Sidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-border bg-sidebar">
      <Link to="/dashboard" className="flex items-center gap-2 px-5 h-14 border-b border-border">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Cpu className="h-4 w-4" />
        </div>
        <span className="font-bold tracking-tight">GPU Cloud</span>
      </Link>

      <nav className="flex-1 overflow-y-auto py-4">
        {sections.map((section, i) => (
          <div key={i} className="mb-4 px-3">
            {section.label ? (
              <div className="text-label px-2 mb-1.5">{section.label}</div>
            ) : null}
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const active =
                  pathname === item.to ||
                  (item.to !== "/dashboard" && pathname.startsWith(item.to));
                const Icon = item.icon;
                return (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className={[
                        "group flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium transition-colors relative",
                        active
                          ? "bg-primary-light text-primary"
                          : "text-foreground/80 hover:bg-muted",
                      ].join(" ")}
                    >
                      {active && (
                        <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r bg-primary" />
                      )}
                      <Icon className={`h-[18px] w-[18px] ${active ? "text-primary" : "text-muted-foreground"}`} />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-border px-4 py-3 text-xs text-muted-foreground">
        v1.0 · ambiente <span className="text-foreground">prod</span>
      </div>
    </aside>
  );
}

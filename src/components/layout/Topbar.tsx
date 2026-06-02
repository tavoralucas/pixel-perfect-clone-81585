import { Bell, Search, Plus, ChevronDown } from "lucide-react";

export function Topbar() {
  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-4 border-b border-border bg-surface px-4 md:px-6">
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar recursos, modelos, pods…"
            className="w-full h-9 rounded-md border border-border bg-surface-2 pl-9 pr-16 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
          <kbd className="absolute right-2 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center rounded border border-border bg-surface px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
            ⌘K
          </kbd>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 rounded-md border border-border px-3 h-9 text-sm">
          <span className="text-muted-foreground">Saldo</span>
          <span className="font-semibold">R$ 248,50</span>
          <button className="ml-1 inline-flex items-center gap-1 rounded-md border border-primary text-primary px-2 py-1 text-xs font-medium hover:bg-primary-light">
            <Plus className="h-3 w-3" /> créditos
          </button>
        </div>

        <button className="relative inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-muted">
          <Bell className="h-4 w-4 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
        </button>

        <button className="inline-flex items-center gap-2 rounded-md hover:bg-muted h-9 px-2">
          <div className="h-7 w-7 rounded-full bg-foreground text-background flex items-center justify-center text-xs font-semibold">
            MA
          </div>
          <span className="hidden sm:inline text-sm font-medium">Mateus Assad</span>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>
    </header>
  );
}

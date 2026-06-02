import { Bell, Search, Menu, Briefcase, ChevronDown } from "lucide-react";

export function Topbar() {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-border bg-surface px-4 md:px-6">
      {/* Logo + menu */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="flex items-center">
          <span className="text-2xl font-extrabold tracking-tight text-primary leading-none">Claro</span>
          <span className="ml-0.5 -mt-3 inline-block h-1.5 w-1.5 rounded-full bg-primary" />
        </div>
        <button className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-muted">
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Search pill */}
      <div className="flex-1 max-w-2xl">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Busque por produtos"
            className="w-full h-10 rounded-full border border-border bg-surface pl-11 pr-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
      </div>

      {/* Right cluster */}
      <div className="flex items-center gap-2 md:gap-4 shrink-0">
        <div className="hidden sm:flex items-center gap-2 text-sm font-semibold">
          <Briefcase className="h-4 w-4 text-foreground" />
          <span>GPUaaS</span>
        </div>

        <button className="relative inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-muted">
          <Bell className="h-5 w-5 text-foreground" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
        </button>

        <button className="inline-flex items-center gap-1 rounded-md hover:bg-muted h-9 px-2 text-sm font-medium">
          <span>Mateus Assad</span>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>
    </header>
  );
}

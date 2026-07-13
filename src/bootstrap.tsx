import { createRoot, type Root } from "react-dom/client";
import { StrictMode } from "react";
import { HelmetProvider } from "react-helmet-async";
import { App } from "@/app/App";
import "@/styles.css";

const roots = new WeakMap<HTMLElement, Root>();

export type MountOptions = {
  /** Optional basename when hosted under a sub-path by a shell host. */
  basename?: string;
};

export function mount(el: HTMLElement, options: MountOptions = {}): void {
  if (roots.has(el)) return;
  const root = createRoot(el);
  roots.set(el, root);
  root.render(
    <StrictMode>
      <HelmetProvider>
        <App basename={options.basename} />
      </HelmetProvider>
    </StrictMode>,
  );
}

export function unmount(el: HTMLElement): void {
  const root = roots.get(el);
  if (!root) return;
  root.unmount();
  roots.delete(el);
}

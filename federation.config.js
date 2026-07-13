// Native Federation configuration for the `gpuaas` micro-frontend.
// Consumed by @softarc/native-federation build tooling. The MFE exposes a
// single React module (`./Module`) that hosts can dynamically import and
// mount into a DOM element via `mount(el)` / `unmount(el)`.
//
// Usage (host):
//   import { loadRemoteModule } from "@softarc/native-federation";
//   const m = await loadRemoteModule({ remoteName: "gpuaas", exposedModule: "./Module" });
//   m.mount(document.getElementById("gpuaas-slot"));

export default {
  name: "gpuaas",
  exposes: {
    "./Module": "./src/remote-entry.ts",
  },
  shared: {
    react: { singleton: true, strictVersion: true, requiredVersion: "^19.0.0" },
    "react-dom": { singleton: true, strictVersion: true, requiredVersion: "^19.0.0" },
    "react-router-dom": { singleton: true, requiredVersion: "^7.0.0" },
    "@tanstack/react-query": { singleton: true, requiredVersion: "^5.0.0" },
  },
};

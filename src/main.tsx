// SPA entry point.
// Native Federation requires an asynchronous dynamic import so the shared
// scope is initialized before the app bundle loads. Standalone dev/preview
// mounts the MFE into #root directly.
import("./bootstrap").then(({ mount }) => {
  const el = document.getElementById("root");
  if (el) mount(el);
});

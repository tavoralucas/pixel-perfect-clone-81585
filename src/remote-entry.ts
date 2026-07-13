// Public surface exposed to Native Federation hosts.
// A shell host imports this module and calls `mount(el)` to render the MFE.
export { mount, unmount, type MountOptions } from "./bootstrap";

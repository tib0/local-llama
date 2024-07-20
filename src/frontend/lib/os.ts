export function getSep() {
  const isWindows = navigator?.userAgent?.includes("Win");
  return isWindows ? "\\" : "/";
}

export function isWindows() {
  return navigator?.userAgent?.includes("Windows");
}

export function isMac() {
  return navigator?.userAgent?.includes("Macintosh");
}

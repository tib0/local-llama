export function getSep() {
  const isWindows = navigator?.userAgent?.includes("Win");
  return isWindows ? "\\" : "/";
}

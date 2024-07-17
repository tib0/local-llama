export function handleSquirrelEvent() {
  if (process.argv.length === 1) {
    return false;
  }

  const squirrelEvent = process.argv[1];

  switch (squirrelEvent) {
    case "--squirrel-install":
    case "--squirrel-updated":
      return true;
    case "--squirrel-uninstall":
      return true;
    case "--squirrel-obsolete":
      return true;
  }
  return false;
}

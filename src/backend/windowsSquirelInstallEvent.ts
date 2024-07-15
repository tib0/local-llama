import path from "path";
import { spawn as cpSpawn } from "child_process";

export function handleSquirrelEvent() {
  if (process.argv.length === 1) {
    return false;
  }

  const appFolder = path.resolve(process.execPath, "..");
  const rootAtomFolder = path.resolve(appFolder, "..");
  const updateDotExe = path.resolve(path.join(rootAtomFolder, "Update.exe"));
  const exeName = path.basename(process.execPath);

  const spawn = function (command, args) {
    let spawnedProcess;

    try {
      spawnedProcess = cpSpawn(command, args, { detached: true });
    } catch (error) {
      console.error(error);
    }

    return spawnedProcess;
  };

  const spawnUpdate = function (args) {
    return spawn(updateDotExe, args);
  };

  const squirrelEvent = process.argv[1];

  switch (squirrelEvent) {
    case "--squirrel-install":
    case "--squirrel-updated":
      spawnUpdate(["--createShortcut", exeName]);
      return true;
    case "--squirrel-uninstall":
      spawnUpdate(["--removeShortcut", exeName]);
      return true;
    case "--squirrel-obsolete":
      return true;
  }
}

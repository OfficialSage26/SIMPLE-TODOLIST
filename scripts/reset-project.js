#!/usr/bin/env node

/**
 * This script is used to reset the project to a blank state.
 * It deletes or moves the /app, /components, /hooks, /scripts, and /constants directories to /app-example based on user input and creates a new /app directory with an index.tsx and _layout.tsx file.
 * You can remove the `reset-project` script from package.json and safely delete this file after running it.
 */

const fs = require("fs");
const path = require("path");
const readline = require("readline");

const root = process.cwd();
const oldDirs = ["app", "components", "hooks", "constants", "scripts"];
const exampleDir = "app-example";
const newAppDir = "app";
const exampleDirPath = path.join(root, exampleDir);
const isWindows = process.platform === "win32";

const indexContent = `import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
    </View>
  );
}
`;

const layoutContent = `import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack />;
}
`;

// Safe directory move with fallback to copy+delete (more reliable on Windows)
async function safeMoveDir(sourcePath, destinationPath) {
  // Ensure destination's parent exists
  await fs.promises.mkdir(path.dirname(destinationPath), { recursive: true });

  // If destination exists, remove it first to avoid collisions
  if (fs.existsSync(destinationPath)) {
    await fs.promises.rm(destinationPath, { recursive: true, force: true });
  }

  try {
    await fs.promises.rename(sourcePath, destinationPath);
    return;
  } catch (error) {
    // On Windows or cross-device or permission issues, fall back to copy + delete
    const fallbackErrors = new Set([
      "EXDEV", // cross-device link
      "EPERM", // operation not permitted (Windows locks)
      "EACCES",
      "EBUSY",
      "ENOTEMPTY",
      "EEXIST",
    ]);

    if (!fallbackErrors.has(error.code)) {
      throw error;
    }

    // Use fs.cp if available; otherwise, perform manual recursive copy
    const canUseNativeCp = !!fs.promises.cp;

    if (canUseNativeCp) {
      await fs.promises.cp(sourcePath, destinationPath, { recursive: true, force: true });
    } else {
      await copyDirectoryRecursive(sourcePath, destinationPath);
    }

    // Remove source after successful copy
    await fs.promises.rm(sourcePath, { recursive: true, force: true });
  }
}

async function copyDirectoryRecursive(sourcePath, destinationPath) {
  const stat = await fs.promises.stat(sourcePath);
  if (stat.isDirectory()) {
    await fs.promises.mkdir(destinationPath, { recursive: true });
    const entries = await fs.promises.readdir(sourcePath);
    for (const entry of entries) {
      const src = path.join(sourcePath, entry);
      const dst = path.join(destinationPath, entry);
      await copyDirectoryRecursive(src, dst);
    }
  } else {
    await fs.promises.copyFile(sourcePath, destinationPath);
  }
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const moveDirectories = async (userInput) => {
  try {
    const moveInsteadOfDelete = userInput === "y";

    if (moveInsteadOfDelete) {
      await fs.promises.mkdir(exampleDirPath, { recursive: true });
      console.log(`📁 /${exampleDir} directory created.`);
    }

    // Avoid moving the currently running scripts directory while this process is executing (Windows limitation)
    const dirsToProcess = oldDirs.filter((dir) => dir !== "scripts");

    // Move or delete old directories
    for (const dir of dirsToProcess) {
      const oldDirPath = path.join(root, dir);
      if (fs.existsSync(oldDirPath)) {
        if (moveInsteadOfDelete) {
          const newDirPath = path.join(root, exampleDir, dir);
          try {
            await safeMoveDir(oldDirPath, newDirPath);
            console.log(`➡️ /${dir} moved to /${exampleDir}/${dir}.`);
          } catch (err) {
            console.error(`❌ Failed to move /${dir}: ${err.message}`);
          }
        } else {
          await fs.promises.rm(oldDirPath, { recursive: true, force: true });
          console.log(`❌ /${dir} deleted.`);
        }
      } else {
        console.log(`➡️ /${dir} does not exist, skipping.`);
      }
    }

    // Inform user about scripts directory handling
    if (oldDirs.includes("scripts")) {
      console.log(
        moveInsteadOfDelete
          ? "ℹ️ Skipping moving /scripts while the reset script is running. You can move or delete it manually afterwards if needed."
          : "ℹ️ Skipping deleting /scripts while the reset script is running. You can delete it manually afterwards if needed."
      );
    }

    // Create new /app directory
    const newAppDirPath = path.join(root, newAppDir);
    await fs.promises.mkdir(newAppDirPath, { recursive: true });
    console.log("\n📁 New /app directory created.");

    // Create index.tsx
    const indexPath = path.join(newAppDirPath, "index.tsx");
    await fs.promises.writeFile(indexPath, indexContent);
    console.log("📄 app/index.tsx created.");

    // Create _layout.tsx
    const layoutPath = path.join(newAppDirPath, "_layout.tsx");
    await fs.promises.writeFile(layoutPath, layoutContent);
    console.log("📄 app/_layout.tsx created.");

    console.log("\n✅ Project reset complete. Next steps:");
    console.log(
      `1. Run \`npx expo start\` to start a development server.\n2. Edit app/index.tsx to edit the main screen.${
        moveInsteadOfDelete
          ? `\n3. Delete the /${exampleDir} directory when you're done referencing it.\n4. Optionally remove the /scripts directory after you are done with this script.`
          : `\n3. Optionally remove the /scripts directory after you are done with this script.`
      }`
    );
  } catch (error) {
    console.error(`❌ Error during script execution: ${error.message}`);
  }
};

// Support non-interactive usage via CLI flags or env var
// CLI: --move (or --yes) to move to /app-example, --delete (or --no) to delete
// ENV: RESET_MOVE=y|n
const cliArg = (process.argv.find((a) => a === "--move" || a === "--delete" || a === "--yes" || a === "--no") || "").replace(/^--/, "");
const envChoice = (process.env.RESET_MOVE || "").trim().toLowerCase();
const preselected = cliArg === "move" || cliArg === "yes" ? "y" : cliArg === "delete" || cliArg === "no" ? "n" : envChoice === "y" || envChoice === "n" ? envChoice : "";

if (preselected === "y" || preselected === "n") {
  moveDirectories(preselected).finally(() => rl.close());
} else {
  rl.question(
    "Do you want to move existing files to /app-example instead of deleting them? (Y/n): ",
    (answer) => {
      const userInput = (answer.trim().toLowerCase() || "y").startsWith("n") ? "n" : "y";
      if (userInput === "y" || userInput === "n") {
        moveDirectories(userInput).finally(() => rl.close());
      } else {
        console.log("❌ Invalid input. Please enter 'Y' or 'N'.");
        rl.close();
      }
    }
  );
}

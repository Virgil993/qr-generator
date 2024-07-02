const esbuild = require("esbuild");
const esbuildPluginTsc = require("esbuild-plugin-tsc");

esbuild
  .build({
    entryPoints: ["./app.ts"],
    bundle: true,
    platform: "node",
    target: "esnext",
    sourcemap: true,
    outfile: "./build/index.js",
    plugins: [
      esbuildPluginTsc({
        force: true,
      }),
    ],
    packages: "bundle",
  })
  .catch(() => process.exit(1));

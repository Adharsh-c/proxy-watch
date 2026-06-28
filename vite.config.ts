import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import viteTsConfigPaths from "vite-tsconfig-paths";
import { nitro } from "nitro/vite";

export default defineConfig({
  plugins: [
    // 1. Enables TanStack Start features (SSR, Server functions)
    tanstackStart({
      server: { entry: "server" }, 
    }),
    // 2. Compiles React
    viteReact(),
    // 3. Handles CSS styling
    tailwindcss(),
    // 4. Resolves the "@/" path aliases from your tsconfig
    viteTsConfigPaths(),
    // 5. Turns it into a production server (Cloudflare/Node compatible engine)
    nitro(),
  ],
});
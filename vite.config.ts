import react from "@vitejs/plugin-react-swc"
import { execSync } from "child_process"
import { defineConfig } from "vite"
import svgr from "vite-plugin-svgr"
import { default as viteTsConfigPaths } from "vite-tsconfig-paths"

const gitHash = execSync("git rev-parse --short HEAD").toString().trim()
const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, "")
const version = `${gitHash}-${timestamp}`

export default defineConfig({
  plugins: [
    react(),
    viteTsConfigPaths(),
    svgr({
      include: "**/*.svg",
      svgrOptions: { icon: true, replaceAttrValues: { fill: "currentColor" } },
    }),
  ],
  server: { host: true, port: 3000 },
  define: { __PATCH_VERSION__: JSON.stringify(version) },
})

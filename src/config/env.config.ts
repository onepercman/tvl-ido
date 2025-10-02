import { Mode } from "./mode.config"

export const ENV = <const>{
  MODE: import.meta.env.VITE_MODE as Mode,
  API_URL: import.meta.env.VITE_API_URL,
}

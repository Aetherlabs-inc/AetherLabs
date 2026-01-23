import type { Config } from "tailwindcss";
import { aetherPreset } from "@aetherlabs/ui/tailwind-preset";

const config = {
  presets: [aetherPreset],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;

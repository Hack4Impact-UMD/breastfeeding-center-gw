import type { Config } from "tailwindcss";
import forms from "@tailwindcss/forms";

const config: Config = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/react-tailwindcss-datepicker/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  // Plugin order matters! The later plugins will override earlier ones
  plugins: [
    // Base form styles first
    forms({
      strategy: 'class', // Use class strategy to avoid conflicts
    }),
    // Then ShadCN components
    require("./lib/shadcn-plugin")({
      prefix: "", // if you're using a prefix
    }),
  ],

};

export default config;
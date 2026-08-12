// @ts-check
import cloudflare from "@astrojs/cloudflare";
import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  adapter: cloudflare({
    imageService: "compile",
  }),

  session: false,

  integrations: [svelte()],

  vite: {
    plugins: [tailwindcss()],
  },
});

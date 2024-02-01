import "dotenv/config";
import vue from "@vitejs/plugin-vue2";

export default {
  plugins: [vue()],
  // custom port instead of 5173 always
  preview: {
    port: process.env.PORT,
  },
  server: {
    port: process.env.PORT,
  },
};

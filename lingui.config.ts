import type { LinguiConfig } from "@lingui/conf";

const config: LinguiConfig = {
  locales: ["en", "ru"],
  catalogs: [
    {
      path: "shared/src/locale/{locale}",
      include: ["src", "shared"],
    },
  ],
};

export default config;

import React from "react";
import 'antd/dist/reset.css';
import type { Preview } from "@storybook/react";
import { ThemeProvider } from "../src/theme/ThemeProvider";

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    decorators: [
      (Story) => (
        <ThemeProvider>
          <Story />
        </ThemeProvider>
      ),
    ],
  },
};

export default preview;

import React, { ReactNode } from "react";
import {
  createText,
  createBox,
  useTheme as useReTheme,
  ThemeProvider as ReThemeProvider,
} from "@shopify/restyle";
import { ImageStyle, TextStyle, ViewStyle } from "react-native";

const palette = {
  red: "#ff385a",
  white: "#ffffff",
  black: "#000000",
  gray500: "#5b5b5b",
  gray400: "#bebebe",
  gray300: "#dddddd",
};

const theme = {
  colors: {
    background: palette.white,
    foreground: palette.black,

    primary: palette.red,
    primaryContrast: palette.white,

    title: palette.black,
    subTitle: palette.gray500,
    paragraph: palette.gray400,
    subParagraph: palette.gray300,
  },
  spacing: {
    s: 5,
    m: 10,
    l: 15,
    xl: 20,
  },
  borderRadii: {
    s: 5,
    m: 8,
    l: 12,
    xl: 18,
  },
  breakpoints: {
    phone: 0,
    tablet: 768,
  },
  textVariants: {
    sectionTitle: {
      fontSize: 22,
      fontFamily: "Bold",
      paddingVertical: "20",
      paddingHorizontal: "screen",
    },
    body: {
      color: "bodyText",
      fontFamily: "Medium",
      fontSize: 16,
      lineHeight: 23,
    },
  },
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => (
  <ReThemeProvider theme={theme}>{children}</ReThemeProvider>
);

export type Theme = typeof theme;

export const Box = createBox<Theme>();
export const Text = createText<Theme>();

export const useTheme = () => useReTheme<Theme>();

type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle | ImageStyle };

export const makeStyles =
  <T extends NamedStyles<T>>(styles: (theme: Theme) => T) =>
  () => {
    const currentTheme = useTheme();

    return styles(currentTheme);
  };

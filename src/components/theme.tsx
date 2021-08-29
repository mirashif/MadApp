import type { ReactNode } from "react";
import React from "react";
import {
  createText,
  createBox,
  useTheme as useReTheme,
  ThemeProvider as ReThemeProvider,
} from "@shopify/restyle";
import type { ImageStyle, TextStyle, ViewStyle } from "react-native";

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

    dark: palette.black,
    darkGray: palette.gray500,
    gray: palette.gray400,
    lightGray: palette.gray300,
  },
  spacing: {
    s: 5,
    m: 10,
    l: 15,
    xl: 20,
    screen: 22,
  },
  borderRadii: {
    s: 3,
    m: 6,
    l: 12,
    xl: 18,
  },
  breakpoints: {
    phone: 0,
    tablet: 768,
  },
  textVariants: {
    sectionTitle: {
      color: "foreground",
      fontSize: 22,
      fontFamily: "Normal",
    },
    body: {
      color: "foregound",
      fontFamily: "Medium",
      fontSize: 16,
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

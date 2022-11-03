import { Theme } from 'types/theme';
import { useContext, useMemo } from 'react';
import { ExtendedStyleSheet } from 'utils/customStylesheet';
import { StyleSheet } from 'react-native';
import { ThemeContext } from "context/theme/ThemeProvider"

export const useTheme = () => useContext(ThemeContext).store;
export const useThemeValues = () => useContext(ThemeContext);

export const withTheme =
  <T extends StyleSheet.NamedStyles<T> | StyleSheet.NamedStyles<any>>(
    mapStyles: (theme: Theme) => T,
  ) =>
  (): T => {
    const theme = useTheme();
    return useMemo(() => ExtendedStyleSheet(mapStyles(theme)), [theme]);
  };

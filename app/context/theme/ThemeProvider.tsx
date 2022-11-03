import React, {
  memo,
  createContext,
  useState,
  useCallback,
  useMemo,
} from 'react';
import {
  ThemeProviderProps,
  ThemeProviderValue,
  Themes,
} from './ThemeProvider.types';
import { LightMorningTheme } from 'assets/themes';
import { DarkNightTheme } from 'assets/themes';

export const ThemeContext = createContext<ThemeProviderValue>(
  {} as ThemeProviderValue,
);

const themeStore = {
  [Themes.Default]: LightMorningTheme,
  [Themes.Light]: LightMorningTheme,
  [Themes.Dark]: DarkNightTheme,
};

export const ThemeProvider = memo<ThemeProviderProps>(
  ({ children, initialThemeId = Themes.Default }) => {
    const [themeId, setThemeId] = useState(initialThemeId);
    const switchTheme = useCallback((tid: Themes) => setThemeId(tid), []);

    const value = useMemo(
      () => ({
        store: themeStore[themeId],
        themeId,
        switchTheme,
      }),
      [themeId, switchTheme],
    );

    return (
      <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
    );
  },
);

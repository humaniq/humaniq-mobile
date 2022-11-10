import { Theme } from 'types/theme';
import React from 'react';

export enum Themes {
  System = 'system',
  Light = 'light',
  Dark = 'dark',
}

export type ThemeProviderValue = {
  readonly store: Theme;
  readonly themeId: Themes;
  readonly isDarkMode: boolean;
  switchTheme(tid: Themes): void;
};

export type ThemeProviderProps = {
  initialThemeId?: Themes;
  children: React.ReactNode;
};

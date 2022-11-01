import { Theme } from 'types/theme';
import React from 'react';

export enum Themes {
  Default = 'default',
  Light = 'light',
  Dark = 'dark',
}

export type ThemeProviderValue = {
  readonly store: Theme;
  readonly themeId: Themes;
  switchTheme(tid: string): void;
};

export type ThemeProviderProps = {
  initialThemeId?: Themes;
  children: React.ReactNode;
};

import { Theme } from 'types/theme'
import React from 'react'

export enum Themes {
  System = 'system',
  Light = 'light',
  Dark = 'dark',
}

export enum Languages {
  EN = "en",
}

export type ThemeProviderValue = {
  readonly store: Theme;
  readonly themeId: Themes;
  readonly isDarkMode: boolean;
  readonly isLightMode: boolean;
  readonly isSystemMode: boolean;
  readonly appLang: string;
  switchAppLang(lang: string): void;
  switchTheme(tid: Themes): void;
};

export type ThemeProviderProps = {
  initialThemeId?: Themes;
  initialLang?: string
  children: React.ReactNode;
};

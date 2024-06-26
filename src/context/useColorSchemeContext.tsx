import { useMantineColorScheme, type ColorScheme } from '@mantine/core';
import React, { useContext, useState, useMemo, useEffect, createContext, type ReactNode } from 'react';

interface ColorSchemeContextType {
  isColorSchemeLoading: boolean;
  colorScheme: ColorScheme;
  isLightColorScheme: boolean;
  toggleColorScheme: () => void;
}

const initialState: ColorSchemeContextType = {
  isColorSchemeLoading: true,
  colorScheme: 'light',
  isLightColorScheme: true,
  toggleColorScheme: () => undefined,
};

const ColorSchemeContext = createContext<ColorSchemeContextType>(initialState);

export function ColorSchemeContextProvider({ children }: { children: ReactNode }) {
  const [isColorSchemeLoading, setIsColorSchemeLoading] = useState<ColorSchemeContextType['isColorSchemeLoading']>(
    initialState.isColorSchemeLoading
  );
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  const isLightColorScheme = colorScheme === 'light';

  useEffect(() => {
    document?.querySelector('html')?.classList?.remove('light');
    document?.querySelector('html')?.classList?.add(colorScheme);
  }, [colorScheme]);

  useEffect(() => {
    setIsColorSchemeLoading(false);
  }, [colorScheme]);

  const value = useMemo(
    () => ({
      isColorSchemeLoading,
      colorScheme,
      isLightColorScheme,
      toggleColorScheme,
    }),
    [isColorSchemeLoading, colorScheme, isLightColorScheme, toggleColorScheme]
  );

  return <ColorSchemeContext.Provider value={value}>{children}</ColorSchemeContext.Provider>;
}

export default function useColorSchemeContext() {
  return useContext(ColorSchemeContext);
}

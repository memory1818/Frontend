import { MantineProvider, ColorSchemeProvider, type ColorScheme } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { NavigationProgress, nprogress } from '@mantine/nprogress';
import type { AppProps } from 'next/app';
import NextHead from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import '~/theme/styles/global.css';
import useAuthRedirect from '~/api/authRedirect';
import LoadingOverlay from '~/components/LoadingOverlay';
import { DEFAULT_COLOR_SCHEME } from '~/config/settings';
import { CanvasContextProvider } from '~/context/useCanvasContext/useCanvasContext';
import { ColorSchemeContextProvider } from '~/context/useColorSchemeContext';
import { ModalContextProvider } from '~/context/useModalContext';
import useCookies from '~/hooks/useCookies';
import useAvailableFonts from '~/store/useAvailableFonts';
import theme from '~/theme';
import colors from '~/theme/colors';
import { GlobalStyle } from '~/theme/styles/global';
import getAvailableFonts from '~/utils/getAvailableFonts';

function RouterTransition() {
  const router = useRouter();

  useEffect(() => {
    const handleStart = (url: string) => url !== router.asPath && nprogress.start();
    const handleComplete = () => nprogress.complete();

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.asPath]);

  return <NavigationProgress autoReset={true} progressLabel="Loading page" />;
}

export default function App({ Component, pageProps }: AppProps) {
  const { getDeviceHash, setDeviceHash, getSavedColoScheme, setSavedColoScheme } = useCookies();

  const setAvailableFonts = useAvailableFonts((state) => state.setAvailableFonts);

  const [hasAppLoaded, setHasAppLoaded] = useState<boolean>(false);
  const [colorScheme, setColorScheme] = useState<ColorScheme>(DEFAULT_COLOR_SCHEME);

  const toggleColorScheme = (value?: ColorScheme) => {
    const nextColorScheme = value || (colorScheme === 'dark' ? 'light' : 'dark');
    setColorScheme(nextColorScheme);
    setSavedColoScheme(nextColorScheme);
    const html = document.querySelector('html');
    const body = document.querySelector('body');
    if (html && body) {
      html.style.background = colors.htmlBackground[nextColorScheme];
      body.style.background = colors.htmlBackground[nextColorScheme];
    }
  };

  useEffect(() => {
    const savedColorScheme = getSavedColoScheme();
    if (savedColorScheme) {
      toggleColorScheme(savedColorScheme);
    }
    const deviceHash = getDeviceHash();
    if (!deviceHash) {
      setDeviceHash();
    }
    (async () => {
      const result = await getAvailableFonts();
      setAvailableFonts(result);
    })();
    setHasAppLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useAuthRedirect();
  return (
    <>
      <NextHead>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width, height=device-height"
        />
      </NextHead>
      <GlobalStyle />
      <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
        <ColorSchemeContextProvider>
          <CanvasContextProvider>
            <MantineProvider theme={{ colorScheme }} withNormalizeCSS withGlobalStyles>
              <ModalsProvider>
                <ModalContextProvider>
                  {!hasAppLoaded && <LoadingOverlay />}
                  <RouterTransition />
                  <Notifications position="top-right" zIndex={theme.layers.notifications} />
                  <Component {...pageProps} />
                </ModalContextProvider>
              </ModalsProvider>
            </MantineProvider>
          </CanvasContextProvider>
        </ColorSchemeContextProvider>
      </ColorSchemeProvider>
    </>
  );
}

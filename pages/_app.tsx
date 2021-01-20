import { ThemeProvider } from '@material-ui/core/styles';
import { CacheProvider } from '@emotion/react';
import CssBaseline from '@material-ui/core/CssBaseline';
import createCache from '@emotion/cache';
import '../styles/globals.css';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { AppProps } from 'next/dist/next-server/lib/router/router';

import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import React from 'react';
import { createClient, Provider as UrqlProvider } from 'urql';
import theme from '../theme';

import { Provider as ReduxProvider } from 'react-redux';
import { useStore } from '../store';

// Has hydration issues
const LoadingBar = dynamic(() => import('../components/loading-bar'), {
  ssr: false,
});

export const cache = createCache({ key: 'css', prepend: true });

const client = createClient({
  url: 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql',
});

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const store = useStore(pageProps.initialReduxState);

  useEffect(() => {
    const start = () => {
      setLoading(true);
    };
    const end = () => {
      setLoading(false);
    };
    router.events.on('routeChangeStart', start);
    router.events.on('routeChangeComplete', end);
    router.events.on('routeChangeError', end);
    return () => {
      router.events.off('routeChangeStart', start);
      router.events.off('routeChangeComplete', end);
      router.events.off('routeChangeError', end);
    };
  });

  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement!.removeChild(jssStyles);
    }
  }, []);

  return (
    <CacheProvider value={cache}>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {loading && <LoadingBar />}

        <UrqlProvider value={client}>
          <ReduxProvider store={store}>
            <Component {...pageProps} />
          </ReduxProvider>
        </UrqlProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}

export default MyApp;

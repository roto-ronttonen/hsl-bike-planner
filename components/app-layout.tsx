import {
  Box,
  Container,
  Grid,
  makeStyles,
  Paper,
  Tab,
  Tabs,
  Typography,
  useTheme,
} from '@material-ui/core';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import AutocompleteLocation from './autocomplete-location';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },

  main: {
    flexGrow: 1,
    minHeight: '100vh',
  },

  container: {
    height: '100%',
    paddingTop: theme.spacing(3),
    background: theme.palette.background.default,
    marginBottom: theme.spacing(3),
  },
}));

export default function AppLayout({ children }) {
  const classes = useStyles();
  const theme = useTheme();
  const router = useRouter();

  const activeTab = useMemo(() => {
    switch (router.pathname) {
      case '/find-parking':
        return 0;
      case '/rent-bike':
        return 1;
      case '/return-bike':
        return 2;
      default:
        return null;
    }
  }, [router]);

  return (
    <div className={classes.root}>
      <main className={classes.main}>
        <Container fixed className={classes.container}>
          <Box marginBottom={theme.spacing(5)}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h5">Pyöräplänneri</Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <AutocompleteLocation />
              </Grid>
              <Grid item xs={12} md={8}>
                <Grid container alignItems="center" justify="flex-end">
                  <Tabs value={activeTab}>
                    <Link href="/find-parking" scroll={false}>
                      <Tab component="a" label="Löydä parkkipaikka" />
                    </Link>
                    <Link href="/rent-bike" scroll={false}>
                      <Tab component="a" label="Löydä vuokrapyöräa" />
                    </Link>
                    <Link href="/return-bike" scroll={false}>
                      <Tab component="a" label="Palauta vuokrapyörä" />
                    </Link>
                  </Tabs>
                </Grid>
              </Grid>
              {children}
            </Grid>
          </Box>
        </Container>
      </main>
    </div>
  );
}

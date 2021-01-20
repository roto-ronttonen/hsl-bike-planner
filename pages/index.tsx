import { Grid } from '@material-ui/core';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import AppLayout from '../components/app-layout';

export default function HomePage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/find-parking');
  }, []);
  return (
    <AppLayout>
      <Head>
        <title>Pyöräplänneri</title>
      </Head>
      <Grid container>
        <Grid item xs={12}></Grid>
      </Grid>
    </AppLayout>
  );
}

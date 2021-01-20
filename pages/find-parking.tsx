import {
  Box,
  CircularProgress,
  Grid,
  Paper,
  Typography,
} from '@material-ui/core';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import React, { useMemo } from 'react';
import { useQuery } from 'urql';
import AppLayout from '../components/app-layout';
import theme from '../theme';

const Map = dynamic(() => import('../components/map'), { ssr: false });

type QueryResult = {
  bikeParks: {
    name: string;
    spacesAvailable: number;
    lon: number;
    lat: number;
  }[];
};

const BikeParkingQuery = `
  {
    bikeParks {
      name,
      spacesAvailable,
      lon,
      lat
    }
  }
`;

export default function FindParking() {
  const [result] = useQuery<QueryResult>({
    query: BikeParkingQuery,
    pollInterval: 1000,
  });
  const { data, error } = result;

  const content = useMemo(() => {
    if (data) {
      return (
        <Map
          height="80vh"
          markers={data.bikeParks
            .filter((bp) => bp.spacesAvailable > 0)
            .map((bp) => ({
              position: [bp.lat, bp.lon],
              popupText: `${
                bp.name
              }. Paikkoja vapaana: ${bp.spacesAvailable.toString()}`,
            }))}
        />
      );
    }
    if (error) {
      return <Typography variant="h6">Jotain meni pieleen :(</Typography>;
    }

    return (
      <Grid container justify="center" alignItems="center">
        <CircularProgress />
      </Grid>
    );
  }, [data, error]);

  return (
    <AppLayout>
      <Head>
        <title>Pyöräplänneri</title>
      </Head>
      <Grid item xs={12}>
        <Paper>
          <Box>{content}</Box>
        </Paper>
      </Grid>
    </AppLayout>
  );
}

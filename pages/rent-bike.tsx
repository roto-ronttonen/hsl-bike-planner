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

const Map = dynamic(() => import('../components/map'), { ssr: false });

type QueryResult = {
  bikeRentalStations: {
    id: string;
    name: string;
    bikesAvailable: number;
    spacesAvailable: number;
    state: 'Station on' | 'Station off';
    allowDropoff: boolean;
    lon: number;
    lat: number;
  }[];
};

const RentBikeQuery = `
  {
    bikeRentalStations {
      id
      name
      bikesAvailable
      state
      allowDropoff
      lon
      lat
    }
  }
`;

export default function RentBike() {
  const [result] = useQuery<QueryResult>({
    query: RentBikeQuery,
    pollInterval: 1000,
  });
  const { data, error } = result;

  const content = useMemo(() => {
    if (data) {
      return (
        <Map
          height="80vh"
          markers={data.bikeRentalStations
            .filter(
              (brs) => brs.state === 'Station on' && brs.bikesAvailable > 0
            )
            .map((brs) => ({
              key: brs.id,
              position: [brs.lat, brs.lon],
              popupText: `${
                brs.name
              }. Pyöriä vapaana: ${brs.bikesAvailable.toString()}`,
            }))}
        />
      );
    }
    if (error) {
      return <Typography variant="h6">Jotain meni pieleen :(</Typography>;
    }

    return (
      <Box
        height="100%"
        width="100%"
        justifyContent="center"
        alignItems="center"
        display="flex"
      >
        <CircularProgress />
      </Box>
    );
  }, [data, error]);

  return (
    <AppLayout>
      <Head>
        <title>Pyöräplänneri</title>
      </Head>
      <Grid item xs={12}>
        <Paper>
          <Box height="50vh">{content}</Box>
        </Paper>
      </Grid>
    </AppLayout>
  );
}

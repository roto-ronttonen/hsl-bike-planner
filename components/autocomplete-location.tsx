import { TextField, CircularProgress } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import axios from 'axios';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDebounce } from 'use-debounce';
import { AppState, SetLocation } from '../app-state';

type AutocompleteItem = {
  features: {
    type: 'Feature';
    geometry: {
      type: 'Point';
      coordinates: [number, number];
    };
    properties: {
      label: string;
    };
  }[];
};

type Option = {
  label: string;
  value: [number, number];
};

export default function AutocompleteLocation() {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [debouncedSearch] = useDebounce(search, 1000);
  const appState = useSelector((state: AppState) => state);
  const dispatch = useDispatch();
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!!search) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    let active = true;
    try {
      setLoading(true);

      if (!debouncedSearch) {
        return undefined;
      }
      (async () => {
        const response = await axios.get<AutocompleteItem>(
          'https://api.digitransit.fi/geocoding/v1/autocomplete',
          { params: { text: debouncedSearch } }
        );

        const matches = response.data;

        if (active) {
          setOptions(() =>
            matches.features.map((f) => ({
              value: f.geometry.coordinates,
              label: f.properties.label,
            }))
          );
        }
      })();
    } finally {
      setLoading(false);
    }

    return () => {
      active = false;
    };
  }, [debouncedSearch]);

  useEffect(() => {
    if (!open) {
      setOptions([]);
      setSearch('');
    }
  }, [open]);

  const defaultValue = useMemo(() => {
    return {
      label: appState?.location?.name,
      value: appState?.location?.coords
        ? [appState.location.coords[1], appState.location.coords[0]]
        : null,
    };
  }, []);

  return (
    <Autocomplete
      id="location-autocomplete"
      style={{ width: 300 }}
      open={open}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      defaultValue={defaultValue}
      onChange={(e, value: Option) => {
        if (!value) {
          dispatch<SetLocation>({
            type: 'setLocation',
            location: null,
          });
        } else {
          dispatch<SetLocation>({
            type: 'setLocation',
            location: {
              name: value.label,
              coords: [value.value[1], value.value[0]],
              updatedAt: Date.now(),
            },
          });
        }
      }}
      getOptionSelected={(option, value) => option?.value === value?.value}
      getOptionLabel={(option) => option?.label || ''}
      options={options}
      loading={loading}
      noOptionsText={search.length ? 'Ei tuloksia' : 'Kirjoita hakusana'}
      loadingText="Haetaan"
      renderInput={(params) => (
        <TextField
          {...params}
          label="Kirjoita sijainti"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
  );
}

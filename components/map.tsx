import { LatLngTuple, Map as MapType } from 'leaflet';
import React, { useEffect, useMemo, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { useDispatch, useSelector } from 'react-redux';
import { AppState, SetMapMovedTo } from '../app-state';

export type MarkerType = {
  position: LatLngTuple;
  popupText: string;
};

type MapProps = {
  height: number | string;
  markers?: MarkerType[];
};

export default function Map({ height, markers }: MapProps) {
  const appState = useSelector((state: AppState) => state);
  const dispatch = useDispatch();
  const location = appState?.location;
  const mapMovedTo = appState?.mapMovedTo;
  const [map, setMap] = useState<MapType>(null);

  useEffect(() => {
    if (map) {
      map.on('dragend', (e) => {
        dispatch<SetMapMovedTo>({
          type: 'setMapMovedTo',
          location: {
            coords: e.target.getCenter(),
            zoom: e.target.getZoom(),
            updatedAt: Date.now(),
          },
        });
      });
    }

    return () => {
      if (map) {
        map.off('dragend');
      }
    };
  }, [map]);

  useEffect(() => {
    if (location?.coords && map) {
      map.setView(location.coords, 16);
    }
  }, [location]);

  const defaultBounds = useMemo(() => {
    const mapMovedToTime = mapMovedTo?.updatedAt || 0;
    const locationChangedTime = location?.updatedAt || 0;

    if (locationChangedTime > mapMovedToTime) {
      return [location?.coords, 13] as const;
    }

    return [mapMovedTo?.coords, mapMovedTo?.zoom] as const;
  }, [location, mapMovedTo]);

  return (
    <MapContainer
      center={defaultBounds[0] || [60.192059, 24.945831]}
      zoom={defaultBounds[1] || 13}
      scrollWheelZoom={false}
      id="hsl-map"
      style={{ height, width: '100%' }}
      whenCreated={setMap}
    >
      <TileLayer
        maxZoom={19}
        tileSize={512}
        zoomOffset={-1}
        id="hsl-map"
        attribution='Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
        url="https://cdn.digitransit.fi/map/v1/{id}/{z}/{x}/{y}.png"
      />
      {markers?.map((m) => (
        <Marker position={m.position}>
          <Popup>{m.popupText}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

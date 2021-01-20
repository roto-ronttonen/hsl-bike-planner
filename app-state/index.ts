import { LatLngTuple } from 'leaflet';

export type AppState = {
  location?: {
    name: string;
    coords: LatLngTuple;
    updatedAt: number;
  };
  mapMovedTo?: {
    coords: LatLngTuple;
    zoom: number;
    updatedAt: number;
  };
};
export const initialState: AppState = {
  location: null,
  mapMovedTo: null,
};

export type SetAppState = {
  type: 'setAppState';
  state: AppState;
};

export type SetAppStatePartial = {
  type: 'setAppStatePartial';
  state: Partial<AppState>;
};

export type SetLocation = {
  type: 'setLocation';
  location: AppState['location'];
};

export type SetMapMovedTo = {
  type: 'setMapMovedTo';
  location: AppState['mapMovedTo'];
};

export type AppStateActions =
  | SetAppState
  | SetLocation
  | SetAppStatePartial
  | SetMapMovedTo;

export const reducer = (state = initialState, action: AppStateActions) => {
  switch (action.type) {
    case 'setAppState': {
      return { ...action.state };
    }
    case 'setAppStatePartial': {
      return {
        ...state,
        ...action.state,
      };
    }
    case 'setLocation': {
      return {
        ...state,
        location: action.location,
      };
    }
    case 'setMapMovedTo': {
      return {
        ...state,
        mapMovedTo: action.location,
      };
    }
    default:
      return state;
  }
};

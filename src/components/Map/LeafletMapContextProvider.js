// import Leaflet from "leaflet";
import { createContext, useState } from "react";

export const MapContext = createContext(undefined);

const LeafleftMapContextProvider = ({ children }) => {
  const [map, setMap] = useState();
  const [leafletLib, setLeafletLib] = useState();

  return (
    <MapContext.Provider value={{ map, setMap, leafletLib, setLeafletLib }}>
      {children}
    </MapContext.Provider>
  );
};

export default LeafleftMapContextProvider;

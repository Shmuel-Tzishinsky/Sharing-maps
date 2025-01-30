import { useEffect, useMemo, useState } from "react";

import useMapContext from "#components/Map/useMapContext";
import { AppConfig } from "#lib/AppConfig";

const useMarkerData = ({ locations, map, viewportWidth, viewportHeight }) => {
  const [allMarkersBoundCenter, setAllMarkersBoundCenter] = useState({
    minZoom: AppConfig.minZoom - 5,
    centerPos: AppConfig.baseCenter,
  });
  const { leafletLib } = useMapContext();

  // get bounds of all markers
  const allMarkerBounds = useMemo(() => {
    if (locations.length == 0 || !leafletLib) return undefined;

    const coordsSum = [];
    locations.forEach((obj) => {
      obj.markers.forEach((item) => {
        coordsSum.push(item.position);
      });
    });
    return leafletLib.latLngBounds(coordsSum);
  }, [leafletLib, locations]);

  // const clustersByCategory = useMemo(() => {
  //   if (!locations) return undefined;
  //   const groupedLocations = locations.reduce((acc, location) => {
  //     const { category } = location;
  //     if (!acc[category]) {
  //       acc[category] = [];
  //     }
  //     acc[category].push(location);
  //     return acc;
  //   }, {});

  //   const mappedClusters = Object.keys(groupedLocations).map((key) => ({
  //     category: key,
  //     markers: groupedLocations[key],
  //   }));

  //   return mappedClusters;
  // }, [locations]);

  // auto resize map to fit all markers on viewport change
  // it's crucial to set viewport size as dependecy to trigger the map resize

  // bind this
  // useEffect(() => {
  //   if (!allMarkerBounds || !map || Object.keys(allMarkerBounds).length === 0) return;
  //   if (!viewportWidth || !viewportHeight) return;
  //   if (locations.length == 0) return;

  //   map.invalidateSize();
  //   console.log(allMarkerBounds);

  //   setAllMarkersBoundCenter({
  //     minZoom: map.getBoundsZoom(allMarkerBounds),
  //     centerPos: [allMarkerBounds.getCenter().lat, allMarkerBounds.getCenter().lng],
  //   });
  // }, [allMarkerBounds, map, viewportWidth, viewportHeight]);

  return { allMarkersBoundCenter };
};

export default useMarkerData;

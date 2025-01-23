import { createElementObject, createPathComponent, extendContext } from "@react-leaflet/core";
import Leaflet from "leaflet";

import "leaflet.markercluster";

import React from "react";

import { AppConfig } from "#lib/AppConfig";

import LeafletDivIcon from "./LeafletDivIcon";
import MarkerIconWrapper from "./LeafletMarker/MarkerIconWrapper";

const CreateMarkerClusterGroup = (props, context) => {
  const markerClusterGroup = new Leaflet.MarkerClusterGroup({
    removeOutsideVisibleBounds: false,
    disableClusteringAtZoom: 8,
    spiderLegPolylineOptions: {
      className: "hidden",
    },
    // zoomToBoundsOnClick: false,
    iconCreateFunction: (cluster) =>
      LeafletDivIcon({
        source: (
          <MarkerIconWrapper
            color={props.color}
            background={props.background}
            icon={props.icon}
            label={`${cluster.getChildCount()}`}
          />
        ),
        anchor: [AppConfig.ui.markerIconSize / 2, AppConfig.ui.markerIconSize / 2],
      }),
    ...props,
  });

  return createElementObject(
    markerClusterGroup,
    extendContext(context, { layerContainer: markerClusterGroup })
  );
};

export const LeafletCluster = () => createPathComponent(CreateMarkerClusterGroup);

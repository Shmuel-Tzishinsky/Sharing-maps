import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef } from "react";
import { Marker as ReactMarker, Tooltip } from "react-leaflet";
import { AppConfig } from "#lib/AppConfig";
import LeafletDivIcon from "../LeafletDivIcon";
import useMapContext from "../useMapContext";
import MarkerIconWrapper from "./MarkerIconWrapper";

const LeafletPopup = dynamic(() => import("../LeafletPopup"));

export const CustomMarker = ({
  place,
  icon,
  background,
  showLabelInAll,
  dirLabel,
  color,
  isSelected = false,
  editMarkerFunc,
}) => {
  const { map } = useMapContext();
  const markerRef = useRef(null);

  const handlePopupClose = useCallback(() => {
    if (!map) return;
    map?.closePopup();
  }, [map]);

  const handleMarkerClick = useCallback(() => {
    if (!map) return;
    const clampZoom = map.getZoom() < 14 ? 14 : 14;

    const latOffset = clampZoom ? -0.01 : 0;
    const newPosition = [place.position[0] + latOffset, place.position[1]];

    map.setView(newPosition, clampZoom, { animate: true });
  }, [map, place.position]);

  const handleOpenLocation = useCallback(() => {
    const [latitude, longitude] = place.position;
    const urls = {
      waze: `https://waze.com/ul?ll=${latitude},${longitude}&navigate=yes`,
      google: `https://www.google.com/maps?q=${latitude},${longitude}`,
    };
    const confirmChoice = window.confirm("לפתוח בוויז? (ביטול לפתיחה בגוגל מפות)");
    window.open(urls[confirmChoice ? "waze" : "google"]);
  }, [place.position]);

  useEffect(() => {
    if (isSelected && map && markerRef.current) {
      handleMarkerClick();
      const marker = markerRef.current;
      if (marker) {
        setTimeout(() => {
          marker.openPopup();
        }, 300);
      }
    }
  }, [isSelected, map, handleMarkerClick]);

  useEffect(() => {
    if (markerRef.current) {
      const marker = markerRef.current;
      if (marker.getTooltip()) {
        marker.unbindTooltip();
        marker.bindTooltip(place.title, {
          direction: dirLabel || "top",
          offset: [0, -30],
          opacity: showLabelInAll === null ? 0 : 0.9,
          permanent: showLabelInAll,
        });
      }
    }
  }, [dirLabel, showLabelInAll, place.title]);

  return (
    <ReactMarker
      ref={markerRef}
      position={place.position}
      icon={LeafletDivIcon({
        source: (
          <MarkerIconWrapper
            color={color}
            icon={icon}
            background={background}
            className={isSelected ? "scale-125 shadow-lg" : ""}
          />
        ),
        anchor: [AppConfig.ui.markerIconSize / 2, AppConfig.ui.markerIconSize / 2],
      })}
      eventHandlers={{ click: handleMarkerClick }}
      autoPan={false}
      autoPanOnFocus={false}
    >
      <Tooltip
        direction={dirLabel || "top"}
        offset={[0, -60]} // Moved tooltip further up
        opacity={0.9} // Increased opacity
        permanent={showLabelInAll}
        className="rtl" // Added RTL support for Hebrew text
      >
        {place.title}
      </Tooltip>
      <LeafletPopup
        autoPan={false}
        autoClose
        closeButton={false}
        item={place}
        background={background}
        color={color}
        icon={icon}
        handleOpenLocation={handleOpenLocation}
        handlePopupClose={handlePopupClose}
        editMarkerFunc={editMarkerFunc}
      />
    </ReactMarker>
  );
};

export default CustomMarker;

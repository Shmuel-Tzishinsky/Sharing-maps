import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { Marker as ReactMarker } from "react-leaflet";
import { AppConfig } from "#lib/AppConfig";
import LeafletDivIcon from "../LeafletDivIcon";
import useMapContext from "../useMapContext";
import MarkerIconWrapper from "./MarkerIconWrapper";

const LeafletPopup = dynamic(() => import("../LeafletPopup"));

export const CustomMarker = ({ place, icon, background, color, isSelected = false }) => {
  const { map } = useMapContext();
  const markerRef = useRef(null);

  const handlePopupClose = useCallback(() => {
    if (!map) return;
    map?.closePopup();
  }, [map]);

  const handleMarkerClick = useCallback(() => {
    if (!map) return;

    const clampZoom = map.getZoom() < 14 ? 14 : undefined;

    // ההיסט בקואורדינטות - בערך 0.002 מעלות שווה ל-200 מטר
    const latOffset = -0.012; // כלפי צפון

    const newPosition = [
      place.position[0] + latOffset, // מזיז את קו הרוחב צפונה
      place.position[1], // קו האורך נשאר אותו דבר
    ];

    map.setView(newPosition, clampZoom, { animate: true });
  }, [map, place.position]);

  const handleOpenLocation = useCallback(() => {
    const [latitude, longitude] = place.position;
    console.log("🚀 ~ handleOpenLocation ~  latitude, longitude:", latitude, longitude);

    const urls = {
      waze: `https://waze.com/ul?ll=${latitude},${longitude}&navigate=yes`,
      google: `https://www.google.com/maps?q=${latitude},${longitude}`,
    };

    const confirmChoice = window.confirm("לפתוח בוויז? (ביטול לפתיחה בגוגל מפות)");
    window.open(urls[confirmChoice ? "waze" : "google"]);
  }, [place.position]);

  // Effect to handle selected marker from search and open popup
  useEffect(() => {
    if (isSelected && map && markerRef.current) {
      handleMarkerClick();
      // Access the underlying Leaflet marker instance and open its popup
      const marker = markerRef.current;
      if (marker) {
        setTimeout(() => {
          marker.openPopup();
        }, 300); // Small delay to ensure marker is properly positioned
      }
    }
  }, [isSelected, map, handleMarkerClick]);

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
      />
    </ReactMarker>
  );
};

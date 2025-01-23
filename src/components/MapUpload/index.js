import dynamic from "next/dynamic";
import { useEffect } from "react";
import { useResizeDetector } from "react-resize-detector";

import { AppConfig } from "../../lib/AppConfig";
import LeafleftMapContextProvider from "../Map/LeafletMapContextProvider";
import useMapContext from "../Map/useMapContext";
import useMarkerData from "../Map/useMarkerData";

const LeafletCluster = dynamic(
  async () => (await import("../Map/LeafletCluster")).LeafletCluster(),
  {
    ssr: false,
  }
);
const CenterToMarkerButton = dynamic(
  async () => (await import("../Map/ui/CenterButton")).CenterButton,
  {
    ssr: false,
  }
);
const CustomMarker = dynamic(async () => (await import("../Map/LeafletMarker")).CustomMarker, {
  ssr: false,
});
const LocateButton = dynamic(async () => (await import("../Map/ui/LocateButton")).LocateButton, {
  ssr: false,
});
const LeafletMapContainer = dynamic(
  async () => (await import("../Map/LeafletMapContainer")).LeafletMapContainer,
  {
    ssr: false,
  }
);

const LeafletMapInner = ({ data, selectedLocation }) => {
  const { map } = useMapContext();
  const {
    width: viewportWidth,
    height: viewportHeight,
    ref: viewportRef,
  } = useResizeDetector({
    refreshMode: "debounce",
    refreshRate: 200,
  });

  const { allMarkersBoundCenter } = useMarkerData({
    locations: data,
    map,
    viewportWidth,
    viewportHeight,
  });

  const isLoading = !map || !viewportWidth || !viewportHeight;

  /** watch position & zoom of all markers */
  useEffect(() => {
    if (!allMarkersBoundCenter || !map) return;

    const moveEnd = () => {
      map.off("moveend", moveEnd);
    };

    map.flyTo(allMarkersBoundCenter.centerPos, allMarkersBoundCenter.minZoom, { animate: false });
    map.once("moveend", moveEnd);
  }, [allMarkersBoundCenter, map]);

  return (
    <div className="absolute h-full w-full overflow-hidden" ref={viewportRef}>
      <div
        className={`absolute left-0 w-full transition-opacity ${
          isLoading ? "opacity-0" : "opacity-1 "
        }`}
        style={{
          top: AppConfig.ui.topBarHeight,
          width: viewportWidth ?? "100%",
          height: viewportHeight ? viewportHeight - AppConfig.ui.topBarHeight : "100%",
        }}
      >
        {allMarkersBoundCenter && data && (
          <LeafletMapContainer
            center={allMarkersBoundCenter.centerPos}
            zoom={allMarkersBoundCenter.minZoom}
            // maxZoom={AppConfig.maxZoom}
            minZoom={AppConfig.minZoom}
          >
            {!isLoading ? (
              <>
                <CenterToMarkerButton
                  center={allMarkersBoundCenter.centerPos}
                  zoom={allMarkersBoundCenter.minZoom}
                />
                <LocateButton />
                {Object.values(data).map((item) => (
                  <LeafletCluster
                    key={`${item.category}-${item.color}-${item.background}`}
                    icon={item.icon}
                    color={item.color}
                    background={item.background}
                    chunkedLoading
                  >
                    {item.markers.map((marker, ind) => (
                      <CustomMarker
                        place={marker}
                        key={ind}
                        icon={item.icon}
                        color={item.color}
                        background={item.background}
                        isSelected={selectedLocation?.id === marker.id}
                      />
                    ))}
                  </LeafletCluster>
                ))}
              </>
            ) : (
              // we have to spawn at least one element to keep it happy
              // eslint-disable-next-line react/jsx-no-useless-fragment
              <></>
            )}
          </LeafletMapContainer>
        )}
      </div>
    </div>
  );
};

// pass through to get context in <MapInner>
const Map = ({ data, selectedLocation }) => (
  <LeafleftMapContextProvider>
    <LeafletMapInner data={data} selectedLocation={selectedLocation} />
  </LeafleftMapContextProvider>
);

export default Map;

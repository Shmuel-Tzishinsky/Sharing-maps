import { MapOptions } from "leaflet";
import { useEffect } from "react";
import { LayersControl, MapContainer, TileLayer } from "react-leaflet";

import useMapContext from "./useMapContext";

export const LeafletMapContainer = ({ children, ...props }) => {
  const { setMap, setLeafletLib } = useMapContext();

  useEffect(() => {
    if (!setLeafletLib) return;
    import("leaflet").then((leaflet) => {
      setLeafletLib(leaflet);
    });
  }, [setLeafletLib]);

  return (
    <MapContainer
      ref={(e) => setMap && setMap(e || undefined)}
      className="absolute h-full w-full text-white outline-0"
      {...props}
    >
      <LayersControl position="topleft" className="bg-dark">
        <LayersControl.BaseLayer name="Google - מפה רגילה">
          <TileLayer
            url="http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
            subdomains={["mt0", "mt1", "mt2", "mt3"]}
            attribution='&copy; <a href="https://www.google.com/maps">Google Maps</a>'
          />
        </LayersControl.BaseLayer>
        {/* שכבת ברירת מחדל - OpenStreetMap */}
        <LayersControl.BaseLayer checked name="מפת רחובות">
          <TileLayer
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png?lang=he"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
        </LayersControl.BaseLayer>

        {/* שכבת OpenTopoMap */}
        <LayersControl.BaseLayer name="מפה טופוגרפית">
          <TileLayer
            url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
            attribution='Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a>'
          />
        </LayersControl.BaseLayer>

        {/* שכבת CyclOSM */}
        <LayersControl.BaseLayer name="מפת אופניים">
          <TileLayer
            url="https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
        </LayersControl.BaseLayer>

        {/* שכבת Terrain */}
        <LayersControl.BaseLayer name="מפת שטח">
          <TileLayer
            url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>'
          />
        </LayersControl.BaseLayer>

        {/* שכבה לוויינית */}
        <LayersControl.BaseLayer name="לוויין">
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
          />
        </LayersControl.BaseLayer>

        <LayersControl.BaseLayer name="Google - לוויין">
          <TileLayer
            url="http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
            subdomains={["mt0", "mt1", "mt2", "mt3"]}
            attribution='&copy; <a href="https://www.google.com/maps">Google Maps</a>'
          />
        </LayersControl.BaseLayer>

        <LayersControl.BaseLayer name="Esri - לוויין חד">
          <TileLayer
            url="https://clarity.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
          />
        </LayersControl.BaseLayer>

        <LayersControl.BaseLayer name="Esri - מפה טופוגרפית">
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
            attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Carto - Voyager">
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Carto - Positron">
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          />
        </LayersControl.BaseLayer>

        <LayersControl.BaseLayer name="Carto - Dark Matter">
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          />
        </LayersControl.BaseLayer>
        {children}
      </LayersControl>
    </MapContainer>
  );
};

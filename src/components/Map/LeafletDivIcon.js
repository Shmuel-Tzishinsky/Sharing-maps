import Leaflet, { PointExpression } from "leaflet";
import { renderToString } from "react-dom/server";

const LeafletDivIcon = ({ source, anchor }) =>
  Leaflet?.divIcon({
    html: renderToString(source),
    iconAnchor: anchor,
  });

export default LeafletDivIcon;

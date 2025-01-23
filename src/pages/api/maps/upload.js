import dbConnect from "../../../utils/dbConnect";
import Map from "../../../models/Map";

export default async function handler(req, res) {
  await dbConnect();
  console.log("🚀 ~ handler ~ req.body:", req.body);

  if (req.method === "POST") {
    try {
      const { mapName, geojson } = req.body;
      console.log("🚀 ~ handler ~  mapName, geojson:", mapName, geojson);

      const newMap = new Map({ mapName, geojson });
      await newMap.save();

      res.status(200).json({ message: "Map uploaded successfully!", mapId: newMap._id });
    } catch (error) {
      console.log("🚀 ~ handler ~ error:", error.message);
      res.status(500).json({ error: "Failed to upload map" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}

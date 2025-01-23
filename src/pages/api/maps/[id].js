import dbConnect from "../../../utils/dbConnect";
import Map from "../../../models/Map";

export default async function handler(req, res) {
  await dbConnect();

  const { id } = req.query;

  try {
    const map = await Map.findById(id);

    if (!map) {
      return res.status(404).json({ error: "Map not found" });
    }

    res.status(200).json(map);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve map" });
  }
}

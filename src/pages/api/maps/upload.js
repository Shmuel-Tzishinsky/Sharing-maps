import dbConnect from "../../../utils/dbConnect";
import Map from "../../../models/Map";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "POST") {
    try {
      const { name, description, data } = req.body; // Ensure `name` matches the schema

      if (!name || !data) {
        return res.status(400).json({ error: "Name and data are required" });
      }

      const newMap = await Map.create({ name, description, data });

      res.status(200).json({ message: "Map uploaded successfully!", mapId: newMap._id });
    } catch (error) {
      console.log("🚀 ~ handler ~ error:", error.message);
      res.status(500).json({ error: "Failed to upload map" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}

import dbConnect from "../../../utils/dbConnect";
import Map from "../../../models/Map";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "POST") {
    try {
      const records = await Map.find({}, "name _id"); // מחזיר רק name ו-ID

      res.status(200).json({ records });
    } catch (error) {
      res.status(500).json({ error: "Failed to upload map" });
    }
  } else {
    res.status(500).json({ error: "Failed to fetch records" });
  }
}

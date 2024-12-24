import Locations from "src/lib/schema/locationsSchema";

import connectToDatabase from "../../lib/mongodb";

export default async function handler(req, res) {
  try {
    const { category, search } = req.query;

    // חיבור למסד נתונים
    await connectToDatabase();

    // שליפת מיקומים
    const locations = await Locations.find(filter).toArray();
    console.log("🚀 ~ handler ~ locations:", locations);

    // סגירת החיבור
    await client.close();

    // החזרת התוצאות
    res.status(200).json(locations);
  } catch (error) {
    console.error("API error:", error);
    res.status(500).json({
      error: "Failed to fetch locations",
      details: error.message,
    });
  }
}

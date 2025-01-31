import NavMenu from "#components/common/NavMenu";
import { Link } from "lucide-react";
import { useEffect, useState } from "react";

const mapsData = [
  { id: 1, name: "מפת תל אביב", client: "לקוח א", status: "מושלם", updatedAt: "2024-01-10" },
  { id: 2, name: "מפת ירושלים", client: "לקוח ב", status: "בעבודה", updatedAt: "2024-01-15" },
  { id: 3, name: "מפת חיפה", client: "לקוח ג", status: "מושלם", updatedAt: "2024-01-12" },
];

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [mapsData, setMapsData] = useState([]);
  console.log("🚀 ~ HomePage ~ mapsData:", mapsData);
  const filteredMaps = mapsData.filter(
    (map) => map.name.includes(search) || map.client.includes(search)
  );

  useEffect(() => {
    const getAllRecords = async () => {
      try {
        const response = await fetch("/api/maps/getAllRecords", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        console.log("🚀 ~ getAllRecords ~ response:", response);
        if (!response.ok) {
          throw new Error("Failed to save map data");
        }

        const result = await response.json();
        console.log("Map data saved successfully:", result);
        setMapsData(result.records);
      } catch (error) {
        console.error("Error saving map data:", error);
      }
    };

    getAllRecords();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto" dir="rtl">
      <section className="grid grid-cols-1 md:grid-cols-2">
        <div>
          <h3 className="my-5 text-xl">Demo Content</h3>
          <NavMenu />
        </div>
      </section>
      <h1 className="text-2xl font-bold mb-4">ניהול מפות</h1>

      {/* סטטיסטיקות */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-blue-100 rounded-lg">סה"כ מפות: {mapsData.length}</div>
        <div className="p-4 bg-green-100 rounded-lg">לקוחות פעילים: 3</div>
        <div className="p-4 bg-yellow-100 rounded-lg">
          מפות לא גמורות: {mapsData.filter((m) => m.status !== "מושלם").length}
        </div>
      </div>

      {/* כפתור יצירה */}
      <button className="bg-blue-500 text-white px-4 py-2 rounded mb-4 hover:bg-blue-600">
        + צור מפה חדשה
      </button>

      {/* חיפוש */}
      <input
        type="text"
        placeholder="חפש לפי שם מפה או לקוח"
        className="border p-2 w-full rounded mb-4"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* רשימת מפות */}
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-2">המפות שלך</h2>
        {filteredMaps.length > 0 ? (
          filteredMaps.map((map) => {
            console.log("🚀 ~ HomePage ~ map:", map);
            return (
              <div
                key={map._id}
                className="flex justify-between items-center p-2 border-b hover:bg-gray-100 cursor-pointer"
              >
                <div>
                  <a
                    href={`/singleMap/${map._id}`}
                    value={map.name}
                    className="font-medium text-blue-900"
                  >
                    {map.name}
                  </a>
                  {/* <p className="text-sm text-gray-600">{map.client}</p> */}
                </div>
                {/* <span className={map.status === "מושלם" ? "text-green-600" : "text-yellow-600"}>
                	{map.status}
              	</span> */}
              </div>
            );
          })
        ) : (
          <p className="text-gray-500">לא נמצאו מפות.</p>
        )}
      </div>
    </div>
  );
}

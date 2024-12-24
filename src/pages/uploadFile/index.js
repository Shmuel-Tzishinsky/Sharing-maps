// components/KMLUploader.tsx
import { useState } from "react";
import { parseString } from "xml2js";
import LatLngLogo from "#components/TopBar/LatLngLogo";
import { NavMenuVariant } from "#lib/AppConfig";
import NavMenu from "#components/common/NavMenu";

export default function KMLUploader() {
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setResult(null);

    try {
      const fileContent = await file.text();

      parseString(fileContent, (err, result) => {
        if (err) {
          console.log(err);
          return;
        }

        const locations = [];
        let currentId = 1;

        try {
          const folders = result.kml.Document[0].Folder;

          folders.forEach((folder) => {
            // const category = mapFolderNameToCategory(folder.name[0])

            folder.Placemark?.forEach((placemark) => {
              const coordinates = placemark.Point?.[0].coordinates[0].trim().split(",").map(Number);

              if (coordinates && coordinates.length >= 2) {
                const location = {
                  id: currentId.toString(),
                  position: [coordinates[1], coordinates[0]], // Convert to [lat, lng]
                  category: folder.name[0],
                  title: placemark.name[0],
                  description: placemark.description?.[0] || undefined,
                };

                // Extract phone number from description if present
                if (location.description) {
                  const phoneMatch = location.description.match(/(\d{2,3}[-\s]?\d{7})/);
                  if (phoneMatch) {
                    location.phone = phoneMatch[0];
                  }
                }

                locations.push(location);
                currentId++;
              }
            });
          });
          console.log("🚀 ~ parseString ~ locations:", locations);

          console.log(locations);
        } catch (error) {
          console.log(error);
        }
      });
      console.log("🚀 ~ handleFileUpload ~ fileContent:", fileContent);

      // const response = await fetch('/api/upload-kml', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ fileContent }),
      // })

      // const data = await response.json()

      // if (response.ok) {
      //   setResult(`Successfully processed ${data.count} locations`)
      // } else {
      //   setResult(`Error: ${data.message}`)
      // }
    } catch (error) {
      setResult(`Error uploading file: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="">
      <div
        className="left-0 top-0 flex h-20 w-full items-center bg-dark p-3 shadow"
        style={{ zIndex: 1000 }}
      >
        <div className="flex w-full justify-between">
          <LatLngLogo />
          <div className="flex flex-col justify-center">
            <NavMenu variant={NavMenuVariant.TOPNAV} />
          </div>
        </div>
      </div>
      <div className="p-4">
        <input
          type="file"
          accept=".kml"
          onChange={handleFileUpload}
          disabled={uploading}
          className="mb-4"
        />
        {uploading && <p>Processing file...</p>}
        {result && <p>{result}</p>}
      </div>
    </div>
  );
}

// // components/KMLUploader.tsx
// import { useState } from 'react'
// import { parseString } from 'xml2js'

// export default function KMLUploader() {
//   const [uploading, setUploading] = useState(false)
//   const [result, setResult] = useState(null)

//   const handleFileUpload = async event => {
//     const file = event.target.files?.[0]
//     if (!file) return

//     setUploading(true)
//     setResult(null)

//     try {
//       const fileContent = await file.text()

//       parseString(fileContent, (err, result) => {
//         if (err) {
//           console.log(err)
//           return
//         }

//         const locations = []
//         let currentId = 1

//         try {
//           const folders = result.kml.Document[0].Folder

//           folders.forEach(folder => {
//             // const category = mapFolderNameToCategory(folder.name[0])

//             folder.Placemark?.forEach(placemark => {
//               const coordinates = placemark.Point?.[0].coordinates[0].trim().split(',').map(Number)

//               if (coordinates && coordinates.length >= 2) {
//                 const location = {
//                   id: currentId.toString(),
//                   position: [coordinates[1], coordinates[0]], // Convert to [lat, lng]
//                   category: folder.name[0],
//                   title: placemark.name[0],
//                   description: placemark.description?.[0] || undefined,
//                 }

//                 // Extract phone number from description if present
//                 if (location.description) {
//                   const phoneMatch = location.description.match(/(\d{2,3}[-\s]?\d{7})/)
//                   if (phoneMatch) {
//                     location.phone = phoneMatch[0]
//                   }
//                 }

//                 locations.push(location)
//                 currentId++
//               }
//             })
//           })
//           console.log('🚀 ~ parseString ~ locations:', locations)

//           console.log(locations)
//         } catch (error) {
//           console.log(error)
//         }
//       })
//       console.log('🚀 ~ handleFileUpload ~ fileContent:', fileContent)

//       // const response = await fetch('/api/upload-kml', {
//       //   method: 'POST',
//       //   headers: {
//       //     'Content-Type': 'application/json',
//       //   },
//       //   body: JSON.stringify({ fileContent }),
//       // })

//       // const data = await response.json()

//       // if (response.ok) {
//       //   setResult(`Successfully processed ${data.count} locations`)
//       // } else {
//       //   setResult(`Error: ${data.message}`)
//       // }
//     } catch (error) {
//       setResult(`Error uploading file: ${error.message}`)
//     } finally {
//       setUploading(false)
//     }
//   }

//   return (
//     <div className="p-4">
//       <input type="file" accept=".kml" onChange={handleFileUpload} disabled={uploading} className="mb-4" />
//       {uploading && <p>Processing file...</p>}
//       {result && <p>{result}</p>}
//     </div>
//   )
// }
import NavMenu from "#components/common/NavMenu";
import LatLngLogo from "#components/TopBar/LatLngLogo";
import { NavMenuVariant } from "#lib/AppConfig";
import React, { useEffect, useState } from "react";
import * as LucideIcons from "react-icons/bs"; // ייבוא אייקונים לדוגמה

const IconPicker = ({ onSelect }) => {
  const [search, setSearch] = useState("san");
  const [selected, setSelected] = useState(null);

  const icons = Object.entries(LucideIcons).filter(([name]) => {
    try {
      const IconComponent = LucideIcons[name];
      return name !== "createLucideIcon" && name.toLowerCase().includes(search.toLowerCase());
    } catch {
      return false;
    }
  });

  const handleSelect = (iconName) => {
    console.log("🚀 ~ handleSelect ~ iconName:", iconName);
    setSelected(iconName);
    onSelect?.(iconName);
  };

  const renderIcon = (name) => {
    if (name === "icons") return null;
    try {
      const IconComponent = LucideIcons[name];
      return IconComponent ? <IconComponent size={24} /> : null;
    } catch (err) {
      console.log("🚀 ~ renderIcon ~ err:", err);
      return null;
    }
  };

  return (
    <div className="w-full  rounded-lg border  shadow-sm ">
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
      <div className="mb-4 p-4 flex flex-col items-center">
        <h2 className="mb-2 text-xl font-bold">בחר אייקון</h2>
        <input
          type="text"
          placeholder="חיפוש אייקונים..."
          className="w-full rounded border p-2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          dir="rtl"
        />
      </div>
      <div className="flex flex-wrap  max-h-[calc(100vh-230px)] mb-4 p-4 overflow-y-auto overflow-x-hidden justify-evenly ">
        {icons.map(([name]) => (
          <div key={name} className="cursor-pointer p-2 w-28  bg-sky-500 hover:bg-sky-700  ">
            <div
              onClick={() => handleSelect(name)}
              className={`flex min-h-[64px] items-center bg-red justify-center rounded-md border-2 border-transparent  text-[1.6em] shadow-custom  ${
                selected === name ? "border-[1px] border-[black]" : ""
              }`}
            >
              {renderIcon(name)}
            </div>
            <div className="mt-1 overflow-hidden text-ellipsis text-center text-xs">{name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IconPicker;

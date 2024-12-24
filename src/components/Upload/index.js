import { parseString } from 'xml2js'

import Location from '../../models/Location'
// pages/api/upload-kml.ts
import { connectToDatabase } from '../../utils/mongodb'

async function parseKMLFile(fileContent) {
  return new Promise((resolve, reject) => {
    parseString(fileContent, (err, result) => {
      if (err) {
        reject(err)
        return
      }

      const locations = []
      let currentId = 1

      try {
        const folders = result.kml.Document[0].Folder

        folders.forEach(folder => {
          const category = mapFolderNameToCategory(folder.name[0])

          folder.Placemark?.forEach(placemark => {
            const coordinates = placemark.Point?.[0].coordinates[0].trim().split(',').map(Number)

            if (coordinates && coordinates.length >= 2) {
              const location = {
                id: currentId.toString(),
                position: [coordinates[1], coordinates[0]], // Convert to [lat, lng]
                category,
                title: placemark.name[0],
                description: placemark.description?.[0] || undefined,
              }

              // Extract phone number from description if present
              if (location.description) {
                const phoneMatch = location.description.match(/(\d{2,3}[-\s]?\d{7})/)
                if (phoneMatch) {
                  location.phone = phoneMatch[0]
                }
              }

              locations.push(location)
              currentId++
            }
          })
        })

        resolve(locations)
      } catch (error) {
        reject(error)
      }
    })
  })
}

function mapFolderNameToCategory(folderName) {
  const hebrewToCategory = {
    מסעדות: Category.RESTAURANTS,
    אטרקציות: Category.ATTRACTIONS,
    לינה: Category.LODGING,
    "טבע סובב בית ג'ן": Category.NATURE,
    תצפיות: Category.VIEWPOINTS,
  }

  return hebrewToCategory[folderName] || Category.ATTRACTIONS
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { fileContent } = req.body
    if (!fileContent) {
      return res.status(400).json({ message: 'No file content provided' })
    }

    // Parse KML file
    const locations = await parseKMLFile(fileContent)

    // Connect to MongoDB
    await connectToDatabase()

    // Clear existing locations
    await Location.deleteMany({})

    // Insert new locations
    await Location.insertMany(locations)

    return res.status(200).json({
      message: 'KML file processed successfully',
      count: locations.length,
    })
  } catch (error) {
    console.error('Error processing KML file:', error)
    return res.status(500).json({
      message: 'Error processing KML file',
      error: error.message,
    })
  }
}

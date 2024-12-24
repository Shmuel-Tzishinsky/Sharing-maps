import { useState } from 'react'

export default function KMLUploader() {
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState(null)

  const handleFileUpload = async event => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    setResult(null)

    try {
      const fileContent = await file.text()

      const response = await fetch('/api/upload-kml', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileContent }),
      })

      const data = await response.json()

      if (response.ok) {
        setResult(`Successfully processed ${data.count} locations`)
      } else {
        setResult(`Error: ${data.message}`)
      }
    } catch (error) {
      setResult(`Error uploading file: ${error.message}`)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="p-4">
      <input type="file" accept=".kml" onChange={handleFileUpload} disabled={uploading} className="mb-4" />
      {uploading && <p>Processing file...</p>}
      {result && <p>{result}</p>}
    </div>
  )
}

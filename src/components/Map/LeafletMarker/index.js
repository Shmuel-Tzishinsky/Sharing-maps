import dynamic from 'next/dynamic'
import { useCallback, useMemo } from 'react'
import { Marker as ReactMarker } from 'react-leaflet'

import { AppConfig } from '#lib/AppConfig'
import MarkerCategories from '#lib/MarkerCategories'
import { PlaceValues } from '#lib/Places'

import LeafletDivIcon from '../LeafletDivIcon'
import useMapContext from '../useMapContext'
import MarkerIconWrapper from './MarkerIconWrapper'

const LeafletPopup = dynamic(() => import('../LeafletPopup'))

export const CustomMarker = ({ place }) => {
  const { map } = useMapContext()
  const markerCategory = useMemo(() => MarkerCategories[place.category], [place.category])

  const handlePopupClose = useCallback(() => {
    if (!map) return
    map?.closePopup()
  }, [map])

  const handleMarkerClick = useCallback(() => {
    if (!map) return
    const clampZoom = map.getZoom() < 14 ? 14 : undefined
    map.setView(place.position, clampZoom)
  }, [map, place.position])

  // some event for the inner popup cta
  const handleOpenLocation = useCallback(() => {
    // eslint-disable-next-line no-console
    console.log('open location', place)

    const [latitude, longitude] = place.position
    console.log('🚀 ~ handleOpenLocation ~  latitude, longitude:', latitude, longitude)

    const urls = {
      waze: `https://waze.com/ul?ll=${latitude},${longitude}&navigate=yes`,
      google: `https://www.google.com/maps?q=${latitude},${longitude}`,
    }

    const confirmChoice = window.confirm('לפתוח בוויז? (ביטול לפתיחה בגוגל מפות)')
    window.open(urls[confirmChoice ? 'waze' : 'google'])
  }, [])

  return (
    <ReactMarker
      position={place.position}
      icon={LeafletDivIcon({
        source: <MarkerIconWrapper color={markerCategory.color} icon={markerCategory.icon} />,
        anchor: [AppConfig.ui.markerIconSize / 2, AppConfig.ui.markerIconSize / 2],
      })}
      eventHandlers={{ click: handleMarkerClick }}
      autoPan={false}
      autoPanOnFocus={false}
    >
      <LeafletPopup
        autoPan={false}
        autoClose
        closeButton={false}
        item={place}
        color={markerCategory.color}
        icon={markerCategory.icon}
        handleOpenLocation={handleOpenLocation}
        handlePopupClose={handlePopupClose}
      />
    </ReactMarker>
  )
}

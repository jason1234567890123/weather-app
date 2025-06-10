import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L, { Icon } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect, useState } from 'react'
import { useMap } from 'react-leaflet'
import 'leaflet.heat'

interface Props {
  lat: number
  lon: number
  temp: number
  description: string
  icon: string
}

const indiaStations = [
  { name: 'Delhi', lat: 28.6139, lon: 77.2090 },
  { name: 'Mumbai', lat: 19.0760, lon: 72.8777 },
  { name: 'Bangalore', lat: 12.9716, lon: 77.5946 },
  { name: 'Chennai', lat: 13.0827, lon: 80.2707 },
  { name: 'Kolkata', lat: 22.5726, lon: 88.3639 },
  { name: 'Ahmedabad', lat: 23.0225, lon: 72.5714 },
  { name: 'Jaipur', lat: 26.9124, lon: 75.7873 },
  { name: 'Lucknow', lat: 26.8467, lon: 80.9462 },
  { name: 'Hyderabad', lat: 17.3850, lon: 78.4867 },
  { name: 'Pune', lat: 18.5204, lon: 73.8567 },
]
const usaStations = [
    { name: 'New York', lat: 40.7128, lon: -74.0060 },
    { name: 'Los Angeles', lat: 34.0522, lon: -118.2437 },
    { name: 'Chicago', lat: 41.8781, lon: -87.6298 },
    { name: 'Houston', lat: 29.7604, lon: -95.3698 },
    { name: 'Miami', lat: 25.7617, lon: -80.1918 },
]
  
  const ukStations = [
    { name: 'London', lat: 51.5072, lon: -0.1276 },
    { name: 'Manchester', lat: 53.4808, lon: -2.2426 },
    { name: 'Birmingham', lat: 52.4862, lon: -1.8904 },
    { name: 'Edinburgh', lat: 55.9533, lon: -3.1883 },
    { name: 'Glasgow', lat: 55.8642, lon: -4.2518 },
]  

const canadaStations = [
    { name: 'Toronto', lat: 43.65107, lon: -79.347015 },
    { name: 'Vancouver', lat: 49.2827, lon: -123.1207 },
    { name: 'Montreal', lat: 45.5017, lon: -73.5673 },
    { name: 'Calgary', lat: 51.0447, lon: -114.0719 },
    { name: 'Ottawa', lat: 45.4215, lon: -75.6972 },
  ]
  
  const australiaStations = [
    { name: 'Sydney', lat: -33.8688, lon: 151.2093 },
    { name: 'Melbourne', lat: -37.8136, lon: 144.9631 },
    { name: 'Brisbane', lat: -27.4698, lon: 153.0251 },
    { name: 'Perth', lat: -31.9505, lon: 115.8605 },
    { name: 'Adelaide', lat: -34.9285, lon: 138.6007 },
  ]
  
  const germanyStations = [
    { name: 'Berlin', lat: 52.52, lon: 13.405 },
    { name: 'Munich', lat: 48.1351, lon: 11.582 },
    { name: 'Hamburg', lat: 53.5511, lon: 9.9937 },
    { name: 'Frankfurt', lat: 50.1109, lon: 8.6821 },
    { name: 'Cologne', lat: 50.9375, lon: 6.9603 },
  ]
  
  const brazilStations = [
    { name: 'São Paulo', lat: -23.5505, lon: -46.6333 },
    { name: 'Rio de Janeiro', lat: -22.9068, lon: -43.1729 },
    { name: 'Brasília', lat: -15.8267, lon: -47.9218 },
    { name: 'Salvador', lat: -12.9777, lon: -38.5016 },
    { name: 'Fortaleza', lat: -3.7172, lon: -38.5433 },
  ]
  
  const japanStations = [
    { name: 'Tokyo', lat: 35.6762, lon: 139.6503 },
    { name: 'Osaka', lat: 34.6937, lon: 135.5023 },
    { name: 'Nagoya', lat: 35.1815, lon: 136.9066 },
    { name: 'Sapporo', lat: 43.0618, lon: 141.3545 },
    { name: 'Fukuoka', lat: 33.5904, lon: 130.4017 },
  ]
  

const weatherIcon = (icon: string) =>
  new Icon({
    iconUrl: `http://openweathermap.org/img/wn/${icon}@2x.png`,
    iconSize: [50, 50],
    iconAnchor: [25, 50],
    popupAnchor: [0, -40],
  })

  function HeatLayer() {
    const map = useMap()
    const [heatLayer, setHeatLayer] = useState<any>(null)
  
    // Helper to generate random heat points within bounds
    const generateHeatPoints = (bounds: L.LatLngBounds, count: number) => {
      const points: [number, number, number][] = []
      const southWest = bounds.getSouthWest()
      const northEast = bounds.getNorthEast()
      const latRange = northEast.lat - southWest.lat
      const lonRange = northEast.lng - southWest.lng
  
      for (let i = 0; i < count; i++) {
        const lat = southWest.lat + Math.random() * latRange
        const lon = southWest.lng + Math.random() * lonRange
        const intensity = 0.3 + Math.random() * 0.7
        points.push([lat, lon, intensity])
      }
      return points
    }
  
    useEffect(() => {
      if (!map) return
  
      const updateHeat = () => {
        const bounds = map.getBounds()
        const heatData = generateHeatPoints(bounds, 200)
  
        if (heatLayer) {
          heatLayer.setLatLngs(heatData)
        } else {
          const newHeatLayer = (L as any).heatLayer(heatData, {
            radius: 70,
            blur: 50,
            maxZoom: 21,
            gradient: {
              0.1: 'blue',
              0.3: 'cyan',
              0.5: 'lime',
              0.7: 'yellow',
              0.9: 'orange',
              1.0: 'red',
            },
          }).addTo(map)
          setHeatLayer(newHeatLayer)
        }
      }
  
      // Initial load
      updateHeat()
  
      // Update heatmap on move or zoom
      map.on('moveend zoomend', updateHeat)
  
      // Cleanup listener & layer on unmount
      return () => {
        map.off('moveend zoomend', updateHeat)
        if (heatLayer) {
          map.removeLayer(heatLayer)
        }
      }
    }, [map, heatLayer])
  
    return null
  }

export function WeatherMap({ lat, lon, temp, description, icon }: Props) {
    const allStations = [
        ...indiaStations,
        ...usaStations,
        ...ukStations,
        ...canadaStations,
        ...australiaStations,
        ...germanyStations,
        ...brazilStations,
        ...japanStations,
      ]
      

    return (
      <MapContainer center={[lat, lon]} zoom={5} style={{ height: '400px', width: '100%' }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
    
        <Marker position={[lat, lon]} icon={weatherIcon(icon)}>
          <Popup>
            <strong>Current Location</strong><br />
            {temp.toFixed(1)}°C - {description}
          </Popup>
        </Marker>
    
        <HeatLayer />
    
        {allStations.map((station) => (
          <Marker key={station.name} position={[station.lat, station.lon]}>
            <Popup>
              <strong>{station.name} Weather Station</strong><br />
              Lat: {station.lat.toFixed(2)}, Lon: {station.lon.toFixed(2)}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    )
    
}

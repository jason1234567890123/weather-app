import { useEffect, useState } from 'react'
import './App.css'
import { WeatherMap } from './WeatherMap'

interface WeatherData {
  name: string
  coord: { lat: number; lon: number }
  main: { temp: number; feels_like: number; pressure: number; humidity: number }
  weather: { main: string; description: string; icon: string }[]
  wind: { speed: number }
}

function App() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null)
  const [activeTab, setActiveTab] = useState<'weather' | 'map'>('weather')

  const API_KEY = '2c4b3b4b9f291376afbe6692f3497254'

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
        (err) => setError(err.message || 'Unable to retrieve location')
      )
    } else {
      setError('Geolocation not supported')
    }
  }, [])

  useEffect(() => {
    const fetchWeather = async () => {
      if (!location) return
      setLoading(true)
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${location.latitude}&lon=${location.longitude}&units=metric&appid=${API_KEY}`
        )
        if (!res.ok) throw new Error('Failed to fetch weather')
        const data = await res.json()
        setWeather(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Fetch failed')
      } finally {
        setLoading(false)
      }
    }

    fetchWeather()
  }, [location])

  return (
    <div className="weather-app">
      {loading && <div className="loading">Loading...</div>}
      {error && <div className="error-message">{error}</div>}

      {weather && (
        <div className="weather-app-container">
          <div className="tabs">
            <button
              className={activeTab === 'weather' ? 'active' : ''}
              onClick={() => setActiveTab('weather')}
            >
              Weather Info
            </button>
            <button
              className={activeTab === 'map' ? 'active' : ''}
              onClick={() => setActiveTab('map')}
            >
              Map View
            </button>
          </div>

          {activeTab === 'weather' && (
            <div className="weather-info">
              <div className="bento-card location">
                <div className="bento-header">Location</div>
                <div className="bento-value">
                  {weather.name}<br />
                  Lat: {weather.coord.lat.toFixed(2)}, Lon: {weather.coord.lon.toFixed(2)}
                </div>
              </div>

              <div className="bento-card weather">
                <div className="bento-header">Current Weather</div>
                <img
                  src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                  alt={weather.weather[0].description}
                  className="weather-icon"
                />
                <div className="bento-value">{weather.weather[0].main}</div>
                <div>{weather.weather[0].description}</div>
              </div>

              <div className="bento-card temperature">
                <div className="bento-header">Temperature</div>
                <div className="bento-value">{weather.main.temp.toFixed(1)}°C</div>
                <div>Feels Like: {weather.main.feels_like.toFixed(1)}°C</div>
              </div>

              <div className="bento-card humidity">
                <div className="bento-header">Humidity</div>
                <div className="bento-value">{weather.main.humidity}%</div>
              </div>

              <div className="bento-card wind">
                <div className="bento-header">Wind</div>
                <div className="bento-value">{weather.wind.speed} m/s</div>
              </div>

              <div className="bento-card pressure">
                <div className="bento-header">Pressure</div>
                <div className="bento-value">{weather.main.pressure} hPa</div>
              </div>
            </div>
          )}

          {activeTab === 'map' && (
            <div style={{ width: '100%', marginTop: '30px' }}>
              <WeatherMap
                lat={weather.coord.lat}
                lon={weather.coord.lon}
                temp={weather.main.temp}
                description={weather.weather[0].description}
                icon={weather.weather[0].icon}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default App

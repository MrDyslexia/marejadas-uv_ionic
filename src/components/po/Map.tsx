import React,{useRef} from 'react'; // Add this import
import { GoogleMap } from '@capacitor/google-maps';

const MyMap: React.FC = () => {
  const mapRef = useRef<HTMLElement>();
  let newMap: GoogleMap;

  async function createMap() {
    if (!mapRef.current) return;

    newMap = await GoogleMap.create({
      id: 'my-cool-map',
      element: mapRef.current,
      apiKey: process.env.GOOGLE_MAPS_API_KEY || '',
      config: {
        center: {
          lat: 33.6,
          lng: -117.9
        },
        zoom: 8
      }
    })
  }

  return (
    <div className="component-wrapper">
        <h3>Version2222</h3>
      <capacitor-google-map ref={mapRef} style={{
        display: 'inline-block',
        width: 275,
        height: 400
      }}></capacitor-google-map>

      <button onClick={createMap} className=''>Create Map</button>
    </div>
  )
}

export default MyMap;

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import { Company } from '@shared/schema';

// Fix for default marker icon
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

const defaultIcon = new Icon({
  iconUrl: iconUrl,
  iconRetinaUrl: iconRetinaUrl,
  shadowUrl: shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface CompanyMapLeafletProps {
  companies: Company[];
}

export default function CompanyMapLeaflet({ companies }: CompanyMapLeafletProps) {
  // Center of South America roughly
  const center: [number, number] = [-25.0, -60.0]; 

  return (
    <div className="h-[600px] w-full rounded-xl overflow-hidden shadow-2xl border border-white/20 relative z-0">
      <MapContainer 
        center={center} 
        zoom={4} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {companies.map((company) => {
          // Generate random coordinates near the country's center if not provided
          // This is a mock since we don't have real lat/lng in DB yet
          // In a real app, we would geocode the address
          const lat = company.country === 'AR' ? -34.6 + (Math.random() - 0.5) * 5 :
                      company.country === 'BR' ? -15.8 + (Math.random() - 0.5) * 10 :
                      company.country === 'UY' ? -32.5 + (Math.random() - 0.5) * 2 :
                      company.country === 'PY' ? -23.4 + (Math.random() - 0.5) * 2 :
                      company.country === 'CL' ? -33.4 + (Math.random() - 0.5) * 5 :
                      -25.0 + (Math.random() - 0.5) * 10;
                      
          const lng = company.country === 'AR' ? -58.4 + (Math.random() - 0.5) * 5 :
                      company.country === 'BR' ? -47.9 + (Math.random() - 0.5) * 10 :
                      company.country === 'UY' ? -55.7 + (Math.random() - 0.5) * 2 :
                      company.country === 'PY' ? -58.4 + (Math.random() - 0.5) * 2 :
                      company.country === 'CL' ? -70.6 + (Math.random() - 0.5) * 2 :
                      -60.0 + (Math.random() - 0.5) * 10;

          return (
            <Marker key={company.id} position={[lat, lng]} icon={defaultIcon}>
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold text-lg text-slate-800">{company.name}</h3>
                  <p className="text-slate-600 text-sm">{company.description}</p>
                  <div className="mt-2 flex gap-2">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {company.country}
                    </span>
                    {company.verified && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        Verificado
                      </span>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

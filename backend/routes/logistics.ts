import { Request, Response } from 'express';

interface RouteOption {
  id: string;
  name: string;
  modes: { icon: string, label: string, duration: string }[];
  totalDuration: string;
  cost: string;
  incoterm: string;
  recommended: boolean;
  details: {
    port: string;
    insurance: string;
    customs: string;
    risk: string;
  };
}

export async function estimateLogistics(req: Request, res: Response) {
  try {
    const { origin, destination, product } = req.query;
    
    // 1. Simple Region Logic (Mock Distances)
    // In a real app, we'd use a distance API or coordinate calculation
    let baseDistanceKm = 15000; // Default: Far
    
    if (String(origin).includes('Brazil') || String(origin).includes('Chile') || String(origin).includes('Uruguay')) {
        baseDistanceKm = 2000; // Regional
    } else if (String(destination).includes('USA') || String(destination).includes('Mexico')) {
        baseDistanceKm = 9000; // Americas
    } else if (String(destination).includes('Spain') || String(destination).includes('Germany')) {
        baseDistanceKm = 12000; // Atlantic
    }

    // 2. Calculate Costs (Mock Formula)
    // Sea: $0.10 per km per container (approx) + Base $1000
    // Air: $1.50 per kg (assuming 500kg avg shipment) -> $0.50 per km approx for bulk? No, usually per kg.
    // Let's simplified: Air is 5x Sea price.
    
    const seaCostLow = Math.round(1000 + (baseDistanceKm * 0.1));
    const seaCostHigh = Math.round(seaCostLow * 1.25);
    const seaTime = Math.round(baseDistanceKm / 500); // 500km/day ship speed? approx 30km/h * 24 = 720. Slower with ports.
    
    const airCostLow = Math.round(seaCostLow * 4.5);
    const airCostHigh = Math.round(airCostLow * 1.3);
    const airTime = Math.round(baseDistanceKm / 8000) + 2; // Plane speed + 2 days handling

    const routes: RouteOption[] = [
        {
            id: 'sea-standard',
            name: 'Flete Marítimo Estándar (LCL/FCL)',
            modes: [{ icon: 'ship', label: 'Buque Container', duration: `${seaTime} días` }],
            totalDuration: `${seaTime}-${seaTime+5} días`,
            cost: `USD ${seaCostLow} - ${seaCostHigh}`,
            incoterm: 'CFR / CIF',
            recommended: true,
            details: {
                port: `${origin} Port → ${destination} Port`,
                insurance: '0.45% valor carga',
                customs: 'Destino',
                risk: 'Bajo'
            }
        },
        {
            id: 'air-express',
            name: 'Carga Aérea Express',
            modes: [{ icon: 'plane', label: 'Avión Carguero', duration: `${airTime} días` }],
            totalDuration: `${airTime}-${airTime+2} días`,
            cost: `USD ${airCostLow} - ${airCostHigh}`,
            incoterm: 'CPT / CIP',
            recommended: false,
            details: {
                port: `${origin} Airport → ${destination} Airport`,
                insurance: '0.30% valor carga',
                customs: 'Destino',
                risk: 'Muy Bajo'
            }
        }
    ];

    // Multimodal optional if long distance
    if (baseDistanceKm > 5000) {
        routes.push({
            id: 'sea-air',
            name: 'Multimodal (Sea + Air)',
            modes: [
                { icon: 'ship', label: 'Buque', duration: `${Math.round(seaTime/2)} días` },
                { icon: 'plane', label: 'Avión', duration: '3 días' }
            ],
            totalDuration: `${Math.round(seaTime/2) + 5} días`,
            cost: `USD ${Math.round((seaCostLow + airCostLow) / 2)} - ${Math.round((seaCostHigh + airCostHigh) / 2)}`,
            incoterm: 'DAP',
            recommended: false,
            details: {
                port: 'Hub Intermedio (Dubai/Panamá)',
                insurance: 'Incluido',
                customs: 'Simplificado',
                risk: 'Medio'
            }
        });
    }

    res.json({
        success: true,
        data: routes,
        parameters: { distanceKm: baseDistanceKm, origin, destination }
    });

  } catch (error: any) {
    console.error('Error calculating logistics:', error);
    res.status(500).json({ error: error.message });
  }
}

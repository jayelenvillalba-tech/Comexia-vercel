import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { apiRequest } from '@/lib/queryClient';
import { Loader2, Globe, TrendingUp, Users, MapPin, Target, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EstadisticasExpansion {
  totalEmpresas: number;
  totalPaises: number;
  empresasPorContinente: Record<string, number>;
  ultimaActualizacion: string;
}

interface ReporteProgreso {
  estadoActual: {
    empresas: number;
    paises: number;
    continentes: number;
    distribucion: Record<string, number>;
  };
  metaGlobal: {
    paisesObjetivo: number;
    empresasObjetivo: number;
    coberturaCompleta: string;
  };
  progreso: number;
  siguientesFases: string[];
}

export default function ExpansionDashboard() {
  const queryClient = useQueryClient();
  const [cargandoFase1, setCargandoFase1] = useState(false);
  const { toast } = useToast();

  // Query para obtener estadísticas
  const { data: estadisticas, isLoading: loadingStats } = useQuery<{ estadisticas: EstadisticasExpansion }>({
    queryKey: ['/api/expansion/estadisticas'],
    refetchInterval: 30000 // Actualizar cada 30 segundos
  });

  // Query para obtener progreso
  const { data: progreso, isLoading: loadingProgreso } = useQuery<{ reporte: ReporteProgreso }>({
    queryKey: ['/api/expansion/progreso'],
    refetchInterval: 30000
  });

  // Mutación para cargar Fase 1
  const cargarFase1Mutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/expansion/load-fase1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      return response.json();
    },
    onMutate: () => setCargandoFase1(true),
    onSuccess: (data) => {
      console.log('Fase 1 cargada exitosamente:', data);
      // Invalidar queries para refrescar datos
      queryClient.invalidateQueries({ queryKey: ['/api/expansion/estadisticas'] });
      queryClient.invalidateQueries({ queryKey: ['/api/expansion/progreso'] });
      queryClient.invalidateQueries({ queryKey: ['/api/companies/map-data'] });
      setCargandoFase1(false);
    },
    onError: (error) => {
      console.error('Error cargando Fase 1:', error);
      setCargandoFase1(false);
    }
  });

  const ejecutarFase1 = () => {
    cargarFase1Mutation.mutate();
  };

  if (loadingStats || loadingProgreso) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const stats = estadisticas?.estadisticas;
  const reporte = progreso?.reporte;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sistema de Expansión Global</h1>
          <p className="text-muted-foreground">
            Expandiendo cobertura mundial mediante metodología sistemática
          </p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          {reporte?.progreso || 0}% Cobertura Global
        </Badge>
      </div>

      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Empresas</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalEmpresas || 0}</div>
            <p className="text-xs text-muted-foreground">
              Objetivo: {reporte?.metaGlobal.empresasObjetivo || 600}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Países Cubiertos</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalPaises || 0}</div>
            <p className="text-xs text-muted-foreground">
              de {reporte?.metaGlobal.paisesObjetivo || 195} países mundiales
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Continentes</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reporte?.estadoActual.continentes || 0}</div>
            <p className="text-xs text-muted-foreground">
              Cobertura continental activa
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progreso Global</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reporte?.progreso || 0}%</div>
            <Progress value={reporte?.progreso || 0} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Distribución por continente */}
      <Card>
        <CardHeader>
          <CardTitle>Distribución por Continente</CardTitle>
          <CardDescription>
            Empresas verificadas por región geográfica
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {stats?.empresasPorContinente && Object.entries(stats.empresasPorContinente).map(([continente, cantidad]) => (
              <div key={continente} className="text-center">
                <div className="text-2xl font-bold text-blue-600">{cantidad}</div>
                <div className="text-sm text-muted-foreground capitalize">
                  {continente.replace('americas', 'Américas')}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sistema de Fases */}
      <Card>
        <CardHeader>
          <CardTitle>Fases de Expansión</CardTitle>
          <CardDescription>
            Expansión sistemática por prioridad comercial
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Fase 1 */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h3 className="font-semibold">Fase 1: Mercados Emergentes Prioritarios</h3>
              <p className="text-sm text-muted-foreground">
                20 países de alto volumen comercial (Rusia, Turquía, EAU, Vietnam, Arabia Saudí)
              </p>
            </div>
            <Button 
              onClick={ejecutarFase1}
              disabled={cargandoFase1}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {cargandoFase1 ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cargando...
                </>
              ) : (
                'Ejecutar Fase 1'
              )}
            </Button>
          </div>

          {/* Fase 2 */}
          <div className="flex items-center justify-between p-4 border rounded-lg opacity-60">
            <div>
              <h3 className="font-semibold">Fase 2: Mercados Medianos</h3>
              <p className="text-sm text-muted-foreground">
                30 países con PIB $50B-$500B e importancia regional
              </p>
            </div>
            <Badge variant="secondary">Próximamente</Badge>
          </div>

          {/* Fase 3 */}
          <div className="flex items-center justify-between p-4 border rounded-lg opacity-60">
            <div>
              <h3 className="font-semibold">Fase 3: Países Pequeños y Territorios</h3>
              <p className="text-sm text-muted-foreground">
                132 países restantes mediante automatización masiva
              </p>
            </div>
            <Badge variant="secondary">Planificado</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Próximas fases */}
      {reporte?.siguientesFases && (
        <Card>
          <CardHeader>
            <CardTitle>Próximos Pasos</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {reporte.siguientesFases.map((fase, index) => (
                <li key={index} className="flex items-center">
                  <Badge variant="outline" className="mr-2 w-6 h-6 rounded-full p-0 flex items-center justify-center">
                    {index + 1}
                  </Badge>
                  {fase}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Última actualización */}
      {stats?.ultimaActualizacion && (
        <div className="text-center text-sm text-muted-foreground">
          Última actualización: {new Date(stats.ultimaActualizacion).toLocaleString('es-ES')}
        </div>
      )}
    </div>
  );
}
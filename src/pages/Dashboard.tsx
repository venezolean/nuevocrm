import { useState, useEffect } from 'react';
import { useLeads } from '@/hooks/useLeads';
import { useClients } from '@/hooks/useClients';
import { useInteractions } from '@/hooks/useInteractions';
import { DashboardCard } from '@/components/DashboardCard';
import {
  Users,
  MessageSquare,
  Calendar,
  TrendingUp,
  Car,
  DollarSign,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

// Demo data for charts
const leadData = [
  { name: 'Ene', leads: 40 },
  { name: 'Feb', leads: 30 },
  { name: 'Mar', leads: 45 },
  { name: 'Abr', leads: 50 },
  { name: 'May', leads: 65 },
  { name: 'Jun', leads: 55 },
  { name: 'Jul', leads: 70 },
];

const salesData = [
  { name: 'Ene', ventas: 4, leads: 40 },
  { name: 'Feb', ventas: 3, leads: 30 },
  { name: 'Mar', ventas: 5, leads: 45 },
  { name: 'Abr', ventas: 6, leads: 50 },
  { name: 'May', ventas: 8, leads: 65 },
  { name: 'Jun', ventas: 7, leads: 55 },
  { name: 'Jul', ventas: 9, leads: 70 },
];

const sourceData = [
  { name: 'Sitio Web', value: 45 },
  { name: 'Redes Sociales', value: 25 },
  { name: 'Referidos', value: 15 },
  { name: 'Otros', value: 15 },
];

const COLORS = ['#E53935', '#FFC107', '#1E88E5', '#66BB6A'];

export function Dashboard() {
  const { leads, count: leadsCount } = useLeads();
  const { clients, count: clientsCount } = useClients();
  const { interactions } = useInteractions();

  return (
    <div className="p-6">
      <div className="mb-8">
        <motion.h1 
          className="text-3xl font-montserrat font-bold"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          Dashboard
        </motion.h1>
        <motion.p 
          className="text-neutral-500"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          Bienvenido a NexoAuto CRM - Vista general del sistema
        </motion.p>
      </div>

      {/* Metrics Cards */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <DashboardCard
          title="Clientes Totales"
          value={clientsCount}
          icon={<Users className="h-5 w-5" />}
          trend={{ value: 12, isPositive: true }}
          color="primary"
        />
        <DashboardCard
          title="Leads Nuevos"
          value={leadsCount}
          icon={<MessageSquare className="h-5 w-5" />}
          trend={{ value: 8, isPositive: true }}
          color="secondary"
        />
        <DashboardCard
          title="Interacciones"
          value="152"
          icon={<Calendar className="h-5 w-5" />}
          trend={{ value: 5, isPositive: true }}
          color="accent"
        />
        <DashboardCard
          title="Tasa de Conversión"
          value="18%"
          icon={<TrendingUp className="h-5 w-5" />}
          trend={{ value: 2, isPositive: true }}
          color="success"
        />
        <DashboardCard
          title="Vehículos Vendidos"
          value="23"
          icon={<Car className="h-5 w-5" />}
          trend={{ value: 3, isPositive: false }}
          color="warning"
        />
        <DashboardCard
          title="Revenue Mensual"
          value="$245,000"
          icon={<DollarSign className="h-5 w-5" />}
          trend={{ value: 15, isPositive: true }}
          color="accent"
        />
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="shadow-soft-md">
          <CardHeader>
            <CardTitle>Tendencia de Leads</CardTitle>
            <CardDescription>
              Leads generados en los últimos 7 meses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={leadData}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="leads"
                    stroke="#E53935"
                    fill="#E53935"
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft-md">
          <CardHeader>
            <CardTitle>Conversión de Leads</CardTitle>
            <CardDescription>
              Relación entre leads y ventas concretadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={salesData}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" orientation="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar
                    yAxisId="left"
                    dataKey="ventas"
                    name="Ventas"
                    fill="#1E88E5"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="leads"
                    name="Leads"
                    fill="#FFC107"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Second Row: Pie Chart and Recent Interactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="shadow-soft-md">
          <CardHeader>
            <CardTitle>Fuentes de Leads</CardTitle>
            <CardDescription>
              Distribución por canal de adquisición
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sourceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {sourceData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 shadow-soft-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Interacciones Recientes</CardTitle>
              <CardDescription>
                Últimas actividades con clientes
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              Ver Todas
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[1, 2, 3, 4, 5].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">
                      {['Juan Pérez', 'María López', 'Carlos Ruiz', 'Laura Silva', 'Roberto Méndez'][i]}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-neutral-100">
                        {['Llamada', 'Email', 'Visita', 'WhatsApp', 'Test Drive'][i]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {formatDistanceToNow(
                        new Date(Date.now() - i * 24 * 60 * 60 * 1000),
                        { addSuffix: true, locale: es }
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={
                          ['bg-success-500', 'bg-primary-500', 'bg-secondary-500 text-black', 'bg-accent-500', 'bg-neutral-500'][i]
                        }
                      >
                        {['Completada', 'Pendiente', 'En Proceso', 'Programada', 'Cancelada'][i]}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Recent Leads */}
      <Card className="shadow-soft-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Leads Recientes</CardTitle>
            <CardDescription>
              Últimas solicitudes de contacto
            </CardDescription>
          </div>
          <Button variant="outline" size="sm">
            Ver Todos
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Vehículo</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.slice(0, 5).map((lead, i) => (
                <TableRow key={lead.id}>
                  <TableCell className="font-medium">
                    {lead.first_name} {lead.last_name}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm">{lead.email}</span>
                      <span className="text-xs text-neutral-500">{lead.phone}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      className={
                        lead.consultation_type === 'purchase' ? 'bg-success-500' :
                        lead.consultation_type === 'sale' ? 'bg-accent-500' :
                        lead.consultation_type === 'finance' ? 'bg-secondary-500 text-black' :
                        lead.consultation_type === 'test_drive' ? 'bg-primary-500' :
                        'bg-neutral-200 text-neutral-700'
                      }
                    >
                      {lead.consultation_type || 'General'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {lead.vehicle_id && lead.cars ? (
                      <span className="text-sm">
                        {lead.cars.brand} {lead.cars.model}
                      </span>
                    ) : (
                      <span className="text-sm text-neutral-500">Sin vehículo</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-neutral-500">
                      {lead.created_at
                        ? formatDistanceToNow(new Date(lead.created_at), { 
                            addSuffix: true,
                            locale: es 
                          })
                        : 'N/A'}
                    </span>
                  </TableCell>
                  <TableCell>
                    {lead.client_id ? (
                      <Badge className="bg-success-500">Convertido</Badge>
                    ) : (
                      <Badge variant="outline" className="bg-warning-100 text-warning-700 border-warning-300">
                        Pendiente
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {leads.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4 text-neutral-500">
                    No hay leads recientes
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
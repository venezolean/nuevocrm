import { ChangeEvent, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  Filter, 
  MoreVertical,
  PencilLine,
  ExternalLink,
  Mail,
  Phone,
  MessageSquare,
  Car,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { useClients } from '@/hooks/useClients';

export function ClientTable() {
  const {
    clients,
    loading,
    count,
    pageIndex,
    setPageIndex,
    pageSize,
    setPageSize,
    updateClient,
  } = useClients();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<any | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handlePageSizeChange = (value: string) => {
    setPageSize(Number(value));
    setPageIndex(0); // Reset to first page when changing page size
  };

  const handlePreviousPage = () => {
    if (pageIndex > 0) {
      setPageIndex(pageIndex - 1);
    }
  };

  const handleNextPage = () => {
    if ((pageIndex + 1) * pageSize < count) {
      setPageIndex(pageIndex + 1);
    }
  };

  const handleViewClient = (client: any) => {
    setSelectedClient(client);
    setIsDialogOpen(true);
  };

  const totalPages = Math.ceil(count / pageSize);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500 h-4 w-4" />
          <Input
            placeholder="Buscar clientes..."
            className="pl-9 border-neutral-300"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Preferencias</TableHead>
                <TableHead>Fecha Registro</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                // Loading skeletons
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="h-6 w-[120px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-[180px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-[140px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-[100px]" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="h-8 w-8 ml-auto" />
                    </TableCell>
                  </TableRow>
                ))
              ) : clients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-neutral-500">
                    No se encontraron clientes
                  </TableCell>
                </TableRow>
              ) : (
                clients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">
                      {client.name}
                      {client.dni && (
                        <div className="text-xs text-neutral-500 mt-1">
                          DNI: {client.dni}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm">{client.email}</span>
                        <span className="text-xs text-neutral-500">{client.phone}</span>
                        {client.location && (
                          <span className="text-xs text-neutral-500">
                            {client.location}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {client.brand && client.brand.length > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {client.brand[0]}{client.brand.length > 1 ? '+' : ''}
                          </Badge>
                        )}
                        {client.vehicle_type && client.vehicle_type.length > 0 && (
                          <Badge variant="outline" className="text-xs bg-neutral-100">
                            {client.vehicle_type[0]}
                          </Badge>
                        )}
                        {client.budget && (
                          <Badge variant="outline" className="text-xs bg-secondary-100 text-secondary-700">
                            {client.budget}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-neutral-500">
                        {client.created_at
                          ? formatDistanceToNow(new Date(client.created_at), { 
                              addSuffix: true,
                              locale: es 
                            })
                          : 'N/A'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleViewClient(client)}>
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Ver perfil
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <PencilLine className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Mail className="mr-2 h-4 w-4" />
                            Enviar email
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Phone className="mr-2 h-4 w-4" />
                            Llamar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Nueva interacción
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Car className="mr-2 h-4 w-4" />
                            Sugerir vehículos
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t">
          <div className="flex items-center gap-2 mb-4 sm:mb-0">
            <p className="text-sm text-neutral-500">
              Mostrando <span className="font-medium">{pageIndex * pageSize + 1}</span> a{' '}
              <span className="font-medium">
                {Math.min((pageIndex + 1) * pageSize, count)}
              </span>{' '}
              de <span className="font-medium">{count}</span> resultados
            </p>
            <Select
              value={pageSize.toString()}
              onValueChange={handlePageSizeChange}
            >
              <SelectTrigger className="w-[80px]">
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={handlePreviousPage}
                  className={pageIndex === 0 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
              <PaginationItem>
                <span className="text-sm">
                  Página {pageIndex + 1} de {totalPages}
                </span>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  onClick={handleNextPage}
                  className={
                    (pageIndex + 1) * pageSize >= count
                      ? 'pointer-events-none opacity-50'
                      : ''
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>

      {/* Client details dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Perfil del Cliente</DialogTitle>
            <DialogDescription>
              Información completa y preferencias del cliente
            </DialogDescription>
          </DialogHeader>

          {selectedClient && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-neutral-500 mb-1">Información Personal</h3>
                  <p className="text-lg font-semibold">{selectedClient.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Mail className="h-4 w-4 text-neutral-500" />
                    <span className="text-sm">{selectedClient.email}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Phone className="h-4 w-4 text-neutral-500" />
                    <span className="text-sm">{selectedClient.phone}</span>
                  </div>
                  {selectedClient.address && (
                    <div className="mt-2 text-sm">
                      <span className="font-medium">Dirección:</span> {selectedClient.address}
                    </div>
                  )}
                  {selectedClient.work_info && (
                    <div className="mt-1 text-sm">
                      <span className="font-medium">Ocupación:</span> {selectedClient.work_info}
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-medium text-neutral-500 mb-1">Ubicación y Urgencia</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="font-medium">Ubicación:</span> {selectedClient.location || 'No especificada'}
                    </div>
                    <div>
                      <span className="font-medium">Urgencia:</span> {selectedClient.urgency || 'No especificada'}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-neutral-500 mb-1">Información Financiera</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="font-medium">Presupuesto:</span> {selectedClient.budget || 'No especificado'}
                    </div>
                    <div>
                      <span className="font-medium">Plan de ahorro:</span> {selectedClient.savings_plan || 'No especificado'}
                    </div>
                    <div>
                      <span className="font-medium">Acepta permuta:</span> {selectedClient.accepts_trade ? 'Sí' : 'No'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-neutral-500 mb-1">Preferencias de Vehículo</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {selectedClient.vehicle_type && selectedClient.vehicle_type.length > 0 && (
                      <div>
                        <span className="font-medium">Tipo:</span> {selectedClient.vehicle_type.join(', ')}
                      </div>
                    )}
                    {selectedClient.brand && selectedClient.brand.length > 0 && (
                      <div>
                        <span className="font-medium">Marcas:</span> {selectedClient.brand.join(', ')}
                      </div>
                    )}
                    {selectedClient.transmission && selectedClient.transmission.length > 0 && (
                      <div>
                        <span className="font-medium">Transmisión:</span> {selectedClient.transmission.join(', ')}
                      </div>
                    )}
                    {selectedClient.fuel_type && selectedClient.fuel_type.length > 0 && (
                      <div>
                        <span className="font-medium">Combustible:</span> {selectedClient.fuel_type.join(', ')}
                      </div>
                    )}
                    {selectedClient.year_range && selectedClient.year_range.length > 0 && (
                      <div>
                        <span className="font-medium">Años:</span> {selectedClient.year_range.join(' - ')}
                      </div>
                    )}
                    {selectedClient.car_condition && (
                      <div>
                        <span className="font-medium">Condición:</span> {selectedClient.car_condition}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-neutral-500 mb-1">Uso del Vehículo</h3>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedClient.vehicle_use && selectedClient.vehicle_use.length > 0 ? (
                      selectedClient.vehicle_use.map((use: string, index: number) => (
                        <Badge key={index} variant="outline" className="bg-accent-50 text-accent-700">
                          {use}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-neutral-500">No especificado</span>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-neutral-500 mb-1">Fecha de Registro</h3>
                  <p className="text-sm">
                    {selectedClient.created_at 
                      ? new Date(selectedClient.created_at).toLocaleString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cerrar
            </Button>
            <Button>
              <PencilLine className="mr-2 h-4 w-4" />
              Editar Perfil
            </Button>
            <Button variant="secondary">
              <MessageSquare className="mr-2 h-4 w-4" />
              Nueva Interacción
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
import { ChangeEvent, useState } from 'react';
import { QuickInteractionPanel } from './LeadTableInt';
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
  ChevronLeft, 
  ChevronRight,
  UserPlus, 
  MoreVertical,
  ExternalLink,
  Mail,
  Phone,
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
import { useLeads } from '@/hooks/useLeads';

export function LeadTable() {
  const {
    leads,
    loading,
    count,
    pageIndex,
    setPageIndex,
    pageSize,
    setPageSize,
    convertToClient,
  } = useLeads();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConverting, setIsConverting] = useState(false);

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

  const handleViewLead = (lead: any) => {
    setSelectedLead(lead);
    setIsDialogOpen(true);
  };

  const handleConvertToClient = async () => {
    if (!selectedLead) return;
    
    setIsConverting(true);
    const success = await convertToClient(selectedLead);
    
    if (success) {
      setIsDialogOpen(false);
    }
    
    setIsConverting(false);
  };

  const totalPages = Math.ceil(count / pageSize);

  // Helper to get badge color based on consultation type
  const getConsultationTypeBadge = (type: string | null) => {
    switch (type) {
      case 'purchase':
        return <Badge className="bg-success-500">Compra</Badge>;
      case 'sale':
        return <Badge className="bg-accent-500">Venta</Badge>;
      case 'finance':
        return <Badge className="bg-secondary-500 text-black">Financiamiento</Badge>;
      case 'test_drive':
        return <Badge className="bg-primary-500">Test Drive</Badge>;
      default:
        return <Badge variant="outline">General</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500 h-4 w-4" />
          <Input
            placeholder="Buscar leads..."
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
                <TableHead>Tipo</TableHead>
                <TableHead>Vehículo</TableHead>
                <TableHead>Fecha</TableHead>
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
                      <Skeleton className="h-6 w-[80px]" />
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
              ) : leads.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-neutral-500">
                    No se encontraron leads
                  </TableCell>
                </TableRow>
              ) : (
                leads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium">
                      {lead.first_name} {lead.last_name}
                      {lead.client_id && (
                        <Badge variant="outline" className="ml-2 text-xs bg-neutral-100 text-neutral-700">
                          Cliente
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm">{lead.email}</span>
                        <span className="text-xs text-neutral-500">{lead.phone}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getConsultationTypeBadge(lead.consultation_type)}
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
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleViewLead(lead)}>
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Ver detalles
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="mr-2 h-4 w-4" />
                            Enviar email
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Phone className="mr-2 h-4 w-4" />
                            Llamar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            disabled={!!lead.client_id}
                            onClick={() => handleViewLead(lead)}
                          >
                            <UserPlus className="mr-2 h-4 w-4" />
                            Convertir a cliente
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

      {/* Lead details dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalle del Lead</DialogTitle>
            <DialogDescription>
              Información completa del contacto y opciones disponibles
            </DialogDescription>
          </DialogHeader>

          {selectedLead && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-neutral-500 mb-1">Información Personal</h3>
                  <p className="text-lg font-semibold">{selectedLead.first_name} {selectedLead.last_name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Mail className="h-4 w-4 text-neutral-500" />
                    <span className="text-sm">{selectedLead.email}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Phone className="h-4 w-4 text-neutral-500" />
                    <span className="text-sm">{selectedLead.phone}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-neutral-500 mb-1">Tipo de Consulta</h3>
                  <div className="flex items-center gap-2">
                    {getConsultationTypeBadge(selectedLead.consultation_type)}
                    {selectedLead.sub_type && (
                      <span className="text-sm">- {selectedLead.sub_type}</span>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-neutral-500 mb-1">Mensaje</h3>
                  <p className="text-sm p-3 bg-neutral-50 rounded-xl">{selectedLead.message}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-neutral-500 mb-1">Fecha de Contacto</h3>
                  <p className="text-sm">
                    {selectedLead.created_at 
                      ? new Date(selectedLead.created_at).toLocaleString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : 'N/A'}
                  </p>
                </div>

                {selectedLead.vehicle_id && selectedLead.cars && (
                  <div>
                    <h3 className="text-sm font-medium text-neutral-500 mb-1">Vehículo de Interés</h3>
                    <div className="p-3 bg-neutral-50 rounded-xl">
                      <p className="font-medium">{selectedLead.cars.brand} {selectedLead.cars.model}</p>
                      <div className="mt-1 text-sm grid grid-cols-2 gap-x-4 gap-y-1">
                        <span>Año: {selectedLead.cars.year || 'N/A'}</span>
                        <span>Precio: {selectedLead.cars.price ? `$${selectedLead.cars.price.toLocaleString()}` : 'N/A'}</span>
                        <span>Motor: {selectedLead.cars.engine || 'N/A'}</span>
                        <span>Transmisión: {selectedLead.cars.transmission || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                )}
              {selectedLead && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Registrar interacción rápida:</h4>
                  <QuickInteractionPanel
                    clientId={selectedLead.id}
                  />
                </div>
              )}
                <div>
                  <h3 className="text-sm font-medium text-neutral-500 mb-1">Estado</h3>
                  {selectedLead.client_id ? (
                    <Badge className="bg-success-500">Convertido a Cliente</Badge>
                  ) : (
                    <Badge variant="outline" className="bg-warning-100 text-warning-700 border-warning-300">
                      Lead Pendiente
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cerrar
            </Button>
            {selectedLead && !selectedLead.client_id && (
              <Button 
                onClick={handleConvertToClient}
                disabled={isConverting}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                {isConverting ? 'Convirtiendo...' : 'Convertir a Cliente'}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
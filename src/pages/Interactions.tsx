import { useState, useEffect } from 'react';
import { useClients } from '@/hooks/useClients';
import { useInteractions } from '@/hooks/useInteractions';
import { InteractionForm } from '@/components/InteractionForm';
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
  PlusCircle,
  Search, 
  Filter, 
  MoreVertical,
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
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { motion } from 'framer-motion';

export function Interactions() {
  const { clients } = useClients();
  const {
    interactions,
    loading,
    count,
    pageIndex,
    setPageIndex,
    pageSize,
    setPageSize,
  } = useInteractions();

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('list');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const totalPages = Math.ceil(count / pageSize);

  // Helper to get the appropriate badge color for interaction types
  const getInteractionTypeBadge = (type: string[] | null) => {
    if (!type || type.length === 0) return null;
    
    const mainType = type[0];
    
    switch (mainType) {
      case 'Llamada telefónica':
        return <Badge className="bg-primary-500">Llamada</Badge>;
      case 'Email':
        return <Badge className="bg-accent-500">Email</Badge>;
      case 'Visita presencial':
        return <Badge className="bg-success-500">Visita</Badge>;
      case 'WhatsApp':
        return <Badge className="bg-green-500">WhatsApp</Badge>;
      case 'Videollamada':
        return <Badge className="bg-purple-500">Video</Badge>;
      case 'Test drive':
        return <Badge className="bg-secondary-500 text-black">Test Drive</Badge>;
      default:
        return <Badge variant="outline">{mainType}</Badge>;
    }
  };

  // Helper to get the appropriate badge color for stages
  const getStageBadge = (stage: string | null) => {
    if (!stage) return null;
    
    switch (stage) {
      case 'Contacto inicial':
        return <Badge className="bg-blue-500">Inicial</Badge>;
      case 'Presentación':
        return <Badge className="bg-purple-500">Presentación</Badge>;
      case 'Negociación':
        return <Badge className="bg-amber-500">Negociación</Badge>;
      case 'Cierre':
        return <Badge className="bg-green-500">Cierre</Badge>;
      case 'Entrega':
        return <Badge className="bg-teal-500">Entrega</Badge>;
      case 'Seguimiento post-venta':
        return <Badge className="bg-indigo-500">Seguimiento</Badge>;
      default:
        return <Badge variant="outline">{stage}</Badge>;
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <motion.h1 
            className="text-3xl font-montserrat font-bold"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            Interacciones
          </motion.h1>
          <motion.p 
            className="text-neutral-500"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            Historial completo de interacciones con clientes
          </motion.p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nueva Interacción
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="list">Lista</TabsTrigger>
          <TabsTrigger value="calendar">Calendario</TabsTrigger>
        </TabsList>
      </Tabs>

      <TabsContent value="list" className="mt-0">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500 h-4 w-4" />
              <Input
                placeholder="Buscar interacciones..."
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
                    <TableHead>Cliente</TableHead>
                    <TableHead>Vendedor</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Etapa</TableHead>
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
                          <div className="flex items-center gap-2">
                            <Skeleton className="h-8 w-8 rounded-full" />
                            <Skeleton className="h-6 w-[100px]" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-6 w-[80px]" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-6 w-[100px]" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-6 w-[100px]" />
                        </TableCell>
                        <TableCell className="text-right">
                          <Skeleton className="h-8 w-8 ml-auto" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : interactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-neutral-500">
                        No se encontraron interacciones
                      </TableCell>
                    </TableRow>
                  ) : (
                    interactions.map((interaction) => (
                      <TableRow key={interaction.id}>
                        <TableCell className="font-medium">
                          {interaction.clients?.name || 'Cliente no disponible'}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage 
                                src={interaction.sellers?.photo} 
                                alt={interaction.sellers?.name} 
                              />
                              <AvatarFallback>
                                {interaction.sellers?.name ? interaction.sellers.name.charAt(0) : 'N/A'}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{interaction.sellers?.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getInteractionTypeBadge(interaction.type)}
                          {interaction.type && interaction.type.length > 1 && (
                            <span className="text-xs text-neutral-500 ml-1">
                              +{interaction.type.length - 1}
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          {getStageBadge(interaction.stage)}
                        </TableCell>
                        <TableCell>
                          {interaction.interaction_date ? (
                            <span className="text-sm">
                              {format(new Date(interaction.interaction_date), 'dd MMM yyyy', { locale: es })}
                            </span>
                          ) : (
                            'N/A'
                          )}
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
                              <DropdownMenuItem>
                                Ver detalles
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                Programar seguimiento
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
                  Mostrando <span className="font-medium">{Math.min(interactions.length, pageSize)}</span> de{' '}
                  <span className="font-medium">{count}</span> interacciones
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
        </div>
      </TabsContent>

      <TabsContent value="calendar" className="mt-0">
        <div className="rounded-2xl border bg-white p-6">
          <div className="text-center p-12">
            <h3 className="text-lg font-medium mb-2">Vista de Calendario</h3>
            <p className="text-neutral-500">
              La visualización en calendario estará disponible próximamente.
            </p>
          </div>
        </div>
      </TabsContent>

      {/* New Interaction Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nueva Interacción</DialogTitle>
            <DialogDescription>
              Registra una nueva interacción con un cliente
            </DialogDescription>
          </DialogHeader>
          
          <InteractionForm 
            clients={clients.map(client => ({ id: client.id, name: client.name }))}
            onSuccess={() => setIsAddDialogOpen(false)} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
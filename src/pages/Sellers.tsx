import { useState } from 'react';
import { useSellers } from '@/hooks/useSellers';
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
import { Button } from '@/components/ui/button';
import { 
  PlusCircle, 
  MoreVertical,
  PencilLine,
  Trash2,
  User,
  Mail,
  Phone,
} from 'lucide-react';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SellerForm } from '@/components/SellerForm';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function Sellers() {
  const {
    sellers,
    loading,
    count,
    pageIndex,
    setPageIndex,
    pageSize,
    setPageSize,
    deleteSeller,
  } = useSellers();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleViewSeller = (seller: any) => {
    setSelectedSeller(seller);
    setIsViewDialogOpen(true);
  };

  const handleEditSeller = (seller: any) => {
    setSelectedSeller(seller);
    setIsEditDialogOpen(true);
  };

  const handleDeleteSeller = (seller: any) => {
    setSelectedSeller(seller);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteSeller = async () => {
    if (!selectedSeller) return;
    
    setIsDeleting(true);
    const success = await deleteSeller(selectedSeller.id);
    
    if (success) {
      setIsDeleteDialogOpen(false);
    }
    
    setIsDeleting(false);
  };

  const totalPages = Math.ceil(count / pageSize);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
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
            Vendedores
          </motion.h1>
          <motion.p 
            className="text-neutral-500"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            Gestiona el equipo de ventas y sus especialidades
          </motion.p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nuevo Vendedor
        </Button>
      </div>

      <div className="rounded-2xl border overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vendedor</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Especialización</TableHead>
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
                      <div className="flex items-center">
                        <Skeleton className="h-10 w-10 rounded-full mr-3" />
                        <Skeleton className="h-6 w-[120px]" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-[180px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-[120px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-[100px]" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="h-8 w-8 ml-auto" />
                    </TableCell>
                  </TableRow>
                ))
              ) : sellers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-neutral-500">
                    No se encontraron vendedores
                  </TableCell>
                </TableRow>
              ) : (
                sellers.map((seller) => (
                  <TableRow key={seller.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarImage src={seller.photo} alt={seller.name} />
                          <AvatarFallback>{getInitials(seller.name)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{seller.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm">{seller.email}</span>
                        <span className="text-xs text-neutral-500">{seller.phone}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-neutral-100">
                        {seller.specialization}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-neutral-500">
                        {seller.created_at
                          ? formatDistanceToNow(new Date(seller.created_at), { 
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
                          <DropdownMenuItem onClick={() => handleViewSeller(seller)}>
                            <User className="mr-2 h-4 w-4" />
                            Ver perfil
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditSeller(seller)}>
                            <PencilLine className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDeleteSeller(seller)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Eliminar
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
          <div className="mb-4 sm:mb-0">
            <p className="text-sm text-neutral-500">
              Mostrando <span className="font-medium">{sellers.length}</span> de{' '}
              <span className="font-medium">{count}</span> vendedores
            </p>
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

      {/* Add Seller Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Añadir Nuevo Vendedor</DialogTitle>
            <DialogDescription>
              Completa el formulario para registrar un nuevo miembro del equipo de ventas
            </DialogDescription>
          </DialogHeader>
          
          <SellerForm 
            onSuccess={() => setIsAddDialogOpen(false)} 
            mode="create" 
          />
        </DialogContent>
      </Dialog>

      {/* Edit Seller Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Vendedor</DialogTitle>
            <DialogDescription>
              Actualiza la información del vendedor
            </DialogDescription>
          </DialogHeader>
          
          {selectedSeller && (
            <SellerForm 
              seller={selectedSeller}
              onSuccess={() => setIsEditDialogOpen(false)} 
              mode="edit" 
            />
          )}
        </DialogContent>
      </Dialog>

      {/* View Seller Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Perfil del Vendedor</DialogTitle>
            <DialogDescription>
              Información detallada del vendedor
            </DialogDescription>
          </DialogHeader>

          {selectedSeller && (
            <div className="py-4">
              <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={selectedSeller.photo} alt={selectedSeller.name} />
                  <AvatarFallback className="text-xl">{getInitials(selectedSeller.name)}</AvatarFallback>
                </Avatar>
                
                <div className="space-y-4 flex-1">
                  <div>
                    <h3 className="text-2xl font-montserrat font-semibold">{selectedSeller.name}</h3>
                    <Badge variant="outline" className="mt-1 bg-neutral-100">
                      {selectedSeller.specialization}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-neutral-500">Información de Contacto</p>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-neutral-500" />
                        <span>{selectedSeller.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-neutral-500" />
                        <span>{selectedSeller.phone || 'No disponible'}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm text-neutral-500">Registro</p>
                      <p>
                        {selectedSeller.created_at
                          ? new Date(selectedSeller.created_at).toLocaleString('es-ES', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })
                          : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t">
                <h4 className="font-medium mb-3">Métricas de Rendimiento</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-neutral-50 p-3 rounded-xl">
                    <p className="text-sm text-neutral-500">Clientes</p>
                    <p className="text-xl font-medium">24</p>
                  </div>
                  <div className="bg-neutral-50 p-3 rounded-xl">
                    <p className="text-sm text-neutral-500">Ventas</p>
                    <p className="text-xl font-medium">18</p>
                  </div>
                  <div className="bg-neutral-50 p-3 rounded-xl">
                    <p className="text-sm text-neutral-500">Tasa Conversión</p>
                    <p className="text-xl font-medium">22%</p>
                  </div>
                  <div className="bg-neutral-50 p-3 rounded-xl">
                    <p className="text-sm text-neutral-500">Interacciones</p>
                    <p className="text-xl font-medium">156</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Cerrar
            </Button>
            <Button 
              variant="default" 
              onClick={() => {
                setIsViewDialogOpen(false);
                handleEditSeller(selectedSeller);
              }}
            >
              <PencilLine className="mr-2 h-4 w-4" />
              Editar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente al vendedor 
              <span className="font-medium">{selectedSeller?.name}</span> del sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteSeller}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Eliminando...' : 'Eliminar Vendedor'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
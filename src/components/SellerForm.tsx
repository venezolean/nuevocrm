import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSellers } from '@/hooks/useSellers';
import type { Database } from '../types/database.types';

type Seller = Omit<Database['public']['Tables']['sellers']['Row'], 'id' | 'created_at'>;

// Define the form schema with Zod
const formSchema = z.object({
  name: z.string().min(3, 'Nombre muy corto'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(8, 'Teléfono inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  photo: z.string().url('URL de foto inválida'),
  specialization: z.string().min(3, 'Especialización requerida'),
});

type FormValues = z.infer<typeof formSchema>;

interface SellerFormProps {
  seller?: Seller;
  onSuccess?: () => void;
  mode?: 'create' | 'edit';
}

const specializations = [
  'Autos Nuevos',
  'Autos Usados',
  'Vehículos Comerciales',
  'Vehículos de Lujo',
  'Híbridos y Eléctricos',
  'Financiamiento',
];

export function SellerForm({ seller, onSuccess, mode = 'create' }: SellerFormProps) {
  const { addSeller, updateSeller } = useSellers();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize the form with default values or seller values if editing
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: seller?.name || '',
      email: seller?.email || '',
      phone: seller?.phone || '',
      password: seller?.password || '',
      photo: seller?.photo || 'https://i.pravatar.cc/300',
      specialization: seller?.specialization || '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    let success = false;
    
    if (mode === 'edit' && seller) {
      success = await updateSeller(seller.id, data);
    } else {
      success = await addSeller(data);
    }
    
    if (success && onSuccess) {
      onSuccess();
    }
    
    setIsSubmitting(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre completo</FormLabel>
                <FormControl>
                  <Input placeholder="Nombre del vendedor" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="correo@ejemplo.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teléfono</FormLabel>
                <FormControl>
                  <Input placeholder="+1234567890" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contraseña</FormLabel>
                <FormControl>
                  <Input 
                    type="password" 
                    placeholder="Contraseña" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="photo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL de la foto</FormLabel>
                <FormControl>
                  <Input placeholder="https://ejemplo.com/foto.jpg" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="specialization"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Especialización</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar especialización" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {specializations.map((specialization) => (
                      <SelectItem key={specialization} value={specialization}>
                        {specialization}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {field.value && (
          <div className="mt-4 flex justify-center">
            <img 
              src={form.getValues('photo')} 
              alt="Vista previa" 
              className="w-32 h-32 rounded-full object-cover border-4 border-neutral-200" 
            />
          </div>
        )}

        <div className="flex justify-end gap-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting 
              ? 'Guardando...' 
              : mode === 'create' 
                ? 'Crear Vendedor' 
                : 'Actualizar Vendedor'
            }
          </Button>
        </div>
      </form>
    </Form>
  );
}
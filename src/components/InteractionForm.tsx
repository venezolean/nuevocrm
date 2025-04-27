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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon } from 'lucide-react';
import { useInteractions } from '@/hooks/useInteractions';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Checkbox } from '@/components/ui/checkbox';

// Define the form schema with Zod
const formSchema = z.object({
  client_id: z.string({ required_error: 'Por favor selecciona un cliente' }),
  interaction_date: z.date({ required_error: 'La fecha es requerida' }),
  type: z.array(z.string()).min(1, 'Selecciona al menos un tipo de interacción'),
  reason: z.string().optional(),
  vehicle: z.string().optional(),
  stage: z.string({ required_error: 'Selecciona la etapa de venta' }),
  notes: z.string().min(5, 'Las notas deben tener al menos 5 caracteres'),
});

// Sample data for the form select options
const interactionTypes = [
  'Llamada telefónica',
  'Email',
  'Visita presencial',
  'WhatsApp',
  'Videollamada',
  'Test drive',
];

const stageOptions = [
  'Contacto inicial',
  'Presentación',
  'Negociación',
  'Cierre',
  'Entrega',
  'Seguimiento post-venta',
];

type FormValues = z.infer<typeof formSchema>;

interface InteractionFormProps {
  clients: { id: string; name: string }[];
  onSuccess?: () => void;
}

export function InteractionForm({ clients, onSuccess }: InteractionFormProps) {
  const { addInteraction } = useInteractions();
  const { seller } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize the form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      interaction_date: new Date(),
      type: [],
      reason: '',
      vehicle: '',
      stage: '',
      notes: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    if (!seller) return;
    
    setIsSubmitting(true);
    
    const interaction = {
      ...data,
      seller_id: seller.id,
      interaction_date: data.interaction_date.toISOString(),
    };
    
    const success = await addInteraction(interaction);
    
    if (success && onSuccess) {
      form.reset();
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
            name="client_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cliente</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar cliente" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="interaction_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Fecha y hora</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={`w-full justify-start text-left font-normal ${
                          !field.value && 'text-muted-foreground'
                        }`}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(field.value, "PPP", { locale: es })
                        ) : (
                          <span>Seleccionar fecha</span>
                        )}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="type"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel>Tipo de interacción</FormLabel>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {interactionTypes.map((type) => (
                  <FormField
                    key={type}
                    control={form.control}
                    name="type"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={type}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(type)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, type])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== type
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {type}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="reason"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Motivo</FormLabel>
                <FormControl>
                  <Input placeholder="Consulta, negociación, etc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="vehicle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vehículo (opcional)</FormLabel>
                <FormControl>
                  <Input placeholder="Modelo y detalles" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="stage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Etapa de venta</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar etapa" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {stageOptions.map((stage) => (
                    <SelectItem key={stage} value={stage}>
                      {stage}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notas</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Detalles de la interacción" 
                  className="min-h-[120px]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : 'Guardar Interacción'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
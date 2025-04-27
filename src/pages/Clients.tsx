import { ClientTable } from '@/components/ClientTable';
import { motion } from 'framer-motion';

export function Clients() {
  return (
    <div className="p-6">
      <div className="mb-8">
        <motion.h1 
          className="text-3xl font-montserrat font-bold"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          Clientes
        </motion.h1>
        <motion.p 
          className="text-neutral-500"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          Base de datos completa de clientes y sus preferencias
        </motion.p>
      </div>

      <ClientTable />
    </div>
  );
}
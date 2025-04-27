import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  UserCog,
  Calendar,
  Car,
  Settings,
  HelpCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SidebarProps {
  isOpen: boolean;
}

export function Sidebar({ isOpen }: SidebarProps) {
  const location = useLocation();

  const menuItems = [
    {
      title: 'Dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
      path: '/',
    },
    {
      title: 'Leads',
      icon: <MessageSquare className="h-5 w-5" />,
      path: '/leads',
    },
    {
      title: 'Clientes',
      icon: <Users className="h-5 w-5" />,
      path: '/clients',
    },
    {
      title: 'Vendedores',
      icon: <UserCog className="h-5 w-5" />,
      path: '/sellers',
    },
    {
      title: 'Interacciones',
      icon: <Calendar className="h-5 w-5" />,
      path: '/interactions',
    },
    {
      title: 'Inventario',
      icon: <Car className="h-5 w-5" />,
      path: '/inventory',
    },
    { divider: true },
    {
      title: 'Configuración',
      icon: <Settings className="h-5 w-5" />,
      path: '/settings',
    },
    {
      title: 'Ayuda',
      icon: <HelpCircle className="h-5 w-5" />,
      path: '/help',
    },
  ];

  // Sidebar animation variants
  const sidebarVariants = {
    open: {
      x: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
    closed: {
      x: '-100%',
      opacity: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={isOpen ? 'open' : 'closed'}
        variants={sidebarVariants}
        className={cn(
          'fixed top-16 left-0 bottom-0 z-40 w-72 bg-white border-r border-neutral-200 lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <ScrollArea className="h-full py-6 px-4">
          <nav className="space-y-1">
            {menuItems.map((item, index) =>
              item.divider ? (
                <div key={index} className="h-px bg-neutral-200 my-4" />
              ) : (
                <Link
                  key={index}
                  to={item.path}
                  className={cn(
                    'nav-item',
                    location.pathname === item.path && 'active'
                  )}
                >
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              )
            )}
          </nav>
          
          <div className="mt-8 p-4 bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl">
            <p className="text-sm font-medium text-primary-700 mb-2">¿Necesitas ayuda?</p>
            <p className="text-xs text-primary-600 mb-3">Consulta nuestra guía de uso o contacta a soporte.</p>
            <Link 
              to="/help" 
              className="text-xs font-medium text-primary-700 hover:text-primary-800 inline-flex items-center"
            >
              Ver más
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="ml-1 h-3 w-3"
              >
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </Link>
          </div>
        </ScrollArea>
      </motion.aside>
    </>
  );
}
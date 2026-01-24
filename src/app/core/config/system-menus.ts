import {
  Calendar,
  Users,
  Settings,
  GraduationCap,
  BookOpen,
  LogOut,
  LayoutDashboard
} from 'lucide-angular';

export const SYSTEM_MENUS: Record<string, any[]> = {

  citas: [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      route: '/systems/citas/dashboard',
      roles: ['root', 'admin', 'manager', 'user']
    },
    {
      label: 'Citas',
      icon: Calendar,
      route: '/systems/citas/agenda',
      roles: ['root', 'admin', 'manager']
    },
    {
      label: 'Clientes',
      icon: Users,
      route: '/systems/citas/clientes',
      roles: ['root', 'admin']
    },
    {
      label: 'Configuración',
      icon: Settings,
      route: '/systems/citas/configuracion',
      roles: ['root', 'admin']
    }
  ],

  escolar: [
    {
      label: 'Dashboard',
      icon: GraduationCap,
      route: '/systems/escolar/dashboard',
      roles: ['root', 'admin', 'teacher']
    },
    {
      label: 'Mis clases',
      icon: BookOpen,
      route: '/escolar/clases',
      roles: ['root', 'student']
    }
  ],

  inventarios: [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      route: '/escolar/dashboard',
      roles: ['root', 'admin', 'teacher']
    }
  ]

};

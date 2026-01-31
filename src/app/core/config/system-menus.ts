import {
  Calendar,
  Users,
  Settings,
  GraduationCap,
  BookOpen,
  LogOut,
  LayoutDashboard,
  Briefcase,
  Clock,
  Bell,
  BarChart,
  UserCheck,
  Contact,
  ShieldCheck,
  UsersRound,
  UserRound
} from 'lucide-angular';

export const SYSTEM_MENUS: Record<string, any[]> = {

  citas: [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      route: '/sistemas/citas/dashboard',
      roles: ['root', 'admin', 'manager', 'user', 'owner']
    },
    {
      label: 'Agenda',
      icon: Calendar,
      route: '/sistemas/citas/agenda',
      roles: ['root', 'admin', 'manager', 'owner']
    },
    {
      label: 'Clientes',
      icon: UserRound,
      route: '/sistemas/citas/clientes',
      roles: ['root', 'admin', 'owner']
    },
    {
      label: 'Servicios',
      icon: Briefcase,
      route: '/sistemas/citas/servicios',
      roles: ['root', 'admin', 'owner']
    },
    {
      label: 'Horarios',
      icon: Clock,
      route: '/sistemas/citas/horarios',
      roles: ['root', 'admin', 'owner']
    },
    {
      label: 'Recordatorios',
      icon: Bell,
      route: '/sistemas/citas/recordatorios',
      roles: ['root', 'admin', 'owner']
    },
    {
      label: 'Reportes',
      icon: BarChart,
      route: '/sistemas/citas/reportes',
      roles: ['root', 'admin', 'owner']
    },
    {
      label: 'Equipo',
      icon: UsersRound,
      route: '/sistemas/citas/equipo',
      roles: ['root', 'admin', 'owner']
    },
    {
      label: 'Configuración',
      icon: Settings,
      route: '/sistemas/citas/configuracion',
      roles: ['root', 'admin', 'owner']
    }
  ],

  escolar: [
    {
      label: 'Dashboard',
      icon: GraduationCap,
      route: '/sistemas/escolar/dashboard',
      roles: ['root', 'admin', 'teacher', 'owner']
    },
    {
      label: 'Mis clases',
      icon: BookOpen,
      route: '/escolar/clases',
      roles: ['root', 'student', 'owner']
    }
  ],

  inventarios: [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      route: '/escolar/dashboard',
      roles: ['root', 'admin', 'teacher', 'owner']
    }
  ]

};

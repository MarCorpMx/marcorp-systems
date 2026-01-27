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
      route: '/systems/citas/dashboard',
      roles: ['root', 'admin', 'manager', 'user', 'owner']
    },
    {
      label: 'Agenda',
      icon: Calendar,
      route: '/systems/citas/agenda',
      roles: ['root', 'admin', 'manager', 'owner']
    },
    {
      label: 'Clientes',
      icon: UserRound,
      route: '/systems/citas/clientes',
      roles: ['root', 'admin', 'owner']
    },
    {
      label: 'Servicios',
      icon: Briefcase,
      route: '/systems/citas/clientes',
      roles: ['root', 'admin', 'owner']
    },
    {
      label: 'Horarios',
      icon: Clock,
      route: '/systems/citas/clientes',
      roles: ['root', 'admin', 'owner']
    },
    {
      label: 'Recordatorios',
      icon: Bell,
      route: '/systems/citas/clientes',
      roles: ['root', 'admin', 'owner']
    },
    {
      label: 'Reportes',
      icon: BarChart,
      route: '/systems/citas/clientes',
      roles: ['root', 'admin', 'owner']
    },
    {
      label: 'Equipo',
      icon: UsersRound,
      route: '/systems/citas/clientes',
      roles: ['root', 'admin', 'owner']
    },
    {
      label: 'Configuración',
      icon: Settings,
      route: '/systems/citas/configuracion',
      roles: ['root', 'admin', 'owner']
    }
  ],

  escolar: [
    {
      label: 'Dashboard',
      icon: GraduationCap,
      route: '/systems/escolar/dashboard',
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

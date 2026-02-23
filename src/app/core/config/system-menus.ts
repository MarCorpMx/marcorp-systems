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
      featureKey: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      route: '/sistemas/citas/dashboard',
      roles: ['root', 'admin', 'manager', 'user', 'owner'],
      core: true
    },
    {
      featureKey: 'agenda',
      label: 'Agenda',
      icon: Calendar,
      route: '/sistemas/citas/agenda',
      roles: ['root', 'admin', 'manager', 'owner']
    },
    {
      featureKey: 'clients',
      label: 'Clientes',
      icon: UserRound,
      route: '/sistemas/citas/clientes',
      roles: ['root', 'admin', 'owner']
    },
    {
      featureKey: 'services',
      label: 'Servicios',
      icon: Briefcase,
      route: '/sistemas/citas/servicios',
      roles: ['root', 'admin', 'owner']
    },
    {
      featureKey: 'schedule',
      label: 'Horarios',
      icon: Clock,
      route: '/sistemas/citas/horarios',
      roles: ['root', 'admin', 'owner']
    },
    {
      featureKey: 'reminders',
      label: 'Recordatorios',
      icon: Bell,
      route: '/sistemas/citas/recordatorios',
      roles: ['root', 'admin', 'owner']
    },
    {
      featureKey: 'reports',
      label: 'Reportes',
      icon: BarChart,
      route: '/sistemas/citas/reportes',
      roles: ['root', 'admin', 'owner']
    },
    {
      featureKey: 'team',
      label: 'Equipo',
      icon: UsersRound,
      route: '/sistemas/citas/equipo',
      roles: ['root', 'admin', 'owner']
    },
    {
      featureKey: 'settings',
      label: 'Configuración',
      icon: Settings,
      route: '/sistemas/citas/configuracion',
      roles: ['root', 'admin', 'owner'],
      core: true
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

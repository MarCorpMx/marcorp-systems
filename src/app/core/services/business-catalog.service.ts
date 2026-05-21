import { Injectable } from '@angular/core';

type TerminologyItem = {
  singular: string;
  plural: string;
};

type BusinessNiche = {
  value: string;
  label: string;

  icon: string;
  color: string;

  audience: {
    singular: string;
    plural: string;
    informal?: string;
  };

  terminology: {
    clients: TerminologyItem;
    appointments: TerminologyItem;
    services: TerminologyItem;
    team: TerminologyItem;
    booking: TerminologyItem;
  };

  ui: {
    dashboard_description: string;
    dashboard_empty_state: string;

    clients_description: string;
    clients_empty_state: string;
    clients_cta: string;

    services_description: string;
    services_empty_state: string;
    services_cta: string;

    appointments_description: string;
    appointments_empty_state: string;
    appointments_cta: string;

    booking_description: string;
    booking_empty_state: string;
    booking_cta: string;

    team_description: string;
    team_empty_state: string;
    team_cta: string;
  };

  marketing: {
    headline: string;
    empty_state: string;
    cta: string;
  };

  suggestion: {
    name: string;
    duration: number;
    price: number;
    mode: 'presential' | 'online' | 'hybrid';
  };

  presets: string[];

  agenda: {
    appointment_duration: number;
    break_between_appointments: number;
    label: string;

    schedule: {
      start: string;
      end: string;
      working_days: number[];
    };
  };
};

@Injectable({
  providedIn: 'root'
})

export class BusinessCatalogService {

  readonly niches: BusinessNiche[] = [

    // =========================================================
    // BELLEZA Y ESTÉTICA
    // =========================================================

    {
      value: 'beauty',
      label: 'Belleza y estética',

      icon: 'sparkles',
      color: '#D946EF',

      audience: {
        singular: 'cliente',
        plural: 'clientes',
        informal: 'clientas'
      },

      terminology: {
        clients: {
          singular: 'cliente',
          plural: 'clientes'
        },
        appointments: {
          singular: 'cita',
          plural: 'citas'
        },
        services: {
          singular: 'tratamiento',
          plural: 'tratamientos'
        },
        team: {
          singular: 'especialista',
          plural: 'especialistas'

        },
        booking: {
          singular: 'agenda online',
          plural: 'agenda online'
        }
      },


      ui: {
        dashboard_description: 'Visualiza la actividad de tu cabina y próximas citas.',
        dashboard_empty_state: 'Tus métricas y próximas citas aparecerán aquí.',

        clients_description: 'Administra y da seguimiento a tus clientes.',
        clients_empty_state: 'Agrega tu primer cliente para comenzar a registrar citas y tratamientos.',
        clients_cta: 'Nuevo cliente',

        services_description: 'Organiza tratamientos y servicios estéticos.',
        services_empty_state: 'Crea tu primer tratamiento para comenzar a recibir citas.',
        services_cta: 'Nuevo tratamiento',

        appointments_description: 'Controla tu agenda diaria y disponibilidad.',
        appointments_empty_state: 'Tus próximas citas aparecerán aquí.',
        appointments_cta: 'Nueva cita',

        booking_description: 'Comparte tu agenda online y recibe reservas automáticamente.',
        booking_empty_state: 'Activa tu agenda online para comenzar a recibir citas.',
        booking_cta: 'Compartir agenda online',

        team_description: 'Administra especialistas y personal de tu negocio.',
        team_empty_state: 'Agrega especialistas para asignar servicios y citas.',
        team_cta: 'Nuevo especialista'
      },

      marketing: {
        headline: 'Haz que tus clientas regresen.',
        empty_state: 'Tus próximas citas aparecerán aquí.',
        cta: 'Compartir link de reservas'


      },

      suggestion: {
        name: 'Tratamiento estético',
        duration: 60,
        price: 300,
        mode: 'presential'
      },

      presets: [
        'Facial',
        'Limpieza',
        'Rejuvenecimiento'
      ],

      agenda: {
        appointment_duration: 60,
        break_between_appointments: 10,
        label: 'clientes',

        schedule: {
          start: '10:00',
          end: '19:00',
          working_days: [1, 2, 3, 4, 5, 6]
        }
      }
    },

    // =========================================================
    // BARBERÍA
    // =========================================================

    {
      value: 'barbershop',
      label: 'Barbería',

      icon: 'scissors',
      color: '#1F2937',

      audience: {
        singular: 'cliente',
        plural: 'clientes'
      },

      terminology: {
        clients: {
          singular: 'cliente',
          plural: 'clientes'
        },
        appointments: {
          singular: 'turno',
          plural: 'turnos'
        },
        services: {
          singular: 'servicio',
          plural: 'servicios'
        },
        team: {
          singular: 'barbero',
          plural: 'barberos'
        },
        booking: {
          singular: 'reserva online',
          plural: 'reservas online'
        }
      },

      ui: {
        dashboard_description: 'Mantén control de turnos, clientes y servicios.',
        dashboard_empty_state: 'Tu actividad y próximos turnos aparecerán aquí.',

        clients_description: 'Organiza tu cartera de clientes frecuentes.',
        clients_empty_state: 'Agrega tu primer cliente para comenzar a registrar turnos.',
        clients_cta: 'Nuevo cliente',

        services_description: 'Configura cortes, barba y combos.',
        services_empty_state: 'Crea tu primer servicio para comenzar a agendar clientes.',
        services_cta: 'Nuevo servicio',

        appointments_description: 'Gestiona tus turnos y horarios fácilmente.',
        appointments_empty_state: 'Tus próximos turnos aparecerán aquí.',
        appointments_cta: 'Nuevo turno',

        booking_description: 'Permite que tus clientes reserven sin escribirte.',
        booking_empty_state: 'Comparte tu link de reservas para comenzar a recibir turnos.',
        booking_cta: 'Compartir reservas',

        team_description: 'Administra barberos y disponibilidad.',
        team_empty_state: 'Agrega barberos para asignar turnos y servicios.',
        team_cta: 'Nuevo barbero'
      },


      marketing: {
        headline: 'Llena tu agenda sin depender de WhatsApp.',
        empty_state: 'Aquí verás tus próximos cortes y citas.',
        cta: 'Compartir link de reservas'
      },

      suggestion: {
        name: 'Corte de cabello',
        duration: 30,
        price: 100,
        mode: 'presential'
      },

      presets: [
        'Fade',
        'Barba',
        'Corte + barba'
      ],

      agenda: {
        appointment_duration: 30,
        break_between_appointments: 0,
        label: 'clientes',

        schedule: {
          start: '10:00',
          end: '19:00',
          working_days: [1, 2, 3, 4, 5, 6]
        }
      }
    },

    // =========================================================
    // PELUQUERÍA
    // =========================================================

    {
      value: 'hair_salon',
      label: 'Peluquería / Salón',

      icon: 'scissors',
      color: '#F59E0B',

      audience: {
        singular: 'cliente',
        plural: 'clientes',
        informal: 'clientas'
      },

      terminology: {
        clients: {
          singular: 'cliente',
          plural: 'clientes'
        },
        appointments: {
          singular: 'cita',
          plural: 'citas'
        },
        services: {
          singular: 'servicio',
          plural: 'servicios'
        },
        team: {
          singular: 'estilista',
          plural: 'estilistas'
        },
        booking: {
          singular: 'reserva online',
          plural: 'reservas online'
        }
      },

      ui: {
        dashboard_description: 'Organiza la actividad diaria de tu salón.',
        dashboard_empty_state: 'Las próximas citas del salón aparecerán aquí.',

        clients_description: 'Da seguimiento a clientes y servicios frecuentes.',
        clients_empty_state: 'Agrega tu primer cliente para comenzar a registrar citas.',
        clients_cta: 'Nuevo cliente',

        services_description: 'Administra cortes, tintes y peinados.',
        services_empty_state: 'Crea tu primer servicio para comenzar a recibir reservas.',
        services_cta: 'Nuevo servicio',

        appointments_description: 'Gestiona citas y disponibilidad del salón.',
        appointments_empty_state: 'Tus próximas citas aparecerán aquí.',
        appointments_cta: 'Nueva cita',

        booking_description: 'Haz que tus clientes aparten cita online.',
        booking_empty_state: 'Comparte tu agenda online para comenzar a recibir citas.',
        booking_cta: 'Compartir agenda',

        team_description: 'Administra estilistas y horarios.',
        team_empty_state: 'Agrega estilistas para asignar servicios y citas.',
        team_cta: 'Nuevo estilista'
      },

      marketing: {
        headline: 'Organiza tu salón y atiende mejor.',
        empty_state: 'Las próximas citas del salón aparecerán aquí.',
        cta: 'Compartir link de reservas'
      },

      suggestion: {
        name: 'Corte y peinado',
        duration: 60,
        price: 300,
        mode: 'presential'
      },

      presets: [
        'Corte',
        'Tinte',
        'Peinado'
      ],

      agenda: {
        appointment_duration: 30,
        break_between_appointments: 10,
        label: 'clientes',

        schedule: {
          start: '10:00',
          end: '19:00',
          working_days: [1, 2, 3, 4, 5, 6]
        }
      }
    },

    // =========================================================
    // UÑAS
    // =========================================================

    {
      value: 'nails',
      label: 'Uñas',

      icon: 'hand',
      color: '#EC4899',

      audience: {
        singular: 'clienta',
        plural: 'clientas'
      },

      terminology: {
        clients: {
          singular: 'cliente',
          plural: 'clientes'
        },
        appointments: {
          singular: 'cita',
          plural: 'citas'
        },
        services: {
          singular: 'servicio',
          plural: 'servicios'
        },
        team: {
          singular: 'técnica',
          plural: 'técnicas'
        },
        booking: {
          singular: 'reserva online',
          plural: 'reservas online'
        }
      },

      ui: {
        dashboard_description: 'Controla tus citas y servicios de uñas.',
        dashboard_empty_state: 'Tus próximas citas aparecerán aquí.',

        clients_description: 'Administra clientes y seguimiento de servicios.',
        clients_empty_state: 'Agrega tu primer cliente para comenzar a registrar citas.',
        clients_cta: 'Nuevo cliente',

        services_description: 'Configura manicure, pedicure y diseños.',
        services_empty_state: 'Crea tu primer servicio para comenzar a recibir reservas.',
        services_cta: 'Nuevo servicio',

        appointments_description: 'Gestiona horarios y disponibilidad.',
        appointments_empty_state: 'Tus próximas citas aparecerán aquí.',
        appointments_cta: 'Nueva cita',

        booking_description: 'Permite reservas online para tus clientas.',
        booking_empty_state: 'Comparte tu agenda para comenzar a recibir citas.',
        booking_cta: 'Compartir reservas',

        team_description: 'Administra técnicas y disponibilidad.',
        team_empty_state: 'Agrega técnicas para asignar citas y servicios.',
        team_cta: 'Nueva técnica'
      },

      marketing: {
        headline: 'Haz que tus clientas aparten cita sin escribirte.',
        empty_state: 'Tus próximas citas de uñas aparecerán aquí.',
        cta: 'Compartir link de reservas'
      },

      suggestion: {
        name: 'Gelish manos',
        duration: 60,
        price: 250,
        mode: 'presential'
      },

      presets: [
        'Gelish',
        'Manicure',
        'Pedicure'
      ],

      agenda: {
        appointment_duration: 60,
        break_between_appointments: 10,
        label: 'clientes',

        schedule: {
          start: '10:00',
          end: '19:00',
          working_days: [1, 2, 3, 4, 5, 6]
        }
      }
    },

    // =========================================================
    // PSICOLOGÍA
    // =========================================================

    {
      value: 'psychology',
      label: 'Psicología',

      icon: 'brain',
      color: '#6366F1',

      audience: {
        singular: 'paciente',
        plural: 'pacientes'
      },

      terminology: {
        clients: {
          singular: 'paciente',
          plural: 'pacientes'
        },
        appointments: {
          singular: 'sesión',
          plural: 'sesiones'
        },
        services: {
          singular: 'terapia',
          plural: 'terapias'
        },
        team: {
          singular: 'especialista',
          plural: 'especialistas'
        },
        booking: {
          singular: 'agenda online',
          plural: 'agendas online'
        }
      },

      ui: {
        dashboard_description: 'Mantén organizada tu práctica y próximas sesiones.',
        dashboard_empty_state: 'Tus próximas sesiones aparecerán aquí.',

        clients_description: 'Organiza y da seguimiento a tus pacientes.',
        clients_empty_state: 'Agrega tu primer paciente para comenzar a registrar sesiones y notas.',
        clients_cta: 'Nuevo paciente',

        services_description: 'Configura terapias y tipos de sesión.',
        services_empty_state: 'Crea tu primera terapia para comenzar a agendar pacientes.',
        services_cta: 'Nueva terapia',

        appointments_description: 'Administra sesiones y disponibilidad profesional.',
        appointments_empty_state: 'Tus próximas sesiones aparecerán aquí.',
        appointments_cta: 'Nueva sesión',

        booking_description: 'Comparte tu agenda online para recibir sesiones.',
        booking_empty_state: 'Activa tu agenda online para comenzar a recibir reservas.',
        booking_cta: 'Compartir agenda',

        team_description: 'Administra especialistas y disponibilidad.',
        team_empty_state: 'Agrega especialistas para asignar sesiones.',
        team_cta: 'Nuevo especialista'
      },

      marketing: {
        headline: 'Administra tus sesiones con tranquilidad.',
        empty_state: 'Tus próximas sesiones aparecerán aquí.',
        cta: 'Compartir agenda online',

        //clients_description: 'Organiza y da seguimiento a tus pacientes.'
      },

      suggestion: {
        name: 'Consulta inicial',
        duration: 60,
        price: 500,
        mode: 'hybrid'
      },

      presets: [
        'Individual',
        'Pareja',
        'Seguimiento'
      ],

      agenda: {
        appointment_duration: 60,
        break_between_appointments: 10,
        label: 'pacientes',

        schedule: {
          start: '09:00',
          end: '17:00',
          working_days: [1, 2, 3, 4, 5]
        }
      }
    },

    // =========================================================
    // MÉDICO
    // =========================================================

    {
      value: 'medical',
      label: 'Médico / Salud',

      icon: 'stethoscope',
      color: '#10B981',

      audience: {
        singular: 'paciente',
        plural: 'pacientes'
      },

      terminology: {
        clients: {
          singular: 'paciente',
          plural: 'pacientes'
        },
        appointments: {
          singular: 'consulta',
          plural: 'consultas'
        },
        services: {
          singular: 'servicio médico',
          plural: 'servicios médicos'
        },
        team: {
          singular: 'personal médico',
          plural: 'personal médico'
        },
        booking: {
          singular: 'agenda online',
          plural: 'agenda online'
        }
      },

      ui: {
        dashboard_description: 'Supervisa consultas y actividad de tu consultorio.',
        dashboard_empty_state: 'Tus próximas consultas aparecerán aquí.',

        clients_description: 'Organiza y administra tus pacientes.',
        clients_empty_state: 'Agrega tu primer paciente para comenzar a registrar consultas.',
        clients_cta: 'Nuevo paciente',

        services_description: 'Configura consultas y servicios médicos.',
        services_empty_state: 'Crea tu primer servicio médico para comenzar a agendar pacientes.',
        services_cta: 'Nuevo servicio',

        appointments_description: 'Gestiona consultas y horarios disponibles.',
        appointments_empty_state: 'Tus próximas consultas aparecerán aquí.',
        appointments_cta: 'Nueva consulta',

        booking_description: 'Permite a tus pacientes reservar consultas online.',
        booking_empty_state: 'Activa tu agenda online para comenzar a recibir consultas.',
        booking_cta: 'Compartir agenda',

        team_description: 'Administra personal médico y disponibilidad.',
        team_empty_state: 'Agrega personal médico para asignar consultas.',
        team_cta: 'Nuevo integrante'
      },

      marketing: {
        headline: 'Mantén organizada tu consulta médica.',
        empty_state: 'Las próximas consultas aparecerán aquí.',
        cta: 'Compartir agenda online'
      },

      suggestion: {
        name: 'Consulta general',
        duration: 30,
        price: 200,
        mode: 'presential'
      },

      presets: [
        'Consulta',
        'Valoración',
        'Seguimiento'
      ],

      agenda: {
        appointment_duration: 30,
        break_between_appointments: 5,
        label: 'pacientes',

        schedule: {
          start: '08:00',
          end: '18:00',
          working_days: [0, 1, 2, 3, 4, 5, 6]
        }
      }
    },

    // =========================================================
    // DENTISTAS
    // =========================================================

    {
      value: 'dentist',
      label: 'Dentista',

      icon: 'shield-plus',
      color: '#0F766E',

      audience: {
        singular: 'paciente',
        plural: 'pacientes'
      },

      terminology: {
        clients: {
          singular: 'paciente',
          plural: 'pacientes'
        },
        appointments: {
          singular: 'consulta',
          plural: 'consultas'
        },
        services: {
          singular: 'tratamiento',
          plural: 'tratamientos'
        },
        team: {
          singular: 'odontólogo',
          plural: 'odontólogos'
        },
        booking: {
          singular: 'agenda online',
          plural: 'agenda online'
        }
      },

      ui: {
        dashboard_description: 'Organiza citas y tratamientos de tu consultorio dental.',
        dashboard_empty_state: 'Tus próximas consultas aparecerán aquí.',

        clients_description: 'Administra pacientes y seguimiento dental.',
        clients_empty_state: 'Agrega tu primer paciente para comenzar a registrar consultas.',
        clients_cta: 'Nuevo paciente',

        services_description: 'Configura limpiezas, valoraciones y tratamientos.',
        services_empty_state: 'Crea tu primer tratamiento para comenzar a recibir citas.',
        services_cta: 'Nuevo tratamiento',

        appointments_description: 'Gestiona consultas y disponibilidad del consultorio.',
        appointments_empty_state: 'Tus próximas consultas aparecerán aquí.',
        appointments_cta: 'Nueva consulta',

        booking_description: 'Comparte tu agenda online y recibe citas automáticamente.',
        booking_empty_state: 'Activa tus reservas online para comenzar a recibir consultas.',
        booking_cta: 'Compartir agenda',

        team_description: 'Administra odontólogos y personal del consultorio.',
        team_empty_state: 'Agrega odontólogos para asignar consultas.',
        team_cta: 'Nuevo odontólogo'
      },

      marketing: {
        headline: 'Haz más simple la administración de tu consultorio.',
        empty_state: 'Tus próximas consultas dentales aparecerán aquí.',
        cta: 'Compartir agenda online'
      },

      suggestion: {
        name: 'Limpieza dental',
        duration: 45,
        price: 600,
        mode: 'presential'
      },

      presets: [
        'Limpieza',
        'Ortodoncia',
        'Valoración'
      ],

      agenda: {
        appointment_duration: 60,
        break_between_appointments: 10,
        label: 'pacientes',

        schedule: {
          start: '09:00',
          end: '18:00',
          working_days: [1, 2, 3, 4, 5, 6]
        }
      }
    },

    // =========================================================
    // NUTRIÓLOGOS
    // =========================================================

    {
      value: 'nutrition',
      label: 'Nutriólogo',

      icon: 'apple',
      color: '#65A30D',

      audience: {
        singular: 'paciente',
        plural: 'pacientes'
      },

      terminology: {
        clients: {
          singular: 'paciente',
          plural: 'pacientes'
        },
        appointments: {
          singular: 'consulta',
          plural: 'consultas'
        },
        services: {
          singular: 'plan nutricional',
          plural: 'planes nutricionales'
        },
        team: {
          singular: 'nutriólogo',
          plural: 'nutriólogos'
        },
        booking: {
          singular: 'agenda online',
          plural: 'agenda online'
        }
      },

      ui: {
        dashboard_description: 'Visualiza el seguimiento de tus pacientes y consultas nutricionales.',
        dashboard_empty_state: 'Aquí aparecerá el resumen de consultas, pacientes y progreso.',

        clients_description: 'Administra pacientes y lleva seguimiento de sus objetivos nutricionales.',
        clients_empty_state: 'Agrega tu primer paciente para comenzar a registrar consultas y planes alimenticios.',
        clients_cta: 'Nuevo paciente',

        services_description: 'Configura consultas, evaluaciones y planes nutricionales.',
        services_empty_state: 'Crea tu primer servicio para comenzar a agendar consultas.',
        services_cta: 'Nuevo servicio',

        appointments_description: 'Organiza consultas nutricionales y seguimientos fácilmente.',
        appointments_empty_state: 'Tus próximas consultas nutricionales aparecerán aquí.',
        appointments_cta: 'Nueva consulta',

        booking_description: 'Permite que tus pacientes agenden consultas en línea.',
        booking_empty_state: 'Configura tu agenda online para comenzar a recibir reservas.',
        booking_cta: 'Activar agenda online',

        team_description: 'Administra nutriólogos y especialistas de tu equipo.',
        team_empty_state: 'Agrega integrantes a tu equipo para asignar consultas.',
        team_cta: 'Agregar integrante'
      },

      marketing: {
        headline: 'Da seguimiento profesional a tus pacientes.',
        empty_state: 'Tus próximas consultas nutricionales aparecerán aquí.',
        cta: 'Compartir agenda online'
      },

      suggestion: {
        name: 'Consulta nutricional',
        duration: 60,
        price: 500,
        mode: 'hybrid'
      },

      presets: [
        'Control de peso',
        'Plan alimenticio',
        'Seguimiento'
      ],

      agenda: {
        appointment_duration: 60,
        break_between_appointments: 10,
        label: 'pacientes',

        schedule: {
          start: '08:00',
          end: '17:00',
          working_days: [1, 2, 3, 4, 5, 6]
        }
      }
    },

    // =========================================================
    // TERAPIAS
    // =========================================================

    {
      value: 'therapy',
      label: 'Terapias / Bienestar',

      icon: 'heart',
      color: '#22C55E',

      audience: {
        singular: 'paciente',
        plural: 'pacientes'
      },

      terminology: {
        clients: {
          singular: 'paciente',
          plural: 'pacientes'
        },
        appointments: {
          singular: 'sesión',
          plural: 'Sesiones'
        },
        services: {
          singular: 'terapia',
          plural: 'terapias'
        },
        team: {
          singular: 'terapeuta',
          plural: 'terapeutas'
        },
        booking: {
          singular: 'agenda online',
          plural: 'agenda online'
        }
      },

      ui: {
        dashboard_description: 'Mantén control de tus sesiones y pacientes desde un solo lugar.',
        dashboard_empty_state: 'Aquí aparecerá el resumen de sesiones, pacientes y actividad.',

        clients_description: 'Administra pacientes y lleva seguimiento de sus sesiones terapéuticas.',
        clients_empty_state: 'Agrega tu primer paciente para comenzar a registrar sesiones.',
        clients_cta: 'Nuevo paciente',

        services_description: 'Configura terapias, sesiones y servicios de bienestar.',
        services_empty_state: 'Crea tu primer servicio terapéutico para comenzar a agendar.',
        services_cta: 'Nueva terapia',

        appointments_description: 'Organiza sesiones terapéuticas y horarios fácilmente.',
        appointments_empty_state: 'Tus próximas sesiones aparecerán aquí.',
        appointments_cta: 'Nueva sesión',

        booking_description: 'Permite reservas online para tus terapias y sesiones.',
        booking_empty_state: 'Activa las reservas online para comenzar a recibir citas.',
        booking_cta: 'Activar reservas',

        team_description: 'Administra terapeutas y especialistas de bienestar.',
        team_empty_state: 'Agrega terapeutas para asignar sesiones y horarios.',
        team_cta: 'Agregar terapeuta'
      },

      marketing: {
        headline: 'Haz sentir tranquilidad desde la reserva.',
        empty_state: 'Tus próximas terapias aparecerán aquí.',
        cta: 'Compartir agenda online'
      },

      suggestion: {
        name: 'Sesión terapéutica',
        duration: 60,
        price: 400,
        mode: 'presential'
      },

      presets: [
        'Relajación',
        'Rehabilitación',
        'Alternativa'
      ],

      agenda: {
        appointment_duration: 60,
        break_between_appointments: 10,
        label: 'pacientes',

        schedule: {
          start: '09:00',
          end: '17:00',
          working_days: [1, 2, 3, 4, 5]
        }
      }
    },

    // =========================================================
    // SPA
    // =========================================================

    {
      value: 'spa',
      label: 'Spa / Masajes',

      icon: 'flower',
      color: '#14B8A6',

      audience: {
        singular: 'cliente',
        plural: 'clientes'
      },

      terminology: {
        clients: {
          singular: 'cliente',
          plural: 'clientes'
        },
        appointments: {
          singular: 'reserva',
          plural: 'reservas'
        },
        services: {
          singular: 'experiencia',
          plural: 'experiencias'
        },
        team: {
          singular: 'terapeuta',
          plural: 'terapeutas'
        },
        booking: {
          singular: 'reserva online',
          plural: 'reservas online'
        }
      },

      ui: {
        dashboard_description: 'Visualiza reservas, experiencias y actividad de tu spa.',
        dashboard_empty_state: 'Aquí aparecerá el resumen de reservas y servicios.',

        clients_description: 'Administra clientes y preferencias de sus experiencias.',
        clients_empty_state: 'Agrega tu primer cliente para comenzar a registrar reservas.',
        clients_cta: 'Nuevo cliente',

        services_description: 'Configura masajes, experiencias y tratamientos.',
        services_empty_state: 'Crea tu primer servicio para comenzar a recibir reservas.',
        services_cta: 'Nuevo servicio',

        appointments_description: 'Organiza reservas y horarios de atención fácilmente.',
        appointments_empty_state: 'Tus próximas reservas aparecerán aquí.',
        appointments_cta: 'Nueva reserva',

        booking_description: 'Permite reservas online para tus experiencias y tratamientos.',
        booking_empty_state: 'Configura tu sistema de reservas para comenzar a recibir clientes.',
        booking_cta: 'Activar reservas',

        team_description: 'Administra terapeutas y personal de atención.',
        team_empty_state: 'Agrega integrantes a tu equipo para gestionar reservas.',
        team_cta: 'Agregar integrante'
      },

      marketing: {
        headline: 'Haz que reservar sea parte de la experiencia.',
        empty_state: 'Tus próximas reservas aparecerán aquí.',
        cta: 'Compartir reservas online'
      },

      suggestion: {
        name: 'Masaje relajante',
        duration: 60,
        price: 500,
        mode: 'presential'
      },

      presets: [
        'Relajante',
        'Descontracturante',
        'En pareja'
      ],

      agenda: {
        appointment_duration: 60,
        break_between_appointments: 15,
        label: 'clientes',

        schedule: {
          start: '09:00',
          end: '17:00',
          working_days: [1, 2, 3, 4, 5, 6]
        }
      }
    },

    // =========================================================
    // FITNESS
    // =========================================================

    {
      value: 'fitness',
      label: 'Fitness / Gym',

      icon: 'dumbbell',
      color: '#F97316',

      audience: {
        singular: 'cliente',
        plural: 'clientes'
      },

      terminology: {
        clients: {
          singular: 'cliente',
          plural: 'clientes'
        },
        appointments: {
          singular: 'sesión',
          plural: 'sesiones'
        },
        services: {
          singular: 'entrenamiento',
          plural: 'entrenamientos'
        },
        team: {
          singular: 'entrenador',
          plural: 'entrenadores'
        },
        booking: {
          singular: 'reserva online',
          plural: 'reservas online'
        }
      },

      ui: {
        dashboard_description: 'Controla entrenamientos, sesiones y actividad de tus clientes.',
        dashboard_empty_state: 'Aquí aparecerá el resumen de sesiones y entrenamientos.',

        clients_description: 'Administra clientes y seguimiento de sus entrenamientos.',
        clients_empty_state: 'Agrega tu primer cliente para comenzar a registrar sesiones.',
        clients_cta: 'Nuevo cliente',

        services_description: 'Configura entrenamientos, clases y evaluaciones.',
        services_empty_state: 'Crea tu primer entrenamiento o clase para comenzar a agendar.',
        services_cta: 'Nuevo entrenamiento',

        appointments_description: 'Organiza entrenamientos y horarios de atención fácilmente.',
        appointments_empty_state: 'Tus próximas sesiones aparecerán aquí.',
        appointments_cta: 'Nueva sesión',

        booking_description: 'Permite reservas online para entrenamientos y clases.',
        booking_empty_state: 'Activa las reservas online para comenzar a recibir clientes.',
        booking_cta: 'Activar reservas',

        team_description: 'Administra entrenadores y personal de apoyo.',
        team_empty_state: 'Agrega entrenadores para asignar clases y sesiones.',
        team_cta: 'Agregar entrenador'
      },

      marketing: {
        headline: 'Organiza tus entrenamientos y clases.',
        empty_state: 'Tus próximas sesiones aparecerán aquí.',
        cta: 'Compartir reservas online'
      },

      suggestion: {
        name: 'Entrenamiento personalizado',
        duration: 60,
        price: 200,
        mode: 'presential'
      },

      presets: [
        'Personal',
        'Grupo',
        'Evaluación física'
      ],

      agenda: {
        appointment_duration: 60,
        break_between_appointments: 0,
        label: 'clientes',

        schedule: {
          start: '06:00',
          end: '12:00',
          working_days: [1, 2, 3, 4, 5, 6]
        }
      }
    },

    // =========================================================
    // EDUCACIÓN
    // =========================================================

    {
      value: 'education',
      label: 'Educación / Cursos',

      icon: 'graduation-cap',
      color: '#3B82F6',

      audience: {
        singular: 'alumno',
        plural: 'alumnos'
      },

      terminology: {
        clients: {
          singular: 'alumno',
          plural: 'alumnos'
        },
        appointments: {
          singular: 'clase',
          plural: 'clases'
        },
        services: {
          singular: 'curso',
          plural: 'cursos'
        },
        team: {
          singular: 'profesor',
          plural: 'profesores'
        },
        booking: {
          singular: 'inscripción',
          plural: 'inscripciones'
        }
      },

      ui: {
        dashboard_description: 'Visualiza clases, alumnos y actividad educativa desde un solo lugar.',
        dashboard_empty_state: 'Aquí aparecerá el resumen de clases y alumnos.',

        clients_description: 'Administra alumnos y seguimiento de sus clases.',
        clients_empty_state: 'Agrega tu primer alumno para comenzar a organizar clases.',
        clients_cta: 'Nuevo alumno',

        services_description: 'Configura clases, asesorías y cursos.',
        services_empty_state: 'Crea tu primera clase o curso para comenzar a agendar.',
        services_cta: 'Nuevo curso',

        appointments_description: 'Organiza clases y sesiones educativas fácilmente.',
        appointments_empty_state: 'Tus próximas clases aparecerán aquí.',
        appointments_cta: 'Nueva clase',

        booking_description: 'Permite inscripciones y reservas online para tus clases.',
        booking_empty_state: 'Configura las inscripciones online para comenzar a recibir alumnos.',
        booking_cta: 'Activar inscripciones',

        team_description: 'Administra profesores y colaboradores educativos.',
        team_empty_state: 'Agrega profesores para asignar clases y horarios.',
        team_cta: 'Agregar profesor'
      },

      marketing: {
        headline: 'Organiza mejor tus clases y asesorías.',
        empty_state: 'Tus próximas clases aparecerán aquí.',
        cta: 'Compartir inscripciones'
      },

      suggestion: {
        name: 'Clase personalizada',
        duration: 60,
        price: 250,
        mode: 'online'
      },

      presets: [
        'Clase',
        'Asesoría',
        'Curso'
      ],

      agenda: {
        appointment_duration: 60,
        break_between_appointments: 0,
        label: 'alumnos',

        schedule: {
          start: '08:00',
          end: '18:00',
          working_days: [1, 2, 3, 4, 5, 6]
        }
      }
    },

    // =========================================================
    // CONSULTORÍA
    // =========================================================

    {
      value: 'consulting',
      label: 'Consultoría',

      icon: 'presentation',
      color: '#0EA5E9',

      audience: {
        singular: 'cliente',
        plural: 'clientes'
      },

      terminology: {
        clients: {
          singular: 'cliente',
          plural: 'clientes'
        },
        appointments: {
          singular: 'sesión',
          plural: 'sesiones'
        },
        services: {
          singular: 'consultoría',
          plural: 'consultorías'
        },
        team: {
          singular: 'consultor',
          plural: 'consultores'
        },
        booking: {
          singular: 'reserva online',
          plural: 'reservas online'
        }
      },

      ui: {
        dashboard_description: 'Mantén control de tus asesorías y clientes desde un solo lugar.',
        dashboard_empty_state: 'Aquí aparecerá el resumen de sesiones y actividad.',

        clients_description: 'Administra clientes y seguimiento de sus proyectos.',
        clients_empty_state: 'Agrega tu primer cliente para comenzar a registrar sesiones.',
        clients_cta: 'Nuevo cliente',

        services_description: 'Configura consultorías, auditorías y asesorías.',
        services_empty_state: 'Crea tu primer servicio para comenzar a agendar sesiones.',
        services_cta: 'Nueva consultoría',

        appointments_description: 'Organiza sesiones de consultoría y reuniones fácilmente.',
        appointments_empty_state: 'Tus próximas sesiones aparecerán aquí.',
        appointments_cta: 'Nueva sesión',

        booking_description: 'Permite reservas online para sesiones y asesorías.',
        booking_empty_state: 'Activa las reservas online para comenzar a recibir clientes.',
        booking_cta: 'Activar reservas',

        team_description: 'Administra consultores y especialistas de tu equipo.',
        team_empty_state: 'Agrega consultores para asignar sesiones y proyectos.',
        team_cta: 'Agregar consultor'
      },

      marketing: {
        headline: 'Haz más profesional tu proceso de reservas.',
        empty_state: 'Tus próximas sesiones aparecerán aquí.',
        cta: 'Compartir reservas online'
      },

      suggestion: {
        name: 'Sesión de consultoría',
        duration: 60,
        price: 800,
        mode: 'online'
      },

      presets: [
        'Estrategia',
        'Auditoría',
        'Asesoría'
      ],

      agenda: {
        appointment_duration: 60,
        break_between_appointments: 0,
        label: 'clientes',

        schedule: {
          start: '08:00',
          end: '18:00',
          working_days: [1, 2, 3, 4, 5, 6]
        }
      }
    },

    // =========================================================
    // COACHING
    // =========================================================

    {
      value: 'coaching',
      label: 'Coaching',

      icon: 'target',
      color: '#8B5CF6',

      audience: {
        singular: 'cliente',
        plural: 'clientes'
      },

      terminology: {
        clients: {
          singular: 'cliente',
          plural: 'clientes'
        },
        appointments: {
          singular: 'sesión',
          plural: 'sesiones'
        },
        services: {
          singular: 'proceso',
          plural: 'procesos'
        },
        team: {
          singular: 'coach',
          plural: 'coaches'
        },
        booking: {
          singular: 'reserva online',
          plural: 'reservas online'
        }
      },

      ui: {
        dashboard_description: 'Visualiza sesiones, clientes y avances de tus procesos.',
        dashboard_empty_state: 'Aquí aparecerá el resumen de sesiones y actividad.',

        clients_description: 'Administra clientes y seguimiento de sus procesos de coaching.',
        clients_empty_state: 'Agrega tu primer cliente para comenzar a registrar sesiones.',
        clients_cta: 'Nuevo cliente',

        services_description: 'Configura procesos, mentorías y sesiones de coaching.',
        services_empty_state: 'Crea tu primer servicio para comenzar a agendar sesiones.',
        services_cta: 'Nuevo proceso',

        appointments_description: 'Organiza sesiones y procesos de coaching fácilmente.',
        appointments_empty_state: 'Tus próximas sesiones aparecerán aquí.',
        appointments_cta: 'Nueva sesión',

        booking_description: 'Permite reservas online para tus sesiones y mentorías.',
        booking_empty_state: 'Activa las reservas online para comenzar a recibir clientes.',
        booking_cta: 'Activar reservas',

        team_description: 'Administra coaches y especialistas de tu equipo.',
        team_empty_state: 'Agrega coaches para asignar sesiones y procesos.',
        team_cta: 'Agregar coach'
      },

      marketing: {
        headline: 'Da seguimiento profesional a tus clientes.',
        empty_state: 'Tus próximas sesiones aparecerán aquí.',
        cta: 'Compartir reservas online'
      },

      suggestion: {
        name: 'Sesión de coaching',
        duration: 60,
        price: 600,
        mode: 'online'
      },

      presets: [
        'Vida',
        'Negocios',
        'Hábitos'
      ],

      agenda: {
        appointment_duration: 60,
        break_between_appointments: 0,
        label: 'clientes',

        schedule: {
          start: '08:00',
          end: '18:00',
          working_days: [1, 2, 3, 4, 5, 6]
        }
      }
    },

    // =========================================================
    // MASCOTAS
    // =========================================================

    {
      value: 'pet_grooming',
      label: 'Mascotas',

      icon: 'paw-print',
      color: '#84CC16',

      audience: {
        singular: 'cliente',
        plural: 'clientes y mascotas'
      },

      terminology: {
        clients: {
          singular: 'cliente',
          plural: 'Clientes y mascotas'
        },
        appointments: {
          singular: 'cita',
          plural: 'citas'
        },
        services: {
          singular: 'servicio',
          plural: 'servicios'
        },
        team: {
          singular: 'colaborador',
          plural: 'colaboradores'
        },
        booking: {
          singular: 'reserva online',
          plural: 'reservas online'
        }
      },

      ui: {
        dashboard_description: 'Visualiza citas, servicios y actividad de tus mascotas atendidas.',
        dashboard_empty_state: 'Aquí aparecerá el resumen de citas y servicios.',

        clients_description: 'Administra clientes, mascotas y seguimiento de sus servicios.',
        clients_empty_state: 'Agrega tu primer cliente y registra su mascota para comenzar.',
        clients_cta: 'Nuevo cliente',

        services_description: 'Configura baños, cortes y servicios de estética.',
        services_empty_state: 'Crea tu primer servicio para comenzar a recibir reservas.',
        services_cta: 'Nuevo servicio',

        appointments_description: 'Organiza citas y servicios para mascotas fácilmente.',
        appointments_empty_state: 'Tus próximas citas aparecerán aquí.',
        appointments_cta: 'Nueva cita',

        booking_description: 'Permite reservas online para servicios de mascotas.',
        booking_empty_state: 'Configura las reservas online para comenzar a recibir citas.',
        booking_cta: 'Activar reservas',

        team_description: 'Administra estilistas y personal de atención.',
        team_empty_state: 'Agrega integrantes a tu equipo para asignar servicios.',
        team_cta: 'Agregar integrante'
      },

      marketing: {
        headline: 'Organiza baños, cortes y citas fácilmente.',
        empty_state: 'Tus próximas mascotas agendadas aparecerán aquí.',
        cta: 'Compartir reservas online'
      },

      suggestion: {
        name: 'Baño y corte',
        duration: 60,
        price: 300,
        mode: 'presential'
      },

      presets: [
        'Baño',
        'Corte',
        'Spa'
      ],

      agenda: {
        appointment_duration: 60,
        break_between_appointments: 10,
        label: 'mascotas',

        schedule: {
          start: '10:00',
          end: '17:00',
          working_days: [1, 2, 3, 4, 5, 6]
        }
      }
    },

    // =========================================================
    // TATUAJES
    // =========================================================

    {
      value: 'tattoo',
      label: 'Tatuajes',

      icon: 'pen-tool',
      color: '#053cb2',

      audience: {
        singular: 'cliente',
        plural: 'clientes'
      },

      terminology: {
        clients: {
          singular: 'cliente',
          plural: 'clientes'
        },
        appointments: {
          singular: 'sesión',
          plural: 'sesiones'
        },
        services: {
          singular: 'tatuaje',
          plural: 'tatuajes'
        },
        team: {
          singular: 'artista',
          plural: 'artistas'
        },
        booking: {
          singular: 'reserva online',
          plural: 'reservas online'
        }
      },

      ui: {
        dashboard_description: 'Mantén organizadas tus sesiones, diseños y clientes.',
        dashboard_empty_state: 'Aquí aparecerá el resumen de sesiones y actividad.',

        clients_description: 'Administra clientes y seguimiento de sus tatuajes.',
        clients_empty_state: 'Agrega tu primer cliente para comenzar a registrar sesiones.',
        clients_cta: 'Nuevo cliente',

        services_description: 'Configura sesiones, estilos y servicios de tatuaje.',
        services_empty_state: 'Crea tu primer servicio para comenzar a agendar sesiones.',
        services_cta: 'Nuevo tatuaje',

        appointments_description: 'Organiza sesiones y horarios de tatuaje fácilmente.',
        appointments_empty_state: 'Tus próximas sesiones aparecerán aquí.',
        appointments_cta: 'Nueva sesión',

        booking_description: 'Permite reservas online para sesiones y valoraciones.',
        booking_empty_state: 'Activa las reservas online para comenzar a recibir clientes.',
        booking_cta: 'Activar reservas',

        team_description: 'Administra artistas y colaboradores de tu estudio.',
        team_empty_state: 'Agrega artistas para asignar sesiones y diseños.',
        team_cta: 'Agregar artista'
      },

      marketing: {
        headline: 'Organiza tus sesiones y diseños fácilmente.',
        empty_state: 'Tus próximas sesiones aparecerán aquí.',
        cta: 'Compartir reservas online'
      },

      suggestion: {
        name: 'Sesión de tatuaje',
        duration: 120,
        price: 1500,
        mode: 'presential'
      },

      presets: [
        'Línea',
        'Sombreado',
        'Personalizado'
      ],

      agenda: {
        appointment_duration: 60,
        break_between_appointments: 15,
        label: 'clientes',

        schedule: {
          start: '10:00',
          end: '18:00',
          working_days: [1, 2, 3, 4, 5]
        }
      }
    },

    // =========================================================
    // OTRO
    // =========================================================

    {
      value: 'other',
      label: 'Otro',

      icon: 'circle',
      color: '#6B7280',

      audience: {
        singular: 'cliente',
        plural: 'clientes'
      },

      terminology: {
        clients: {
          singular: 'cliente',
          plural: 'clientes'
        },
        appointments: {
          singular: 'cita',
          plural: 'citas'
        },
        services: {
          singular: 'servicio',
          plural: 'servicios'
        },
        team: {
          singular: 'equipo',
          plural: 'equipo'
        },
        booking: {
          singular: 'reserva online',
          plural: 'reservas online'
        }
      },

      ui: {
        dashboard_description: 'Mantén organizada la actividad y operaciones de tu negocio.',
        dashboard_empty_state: 'Aquí aparecerá el resumen de citas y actividad.',

        clients_description: 'Administra clientes y seguimiento de sus servicios.',
        clients_empty_state: 'Agrega tu primer cliente para comenzar a registrar actividad.',
        clients_cta: 'Nuevo cliente',

        services_description: 'Configura los servicios que ofrece tu negocio.',
        services_empty_state: 'Crea tu primer servicio para comenzar a agendar.',
        services_cta: 'Nuevo servicio',

        appointments_description: 'Organiza citas, sesiones y horarios fácilmente.',
        appointments_empty_state: 'Tus próximas citas aparecerán aquí.',
        appointments_cta: 'Nueva cita',

        booking_description: 'Permite reservas online para tus servicios.',
        booking_empty_state: 'Configura las reservas online para comenzar a recibir clientes.',
        booking_cta: 'Activar reservas',

        team_description: 'Administra colaboradores y personal de tu negocio.',
        team_empty_state: 'Agrega integrantes a tu equipo para asignar actividades.',
        team_cta: 'Agregar integrante'
      },

      marketing: {
        headline: 'Organiza mejor tus citas y reservas.',
        empty_state: 'Tus próximas citas aparecerán aquí.',
        cta: 'Compartir reservas online'
      },

      suggestion: {
        name: 'Servicio',
        duration: 60,
        price: 0,
        mode: 'presential'
      },

      presets: [],

      agenda: {
        appointment_duration: 30,
        break_between_appointments: 0,
        label: 'clientes',

        schedule: {
          start: '08:00',
          end: '18:00',
          working_days: [1, 2, 3, 4, 5]
        }
      }
    }

  ];

  // =========================================================
  // VARIANTES
  // =========================================================

  private variantExamples: Record<string, { title: string, items: string[] }[]> = {

    beauty: [
      { title: 'Facial', items: ['Básico', 'Limpieza profunda', 'Anti-edad'] },
      { title: 'Corporal', items: ['Reducción', 'Reafirmante', 'Relajante'] },
      { title: 'Depilación', items: ['Zona chica', 'Zona completa'] }
    ],

    barbershop: [
      { title: 'Corte', items: ['Fade', 'Clásico', 'Militar'] },
      { title: 'Barba', items: ['Perfilado', 'Afeitado completo'] },
      { title: 'Combo', items: ['Corte + barba', 'Express', 'Premium'] }
    ],

    hair_salon: [
      { title: 'Corte', items: ['Dama', 'Caballero', 'Niño'] },
      { title: 'Color', items: ['Completo', 'Retoque', 'Balayage'] },
      { title: 'Peinado', items: ['Evento', 'Diario', 'Styling'] }
    ],

    nails: [
      { title: 'Gelish', items: ['Manos', 'Pies', 'Diseño sencillo'] },
      { title: 'Manicure', items: ['Básico', 'Spa', 'Express'] },
      { title: 'Acrílicas', items: ['Set nuevo', 'Retoque', 'Diseño especial'] }
    ],

    psychology: [
      { title: 'Terapia', items: ['Individual', 'Pareja', 'Familiar'] },
      { title: 'Consulta', items: ['Inicial', 'Seguimiento'] },
      { title: 'Sesión', items: ['Presencial', 'Online', 'Híbrida'] }
    ],

    medical: [
      { title: 'Consulta', items: ['General', 'Especialidad'] },
      { title: 'Valoración', items: ['Inicial', 'Control'] },
      { title: 'Atención', items: ['Presencial', 'Videollamada'] }
    ],

    dentist: [
      { title: 'Limpieza', items: ['Básica', 'Profunda'] },
      { title: 'Ortodoncia', items: ['Valoración', 'Ajuste'] },
      { title: 'Consulta', items: ['Inicial', 'Seguimiento'] }
    ],

    nutrition: [
      { title: 'Consulta', items: ['Inicial', 'Seguimiento'] },
      { title: 'Plan', items: ['Pérdida de peso', 'Deportivo'] },
      { title: 'Control', items: ['Mensual', 'Quincenal'] }
    ],

    therapy: [
      { title: 'Terapia', items: ['Relajación', 'Rehabilitación'] },
      { title: 'Sesión', items: ['Individual', 'En pareja'] },
      { title: 'Alternativa', items: ['Reiki', 'Holística', 'Energética'] }
    ],

    spa: [
      { title: 'Masaje', items: ['Relajante', 'Descontracturante'] },
      { title: 'Spa', items: ['Individual', 'En pareja'] },
      { title: 'Duración', items: ['30 min', '60 min', '90 min'] }
    ],

    fitness: [
      { title: 'Entrenamiento', items: ['Personal', 'Grupo'] },
      { title: 'Evaluación', items: ['Inicial', 'Seguimiento'] },
      { title: 'Rutina', items: ['Fuerza', 'Cardio', 'Funcional'] }
    ],

    education: [
      { title: 'Clase', items: ['Individual', 'Grupo'] },
      { title: 'Asesoría', items: ['Tarea', 'Examen', 'Proyecto'] },
      { title: 'Curso', items: ['Básico', 'Intermedio', 'Avanzado'] }
    ],

    consulting: [
      { title: 'Consultoría', items: ['Estrategia', 'Auditoría'] },
      { title: 'Sesión', items: ['Diagnóstico', 'Plan de acción'] },
      { title: 'Asesoría', items: ['Express', 'Completa'] }
    ],

    coaching: [
      { title: 'Coaching', items: ['Vida', 'Negocios', 'Hábitos'] },
      { title: 'Sesión', items: ['Objetivos', 'Seguimiento'] },
      { title: 'Mentoría', items: ['Personal', 'Profesional'] }
    ],

    pet_grooming: [
      { title: 'Baño', items: ['Básico', 'Medicado'] },
      { title: 'Corte', items: ['Completo', 'Higiénico'] },
      { title: 'Spa', items: ['Relajante', 'Premium'] }
    ],

    tattoo: [
      { title: 'Tatuaje', items: ['Línea', 'Sombreado', 'Color'] },
      { title: 'Sesión', items: ['Pequeño', 'Mediano', 'Grande'] },
      { title: 'Diseño', items: ['Personalizado', 'Cover-up'] }
    ],

    other: [
      { title: 'Servicio', items: ['Básico', 'Estándar', 'Premium'] },
      { title: 'Sesión', items: ['Corta', 'Completa'] },
      { title: 'Atención', items: ['Presencial', 'Online'] }
    ]

  };

  // =========================================================
  // SUBNICHOS
  // =========================================================

  readonly subniches: Record<string, any[]> = {

    nails: [
      { value: 'gelish', label: 'Gelish' },
      { value: 'acrylic', label: 'Acrílicas' },
      { value: 'pedicure', label: 'Pedicure' }
    ],

    psychology: [
      { value: 'individual', label: 'Terapia individual' },
      { value: 'couples', label: 'Pareja' }
    ],

    dentist: [
      { value: 'orthodontics', label: 'Ortodoncia' },
      { value: 'cleaning', label: 'Limpieza dental' }
    ],

    nutrition: [
      { value: 'sports', label: 'Nutrición deportiva' },
      { value: 'weight_loss', label: 'Control de peso' }
    ]
  };

  // =========================================================
  // HELPERS
  // =========================================================

  getNiches() {
    return this.niches;
  }

  getNiche(value: string) {
    return this.niches.find(n => n.value === value);
  }

  getSubniches(niche: string) {
    return this.subniches[niche] ?? [];
  }

  getLabel(value: string): string {
    return this.getNiche(value)?.label ?? value;
  }

  getSuggestion(niche: string) {
    return this.getNiche(niche)?.suggestion ?? null;
  }

  getPresets(niche: string) {
    return this.getNiche(niche)?.presets ?? [];
  }

  getIcon(niche: string) {
    return this.getNiche(niche)?.icon ?? 'circle';
  }

  getColor(niche: string) {
    return this.getNiche(niche)?.color ?? '#6B7280';
  }

  getAudienceLabel(niche: string): string {
    return this.getNiche(niche)?.agenda?.label ?? 'clientes';
  }

  getAudience(niche: string) {
    return this.getNiche(niche)?.audience ?? null;
  }

  getTerminology(niche: string) {
    return this.getNiche(niche)?.terminology ?? null;
  }

  getTerm(
    niche: string,
    feature: keyof BusinessNiche['terminology'],
    type: 'singular' | 'plural' = 'plural',
    capitalize = false
  ): string {

    const terminology = this.getTerminology(niche);

    if (!terminology) {
      return '';
    }

    const value = terminology[feature][type];

    if (!capitalize) {
      return value;
    }

    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  getMarketing(niche: string) {
    return this.getNiche(niche)?.marketing ?? null;
  }

  getAgendaConfig(niche: string) {
    return this.getNiche(niche)?.agenda ?? null;
  }

  getSmartSchedule(niche: string) {
    return this.getNiche(niche)?.agenda?.schedule ?? null;
  }

  getVariantExamples(niche: string) {
    return this.variantExamples[niche] || this.variantExamples['other'];
  }

  getUiText(
    niche: string,
    key: keyof BusinessNiche['ui']
  ): string {

    const ui = this.getNiche(niche)?.ui;

    if (!ui) {
      return '';
    }

    return ui[key] ?? '';
  }

  // =========================================================
  // MENU DINÁMICO
  // =========================================================

  getMenuLabel(
    niche: string,
    featureKey: string,
    defaultLabel: string
  ): string {

    const terminology = this.getTerminology(niche);

    if (!terminology) {
      return defaultLabel;
    }

    const map: Record<string, string> = {
      agenda: terminology.appointments.plural,
      clients: terminology.clients.plural,
      services: terminology.services.plural,
      team: terminology.team.plural,
      booking: terminology.booking.plural
    };

    const value = map[featureKey] ?? defaultLabel;

    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  // =========================================================
  // VARIANTES DEFAULT
  // =========================================================

  getDefaultVariantName(niche: string): string {

    const map: Record<string, string> = {

      beauty: 'Sesión',
      barbershop: 'Servicio',
      hair_salon: 'Servicio',
      nails: 'Servicio',

      psychology: 'Sesión',
      medical: 'Consulta',
      dentist: 'Consulta',
      nutrition: 'Consulta',
      therapy: 'Sesión',

      spa: 'Sesión',
      fitness: 'Sesión',
      education: 'Clase',

      consulting: 'Sesión',
      coaching: 'Sesión',

      pet_grooming: 'Servicio',
      tattoo: 'Sesión',

      other: 'Servicio'
    };

    return map[niche] ?? 'Servicio';
  }

}

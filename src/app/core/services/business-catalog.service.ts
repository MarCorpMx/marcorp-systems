import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BusinessCatalogService {

  readonly niches = [

    {
      value: 'beauty',
      label: 'Belleza y estética',
      icon: 'sparkles',
      color: '#D946EF',
      suggestion: {
        name: 'Tratamiento estético',
        duration: 60,
        price: 300,
        mode: 'presential'
      },
      presets: ['Facial', 'Limpieza', 'Rejuvenecimiento'],
      agenda: {
        appointment_duration: 60,
        break_between_appointments: 10,
        label: 'clientes',
        schedule: {
          start: '10:00',
          end: '19:00',
          working_days: [1, 2, 3, 4, 5, 6] // lunes a sábado
        }
      }
    },

    {
      value: 'barbershop',
      label: 'Barbería',
      icon: 'scissors',
      color: '#1F2937',
      suggestion: {
        name: 'Corte de cabello',
        duration: 30,
        price: 100,
        mode: 'presential'
      },
      presets: ['Fade', 'Barba', 'Corte + barba'],
      agenda: {
        appointment_duration: 30,
        break_between_appointments: 0,
        label: 'clientes',
        schedule: {
          start: '10:00',
          end: '19:00',
          working_days: [1, 2, 3, 4, 5, 6] // lunes a sábado
        }
      }
    },

    {
      value: 'hair_salon',
      label: 'Peluquería / Salón',
      icon: 'scissors',
      color: '#F59E0B',
      suggestion: {
        name: 'Corte y peinado',
        duration: 60,
        price: 300,
        mode: 'presential'
      },
      presets: ['Corte', 'Tinte', 'Peinado'],
      agenda: {
        appointment_duration: 30,
        break_between_appointments: 10,
        label: 'clientes',
        schedule: {
          start: '10:00',
          end: '19:00',
          working_days: [1, 2, 3, 4, 5, 6] // lunes a sábado
        }
      }
    },

    {
      value: 'nails',
      label: 'Uñas',
      icon: 'hand',
      color: '#EC4899',
      suggestion: {
        name: 'Gelish manos',
        duration: 60,
        price: 250,
        mode: 'presential'
      },
      presets: ['Gelish', 'Manicure', 'Pedicure'],
      agenda: {
        appointment_duration: 60,
        break_between_appointments: 10,
        label: 'clientes',
        schedule: {
          start: '10:00',
          end: '19:00',
          working_days: [1, 2, 3, 4, 5, 6] // lunes a sábado
        }
      }
    },

    {
      value: 'psychology',
      label: 'Psicología',
      icon: 'brain',
      color: '#6366F1',
      suggestion: {
        name: 'Consulta inicial',
        duration: 60,
        price: 500,
        mode: 'hybrid'
      },
      presets: ['Individual', 'Pareja', 'Seguimiento'],
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

    {
      value: 'medical',
      label: 'Médico / Salud',
      icon: 'stethoscope',
      color: '#10B981',
      suggestion: {
        name: 'Consulta general',
        duration: 30,
        price: 200,
        mode: 'presential'
      },
      presets: ['Consulta', 'Valoración', 'Seguimiento'],
      agenda: {
        appointment_duration: 30,
        break_between_appointments: 5,
        label: 'pacientes',
        schedule: {
          start: '08:00',
          end: '18:00',
          working_days: [1, 2, 3, 4, 5, 6, 0]
        }
      }
    },

    {
      value: 'therapy',
      label: 'Terapias / Bienestar',
      icon: 'heart',
      color: '#22C55E',
      suggestion: {
        name: 'Sesión terapéutica',
        duration: 60,
        price: 400,
        mode: 'presential'
      },
      presets: ['Relajación', 'Rehabilitación', 'Alternativa'],
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

    {
      value: 'spa',
      label: 'Spa / Masajes',
      icon: 'flower',
      color: '#14B8A6',
      suggestion: {
        name: 'Masaje relajante',
        duration: 60,
        price: 500,
        mode: 'presential'
      },
      presets: ['Relajante', 'Descontracturante', 'En pareja'],
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

    {
      value: 'fitness',
      label: 'Fitness / Gym',
      icon: 'dumbbell',
      color: '#F97316',
      suggestion: {
        name: 'Entrenamiento personalizado',
        duration: 60,
        price: 200,
        mode: 'presential'
      },
      presets: ['Personal', 'Grupo', 'Evaluación física'],
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

    {
      value: 'education',
      label: 'Educación / Cursos',
      icon: 'graduation-cap',
      color: '#3B82F6',
      suggestion: {
        name: 'Clase personalizada',
        duration: 60,
        price: 250,
        mode: 'online'
      },
      presets: ['Clase', 'Asesoría', 'Curso'],
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

    {
      value: 'consulting',
      label: 'Consultoría',
      icon: 'briefcase',
      color: '#0EA5E9',
      suggestion: {
        name: 'Sesión de consultoría',
        duration: 60,
        price: 800,
        mode: 'online'
      },
      presets: ['Estrategia', 'Auditoría', 'Asesoría'],
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

    {
      value: 'coaching',
      label: 'Coaching',
      icon: 'target',
      color: '#8B5CF6',
      suggestion: {
        name: 'Sesión de coaching',
        duration: 60,
        price: 600,
        mode: 'online'
      },
      presets: ['Vida', 'Negocios', 'Hábitos'],
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

    {
      value: 'pet_grooming',
      label: 'Mascotas',
      icon: 'paw-print',
      color: '#84CC16',
      suggestion: {
        name: 'Baño y corte',
        duration: 60,
        price: 300,
        mode: 'presential'
      },
      presets: ['Baño', 'Corte', 'Spa'],
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

    {
      value: 'tattoo',
      label: 'Tatuajes',
      icon: 'pen-tool',
      color: '#053cb2',
      suggestion: {
        name: 'Sesión de tatuaje',
        duration: 120,
        price: 1500,
        mode: 'presential'
      },
      presets: ['Línea', 'Sombreado', 'Personalizado'],
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

    {
      value: 'other',
      label: 'Otro',
      icon: 'circle',
      color: '#6B7280',
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


  // Ejemplos de variantes en servicios
  private variantExamples: Record<string, { title: string, items: string[] }[]> = {

    beauty: [
      { title: 'Facial', items: ['Básico', 'Limpieza profunda',  'Anti-edad'] },
      { title: 'Corporal', items: ['Reducción', 'Reafirmante', 'Relajante'] },
      { title: 'Depilación', items: ['Zona chica', 'Zona completa'] }
    ],

    barbershop: [
      // 'Fade · Clásico · Militar'
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
      { title: 'Coaching', items: ['Vida0', 'Negocios', 'Hábitos'] },
      { title: 'Sesión', items: ['Objetivos0', 'Seguimiento'] },
      { title: 'Mentoría', items: ['Personal0', 'Profesional'] }
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

  readonly subniches: Record<string, any[]> = {
    nails: [
      { value: 'gelish', label: 'Gelish' },
      { value: 'acrylic', label: 'Acrílicas' },
      { value: 'pedicure', label: 'Pedicure' }
    ],

    psychology: [
      { value: 'individual', label: 'Terapia individual' },
      { value: 'couples', label: 'Pareja' }
    ]
  };

  getNiches() {
    return this.niches;
  }

  getSubniches(niche: string) {
    return this.subniches[niche] ?? [];
  }

  getLabel(value: string): string {
    return this.niches.find(x => x.value === value)?.label ?? value;
  }

  getNiche(value: string) {
    return this.niches.find(n => n.value === value);
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

  getDefaultVariantName(niche: string): string {
    const map: Record<string, string> = {
      beauty: 'Sesión',
      barbershop: 'Servicio',
      hair_salon: 'Servicio',
      nails: 'Servicio',

      psychology: 'Sesión individual',
      therapy: 'Sesión individual',

      medical: 'Consulta',
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

  getAgendaConfig(niche: string) {
    return this.getNiche(niche)?.agenda ?? null;
  }

  getAudienceLabel(niche: string): string {
    return this.getNiche(niche)?.agenda?.label ?? 'clientes';
  }

  getSmartSchedule(niche: string) {
    return this.getNiche(niche)?.agenda?.schedule ?? null;
  }

  getVariantExamples(niche: string) {
    return this.variantExamples[niche] || this.variantExamples['other'];
  }



}
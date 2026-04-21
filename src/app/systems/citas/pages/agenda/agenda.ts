import { Component, inject, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  LucideAngularModule,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  UserX,
  Check,
  MessageCircle,
  Mail,
  MoreVertical,
  UsersRound
} from 'lucide-angular';

// Servicios Internos
import { AuthService } from '../../../../core/services/auth.service';
import { ProfessionalsService, Professional } from '../../../../core/services/professionals.service';
import { CitasAgendaService } from '../../../../core/services/citas-agenda.service';
import { AppointmentModel } from '../../../../core/models/appointment.model';
import { APPOINTMENT_STATUS_CONFIG, AppointmentStatus } from '../../../../shared/config/appointment-status.config';
import { AgendaModal } from './agenda-modal/agenda-modal';
import { Notification } from '../../../../services/notification.service';


/**
 * 
 * Si quieres el siguiente nivel 👇
Podemos hacer que al seleccionar servicio:

Se autocalcule duración

Se bloquee horario ocupado

Se valide solapamiento en tiempo real

Ahí ya entramos a lógica de calendario real.
 * 
 */

/*
interface Reminder {
  whatsapp: boolean;
  email: boolean;
  sent: boolean;
}

type AppointmentStatus = 'confirmada' | 'pendiente' | 'cancelada' | 'no_asistio';

interface Appointment {
  id: number;
  time: string;          // o Date si lo manejas así
  client: string;
  service: string;
  status: AppointmentStatus;
  reminders?: Reminder;
}*/

@Component({
  selector: 'app-agenda',
  imports: [LucideAngularModule, CommonModule, AgendaModal, FormsModule],
  templateUrl: './agenda.html',
  styleUrl: './agenda.css',
})

export class Agenda implements OnInit {
  readonly Calendar = Calendar;
  readonly CheckCircle = CheckCircle;
  readonly Clock = Clock;
  readonly XCircle = XCircle;
  readonly UserX = UserX;
  readonly Check = Check;
  readonly MessageCircle = MessageCircle;
  readonly Mail = Mail;
  readonly MoreVertical = MoreVertical;
  readonly UsersRound = UsersRound;

  private auth = inject(AuthService);
  private professionalsService = inject(ProfessionalsService);
  private appointmentsService = inject(CitasAgendaService);
  private notify = inject(Notification);

  loading = true;
  selectedDate!: string;
  showAppointmentModal = false;
  role: string | null = null;
  staffId: number | null = null;

  professionals: Professional[] = [];
  selectedProfessionalId: number | null = null;
  noDataProffesionals = false;

  appointments: AppointmentModel[] = [];
  statusConfig = APPOINTMENT_STATUS_CONFIG;

  selectedAppointment: any = null;
  activeMenu: number | null = null;

  // Notas
  showNoteModal = false;
  //noteStatus: string | null = null; // rombi
  noteStatus: AppointmentStatus | null = null;
  noteAppointmentId: number | null = null;
  noteText: string = '';


  /*appointments: Appointment[] = [
    {
      id: 1,
      time: '10:01',
      client: 'Ana López',
      service: 'Psicoterapia individual',
      status: 'confirmada',
      reminders: {
        whatsapp: true,
        email: true,
        sent: true
      }
    },
    {
      id: 2,
      time: '11:30',
      client: 'Marlem Pérez',
      service: 'Terapia de pareja',
      status: 'pendiente',
      reminders: {
        whatsapp: true,
        email: false,
        sent: false
      }
    },
    {
      id: 3,
      time: '12:30',
      client: 'Claudia Pérez',
      service: 'Consulta',
      status: 'cancelada',
      reminders: {
        whatsapp: true,
        email: true,
        sent: true
      }
    },
    {
      id: 4,
      time: '15:00',
      client: 'Monse Islas',
      service: 'Consulta',
      status: 'no_asistio',
      reminders: {
        whatsapp: true,
        email: true,
        sent: false
      }
    }
  ];*/

  ngOnInit() {
    this.selectedDate = this.getTodayLocal();

    this.role = this.auth.getRole();
    this.staffId = this.auth.getStaffId();

    if (!this.role) {
      console.warn('No hay rol definido');
    }

    // STAFF → no cargar profesionales
    if (this.role === 'staff') {
      if (this.staffId) {
        this.selectedProfessionalId = this.staffId;
        this.loadAppointments();
      }
      return;
    }

    this.loadProfessionals();

  }

  loadProfessionals() {
    this.professionalsService.getAll({
      active: true,
      //public: true
      exclude_role: 'receptionist',
      subsystem: 'citas'
    }).subscribe(res => {
      this.professionals = res.data;

      //if (!this.professionals.length) return;

      if (!this.professionals.length) {
        this.selectedProfessionalId = null;
        this.appointments = [];
        this.noDataProffesionals = true; // 👈 para mostrar UI tipo “No hay profesionales”
        return;
      }

      // STAFF → solo él mismo
      if (this.role === 'staff') {

        if (this.staffId) {
          this.selectedProfessionalId = this.staffId;
          this.loadAppointments();
        }

        return; // NO cargar selector
      }

      // ADMIN / OWNER / RECEPTIONIST

      // buscar si el user tiene staff asociado
      const ownProfessional = this.professionals.find(
        p => p.id === this.staffId // importante: staff_member_id === professional.id
      );

      if (ownProfessional) {
        // cargar su propio horario por default
        this.selectedProfessionalId = ownProfessional.id;
      } else {
        // fallback
        this.selectedProfessionalId = this.professionals[0].id;
      }

      this.loadAppointments();

    });
  }

  selectProfessional(id: number | null) {
    if (id === null) return;
    this.selectedProfessionalId = id;
    this.loadAppointments();
  }

  private loadAppointments() {
    this.loading = true;

    //const today = new Date().toISOString().split('T')[0];
    //const today = this.getTodayLocal();

    //console.log(this.selectedDate);

    this.appointmentsService.getAll({ date: this.selectedDate }).subscribe({
      next: (response) => {
        console.log('todo bien con las citas: ', response.data);

        //this.appointments = response.data;
        // rombi - Simular recordatorios

        this.appointments = response.data.map((a, index) => ({
          ...a,
          reminders: a.reminders ?? {
            whatsapp: true,
            email: true,
            sent: true
            /*whatsapp: index % 2 === 0,
            email: index % 3 === 0,
            sent: index % 4 === 0*/
          }
        }));

        this.loading = false;
      },
      error: (error) => {
        console.error('Error cargando citas', error);
        this.appointments = [];
        this.loading = false;
      }
    });
  }

  get selectedProfessionalName(): string {
    const found = this.professionals.find(p => p.id === this.selectedProfessionalId);
    return found ? found.name : 'Mi agenda';
  }

  isClosedStatus(status: string): boolean {
    return ['completed', 'cancelled', 'no_show'].includes(status);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {

    const target = event.target as HTMLElement;

    if (!target.closest('.menu-container')) {
      this.activeMenu = null;
    }

  }

  private getTodayLocal(): string {
    const today = new Date();
    return this.formatDate(today);
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  changeDay(offset: number) {
    const [year, month, day] = this.selectedDate.split('-').map(Number);

    const date = new Date(year, month - 1, day); // ← local, no UTC
    date.setDate(date.getDate() + offset);

    this.selectedDate = this.formatDate(date);
    this.loadAppointments();
  }

  get formattedSelectedDate(): string {
    const [year, month, day] = this.selectedDate.split('-').map(Number);

    const date = new Date(year, month - 1, day); // ← LOCAL, no UTC

    return date.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }

  get today(): string {
    return this.getTodayLocal();
  }

  get isToday(): boolean {
    return this.selectedDate === this.today;
  }

  get isPast(): boolean {
    return this.selectedDate < this.today;
  }

  get isFuture(): boolean {
    return this.selectedDate > this.today;
  }

  get emptyStateTitle(): string {
    if (this.isPast) return 'No tuviste citas este día';
    if (this.isToday) return 'Aún no tienes citas para hoy';
    return 'No hay citas programadas para este día';
  }

  get emptyStateDescription(): string {
    if (this.isPast)
      return 'Este día ya pasó y no se registraron citas.';

    if (this.isToday)
      return 'Agenda tu primera cita para organizar tu día y reducir ausencias.';

    return 'Puedes programar citas para este día con anticipación.';
  }

  get hasAppointments(): boolean {
    return this.appointments.length > 0;
  }

  get totalRevenue(): number {
    return this.appointments.reduce((total, appt) => {
      return total + (appt.service.variant?.price ?? 0);
    }, 0);
  }

  get totalAppointments(): number {
    return this.appointments.length;
  }

  get pastInsight(): string {
    const day = this.formattedSelectedDate;

    return `El ${day} estuvo libre. Podría ser una oportunidad para promociones o campañas de reactivación.`;
  }

  openAppointmentModal(appointment?: any) {
    if (this.isPast) return;

    if (appointment) {
      this.selectedAppointment = appointment;
    }

    this.showAppointmentModal = true;
  }

  /*openAppointmentModal() {
    console.log("vamos con la cita carnal");

    if (this.isPast) return;
    this.showAppointmentModal = true;
  }*/

  handleModalClose(refresh: boolean) {
    this.showAppointmentModal = false;

    if (refresh) {
      this.loadAppointments();
    }
  }

  // Funciones para cambio de "Estatus de la cita" y "Notas"
  openNoteModal(item: any, status: AppointmentStatus) {
    this.noteAppointmentId = item.id;
    this.noteStatus = status;
    this.noteText = '';
    this.showNoteModal = true;
    this.activeMenu = null;
  }

  toggleMenu(id: number) {
    this.activeMenu = this.activeMenu === id ? null : id;
  }

  confirmAppointment(item: any) {
    this.openNoteModal(item, 'confirmed');
  }

  cancelAppointment(item: any) {
    this.openNoteModal(item, 'cancelled');
  }

  completeAppointment(item: any) {
    this.openNoteModal(item, 'completed');
  }

  markNoShow(item: any) {
    this.openNoteModal(item, 'no_show');
  }

  // Aquí es update ya que se necesita actualizar los datos
  rescheduleAppointment(item: any) {
    this.openAppointmentModal(item); // reutilizar modal
  }

  viewAppointmentDetails(item: any) {
    this.selectedAppointment = item;
    this.showAppointmentModal = true;
  }

  updateStatus(id: number, status: string) {
    alert("updateStatus");
    console.log("id: ", id);
    console.log("staus: ", status);
  }

  saveNoteAndStatus() {
    /*console.log('id:', this.noteAppointmentId);
        console.log('estatus:', this.noteStatus);
        console.log('notas:', this.noteText);*/

    if (!this.noteAppointmentId || !this.noteStatus) return;

    const statusMessages: Record<string, string> = {
      confirmed: 'Cita confirmada',
      completed: 'Cita completada',
      cancelled: 'Cita cancelada',
      no_show: 'Cita actualizada', // Cliente no asistió
      rescheduled: 'Cita reagendada'
    };

    const message = statusMessages[this.noteStatus] || 'Cita actualizada';

    this.appointmentsService.updateStatus(this.noteAppointmentId, {
      status: this.noteStatus,
      note: this.noteText || undefined
    }).subscribe({
      next: () => {
        this.notify.success(`${message} correctamente`);

        this.showNoteModal = false;
        this.loadAppointments();
      },

      error: (error) => {
        console.error(error);
        this.notify.error('Ocurrió un error al actualizar la cita. Intenta nuevamente.');
      }
    });
  }

  goToStaff() {
    window.location.href = '/sistemas/citas/equipo';
  }

}

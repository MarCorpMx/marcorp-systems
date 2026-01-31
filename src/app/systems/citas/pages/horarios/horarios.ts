import { Component, OnInit } from '@angular/core';
import {
  LucideAngularModule,
  Clock,
  Plus,
  Coffee,
  CalendarX
} from 'lucide-angular';

interface TimeBlock {
  start: string;
  end: string;
}

interface DaySchedule {
  day: string;
  enabled: boolean;
  blocks: TimeBlock[];
  breaks: TimeBlock[];
}

interface ExceptionDay {
  date: string;
  closed: boolean;
  blocks?: TimeBlock[];
}

@Component({
  selector: 'app-horarios',
  imports: [LucideAngularModule],
  templateUrl: './horarios.html',
  styleUrl: './horarios.css',
})

export class Horarios implements OnInit {
  readonly Clock = Clock;
  readonly Plus = Plus;
  readonly Coffee = Coffee;
  readonly CalendarX = CalendarX;

  loading = true;

  schedule: DaySchedule[] = [];
  exceptions: ExceptionDay[] = [];

  ngOnInit() {
    setTimeout(() => {
      this.loading = false;

      this.schedule = [
        {
          day: 'Lunes',
          enabled: true,
          blocks: [{ start: '09:00', end: '18:00' }],
          breaks: [{ start: '14:00', end: '15:00' }]
        },
        {
          day: 'Martes',
          enabled: true,
          blocks: [{ start: '09:00', end: '18:00' }],
          breaks: []
        },
        {
          day: 'Miércoles',
          enabled: false,
          blocks: [],
          breaks: []
        }
      ];

      this.exceptions = [
        {
          date: '2026-01-25',
          closed: true
        },
        {
          date: '2026-01-30',
          closed: false,
          blocks: [{ start: '10:00', end: '14:00' }]
        }
      ];
    }, 1200);
  }

}

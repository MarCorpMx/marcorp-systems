import { Component, input } from '@angular/core';

@Component({
  selector: 'app-section-tip',
  imports: [],
  templateUrl: './section-tip.html',
  styleUrl: './section-tip.css',
})

export class SectionTip {
  variant = input<'info' | 'success' | 'warning'>('info');
}

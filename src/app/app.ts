import { Component, signal, OnInit  } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './core/services/theme.service';
import { LoadingService } from './core/services/loading.service';
import { Loading } from './shared/components/loading/loading';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Loading],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit{
  protected readonly title = signal('marcorp-systems');

  constructor(private theme: ThemeService, public loading: LoadingService) {}

  ngOnInit(): void {
    this.theme.restoreThemeFromStorage();
  }
}

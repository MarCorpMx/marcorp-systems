import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})



export class LoadingService {

  loading = signal(false);
  mode = signal<'global' | 'none'>('none');

  private timeout: any;

  /*showGlobal() {
    this.timeout = setTimeout(() => {
      this.loading.set(true);
      this.mode.set('global');
    }, 300);
  }*/

  showGlobal(force = false) {
    if (force) {
      this.loading.set(true);
      this.mode.set('global');
      return;
    }

    this.timeout = setTimeout(() => {
      this.loading.set(true);
      this.mode.set('global');
    }, 300);
  }

  hide() {
    clearTimeout(this.timeout);
    this.loading.set(false);
    this.mode.set('none');
  }
}

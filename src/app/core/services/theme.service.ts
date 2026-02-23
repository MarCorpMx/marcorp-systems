import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private readonly STORAGE_KEY = 'current_system';

  /**
   * Aplica el tema visual según el sistema
   */
  applySystemTheme(systemKey: string) {
    document.body.setAttribute('data-system', systemKey);
  }

  /**
   * Guarda sistema y aplica tema
   */
  setCurrentSystem(system: any) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(system));
    this.applySystemTheme(system.subsystem.key);
  }

  /**
   * Obtiene el sistema actual
   */
  getCurrentSystem() {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || 'null');
  }

  /**
   * Restaura el tema al refrescar
   */
  restoreThemeFromStorage() {
    const system = this.getCurrentSystem();

    if (system?.subsystem.key) {
      this.applySystemTheme(system.subsystem.key);
    } else {
      this.clearTheme();
    }
  }

  /**
   * Limpia tema (logout)
   */
  clearTheme() {
    document.body.removeAttribute('data-system');
    localStorage.removeItem(this.STORAGE_KEY);
  }
}

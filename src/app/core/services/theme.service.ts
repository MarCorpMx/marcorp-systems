import { Injectable, signal } from '@angular/core';

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

    // (tema visual)
    const theme = this.getTheme();
    this.setTheme(theme);
  }

  /**
   * Limpia tema (logout)
   */
  clearTheme() {
    document.body.removeAttribute('data-system');
    localStorage.removeItem(this.STORAGE_KEY);
  }

  // soporte dark/light
  private readonly THEME_KEY = 'theme';

 /* setTheme(theme: 'dark' | 'light') {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }

    localStorage.setItem(this.THEME_KEY, theme);
  }*/

  setTheme(theme: 'dark' | 'light') {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(this.THEME_KEY, theme);
  }

  toggleTheme() {
    const current = this.getTheme();
    const next = current === 'dark' ? 'light' : 'dark';
    this.setTheme(next);
  }

  getTheme(): 'dark' | 'light' {
    return (localStorage.getItem(this.THEME_KEY) as any) || 'dark';
  }


}

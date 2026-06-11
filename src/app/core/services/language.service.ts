import { Injectable } from '@angular/core';

export interface GrammarTerms {

  gender: 'masculine' | 'feminine';

  article: string;
  articleCap: string;

  demonstrative: string;
  demonstrativeCap: string;

  possessive: string;
  possessiveCap: string;

  indefinite: string;
  indefiniteCap: string;

  contractionOf: string;
  contractionOfCap: string;

  create: string;
  createCap: string;

  update: string;
  updateCap: string;

  active: string;
  activeCap: string;

  activate: string;
  activateCap: string;

  deactivate: string;
  deactivateCap: string;

}

@Injectable({
  providedIn: 'root',
})

export class LanguageService {

  private readonly feminineWords = [

    'terapia',
    'sesión',
    'consulta',
    'clase',
    'cita',
    'evaluación',
    'asesoría',
    'rutina'

  ];

  getGrammar(word: string): GrammarTerms {

    const normalized = word
      .toLowerCase()
      .trim();

    const isFeminine =
      this.feminineWords.includes(normalized);

    return {

      gender: isFeminine
        ? 'feminine'
        : 'masculine',

      article: isFeminine ? 'la' : 'el',
      articleCap: isFeminine ? 'La' : 'El',

      demonstrative: isFeminine ? 'esta' : 'este',
      demonstrativeCap: isFeminine ? 'Esta' : 'Este',

      possessive: isFeminine ? 'nuestra' : 'nuestro',
      possessiveCap: isFeminine ? 'Nuestra' : 'Nuestro',

      indefinite: isFeminine ? 'una' : 'un',
      indefiniteCap: isFeminine ? 'Una' : 'Un',

      contractionOf: isFeminine ? 'de la' : 'del',
      contractionOfCap: isFeminine ? 'De la' : 'Del',

      create: isFeminine ? 'creada' : 'creado',
      createCap: isFeminine ? 'Creada' : 'Creado',

      update: isFeminine ? 'actualizada' : 'actualizado',
      updateCap: isFeminine ? 'Actualizada' : 'Actualizado',

      active: isFeminine ? 'activa' : 'activo',
      activeCap: isFeminine ? 'Activa' : 'Activo',

      activate: isFeminine ? 'activada' : 'activado',
      activateCap: isFeminine ? 'Activada' : 'Activado',

      deactivate: isFeminine ? 'desactivada' : 'desactivado',
      deactivateCap: isFeminine ? 'Desactivada' : 'Desactivado',

    };

  }
}

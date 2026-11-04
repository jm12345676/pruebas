import { Routes } from '@angular/router';

import { GestionCredenciales } from './componentes/gestion-credenciales/gestion-credenciales';

import { CredencialesComponent } from './componentes/credenciales/credenciales';

import { Niveles } from './componentes/niveles/niveles';

export const routes: Routes = [

  { path: '', redirectTo: 'inicio', pathMatch: 'full' },

  { path: 'inicio', component: GestionCredenciales },

  { path: 'credencial/:matricula', component: CredencialesComponent },

  { path: 'niveles', component: Niveles },

  { path: '**', redirectTo: 'inicio' }

];
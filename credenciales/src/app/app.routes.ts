import { Routes } from '@angular/router';
import { GestionCredenciales } from './componentes/gestion-credenciales/gestion-credenciales';
import { Credenciales } from './componentes/credenciales/credenciales';
import { Niveles } from './componentes/niveles/niveles';
import { BitacoraComponent } from './componentes/bitacora/bitacora';
import { CrearAlumno } from './componentes/crearalumnos/crearalumnos';
import { EditarAlumno } from './componentes/editaralumno/editaralumno';

export const routes: Routes = [

  { path: '', redirectTo: 'inicio', pathMatch: 'full' },

  { path: 'inicio', component: GestionCredenciales },

  { path: 'credencial/:matricula', component: Credenciales },

  { path: 'niveles', component: Niveles },

  { path: 'bitacora', component: BitacoraComponent },

  { path: 'crearalumnos', component: CrearAlumno },

  { path: 'editaralumno/:matricula', component: EditarAlumno },

  { path: '**', redirectTo: 'inicio' }

];
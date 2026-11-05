import { Routes } from '@angular/router';
import { GestionCredenciales } from './componentes/gestion-credenciales/gestion-credenciales';
import { CredencialesComponent } from './componentes/credenciales/credenciales';
import { Niveles } from './componentes/niveles/niveles';
import { BitacoraComponent } from './componentes/bitacora/bitacora';
import { CrearAlumno } from './componentes/crearalumnos/crearalumnos';

export const routes: Routes = [

  { path: '', redirectTo: 'inicio', pathMatch: 'full' },

  { path: 'inicio', component: GestionCredenciales },

  { path: 'credencial/:matricula', component: CredencialesComponent },

  { path: 'niveles', component: Niveles },

  { path: 'bitacora', component:BitacoraComponent},

  {path: 'crearalumnos', component:CrearAlumno },

  { path: '**', redirectTo: 'inicio' }

];
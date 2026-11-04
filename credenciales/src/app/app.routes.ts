import { Routes } from '@angular/router';
import { GestionCredenciales } from './componentes/gestion-credenciales/gestion-credenciales';
import { CredencialesComponent } from './componentes/credenciales/credenciales';
import { Niveles } from './componentes/niveles/niveles'
import { BitacoraComponent } from './componentes/bitacora/bitacora';

export const routes: Routes = [
  { path: 'credenciales', component: GestionCredenciales },
  { path: 'credencial', component: CredencialesComponent},
  { path: 'nivel',component: Niveles },
  { path: 'bitacora', component: BitacoraComponent }
];

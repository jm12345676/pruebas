import { Routes } from '@angular/router';
import { GestionCredenciales } from './componentes/gestion-credenciales/gestion-credenciales';
import { Credenciales } from './componentes/credenciales/credenciales';

export const routes: Routes = [ 
    {path: 'inicio', component:GestionCredenciales},
    {path: 'credencial', component: Credenciales}
];

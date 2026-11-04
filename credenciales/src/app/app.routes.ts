import { Routes } from '@angular/router';
import { GestionCredenciales } from './componentes/gestion-credenciales/gestion-credenciales';
import {credenciales} from './componentes/credenciales/credenciales';
import { Niveles } from './componentes/niveles/niveles';

export const routes: Routes = [ 
    {path: 'inicio', component:GestionCredenciales},
    {path: 'credencial', component: credenciales},
    {path: 'niveles', component:Niveles}
];

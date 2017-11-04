import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

// Importo componentes aquí
import {InicioComponent} from './inicio/inicio.component';
import {ErrorComponent} from './error/error.component';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {PeticionesComponent} from './peticiones/peticiones.component';
import {PeticionesEditComponent} from './peticiones-edit/peticiones-edit.component';
import {RecibosComponent} from './recibos/recibos.component';
import {RecibosDetComponent} from './recibos-det/recibos-det.component';
import {SociosComponent} from './socios/socios.component';
import {SociosDetComponent} from './socios-det/socios-det.component';
import {RemesasComponent} from './remesas/remesas.component';



const appRoutes: Routes = [
  {path: '', component: InicioComponent},
  {path: 'inicio', component: InicioComponent},
  {path: 'socios', component: SociosComponent},
  {path: 'socios-det/:num/:edit', component: SociosDetComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'peticiones', component: PeticionesComponent},
  {path: 'peticiones-edit', component: PeticionesEditComponent},
  {path: 'recibos', component: RecibosComponent},
  {path: 'recibos-det/:num', component:RecibosDetComponent},
  {path: 'remesas', component:RemesasComponent},
  {path: '**', component: ErrorComponent},
  {path: '', redirectTo: 'inicio', pathMatch: 'full'}


];

export const appRoutesProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);

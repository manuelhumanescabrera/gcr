import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

// Importo componentes aquí
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {PeticionesComponent} from './peticiones/peticiones.component';
import {PeticionesEditComponent} from './peticiones-edit/peticiones-edit.component';
import {RecibosComponent} from './recibos/recibos.component';
import {RecibosDetComponent} from './recibos-det/recibos-det.component';
import {SociosComponent} from './socios/socios.component';
import {SociosDetComponent} from './socios-det/socios-det.component';



const appRoutes: Routes = [
  {path: 'socios', component: SociosComponent},
  {path: 'socios-det/:num/:edit', component: SociosDetComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'peticiones', component: PeticionesComponent},
  {path: 'peticiones-edit', component: PeticionesEditComponent},
  {path: 'recibos', component: RecibosComponent},
  {path: 'recibos-det/:num', component:RecibosDetComponent}
  // {path: '', component: HomeComponent},
  // {path: 'tienda', component: TiendaComponent},
  // {path: 'animales', component: AnimalsComponent},
  // {path: 'contacto', component: ContactComponent},
  // {path: 'home', component: HomeComponent},
  // {path: 'cuidadores', component: KeeperComponent},
  // {path: 'registro', component: RegisterComponent},
  // {path: 'login', component: LoginComponent},
  // {path: 'actualizar-datos', component: UserEditComponent},
  // {path: '**', component: HomeComponent},
  // {path: '', redirectTo: 'home', pathMatch: 'full'}

];

export const appRoutesProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);

import { Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { IndexComponent } from './index/index.component';
import { HomeComponent } from './home/home.component';
import { authGuardLoggedIn, authGuardLoggedOut } from './auth.guard';
import { HikesComponent } from './hikes/hikes.component';
import { ProfileComponent } from './profile/profile.component';
import { ShareHikeComponent } from './share-hike/share-hike.component';
import { SeemoreComponent } from './seemore/seemore.component';
import { MyhikesComponent } from './myhikes/myhikes.component';

export const routes: Routes = [
  { path: 'register', component: RegisterComponent, canActivate: [authGuardLoggedOut] }, // Register
  { path: 'login', component: LoginComponent, canActivate: [authGuardLoggedOut] }, // Login
  { path: 'index', component: IndexComponent, canActivate: [authGuardLoggedOut]}, // Index
  { path: 'home', component: HomeComponent, canActivate: [authGuardLoggedIn] }, // Home
  { path: 'hikes', component: HikesComponent, canActivate: [authGuardLoggedIn] }, // Hikes
  { path: 'hikes/:hikeId', component: SeemoreComponent, canActivate: [authGuardLoggedIn] }, // Hike see more
  { path: 'sharehike', component: ShareHikeComponent, canActivate: [authGuardLoggedIn] }, // Share A Hike
  { path: 'myhikes', component: MyhikesComponent, canActivate: [authGuardLoggedIn] }, // My Hikes
  { path: 'profile', component: ProfileComponent, canActivate: [authGuardLoggedIn] }, // Profile
  { path: '', redirectTo: 'index', pathMatch: 'full' }, // Default
  { path: '**', redirectTo: 'index' } // Not found
];

import { Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { IndexComponent } from './index/index.component';
import { HomeComponent } from './home/home.component';
import { authGuard } from './auth.guard';
import { HikesComponent } from './hikes/hikes.component';
import { ProfileComponent } from './profile/profile.component';

export const routes: Routes = [
    { path: 'register', component: RegisterComponent }, // Register
    { path: 'login', component: LoginComponent }, // Login
    { path: 'index', component: IndexComponent }, // Index
    { path: 'home', component: HomeComponent, canActivate: [authGuard]}, // Home
    { path: 'hikes', component: HikesComponent, canActivate: [authGuard]}, // Hikes
    { path: 'profile', component: ProfileComponent, canActivate: [authGuard]}, // Profile
    { path: '', redirectTo: 'index', pathMatch: 'full' }, // Default
    { path: '**', redirectTo: 'index' } // Not found
];

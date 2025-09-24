import { Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { StudentDashboardComponent } from './student-dashboard/student-dashboard.component';
import { LoginComponent } from './login/login.component';
import { Admin } from './admin/admin';
import { TrainerDashboardComponent } from './trainer-dashboard/trainer-dashboard';
import { HomePage } from './home-page/home-page';
import { AdminGuard } from './services/AuthGuard/AdminGuard';
import { TrainerGuard } from './services/AuthGuard/trainer.guard';
import { UserGuard } from './services/AuthGuard/UserGuard';

export const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'student', component: StudentDashboardComponent, canActivate: [UserGuard] },
  // {path:'login',component:LoginComponent},
  { path: 'admin', component: Admin, canActivate: [AdminGuard] },

  { path: 'Trainer', component: TrainerDashboardComponent, canActivate: [TrainerGuard] },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

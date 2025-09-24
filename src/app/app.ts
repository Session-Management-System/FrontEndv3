import { Component, signal } from '@angular/core';
import { LandingComponent } from './landing/landing.component';
import { StudentDashboardComponent } from './student-dashboard/student-dashboard.component';
import { RouterOutlet } from '@angular/router';
import { TrainerDashboardComponent } from './trainer-dashboard/trainer-dashboard';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LandingComponent, StudentDashboardComponent, RouterOutlet, TrainerDashboardComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('frontend');
}

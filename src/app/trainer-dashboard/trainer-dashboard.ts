import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrainerSessionList } from '../trainer-session-list/trainer-session-list';
import { TrainerSessionCreateComponent } from '../trainer-session-create/trainer-session-create';
import { TrainerCalender } from "../trainer-calender/trainer-calender";
import { UserMenu } from '../user-menu/user-menu';
import { StatsCard } from '../stats-card/stats-card';
import { TrainerService } from '../services/trainer.service';

@Component({
  selector: 'app-trainer-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    TrainerSessionList, 
    TrainerSessionCreateComponent, 
    TrainerCalender,
    UserMenu,
    StatsCard
  ],
  templateUrl: './trainer-dashboard.html',
  styleUrls: ['./trainer-dashboard.css']
})
export class TrainerDashboardComponent implements OnInit {
  currentActiveTab: string = 'pending';
  isCreateSessionModalOpen: boolean = false;
  isCalendarModalOpen: boolean = false;
  upcomingSessions : number=0;
  completedSessions:number=0
  registeredSessions:number=0;
  constructor(private trainerService : TrainerService) { }

  ngOnInit(): void {
    this.trainerService.getSessionStats().subscribe(Stats=>{
      this.upcomingSessions=Stats.upcomingSessions;
      this.completedSessions=Stats.completedSessions;
      this.registeredSessions=this.completedSessions+this.upcomingSessions;
      console.log(Stats);
    })
  }

  switchTab(tabName: string): void {
    this.currentActiveTab = tabName;
  }

  openCreateSessionModal(): void {
    this.isCreateSessionModalOpen = true;
  }

  closeCreateSessionModal(): void {
    this.isCreateSessionModalOpen = false;
  }

  openCalendarModal(): void {
    this.isCalendarModalOpen = true;
  }

  closeCalendarModal(): void {
    this.isCalendarModalOpen = false;
  }
}
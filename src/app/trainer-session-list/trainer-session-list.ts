import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrainerService } from '../services/trainer.service';
import { Session } from '../services/trainer.service';
import { CommonServices } from '../services/common.service';

@Component({
  selector: 'app-trainer-session-list',
  imports: [CommonModule],
  templateUrl: './trainer-session-list.html',
  styleUrl: './trainer-session-list.css'
})
export class TrainerSessionList implements OnInit {
  @Input() activeTab: string = "pending";
  pendingSessions: Session[] = [];
  approvedSessions: Session[] = [];
  
  constructor(private trainer: TrainerService, private commonService:CommonServices) { }

  ngOnInit(): void {
    console.log("Its ngOninit in TrainersessionList");
    
    // Load pending sessions
    this.trainer.getPendingSessions().subscribe(sessions => {
      console.log("Pending sessions:", sessions);
      this.pendingSessions = sessions;
    });
    
    // Load approved sessions
    this.trainer.getApprovedSessions().subscribe(sessions => {
      console.log("Approved sessions:", sessions);
      this.approvedSessions = sessions;
    });
  }

  // Calculate duration between start and end times
  calculateDuration(startTime: string, endTime: string): string {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const durationMs = end.getTime() - start.getTime();
    
    // Convert milliseconds to hours and minutes
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0 && minutes > 0) {
      return `${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return `${minutes}m`;
    }
  }

  // Format date to display
  formatDate(dateString: string): string {
     return (this.commonService.formatDate(dateString));
  }

  deleteSession(sessionId: number): void {
    console.log(`Deleting session ${sessionId} from `);
    // Add your delete logic here
    this.trainer.deleteSession(sessionId).subscribe();
    alert(`Session ${sessionId} would be deleted. Implement the delete functionality.`);
    this.commonService.reloadPageAfter(500);
  }

  joinMeeting(meetingUrl: string): void {
    if (meetingUrl) {
      window.open(meetingUrl, '_blank');
    } else {
      alert('Meeting link not available');
    }
  }
}
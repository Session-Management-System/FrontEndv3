import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter,NgModule } from '@angular/core';
import { TrainerService, SessionDto } from '../services/trainer.service'; // Adjust path as needed
import { BrowserModule } from '@angular/platform-browser';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';   // 👈 Add this
import { CommonServices } from '../services/common.service';

@Component({
  selector: 'app-trainer-session-create',
  templateUrl: './trainer-session-create.html',
  styleUrls: ['./trainer-session-create.css'],
  standalone:true,
  imports:[CommonModule,
    FormsModule ]
})
export class TrainerSessionCreateComponent {
  @Input() isOpen: boolean = false;
  @Output() closeModal = new EventEmitter<void>();
  isLoading: boolean = false;
  errorMessage: string = '';

    constructor(
    private trainerService: TrainerService,
    private authService: AuthService,
    private commonService:CommonServices
  ) {}

  sessionData = {
    topic: '',
    startDateTime: '',
    endDateTime: '',
    seatLimit: 0,
    meetingLink: '',
    description: ''
  };

  onClose(): void {
    this.closeModal.emit();
    this.resetForm();
    this.commonService.reloadPageAfter(500);
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    
    // Basic validation
    if (!this.sessionData.topic || !this.sessionData.startDateTime || 
        !this.sessionData.endDateTime || !this.sessionData.seatLimit || !this.sessionData.meetingLink) {
      alert('Please fill in all required fields');
      return;
    }
    
    // Validate date/time
    const startDate = new Date(this.sessionData.startDateTime);
    const endDate = new Date(this.sessionData.endDateTime);
    const now = new Date();
    
    if (startDate <= now) {
      alert('Start date and time must be in the future');
      return;
    }
    
    if (endDate <= startDate) {
      alert('End date and time must be after start date and time');
      return;
    }
    
    // Validate seat limit
    if (Number(this.sessionData.seatLimit) < 1 || Number(this.sessionData.seatLimit) > 50) {
      alert('Seat limit must be between 1 and 50');
      return;
    }
    
 // Prepare data for API
    const sessionDto: SessionDto = {
      title: this.sessionData.topic,
      description: this.sessionData.description,
      capacity: this.sessionData.seatLimit,
      startTime: this.sessionData.startDateTime,
      endTime: this.sessionData.endDateTime,
      sessionLink: this.sessionData.meetingLink
    };

    this.isLoading = true;
    
    this.trainerService.createSession(sessionDto).subscribe({
      next: (response) => {
        alert(response.message || 'Session created successfully! It will be reviewed by the admin.');
        this.onClose();
      },
      error: (error) => {
        console.error('Error creating session:', error);
        this.errorMessage = error.error?.message || 'Failed to create session. Please try again.';
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  private resetForm(): void {
    this.sessionData = {
      topic: '',
      startDateTime: '',
      endDateTime: '',
      seatLimit: 0,
      meetingLink: '',
      description: ''
    };
  }
}
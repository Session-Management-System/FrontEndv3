import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Sessioncards } from '../sessioncards/sessioncards';
import { AdminService } from '../services/admin/admin-service';
import { NgClass, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Session {
  sessionId: number;
  title: string;
  description: string;
  startTime: string; // ISO date string
  endTime: string; // ISO date string
  capacity: number;
  remainingCapacity: number;
  isApproved: boolean;
  sessionLink: string;
  trainerId: number;
  trainerName: string;
}
@Component({
  selector: 'app-admin-sessions',
  imports: [NgClass, NgIf, FormsModule],
  templateUrl: './admin-sessions.html',
  styleUrl: './admin-sessions.css',
})
export class AdminSessions {
  @Input() isOpen: boolean = false;
  @Output() closeModal = new EventEmitter<void>();

  sessions: Session[] = [];
  rejectionReason!: string;
  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadSessions();
  }

  clicked: boolean = false;

  handleClick() {
    this.clicked = !this.clicked;
  }
  showConfirmModal = false;
  selectedSessionId!: number;

  openConfirmModal(sessionId: number) {
    this.selectedSessionId = sessionId;
    this.showConfirmModal = true;
  }
  showRejectModal = false;

  openRejectModal(sessionId: number) {
    this.selectedSessionId = sessionId;
    this.showRejectModal = true;
  }

  RejectRegistration(SessionId: number) {
    console.log(this.rejectionReason);
    console.log(SessionId);
    // Logic to register for the session
    this.adminService.rejectSessionById(SessionId, this.rejectionReason).subscribe({
      next: (response) => {
        console.log('Session rejected:', response);
        this.loadSessions(); // Refresh the sessions list
      },
      error: (err) => {
        console.error('Error rejecting session:', err);
      },
    });
    this.showRejectModal = false;
    alert('Session Rejected!');
    this.loadSessions();
  }

  confirmRegistration() {
    this.showConfirmModal = false;
    console.log(this.selectedSessionId);
    this.adminService.approveSessionById(this.selectedSessionId).subscribe({
      next: (response) => {
        console.log('Session approved:', response);
        this.loadSessions();
      },
      error: (err) => {
        console.error('Error approving session:', err);
      },
    });
    alert('Session Approved!');
  }

  closeOnOverlay(event: MouseEvent) {
    // close only if user clicked on background overlay, not modal content
    if ((event.target as HTMLElement).classList.contains('modal')) {
      this.closeConfirmModal();
    }
  }
  closeConfirmModal() {
    this.showConfirmModal = false;
  }

  formatDateTime(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleString([], {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  formatTime(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  loadSessions() {
    this.adminService.getAllSessions().subscribe({
      next: (data: Session[]) => {
        // assuming API returns an array of session objects
        this.sessions = data;
        console.log('Sessions loaded:', this.sessions);
      },
      error: (err) => {
        console.error('Error fetching sessions', err);
      },
    });
  }
  onClose(): void {
    this.closeModal.emit();
  }
}

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AdminService } from '../services/admin/admin-service';

interface User {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
}
@Component({
  selector: 'app-trainers',
  imports: [],
  templateUrl: './trainers.html',
  styleUrl: './trainers.css',
})
export class Trainers {
  @Input() isOpen: boolean = false;
  @Output() closeModal = new EventEmitter<void>();

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    // Load users when the component initializes
    this.loadUsers();
  }
  users: User[] = [];

  loadUsers() {
    this.adminService.LoadUsers(2).subscribe(
      (data: User[]) => {
        console.log('API raw data:', data);
        this.users = data;
        console.log('Users loaded:', this.users);
      },
      (error) => {
        console.error('Error loading users:', error);
      }
    );
  }
  onClose() {
    this.closeModal.emit();
  }
}

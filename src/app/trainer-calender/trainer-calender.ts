import { Component, Input, Output, EventEmitter,OnInit } from '@angular/core';
import { Session, TrainerService } from '../services/trainer.service';
import { CommonModule } from '@angular/common';
import { CommonServices } from '../services/common.service';

@Component({
  selector: 'app-trainer-calender',
  imports: [CommonModule],
  templateUrl: './trainer-calender.html',
  styleUrl: './trainer-calender.css'
})
export class TrainerCalender  implements OnInit{
  @Input() isOpen: boolean = false;
  @Output() closeModal = new EventEmitter<void>();
  upcomingSessions : Session[]=[];
  previousSessions : Session[]=[];


  onClose(): void {
    this.closeModal.emit();
  }
  constructor(private trainerService :TrainerService,private commonService : CommonServices){

   }
   ngOnInit(){
    this.trainerService.getMySessions().subscribe(sessions => {
    const now = new Date();
    this.previousSessions = [];
    this.upcomingSessions = [];

    for (let s of sessions) {
      if (new Date(s.startTime) < now) {
        this.previousSessions.push(s);
      } else {
        this.upcomingSessions.push(s);
      }
    }
    console.log("testing");
    console.log(this.previousSessions);
    console.log(this.upcomingSessions);
    console.log("testing ends");
  });

   }

   
  dateFormat(data: string): string {
   return this.commonService.formatDate(data);
  }
  trimText(text: string, maxLength: number = 50): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + '...';
}
}

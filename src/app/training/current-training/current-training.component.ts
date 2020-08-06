import {Component, OnInit, OnDestroy, Output, EventEmitter} from '@angular/core';
import { StopTrainingComponent } from './stop-training.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-current-training',
  templateUrl: './current-training.component.html',
  styleUrls: ['./current-training.component.css']
})
export class CurrentTrainingComponent implements OnInit, OnDestroy {

  @Output() trainingExit = new EventEmitter();
  progress = 0;
  timer: number;

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
    this.startOrResumeTimer();
  }

  ngOnDestroy(): void {
    this.onStop();
  }

  startOrResumeTimer(): void{
    this.timer = setInterval(() => {
      this.progress = this.progress + 5;
      if (this.progress >= 100){
        clearInterval(this.timer);
      }
    }, 1000);
  }

  onStop(): void {
    clearInterval(this.timer);
    const dialogRef = this.dialog.open(StopTrainingComponent, {
      data: {
        progress: this.progress
      }
    });

    // get selected value from the modal
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.trainingExit.emit();
      } else {
        this.startOrResumeTimer();
      }
    });
  }

}

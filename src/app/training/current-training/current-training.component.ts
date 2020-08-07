import {Component, OnInit, OnDestroy} from '@angular/core';
import { StopTrainingComponent } from './stop-training.component';
import {MatDialog} from '@angular/material/dialog';
import {TrainingService} from '../training.service';

@Component({
  selector: 'app-current-training',
  templateUrl: './current-training.component.html',
  styleUrls: ['./current-training.component.css']
})
export class CurrentTrainingComponent implements OnInit, OnDestroy {

  progress = 0;
  timer: number;

  constructor(private dialog: MatDialog, private trainingService: TrainingService) { }

  ngOnInit(): void {
    this.startOrResumeTimer();
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
  }

  startOrResumeTimer(): void{
    const selectedExercise = this.trainingService.getSelectedExercise();
    let deltaMilSeconds = 1000;
    if (selectedExercise) {
      deltaMilSeconds = selectedExercise.duration / 100 * 1000;
    }

    this.timer = setInterval(() => {
      this.progress = this.progress + 1;
      if (this.progress >= 100){
        this.trainingService.completeExercise();
        clearInterval(this.timer);
      }
    }, deltaMilSeconds);
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
        this.trainingService.cancelExercise(this.progress);
      } else {
        this.startOrResumeTimer();
      }
    });
  }

}

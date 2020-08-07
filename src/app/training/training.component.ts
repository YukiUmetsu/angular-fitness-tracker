import {Component, OnDestroy, OnInit} from '@angular/core';
import {TrainingService} from './training.service';
import {Exercise} from './exercise.model';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.css']
})
export class TrainingComponent implements OnInit, OnDestroy {
  ongoingTraining = false;
  selectedExercise: Exercise;
  exerciseSubscription: Subscription;

  constructor(private trainingService: TrainingService) { }

  ngOnInit(): void {
    this.exerciseSubscription = this.trainingService.exerciseInProgress.subscribe(ex => {
      this.selectedExercise = ex;
      this.ongoingTraining = !!ex;
    });
  }

  ngOnDestroy(): void {
    this.exerciseSubscription.unsubscribe();
  }
}

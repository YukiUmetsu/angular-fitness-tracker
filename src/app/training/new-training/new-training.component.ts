import {Component, OnDestroy, OnInit} from '@angular/core';
import {TrainingService} from '../training.service';
import {Exercise} from '../exercise.model';
import {NgForm} from '@angular/forms';
import {Subscription} from 'rxjs';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit, OnDestroy {

  exercises: Exercise[];
  private exercisesSubscription: Subscription;

  constructor(
    private trainingService: TrainingService
  ) { }

  // tslint:disable-next-line:typedef
  ngOnInit() {
    this.exercisesSubscription = this.trainingService.exercisesChanged.subscribe(
      exercises => (this.exercises = exercises)
    );
    this.trainingService.fetchAvailableExercises();
  }

  ngOnDestroy(): void {
    this.exercisesSubscription.unsubscribe();
  }


  onStartTraining(form: NgForm): void {
    this.trainingService.startExercise(form.value.exercise);
  }
}

import {Component, OnDestroy, OnInit} from '@angular/core';
import {TrainingService} from '../training.service';
import {Exercise} from '../exercise.model';
import {NgForm} from '@angular/forms';
import {Observable, Subscription} from 'rxjs';
import 'rxjs/add/operator/map';
import {UiService} from '../../shared/ui.service';
import {Store} from '@ngrx/store';
import * as fromRoot from '../../app.reducer';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit, OnDestroy {

  exercises: Exercise[];
  isLoading$: Observable<boolean>;
  private exercisesSubscription: Subscription;

  constructor(
    private trainingService: TrainingService,
    private uiService: UiService,
    private store: Store<{ui: fromRoot.State}>
  ) { }

  // tslint:disable-next-line:typedef
  ngOnInit() {
    this.exercisesSubscription = this.trainingService.exercisesChanged.subscribe(
      exercises => {
        this.exercises = exercises;
      }
    );

    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    this.fetchExercises();
  }

  fetchExercises(): void {
    this.trainingService.fetchAvailableExercises();
  }

  ngOnDestroy(): void {
    if (this.exercisesSubscription) {
      this.exercisesSubscription.unsubscribe();
    }
  }


  onStartTraining(form: NgForm): void {
    this.trainingService.startExercise(form.value.exercise);
  }
}

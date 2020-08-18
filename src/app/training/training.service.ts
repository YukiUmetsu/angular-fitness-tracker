import {Exercise} from './exercise.model';
import {Subject} from 'rxjs';
import {AngularFirestore} from 'angularfire2/firestore';
import {Subscription} from 'rxjs';
import 'rxjs/add/operator/map';
import {Injectable} from '@angular/core';
import {UiService} from '../shared/ui.service';

@Injectable()
export class TrainingService {
  exerciseInProgress = new Subject<Exercise>();
  public exercisesChanged = new Subject<Exercise[]>();
  public finishedExercisesChanged = new Subject<Exercise[]>();
  availableExercises: Exercise[] = [];

  private selectedExercise: Exercise;
  private exercises: Exercise[] = [];
  private finishedExercises: Exercise[] = [];
  private firebaseSubscription: Subscription[] = [];

  constructor(
    private db: AngularFirestore,
    private uiService: UiService
    ) {}

  // tslint:disable-next-line:typedef
  fetchAvailableExercises() {
    this.uiService.loadingStateChanged.next(true);
    this.firebaseSubscription.push(this.db
      .collection('availableExercises')
      .snapshotChanges()
      .map(docArray => {
        return docArray.map(doc => {
          return {
            id: doc.payload.doc.id,
            name: doc.payload.doc.data()['name'],
            duration: doc.payload.doc.data()['duration'],
            calories: doc.payload.doc.data()['calories'],
          };
        });
      })
      .subscribe((exercises: Exercise[]) => {
        this.availableExercises = exercises;
        this.uiService.loadingStateChanged.next(false);
        this.exercisesChanged.next([...this.availableExercises]);
      }, error => {
        this.uiService.loadingStateChanged.next(false);
        this.uiService.showSnackbar('fetching Exercises failed. Please try again.', null, 3000);
        this.exercisesChanged.next(null);
      }));
  }

  startExercise(selectedId: string): void {
    this.selectedExercise = this.availableExercises.find(ex => ex.id === selectedId);
    this.exerciseInProgress.next({...this.selectedExercise});
  }

  removeExercise(): void {
    this.selectedExercise = null;
  }

  getSelectedExercise(): Exercise {
    return {...this.selectedExercise};
  }

  completeExercise(): void {
    this.addExercisesToDatabase({...this.selectedExercise, date: new Date(), state: 'completed'});
    this.selectedExercise = null;
    this.exerciseInProgress.next(null);
  }

  cancelExercise(progress: number): void {
    this.addExercisesToDatabase({
      ...this.selectedExercise,
      duration: this.selectedExercise.duration * (progress / 100),
      calories: this.selectedExercise.calories * (progress / 100),
      date: new Date(),
      state: 'cancelled'
    });
    this.selectedExercise = null;
    this.exerciseInProgress.next(null);
  }

  fetchCompletedOrCancelledExercises(): void {
    this.firebaseSubscription.push(this.db.collection('finishedExercises').valueChanges().subscribe((exercises: Exercise[]) => {
      this.finishedExercisesChanged.next(exercises);
    }));
  }

  // tslint:disable-next-line:typedef
  private addExercisesToDatabase(exercise: Exercise) {
    this.db.collection('finishedExercises').add(exercise);
  }

  cancelSubscriptions() {
    this.firebaseSubscription.forEach(sub => sub.unsubscribe());
  }
}

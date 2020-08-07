import {Exercise} from './exercise.model';
import {Subject} from 'rxjs';

export class TrainingService {
  exerciseInProgress = new Subject<Exercise>();

  availableExercises: Exercise[] = [
    { id: 'crunches', name: 'Crunches', duration: 30, calories: 8 },
    { id: 'touch-toes', name: 'Touch Toes', duration: 180, calories: 15 },
    { id: 'side-lunges', name: 'Side Lunges', duration: 120, calories: 18 },
    { id: 'burpees', name: 'Burpees', duration: 60, calories: 8 }
  ];

  private selectedExercise: Exercise;
  private exercises: Exercise[] = [];

  getAvailableExercises(): Exercise[] {
    return this.availableExercises.slice();
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
    this.exercises.push({...this.selectedExercise, date: new Date(), state: 'completed'});
    this.selectedExercise = null;
    this.exerciseInProgress.next(null);
  }

  cancelExercise(progress: number): void {
    this.exercises.push({
      ...this.selectedExercise,
      duration: this.selectedExercise.duration * (progress / 100),
      calories: this.selectedExercise.calories * (progress / 100),
      date: new Date(),
      state: 'cancelled'
    });
    this.selectedExercise = null;
    this.exerciseInProgress.next(null);
  }

  getCompletedOrCancelledExercises(): Exercise[] {
    return this.exercises.slice();
  }
}

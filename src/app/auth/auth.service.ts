import {AuthData} from './auth-data.model';
import {Subject} from 'rxjs';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {AngularFireAuth} from 'angularfire2/auth';
import {TrainingService} from '../training/training.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {UiService} from '../shared/ui.service';
import * as fromRoot from '../app.reducer';
import {Store} from '@ngrx/store';
import * as UI from '../shared/ui.actions';

// injecting service in service
@Injectable()
export class AuthService {
  isAuthenticated = new Subject<boolean>();
  private isLoggedIn = false;

  constructor(
    private router: Router,
    private angularFireAuth: AngularFireAuth,
    private trainingService: TrainingService,
    private matSnackBar: MatSnackBar,
    private uiService: UiService,
    private store: Store<{ui: fromRoot.State}>
  ) {}

  initAuthListener(): void {
    this.angularFireAuth.authState.subscribe(user => {
      if (user) {
        this.isLoggedIn = true;
        this.isAuthenticated.next(true);
        this.router.navigate(['/training']);
      } else {
        this.trainingService.cancelSubscriptions();
        this.isLoggedIn = false;
        this.isAuthenticated.next(false);
        this.router.navigate(['/login']);
      }
    });
  }

  registerUser(authData: AuthData): void {
    // this.uiService.loadingStateChanged.next(true);
    this.store.dispatch(new UI.StartLoading());
    this.angularFireAuth.auth.createUserWithEmailAndPassword(
      authData.email,
      authData.password
    ).then(result => {
      // this.uiService.loadingStateChanged.next(false);
      this.store.dispatch(new UI.StopLoading());
    })
      .catch(err => {
        // this.uiService.loadingStateChanged.next(false);
        this.store.dispatch(new UI.StopLoading());
        this.matSnackBar.open(err.message, null, {duration: 3000});
      });
  }

  login(authData: AuthData): void {
    this.store.dispatch(new UI.StartLoading());
    this.angularFireAuth.auth.signInWithEmailAndPassword(
      authData.email,
      authData.password
    ).then(result => {
      this.store.dispatch(new UI.StopLoading());
    })
      .catch(err => {
        this.store.dispatch(new UI.StopLoading());
        this.uiService.showSnackbar(err.message, null, {duration: 3000});
      });
  }

  logout(): void {
    this.angularFireAuth.auth.signOut();
  }

  isAuth(): boolean{
    return this.isLoggedIn;
  }

}

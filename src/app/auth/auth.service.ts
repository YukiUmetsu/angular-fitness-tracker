import {User} from './user.model';
import {AuthData} from './auth-data.model';
import {Subject} from 'rxjs';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {AngularFireAuth} from 'angularfire2/auth';
import {TrainingService} from '../training/training.service';

// injecting service in service
@Injectable()
export class AuthService {
  isAuthenticated = new Subject<boolean>();
  private isLoggedIn = false;

  constructor(
    private router: Router,
    private angularFireAuth: AngularFireAuth,
    private trainingService: TrainingService
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
    this.angularFireAuth.auth.createUserWithEmailAndPassword(
      authData.email,
      authData.password
    ).then(result => {
      console.log(result);
    })
      .catch(err => {
        console.log(err);
      });
  }

  login(authData: AuthData): void {
    this.angularFireAuth.auth.signInWithEmailAndPassword(
      authData.email,
      authData.password
    ).then(result => {
      console.log(result);
    })
      .catch(err => {
        console.log(err);
      });
  }

  logout(): void {
    this.angularFireAuth.auth.signOut();
  }

  isAuth(): boolean{
    return this.isLoggedIn;
  }

}

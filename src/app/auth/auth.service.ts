import {User} from './user.model';
import {AuthData} from './auth-data.model';
import {Subject} from 'rxjs';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';

// injecting service in service
@Injectable()
export class AuthService {
  isAuthenticated = new Subject<boolean>();
  private user: User;

  constructor(private router: Router) {
  }

  registerUser(authData: AuthData): void {
    this.user = {
      email: authData.email,
      userId: Math.round(Math.random() * 1000).toString()
    };
    this.authenticatedSuccessfully();
  }

  login(authData: AuthData): void {
    this.user = {
      email: authData.email,
      userId: Math.round(Math.random() * 1000).toString()
    };
    this.authenticatedSuccessfully();
  }

  logout(): void {
    this.user = null;
    this.isAuthenticated.next(false);
    this.router.navigate(['/login']);
  }

  getUser(): User {
    return {...this.user};
  }

  isAuth(): boolean{
    return this.user != null;
  }

  authenticatedSuccessfully(): void {
    this.isAuthenticated.next(true);
    this.router.navigate(['/training']);
  }
}

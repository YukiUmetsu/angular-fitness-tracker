import {Component, OnInit, Output, EventEmitter, OnDestroy} from '@angular/core';
import {AuthService} from '../../auth/auth.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css']
})
export class SidenavListComponent implements OnInit, OnDestroy {
  @Output() closeSidenav = new EventEmitter();
  isAuth = false;
  authSubscription: Subscription;


  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authSubscription = this.authService.isAuthenticated.subscribe(authState => {
      this.isAuth = authState;
    });
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }

  onCloseSidenav(): void {
    this.closeSidenav.emit();
  }

  onLogout(): void {
    this.authService.logout();
    this.onCloseSidenav();
  }
}

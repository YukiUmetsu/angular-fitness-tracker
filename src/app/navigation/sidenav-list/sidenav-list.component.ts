import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css']
})
export class SidenavListComponent implements OnInit {
  @Output() closeSidenav = new EventEmitter();


  constructor() { }

  ngOnInit(): void {
  }

  onCloseSidenav(): void {
    this.closeSidenav.emit();
  }
}

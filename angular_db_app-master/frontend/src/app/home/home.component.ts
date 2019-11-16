import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  template: `
  <div>
    <app-navbar></app-navbar>
    <mat-sidenav-container fxFlexFill>
      <mat-sidenav-content fxFlexFill>
        <router-outlet></router-outlet>
      </mat-sidenav-content>
    </mat-sidenav-container>
  </div>
  `,
  styles: []
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

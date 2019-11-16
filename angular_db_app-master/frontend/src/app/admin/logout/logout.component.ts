import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  template: '<p>logout</p>',
  styles: ['']
})
export class LogoutComponent implements OnInit {

  constructor(private auth: AuthService, private router: Router) {
  }

  ngOnInit() {
    console.log('-------logout----');
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}

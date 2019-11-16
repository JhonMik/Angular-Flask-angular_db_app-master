import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {

    return this.currentUserSubject.value;
  }

  isLoginUser() {
    const currentUser = this.currentUserValue;
    const isLoggedIn = (currentUser && currentUser.token) ? true : false;
    return isLoggedIn;
  }
  login(useremail: string, pwd: string) {
    return this.http.post<any>(`${environment.apiURL}auth/login/`, {
      email: useremail, password: pwd
    }).pipe(map((res) => {
      console.log(res);
      let user = null;
      if (res && res.token) {
        localStorage.setItem('currentUser', JSON.stringify({ token: res.token, role: res.role }));
        user = res;
        this.currentUserSubject.next(user);
      }
      return user;
    }));
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
}

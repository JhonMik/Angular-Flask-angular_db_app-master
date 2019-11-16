import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PersonListModel, PersonDetailModel } from '../models/personal.model';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SurveyService {


  constructor(private http: HttpClient) {
  }
  public getServerURL() {
    return environment.apiURL;
  }
  public getUserLists(): Observable<PersonListModel[]> {
    const serverUrl = this.getServerURL() + `users/`;
    return this.http.get<PersonListModel[]>(serverUrl);
  }
  public getUserDetails(id): Observable<PersonDetailModel[]> {
    const serverUrl = this.getServerURL() + `users/${id}`;
    return this.http.get<PersonDetailModel[]>(serverUrl);
  }
  public getBaseImageUrl() {
    return `${environment.imgURL}`;
  }
}

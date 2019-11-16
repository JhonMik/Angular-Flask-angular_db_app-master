import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OrganizationModel } from '../models/admin.model';
import { PersonListModel, PersonDetailModel } from '../models/personal.model';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }

  public getOrganizationList() {
    const serverUrl = `${environment.apiURL}orgs/`;
    return this.http.get<OrganizationModel[]>(serverUrl);
  }

  public addOrganization(addName: string) {
    const serverUrl = `${environment.apiURL}orgs/`;
    return this.http.post<string>(serverUrl, { name: addName });
  }

  public renameOrganization(orgId: number, addName: string) {
    const serverUrl = `${environment.apiURL}orgs/${orgId}`;
    return this.http.post(serverUrl, { name: addName });
  }

  public deleteOrganization(orgId: number) {
    const serverUrl = `${environment.apiURL}orgs/${orgId}`;
    return this.http.delete<string>(serverUrl);
  }

  public getUsersList(): Observable<PersonDetailModel[]> {
    const serverUrl = `${environment.apiURL}users/`;
    return this.http.get<PersonDetailModel[]>(serverUrl);
  }

  public addUser(userInfo: PersonDetailModel) {
    // const serverUrl = `assets/user.json`;
    console.log(userInfo);
    const serverUrl = `${environment.apiURL}users/`;
    return this.http.post(serverUrl, userInfo);
  }

  public updateUser(userInfo: PersonListModel) {
    console.log(userInfo);
    // const serverUrl = `assets/user.json`;
    const serverUrl = `${environment.apiURL}users/${userInfo.userid}`;
    return this.http.post(serverUrl, userInfo);
  }

  public deleteUser(userID) {
    const serverUrl = `${environment.apiURL}users/${userID}`;
    return this.http.delete<PersonListModel>(serverUrl);
  }

  uploadImage(userid, file: File) {
    const serverUrl = `${environment.apiURL}users/${userid}`;
    const formData = new FormData();
    formData.append('image', file);
    return this.http.put(serverUrl, formData);
  }

  uploadCSV(fileToUpload: File): Observable<any> {
    const serverUrl = `${environment.apiURL}csv/`;
    const formData: FormData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    return this.http.post<any>(serverUrl, formData);
  }

  updateAdminPassword(oldpwd: string, newpwd: string) {
    const serverUrl = `${environment.apiURL}admin/`;
    return this.http.post(serverUrl, { old: oldpwd, new: newpwd });
  }
}

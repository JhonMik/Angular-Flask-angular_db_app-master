import { Component, OnInit, ViewChild, ElementRef, Inject, Input } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { PersonDetailModel } from 'src/app/models/personal.model';
import { OrganizationModel } from 'src/app/models/admin.model';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { ConfirmDlgComponent, ConfirmDialogData } from 'src/app/components/shared/dialog/confirm-dlg/confirm-dlg.component';
import { environment } from 'src/environments/environment';


class ImageSnippet {
  public pending: boolean;
  public status: string;
  constructor(public src: string, public file: File) { }
}

@Component({
  selector: 'app-updateuser',
  templateUrl: './updateuser.component.html',
  styleUrls: ['./updateuser.component.scss']
})
export class UpdateuserComponent implements OnInit {

  @Input() inputtype = '';

  selectedFile: ImageSnippet;
  persons: PersonDetailModel[];
  orgPersons: PersonDetailModel[];
  personForm: FormGroup;
  orgsList: OrganizationModel[];
  userID = '';
  uploadSelectFile: File;
  avatarImgURL = `${environment.imgURL}/static/photos/default_avatar.png`;
  @ViewChild('imageInput', { static: true }) inputImg: ElementRef;
  filterOranization = [];


  constructor(private adminService: AdminService, private frmBuilder: FormBuilder,
    public dialog: MatDialog, private snackBar: MatSnackBar) {
    this.userID = 'new';
    this.personForm = this.frmBuilder.group({
      name: new FormControl(''),
      age: new FormControl(''),
      gender: new FormControl(''),
      ethnicity: new FormControl(''),
      position: new FormControl(''),
      branchOfGov: new FormControl(''),
      ministry: new FormControl(''),
      ancestry: new FormControl(''),
      organizations: new FormControl([]),
    });
  }



  ngOnInit() {
    this.loadUserList();
    this.loadOrgList();
  }

  loadUserList() {
    this.adminService.getUsersList().subscribe((res: PersonDetailModel[]) => {
      console.log(res);
      this.orgPersons = this.persons = res;
      // this.persons = res;
    });
  }

  loadOrgList() {
    this.adminService.getOrganizationList().subscribe((res: OrganizationModel[]) => {
      this.orgsList = res;
    });
  }

  onSubmit(customerData) {

    if (customerData) {
      if (this.userID === 'new') {
        this.adminService.addUser(customerData).subscribe((rlt: any) => {
          console.log(rlt);
          if (rlt && rlt.res === 'ok') {
            this.loadUserList();
            this.processFile(rlt.userid);
            this.openSnackBar(customerData.name + ' was added', 'OK');
          } else if (rlt.res === 'failed') {
            if (rlt.message) {
              this.openSnackBar(rlt.message, 'OK');
            } else {
              this.openSnackBar(customerData.name + ' was failed', 'OK');
            }
          }
        });
      } else {
        customerData.userid = this.userID;
        this.adminService.updateUser(customerData).subscribe((res) => {
          if (res === 'ok') {
            this.loadUserList();
            this.processFile(this.userID);
            this.openSnackBar(customerData.name + ' was updated', 'OK');
          }
        });
      }
    }
  }

  processFile(userid) {
    if (this.inputImg.nativeElement.files.length > 0) {
      const file: File = this.inputImg.nativeElement.files[0];
      const reader = new FileReader();

      reader.addEventListener('load', (event: any) => {

        this.selectedFile = new ImageSnippet(event.target.result, file);

        this.selectedFile.pending = true;
        this.adminService.uploadImage(userid, this.selectedFile.file).subscribe(
          (res) => {
            console.log(res);
            this.onSuccess();
          },
          (err) => {
            this.onError();
          });
      });

      reader.readAsDataURL(file);
    }
  }
  private onSuccess() {
    this.selectedFile.pending = false;
    this.selectedFile.status = 'ok';
  }

  private onError() {
    this.selectedFile.pending = false;
    this.selectedFile.status = 'fail';
    this.selectedFile.src = '';
  }


  onUserSelected() {
    if (this.userID !== 'new') {
      const userData = this.persons.find((person) => {
        return String(person.userid) === String(this.userID);
      });
      console.log(userData, this.userID);
      if (userData) {
        this.personForm.patchValue({
          name: userData.name,
          age: userData.age,
          gender: userData.gender,
          ethnicity: userData.ethnicity,
          position: userData.position,
          branchOfGov: userData.branchOfGov,
          ministry: userData.ministry,
          ancestry: userData.ancestry,
          organizations: userData.organizations.map((name) => {
            const idx = this.orgsList.findIndex((org) => org.name === name);
            return this.orgsList[idx].id;
          }),
        });

        this.avatarImgURL = `${environment.imgURL}${userData.imageurl}`;
        console.log(this.personForm.value);
        return;
      }
    }
    this.personForm.patchValue({
      name: '',
      age: '',
      gender: '',
      ethnicity: '',
      position: '',
      branchOfGov: '',
      ministry: '',
      ancestry: '',
      organizations: [],
    });
  }
  deleteUser() {
    const dlgData: ConfirmDialogData = {
      title: 'Confirm',
      content: 'Do you want to delete the user?',
      type: 'confirm',
      color: 'primary',
    };
    const dialogRef = this.dialog.open(ConfirmDlgComponent, {
      width: '250px',
      data: dlgData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'true') {
        const username = this.persons.find((person) => {
          return String(person.userid) === this.userID;
        });
        this.adminService.deleteUser(this.userID).subscribe(res => {
          console.log(res);
          this.openSnackBar(username + ' was deleted', 'OK');
          this.loadUserList();
        });
      }
    });
  }




  uploadFileEvent() {
    console.log(this.uploadSelectFile);
    this.adminService.uploadCSV(this.uploadSelectFile).subscribe(res => {
      alert(res.res);
    });
  }
  openFileEvent(files: FileList) {
    if (files.length > 0) {
      this.uploadSelectFile = files.item(0);
    }
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  readImageUrl(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();

      reader.onload = (event: any) => {
        this.avatarImgURL = event.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  onFilterOrgChanged() {
    console.log('-------onFilterOrgChanged--------');
    console.log(this.filterOranization);
    this.persons = this.orgPersons.filter((person) => {
      return this.filterOranization.every((orgKey) => {
        const orgName = this.orgsList.find((orgItem) => {
          return orgItem.id === orgKey;
        }).name;
        // console.log(orgName, person.organizations);
        return person.organizations.includes(orgName);
      });
    });
  }
}


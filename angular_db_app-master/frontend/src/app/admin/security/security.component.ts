import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.scss']
})
export class SecurityComponent implements OnInit {

  uploadSelectFile: File;
  oldpwd = '';
  newpwd = '';
  reppwd = '';
  constructor(private adminService: AdminService) { }

  ngOnInit() { }

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

  updatePassword() {
    if (this.oldpwd === '' || this.newpwd === '' || this.reppwd === '' || this.newpwd !== this.reppwd) {
      return false;
    }
    this.adminService.updateAdminPassword(this.oldpwd, this.newpwd).subscribe(res => {
      console.log(res);
    });

  }
}

import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-loadcsv',
  templateUrl: './loadcsv.component.html',
  styleUrls: ['./loadcsv.component.scss']
})
export class LoadcsvComponent implements OnInit {

  uploadSelectFile: File;

  constructor(private adminService: AdminService) { }

  ngOnInit() {
  }
  openFileEvent(files: FileList) {
    if (files.length > 0) {
      this.uploadSelectFile = files.item(0);
    }
  }

  uploadFileEvent() {
    console.log(this.uploadSelectFile);
    this.adminService.uploadCSV(this.uploadSelectFile).subscribe(res => {
      alert(res.res);
    });
  }

}

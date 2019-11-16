import { Component, OnInit, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { PersonDetailModel } from 'src/app/models/personal.model';
import { SurveyService } from 'src/app/services/survey.service';

@Component({
  selector: 'app-user-datail-dlg',
  templateUrl: './user-datail-dlg.component.html',
  styleUrls: ['./user-datail-dlg.component.scss']
})
export class UserDatailDlgComponent implements OnInit {

  @Input() baseURL = this.survey.getBaseImageUrl();
  constructor(
    public dialogRef: MatDialogRef<UserDatailDlgComponent>,
    @Inject(MAT_DIALOG_DATA) public person: PersonDetailModel, private survey: SurveyService) { }

  ngOnInit() {
  }
  onNoClick(): void {
    this.dialogRef.close();
  }



}

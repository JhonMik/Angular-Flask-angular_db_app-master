import { Component, OnInit, Inject, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

export interface ConfirmDialogData {
  title: string;
  content: string;
  type: 'inform' | 'warn' | 'confirm';
  color: 'primary' | 'warn' | 'danger';
}
@Component({
  selector: 'app-confirm-dlg',
  template: `
  <h1 mat-dialog-title (color)="cdData.color">{{cdData.title}}</h1>
  <div mat-dialog-content>
    <p>{{cdData.content}}</p>
  </div>
  <div mat-dialog-actions [ngSwitch]="cdData.type">
    <div *ngSwitchCase="'inform'">
      <button mat-button [mat-dialog-close]="'true'" cdkFocusInitial>Ok</button>
    </div>
    <div *ngSwitchCase="'warn'">
      <button mat-button [mat-dialog-close]="'true'" cdkFocusInitial>Ok</button>
    </div>
    <div *ngSwitchCase="'confirm'">
      <button mat-button [mat-dialog-close]="'true'" cdkFocusInitial>Confirm</button>
      <button mat-button [mat-dialog-close]="'false'" cdkFocusInitial>Cancel</button>
    </div>
  </div>
  `,
  styles: []
})
export class ConfirmDlgComponent implements OnInit {

  public cdData: ConfirmDialogData;

  constructor(
    public dialogRef: MatDialogRef<ConfirmDlgComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData) {
    this.cdData = data;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit(): void {

  }
}

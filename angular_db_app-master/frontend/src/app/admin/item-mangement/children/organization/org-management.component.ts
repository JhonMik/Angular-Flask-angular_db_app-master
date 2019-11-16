import { Component, OnInit, ViewChild } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { OrganizationModel } from 'src/app/models/admin.model';
import { MatSelectionList, MatTableDataSource, MatSnackBar, MatDialog } from '@angular/material';
import { Pipe, PipeTransform } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { ConfirmDialogData, ConfirmDlgComponent } from 'src/app/components/shared/dialog/confirm-dlg/confirm-dlg.component';


@Component({
  selector: 'app-organization-mangement',
  templateUrl: './org-management.component.html',
  styleUrls: ['./org-management.component.scss']
})
export class OrganizationMangementComponent implements OnInit {

  displayedColumns: string[] = ['select', 'name'];
  dataSource = new MatTableDataSource<OrganizationModel>();
  selection = new SelectionModel<OrganizationModel>(true, []);
  renameStatus = false;
  addName = '';
  orgsList: OrganizationModel[];

  @ViewChild('orglist', { static: true }) orglist: MatSelectionList;

  constructor(private adminService: AdminService, private snackBar: MatSnackBar, private dlg: MatDialog) { }

  ngOnInit() {
    this.loadOrgList();
  }

  loadOrgList() {
    this.adminService.getOrganizationList().subscribe((res: OrganizationModel[]) => {
      this.orgsList = res;
      this.dataSource = new MatTableDataSource<OrganizationModel>(res);
    });
  }

  addOrganization() {
    if (this.addName) {
      this.adminService.addOrganization(this.addName).subscribe((res) => {
        this.loadOrgList();
      });
    }
  }

  private async deleteOrgs(orgIds: number[]) {
    return orgIds.map((id) => {
      this.adminService.deleteOrganization(id).subscribe((res) => {
        this.loadOrgList();
      });
    });
  }

  deleteOrganizations() {
    console.log(this.selection.selected);
    if (this.selection.selected.length) {
      this.deleteOrgs(this.selection.selected.map((cur) => cur.id));
    }
  }




  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: OrganizationModel): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id}`;
  }

  onClickRow(row: OrganizationModel) {
    if (!this.selection.isSelected(row) && this.selection.selected.length === 0) {
      console.log('ok');
      this.addName = row.name;
      this.renameStatus = true;
    } else {
      this.renameStatus = false;
    }
    this.selection.toggle(row);
  }

  renameOrganization() {
    if (this.selection.selected.length === 1) {
      console.log('ok', this.selection.selected);
      const prvOrg = this.selection.selected[0];
      const curValue = this.addName;
      const dlgData: ConfirmDialogData = {
        title: 'Confirm',
        content: 'Do you want to rename "' + prvOrg.name + '" to "' + curValue + '"?',
        type: 'confirm',
        color: 'primary',
      };
      const dialogRef = this.dlg.open(ConfirmDlgComponent, {
        width: '250px',
        data: dlgData
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result === 'true') {
          this.adminService.renameOrganization(prvOrg.id, curValue).subscribe(res => {
            if (res === 'ok') {
              this.snackBar.open('Renaming was successed.');
              this.loadOrgList();
            } else {
              this.snackBar.open('Renaming was failed.');
            }
          });
        }
      });
    }
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}



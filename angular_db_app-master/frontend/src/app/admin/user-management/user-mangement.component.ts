import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { PersonDetailModel } from 'src/app/models/personal.model';
import { OrganizationModel } from 'src/app/models/admin.model';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-user-mangement',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {

  ngOnInit(): void { }
}


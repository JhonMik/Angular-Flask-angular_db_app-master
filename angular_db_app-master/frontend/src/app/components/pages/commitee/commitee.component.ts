import { Component, OnInit, ViewChild } from '@angular/core';
import { FilterItem, SearchFilter } from 'src/app/models/filter.model';
import { SurveyService } from 'src/app/services/survey.service';
import { PersonListModel, UserAvartaColumn } from 'src/app/models/personal.model';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { UserDatailDlgComponent } from './user-datail-dlg/user-datail-dlg.component';



@Component({
  selector: 'app-commitee',
  templateUrl: './commitee.component.html',
  styleUrls: ['./commitee.component.scss']
})
export class CommiteeComponent implements OnInit {

  keyConvTitle = {
    name: 'Person (ENG)',
    branchOfGov: 'Branch of Government',
    organizations: 'Organization',
    ministry: 'Ministry',
    position: 'Position',
    gender: 'Gender',
    age: 'Age',
    ancestry: 'Ancestry',
    ethnicity: 'Ethnicity',
  };
  displayedColumns: string[] = [
    'id',
  ];
  dataSource: MatTableDataSource<UserAvartaColumn>;

  ROWPERCOLUMN = 5;


  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  searchResCount = 0;
  constructor(private survey: SurveyService, public dialog: MatDialog) {
    this.dataSource = new MatTableDataSource();
  }
  menus: FilterItem[] = [];
  persons: PersonListModel[] = [];

  ngOnInit() {

    this.survey.getUserLists().subscribe((res) => {
      this.persons = res;
      const filtersList = {
        branchOfGov: ['all'],
        organizations: ['all'],
        ministry: ['all'],
        position: ['all'],
        gender: ['all'],
        age: ['all'],
        ancestry: ['all'],
        ethnicity: ['all'],
      };
      this.persons.forEach((person) => {
        console.log(person);
        Object.keys(filtersList).forEach((searchKey) => {
          if (searchKey === 'organizations') {
            person[searchKey].map((itemKey) => {
              const filterValues = filtersList[searchKey];
              if (filterValues.indexOf(itemKey) < 0) {
                filterValues.push(itemKey);
              }
            });
          } else {

            const personValue = String(person[searchKey]);
            const filterValues = filtersList[searchKey];
            if (filterValues.indexOf(personValue) < 0) {
              filterValues.push(personValue);
            }
          }
        });
      });
      this.changeTheModels(null);

      this.menus = [];
      this.menus = Object.keys(filtersList).map((key) => {
        const data = filtersList[key];
        return {
          title: this.keyConvTitle[key],
          name: key,
          value: data[0],
          items: data.map((datum) => {
            return { value: datum, viewValue: datum };
          })
        };
      });
    });
  }

  changeTheModels(filters: SearchFilter[]) {
    const dataSrc: UserAvartaColumn[] = [];
    this.searchResCount = 0;
    let searchNameValue = '';
    this.persons.filter((person) => {
      if (filters) {

        for (const filter of filters) {
          if (filter.name === 'byname') {
            // console.log(person[filter.name] + ':' + filter.value);
            searchNameValue = filter.value;
            if (!String(Object.values(person).join(' ')).toLowerCase().includes(String(filter.value))) {
              return false;
            }
          } else {
            if (!filter.value || filter.value === 'all') {
              continue;
            }
            if (!String(person[filter.name]).includes(String(filter.value))) {
              return false;
            }
          }
        }
      }
      return true;
    }).forEach((person, index) => {
      const realIdx = Math.floor(index / this.ROWPERCOLUMN);
      if (!dataSrc[realIdx]) {
        dataSrc[realIdx] = {
          id: []
        };
      }
      // console.log(realIdx + ' : ' + dataSrc[realIdx]);
      dataSrc[realIdx].id.push(person);
      this.searchResCount++;
    });
    console.log(dataSrc);
    this.dataSource = new MatTableDataSource(dataSrc);
    this.dataSource.paginator = this.paginator;
  }

  onFilterChange(filters: SearchFilter[]) {
    this.changeTheModels(filters);
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  showDetails(man: PersonListModel) {
    this.survey.getUserDetails(man.userid).subscribe((res) => {
      console.log(res);
      if (res) {
        this.dialog.open(UserDatailDlgComponent, {
          width: '500px',
          panelClass: 'custom-modalbox',
          data: res
        });
      }

    });

  }
}

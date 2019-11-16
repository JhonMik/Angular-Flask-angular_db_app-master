import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SearchFilter } from 'src/app/models/filter.model';

@Component({
  selector: 'app-ss-search-tool',
  templateUrl: './ss-search-tool.component.html',
  styleUrls: ['./ss-search-tool.component.scss']
})
export class SsSearchToolComponent implements OnInit {
  @Input()
  menus = [];

  @Input()
  searchResCount = 0;
  constructor() { }

  byNameSearch: SearchFilter = {
    name: 'byname',
    value: ''
  };

  @Output()
  searchChange = new EventEmitter();
  ngOnInit() { }
  clearFilter() {
    this.menus.forEach((menu) => {
      menu.value = 'all';
    });
    this.byNameSearch.value = '';
    this.onFilterChange();
  }
  onFilterChange() {
    const filterVal: SearchFilter[] = this.menus.map((menu): SearchFilter => {
      return {
        name: menu.name,
        value: menu.value
      };
    });
    filterVal.push(this.byNameSearch);
    console.log(filterVal);
    this.searchChange.emit(filterVal);
  }
  applyFilter(filterValue: string) {
    this.byNameSearch.value = filterValue;
    this.onFilterChange();
  }
}

import { Component, OnInit, Input, ViewChild, EventEmitter, Output, AfterViewInit } from '@angular/core';
import { FilterItem } from 'src/app/models/filter.model';
import { MatList, MatSelect } from '@angular/material';

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss']
})
export class MenuItemComponent implements OnInit, AfterViewInit {

  @Input() menu: FilterItem;
  @Output() filterChange = new EventEmitter();


  @ViewChild('matSelect', { static: true }) matSelect: MatSelect;

  constructor() { }

  onFilterChange() {
    this.filterChange.emit();
  }
  ngOnInit() {
  }
  menulistvisible(vis) {
  }

  ngAfterViewInit(): void { }
}

import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, OnDestroy {


  mobileQuery: MediaQueryList;

  sideBar = [
    { url: '/admin/dashboard', label: 'Dashboard' },
    { url: '/admin/users', label: 'Users' },
    { url: '/admin/items', label: 'Items' },
    { url: '/admin/security', label: 'Security' },
  ];


  private mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 1024px)');
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', this.mobileQueryListener);
  }

  ngOnInit() { }

  ngOnDestroy() {
    this.mobileQuery.removeEventListener('change', this.mobileQueryListener);
  }
}

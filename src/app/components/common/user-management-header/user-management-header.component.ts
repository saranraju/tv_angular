import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-management-header',
  templateUrl: './user-management-header.component.html',
  styleUrls: ['./user-management-header.component.scss'],
})
export class UserManagementHeaderComponent implements OnInit {
  sectionTab: any = 'home';
  // mobileMenu: any;
  isOpen: any = false;
  mobileOverlay: any = false;
  public innerWidth: any;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.innerWidth = window.innerWidth;
    if (this.router.url === '/login') {
      this.sectionTab = 'login';
    }
  }

  navigateHomeRoute() {
    localStorage.setItem('prevUrl', '/financialmarketdata/company');
    let token = localStorage.getItem('access_token');
    let userId: any = localStorage.getItem('id');

    if (userId === '0') {
      // localStorage.clear();
      this.router.navigate(['/login']);
    } else {
      if (token) {
        this.router.navigate(['/financialmarketdata/company']);
      } else {
        this.router.navigate(['/login']);
      }
    }
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.innerWidth = window.innerWidth;
  }

  onClickResponsiveMenu() {
    this.mobileOverlay = !this.mobileOverlay;
    if (this.mobileOverlay) {
      (document.getElementById('menu') as any).style.display = 'block';
    }
    if (!this.mobileOverlay) {
      (document.getElementById('menu') as any).style.display = 'none';
      this.isOpen = false;
    }
  }
  navigateToSection(section: string) {
    if (window.location.pathname !== '/') {
      this.router.navigate(['/']);
    } else {
      this.sectionTab = section;
      document
        .getElementById(`${section}`)
        ?.scrollIntoView({ behavior: 'smooth' });
    }
    if (this.innerWidth <= 1300) {
      this.onClickResponsiveMenu();
    }
  }
  sectionActive(sectionActive: any) {
    this.sectionTab = sectionActive;
  }
}

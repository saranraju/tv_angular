import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-expired-alert-modal',
  templateUrl: './expired-alert-modal.component.html',
  styleUrls: ['./expired-alert-modal.component.scss'],
})
export class ExpiredAlertModalComponent implements OnInit {
  constructor(public auth: AuthService, private router: Router) {}

  ngOnInit(): void {}

  navigateFreeTrial() {
    this.auth.expriedPopup = false;
    localStorage.removeItem('exploreUserTime');
    localStorage.removeItem('access_token');
    this.router.navigate(['/free-trail']);

    // localStorage.clear();
  }

  navigateSubscribe() {
    this.auth.expriedPopup = false;
    // localStorage.clear();
  }
}

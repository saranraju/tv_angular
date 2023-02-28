import { Component, DoCheck, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit, DoCheck {
  timeLeft: any = 1800000;
  seconds: any;
  minutes: any;
  constructor(public auth: AuthService) {}

  ngOnInit(): void {
    setTimeout(() => {
      if (this.auth.exploreUser) {
        let exploreUserLoggedInTime: any =
          localStorage.getItem('exploreUserTime');
        exploreUserLoggedInTime = new Date(exploreUserLoggedInTime);
        let currentTime: any = new Date();
        let timeDiff: any = Math.abs(exploreUserLoggedInTime - currentTime);
        this.timeLeft -= timeDiff;

        let expireTimer = setInterval(() => {
          if (this.timeLeft <= 0) {
            this.seconds = 0;
            this.minutes = 0;
            clearInterval(expireTimer);
          } else if (this.timeLeft >= 1000) {
            this.timeLeft -= 1000;
            this.seconds = Math.floor((this.timeLeft % 60000) / 1000);
            this.minutes = Math.floor(this.timeLeft / 60000);
          }
        }, 1000);
      }
    }, 2000);
  }

  ngDoCheck(): void {
    if (this.auth.exploreUser && this.timeLeft <= 1000) {
      localStorage.setItem('exploreExpired', 'true');
    }
  }
}

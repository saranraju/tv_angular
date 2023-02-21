import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-free-trial-alert',
  templateUrl: './free-trial-alert.component.html',
  styleUrls: ['./free-trial-alert.component.scss'],
})
export class FreeTrialAlertComponent implements OnInit {
  constructor(public auth: AuthService) {}

  ngOnInit(): void {}
}

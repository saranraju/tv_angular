import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-comparable-securities-no-selection-modal',
  templateUrl: './comparable-securities-no-selection-modal.component.html',
  styleUrls: ['./comparable-securities-no-selection-modal.component.scss'],
})
export class ComparableSecuritiesNoSelectionModalComponent implements OnInit {
  @Input() value: any;
  constructor(public auth: AuthService) {}

  ngOnInit(): void {}
}

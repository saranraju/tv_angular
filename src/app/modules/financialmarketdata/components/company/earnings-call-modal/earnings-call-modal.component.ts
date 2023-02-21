import { Component, HostListener, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-earnings-call-modal',
  templateUrl: './earnings-call-modal.component.html',
  styleUrls: ['./earnings-call-modal.component.scss'],
})
export class EarningsCallModalComponent implements OnInit {
  @Input() data: any;
  constructor(public auth: AuthService) {}

  ngOnInit(): void {}

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.auth.openEarningsModal = false;
    }
  }

  handleEarningsModalClick() {
    this.auth.openEarningsModal = false;
  }
}

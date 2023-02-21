import { Component, HostListener, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-alertmodel',
  templateUrl: './alertmodel.component.html',
  styleUrls: ['./alertmodel.component.scss'],
})
export class AlertmodelComponent implements OnInit {
  @Input() alertmsg: any;

  constructor(public auth: AuthService) {}

  ngOnInit(): void {}

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.keyCode === 27) {
      this.auth.closeInsidePopup = false;
    }
  }
}

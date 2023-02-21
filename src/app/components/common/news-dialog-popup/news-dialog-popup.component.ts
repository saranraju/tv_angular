import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-news-dialog-popup',
  templateUrl: './news-dialog-popup.component.html',
  styleUrls: ['./news-dialog-popup.component.scss'],
})
export class NewsDialogPopupComponent implements OnInit {
  @Input() popupDetail: any;
  constructor(public auth: AuthService) {}

  ngOnInit(): void {}

  insidePopupDialogClose() {
    this.auth.closeInsidePopup = false;
  }
}

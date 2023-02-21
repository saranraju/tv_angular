import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-news-modal',
  templateUrl: './news-modal.component.html',
  styleUrls: ['./news-modal.component.scss'],
})
export class NewsModalComponent implements OnInit {
  @Input() news_detail: any;
  single_news_detail: any;
  constructor(public auth: AuthService) {}

  ngOnInit(): void {}

  newsDialogClose() {
    this.auth.openPopupModal = false;
  }

  insideDialog(news_sigle_detail: any) {
    this.auth.closeInsidePopup = true;
    this.single_news_detail = news_sigle_detail;
  }
}

import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-file-view-modal',
  templateUrl: './file-view-modal.component.html',
  styleUrls: ['./file-view-modal.component.scss'],
})
export class FileViewModalComponent implements OnInit {
  @Input() view_pdf: any;
  @Input() data_heading: any;

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    var fileURL = URL.createObjectURL(this.view_pdf);
    let blockDownload: any = this.auth.exploreUser ? '#toolbar=0' : '';
    document
      .getElementById('embed-iframe')
      ?.setAttribute('src', fileURL + blockDownload);
  }

  tableDialogClose() {
    this.auth.expandViewPdf = false;
  }
}

import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
@Component({
  selector: 'app-pdf-viewer-modal',
  templateUrl: './pdf-viewer-modal.component.html',
  styleUrls: ['./pdf-viewer-modal.component.scss'],
})
export class PdfViewerModalComponent implements OnInit {
  @Input() pdf_data: any;
  @Input() companyName: any;
  constructor(public auth: AuthService) {}
  downloadTitle: any;
  ngOnInit(): void {
    this.downloadTitle = `Download ${this.companyName}'s Company Profile`;
    var fileURL = URL.createObjectURL(this.pdf_data);
    document.getElementById('embed-iframe-pdf')?.setAttribute('src', fileURL);

    document
      .getElementById('embed-iframe-pdf-1')
      ?.setAttribute('href', fileURL);
    document
      .getElementById('embed-iframe-pdf-1')
      ?.setAttribute(
        'download',
        `Company Profile - ${this.companyName.replaceAll('_', '')}`
      );
  }

  tableDialogClose() {
    this.auth.expandopenPopupPdfViewer = false;
  }
}

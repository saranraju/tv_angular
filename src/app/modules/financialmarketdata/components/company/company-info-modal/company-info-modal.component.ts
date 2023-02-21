import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-company-info-modal',
  templateUrl: './company-info-modal.component.html',
  styleUrls: ['./company-info-modal.component.scss'],
})
export class CompanyInfoModalComponent implements OnInit {
  @Input() table_data: any;
  @Input() header_data: any;
  @Input() isModal: any;
  constructor(public auth: AuthService) {}

  ngOnInit(): void {}

  tableDialogClose() {
    this.auth.expandopenPopupcompinfo = false;
  }
}

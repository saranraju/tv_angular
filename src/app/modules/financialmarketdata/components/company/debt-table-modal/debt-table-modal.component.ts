import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-debt-table-modal',
  templateUrl: './debt-table-modal.component.html',
  styleUrls: ['./debt-table-modal.component.scss'],
})
export class DebtTableModalComponent implements OnInit {
  constructor(public util: UtilService, public auth: AuthService) {}

  @Input() table_data: any;
  @Input() mh: any;
  @Input() currency: any;
  ngOnInit(): void {}

  tableDialogClose() {
    this.auth.expandopenPopupModal = false;
    this.auth.expandopenPopupModalBalance = false;
    this.auth.expandopenPopupModalCash = false;
    this.auth.expandopenPopupModalRatio = false;
  }
}

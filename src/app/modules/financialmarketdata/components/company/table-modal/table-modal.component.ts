import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-table-modal',
  templateUrl: './table-modal.component.html',
  styleUrls: ['./table-modal.component.scss'],
})
export class TableModalComponent implements OnInit {
  constructor(public util: UtilService, public auth: AuthService) {}

  @Input() table_data: any;

  ngOnInit(): void {}

  tableDialogClose() {
    this.auth.expandopenPopupModal = false;
    this.auth.expandopenPopupModalBalance = false;
    this.auth.expandopenPopupModalCash = false;
    this.auth.expandopenPopupModalRatio = false;
  }
}

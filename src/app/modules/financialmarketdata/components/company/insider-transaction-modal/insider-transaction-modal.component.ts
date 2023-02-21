import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-insider-transaction-modal',
  templateUrl: './insider-transaction-modal.component.html',
  styleUrls: ['./insider-transaction-modal.component.scss'],
})
export class InsiderTransactionModalComponent implements OnInit {
  @Input() table_data: any;
  // @Input() header_data: any;
  @Input() column: any;
  @Input() mh: any;
  constructor(public auth: AuthService, public util: UtilService) {}

  ngOnInit(): void {
    console.log('18----', this.table_data);
  }

  tableDialogClose() {
    this.auth.insiderTranactionModal = false;
  }
}

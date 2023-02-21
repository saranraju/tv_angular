import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-manage-history-modal',
  templateUrl: './manage-history-modal.component.html',
  styleUrls: ['./manage-history-modal.component.scss'],
})
export class ManageHistoryModalComponent implements OnInit {
  constructor(public util: UtilService, public auth: AuthService) {}
  @Input() table_data: any;
  @Input() other_data: any;
  @Input() holding_data: any;
  @Input() director_data: any;
  @Input() companyName: any;
  ngOnInit(): void {}

  tableDialogClose() {
    this.auth.managehistoryModal = false;
  }
}

import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-segment-table-modal',
  templateUrl: './segment-table-modal.component.html',
  styleUrls: ['./segment-table-modal.component.scss'],
})
export class SegmentTableModalComponent implements OnInit {
  @Input() table_data: any;
  @Input() header_data: any;
  @Input() currency: any;
  constructor(public auth: AuthService, public util: UtilService) {}

  ngOnInit(): void {}

  tableDialogClose() {
    this.auth.expandEstimateModal = false;
  }
}

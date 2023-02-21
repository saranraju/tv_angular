import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-estimate-modal',
  templateUrl: './estimate-modal.component.html',
  styleUrls: ['./estimate-modal.component.scss'],
})
export class EstimateModalComponent implements OnInit {
  @Input() table_data: any;
  @Input() header_data: any;
  @Input() type: any;
  constructor(public auth: AuthService, public util: UtilService) {}

  ngOnInit(): void {}

  tableDialogClose() {
    this.auth.expandopenPopupestimate = false;
  }
}

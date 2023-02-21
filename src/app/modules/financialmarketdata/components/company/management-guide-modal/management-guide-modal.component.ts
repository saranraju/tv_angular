import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-management-guide-modal',
  templateUrl: './management-guide-modal.component.html',
  styleUrls: ['./management-guide-modal.component.scss'],
})
export class ManagementGuideModalComponent implements OnInit {
  @Input() table_data: any;
  @Input() header_data: any;
  @Input() mh: any;
  constructor(public auth: AuthService, public util: UtilService) {}

  ngOnInit(): void {}

  tableDialogClose() {
    this.auth.expandManagementGuide = false;
  }
}

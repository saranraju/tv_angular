import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-ownership-table-expand',
  templateUrl: './ownership-table-expand.component.html',
  styleUrls: ['./ownership-table-expand.component.scss'],
})
export class OwnershipTableExpandComponent implements OnInit {
  @Input() table_data: any;
  @Input() header_data: any;
  @Input() column: any;
  @Input() mh: any;
  constructor(public auth: AuthService, public util: UtilService) {}

  ngOnInit(): void {}

  tableDialogClose() {
    this.auth.expandopenPopupcolumn1 = false;
    this.auth.expandopenPopupcolumn2 = false;
    this.auth.expandopenPopupcolumn3 = false;
  }
}

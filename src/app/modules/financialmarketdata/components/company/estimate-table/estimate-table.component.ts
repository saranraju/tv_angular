import { Component, Input, OnInit } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-estimate-table',
  templateUrl: './estimate-table.component.html',
  styleUrls: ['./estimate-table.component.scss'],
})
export class EstimateTableComponent implements OnInit {
  @Input() table_data: any;
  @Input() header_data: any;
  @Input() type: any;
  @Input() mh: any;
  constructor(public util: UtilService) {}

  ngOnInit(): void {}

  tableDialogClose() {}
}

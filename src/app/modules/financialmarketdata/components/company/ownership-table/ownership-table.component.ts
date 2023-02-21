import { Component, Input, OnInit } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-ownership-table',
  templateUrl: './ownership-table.component.html',
  styleUrls: ['./ownership-table.component.scss'],
})
export class OwnershipTableComponent implements OnInit {
  @Input() table_data: any;
  @Input() header_data: any;
  @Input() column: any;
  constructor(public util: UtilService) {}

  ngOnInit(): void {
    console.log('table_data', this.table_data);
  }
}

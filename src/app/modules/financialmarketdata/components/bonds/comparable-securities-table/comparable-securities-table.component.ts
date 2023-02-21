import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-comparable-securities-table',
  templateUrl: './comparable-securities-table.component.html',
  styleUrls: ['./comparable-securities-table.component.scss'],
})
export class ComparableSecuritiesTableComponent implements OnInit {
  @Input() table_data: any;
  @Input() mh: any;
  @Input() section_name1: any;
  @Input() section_name2: any;
  @Input() section_name3: any;
  @Input() section_name4: any;
  @Input() country_name: any;
  @Output() comportable_table = new EventEmitter<any>();
  @Input() remove_icon: boolean = false;
  @Input() ht: any;
  constructor(public util: UtilService) {}

  ngOnInit(): void {}

  compartableSelectedRow(data: any) {
    this.comportable_table.emit(data);
  }
  @Output() selectedRowData = new EventEmitter<any>();
  removeTable(i: any, data: any) {
    // if (i > 1) {
    this.table_data.splice(i, 1);

    // }
    this.selectedRowData.emit(data);
  }
}

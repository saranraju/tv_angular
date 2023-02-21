import { Component, OnInit, Input } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-key-information-table',
  templateUrl: './key-information-table.component.html',
  styleUrls: ['./key-information-table.component.scss'],
})
export class KeyInformationTableComponent implements OnInit {
  @Input() table_data: any;
  @Input() bondLatestData: any;
  @Input() type: any;
  @Input() mh: any;
  @Input() section_name: any;
  @Input() section_name1: any;
  @Input() section_name2: any;
  @Input() value: any;
  @Input() weekly_change: any;
  constructor(public util: UtilService) {}

  ngOnInit(): void {}

  mathround(data: any) {
    return Math.round(data);
  }

  handleWeeklyFunction(e: any, c: any) {
    if (e == undefined) {
      return '%';
    } else {
      return e[c?.fieldName + '_1w_percent_change'];
    }
  }
}

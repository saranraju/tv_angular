import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-bonds-advance-search-table',
  templateUrl: './bonds-advance-search-table.component.html',
  styleUrls: ['./bonds-advance-search-table.component.scss'],
})
export class BondsAdvanceSearchTableComponent implements OnInit {
  @Input() table_data: any;
  @Input() mh: any;
  @Input() table_header: any;
  @Input() type: any;
  @Output() comportable_Search_table = new EventEmitter<any>();
  iconIndex: any = 0;
  shortDown: boolean = false;
  shortUp: boolean = false;
  constructor(public util: UtilService, public auth: AuthService) {}

  ngOnInit(): void {
    this.table_data.sort(function (a: any, b: any) {
      var keyA = a.description;
      var keyB = b.description;
      if (keyA < keyB) return -1;
      if (keyA > keyB) return 1;
      return 0;
    });
    this.table_header.title.forEach((element: any) => {
      if (this.type) {
        if (element.label == 'Entity Name') {
          element['field'] = 'entityName';
        } else if (element.label == 'Tenor in Years') {
          element['field'] = 'tenor';
        } else if (element.label == 'Currency') {
          element['field'] = 'currency';
        } else if (element.label == 'Par Spread') {
          element['field'] = 'par_spread_mid';
        } else if (element.label == 'Quote Spread') {
          element['field'] = 'quote_spread_bid';
        } else if (element.label == 'Upfront Premium') {
          element['field'] = 'up_front_bid';
        } else if (element.label == 'Hazard Rate') {
          element['field'] = 'hazard_rate';
        } else if (element.label == 'Commulative Probability of Default') {
          element['field'] = 'cum_probability_of_default';
        } else if (element.label == 'Sector') {
          element['field'] = 'sector';
        }
      }
    });
  }

  compartableSelectedRow(data: any) {
    this.comportable_Search_table.emit(data);
    if (data) this.auth.openPopupModal = false;
  }

  sortByKey(i: any, field?: any) {
    this.shortDown = !this.shortDown;
    this.iconIndex = i;
    return this.table_data.sort((a: any, b: any) => {
      if (field == 'entityName' || field == 'tenor' || field == 'currency') {
        var x = this.type ? a.cdsDataDetails[field] : a.description;
        var y = this.type ? b.cdsDataDetails[field] : b.description;
        if (this.shortDown) {
          return x < y ? 1 : x > y ? -1 : 0;
        } else {
          return x < y ? -1 : x > y ? 1 : 0;
        }
      } else {
        var x = a[field] ?? '-';
        var y = b[field] ?? '-';
        if (this.shortDown) {
          return x < y ? 1 : x > y ? -1 : 0;
        } else {
          return x < y ? -1 : x > y ? 1 : 0;
        }
      }
    });
  }
}

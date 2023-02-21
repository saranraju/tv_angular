import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-funds-investment-table',
  templateUrl: './funds-investment-table.component.html',
  styleUrls: ['./funds-investment-table.component.scss'],
})
export class FundsInvestmentTableComponent implements OnInit {
  @Input() table_data: any;
  @Input() paginateId: any;
  @Output() selectedRow = new EventEmitter<any>();
  @Input() totalDataLength: any;

  index: any = 0;
  iconIndex: any = 0;
  shortDown: boolean = false;
  shortUp: boolean = false;
  currentPageIndex: any;

  public labels: any = {
    previousLabel: '◄',
    nextLabel: '►',
  };

  constructor(public util: UtilService) {}

  ngOnInit(): void {}

  sortByKey(key: any, i: any, sort?: any) {
    if (sort) {
      this.iconIndex = i;
      this.shortDown = !this.shortDown;
      return this.table_data.value.sort((a: any, b: any) => {
        var x = a[key];
        var y = b[key];
        if (x == null || x == undefined) {
          x = isNaN(x) ? '' : 0;
        }
        if (y == null || y == undefined) {
          y = isNaN(y) ? '' : 0;
        }
        // if (this.iconIndex === 3) {
        //   let nameA: any = new Date(a.latestDate);
        //   let nameB: any = new Date(b.latestDate);

        //   if (this.shortDown === true) {
        //     return nameB - nameA;
        //   } else if (this.shortUp === true) {
        //     return nameA - nameB;
        //   }
        // }
        if (isNaN(x) && isNaN(y)) {
          if (this.shortDown == true) {
            return x < y ? 1 : x > y ? -1 : 0;
          } else {
            return x < y ? -1 : x > y ? 1 : 0;
          }
        }
        if (this.shortDown == true) {
          return x - y;
        } else {
          return y - x;
        }
      });
    }
  }

  tableSelectedRow(data: any, e: any) {
    let selObj = {
      rowData: data,
      selEvent: e.target.textContent,
    };

    this.selectedRow.emit(selObj);
  }

  @Output() changePage = new EventEmitter<any>();
  onPageChange(e: any) {
    this.currentPageIndex = e;
    this.changePage.emit(e);
  }
  @Output() investorNameSelected = new EventEmitter<any>();
  @Output() fundSelectedBenchmark = new EventEmitter<any>();
  @Output() firmSelectedBenchmarkFund = new EventEmitter<any>();
  @Output() fundSelected = new EventEmitter<any>();
  @Output() firmSelected = new EventEmitter<any>();
  @Output() fundNameSelected = new EventEmitter<any>();
  @Input() tableType: any;
  handleFundFirmSelected(header: any, data: any) {
    if (header === 'fund_name') {
      this.fundSelected.emit(data);
    } else if (header === 'firm_name') {
      this.firmSelected.emit(data);
    } else if (this.tableType === 'listedBenchmark' && header === 'Firm_name') {
      this.firmSelected.emit(data);
    } else if (
      this.tableType === 'notListedBenchmark' &&
      header === 'Firm_name'
    ) {
      this.firmSelected.emit(data);
    } else if (
      this.tableType === 'fundBenchmark' &&
      header === 'Fund_name' &&
      data.Fund_name
    ) {
      this.fundSelectedBenchmark.emit(data);
    } else if (
      this.tableType === 'fundBenchmark' &&
      header === 'contolling_firm' &&
      data.contolling_firm
    ) {
      this.firmSelectedBenchmarkFund.emit(data);
    } else if (header === 'entityProperName') {
      this.investorNameSelected.emit(data);
    } else if (header === 'fundName') {
      this.fundNameSelected.emit(data);
    }
  }
}

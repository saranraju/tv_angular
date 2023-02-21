import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-company-advance-search-table',
  templateUrl: './company-advance-search-table.component.html',
  styleUrls: ['./company-advance-search-table.component.scss'],
})
export class CompanyAdvanceSearchTableComponent implements OnInit, OnChanges {
  @Input() table_data: any;
  @Input() selectedCurrency: any;

  constructor(public util: UtilService) {}

  shortDown: any = false;
  iconIndex: any;

  ngOnChanges(): void {
    this.headeroftable[3].name = `Net Worth (${this.selectedCurrency} Mn)`;
    this.headeroftable[4].name = `Revenue (${this.selectedCurrency} Mn)`;
  }

  ngOnInit(): void {
    var keyVal = this.table_data.title[0].key;
    this.table_data.sort(function (a: any, b: any) {
      var nameA = a[keyVal].toLowerCase(),
        nameB = b[keyVal].toLowerCase();
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    });
  }
  sortByKey(key: any, i: any, sort?: any) {
    this.shortDown = !this.shortDown;
    this.iconIndex = i;

    return this.table_data.sort((a: any, b: any) => {
      let x = a[key];
      let y = b[key];
      if (x == null || x == undefined) {
        x = isNaN(x) ? '' : 0;
      }
      if (y == null || y == undefined) {
        y = isNaN(y) ? '' : 0;
      }
      if (isNaN(x) && isNaN(y)) {
        if (this.shortDown !== true) {
          return x < y ? 1 : x > y ? -1 : 0;
        } else {
          return x < y ? -1 : x > y ? 1 : 0;
        }
      }
      if (this.shortDown !== true) {
        return x - y;
      } else {
        return y - x;
      }
    });
  }

  headeroftable: any = [
    {
      name: 'Company Name',
      shorting: true,
      key: 'name',
    },
    {
      name: 'Financial Year',
      shorting: true,
      key: 'latestAnnUpdate',
    },

    {
      name: 'Industry',
      shorting: true,
      key: 'ticsIndustryName',
    },

    {
      name: 'Net Worth (USD Mn)',
      shorting: true,
      key: 'netWorth',
    },
    {
      name: 'Revenue (USD Mn)',
      shorting: true,
      key: 'revenue',
    },
    {
      name: 'Debt/ Equity (x)',
      shorting: true,
      key: 'debtEquity',
    },
    {
      name: 'PAT (%)',
      shorting: true,
      key: 'pat',
    },
  ];
}

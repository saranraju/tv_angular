import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UtilService } from 'src/app/services/util.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { FinancialMarketDataService } from 'src/app/services/financialmarketdata.service';
import { LoaderServiceService } from '../../loader-service.service';
import { WatchlistServiceService } from '../watchlist-service.service';
import { event } from 'jquery';

import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import am4themes_dataviz from '@amcharts/amcharts4/themes/animated';
import * as am4plugins_rangeSelector from '@amcharts/amcharts4/plugins/rangeSelector';
import am4themes_microchart from '@amcharts/amcharts4/themes/microchart';
import { any } from '@amcharts/amcharts4/.internal/core/utils/Array';
import { identity } from 'lodash';
import { Chain } from '@angular/compiler';
@Component({
  selector: 'app-table-watchlist',
  templateUrl: './table-watchlist.component.html',
  styleUrls: ['./table-watchlist.component.scss'],
})
export class TableWatchlistComponent implements OnInit {
  dropdownFlagTable: boolean = false;
  header_data: any = [
    {
      name: 'Revenue Growth',
      unit: '%',
    },
    {
      name: 'EBITDA',
      unit: '%',
    },
    {
      name: 'Debt/EBITDA',
      unit: 'x',
    },
    {
      name: 'FCF',
      unit: 'Million',
    },
    {
      name: 'Current Maturity',
      unit: 'Million',
    },
  ];
  tableData: any = [];
  @Input() ipo_table_data: any;
  @Input() paginate: any;
  @Input() currentPageSelected: any;
  @Input() mh: any;
  @Input() tableType: any;
  @Output() dashboardSelected = new EventEmitter<any>();
  @Output() rumoured_data = new EventEmitter<any>();
  @Input() itemsPerPage: any;
  @Input() display_none: any;
  @Input() type: any;
  @Input() fixedHeight: any;
  iconIndex: any = 0;
  shortDown: boolean = true;
  shortUp: boolean = true;
  tableKey: any;
  TabKey: any = [];
  TabValue: any = [];
  tablecontent: any = false;
  option: any;
  titlevalue: any;

  pdfDataOutput: any;
  count_res: any = 1;
  total_count_res: any = 22;
  company_id: any = 'WFKG8H-R';
  currency: any = 'INR';
  chart: any;
  table_data: any = [];
  table_title: any = '';
  constructor(
    public util: UtilService,
    public auth: AuthService,
    private service: FinancialMarketDataService,
    public loaderService: LoaderServiceService,
    private serv: WatchlistServiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.serv.$watchlistNames.subscribe((response: any) => {
      console.log('got in table', response);
    });
    this.serv.$closenews.subscribe((res: any) => {
      if (res == true) {
        this.tablecontent = true;
      }
    });

    this.serv.$showtabledata.subscribe((res: any) => {
      if (res == 'company') {
        this.OnCompany();
        this.tablecontent = true;
        this.dropdownFlagTable = true;
      } else if (res == 'fixedIncome') {
        this.OnFixedIncome();
        this.tablecontent = true;
        this.dropdownFlagTable = true;
      } else if (res == 'Derivatives') {
        this.OnDerivatives();
        this.tablecontent = true;
        this.dropdownFlagTable = false;
      } else if (res == 'commodity') {
        this.OnCommodity();
        this.tablecontent = true;
        this.dropdownFlagTable = false;
      } else if (res == 'Economy') {
        this.OnEconomy();
        this.tablecontent = true;
        this.dropdownFlagTable = false;
      }
    });

    this.option = {
      width: '100',
    };

    this.titlevalue = 'this is title';
    this.getStockChartData(this.company_id, this.currency);
  }

  testclick(e: any) {
    // alert('sdcsdsdcsdcdscsd');
    this.buttonactive = e;
  }
  onpenclick() {
    this.serv.opensidebar();
  }

  Newsfunction() {
    this.tablecontent = false;
    this.serv.opennewsmodel();
  }
  addnewcolumn() {
    this.serv.addcolunmmodel();
  }
  redirectCompany(e: any, data: any) {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['financialmarketdata/company'], {
        queryParams: {
          comp_id: data.comp_id,
          company_name: data.company_name,
          currency: 'USD',
          entity_id: data.entity_id,
          tab_name: 'company',
        },
      })
    );
    window.open(url, '_blank');
  }
  downloadProfile() {
    // this.responseRecived = true
    this.loaderService.display(true);
    this.total_count_res = 1;
    this.count_res = 0;
    this.service
      .downloadcompanyProfile(this.company_id, this.currency)
      .subscribe(
        (res: any) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);
          //   const blob = new Blob([res.body], {
          //     type: 'application/pdf',
          //   });
          //   const file = new File(
          //     [blob],
          //     '' + `Company Profile ${this.comapny_name}`,
          //     {
          //       type: 'application/pdf',
          //     }
          //   );
          //  this.pdfDataOutput = file

          var file = new Blob([res.body], { type: 'application/pdf' });
          this.pdfDataOutput = file;
          if (this.pdfDataOutput) {
            this.auth.expandopenPopupPdfViewer = true;
          }

          // saveAs(file);
        },
        (err) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);
          console.error('err', err.message);
        }
      );
  }
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
  OnCompany() {
    this.table_title = 'Company Watchlist';
    let table_data: any = {
      title: [
        {
          label: 'Company',
          key: 'company',
          width: '10rem',
          headerAlign: '',
          align: '',
          pointer: true,
          shorting: true,
          formattedNum: false,
          hover: true,
          newsalert: true,
        },
        {
          label: 'News & Event',
          key: 'news_event',
          width: '8rem',
          shorting: true,
          newsIcon: true,
        },
        {
          label: 'Company Snapshot ',
          width: '8rem',
          key: 'company_snapshot',
          shorting: true,
          companyIcon: true,
        },
        {
          label: 'Price',
          width: 500,
          key: 'price',
          shorting: true,
          title: 'price XXXXX',
          hover: true,
          graph: true,
        },
        {
          label: 'Previous Close',
          width: 500,
          key: 'previous_close',
          shorting: true,
        },
        {
          label: '% Daily Change',
          width: 500,
          key: 'daily_change',
          shorting: true,
        },
        {
          label: 'Revenue (Million)',
          width: 500,
          key: 'revenue',
          shorting: true,
        },
        {
          label: 'Revenue Growth %',
          key: 'revenue_growth',
          width: 500,
          shorting: true,
        },
        {
          label: 'EBITDA %',
          key: 'ebitda',
          width: 500,
          shorting: true,
        },
        {
          label: 'FCF (Million)',
          key: 'fcf',
          width: 500,
          shorting: true,
        },
      ],
      value: [
        {
          company: 'Bharat Petroleum Corp. Ltd.',
          news_event: '',
          company_snapshot: '',
          price: 'USD xxxx',
          previous_close: 'USD xxxx.xx',
          daily_change: 'xx.x%',
          revenue: 'Xx',
          revenue_growth: 'Xx',
          ebitda: 'Xx',
          fcf: 'Xx',
          color: '',
          height: '',
          hover: true,
          title: 'fgefgdfgdf',
          comp_id: 'F3M4DW-R',
          company_name: 'Bharat Petroleum Corp. Ltd.',
          currency: 'INR',
          entity_id: '05HWZC-E',
          tab_name: 'company',
          newNews: true,
        },
        {
          company: 'Company 2',
          news_event: '',
          company_snapshot: '',
          price: 'USD xxxx',
          previous_close: 'USD xxxx.xx',
          daily_change: 'xx.x%',
          revenue: 'Xx',
          revenue_growth: 'Xx',
          ebitda: 'Xx',
          fcf: 'Xx',
          color: '',
          height: '',
          hover: '',
          title: 'fgefgdfgdf',
          comp_id: 'F3M4DW-R',
          company_name: 'Bharat Petroleum Corp. Ltd.',
          currency: 'INR',
          entity_id: '05HWZC-E',
          tab_name: 'company',
        },
        {
          company: 'Hindustan Petroleum Corp. Ltd.',
          news_event: '',
          company_snapshot: '',
          price: 'USD xxxx',
          previous_close: 'USD xxxx.xx',
          daily_change: 'xx.x%',
          revenue: 'Xx',
          revenue_growth: 'Xx',
          ebitda: 'Xx',
          fcf: 'Xx',
          color: '',
          height: '',
          hover: '',
          title: 'fgefgdfgdf',
          comp_id: 'B5SB09-R',
          company_name: 'Hindustan Petroleum Corp. Ltd.',
          currency: 'INR',
          entity_id: '05HWVM-E',
          tab_name: 'company',
        },
        {
          company: 'Company 4',
          news_event: '',
          company_snapshot: '',
          price: 'USD xxxx',
          previous_close: 'USD xxxx.xx',
          daily_change: 'xx.x%',
          revenue: 'Xx',
          revenue_growth: 'Xx',
          ebitda: 'Xx',
          fcf: 'Xx',
          color: '',
          height: '',
          hover: '',
          title: 'fgefgdfgdf',
          comp_id: 'F3M4DW-R',
          company_name: 'Bharat Petroleum Corp. Ltd.',
          currency: 'INR',
          entity_id: '05HWZC-E',
          newNews: true,
          tab_name: 'company',
        },
        {
          company: 'Company 5',
          news_event: '',
          company_snapshot: '',
          price: 'USD xxxx',
          previous_close: 'USD xxxx.xx',
          daily_change: 'xx.x%',
          revenue: 'Xx',
          revenue_growth: 'Xx',
          ebitda: 'Xx',
          fcf: 'Xx',
          color: '',
          height: '',
          hover: '',
          title: 'fgefgdfgdf',
          comp_id: 'F3M4DW-R',
          company_name: 'Bharat Petroleum Corp. Ltd.',
          currency: 'INR',
          entity_id: '05HWZC-E',
          tab_name: 'company',
        },
      ],
    };
    this.table_data = table_data;
  }

  OnFixedIncome() {
    this.table_title = 'Fixed-income Watchlist';

    let table_data: any = {
      title: [
        {
          label: 'Issuer Name',
          key: 'issuer_name',
          width: '',
          headerAlign: '',
          align: '',
          pointer: true,
          shorting: true,
          formattedNum: false,
          hover: true,
        },
        {
          label: 'News & Event',
          key: 'news_event',
          shorting: true,
          newsIcon: true,
        },
        {
          label: 'Coupon',
          key: 'coupon',
          shorting: true,
          companyIcon: true,
        },
        {
          label: 'Price',
          key: 'price',
          shorting: true,
          title: 'price XXXXX',
          hover: true,
        },
        {
          label: 'Previous Close',
          key: 'previous_close',
          shorting: true,
        },
        {
          label: '% Daily Change',
          key: 'daily_change',
          shorting: true,
        },
        {
          label: 'Revenue (Million)',
          key: 'revenue',
          shorting: true,
        },
      ],
      value: [
        {
          issuer_name: 'Bond Name 1',
          news_event: '',
          coupon: '0.59%',
          price: 'USD xxxx',
          previous_close: 'USD xxxx.xx',
          daily_change: 'xx.x%',
          revenue: 'Xx',
          revenue_growth: 'Xx',
          ebitda: 'Xx',
          fcf: 'Xx',
          color: '',
          height: '',
          hover: true,
          title: 'fgefgdfgdf',
        },
        {
          issuer_name: 'Bond Name 2',
          news_event: '',
          coupon: '0.59%',
          price: 'USD xxxx',
          previous_close: 'USD xxxx.xx',
          daily_change: 'xx.x%',
          revenue: 'Xx',
          revenue_growth: 'Xx',
          ebitda: 'Xx',
          fcf: 'Xx',
          color: '',
          height: '',
          hover: '',
        },
        {
          issuer_name: 'Bond Name 3',
          news_event: '',
          coupon: '0.59%',
          price: 'USD xxxx',
          previous_close: 'USD xxxx.xx',
          daily_change: 'xx.x%',
          revenue: 'Xx',
          revenue_growth: 'Xx',
          ebitda: 'Xx',
          fcf: 'Xx',
          color: '',
          height: '',
          hover: '',
        },
        {
          issuer_name: 'Bond Name 4',
          news_event: '',
          coupon: '0.59%',
          price: 'USD xxxx',
          previous_close: 'USD xxxx.xx',
          daily_change: 'xx.x%',
          revenue: 'Xx',
          revenue_growth: 'Xx',
          ebitda: 'Xx',
          fcf: 'Xx',
          color: '',
          height: '',
          hover: '',
        },
        {
          issuer_name: 'Bond Name 5',
          news_event: '',
          coupon: '0.59%',
          price: 'USD xxxx',
          previous_close: 'USD xxxx.xx',
          daily_change: 'xx.x%',
          revenue: 'Xx',
          revenue_growth: 'Xx',
          ebitda: 'Xx',
          fcf: 'Xx',
          color: '',
          height: '',
          hover: '',
        },
      ],
    };
    this.table_data = table_data;
  }
  OnDerivatives() {
    this.table_title = 'Derivatives Watchlist';
    let table_data: any = {
      title: [
        {
          label: 'Issuer Name',
          key: 'issuer_name',
          width: '',
          headerAlign: '',
          align: '',
          pointer: true,
          shorting: true,
          formattedNum: false,
          hover: true,
        },
        {
          label: 'News & Event',
          key: 'news_event',
          shorting: true,
          newsIcon: true,
        },
        {
          label: 'Coupon',
          key: 'coupon',
          shorting: true,
          companyIcon: true,
        },
        {
          label: 'Price',
          key: 'price',
          shorting: true,
          title: 'price XXXXX',
          hover: true,
        },
        {
          label: 'Previous Close',
          key: 'previous_close',
          shorting: true,
        },
        {
          label: '% Daily Change',
          key: 'daily_change',
          shorting: true,
        },
        {
          label: 'Revenue (Million)',
          key: 'revenue',
          shorting: true,
        },
      ],
      value: [
        {
          issuer_name: 'Bond Name 1',
          news_event: '',
          coupon: '0.59%',
          price: 'USD xxxx',
          previous_close: 'USD xxxx.xx',
          daily_change: 'xx.x%',
          revenue: 'Xx',
          revenue_growth: 'Xx',
          ebitda: 'Xx',
          fcf: 'Xx',
          color: '',
          height: '',
          hover: true,
          title: 'fgefgdfgdf',
        },
        {
          issuer_name: 'Bond Name 2',
          news_event: '',
          coupon: '0.59%',
          price: 'USD xxxx',
          previous_close: 'USD xxxx.xx',
          daily_change: 'xx.x%',
          revenue: 'Xx',
          revenue_growth: 'Xx',
          ebitda: 'Xx',
          fcf: 'Xx',
          color: '',
          height: '',
          hover: '',
        },
        {
          issuer_name: 'Bond Name 3',
          news_event: '',
          coupon: '0.59%',
          price: 'USD xxxx',
          previous_close: 'USD xxxx.xx',
          daily_change: 'xx.x%',
          revenue: 'Xx',
          revenue_growth: 'Xx',
          ebitda: 'Xx',
          fcf: 'Xx',
          color: '',
          height: '',
          hover: '',
        },
        {
          issuer_name: 'Bond Name 4',
          news_event: '',
          coupon: '0.59%',
          price: 'USD xxxx',
          previous_close: 'USD xxxx.xx',
          daily_change: 'xx.x%',
          revenue: 'Xx',
          revenue_growth: 'Xx',
          ebitda: 'Xx',
          fcf: 'Xx',
          color: '',
          height: '',
          hover: '',
        },
        {
          issuer_name: 'Bond Name 5',
          news_event: '',
          coupon: '0.59%',
          price: 'USD xxxx',
          previous_close: 'USD xxxx.xx',
          daily_change: 'xx.x%',
          revenue: 'Xx',
          revenue_growth: 'Xx',
          ebitda: 'Xx',
          fcf: 'Xx',
          color: '',
          height: '',
          hover: '',
        },
      ],
    };
    this.table_data = table_data;
  }
  OnCommodity() {
    this.table_title = 'Commodity Watchlist';
    let table_data: any = {
      title: [
        {
          label: 'Issuer Name',
          key: 'issuer_name',
          width: '',
          headerAlign: '',
          align: '',
          pointer: true,
          shorting: true,
          formattedNum: false,
          hover: true,
        },
        {
          label: 'News & Event',
          key: 'news_event',
          shorting: true,
          newsIcon: true,
        },
        {
          label: 'Coupon',
          key: 'coupon',
          shorting: true,
          companyIcon: true,
        },
        {
          label: 'Price',
          key: 'price',
          shorting: true,
          title: 'price XXXXX',
          hover: true,
        },
        {
          label: 'Previous Close',
          key: 'previous_close',
          shorting: true,
        },
        {
          label: '% Daily Change',
          key: 'daily_change',
          shorting: true,
        },
        {
          label: 'Revenue (Million)',
          key: 'revenue',
          shorting: true,
        },
      ],
      value: [
        {
          issuer_name: 'Bond Name 1',
          news_event: '',
          coupon: '0.59%',
          price: 'USD xxxx',
          previous_close: 'USD xxxx.xx',
          daily_change: 'xx.x%',
          revenue: 'Xx',
          revenue_growth: 'Xx',
          ebitda: 'Xx',
          fcf: 'Xx',
          color: '',
          height: '',
          hover: true,
          title: 'fgefgdfgdf',
        },
        {
          issuer_name: 'Bond Name 2',
          news_event: '',
          coupon: '0.59%',
          price: 'USD xxxx',
          previous_close: 'USD xxxx.xx',
          daily_change: 'xx.x%',
          revenue: 'Xx',
          revenue_growth: 'Xx',
          ebitda: 'Xx',
          fcf: 'Xx',
          color: '',
          height: '',
          hover: '',
        },
        {
          issuer_name: 'Bond Name 3',
          news_event: '',
          coupon: '0.59%',
          price: 'USD xxxx',
          previous_close: 'USD xxxx.xx',
          daily_change: 'xx.x%',
          revenue: 'Xx',
          revenue_growth: 'Xx',
          ebitda: 'Xx',
          fcf: 'Xx',
          color: '',
          height: '',
          hover: '',
        },
        {
          issuer_name: 'Bond Name 4',
          news_event: '',
          coupon: '0.59%',
          price: 'USD xxxx',
          previous_close: 'USD xxxx.xx',
          daily_change: 'xx.x%',
          revenue: 'Xx',
          revenue_growth: 'Xx',
          ebitda: 'Xx',
          fcf: 'Xx',
          color: '',
          height: '',
          hover: '',
        },
        {
          issuer_name: 'Bond Name 5',
          news_event: '',
          coupon: '0.59%',
          price: 'USD xxxx',
          previous_close: 'USD xxxx.xx',
          daily_change: 'xx.x%',
          revenue: 'Xx',
          revenue_growth: 'Xx',
          ebitda: 'Xx',
          fcf: 'Xx',
          color: '',
          height: '',
          hover: '',
        },
      ],
    };
    this.table_data = table_data;
  }
  OnEconomy() {
    this.table_title = 'Economy Watchlist';
    let table_data: any = {
      title: [
        {
          label: 'Issuer Name',
          key: 'issuer_name',
          width: '',
          headerAlign: '',
          align: '',
          pointer: true,
          shorting: true,
          formattedNum: false,
          hover: true,
        },
        {
          label: 'News & Event',
          key: 'news_event',
          shorting: true,
          newsIcon: true,
        },
        {
          label: 'Coupon',
          key: 'coupon',
          shorting: true,
          companyIcon: true,
        },
        {
          label: 'Price',
          key: 'price',
          shorting: true,
          title: 'price XXXXX',
          hover: true,
        },
        {
          label: 'Previous Close',
          key: 'previous_close',
          shorting: true,
        },
        {
          label: '% Daily Change',
          key: 'daily_change',
          shorting: true,
        },
        {
          label: 'Revenue (Million)',
          key: 'revenue',
          shorting: true,
        },
      ],
      value: [
        {
          issuer_name: 'Bond Name 1',
          news_event: '',
          coupon: '0.59%',
          price: 'USD xxxx',
          previous_close: 'USD xxxx.xx',
          daily_change: 'xx.x%',
          revenue: 'Xx',
          revenue_growth: 'Xx',
          ebitda: 'Xx',
          fcf: 'Xx',
          color: '',
          height: '',
          hover: true,
          title: 'fgefgdfgdf',
        },
        {
          issuer_name: 'Bond Name 2',
          news_event: '',
          coupon: '0.59%',
          price: 'USD xxxx',
          previous_close: 'USD xxxx.xx',
          daily_change: 'xx.x%',
          revenue: 'Xx',
          revenue_growth: 'Xx',
          ebitda: 'Xx',
          fcf: 'Xx',
          color: '',
          height: '',
          hover: '',
        },
        {
          issuer_name: 'Bond Name 3',
          news_event: '',
          coupon: '0.59%',
          price: 'USD xxxx',
          previous_close: 'USD xxxx.xx',
          daily_change: 'xx.x%',
          revenue: 'Xx',
          revenue_growth: 'Xx',
          ebitda: 'Xx',
          fcf: 'Xx',
          color: '',
          height: '',
          hover: '',
        },
        {
          issuer_name: 'Bond Name 4',
          news_event: '',
          coupon: '0.59%',
          price: 'USD xxxx',
          previous_close: 'USD xxxx.xx',
          daily_change: 'xx.x%',
          revenue: 'Xx',
          revenue_growth: 'Xx',
          ebitda: 'Xx',
          fcf: 'Xx',
          color: '',
          height: '',
          hover: '',
        },
        {
          issuer_name: 'Bond Name 5',
          news_event: '',
          coupon: '0.59%',
          price: 'USD xxxx',
          previous_close: 'USD xxxx.xx',
          daily_change: 'xx.x%',
          revenue: 'Xx',
          revenue_growth: 'Xx',
          ebitda: 'Xx',
          fcf: 'Xx',
          color: '',
          height: '',
          hover: '',
        },
      ],
    };
    this.table_data = table_data;
  }
  buttonactive: any = 1;

  buttons = [
    {
      id: 1,
      title: 'WatchList 1',
    },
    {
      id: 2,
      title: 'WatchList 2',
    },
    {
      id: 3,
      title: 'WatchList 3',
    },
  ];

  stock_history_data: any;
  stock_chartData: any = [];
  getStockChartData(id: any, currency: any) {
    this.stock_history_data = [];
    this.stock_chartData = [];
    this.service.getStockChartData(id, currency).subscribe(
      (res) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);

        this.stock_history_data = res;
        for (var i = 0; i < res.length; i++) {
          this.stock_chartData.push({
            Date: res[i].date,
            Open: res[i].open?.toFixed(2),
            High: res[i].high,
            Low: res[i].low,
            Close: res[i].close,
            Volume: res[i].volume,
          });
        }
        this.dateChange('3M');
        this.stockChart();
      },
      (err) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);
      }
    );
  }
  date_type: any;
  dateChange(type: any) {
    this.date_type = type;
    // this.getAllBondsDataHandler(this.date_type);
    let endDate =
      this.stock_history_data[this.stock_history_data.length - 1].date;
    this.util.endDate = new Date(endDate);
    if (type) {
      this.util.setDateHandler(type);

      let dates1W: any = this.stock_history_data.filter((el: any) => {
        return new Date(el.date) > this.util.startDate ? el : '';
      });

      this.stock_chartData = [];
      dates1W.forEach((el: any) => {
        this.stock_chartData.push({
          Date: el.date,
          Open: el.open?.toFixed(2),
          High: el.high,
          Low: el.low,
          Close: el.close,
          Volume: el.volume,
        });
      });

      this.stockChart();
    }
  }
  stockChart() {
    am4core.useTheme(am4themes_animated);
    this.chart = am4core.create('chartdiv5', am4charts.XYChart);
    // $(document).ready(function () {
    //   $('g[aria-labelledby]').hide();
    // });
    this.chart.leftAxesContainer.layout = 'vertical';
    this.chart.data = this.stock_chartData;
    this.chart.dateFormatter.dateFormat = 'dd-MMM-yyyy';
    this.chart.bottomAxesContainer.reverseOrder = true;
    // let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    let dateAxis: any = this.chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.dateFormats.setKey('day', 'dd-MM-yy');
    dateAxis.dateFormats.setKey('month', 'MMM yyyy');
    dateAxis.dateFormats.setKey('week', 'dd-MM-yy');

    dateAxis.periodChangeDateFormats.setKey('day', 'dd-MM-yy');
    dateAxis.periodChangeDateFormats.setKey('month', 'MMM yyyy');
    dateAxis.periodChangeDateFormats.setKey('week', 'dd-MM-yy');
    dateAxis.baseInterval = {
      timeUnit: 'day',
      count: 1,
    };
    dateAxis.renderer.grid.template.location = 1;
    dateAxis.renderer.ticks.template.length = 8;
    dateAxis.renderer.ticks.template.strokeOpacity = 0.1;
    dateAxis.renderer.minWidth = 35;
    dateAxis.renderer.grid.template.disabled = true;
    dateAxis.renderer.ticks.template.disabled = false;
    dateAxis.renderer.ticks.template.strokeOpacity = 0.2;
    dateAxis.renderer.minLabelPosition = 0.01;
    dateAxis.renderer.maxLabelPosition = 0.99;
    dateAxis.keepSelection = true;
    dateAxis.minHeight = 30;
    dateAxis.renderer.line.strokeWidth = 2;
    dateAxis.renderer.labels.template.fill = am4core.color('#ffc000');
    dateAxis.renderer.labels.template.fontSize = 12;
    dateAxis.tooltip.background.cornerRadius = 3;
    dateAxis.tooltip.label.fontSize = 9;
    dateAxis.tooltip.label.padding(5, 5, 5, 5);
    dateAxis.renderer.minGridDistance = 80;
    // dateAxis.groupData = true;
    // dateAxis.minZoomCount = 5;
    // dateAxis.renderer.line.strokeWidth = 2;
    // dateAxis.renderer.line.strokeOpacity = 1;

    var valueAxis: any = this.chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.tooltip.disabled = true;
    valueAxis.zIndex = 1;
    valueAxis.renderer.baseGrid.disabled = true;
    // height of axis
    // valueAxis.height = am4core.percent(65);

    valueAxis.renderer.gridContainer.background.fill = am4core.color('#000000');
    valueAxis.renderer.gridContainer.background.fillOpacity = 0.05;
    // valueAxis.renderer.inside = true;
    // valueAxis.renderer.labels.template.verticalCenter = 'bottom';
    valueAxis.renderer.labels.template.padding(2, 2, 2, 2);
    valueAxis.renderer.labels.template.fill = am4core.color('#ffc000');
    valueAxis.renderer.labels.template.fontSize = 12;
    // valueAxis.fill.template.setAll;
    //valueAxis.renderer.maxLabelPosition = 0.95;
    valueAxis.renderer.line.strokeWidth = 2;
    valueAxis.renderer.line.strokeOpacity = 1;
    // valueAxis.renderer.fontSize = '0.8em';

    valueAxis.renderer.labels.template.adapter.add(
      'text',
      (label: any, target: any) => {
        if (target.dataItem) {
          if (Number(target.dataItem.value) > 1000) {
            return this.util.standardFormat(
              Number(target.dataItem.value),
              1,
              ''
            );
          }
          return this.util.standardFormat(Number(target.dataItem.value), 2, '');
        }
      }
    );

    let series: any = this.chart.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = 'Date';
    series.dataFields.valueY = 'Close';
    // series.tooltipText = '{valueY.value}';
    series.name = 'MSFT: Value';
    series.defaultState.transitionDuration = 0;
    series.tooltipText = 'Stock Price: [bold]{valueY}[/]';
    series.fillOpacity = 0.3;
    series.tooltip.getFillFromObject = false;
    series.tooltip.background.cornerRadius = 3;
    series.tooltip.label.fontSize = 9;
    series.tooltip.label.padding(5, 5, 5, 5);
    series.tooltip.pointerOrientation = 'vertical';
    series.tooltip.background.fill = am4core.color('#000000');
    let fillModifier = new am4core.LinearGradientModifier();
    fillModifier.opacities = [1, 0];
    fillModifier.offsets = [0, 0.6];
    fillModifier.gradient.rotation = 90;
    series.segments.template.fillModifier = fillModifier;

    let valueAxis2: any = this.chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis2.tooltip.disabled = true;
    // height of axis
    valueAxis2.height = am4core.percent(60);
    valueAxis2.zIndex = 3;
    // this makes gap between panels
    valueAxis2.marginTop = 30;
    valueAxis2.renderer.baseGrid.disabled = true;
    // valueAxis2.renderer.inside = true;
    valueAxis2.renderer.labels.template.verticalCenter = 'bottom';
    valueAxis2.renderer.labels.template.padding(2, 2, 2, 2);
    //valueAxis.renderer.maxLabelPosition = 0.95;
    valueAxis2.renderer.fontSize = '10px';
    valueAxis2.renderer.labels.template.fill = am4core.color('#ffc000');
    valueAxis2.renderer.labels.template.fontSize = 12;

    valueAxis2.renderer.labels.template.adapter.add(
      'text',
      (label: any, target: any) => {
        if (target.dataItem) {
          if (Number(target.dataItem.value) > 1000) {
            return this.util.standardFormat(
              Number(target.dataItem.value),
              1,
              ''
            );
          }
          return this.util.standardFormat(Number(target.dataItem.value), 2, '');
        }
      }
    );

    valueAxis2.renderer.gridContainer.background.fill =
      am4core.color('#000000');
    valueAxis2.renderer.gridContainer.background.fillOpacity = 0.05;

    let series2: any = this.chart.series.push(new am4charts.ColumnSeries());
    series2.dataFields.dateX = 'Date';
    series2.dataFields.valueY = 'Volume';
    series2.yAxis = valueAxis2;
    series2.defaultState.transitionDuration = 0;
    series2.tooltipText = 'Volume: [bold]{valueY}[/]';
    series2.fillOpacity = 0.3;
    series2.tooltip.getFillFromObject = false;
    series2.tooltip.background.cornerRadius = 3;
    series2.tooltip.label.fontSize = 9;
    series2.tooltip.label.padding(5, 5, 5, 5);
    series2.tooltip.pointerOrientation = 'vertical';
    series2.tooltip.background.fill = am4core.color('#000000');
    series2.name = 'MSFT: Volume';
    // volume should be summed
    // series2.groupFields.valueY = 'sum';
    series2.defaultState.transitionDuration = 0;

    this.chart.cursor = new am4charts.XYCursor();
    // Add range selector
    // const selector: any =
    //   new am4plugins_rangeSelector.DateAxisRangeSelector();
    // selector.container = document.getElementById('controls');
    // selector.axis = dateAxis;
    // let scrollbarX = new am4charts.XYChartScrollbar();
    // scrollbarX.series.push(series);
    // scrollbarX.marginBottom = 20;
    // scrollbarX.scrollbarChart.xAxes.getIndex(0).minHeight = undefined;
    // chart.scrollbarX = scrollbarX;
  }
  dropCol(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.table_data.title,
      event.previousIndex,
      event.currentIndex
    );
  }
}

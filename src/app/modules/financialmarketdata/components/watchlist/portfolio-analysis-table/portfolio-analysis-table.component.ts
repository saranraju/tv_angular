import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChildren,
} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UtilService } from 'src/app/services/util.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { FinancialMarketDataService } from 'src/app/services/financialmarketdata.service';
import { LoaderServiceService } from '../../loader-service.service';
import { WatchlistComponent } from '../watchlist.component';
import { WatchlistServiceService } from '../watchlist-service.service';

@Component({
  selector: 'app-portfolio-analysis-table',
  templateUrl: './portfolio-analysis-table.component.html',
  styleUrls: ['./portfolio-analysis-table.component.scss'],
})
export class PortfolioAnalysisTableComponent implements OnInit {
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
  tablecontent: any = false;
  showbutton: any = false;
  showportfolio: any = false;
  isreadonly: any = [];
  table_data: any = [];
  count_res: any;
  titlevalue: any;
  Company1_Data: any = [];
  Company2_Data: any = [];
  Company3_Data: any = [];
  Company4_Data: any = [];
  Company5_Data: any = [];

  constructor(
    public util: UtilService,
    public auth: AuthService,
    private service: FinancialMarketDataService,
    public loaderService: LoaderServiceService,
    private serv: WatchlistServiceService
  ) {}

  ngOnInit(): void {
    this.serv.$showbothportfolio.subscribe((res) => {
      if (res == true) {
        this.tablecontent = true;
        this.showbutton = true;
      }
    });
    for (let i = 0; i <= 4; i++) {
      this.isreadonly[i] = true;
    }
    this.serv.$showtabledata.subscribe((res: any) => {
      if (res == 'company') {
        this.OnCompany();
        this.tablecontent = true;
        this.showbutton = true;
      } else if (res == 'fixedIncome') {
        this.OnFixedIncome();
        this.tablecontent = true;
        this.showbutton = true;
      } else if (res == 'Derivatives') {
        this.tablecontent = false;
        this.showbutton = false;
      } else if (res == 'commodity') {
        this.tablecontent = false;
        this.showbutton = false;
      } else if (res == 'Economy') {
        this.tablecontent = false;
        this.showbutton = false;
      }
    });
  }
  OnCompany() {
    let portfolio_data: any = {
      title: [
        {
          label: 'Company',
          key: 'company',
          width: '14rem',
          headerAlign: '',
          align: '',
          pointer: true,
          shorting: true,
          formattedNum: false,
          hover: true,
        },
        {
          label: 'Buy Qty',
          key: 'buy_qty',
          shorting: true,
          newsIcon: true,
          input: true,
        },
        {
          label: 'Buy Price',
          key: 'buy_price',
          shorting: true,
          companyIcon: true,
          input: true,
        },
        {
          label: 'Brokerage',
          key: 'brokerage',
          shorting: true,
          companyIcon: true,
          input: true,
        },
        {
          label: 'Tax',
          key: 'tax',
          shorting: true,
          companyIcon: true,
          input: true,
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
        {
          label: 'Revenue Growth %',
          key: 'revenue_growth',
          shorting: true,
        },
        {
          label: 'EBITDA %',
          key: 'ebitda',
          shorting: true,
        },
        {
          label: 'FCF (Million)',
          key: 'fcf',
          shorting: true,
        },
      ],
      value: [
        {
          company: 'Company 1',
          buy_qty: '',
          buy_price: '',
          brokerage: '',
          tax: '',
          price: 'USD xxxx',
          previous_close: 'USD xxxx.xx',
          daily_change: 'xx.x%',
          revenue: 'Xx',
          revenue_growth: 'Xx',
          ebitda: 'Xx',
          fcf: 'Xx',
          color: '',
          width: '14rem',
          height: '',
          hover: true,
          title: 'fgefgdfgdf',
        },
        {
          company: 'Company 2',
          buy_qty: '',
          buy_price: '',
          brokerage: '',
          tax: '',
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
          company: 'Company 3',
          buy_qty: '',
          buy_price: '',
          brokerage: '',
          tax: '',
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
          company: 'Company 4',
          buy_qty: '',
          buy_price: '',
          brokerage: '',
          tax: '',
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
          company: 'Company 5',
          buy_qty: '',
          buy_price: '',
          brokerage: '',
          tax: '',
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
    this.table_data = portfolio_data;
  }
  OnFixedIncome() {
    let portfolio_data: any = {
      title: [
        {
          label: 'Security Name',
          key: 'company',
          width: '',
          headerAlign: '',
          align: '',
          pointer: true,
          shorting: true,
          formattedNum: false,
          hover: true,
        },
        {
          label: 'Buy Qty',
          key: 'buy_qty',
          shorting: true,
          newsIcon: true,
          input: true,
        },
        {
          label: 'Buy Price',
          key: 'buy_price',
          shorting: true,
          companyIcon: true,
          input: true,
        },
        {
          label: 'Brokerage',
          key: 'brokerage',
          shorting: true,
          companyIcon: true,
          input: true,
        },
        {
          label: 'Tax',
          key: 'tax',
          shorting: true,
          companyIcon: true,
          input: true,
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
        {
          label: 'Revenue Growth %',
          key: 'revenue_growth',
          shorting: true,
        },
        {
          label: 'EBITDA %',
          key: 'ebitda',
          shorting: true,
        },
        {
          label: 'FCF (Million)',
          key: 'fcf',
          shorting: true,
        },
      ],
      value: [
        {
          company: 'Bond Name 1',
          buy_qty: '',
          buy_price: '',
          brokerage: '',
          tax: '',
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
          company: 'Bond Name  2',
          buy_qty: '',
          buy_price: '',
          brokerage: '',
          tax: '',
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
          company: 'Bond Name  3',
          buy_qty: '',
          buy_price: '',
          brokerage: '',
          tax: '',
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
          company: 'Bond Name  4',
          buy_qty: '',
          buy_price: '',
          brokerage: '',
          tax: '',
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
          company: 'Bond Name  5',
          buy_qty: '',
          buy_price: '',
          brokerage: '',
          tax: '',
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
    this.table_data = portfolio_data;
  }
  portfolio_btn() {
    this.showportfolio = true;
  }
  closeportfolio() {
    this.showportfolio = false;
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
  isreadonlyfunction(event: any) {
    this.isreadonly[event] = false;
  }

  @ViewChildren('inputId') Allinput: any;
  OninputChange(input: any, e: any) {
    let inputData: any = [];
    this.isreadonly[e] = true;
    if (input.target.value != undefined) {
      this.Allinput.toArray().forEach((ele: any) => {
        inputData.push({
          company:
            ele.nativeElement.parentElement.parentElement.parentElement
              .firstChild.innerText,
          input_value: ele.nativeElement.value,
        });
      });
    }
    console.log(inputData);
  }
}

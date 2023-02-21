import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FinancialMarketDataService } from 'src/app/services/financialmarketdata.service';
import { UtilService } from 'src/app/services/util.service';
import { LoaderServiceService } from '../../loader-service.service';
import { WatchlistServiceService } from '../watchlist-service.service';

@Component({
  selector: 'app-table-model-watchlist',
  templateUrl: './table-model-watchlist.component.html',
  styleUrls: ['./table-model-watchlist.component.scss'],
})
export class TableModelWatchlistComponent implements OnInit {
  displayStyle: any = 'none';
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
  tablecontent: any = true;
  option: any;
  titlevalue: any = '';
  table_data: any = {
    title: [
      {
        label: '',
        key: 'company',
        width: '',
        headerAlign: '',
        align: '',
        pointer: true,
        shorting: true,
        formattedNum: false,
        hover: true,
        checkbox: true,
      },
      {
        label: 'Symbol',
        key: 'symbol',
        shorting: true,
        title: 'symbol XXXXX',
        hover: true,
      },
      {
        label: 'Name',
        key: 'name',
        shorting: true,
      },
      {
        label: 'Exchange',
        key: 'daily_change',
        shorting: true,
      },
      {
        label: 'Domicile',
        key: 'revenue',
        shorting: true,
      },
    ],
    value: [
      {
        id: 1,
        company: '',
        news_event: '',
        company_snapshot: '',
        symbol: 'USD xxxx',
        name: 'USD xxxx.xx',
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
        id: 2,
        company: '',
        news_event: '',
        company_snapshot: '',
        symbol: 'USD xxxx',
        name: 'USD xxxx.xx',
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
        id: 3,
        company: '',
        news_event: '',
        company_snapshot: '',
        symbol: 'USD xxxx',
        name: 'USD xxxx.xx',
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
        id: 4,
        company: '',
        news_event: '',
        company_snapshot: '',
        symbol: 'USD xxxx',
        name: 'USD xxxx.xx',
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
        id: 5,
        company: '',
        news_event: '',
        company_snapshot: '',
        symbol: 'USD xxxx',
        name: 'USD xxxx.xx',
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
        id: 6,
        company: '',
        news_event: '',
        company_snapshot: '',
        symbol: 'USD xxxx',
        name: 'USD xxxx.xx',
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
        id: 7,
        company: '',
        news_event: '',
        company_snapshot: '',
        symbol: 'USD xxxx',
        name: 'USD xxxx.xx',
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
        id: 8,
        company: '',
        news_event: '',
        company_snapshot: '',
        symbol: 'USD xxxx',
        name: 'USD xxxx.xx',
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
        id: 9,
        company: '',
        news_event: '',
        company_snapshot: '',
        symbol: 'USD xxxx',
        name: 'USD xxxx.xx',
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
        id: 10,
        company: '',
        news_event: '',
        company_snapshot: '',
        symbol: 'USD xxxx',
        name: 'USD xxxx.xx',
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
  pdfDataOutput: any;
  count_res: any;
  total_count_res: any;
  company_id: any = 'WFKG8H-R';
  currency: any = 'INR';
  constructor(
    public util: UtilService,
    public auth: AuthService,
    private service: FinancialMarketDataService,
    public loaderService: LoaderServiceService,
    private serv: WatchlistServiceService
  ) {}

  ngOnInit(): void {
    this.serv.$showtablemodel.subscribe((res: any) => {
      if (res == true) {
        this.openmodel();
      }
    });
  }
  openmodel() {
    this.displayStyle = 'block';
  }
  closePopup() {
    this.displayStyle = 'none';
    // this.service.closenewsmodel();
  }

  @ViewChildren('allCheckBox') allCheckBox: any;
  onHeaderChecked(e: any) {
    if (e.target.checked) {
      this.allCheckBox.toArray().forEach((element: any) => {
        element.nativeElement.checked = true;
      });
    } else {
      this.allCheckBox.toArray().forEach((element: any) => {
        element.nativeElement.checked = false;
      });
    }
  }
  @ViewChild('headerCheckBox') headerCheckBox: any;

  Onuncheck(event: any) {
    let checkedCount: any = 0;
    let unCheckedCount: any = 0;
    this.allCheckBox.toArray().forEach((element: any) => {
      if (element.nativeElement.checked) {
        checkedCount++;
      } else {
        unCheckedCount++;
      }
    });
    if (checkedCount == checkedCount - unCheckedCount) {
      this.headerCheckBox.nativeElement.checked = true;
    } else {
      this.headerCheckBox.nativeElement.checked = false;
    }
  }

  importData() {
    let temp: any = [];
    this.allCheckBox.toArray().forEach((element: any, index: any) => {
      if (element.nativeElement.checked) {
        temp.push(this.table_data.value[index]);
      }
    });
    console.log(temp);
  }
}

import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UtilService } from 'src/app/services/util.service';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit, OnChanges {
  @Input() table_data: any;
  @Input() mh: any;
  @Input() tabValue: any;
  @Input() showChart: any;
  @Input() type: any;
  @Input() compType: any;
  @Input() selectedCurrency: any;
  @Input() fontSize: any;
  @Input() highLowColor: any;
  @Input() selectedIndustry: any;
  @Output() entity_id = new EventEmitter<any>();
  @Output() ticSectorCode = new EventEmitter<any>();
  @Output() selectedRow = new EventEmitter<any>();
  @Output() history_data = new EventEmitter<any>();
  @Output() topDealSortParam = new EventEmitter<any>();
  @Input() idName: any;
  @Input() isLoading: any;
  @Input() transactionsMNAPeriod: any = '';
  iconIndex: any = 0;
  shortDown: boolean = false;
  shortUp: boolean = false;
  constructor(
    public util: UtilService,
    public auth: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.selectedCurrency = this.selectedCurrency;
  }
  ngOnChanges(changes: SimpleChanges): void {
    let sortComp: any = '';
    this.compType === 'transac-comp' ? (sortComp = true) : (sortComp = false);
    var keyVal = this.table_data?.title[0].key;

    this.table_data?.value?.sort(function (this: any, a: any, b: any) {
      var nameA = a[keyVal]?.toLowerCase(),
        nameB = b[keyVal]?.toLowerCase();

      if (sortComp) {
        if (nameA > nameB)
          //sort string descending
          return -1;
        if (nameA < nameB) return 1;
        return 0; //default return value (no sorting)
      } else {
        if (nameA < nameB)
          //sort string ascending
          return -1;
        if (nameA > nameB) return 1;
        return 0; //default return value (no sorting)
      }
    });
  }

  sortByKey(key: any, i: any, sort?: any, topDealSort?: any) {
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

    if (topDealSort) {
      this.topDealSortParam.emit(topDealSort);
    }
  }

  handleRadioInputChange(e: any) {
    this.entity_id.emit(e);
  }

  tableSelectedRow(data: any, header: any) {
    this.selectedRow.emit(data);

    if (data.company && header === 'company') {
      // this.router.navigate(['financialmarketdata/company']);
      // this.router.navigate(['financialmarketdata/company'], {
      //   queryParams: {
      //     comp_id: data.companyCode,
      //     company_name: data.company,
      //     currency: this.selectedCurrency,
      //     tabName: 'company',
      //   },
      // });
      const url = this.router.serializeUrl(
        this.router.createUrlTree(['financialmarketdata/company'], {
          queryParams: {
            comp_id: data.companyCode,
            company_name: data.company,
            currency: this.selectedCurrency,
            tabName: 'company',
          },
        })
      );
      window.open(url, '_blank');
    }
  }

  handleDocDownloadClick(e: any) {
    this.history_data.emit(e);
  }

  onClickIndustryRow(content: any) {
    if (content && content.ticsSectorCode) {
      this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams: {
          sector_id: content.ticsSectorCode,
          currency: this.selectedCurrency,
        },
        queryParamsHandling: 'merge',
      });
      this.ticSectorCode.emit(content);
    } else if (content && content.ticsIndustryCode) {
      this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams: { sector_industry_id: content.ticsIndustryCode },
        queryParamsHandling: 'merge',
      });
      this.ticSectorCode.emit(content);
    } else {
      const url = this.router.serializeUrl(
        this.router.createUrlTree(['financialmarketdata/company'], {
          queryParams: {
            comp_id: content.companyCode,
            company_name: content.companyName,
            currency: content.currency ?? '',
            tabName: 'company',
          },
        })
      );
      window.open(url, '_blank');
      console.log(content);
      console.log('Third level click');
    }
  }
}

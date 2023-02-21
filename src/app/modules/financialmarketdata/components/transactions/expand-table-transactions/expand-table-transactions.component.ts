import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FinancialMarketDataService } from 'src/app/services/financialmarketdata.service';
import { UtilService } from 'src/app/services/util.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-expand-table-transactions',
  templateUrl: './expand-table-transactions.component.html',
  styleUrls: ['./expand-table-transactions.component.scss'],
})
export class ExpandTableTransactionsComponent implements OnInit {
  @Input() table_data: any;
  @Input() mh: any;
  @Input() startDateDet: any;
  @Input() endDateDet: any;
  @Input() currentPageDet: any;
  @Input() selectedPEVCCurrency: any;
  @Output() fundingRoundHeaderData = new EventEmitter<any>();
  @Output() fundingRoundData = new EventEmitter<any>();
  @Output() selectedRowDetData = new EventEmitter<any>();

  iconIndex: any = 0;
  shortDown: boolean = false;
  shortUp: boolean = false;
  selectedPlus_icon: boolean = false;
  fundingInvestmentListData: any = [];
  index: any = 0;

  public labels: any = {
    previousLabel: '◄',
    nextLabel: '►',
  };

  constructor(
    public util: UtilService,
    public auth: AuthService,
    public datepipe: DatePipe,
    private financialMarketData: FinancialMarketDataService
  ) {}

  ngOnChanges(): void {
    this.currentPageDet = 1;
    this.fundingInvestmentListData = [];
    this.selectedPlus_icon = false;
  }

  count_res: any = 0;
  total_count_res: any = '';
  ngOnInit(): void {
    var keyVal = this.table_data.title[0].key;
    this.table_data.value.sort(function (a: any, b: any) {
      var nameA = a[keyVal].toLowerCase(),
        nameB = b[keyVal].toLowerCase();
      if (nameA < nameB)
        //sort string ascending
        return -1;
      if (nameA > nameB) return 1;
      return 0; //default return value (no sorting)
    });
  }

  sortByKey(key: any, i: any, sort?: any) {
    if (sort) {
      this.iconIndex = i;
      this.shortDown = !this.shortDown;
      return this.table_data.value.sort((a: any, b: any) => {
        var x = a[key];
        var y = b[key];
        if (this.shortDown == true) {
          return x < y ? 1 : x > y ? -1 : 0;
        } else {
          return x < y ? -1 : x > y ? 1 : 0;
        }
      });
    }
  }

  handleExpandTableClick(data: any, i: any) {
    if (this.selectedPlus_icon && this.index == i) {
      this.fundingInvestmentListData = [];
      this.selectedPlus_icon = false;
    } else {
      this.count_res = 0;
      this.total_count_res = 1;
      this.util.loaderService.display(true);

      this.financialMarketData
        .getTransactionsFundingInvestmentListData(
          this.datepipe.transform(this.startDateDet, 'yyyy-MM-dd'),
          this.datepipe.transform(this.endDateDet, 'yyyy-MM-dd'),
          data.currency,
          data.financingType,
          data.entityId
        )
        .subscribe((res: any) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);

          this.fundingInvestmentListData = res;
          if (i == this.index) {
            if (this.selectedPlus_icon == false) {
              this.fundingInvestmentListData = res;
              this.selectedPlus_icon = true;
            } else {
              this.fundingInvestmentListData = [];
              this.selectedPlus_icon = false;
            }
          } else {
            this.index = i;

            this.fundingInvestmentListData = res;
            this.selectedPlus_icon = true;
          }
        });
    }
  }

  handleFundingRoundClick(data: any) {
    this.selectedRowDetData.emit(data);

    this.getTransactionsFundingRoundHandler(data);
  }

  getTransactionsFundingRoundHandler(data: any) {
    this.count_res = 0;
    this.total_count_res = 1;
    this.util.loaderService.display(true);

    this.financialMarketData
      .getTransactionsFundingRoundData(
        data.round,
        this.datepipe.transform(this.endDateDet, 'yyyy-MM-dd'),
        this.datepipe.transform(this.startDateDet, 'yyyy-MM-dd'),
        data.entityId,
        data.financingType,
        data.currency
      )
      .subscribe((res) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);

        this.fundingRoundHeaderData.emit(res.pevcInvestmentHeaderDTO);
        this.fundingRoundData.emit(res.pevcFundingInvestmentDTOs);
      });
  }

  handlePaginateClick() {
    this.fundingInvestmentListData = [];
    this.selectedPlus_icon = false;
  }
}

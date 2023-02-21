import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UtilService } from 'src/app/services/util.service';
@Component({
  selector: 'app-investments-expand-table',
  templateUrl: './investments-expand-table.component.html',
  styleUrls: ['./investments-expand-table.component.scss'],
})
export class InvestmentsExpandTableComponent implements OnInit {
  @Input() table_data: any;
  @Input() child_table_data: any;
  @Output() investmentsPEVCChildData = new EventEmitter<any>();
  @Output() pevcInvestmentsRoundSelected = new EventEmitter<any>();
  @Output() pevcNotListedParticipatingFunds = new EventEmitter<any>();
  @Input() totalDataLength: any;
  @Input() paginateId: any;
  @Input() multiplePartFunds: any;
  @Input() multiplePartFundsChild: any;

  index: any = 0;
  iconIndex: any = 0;
  shortDown: boolean = false;
  shortUp: boolean = false;
  hideChildContent: any = false;
  currentPageIndex: any = 1;
  selectedPlus_icon: boolean = false;

  public labels: any = {
    previousLabel: '◄',
    nextLabel: '►',
  };

  constructor(public util: UtilService, public auth: AuthService) {}

  ngOnInit(): void {
    this.table_data.value.sort((a: any, b: any) => {
      let nameA: any = new Date(a.latestDate);
      let nameB: any = new Date(b.latestDate);

      return nameB - nameA;
    });
  }

  @Output() cusSortParam = new EventEmitter<any>();

  sortByKey(key: any, i: any, sort?: any, customSort?: any) {
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

    if (customSort) {
      this.cusSortParam.emit(customSort);
    }
  }
  @Output() changePage = new EventEmitter<any>();
  onPageChange(e: any) {
    this.currentPageIndex = e;
    this.changePage.emit(e);
  }

  handleExpandTableClick(data: any, i: any) {
    if (this.selectedPlus_icon && this.index === i) {
      this.selectedPlus_icon = false;
      this.hideChildContent = false;
    } else {
      this.investmentsPEVCChildData.emit(data);
      if (i === this.index) {
        if (this.selectedPlus_icon === false) {
          this.selectedPlus_icon = true;
          this.hideChildContent = true;
        } else {
          this.selectedPlus_icon = false;
          this.hideChildContent = false;
        }
      } else {
        this.index = i;
        this.selectedPlus_icon = true;
        this.hideChildContent = true;
      }
    }
  }

  handlePaginateClick() {
    this.selectedPlus_icon = false;
    this.hideChildContent = false;
  }
  @Output() pevcInvestmentsRoundSelectedChild = new EventEmitter();
  handleEntityNameClick(rowHeader: any, data: any) {
    if (rowHeader === 'description') {
      this.auth.openEntityDetailsModal = true;
      this.pevcInvestmentsRoundSelectedChild.emit(data);
    } else if (rowHeader === 'participating_funds') {
      data.multiple = false;
      this.pevcNotListedParticipatingFunds.emit(data);
    }
  }

  handleInvestmentRoundClick(rowHeader: any, data: any) {
    if (
      rowHeader === 'latest_investment_round' &&
      data.latest_investment_round !== null
    ) {
      this.auth.openEntityDetailsModal = true;
      this.pevcInvestmentsRoundSelected.emit(data);
    } else if (rowHeader === 'participating_funds') {
      data.multiple = false;
      this.pevcNotListedParticipatingFunds.emit(data);
    }
  }

  handleMultipleFundClick(e: any, data: any, fundId: any, multipleFunds: any) {
    e.stopPropagation();

    data.participating_funds_multiple = e.target.innerText;
    let fundIdIndex = multipleFunds.fund.indexOf(e.target.innerText.trim());

    data.factset_fund_entity_id = fundId[fundIdIndex];

    data.multiple = true;

    this.pevcNotListedParticipatingFunds.emit(data);
  }

  handleMultipleFundChildClick(
    e: any,
    data: any,
    fundId: any,
    multipleFunds: any
  ) {
    e.stopPropagation();

    data.participating_funds_multiple = e.target.innerText;
    let fundIdIndex = multipleFunds.fund.indexOf(e.target.innerText.trim());

    data.factset_fund_entity_id = fundId[fundIdIndex];

    data.multiple = true;

    this.pevcNotListedParticipatingFunds.emit(data);
  }
}

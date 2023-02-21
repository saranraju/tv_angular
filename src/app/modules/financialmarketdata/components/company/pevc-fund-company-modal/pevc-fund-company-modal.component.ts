import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FinancialMarketDataService } from 'src/app/services/financialmarketdata.service';
import { UtilService } from 'src/app/services/util.service';
import { LoaderServiceService } from '../../loader-service.service';

@Component({
  selector: 'app-pevc-fund-company-modal',
  templateUrl: './pevc-fund-company-modal.component.html',
  styleUrls: ['./pevc-fund-company-modal.component.scss'],
})
export class PevcFundCompanyModalComponent implements OnInit {
  @Input() selectPEVCCompanyData: any;
  @Input() selectedPEVCCompanyData: any;
  @Output() selectedPEVCListedCompanyEntityId = new EventEmitter<any>();
  @Output() selectedPEVCNotListedCompanyEntityId = new EventEmitter<any>();
  @Output() selectedPEVCFundCompanyEntityId = new EventEmitter<any>();
  @Output() selectedPEVCNotListedName = new EventEmitter<any>();

  pevcAdvancedSearchTableData: any = {
    title: [
      {
        label: 'Fund/Firm Name',
        // key: 'fundFirmName',
        key: 'entity_proper_name',
        color: '#ffc000',
        cursor: 'pointer',
        sorting: true,
      },
      {
        label: 'Category',
        key: 'category',
        align: 'center',
        sorting: true,
      },
      {
        label: 'AUM (USD M)',
        key: 'Assets_under_management',
        align: 'center',
        sorting: true,
      },
      {
        label: 'Amount Raised (USD M)',
        key: 'amt_raised',
        align: 'center',
        sorting: true,
      },
      {
        label: 'Number of Funds',
        key: 'Number_of_funds_under_management',
        align: 'center',
        sorting: true,
      },
      {
        label: 'Number of Investments',
        key: 'number_of_investment',
        align: 'center',
        sorting: true,
      },
    ],
    value: [
      // {
      //   fundFirmName: 'Tiger Global',
      //   category: 'PEVC Firm',
      //   aum: 'XX,XXX',
      //   amtRaised: 'XX,XXX',
      //   noOfFunds: 'XX',
      //   noOfInvestments: 'XX',
      //   type: 'listed',
      //   entityId: '05NYYW-E',
      // },
      // {
      //   fundFirmName: 'Brown Brothers Harriman Capital Partners',
      //   category: 'PEVC Firm',
      //   aum: 'XX,XXX',
      //   amtRaised: 'XX,XXX',
      //   noOfFunds: 'XX',
      //   noOfInvestments: 'XX',
      //   type: 'notListed',
      //   entityId: '068243-E',
      // },
      // {
      //   fundFirmName: 'DEF',
      //   category: 'PEVC Firm',
      //   aum: 'XX,XXX',
      //   amtRaised: 'XX,XXX',
      //   noOfFunds: 'XX',
      //   noOfInvestments: 'XX',
      //   type: 'notListed',
      //   entityId: '0627C2-E',
      // },
      // {
      //   fundFirmName: 'XYZ',
      //   category: 'PEVC Fund',
      //   aum: 'XX,XXX',
      //   amtRaised: 'XX,XXX',
      //   noOfFunds: 'XX',
      //   noOfInvestments: 'XX',
      //   type: 'fund',
      //   entityId: '0K747W-E',
      // },
      // {
      //   fundFirmName: 'CFG',
      //   category: 'PEVC Fund',
      //   aum: 'XX,XXX',
      //   amtRaised: 'XX,XXX',
      //   noOfFunds: 'XX',
      //   noOfInvestments: 'XX',
      //   type: 'fund',
      //   entityId: '05NYYW-E',
      // },
    ],
  };
  totalDataLength: any;
  count_res: any = 0;
  total_count_res: any = '';
  constructor(
    public auth: AuthService,
    public util: UtilService,
    public loaderService: LoaderServiceService,
    private financialMarketData: FinancialMarketDataService
  ) {}

  ngOnInit(): void {
    this.count_res = 0;
    this.total_count_res = 1;
    this.loaderService.display(true);

    this.getPEVCCompanyModalList('1');
  }

  handlePEVCCompanyModalClick() {
    this.auth.showPEVCCompanyModalFund = false;
  }

  onPageChage(e: any) {
    this.count_res = 0;
    this.total_count_res = 1;
    this.loaderService.display(true);

    if (this.searching) {
      this.searchCompanies(e, this.searchTerm);
    } else {
      this.getPEVCCompanyModalList(e);
    }
  }

  // handleValueChanged(data: any) {
  //   if (this.selectPEVCCompanyData && this.selectedPEVCCompanyData !== data) {
  //     this.selectedPEVCCompanyData = data;
  //     this.selectedPEVCCompanyEntityId.emit(this.selectedPEVCCompanyData);
  //     this.auth.showPEVCCompanyModal = false;
  //   }
  // }

  handleSelectedRow(data: any) {
    // if (data.rowData.fundFirmName === data.selEvent.trim()) {
    //   if (data.rowData.type === 'listed') {
    //     this.auth.showPEVCTabs = true;
    //     this.auth.showNotListedPage = false;
    //     this.auth.showFundPage = false;
    //     this.auth.hidePublicCompany = false;
    //     this.selectedPEVCListedCompanyEntityId.emit(data.rowData);
    //   } else if (data.rowData.type === 'notListed') {
    //     this.auth.showNotListedPage = true;
    //     this.selectedPEVCNotListedCompanyEntityId.emit(data.rowData);
    //     this.auth.hidePublicCompany = true;
    //     this.auth.showFundPage = false;
    //   } else if (data.rowData.type === 'fund') {
    //     this.auth.showFundPage = true;
    //     this.selectedPEVCFundCompanyEntityId.emit(data.rowData);
    //     this.auth.hidePublicCompany = true;
    //     this.auth.showNotListedPage = false;
    //   }
    //   this.auth.showPEVCCompanyModalFund = false;
    // }

    if (data.rowData.entity_proper_name === data.selEvent.trim()) {
      if (data.rowData.firm_type === '1') {
        this.auth.showPEVCTabs = true;
        this.auth.showNotListedPage = false;
        this.auth.showFundPage = false;
        this.auth.hidePublicCompany = false;
        this.selectedPEVCListedCompanyEntityId.emit(data.rowData);
      } else if (data.rowData.firm_type === '0') {
        this.auth.showNotListedPage = true;
        this.selectedPEVCNotListedCompanyEntityId.emit(data.rowData);
        this.auth.hidePublicCompany = true;
        this.auth.showFundPage = false;
      } else if (data.rowData.category === 'PEVC Fund') {
        this.auth.showFundPage = true;
        this.selectedPEVCFundCompanyEntityId.emit(data.rowData);
        this.auth.hidePublicCompany = true;
        this.auth.showNotListedPage = false;
      }
      this.auth.showPEVCCompanyModalFund = false;
    }
  }

  getPEVCCompanyModalList(selectedPage: any) {
    this.financialMarketData
      .getPEVCCompanyModalList(selectedPage)
      .subscribe((res: any) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);

        this.totalDataLength = res.pop().datacount;

        this.pevcAdvancedSearchTableData = {
          ...this.pevcAdvancedSearchTableData,
          value: res,
        };
      });
  }

  timeout: any = null;
  previousAPI: any = null;
  searching: any = false;
  searchTerm: any;
  handleSearchInputChange(e: any) {
    this.searching = true;
    this.searchTerm = e.target.value;
    clearTimeout(this.timeout);

    if (this.previousAPI !== null) {
      this.previousAPI.unsubscribe();
    }

    this.timeout = setTimeout(() => {
      this.count_res = 0;
      this.total_count_res = 1;
      this.loaderService.display(true);

      this.searchCompanies(1, e.target.value);
    }, 1000);
  }

  searchCompanies(selectedPage: any, searchTerm: any) {
    this.previousAPI = this.financialMarketData
      .getSearchCompanies(selectedPage, searchTerm)
      .subscribe((res: any) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);

        this.totalDataLength = res.pop().datacount;

        res = res.filter(
          (value: any, index: any, self: any) =>
            index ===
            self.findIndex(
              (t: any) => t.factset_entity_id === value.factset_entity_id
            )
        );

        this.pevcAdvancedSearchTableData = {
          ...this.pevcAdvancedSearchTableData,
          value: res,
        };
      });
  }
}

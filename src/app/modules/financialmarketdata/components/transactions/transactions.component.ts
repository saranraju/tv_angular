import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';

import { saveAs } from 'file-saver';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import * as am4plugins_sliceGrouper from '@amcharts/amcharts4/plugins/sliceGrouper';

import { UtilService } from 'src/app/services/util.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FinancialMarketDataService } from 'src/app/services/financialmarketdata.service';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Params } from '@angular/router';

/* Chart code */
// Themes begin
am4core.useTheme(am4themes_animated);
// Themes end

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
})
export class TransactionsComponent implements OnInit, AfterViewInit, OnDestroy {
  transactions_table_data = {
    title: [
      {
        label: '',
        radio: true,
        width: '2rem',
        padding: '6px 17px 6px 4px',
      },
      {
        label: 'Rank',
        key: 'rank',
        width: '1.5rem',
        color: '#fff',
        padding: '6px 6px 6px 4px',
      },
      {
        label: 'Entity',
        key: 'name',
        width: '5rem',
        color: '#ffc000',
        padding: '6px 17px 6px 4px',
      },
      {
        label: 'No. of Transactions (Count)',
        key: 'totalDeals',
        width: '2rem',
        headerPointer: true,
        headerAlign: 'right',
        align: 'right',
        padding: '6px 17px 6px 4px',
        topDealSort: 'total_deals',
      },
      {
        label: 'Total Value (USD M)',
        key: 'totalValue',
        width: '2rem',
        headerPointer: true,
        headerAlign: 'right',
        align: 'right',
        formattedNum: true,
        padding: '6px 17px 6px 4px',
        topDealSort: 'transact_tot_value',
      },
      {
        label: 'Avg. Value (USD M)',
        key: 'avgValue',
        width: '1.9rem',
        headerPointer: true,
        headerAlign: 'right',
        align: 'right',
        formattedNum: true,
        padding: '6px 17px 6px 4px',
        topDealSort: 'transact_avg_value',
      },
      {
        label: 'Largest Transaction (USD M)',
        key: 'maxValue',
        width: '2rem',
        headerPointer: true,
        formattedNum: true,
        padding: '6px 17px 6px 4px',
        topDealSort: 'transact_max_value',
        headerAlign: 'right',
        align: 'right',
      },
    ],
    value: [],
  };
  transactions_history_table_data = {
    title: [
      {
        label: 'Announcement Date',
        key: 'announceDate',
        shorting: true,
        headerPointer: true,
        width: '9rem',
        color: '#fff',
        align: 'center',
      },
      {
        label: 'Target',
        key: 'target',
        shorting: true,
        align: 'left',
        headerPointer: true,
        color: '#ffc000',
      },
      {
        label: 'Role',
        key: 'role',
        shorting: true,
        align: 'left',
        headerPointer: true,
      },
      {
        label: 'Acquirer',
        key: 'acquirer',
        shorting: true,
        headerPointer: true,
        color: '#ffc000',
        align: 'left',
      },
      {
        label: 'Seller',
        key: 'seller',
        shorting: true,
        headerPointer: true,
        color: '#ffc000',
        align: 'left',
      },
      {
        label: 'Closing_date / Status',
        key: 'closeDateOrStatus',
        shorting: true,
        headerPointer: true,
        align: 'left',
      },
      {
        label: 'Transaction Value (USD M)',
        key: 'transactionValue',
        shorting: true,
        headerAlign: 'center',
        headerPointer: true,
        align: 'center',
        formattedNum: true,
      },
      {
        label: 'Deal Type',
        key: 'dealType',
        shorting: true,
        headerPointer: true,
        align: 'left',
      },
      {
        label: 'Target Industry',
        key: 'targetIndustry',
        shorting: true,
        headerPointer: true,
        align: 'left',
      },
      {
        label: '% Sought',
        key: 'percentSought',
        shorting: true,
        headerPointer: true,
        headerAlign: 'center',
        align: 'center',
        formattedNum: true,
      },
      {
        label: 'Terms & Synopsis',
        key: 'srcIconUrl',
        headerPointer: true,
        headerAlign: 'center',
        align: 'center',
        icon: true,
      },
    ],
    value: [],
  };
  funds_details_table_data = {
    title: [
      {
        label: 'Company Name',
        key: 'companyName',
        shorting: true,
        color: '#fff',
        plusIcon: true,
        headerPointer: true,
      },
      {
        label: 'Country',
        key: 'countryName',
        shorting: true,
        headerPointer: true,
      },
      {
        label: 'Industry',
        key: 'industryName',
        shorting: true,
        headerPointer: true,
      },
      {
        label: 'Latest Round name',
        key: 'latestRound',
        shorting: true,
        headerPointer: true,
      },
      {
        label: 'Latest Round Date',
        key: 'latestRoundDate',
        shorting: true,
        headerPointer: true,
      },
      {
        label: 'Financing Type',
        key: 'financingType',
        shorting: true,
        headerPointer: true,
      },
      {
        label: 'Total Funding Amount (USD Million)',
        key: 'fxTotalFundingAmount',
        shorting: true,
        width: '12rem',
        align: 'left',
        formattedNum: true,
        headerPointer: true,
      },
    ],
    value: [],
  };
  funds_table_data = {
    title: [
      {
        label: 'Entity Name',
        key: 'entityName',
        width: '8rem',
        headerAlign: 'left',
        align: 'left',
        hover: true,
      },
      {
        label: 'Financing Type',
        key: 'finType',
        width: '4rem',
        headerAlign: 'left',
        align: 'left',
      },
      {
        label: 'Number of Rounds',
        key: 'rounds',
        width: '5rem',
        headerAlign: 'right',
        align: 'right',
      },
      {
        label: 'Total Funding Amount (USD Million)',
        key: 'totalValuation',
        width: '6rem',
        formattedNum: true,
      },
    ],
    value: [],
  };
  terms_synopsis_table: any = {
    title: [
      {
        label: 'Advisor Name',
        key: 'advisorName',
        color: '#fff',
        width: '17rem',
      },
      {
        label: '	Advisor Role',
        key: 'advisorRole',
        width: '9rem',
      },
      {
        label: 'Client Name',
        key: 'clientName',
        width: '14rem',
      },
      {
        label: 'Client Role',
        key: 'clientRole',
      },
      {
        label: 'Deal Status',
        key: 'dealStatus',
      },
      {
        label: 'Fee (USD M)',
        key: 'fee',
        formattedNum: true,
      },
      {
        label: 'Comment',
        key: 'comment',
        headerAlign: 'center',
        align: 'center',
      },
    ],
    value: [],
  };
  round_table: any = {
    title: [
      {
        label: 'Investor Name',
        key: 'entityProperName',
        color: '#fff',
        shorting: true,
        headerPointer: true,
        width: '20rem',
      },
      {
        label: 'Fund Name',
        key: 'fundName',
        shorting: true,
        headerPointer: true,
        width: '20rem',
      },
      {
        label: 'Investor Type',
        key: 'entityType',
        shorting: true,
        headerPointer: true,
      },
      {
        label: 'Investment %',
        key: 'pctHeld',
        formattedNum: true,
        shorting: true,
        headerPointer: true,
      },
      {
        label: 'Status',
        key: 'status',
        shorting: true,
        headerPointer: true,
      },
      {
        label: 'Exit Date',
        key: 'terminationDate',
        headerAlign: 'left',
        align: 'left',
        shorting: true,
        headerPointer: true,
      },
    ],
    value: [],
  };

  // MNA
  selectCountryData: any = [];
  selectedCountry: any = 'IND';
  selectIndustryData: any = [];
  selectedIndustry: any = 'All';
  selectCurrencyData: any = [];
  selectedCurrency: any = 'USD';
  transactionsTopDealMakersData: any = [];
  startDate: any = '2021-03-07';
  endDate: any = '2022-03-06';
  transactionsDealsHistoryData: any = [];
  entityId: any = '';
  entityName: any = ' ';
  selectCompanyData: any = [];
  selectedCompany: any = '';
  pageNumbers: any;
  rowOffset: any = 0;
  rowCount: any;
  currentPage: any = 1;
  isPeriodSelected: any = false;
  periodValue: any = 'Last 12 Months';
  dealItem: any = [];
  dealTerms: any = [];
  dealId: any;
  showMNADropdown: any;
  sortType: any = 'total_deals';
  showRevenueLTM: any;
  showEbitdaLTM: any;
  showPriceShare: any;
  showStockPriceShare: any;
  showOneDayPrem: any;
  showEVREV: any;
  showEVEBITDA: any;
  chartDataAvailableMNA: any;
  chartDataAvailableLocalPEVC: any;
  chartDataAvailableGlobalPEVC: any;
  chartDataAvailableGlobalSectorPEVC: any;
  globalSelectedMNA: any;
  selectedCompanySearchTerm: any;

  // PEVC
  selectPEVCCurrencyData: any = [];
  selectedPEVCCurrency: any = 'USD';
  selectPEVCCountryData: any = [];
  selectedPEVCCountry: any = 'IND';
  isPeriodSelectedMNA: any = false;
  startDatePEVC: any = '2017-03-07';
  endDatePEVC: any = '2022-03-06';
  periodValueMNA: any = 'Last 12 Months';
  showBubble: boolean = false;
  showPEVCDropdown: any;
  globalSelectedPEVC: any;
  chart: any;
  localPieChart: any;
  globalPieChart: any;
  barChartData: any = [];
  localPieChartData: any = [];
  globalPieChartData: any = [];
  openChartModal: boolean = false;
  chartModalTitle: any;
  fundingSectorChartData: any = [];
  localPieChartCountryData: any = [];
  chartDataAvailableLocalCountryPEVC: any;
  localPieChartCountry: any;
  topFundedCompaniesData: any = [];
  modalPageNumbers: any = [];
  pageEntries: any = 10;
  selectedDetCompanySearchTerm: any;
  openOtherChartModal: any = false;
  fundingSectorChartOtherData: any = [];
  globalOtherSliceClicked: any = false;

  // Details Table
  selectDetCompanyData: any = [];
  selectedDetCompany: any = '';
  selectDetCountryData: any = [];
  selectedDetCountry: any = 'IND';
  selectDetIndustryData: any = [];
  selectedDetIndustry: any = 'All';
  selectDetFinTypeData: any = [];
  selectedDetFinType: any = 'All';
  isDetPeriodSelected: any = false;
  startDateDet: any = '2021-03-07';
  endDateDet: any = '2022-03-06';
  periodValueDet: any = 'Last 12 Months';
  fundingDetailsData: any = [];
  showPEVCDetDropdown: any;
  fundingRoundHeaderData: any = [];
  currentPageDet: number = 1;
  selectedRowDetData: any;
  tabClick: any = 0;
  last5Years: any = [];
  globalSelectedPEVCDet: any;
  currentDate: any;
  toDate: any;
  fromDate: any;
  minDate: any;
  maxDate: any;
  fromDatePEVC: any;
  toDatePEVC: any;
  fromDateDet: any;
  toDateDet: any;

  // IPO
  upcoming_ipo_table_data: any = {
    title: [
      {
        label: 'Company Name',
        key: 'companyName',
        pointer: true,
        hover: true,
      },
      {
        label: 'Country',
        key: 'country',
        align: 'center',
      },
      {
        label: 'Exchange',
        key: 'exchange',
        align: 'center',
      },
      {
        label: 'Issue Open Date',
        key: 'issueOpenDate',
        align: 'center',
      },
      {
        label: 'Currency',
        key: 'currency',
        align: 'center',
      },
      {
        label: 'Offer Size (Million)',
        key: 'offerSize',
        align: 'center',
      },
    ],
    value: [
      // {
      //   companyName: 'ABC Corp',
      //   country: 'United States of America',
      //   exchange: 'XNAS',
      //   issueOpenDate: 'AA-XX-YYYY',
      //   currency: 'USD',
      //   offerSize: '1000',
      // },
    ],
  };
  subscription_ipo_table_data: any = {
    title: [
      {
        label: 'Company Name',
        key: 'companyName',
        pointer: true,
        hover: true,
      },
      {
        label: 'Country',
        key: 'country',
        align: 'center',
      },
      {
        label: 'Exchange',
        key: 'exchange',
        align: 'center',
      },
      {
        label: 'Issue Close Date',
        key: 'issueCloseDate',
        align: 'center',
      },
      {
        label: 'Currency',
        key: 'currency',
        align: 'center',
      },
      {
        label: 'Offer Size (Million)',
        key: 'offerSize',
        align: 'center',
      },
    ],
    value: [
      // {
      //   companyName: 'ABC Corp',
      //   country: 'United States of America',
      //   exchange: 'XNAS',
      //   issueOpenDate: 'AA-XX-YYYY',
      //   currency: 'USD',
      //   offerSize: '1000',
      // },
    ],
  };
  historical_ipo_table_data: any = {
    title: [
      {
        label: 'Company Name',
        key: 'companyName',
        pointer: true,
        hover: true,
      },
      {
        label: 'Country',
        key: 'country',
        align: 'center',
      },
      {
        label: 'Exchange',
        key: 'exchange',
        align: 'center',
      },
      {
        label: 'Listing Date',
        key: 'listingDate',
        align: 'center',
      },
      {
        label: 'Currency',
        key: 'currency',
        align: 'center',
      },
      {
        label: 'Offer Size (Million)',
        key: 'offerSize',
        align: 'center',
      },
    ],
    value: [
      // {
      //   companyName: 'ABC Corp',
      //   country: 'United States of America',
      //   exchange: 'XNAS',
      //   issueOpenDate: 'AA-XX-YYYY',
      //   currency: 'USD',
      //   offerSize: '1000',
      // },
    ],
  };
  upcoming_ipo_modal_table_data: any = {
    title: [
      {
        label: 'Company Name',
        key: 'companyName',
        shorting: true,
        pointer: true,
        width: '10rem',
        hover: true,
        sortingKey: 'issuer_name',
      },
      {
        label: 'Status',
        key: 'status',
        align: 'center',
        shorting: true,
        sortingKey: 'status',
      },
      {
        label: 'Country',
        key: 'country',
        align: 'center',
        shorting: true,
        sortingKey: 'cntry_inc',
      },
      {
        label: 'Exchange',
        key: 'exchange',
        align: 'center',
        shorting: true,
        sortingKey: 'mic',
      },
      {
        label: 'Issue Open Date',
        key: 'issueOpenDate',
        align: 'center',
        shorting: true,
        width: '11rem',
        sortingKey: 'sub_period_from',
      },
      {
        label: 'Security Type',
        key: 'securityType',
        align: 'center',
        shorting: true,
        width: '9rem',
        sortingKey: 'sec_description',
      },
      {
        label: 'Currency',
        key: 'currency',
        align: 'center',
        shorting: true,
        sortingKey: 'currency',
      },
      {
        label: 'Offer Size (Million)',
        key: 'offerSize',
        align: 'center',
        shorting: true,
        width: '11rem',
        sortingKey: 'total_offer_size',
      },
      {
        label: 'Proposed Price',
        key: 'proposedPrice',
        align: 'center',
        shorting: true,
        width: '9rem',
        sortingKey: 'proposed_price',
      },
      {
        label: 'IPO Price Range',
        key: 'ipoPriceChange',
        align: 'center',
        shorting: true,
        width: '9rem',
        sortingKey: 'share_price_lowest',
      },
      {
        label: 'Notes',
        key: 'iponotes',
        align: 'center',
      },
    ],
    value: [
      // {
      //   companyName: 'Jackson Acquisition Co',
      //   country: 'US',
      //   exchange: 'XNAS',
      //   issueOpenDate: 'AA-XX-YYYY',
      //   securityType: 'Ordinary Shares',
      //   currency: 'USD',
      //   offerSize: '1000',
      //   proposedPrice: '10',
      //   ipoPriceChange: '10',
      //   rumoured: true,
      // },
    ],
  };
  subscription_ipo_modal_table_data: any = {
    title: [
      {
        label: 'Company Name',
        key: 'companyName',
        shorting: true,
        hover: true,
        width: '10rem',
        sortingKey: 'issuer_name',
      },
      {
        label: 'Country',
        key: 'country',
        align: 'center',
        shorting: true,
        sortingKey: 'cntry_inc',
      },
      {
        label: 'Exchange',
        key: 'exchange',
        align: 'center',
        shorting: true,
        sortingKey: 'mic',
      },
      {
        label: 'Issue Close Date',
        key: 'issueCloseDate',
        align: 'center',
        shorting: true,
        width: '11rem',
        sortingKey: 'sub_period_to',
      },
      {
        label: 'Security Type',
        key: 'securityType',
        align: 'center',
        shorting: true,
        sortingKey: 'sec_description',
      },
      {
        label: 'Currency',
        key: 'currency',
        align: 'center',
        shorting: true,
        sortingKey: 'currency',
      },
      {
        label: 'Offer Size (Million)',
        key: 'offerSize',
        align: 'center',
        shorting: true,
        width: '11rem',
        sortingKey: 'total_offer_size',
      },
      {
        label: 'Proposed Price',
        key: 'proposedPrice',
        align: 'center',
        shorting: true,
        sortingKey: 'proposed_price',
      },
      {
        label: 'IPO Price Range',
        key: 'ipoPriceChange',
        align: 'center',
        shorting: true,
        sortingKey: 'share_price_lowest',
      },
      {
        label: 'Notes',
        key: 'iponotes',
        align: 'center',
      },
    ],
    value: [
      // {
      //   companyName: 'ABC Corp',
      //   country: 'United States of America',
      //   exchange: 'XNAS',
      //   issueCloseDate: 'AA-XX-YYYY',
      //   securityType: 'Ordinary Shares',
      //   currency: 'USD',
      //   offerSize: '1000',
      //   proposedPrice: '10',
      //   ipoPriceChange: '10',
      // },
    ],
  };
  historical_ipo_modal_table_data: any = {
    title: [
      {
        label: 'Company Name',
        key: 'companyName',
        shorting: true,
        hover: true,
        width: '10rem',
        sortingKey: 'issuer_name',
      },
      {
        label: 'Country',
        key: 'country',
        align: 'center',
        shorting: true,
        width: '11rem',
        sortingKey: 'cntry_inc',
      },
      {
        label: 'Exchange',
        key: 'exchange',
        align: 'center',
        shorting: true,
        width: '5.1rem',
        sortingKey: 'mic',
      },
      {
        label: 'Listing Date',
        key: 'listingDate',
        align: 'center',
        shorting: true,
        sortingKey: 'first_trading_date',
      },
      {
        label: 'Security Type',
        key: 'securityType',
        align: 'center',
        shorting: true,
        sortingKey: 'sec_description',
      },
      {
        label: 'Currency',
        key: 'currency',
        align: 'center',
        shorting: true,
        sortingKey: 'currency',
      },
      {
        label: 'Offer Size (Million)',
        key: 'offerSize',
        align: 'center',
        shorting: true,
        width: '11rem',
        sortingKey: 'total_offer_size',
      },
      {
        label: 'Issue Price',
        key: 'issuePrice',
        align: 'center',
        shorting: true,
        sortingKey: 'proposed_price',
      },
      {
        label: 'Listing Day Return (%)',
        key: 'listingDayReturn',
        align: 'center',
        shorting: true,
        width: '13rem',
        sortingKey: 'listing_day_return',
      },
      {
        label: 'Notes',
        key: 'iponotes',
        align: 'center',
      },

      // {
      //   label: 'Price Return (%)',
      //   key: 'priceReturn',
      //   align: 'center',
      //   shorting: true,
      // },
    ],
    value: [
      // {
      //   companyName: 'ABC Corp',
      //   country: 'United States of America',
      //   exchange: 'XNAS',
      //   listingDate: 'AA-XX-YYYY',
      //   securityType: 'Ordinary Shares',
      //   currency: 'USD',
      //   offerSize: '1000',
      //   issuePrice: '11',
      //   listingDayReturn: '10',
      //   priceReturn: '25.8',
      // },
    ],
  };

  fundsIPOPieChart: any;
  fundsIPOPieChartData: any = [
    {
      // sector: 'Technology Services',
      // amount: '18,648 USD Million',
      color: am4core.color('rgb(68, 114, 196)'),
    },
    {
      // sector: 'Commercial Services',
      // amount: '5,317 USD Million',
      color: am4core.color('rgb(237, 125, 49)'),
    },
    {
      // sector: 'Transportation',
      // amount: '4,606 USD Million',
      color: am4core.color('rgb(255, 192, 0)'),
    },
    {
      // sector: 'Retail Trade',
      // amount: '3,996 USD Million',
      color: am4core.color('rgb(91, 155, 213)'),
    },
    {
      // sector: 'Finance',
      // amount: '3,467 USD Million',
      color: am4core.color('rgb(23, 145, 114)'),
    },
    {
      // sector: 'Consumer Services',
      // amount: '1,981 USD Million',
      color: am4core.color('rgb(255, 199, 95)'),
    },
    {
      // sector: 'Others',
      // amount: '5,149 USD Million',
      color: am4core.color('rgb(255, 150, 113)'),
    },
  ];
  IpoNgSelectoptions = {
    multiple: true,
    // tags: true,
  };

  modalTypeIPO: any = '';
  modalCurrency: any = '';

  count_res: any = 0;
  total_count_res: any = '';
  previousAPI: any = null;
  rumoured_data: any;
  ipo_detail: any;
  constructor(
    public util: UtilService,
    private financialMarketData: FinancialMarketDataService,
    public auth: AuthService,
    public datepipe: DatePipe,
    private activateRoute: ActivatedRoute
  ) {}

  clickout() {
    this.showMNADropdown = false;
    this.showPEVCDropdown = false;
    this.showPEVCDetDropdown = false;
  }

  ngOnChanges(): void {
    this.currentPage = 1;
  }
  ipoDetailsevent: any;
  rumouredTableDataHandler(params: any, event: any) {
    if (params == 'comapny') {
      if (this.ipoSelectedCompany !== event) {
        var obj = {
          rumoured: true,
          companyName: event,
        };
        this.ipo_detail = obj;
        this.ipoDetailsevent = obj;
      }
    } else {
      this.ipo_detail = event;
      this.ipoDetailsevent = event;
    }
    console.log('event', event);
  }

  ngOnInit(): void {
    $(document).on('select2:open', (e) => {
      if (e.target.id === 'companyDropdownMNA') {
        const selectSearchInput = document.querySelector(
          '.select2-search__field'
        );

        let timeout: any = null;

        selectSearchInput?.addEventListener('input', (e: any) => {
          clearTimeout(timeout);

          if (this.previousAPI !== null) {
            this.previousAPI.unsubscribe();
          }

          this.selectedCompanySearchTerm = e.target.value;

          timeout = setTimeout(() => {
            this.count_res = 0;
            this.total_count_res = 1;
            // this.util.loaderService.display(true);

            this.getTransactionsCompanySearchDataHandler(e.target.value);
          }, 1000);
        });
      } else if (e.target.id === 'companyDropdownPEVC') {
        const selectSearchInput = document.querySelector(
          '.select2-search__field'
        );

        let timeout: any = null;

        selectSearchInput?.addEventListener('input', (e: any) => {
          clearTimeout(timeout);

          if (this.previousAPI !== null) {
            this.previousAPI.unsubscribe();
          }

          this.selectedDetCompanySearchTerm = e.target.value;

          timeout = setTimeout(() => {
            this.count_res = 0;
            this.total_count_res = 1;
            // this.util.loaderService.display(true);

            this.getTransactionsDetCompanySearchDataHandler(e.target.value);
          }, 1000);
        });
      }
    });

    // this.count_res = 0;
    // this.total_count_res = 6;
    // this.util.loaderService.display(true);

    this.showMNADropdown = true;
    this.showPEVCDropdown = true;
    this.showPEVCDetDropdown = true;

    this.last5Years = this.getLast5Years();

    this.currentDate = new Date();

    let timestamp = this.currentDate.setDate(this.currentDate.getDate() - 1);
    this.toDate = new Date(timestamp).toISOString().slice(0, 10);

    this.fromDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth(),
      this.currentDate.getDate() - 363
    )
      .toISOString()
      .slice(0, 10);

    this.toDatePEVC = new Date(timestamp).toISOString().slice(0, 10);

    this.fromDatePEVC = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth(),
      this.currentDate.getDate() - 363
    )
      .toISOString()
      .slice(0, 10);

    this.toDateDet = new Date(timestamp).toISOString().slice(0, 10);

    this.fromDateDet = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth(),
      this.currentDate.getDate() - 363
    )
      .toISOString()
      .slice(0, 10);

    let timestamp2 = this.currentDate.setDate(this.currentDate.getDate() + 1);
    this.maxDate = new Date(timestamp2).toISOString().slice(0, 10);

    this.minDate = new Date('1960-01-01');
    let timestamp3 = this.minDate.setDate(this.minDate.getDate() + 1);
    this.minDate = new Date(timestamp3).toISOString().slice(0, 10);

    $(document).on('select2:open', () => {
      const inputs: any = document.querySelectorAll(
        '.select2-search__field[aria-controls]'
      );
      const mostRecentlyOpenedInput = inputs[inputs.length - 1];
      mostRecentlyOpenedInput.focus();
    });
    this.startDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth(),
      this.currentDate.getDate() - 364
    )
      .toISOString()
      .slice(0, 10);

    this.endDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth(),
      this.currentDate.getDate()
    )
      .toISOString()
      .slice(0, 10);

    this.startDatePEVC = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth(),
      this.currentDate.getDate() - 364
    )
      .toISOString()
      .slice(0, 10);

    this.endDatePEVC = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth(),
      this.currentDate.getDate()
    )
      .toISOString()
      .slice(0, 10);

    this.startDateDet = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth(),
      this.currentDate.getDate() - 364
    )
      .toISOString()
      .slice(0, 10);

    this.endDateDet = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth(),
      this.currentDate.getDate()
    )
      .toISOString()
      .slice(0, 10);

    if (
      Object.keys((this.activateRoute.queryParams as any)?.value).length > 0
    ) {
      this.activateRoute.queryParams.subscribe((params: Params) => {
        if (params['tabActive'] == 'PEVC') {
          this.util.setDateHandler('Private Equity & Venture Capital');

          this.selectedPEVCCurrency = params['currency'];
          this.selectedPEVCCountry = params['countryIsoCode'];
          this.startDatePEVC = params['startDate'];
          this.endDatePEVC = params['endDate'];

          if (params['sectorCode']) {
            let sector = params['sectorCode'];
            this.selectedPEVCSector = sector;
            this.count_res = 0;
            this.total_count_res = 9;
            this.util.loaderService.display(true);

            this.getCountryFundingSectorChart2(sector);
            this.getGlobalFundingSectorChart2(sector);
            this.getTransactionsPEVCCurrencyDataHandler();
            this.getTransactionsPEVCCountryDataHandler();
            this.getTransactionsPEVCTopFundedCompaniesHandler();
            this.getTransactionsDetIndustryDataHandler(this.selectedDetCountry);
            this.getTransactionsDetFinTypeDataHandler();
            this.getTransactionsFundingDetailsDataHandler();
            this.getSectorData();
          } else {
            this.count_res = 0;
            this.total_count_res = 9;
            this.util.loaderService.display(true);

            this.getTransactionsPEVCCurrencyDataHandler();
            this.getTransactionsPEVCCountryDataHandler();
            this.getTransactionsPEVCFundingChartDataHandler();
            this.getTransactionsPEVCGlobalFundingChartDataHandler();
            this.getTransactionsPEVCTopFundedCompaniesHandler();
            this.getTransactionsDetIndustryDataHandler(this.selectedDetCountry);
            this.getTransactionsDetFinTypeDataHandler();
            this.getTransactionsFundingDetailsDataHandler();
            this.getSectorData();
          }
        }
      });
    } else {
      this.util.setDateHandler('Mergers & Acquisitions');
      this.count_res = 0;
      this.total_count_res = 5;
      this.util.loaderService.display(true);

      this.getTransactionsCountryDataHandler();
      this.getTransactionsIndustryDataHandler(this.selectedCountry);
      this.getTransactionsCurrencyDataHandler();
      this.getTransactionsTopDealMakersDataHandler();
      // this.getTransactionsCompanyDataHandler();

      // this.util.setDateHandler('Initial Public Offerings');
      // [
      //   'upcoming-ipo-list/1/10',
      //   'open-for-subscription-ipo-list/1/10',
      //   'historical-ipo-list/1/10',
      // ].map((ele: any) => {
      //   this.getAllIpoData(ele);
      // });
      // this.util.loaderService.display(true);
      // this.count_res = 0;
      // this.total_count_res = 11;

      // this.countryListHandler();
      // this.currencyListHandler();
      // this.getExchangeData();
      // this.getIpoSecurityData();
      // this.getIpoCompanyData();
      // this.getPeriodsData();
      // this.getAdvisorList();
      // this.getstatusList();
      // this.getIndustryList();
      // this.financialMarketData.getIpoPageData('pie-chart').subscribe(
      //   (res: any) => {
      //     ++this.count_res;
      //     this.util.checkCountValue(this.total_count_res, this.count_res);
      //     res.forEach((ele: any, i: any) => {
      //       this.pieChartData = {
      //         sector: ele.sector_name,
      //         amount: this.util.standardFormat(ele.offer_size, 2, ''),
      //         sector_code: ele.sector_code,
      //       };
      //       this.pieChartDataArray = [
      //         ...this.pieChartDataArray,
      //         this.pieChartData,
      //       ];
      //     });
      //     this.fundsChartIPO();
      //   },
      //   (err) => {
      //     console.error(err);
      //   }
      // );
    }
  }

  exchnageData: any = [];
  securityType: any = [];
  company_name: any = [];
  getExchangeData() {
    this.financialMarketData.getIpoExchangeData().subscribe(
      (res) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);
        let formattedData: any = [];
        res.forEach((element: any) => {
          formattedData.push({
            id: element,
            text: element,
          });
          this.exchnageData = formattedData;
        });
      },
      (err) => {
        console.log('error', err.message);
      }
    );
  }

  getIpoSecurityData() {
    this.financialMarketData.getIpoSecurityType().subscribe(
      (res) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);
        let formattedData: any = [];
        res.forEach((element: any) => {
          formattedData.push({
            id: element,
            text: element,
          });
          this.securityType = formattedData;
        });
      },
      (err) => {
        console.log('error', err.message);
      }
    );
  }

  getIpoCompanyData() {
    this.financialMarketData.getIpoCompanyName().subscribe(
      (res) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);
        let formattedData: any = [];
        res.forEach((element: any) => {
          formattedData.push({
            id: element,
            text: element,
          });
          formattedData.sort(function (a: any, b: any) {
            if (a.text < b.text) {
              return -1;
            }
            if (a.text > b.text) {
              return 1;
            }
            return 0;
          });
          this.company_name = formattedData;
        });
      },
      (err) => {
        console.log('error', err.message);
      }
    );
  }

  backBtnFn(event: any) {
    this.ipo_detail = false;
    this.fundsChartIPO();
  }

  ngAfterViewInit() {
    this.transactionChart();
    this.fundsChart();
    this.GlobalFundsChart();
    this.fundsCountryChart();

    setTimeout(() => {
      this.fundsChartIPO();
    }, 2000);
  }

  ngOnDestroy() {
    this.chart.dispose();
  }

  dateChange(type: any) {
    this.chart.dispose();
    this.transactionChart();
    this.fundsChart();
    this.GlobalFundsChart();
    if (this.selectedPEVCCountry === 'Global') {
      this.fundsCountryChart();
    }
    this.fundsChartIPO();

    this.util.setDateHandler(type);

    if (type === 'Private Equity & Venture Capital') {
      this.tabClick += 1;
      if (this.tabClick === 1) {
        this.count_res = 0;
        this.total_count_res = 8;
        this.util.loaderService.display(true);

        this.getTransactionsPEVCCurrencyDataHandler();
        this.getTransactionsPEVCCountryDataHandler();
        this.getTransactionsPEVCFundingChartDataHandler();
        this.getTransactionsPEVCGlobalFundingChartDataHandler();
        this.getTransactionsPEVCTopFundedCompaniesHandler();
        // this.getSectorData();
        this.getTransactionsDetIndustryDataHandler(this.selectedDetCountry);
        this.getTransactionsDetFinTypeDataHandler();
        this.getTransactionsFundingDetailsDataHandler();
      }
    } else if (type === 'Initial Public Offerings') {
      // if (this.util.selectedDatetype === 'Initial Public Offerings') {
      [
        'upcoming-ipo-list/1/10',
        'open-for-subscription-ipo-list/1/10',
        'historical-ipo-list/1/10',
      ].map((ele: any) => {
        this.getAllIpoData(ele);
      });
      this.util.loaderService.display(true);
      this.count_res = 0;
      this.total_count_res = 11;

      this.countryListHandler();
      this.currencyListHandler();
      this.getExchangeData();
      this.getIpoSecurityData();
      this.getIpoCompanyData();
      this.getPeriodsData();
      this.getAdvisorList();
      this.getstatusList();
      this.getIndustryList();
      this.financialMarketData.getIpoPageData('pie-chart').subscribe(
        (res: any) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);
          res.forEach((ele: any, i: any) => {
            this.pieChartData = {
              sector: ele.sector_name,
              amount: this.util.standardFormat(ele.offer_size, 2, ''),
              sector_code: ele.sector_code,
            };
            this.pieChartDataArray = [
              ...this.pieChartDataArray,
              this.pieChartData,
            ];
          });
          this.fundsChartIPO();
        },
        (err) => {
          console.error(err);
        }
      );
      // this.fundsChartIPO();
      // this.onIpoChartDataChanged('ipo-chart', 'Last 12 months');
    }
  }

  getLast5Years() {
    const currentYear = new Date().getFullYear();
    const range = (start: any, stop: any, step: any) =>
      Array.from(
        { length: (stop - start) / step + 1 },
        (_, i) => start + i * step
      );

    return range(currentYear, currentYear - 5, -1).slice(1);
  }

  handleMNACompanyClick() {
    this.count_res = 0;
    this.total_count_res = 1;
    // this.util.loaderService.display(true);
    this.selectCompanyData = [];
    setTimeout(() => {
      $('#companyDropdownMNA').select2('open');
    }, 100);

    if (this.previousAPI !== null) {
      this.previousAPI.unsubscribe();
    }

    this.getTransactionsCompanyDataHandler();
  }

  handleEntityId(e: any) {
    this.count_res = 0;
    this.total_count_res = 1;
    this.util.loaderService.display(true);
    this.entityId = e.entityId;
    this.entityName = e.name;
    this.getTransactionsDealsHistoryHandler();
  }

  handlePagination(page: any) {
    this.count_res = 0;
    this.total_count_res = 2;
    this.util.loaderService.display(true);
    this.currentPage = page;
    this.rowOffset = page * 10 - 10;
    this.getTransactionsTopDealMakersDataHandler();
  }

  handlePrevClick() {
    this.count_res = 0;
    this.total_count_res = 2;
    this.util.loaderService.display(true);
    this.currentPage -= 1;
    this.rowOffset = this.currentPage * 10 - 10;
    this.getTransactionsTopDealMakersDataHandler();
  }

  handleNextClick() {
    this.count_res = 0;
    this.total_count_res = 2;
    this.util.loaderService.display(true);
    this.currentPage += 1;
    this.rowOffset = this.currentPage * 10 - 10;
    this.getTransactionsTopDealMakersDataHandler();
  }

  handleMNAPeriodClick() {
    if (this.showMNADropdown == false) {
      this.showMNADropdown = true;
      this.isPeriodSelectedMNA == true;
    } else {
      this.showMNADropdown = true;
      this.isPeriodSelectedMNA = !this.isPeriodSelectedMNA;
    }
  }

  handleHistoryData(value: any) {
    this.dealId = value.dealId;
    this.count_res = 0;
    this.total_count_res = 1;
    this.util.loaderService.display(true);

    this.getTermsSynopsisDataHandler(value.dealId);
  }

  handleTopDealSortParam(value: any) {
    this.sortType = value;
    this.count_res = 0;
    this.total_count_res = 2;
    this.util.loaderService.display(true);

    this.getTransactionsTopDealMakersDataHandler();
  }

  handleMNATopDealMakersExcelDownload() {
    this.count_res = 0;
    this.total_count_res = 1;
    this.util.loaderService.display(true);

    this.financialMarketData
      .getMNATopDealMakersExcelDownload(
        this.selectedCountry,
        this.selectedIndustry,
        this.datepipe.transform(this.startDate, 'yyyy-MM-dd'),
        this.datepipe.transform(this.endDate, 'yyyy-MM-dd'),
        this.selectedCurrency
      )
      .subscribe(
        (res: any) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);

          const blob = new Blob([res.body], {
            type: 'application/vnd.ms.excel',
          });
          const file = new File(
            [blob],
            '' +
              `Top Deal Makers-${this.transactionsTopDealMakersData.topDealList[0].country}-${this.endDate}.xls`,
            {
              type: 'application/vnd.ms.excel',
            }
          );
          saveAs(file);
        },
        (err) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);
          if (err.status === 402) {
            this.auth.freeTrialAlert = true;
          }
          console.log('err', err.message);
        }
      );
  }

  handleMNAHistoryExcelDownload() {
    this.count_res = 0;
    this.total_count_res = 1;
    this.util.loaderService.display(true);

    this.financialMarketData
      .getMNAHistoryExcelDownloadData(
        this.entityId,
        this.selectedCurrency,
        this.datepipe.transform(this.startDate, 'yyyy-MM-dd'),
        this.datepipe.transform(this.endDate, 'yyyy-MM-dd')
      )
      .subscribe(
        (res: any) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);

          const blob = new Blob([res.body], {
            type: 'application/vnd.ms.excel',
          });
          const file = new File(
            [blob],
            '' + `Deals History - ${this.entityName}.xls`,
            {
              type: 'application/vnd.ms.excel',
            }
          );
          saveAs(file);
        },
        (err) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);
          if (err.status === 402) {
            this.auth.freeTrialAlert = true;
          }
          console.log('err', err.message);
        }
      );
  }

  countryListIpo: any = [];

  countryListHandler() {
    this.financialMarketData.getCountry().subscribe(
      (res) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);
        let formattedData: any = [];
        res.forEach((element: any) => {
          formattedData.push({
            id: element.countryName,
            text: element.countryName,
          });

          formattedData.sort(function (a: any, b: any) {
            if (a.text < b.text) {
              return -1;
            }
            if (a.text > b.text) {
              return 1;
            }
            return 0;
          });
          this.countryListIpo = formattedData;
        });
      },
      (err) => {
        console.log('error', err.message);
      }
    );
  }

  currencyData: any;
  currencyListHandler() {
    this.financialMarketData.getCurrency().subscribe(
      (res) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);
        let formattedData: any = [];
        res.forEach((element: any) => {
          formattedData.push({
            id: element.isoCode,
            text: element.currencyName + ' (' + element.isoCode + ')',
          });
          formattedData.sort(function (a: any, b: any) {
            if (a.text < b.text) {
              return -1;
            }
            if (a.text > b.text) {
              return 1;
            }
            return 0;
          });
          this.currencyData = formattedData;
        });
      },
      (err) => {
        console.log('error', err.message);
      }
    );
  }

  handleTermsSynopsisExcelClick(ev: any) {
    if (ev) {
      this.count_res = 0;
      this.total_count_res = 1;
      this.util.loaderService.display(true);

      this.financialMarketData
        .getTermsSynopsisExcelDownloadData(
          this.dealId,
          this.selectedCurrency,
          this.entityId
        )
        .subscribe(
          (res: any) => {
            ++this.count_res;
            this.util.checkCountValue(this.total_count_res, this.count_res);
            const blob = new Blob([res.body], {
              type: 'application/vnd.ms.excel',
            });
            const file = new File(
              [blob],
              '' + `Deals Terms & Synopsis - ${this.entityName}.xls`,
              {
                type: 'application/vnd.ms.excel',
              }
            );
            saveAs(file);
          },
          (err) => {
            ++this.count_res;
            this.util.checkCountValue(this.total_count_res, this.count_res);
            if (err.status === 402) {
              this.auth.freeTrialAlert = true;
            }
            console.log('err', err.message);
          }
        );
    }
  }

  handleFromDatePickerMNAChange(ev: any) {
    this.startDate = ev.target.value;
    this.fromDate = this.startDate;
  }

  handleToDatePickerMNAChange(ev: any) {
    this.endDate = ev.target.value;
    this.toDate = this.endDate;
  }

  handleGoBtnMNA() {
    this.currentPage = 1;
    this.rowOffset = 0;
    this.isPeriodSelectedMNA = false;
    this.periodValueMNA = 'Custom';
    this.count_res = 0;
    this.total_count_res = 2;
    this.util.loaderService.display(true);

    this.selectedCompany = '';
    this.getTransactionsTopDealMakersDataHandler();
  }

  handlePeriodsValuesMNA(ev: any) {
    this.count_res = 0;
    this.total_count_res = 2;
    this.util.loaderService.display(true);
    this.currentPage = 1;
    this.rowOffset = 0;

    this.periodValueMNA = ev.target.textContent;

    switch (ev.target.textContent) {
      case 'Last 3 Months':
        this.endDate = new Date();
        this.startDate = new Date(
          this.endDate.getFullYear(),
          this.endDate.getMonth() - 3,
          this.endDate.getDate() + 1
        );
        this.startDate = this.startDate.toISOString().slice(0, 10);
        this.endDate = new Date().toISOString().slice(0, 10);
        break;

      case 'Last 12 Months':
        this.getPeriodDates(1);
        break;

      case 'Last 3 Years':
        this.getPeriodDates(3);
        break;

      case 'Last 5 Years':
        this.getPeriodDates(5);
        break;

      case 'Last 10 Years':
        this.getPeriodDates(10);
        break;

      case 'Last 20 Years':
        this.getPeriodDates(20);
        break;

      case ev.target.textContent:
        this.startDate = `${ev.target.textContent}-01-01`;
        this.endDate = `${ev.target.textContent}-12-31`;
        break;

      default:
        break;
    }
    this.fromDate = this.startDate;
    this.toDate = this.endDate;

    this.isPeriodSelectedMNA = false;

    this.selectedCompany = '';
    this.getTransactionsTopDealMakersDataHandler();
  }

  getTransactionsCountryDataHandler() {
    let transactionsCountryFormattedData: any = [];

    this.financialMarketData.getTransactionsCountryData().subscribe(
      (res: any) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);
        res?.forEach((element: any) => {
          transactionsCountryFormattedData.push({
            id: element.countryIsoCode3,
            text: element.countryName,
          });
        });
        transactionsCountryFormattedData.unshift({
          id: 'Global',
          text: 'World',
        });
        this.selectCountryData = transactionsCountryFormattedData;
      },
      (err) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);

        console.log('error', err.message);
      }
    );
  }

  getTransactionsIndustryDataHandler(country: any) {
    let transactionsIndustryFormattedData: any = [];

    this.financialMarketData.getTransactionsIndustryData(country).subscribe(
      (res: any) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);
        res?.forEach((element: any) => {
          transactionsIndustryFormattedData.push({
            id: element.ticsIndustryCode,
            text: element.ticsIndustryName,
          });
        });
        this.selectIndustryData = transactionsIndustryFormattedData;
        this.selectIndustryData.unshift({
          id: 'All',
          text: 'Industry-All',
        });
      },
      (err) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);

        console.log('error', err.message);
      }
    );
  }

  getTransactionsCurrencyDataHandler() {
    let transactionsCurrencyFormattedData: any = [];

    this.financialMarketData.getTransactionsCurrencyData().subscribe(
      (res: any) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);
        res?.forEach((element: any) => {
          transactionsCurrencyFormattedData.push({
            id: element.isoCode,
            text: `${element.currencyName} (${element.isoCode})`,
          });
        });
        this.selectCurrencyData = transactionsCurrencyFormattedData;
      },
      (err) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);

        console.log('error', err.message);
      }
    );
  }

  getTransactionsTopDealMakersDataHandler() {
    if (this.selectedCountry === 'Global') {
      this.globalSelectedMNA = true;
      this.selectedCountry = '';
    } else {
      this.globalSelectedMNA = false;
    }

    this.financialMarketData
      .getTransactionsTopDealMakersData(
        this.selectedCountry,
        this.selectedIndustry,
        this.datepipe.transform(this.startDate, 'yyyy-MM-dd'),
        this.datepipe.transform(this.endDate, 'yyyy-MM-dd'),
        this.selectedCurrency,
        this.rowOffset,
        this.sortType
      )
      .subscribe(
        (res) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);
          this.transactionsTopDealMakersData = res;

          this.transactions_table_data = {
            ...this.transactions_table_data,
            value: res.topDealList,
          };

          this.entityId =
            this.transactionsTopDealMakersData?.topDealList[0]?.entityId;
          this.entityName =
            this.transactionsTopDealMakersData?.topDealList[0]?.name;

          this.barChartData = [];
          this.transactionsTopDealMakersData.topDealList
            ? (this.chartDataAvailableMNA = true)
            : (this.chartDataAvailableMNA = false);

          // Add data
          this.transactionsTopDealMakersData.topDealList?.forEach((el: any) => {
            this.barChartData.push({
              entity: el.name,
              total_value: el.totalValue?.toFixed(2),
              no_of_transactions: el.totalDeals,
            });
          });
          this.transactionChart();
          this.pageNumbers = Array(
            Math.ceil(this.transactionsTopDealMakersData.totalCount / 10)
          )
            .fill(0)
            .map((x, i) => i + 1);
          this.getTransactionsDealsHistoryHandler();

          if (this.globalSelectedMNA) {
            this.selectedCountry = 'Global';
          }
        },
        (err) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);

          console.log('error', err.message);
        }
      );
  }

  getTransactionsDealsHistoryHandler() {
    this.financialMarketData
      .getTransactionsDealsHistory(this.entityId, this.selectedCurrency)
      .subscribe(
        (res) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);

          res.map((el: any) => (el['srcIconUrl'] = '/assets/img/doc-icon.png'));
          this.transactionsDealsHistoryData = res;
          this.transactions_history_table_data = {
            ...this.transactions_history_table_data,
            value: res,
          };
        },
        (err) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);

          console.log('error', err.message);
        }
      );
  }

  getTransactionsCompanyDataHandler() {
    let transactionsComapnyFormattedData: any = [];

    this.previousAPI = this.financialMarketData
      .getMNATransactionsCompanyData()
      .subscribe(
        (res) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);
          res?.forEach((element: any) => {
            transactionsComapnyFormattedData.push({
              id: element.factSetEntityId,
              text: element.properName,
            });
          });
          this.selectCompanyData = transactionsComapnyFormattedData;

          if (res.length == 0) {
            setTimeout(() => {
              document
                .getElementById('select2-companyDropdownMNA-results')
                ?.classList.add('noDataApply');
            }, 1500);
          }

          setTimeout(() => {
            $('#companyDropdownMNA').select2('open');
          }, 100);
        },
        (err) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);

          console.log('error', err.message);
        }
      );
  }

  getTransactionsCompanySearchDataHandler(searchTerm: any) {
    let transactionsComapnyFormattedData: any = [];

    this.previousAPI = this.financialMarketData
      .getMNATransactionsCompanySearchData(searchTerm)
      .subscribe(
        (res) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);
          res?.forEach((element: any) => {
            transactionsComapnyFormattedData.push({
              id: element.factSetEntityId,
              text: element.properName,
            });
          });
          this.selectCompanyData = transactionsComapnyFormattedData;

          if (res.length == 0) {
            setTimeout(() => {
              document
                .getElementById('select2-companyDropdownMNA-results')
                ?.classList.add('noDataApply');
            }, 1500);
          }
          setTimeout(() => {
            $('#companyDropdownMNA').select2('open');
            (document.querySelector('.select2-search__field') as any).value =
              this.selectedCompanySearchTerm;
          }, 100);
        },
        (err) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);

          console.log('error', err.message);
        }
      );
  }

  getTermsSynopsisDataHandler(dealId: any) {
    this.financialMarketData
      .getTermsSynopsisData(dealId, this.selectedCurrency, this.entityId)
      .subscribe(
        (res) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);
          this.dealItem = res;

          this.terms_synopsis_table = {
            ...this.terms_synopsis_table,
            value: this.dealItem.dealAdvisors,
          };

          this.dealTerms = this.dealItem.dealTerms;

          for (let dealTerm of this.dealTerms) {
            dealTerm?.revenue_ltm_before_deal
              ? (this.showRevenueLTM = true)
              : (this.showRevenueLTM = false);

            dealTerm?.ebitda_ltm_before_deal
              ? (this.showEbitdaLTM = true)
              : (this.showEbitdaLTM = false);

            dealTerm?.price_share
              ? (this.showPriceShare = true)
              : (this.showPriceShare = false);

            dealTerm?.stock_price_share
              ? (this.showStockPriceShare = true)
              : (this.showStockPriceShare = false);

            dealTerm?.one_day_prem
              ? (this.showOneDayPrem = true)
              : (this.showOneDayPrem = false);

            dealTerm?.ev_rev
              ? (this.showEVREV = true)
              : (this.showEVREV = false);

            dealTerm?.ev_ebitda
              ? (this.showEVEBITDA = true)
              : (this.showEVEBITDA = false);
          }
        },
        (err) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);

          console.log('error', err.message);
        }
      );
  }

  valueChangedHandler(type: any, data: any) {
    if (type !== 'Search Company') {
      this.rowOffset = 0;
      this.currentPage = 1;
    }

    if (type === 'Country') {
      if (this.selectCountryData && this.selectedCountry !== data) {
        this.selectedCountry = data;
        this.selectedCompany = '';
        this.count_res = 0;
        this.total_count_res = 2;
        this.util.loaderService.display(true);

        this.getTransactionsTopDealMakersDataHandler();
      }
    } else if (type === 'Industry') {
      if (this.selectIndustryData && this.selectedIndustry !== data) {
        this.selectedIndustry = data;
        this.selectedCompany = '';
        this.count_res = 0;
        this.total_count_res = 2;
        this.util.loaderService.display(true);

        this.getTransactionsTopDealMakersDataHandler();
      }
    } else if (type === 'Currency') {
      if (this.selectCurrencyData && this.selectedCurrency !== data) {
        this.selectedCurrency = data;
        this.selectedCompany = '';
        this.count_res = 0;
        this.total_count_res = 2;
        this.util.loaderService.display(true);

        this.getTransactionsTopDealMakersDataHandler();

        this.transactions_table_data.title[4].label = `Total Value (${this.selectedCurrency} M)`;
        this.transactions_table_data.title[5].label = `Avg. Value (${this.selectedCurrency} M)`;
        this.transactions_table_data.title[6].label = `Largest Transaction (${this.selectedCurrency} M)`;
        this.transactions_history_table_data.title[6].label = `Transaction Value (${this.selectedCurrency} M)`;
        this.terms_synopsis_table.title[5].label = `Fee (${this.selectedCurrency} M)`;
      }
    } else if (type === 'Search Company') {
      if (this.selectCompanyData && this.selectedCompany !== data) {
        this.selectedCompany = data;
        this.entityId = this.selectedCompany;
        this.count_res = 0;
        this.total_count_res = 1;
        this.util.loaderService.display(true);

        this.entityName = this.selectCompanyData.filter((el: any) => {
          return el.id === this.selectedCompany;
        })[0].text;

        this.getTransactionsDealsHistoryHandler();
      }
    }
  }

  getPeriodDates(period: any) {
    this.endDate = new Date();
    this.startDate = new Date(
      this.endDate.getFullYear() - period,
      this.endDate.getMonth(),
      this.endDate.getDate() + 1
    );
    this.startDate = this.startDate.toISOString().slice(0, 10);
    this.endDate = new Date().toISOString().slice(0, 10);
  }

  getPeriodDatesPEVC(period: any) {
    this.endDatePEVC = new Date();
    this.startDatePEVC = new Date(
      this.endDatePEVC.getFullYear() - period,
      this.endDatePEVC.getMonth(),
      this.endDatePEVC.getDate() + 1
    );
    this.startDatePEVC = this.startDatePEVC.toISOString().slice(0, 10);
    this.endDatePEVC = new Date(
      this.endDatePEVC.getFullYear(),
      this.endDatePEVC.getMonth(),
      this.endDatePEVC.getDate()
    )
      .toISOString()
      .slice(0, 10);
  }

  getPeriodDatesDet(period: any) {
    this.endDateDet = new Date();
    this.startDateDet = new Date(
      this.endDateDet.getFullYear() - period,
      this.endDateDet.getMonth(),
      this.endDateDet.getDate() + 1
    );
    this.startDateDet = this.startDateDet.toISOString().slice(0, 10);
    this.endDateDet = new Date(
      this.endDateDet.getFullYear(),
      this.endDateDet.getMonth(),
      this.endDateDet.getDate()
    )
      .toISOString()
      .slice(0, 10);
  }

  // PEVC
  getTransactionsPEVCCurrencyDataHandler() {
    let transactionsCurrencyFormattedData: any = [];

    this.financialMarketData.getTransactionsCurrencyData().subscribe(
      (res: any) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);
        res?.forEach((element: any) => {
          transactionsCurrencyFormattedData.push({
            id: element.isoCode,
            text: `${element.currencyName} (${element.isoCode})`,
          });
        });
        this.selectPEVCCurrencyData = transactionsCurrencyFormattedData;
      },
      (err) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);

        console.log('error', err.message);
      }
    );
  }

  getTransactionsPEVCCountryDataHandler() {
    let transactionsCountryFormattedData: any = [];

    this.financialMarketData.getTransactionsPEVCCountryData().subscribe(
      (res: any) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);
        res?.forEach((element: any) => {
          transactionsCountryFormattedData.push({
            id: element.countryIsoCode3,
            text: element.countryName,
          });
        });
        transactionsCountryFormattedData.unshift({
          id: 'Global',
          text: 'World',
        });
        this.selectPEVCCountryData = transactionsCountryFormattedData;
        this.selectDetCountryData = this.selectPEVCCountryData;
      },
      (err) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);

        console.log('error', err.message);
      }
    );
  }
  selectPEVCSectorData: any = [];
  selectedPEVCSector: any = 'All';
  getSectorData() {
    let transactionsSectorFormattedData: any = [];
    this.financialMarketData.getFundsSector().subscribe(
      (res: any) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);
        res?.forEach((element: any) => {
          transactionsSectorFormattedData.push({
            id: element.sector_code,
            text: element.sector_name,
          });
        });
        transactionsSectorFormattedData.unshift({
          id: 'All',
          text: 'Sector-All',
        });
        this.selectPEVCSectorData = transactionsSectorFormattedData;
      },
      (err) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);
        console.log('error', err.message);
      }
    );
  }
  sectorIndvidualSelected: any = false;
  valueChangedPEVCHandler(type: any, data: any) {
    if (type === 'Currency') {
      if (this.selectPEVCCurrencyData && this.selectedPEVCCurrency !== data) {
        this.selectedPEVCCurrency = data;
        this.count_res = 0;
        this.total_count_res = 4;
        this.util.loaderService.display(true);

        // this.getTransactionsPEVCFundingChartDataHandler();
        // this.getTransactionsPEVCGlobalFundingChartDataHandler();
        // this.getTransactionsPEVCTopFundedCompaniesHandler();
        // this.getTransactionsFundingDetailsDataHandler();

        if (this.selectedPEVCSector === 'All') {
          this.getTransactionsPEVCFundingChartDataHandler();
          this.getTransactionsPEVCGlobalFundingChartDataHandler();
          this.getTransactionsPEVCTopFundedCompaniesHandler();
          this.getTransactionsFundingDetailsDataHandler();
        } else {
          this.count_res = 0;
          this.total_count_res = 2;
          this.getCountryFundingSectorChart2(this.selectedPEVCSector);
          this.getGlobalFundingSectorChart2(this.selectedPEVCSector);
        }

        this.funds_table_data.title[3].label = `Total Funding Amount (${this.selectedPEVCCurrency} Million)`;
        this.funds_details_table_data.title[6].label = `Total Funding Amount (${this.selectedPEVCCurrency} Million)`;
      }
    } else if (type === 'Country') {
      if (this.selectPEVCCountryData && this.selectedPEVCCountry !== data) {
        this.selectedPEVCCountry = data;
        this.count_res = 0;
        this.total_count_res = 2;
        this.util.loaderService.display(true);

        if (this.selectedPEVCSector === 'All') {
          if (this.selectedPEVCCountry === 'Global') {
            this.getTransactionsPEVCCountryChartDataHandler();
            this.getTransactionsPEVCTopFundedCompaniesHandler();
          } else {
            this.getTransactionsPEVCFundingChartDataHandler();
            this.getTransactionsPEVCTopFundedCompaniesHandler();
          }
        } else {
          this.getCountryFundingSectorChart2(this.selectedPEVCSector);
          this.getGlobalFundingSectorChart2(this.selectedPEVCSector);
        }
      }
    } else if (type === 'Sector') {
      if (this.selectPEVCSectorData && this.selectedPEVCSector !== data) {
        this.selectedPEVCSector = data;
        this.count_res = 0;
        this.total_count_res = 2;
        this.util.loaderService.display(true);
        if (this.selectedPEVCSector === 'All') {
          this.sectorIndvidualSelected = false;
          this.getTransactionsPEVCFundingChartDataHandler();
          this.getTransactionsPEVCGlobalFundingChartDataHandler();
        } else {
          this.sectorIndvidualSelected = true;
          this.getCountryFundingSectorChart2(this.selectedPEVCSector);
          this.getGlobalFundingSectorChart2(this.selectedPEVCSector);
        }
      }
    }
  }

  getTransactionsPEVCCountryChartDataHandler() {
    this.financialMarketData
      .getTransactionsPEVCCountryChartData(
        this.selectedPEVCCurrency,
        this.selectedPEVCCountry,
        this.datepipe.transform(this.startDatePEVC, 'yyyy-MM-dd'),
        this.datepipe.transform(this.endDatePEVC, 'yyyy-MM-dd')
      )
      .subscribe((res) => {
        // console.log(res);
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);

        this.localPieChartCountryData = [];
        res
          ? (this.chartDataAvailableLocalCountryPEVC = true)
          : (this.chartDataAvailableLocalCountryPEVC = false);

        res?.forEach((el: any) => {
          this.localPieChartCountryData.push({
            code: el.code,
            country: el.name,
            amount: el.valuation?.toFixed(2),
          });
        });

        this.localPieChartCountryData = this.localPieChartCountryData.slice(
          0,
          50
        );
        this.fundsCountryChart();
      });
  }

  getTransactionsPEVCFundingChartDataHandler() {
    this.financialMarketData
      .getTransactionsPEVCFundingChartData(
        this.selectedPEVCCurrency,
        this.selectedPEVCCountry,
        this.datepipe.transform(this.startDatePEVC, 'yyyy-MM-dd'),
        this.datepipe.transform(this.endDatePEVC, 'yyyy-MM-dd')
      )
      .subscribe(
        (res) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);
          this.localPieChartData = [];
          res
            ? (this.chartDataAvailableLocalPEVC = true)
            : (this.chartDataAvailableLocalPEVC = false);

          res?.forEach((el: any) => {
            this.localPieChartData.push({
              code: el.code,
              sector: el.name,
              amount: el.valuation?.toFixed(2),
            });
          });
          this.fundsChart();
        },
        (err) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);

          console.log('error', err.message);
        }
      );
  }

  getTransactionsPEVCGlobalFundingChartDataHandler() {
    this.financialMarketData
      .getTransactionsPEVCFundingChartData(
        this.selectedPEVCCurrency,
        'Global',
        this.datepipe.transform(this.startDatePEVC, 'yyyy-MM-dd'),
        this.datepipe.transform(this.endDatePEVC, 'yyyy-MM-dd')
      )
      .subscribe(
        (res) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);
          this.globalPieChartData = [];
          res
            ? (this.chartDataAvailableGlobalPEVC = true)
            : (this.chartDataAvailableGlobalPEVC = false);

          res?.forEach((el: any) => {
            this.globalPieChartData.push({
              code: el.code,
              sector: el.name,
              amount: el.valuation?.toFixed(2),
            });
          });
          this.GlobalFundsChart();
        },
        (err) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);

          console.log('error', err.message);
        }
      );
  }

  getTransactionsPEVCTopFundedCompaniesHandler() {
    this.financialMarketData
      .getTransactionsPEVCTopFundedCompanies(
        this.selectedPEVCCurrency,
        this.selectedPEVCCountry,
        this.datepipe.transform(this.startDatePEVC, 'yyyy-MM-dd'),
        this.datepipe.transform(this.endDatePEVC, 'yyyy-MM-dd')
      )
      .subscribe(
        (res) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);
          this.topFundedCompaniesData = res;

          this.handleModalPagination();

          this.funds_table_data = {
            ...this.funds_table_data,
            value: res.slice(0, 5),
          };
        },
        (err) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);

          console.log('error', err.message);
        }
      );
  }

  handlePEVCFundingSummaryExcelDownload() {
    this.count_res = 0;
    this.total_count_res = 1;
    this.util.loaderService.display(true);

    this.financialMarketData
      .getPEVCFundingSummaryExcelDownload(
        this.selectedPEVCCountry,
        this.datepipe.transform(this.startDatePEVC, 'yyyy-MM-dd'),
        this.datepipe.transform(this.endDatePEVC, 'yyyy-MM-dd'),
        this.selectedPEVCCurrency
      )
      .subscribe(
        (res: any) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);

          const blob = new Blob([res.body], {
            type: 'application/vnd.ms.excel',
          });
          const file = new File(
            [blob],
            '' + `PEVC Summary-${this.endDatePEVC}.xls`,
            {
              type: 'application/vnd.ms.excel',
            }
          );
          saveAs(file);
        },
        (err) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);
          if (err.status === 402) {
            this.auth.freeTrialAlert = true;
          }
          console.log('err', err.message);
        }
      );
  }

  handleModalPagination() {
    this.modalPageNumbers = Array(
      Math.ceil(this.topFundedCompaniesData.length / this.pageEntries)
    )
      .fill(0)
      .map((x, i) => i + 1);
  }

  handlePageEntries(e: any) {
    this.pageEntries = parseInt(e.target.value);
    this.handleModalPagination();
  }

  handleSelectedRow(value: any) {
    this.count_res = 0;
    this.total_count_res = 1;
    this.util.loaderService.display(true);

    this.financialMarketData
      .getTransactionsFundingDetailsData(
        value.country,
        value.industryName,
        this.datepipe.transform(this.startDatePEVC, 'yyyy-MM-dd'),
        this.datepipe.transform(this.endDatePEVC, 'yyyy-MM-dd'),
        this.selectedPEVCCurrency,
        value.finType,
        value.entityId
      )
      .subscribe(
        (res) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);

          this.funds_details_table_data = {
            ...this.funds_details_table_data,
            value: res.pevcFundingList,
          };

          this.selectedDetCountry = res.pevcFundingList[0].countryCode;
          this.selectedDetIndustry = res.pevcFundingList[0].industryCode;
          this.selectedDetFinType = res.pevcFundingList[0].financingType;
          this.periodValueDet = 'Last 12 Months';
          this.selectedDetCompany = '';
        },
        (err) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);

          console.log('error', err.message);
        }
      );
  }

  handleModalEntityClick(value: any) {
    this.auth.openPopupModal = false;
    this.count_res = 0;
    this.total_count_res = 1;
    this.util.loaderService.display(true);

    this.financialMarketData
      .getTransactionsFundingDetailsData(
        value.country,
        value.industryName,
        this.startDatePEVC,
        this.endDatePEVC,
        this.selectedPEVCCurrency,
        value.finType,
        value.entityId
      )
      .subscribe(
        (res) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);

          this.funds_details_table_data = {
            ...this.funds_details_table_data,
            value: res.pevcFundingList,
          };
        },
        (err) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);

          console.log('error', err.message);
        }
      );
  }

  handlePEVCCompanyClick() {
    this.count_res = 0;
    this.total_count_res = 1;
    // this.util.loaderService.display(true);
    this.selectDetCompanyData = [];
    setTimeout(() => {
      $('#companyDropdownPEVC').select2('open');
    }, 100);

    if (this.previousAPI !== null) {
      this.previousAPI.unsubscribe();
    }

    this.getTransactionsPEVCDetSearchCompanyDataHandler();
  }

  handlePeriodClick() {
    if (this.showPEVCDropdown == false) {
      this.showPEVCDropdown = true;
      this.isPeriodSelected == true;
    } else {
      this.showPEVCDropdown = true;
      this.isPeriodSelected = !this.isPeriodSelected;
    }
  }

  handleFromDatePickerChange(ev: any) {
    this.startDatePEVC = ev.target.value;
    this.fromDatePEVC = this.startDatePEVC;
  }

  handleToDatePickerChange(ev: any) {
    this.endDatePEVC = ev.target.value;
    this.toDatePEVC = this.endDatePEVC;
  }

  handleGoBtn() {
    this.isPeriodSelected = false;
    this.periodValue = 'Period - Custom';
    this.count_res = 0;
    this.total_count_res = 3;
    this.util.loaderService.display(true);

    this.getTransactionsPEVCFundingChartDataHandler();
    this.getTransactionsPEVCGlobalFundingChartDataHandler();
    this.getTransactionsPEVCTopFundedCompaniesHandler();
  }

  handlePeriodsValues(ev: any) {
    this.count_res = 0;
    this.total_count_res = 3;
    this.util.loaderService.display(true);
    this.periodValue = ev.target.textContent;

    switch (ev.target.textContent) {
      case 'Last 3 Months':
        this.endDatePEVC = new Date();
        this.startDatePEVC = new Date(
          this.endDatePEVC.getFullYear(),
          this.endDatePEVC.getMonth() - 3,
          this.endDatePEVC.getDate() + 1
        );
        this.startDatePEVC = this.startDatePEVC.toISOString().slice(0, 10);
        this.endDatePEVC = new Date(
          this.endDatePEVC.getFullYear(),
          this.endDatePEVC.getMonth(),
          this.endDatePEVC.getDate()
        )
          .toISOString()
          .slice(0, 10);
        break;

      case 'Last 12 Months':
        this.getPeriodDatesPEVC(1);
        break;

      case 'Last 3 Years':
        this.getPeriodDatesPEVC(3);
        break;

      case 'Last 5 Years':
        this.getPeriodDatesPEVC(5);
        break;

      case 'Last 10 Years':
        this.getPeriodDatesPEVC(10);
        break;

      case 'Last 20 Years':
        this.getPeriodDatesPEVC(20);
        break;

      case ev.target.textContent:
        this.startDatePEVC = `${ev.target.textContent}-01-01`;
        this.endDatePEVC = `${ev.target.textContent}-12-31`;
        break;

      default:
        break;
    }
    this.fromDatePEVC = this.startDatePEVC;
    this.toDatePEVC = this.endDatePEVC;

    this.isPeriodSelected = false;

    // this.getTransactionsPEVCFundingChartDataHandler();
    // this.getTransactionsPEVCGlobalFundingChartDataHandler();
    // this.getTransactionsPEVCTopFundedCompaniesHandler();

    if (this.selectedPEVCSector === 'All') {
      this.getTransactionsPEVCFundingChartDataHandler();
      this.getTransactionsPEVCGlobalFundingChartDataHandler();
      this.getTransactionsPEVCTopFundedCompaniesHandler();
    } else {
      this.count_res = 0;
      this.total_count_res = 2;
      this.getCountryFundingSectorChart2(this.selectedPEVCSector);
      this.getGlobalFundingSectorChart2(this.selectedPEVCSector);
    }
  }

  getTransactionsDetIndustryDataHandler(country: any) {
    let transactionsIndustryFormattedData: any = [];

    this.financialMarketData
      .getTransactionsPEVCIndustryData(
        country,
        this.startDatePEVC,
        this.endDatePEVC
      )
      .subscribe(
        (res: any) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);
          res?.forEach((element: any) => {
            transactionsIndustryFormattedData.push({
              id: element.ticsIndustryCode,
              text: element.ticsIndustryName,
            });
          });
          this.selectDetIndustryData = transactionsIndustryFormattedData;
          this.selectDetIndustryData.unshift({
            id: 'All',
            text: 'Industry-All',
          });
        },
        (err) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);

          console.log('error', err.message);
        }
      );
  }

  getTransactionsDetFinTypeDataHandler() {
    let transactionsFinTypeFormattedData: any = [];

    this.financialMarketData.getTransactionsAdvSearchFinTypeData().subscribe(
      (res: any) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);
        res?.forEach((element: any) => {
          transactionsFinTypeFormattedData.push({
            id: element,
            text: `Financing Type - ${element}`,
          });
        });
        this.selectDetFinTypeData = transactionsFinTypeFormattedData;
      },
      (err) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);

        console.log('error', err.message);
      }
    );
  }

  getTransactionsPEVCDetSearchCompanyDataHandler() {
    let transactionsComapnyFormattedData: any = [];

    this.previousAPI = this.financialMarketData
      .getTransactionsPEVCSearchCompanyData()
      .subscribe(
        (res) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);
          res?.forEach((element: any) => {
            transactionsComapnyFormattedData.push({
              id: element.factSetEntityId,
              text: element.properName,
            });
          });
          this.selectDetCompanyData = transactionsComapnyFormattedData;

          if (res.length == 0) {
            setTimeout(() => {
              document
                .getElementById('select2-companyDropdownPEVC-results')
                ?.classList.add('noDataApply');
            }, 1500);
          }
          setTimeout(() => {
            $('#companyDropdownPEVC').select2('open');
          }, 100);
        },
        (err) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);

          console.log('error', err.message);
        }
      );
  }

  getTransactionsDetCompanySearchDataHandler(searchTerm: any) {
    let transactionsComapnyFormattedData: any = [];

    this.previousAPI = this.financialMarketData
      .getTransactionsCompanySearchData(searchTerm)
      .subscribe(
        (res) => {
          this.selectDetCompanyData = [];
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);
          res?.forEach((element: any) => {
            transactionsComapnyFormattedData.push({
              id: element.factSetEntityId,
              text: element.properName,
            });
          });
          this.selectDetCompanyData = transactionsComapnyFormattedData;

          if (res.length == 0) {
            setTimeout(() => {
              document
                .getElementById('select2-companyDropdownPEVC-results')
                ?.classList.add('noDataApply');
            }, 1500);
          }

          setTimeout(() => {
            $('#companyDropdownPEVC').select2('open');
            (document.querySelector('.select2-search__field') as any).value =
              this.selectedDetCompanySearchTerm;
          }, 100);
        },
        (err) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);

          console.log('error', err.message);
        }
      );
  }

  getTransactionsFundingDetailsDataHandler() {
    if (this.selectedDetCountry === 'Global') {
      this.globalSelectedPEVCDet = true;
      this.selectedDetCountry = '';
    } else {
      this.globalSelectedPEVCDet = false;
    }

    this.financialMarketData
      .getTransactionsFundingDetailsData(
        this.selectedDetCountry,
        this.selectedDetIndustry,
        this.datepipe.transform(this.startDateDet, 'yyyy-MM-dd'),
        this.datepipe.transform(this.endDateDet, 'yyyy-MM-dd'),
        this.selectedPEVCCurrency,
        this.selectedDetFinType
      )
      .subscribe(
        (res) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);
          this.fundingDetailsData = res;

          this.funds_details_table_data = {
            ...this.funds_details_table_data,
            value: res.pevcFundingList,
          };

          if (this.globalSelectedPEVCDet) {
            this.selectedDetCountry = 'Global';
          }
        },
        (err) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);

          console.log('error', err.message);
        }
      );
  }

  handleFundingDetExcelClick() {
    this.count_res = 0;
    this.total_count_res = 1;
    this.util.loaderService.display(true);

    this.financialMarketData
      .getFundingDetExcelDownloadData(
        this.selectedDetCountry,
        this.selectedDetIndustry,
        this.datepipe.transform(this.startDateDet, 'yyyy-MM-dd'),
        this.datepipe.transform(this.endDateDet, 'yyyy-MM-dd'),
        this.selectedPEVCCurrency,
        this.selectedDetFinType,
        this.selectedDetCompany
      )
      .subscribe(
        (res: any) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);

          const blob = new Blob([res.body], {
            type: 'application/vnd.ms.excel',
          });
          const file = new File(
            [blob],
            '' +
              `VCPE Funding Details-${this.fundingDetailsData.pevcFundingList[0].countryName}-${this.endDateDet}.xls`,
            {
              type: 'application/vnd.ms.excel',
            }
          );
          saveAs(file);
        },
        (err) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);
          if (err.status === 402) {
            this.auth.freeTrialAlert = true;
          }
          console.log('err', err.message);
        }
      );
  }

  handlePeriodClickDet() {
    if (this.showPEVCDetDropdown == false) {
      this.showPEVCDetDropdown = true;
      this.isDetPeriodSelected == true;
    } else {
      this.showPEVCDetDropdown = true;
      this.isDetPeriodSelected = !this.isDetPeriodSelected;
    }
  }

  handleFromDatePickerDetChange(ev: any) {
    this.startDateDet = ev.target.value;
    this.fromDateDet = this.startDateDet;
  }

  handleToDatePickerDetChange(ev: any) {
    this.endDateDet = ev.target.value;
    this.toDateDet = this.endDateDet;
  }

  handleDetGoBtn() {
    this.isDetPeriodSelected = false;
    this.periodValueDet = 'Period - Custom';
    this.count_res = 0;
    this.total_count_res = 1;
    this.util.loaderService.display(true);

    this.getTransactionsFundingDetailsDataHandler();
  }

  handleFundingRoundHeaderData(data: any) {
    this.fundingRoundHeaderData = data;
  }

  handleFundingRoundData(data: any) {
    this.round_table = {
      ...this.round_table,
      value: data,
    };
  }

  handleSelectedRowDet(data: any) {
    this.selectedRowDetData = data;
  }

  handlePeriodsValuesDet(ev: any) {
    this.periodValueDet = ev.target.textContent;
    this.count_res = 0;
    this.total_count_res = 1;
    this.util.loaderService.display(true);

    switch (ev.target.textContent) {
      case 'Last 3 Months':
        this.endDateDet = new Date();
        this.startDateDet = new Date(
          this.endDateDet.getFullYear(),
          this.endDateDet.getMonth() - 3,
          this.endDateDet.getDate() + 1
        );
        this.startDateDet = this.startDateDet.toISOString().slice(0, 10);
        this.endDateDet = new Date(
          this.endDateDet.getFullYear(),
          this.endDateDet.getMonth(),
          this.endDateDet.getDate()
        )
          .toISOString()
          .slice(0, 10);
        break;

      case 'Last 12 Months':
        this.getPeriodDatesDet(1);
        break;

      case 'Last 3 Years':
        this.getPeriodDatesDet(3);
        break;

      case 'Last 5 Years':
        this.getPeriodDatesDet(5);
        break;

      case 'Last 10 Years':
        this.getPeriodDatesDet(10);
        break;

      case 'Last 20 Years':
        this.getPeriodDatesDet(10);
        break;

      case ev.target.textContent:
        this.startDateDet = `${ev.target.textContent}-01-01`;
        this.endDateDet = `${ev.target.textContent}-12-31`;
        break;

      default:
        break;
    }
    this.fromDateDet = this.startDateDet;
    this.toDateDet = this.endDateDet;

    this.isDetPeriodSelected = false;

    this.getTransactionsFundingDetailsDataHandler();
  }

  getTransactionsFundingDetailCompanySearchHandler() {
    // this.selectedDetCountry = 'IND';
    // this.periodValueDet = 'Last 12 Months';
    // this.selectedDetIndustry = 'All';
    // this.selectedDetFinType = 'All';

    this.financialMarketData
      .getTransactionsFundingDetailsData(
        this.selectedDetCountry,
        this.selectedDetIndustry,
        this.datepipe.transform(this.startDateDet, 'yyyy-MM-dd'),
        this.datepipe.transform(this.endDateDet, 'yyyy-MM-dd'),
        this.selectedPEVCCurrency,
        this.selectedDetFinType,
        this.selectedDetCompany
      )
      .subscribe(
        (res) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);

          this.funds_details_table_data = {
            ...this.funds_details_table_data,
            value: res.pevcFundingList,
          };

          if (res.pevcFundingList) {
            this.selectedDetCountry = res.pevcFundingList[0]?.countryCode;
            this.selectedDetIndustry = res.pevcFundingList[0]?.industryCode;
            // this.selectedDetFinType = res.pevcFundingList[0]?.financingType;
            this.periodValueDet = 'Last 10 Years';
          }
        },
        (err) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);

          console.log('error', err.message);
        }
      );
  }

  // Funding Details
  valueChangedHandlerDet(type: any, data: any) {
    if (type === 'Country') {
      if (this.selectDetCountryData && this.selectedDetCountry !== data) {
        this.selectedDetCountry = data;
        this.count_res = 0;
        this.total_count_res = 1;
        this.util.loaderService.display(true);

        this.getTransactionsFundingDetailsDataHandler();

        this.selectedDetCompany = '';
      }
    } else if (type === 'Industry') {
      if (this.selectDetIndustryData && this.selectedDetIndustry !== data) {
        this.selectedDetIndustry = data;
        this.count_res = 0;
        this.total_count_res = 1;
        this.util.loaderService.display(true);

        this.getTransactionsFundingDetailsDataHandler();

        this.selectedDetCompany = '';
      }
    } else if (type === 'Financing Type') {
      if (this.selectDetFinTypeData && this.selectedDetFinType !== data) {
        this.selectedDetFinType = data;
        this.count_res = 0;
        this.total_count_res = 1;
        this.util.loaderService.display(true);

        this.getTransactionsFundingDetailsDataHandler();

        this.selectedDetCompany = '';
      }
    } else if (type === 'Company') {
      if (this.selectDetCompanyData && this.selectedDetCompany !== data) {
        this.selectedDetCompany = data;
        this.count_res = 0;
        this.total_count_res = 1;
        this.util.loaderService.display(true);

        this.startDateDet = new Date(
          this.currentDate.getFullYear() - 10,
          this.currentDate.getMonth(),
          this.currentDate.getDate()
        )
          .toISOString()
          .slice(0, 10);

        this.endDateDet = new Date(
          this.currentDate.getFullYear(),
          this.currentDate.getMonth(),
          this.currentDate.getDate()
        )
          .toISOString()
          .slice(0, 10);

        this.getTransactionsFundingDetailCompanySearchHandler();

        // this.selectedDetCountry = 'IND';
        // this.periodValueDet = 'Last 12 Months';
        // this.selectedDetIndustry = 'All';
        // this.selectedDetFinType = 'All';
      }
    }
  }

  handleChartModalCloseClick(value: any) {
    if (value) {
      this.openChartModal = false;
    }
  }

  handleOtherChartModalCloseClick(value: any) {
    if (value) {
      this.openOtherChartModal = false;
    }
  }

  handleOtherChartSliceClicked(data: any) {
    this.openOtherChartModal = false;
    this.openChartModal = true;
    this.count_res = 0;
    this.total_count_res = 1;
    this.util.loaderService.display(true);

    if (this.globalOtherSliceClicked) {
      this.getGlobalFundingSectorChart(data);
    } else {
      this.getCountryFundingSectorChart(data);
    }
  }

  getCountryFundingSectorChart(sectorCode: any) {
    this.financialMarketData
      .getCountryFundingSectorChart(
        this.selectedPEVCCountry,
        this.datepipe.transform(this.startDatePEVC, 'yyyy-MM-dd'),
        this.datepipe.transform(this.endDatePEVC, 'yyyy-MM-dd'),
        sectorCode,
        this.selectedPEVCCurrency
      )
      .subscribe(
        (res: any) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);
          this.fundingSectorChartData = [];
          res
            ? (this.chartDataAvailableGlobalSectorPEVC = true)
            : (this.chartDataAvailableGlobalSectorPEVC = false);

          res?.forEach((el: any) => {
            this.fundingSectorChartData.push({
              name: el.name,
              amount: el.valuation?.toFixed(2),
            });
          });
        },
        (err) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);
          console.log('error', err.message);
        }
      );
  }

  getCountryFundingSectorChart2(sectorCode: any) {
    this.financialMarketData
      .getCountryFundingSectorChart(
        this.selectedPEVCCountry,
        this.datepipe.transform(this.startDatePEVC, 'yyyy-MM-dd'),
        this.datepipe.transform(this.endDatePEVC, 'yyyy-MM-dd'),
        sectorCode,
        this.selectedPEVCCurrency
      )
      .subscribe(
        (res: any) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);
          this.fundingSectorChartData = [];
          res
            ? (this.chartDataAvailableGlobalSectorPEVC = true)
            : (this.chartDataAvailableGlobalSectorPEVC = false);

          res?.forEach((el: any) => {
            this.fundingSectorChartData.push({
              name: el.name,
              amount: el.valuation?.toFixed(2),
            });
          });

          this.sectorFundsChart();
        },
        (err) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);
          console.log('error', err.message);
        }
      );
  }

  getGlobalFundingSectorChart(sectorCode: any) {
    this.financialMarketData
      .getGlobalFundingSectorChart(
        this.datepipe.transform(this.startDatePEVC, 'yyyy-MM-dd'),
        this.datepipe.transform(this.endDatePEVC, 'yyyy-MM-dd'),
        sectorCode,
        this.selectedPEVCCurrency
      )
      .subscribe(
        (res: any) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);
          this.fundingSectorChartData = [];
          res
            ? (this.chartDataAvailableGlobalSectorPEVC = true)
            : (this.chartDataAvailableGlobalSectorPEVC = false);

          res?.forEach((el: any) => {
            this.fundingSectorChartData.push({
              name: el.name,
              amount: el.valuation?.toFixed(2),
            });
          });
        },
        (err) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);
          console.log('error', err.message);
        }
      );
  }
  fundingSectorChartData2: any;
  getGlobalFundingSectorChart2(sectorCode: any) {
    this.financialMarketData
      .getGlobalFundingSectorChart(
        this.datepipe.transform(this.startDatePEVC, 'yyyy-MM-dd'),
        this.datepipe.transform(this.endDatePEVC, 'yyyy-MM-dd'),
        sectorCode,
        this.selectedPEVCCurrency
      )
      .subscribe(
        (res: any) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);
          this.fundingSectorChartData2 = [];
          res
            ? (this.chartDataAvailableGlobalSectorPEVC = true)
            : (this.chartDataAvailableGlobalSectorPEVC = false);

          res?.forEach((el: any) => {
            this.fundingSectorChartData2.push({
              name: el.name,
              amount: el.valuation?.toFixed(2),
            });
          });
          this.sectorFundsChart2();
        },
        (err) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);
          console.log('error', err.message);
        }
      );
  }

  sectorFundsChart() {
    setTimeout(() => {
      this.globalPieChart = am4core.create(
        'fundsPieChartDiv',
        am4charts.PieChart
      );
      // $(document).ready(function () {
      //   $('g[aria-labelledby]').hide();
      // });
      am4core.options.commercialLicense = true;

      this.globalPieChart.data = this.fundingSectorChartData;

      this.globalPieChart.events.on('beforedatavalidated', (ev: any) => {
        // check if there's data
        if (ev.target.data.length === 0) {
          let indicator = this.globalPieChart.tooltipContainer.createChild(
            am4core.Container
          );
          let indicatorLabel = indicator.createChild(am4core.Label);
          indicatorLabel.text = 'No Data Available';
          indicatorLabel.isMeasured = false;
          if (this.sectorIndvidualSelected) {
            indicatorLabel.x = 160;
            indicatorLabel.y = 110;
          } else {
            indicatorLabel.x = 660;
            indicatorLabel.y = 220;
          }
          indicatorLabel.fontSize = 14;
          indicatorLabel.fill = am4core.color('#ffc000');
        }
      });

      this.globalPieChart.numberFormatter.numberFormat = '#,###.##';

      // Add and configure Series
      let pieSeries = this.globalPieChart.series.push(
        new am4charts.PieSeries()
      );

      pieSeries.dataFields.value = 'amount';
      pieSeries.dataFields.category = 'name';
      pieSeries.slices.template.strokeWidth = 2;
      pieSeries.slices.template.strokeOpacity = 1;
      pieSeries.labels.template.fill = am4core.color('#ffc000');
      pieSeries.labels.template.fontSize = 10;
      pieSeries.slices.template.propertyFields.fill = 'color';
      // This creates initial animation
      pieSeries.ticks.template.disabled = false;
      pieSeries.ticks.template.fill = am4core.color('#ffc000');
      pieSeries.ticks.template.stroke = am4core.color('#ffc000');
      pieSeries.ticks.template.strokeWidth = 2;
      pieSeries.labels.template.text = '{value.percent}%';
      pieSeries.labels.template.fontSize = 12;
      pieSeries.slices.template.tooltipText = `{name} : {value} ${this.selectedPEVCCurrency} Million`;
      pieSeries.tooltip.label.fontSize = 14;
      pieSeries.colors.list = [
        am4core.color('rgb(68, 114, 196)'),
        am4core.color('rgb(237, 125, 49)'),
        am4core.color('rgb(255, 192, 0)'),
        am4core.color('rgb(91, 155, 213)'),
        am4core.color('rgb(23, 145, 114)'),
        am4core.color('rgb(255, 199, 95)'),
        am4core.color('rgb(255, 150, 113)'),
        am4core.color('#67b7dc'),
        am4core.color('#dc67ab'),
        am4core.color('#a367dc'),
        am4core.color('#8067dc'),
      ];

      let slice = pieSeries.slices.template;
      slice.states.getKey('hover').properties.scale = 1;
      slice.states.getKey('active').properties.shiftRadius = 0;

      if (this.sectorIndvidualSelected) {
        let grouper = pieSeries.plugins.push(
          new am4plugins_sliceGrouper.SliceGrouper()
        );
        grouper.threshold = 3;
        // grouper.limit = 6;
        grouper.groupName = 'Other';
        grouper.clickBehavior = 'none';

        pieSeries.slices.template.events.on('hit', (ev: any) => {
          if (ev.target._dataItem.properties.category === 'Other') {
            this.chartModalTitle = this.selectedPEVCCountry;
            this.openOtherChartModal = true;
            // this.globalOtherSliceClicked = false;

            this.fundingSectorChartOtherData =
              this.fundingSectorChartData.slice(
                grouper.bigSlices.length,
                this.fundingSectorChartData.length - 1
              );
          }
        });
      }
    }, 1);
  }

  sectorFundsChart2() {
    setTimeout(() => {
      this.globalPieChart = am4core.create(
        'globalFundsPieChartDiv',
        am4charts.PieChart
      );
      // $(document).ready(function () {
      //   $('g[aria-labelledby]').hide();
      // });
      am4core.options.commercialLicense = true;

      this.globalPieChart.data = this.fundingSectorChartData2;

      this.globalPieChart.events.on('beforedatavalidated', (ev: any) => {
        // check if there's data
        if (ev.target.data.length === 0) {
          let indicator = this.globalPieChart.tooltipContainer.createChild(
            am4core.Container
          );
          let indicatorLabel = indicator.createChild(am4core.Label);
          indicatorLabel.text = 'No Data Available';
          indicatorLabel.isMeasured = false;
          if (this.sectorIndvidualSelected) {
            indicatorLabel.x = 660;
            indicatorLabel.y = 110;
          } else {
            indicatorLabel.x = 660;
            indicatorLabel.y = 220;
          }
          indicatorLabel.fontSize = 14;
          indicatorLabel.fill = am4core.color('#ffc000');
        }
      });

      this.globalPieChart.numberFormatter.numberFormat = '#,###.##';

      // Add and configure Series
      let pieSeries = this.globalPieChart.series.push(
        new am4charts.PieSeries()
      );

      pieSeries.dataFields.value = 'amount';
      pieSeries.dataFields.category = 'name';
      pieSeries.slices.template.strokeWidth = 2;
      pieSeries.slices.template.strokeOpacity = 1;
      pieSeries.labels.template.fill = am4core.color('#ffc000');
      pieSeries.labels.template.fontSize = 10;
      pieSeries.slices.template.propertyFields.fill = 'color';
      // This creates initial animation
      pieSeries.ticks.template.disabled = false;
      pieSeries.ticks.template.fill = am4core.color('#ffc000');
      pieSeries.ticks.template.stroke = am4core.color('#ffc000');
      pieSeries.ticks.template.strokeWidth = 2;
      pieSeries.labels.template.text = '{value.percent}%';
      pieSeries.labels.template.fontSize = 12;
      pieSeries.slices.template.tooltipText = `{name} : {value} ${this.selectedPEVCCurrency} Million`;
      pieSeries.tooltip.label.fontSize = 14;
      pieSeries.colors.list = [
        am4core.color('rgb(68, 114, 196)'),
        am4core.color('rgb(237, 125, 49)'),
        am4core.color('rgb(255, 192, 0)'),
        am4core.color('rgb(91, 155, 213)'),
        am4core.color('rgb(23, 145, 114)'),
        am4core.color('rgb(255, 199, 95)'),
        am4core.color('rgb(255, 150, 113)'),
        am4core.color('#67b7dc'),
        am4core.color('#dc67ab'),
        am4core.color('#a367dc'),
        am4core.color('#8067dc'),
      ];

      let slice = pieSeries.slices.template;
      slice.states.getKey('hover').properties.scale = 1;
      slice.states.getKey('active').properties.shiftRadius = 0;

      if (this.sectorIndvidualSelected) {
        let grouper = pieSeries.plugins.push(
          new am4plugins_sliceGrouper.SliceGrouper()
        );
        grouper.threshold = 3;
        // grouper.limit = 6;
        grouper.groupName = 'Other';
        grouper.clickBehavior = 'none';

        pieSeries.slices.template.events.on('hit', (ev: any) => {
          if (ev.target._dataItem.properties.category === 'Other') {
            this.chartModalTitle = 'Global';
            this.openOtherChartModal = true;
            // this.globalOtherSliceClicked = false;

            this.fundingSectorChartOtherData =
              this.fundingSectorChartData2.slice(
                grouper.bigSlices.length,
                this.fundingSectorChartData2.length - 1
              );
          }
        });
      }
    }, 1);
  }

  transactionChart() {
    setTimeout(() => {
      this.chart = am4core.create('transaction-bar-chart', am4charts.XYChart);
      // $(document).ready(function () {
      //   $('g[aria-labelledby]').hide();
      // });
      am4core.options.commercialLicense = true;

      this.chart.data = this.barChartData;

      this.chart.events.on('beforedatavalidated', (ev: any) => {
        // check if there's data
        if (ev.target.data.length === 0 && this.chartDataAvailableMNA) {
          let indicator = this.chart.tooltipContainer.createChild(
            am4core.Container
          );
          let indicatorLabel = indicator.createChild(am4core.Label);
          indicatorLabel.text = `No M&A Transaction in ${this.periodValueMNA}`;
          indicatorLabel.isMeasured = false;
          indicatorLabel.x = 170;
          indicatorLabel.y = 230;
          indicatorLabel.fontSize = 13;
          indicatorLabel.fill = am4core.color('#fff');
        }
      });

      // // Create axes
      let categoryAxis = this.chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = 'entity';
      categoryAxis.renderer.minGridDistance = 30;
      categoryAxis.renderer.cellStartLocation = 0.2;
      categoryAxis.renderer.cellEndLocation = 0.8;
      categoryAxis.renderer.fontSize = 12;
      categoryAxis.renderer.width = 2;
      categoryAxis.renderer.labels.template.fill = am4core.color('#ffc000');
      categoryAxis.renderer.line.stroke = am4core.color('#ffc000');
      categoryAxis.renderer.line.strokeWidth = 2;
      categoryAxis.renderer.line.strokeOpacity = 1;
      categoryAxis.renderer.labels.template.tooltipText = '{entity}';
      categoryAxis.tooltip.label.fontSize = 14;

      let label = categoryAxis.renderer.labels.template;
      label.truncate = true;
      label.maxWidth = 80;

      categoryAxis.events.on('sizechanged', function (ev: any) {
        let axis = ev.target;
        let cellWidth = axis.pixelWidth / (axis.endIndex - axis.startIndex);
        if (cellWidth < axis.renderer.labels.template.maxWidth) {
          axis.renderer.labels.template.rotation = -45;
          axis.renderer.labels.template.horizontalCenter = 'right';
          axis.renderer.labels.template.verticalCenter = 'middle';
        } else {
          axis.renderer.labels.template.rotation = 0;
          axis.renderer.labels.template.horizontalCenter = 'middle';
          axis.renderer.labels.template.verticalCenter = 'top';
        }
      });

      // First value axis
      let valueAxis = this.chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.title.text = `Total Value (${this.selectedCurrency} M)`;
      valueAxis.title.fill = '#ffc000';
      valueAxis.title.fontSize = 12;
      valueAxis.renderer.line.stroke = am4core.color('#ffc000');
      valueAxis.renderer.line.strokeWidth = 2;
      valueAxis.renderer.line.strokeOpacity = 1;
      valueAxis.renderer.labels.template.fill = am4core.color('#ffc000');
      valueAxis.renderer.labels.template.fontSize = 12;

      // Second value axis
      let valueAxis2 = this.chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis2.title.text = 'No. of Tansactions';
      valueAxis2.title.fill = 'rgb(82, 141, 195)';
      valueAxis2.title.fontSize = 12;
      valueAxis2.renderer.opposite = true;
      valueAxis2.title.rotation = 270;
      valueAxis2.renderer.line.stroke = am4core.color('#ffc000');
      valueAxis2.renderer.line.strokeWidth = 2;
      valueAxis2.renderer.line.strokeOpacity = 1;
      valueAxis2.renderer.labels.template.fill = am4core.color('#ffc000');
      valueAxis2.renderer.labels.template.fontSize = 12;

      // Create series
      let createSeriesThis = this;
      function createSeries(field: string) {
        let series = createSeriesThis.chart.series.push(
          new am4charts.ColumnSeries()
        );
        series.dataFields.valueY = field;
        series.dataFields.categoryX = 'entity';
        series.columns.template.tooltipText = '{entity}: [bold]{valueY}[/]';
        series.tooltip.label.fontSize = 14;
        series.columns.template.height = am4core.percent(100);
        series.columns.template.width = am4core.percent(100);
        series.sequencedInterpolation = true;
        series.fill = am4core.color('#ffc000');
      }

      // Create series 2
      function createSeries2(field: string) {
        let series = createSeriesThis.chart.series.push(
          new am4charts.ColumnSeries()
        );
        series.dataFields.valueY = field;
        series.dataFields.categoryX = 'entity';
        series.columns.template.tooltipText = '{entity}: [bold]{valueY}[/]';
        series.tooltip.label.fontSize = 14;
        series.columns.template.height = am4core.percent(100);
        series.columns.template.width = am4core.percent(100);
        series.sequencedInterpolation = true;
        series.fill = am4core.color('rgb(82, 141, 195)');
        series.yAxis = valueAxis2;
      }

      createSeries('total_value');
      createSeries2('no_of_transactions');
    }, 1);
  }
  localPieChartDataBigSlices: any;
  fundsChart() {
    setTimeout(() => {
      this.localPieChart = am4core.create(
        'fundsPieChartDiv',
        am4charts.PieChart
      );
      // $(document).ready(function () {
      //   $('g[aria-labelledby]').hide();
      // });
      am4core.options.commercialLicense = true;

      this.localPieChartData = this.localPieChartData.filter(
        (el: any) => el.amount !== undefined
      );

      this.localPieChart.data = this.localPieChartData;

      this.localPieChart.events.on('beforedatavalidated', (ev: any) => {
        // check if there's data
        if (ev.target.data.length === 0 && this.chartDataAvailableLocalPEVC) {
          let indicator = this.localPieChart.tooltipContainer.createChild(
            am4core.Container
          );
          let indicatorLabel = indicator.createChild(am4core.Label);
          indicatorLabel.text = 'No Data Available';
          indicatorLabel.isMeasured = false;
          indicatorLabel.x = 160;
          indicatorLabel.y = 110;
          indicatorLabel.fontSize = 14;
          indicatorLabel.fill = am4core.color('#ffc000');
        }
      });

      this.localPieChart.numberFormatter.numberFormat = '#,###.##';

      // Add and configure Series
      let pieSeries = this.localPieChart.series.push(new am4charts.PieSeries());
      pieSeries.dataFields.id = 'code';
      pieSeries.dataFields.value = 'amount';
      pieSeries.dataFields.category = 'sector';
      pieSeries.slices.template.strokeWidth = 2;
      pieSeries.slices.template.strokeOpacity = 1;
      pieSeries.labels.template.fill = am4core.color('#ffc000');
      pieSeries.labels.template.fontSize = 10;
      pieSeries.labels.template.paddingTop = 0;
      pieSeries.labels.template.paddingBottom = 0;
      pieSeries.slices.template.propertyFields.fill = 'color';
      // This creates initial animation
      pieSeries.ticks.template.disabled = false;
      pieSeries.ticks.template.fill = am4core.color('#ffc000');
      pieSeries.ticks.template.stroke = am4core.color('#ffc000');
      pieSeries.ticks.template.strokeWidth = 2;
      pieSeries.labels.template.text = '{value.percent}%';
      pieSeries.labels.template.fontSize = 12;
      pieSeries.slices.template.tooltipText = `{sector} : {value} ${this.selectedPEVCCurrency} Million`;
      pieSeries.tooltip.label.fontSize = 14;
      pieSeries.colors.list = [
        am4core.color('rgb(68, 114, 196)'),
        am4core.color('rgb(237, 125, 49)'),
        am4core.color('rgb(255, 192, 0)'),
        am4core.color('rgb(91, 155, 213)'),
        am4core.color('rgb(23, 145, 114)'),
        am4core.color('rgb(255, 199, 95)'),
        am4core.color('rgb(255, 150, 113)'),
        am4core.color('#67b7dc'),
        am4core.color('#dc67ab'),
        am4core.color('#a367dc'),
        am4core.color('#8067dc'),
      ];

      pieSeries.slices.template.events.on('hit', (ev: any) => {
        if (ev.target._dataItem.properties.category !== 'Other') {
          this.chartModalTitle = this.selectedPEVCCountry;
          this.openChartModal = true;
          this.count_res = 0;
          this.total_count_res = 1;
          this.util.loaderService.display(true);

          this.getCountryFundingSectorChart(ev.target.dataItem.id);
        } else if (ev.target._dataItem.properties.category === 'Other') {
          this.chartModalTitle = this.selectedPEVCCountry;
          this.openOtherChartModal = true;
          this.globalOtherSliceClicked = false;

          this.fundingSectorChartOtherData = this.localPieChartData.slice(
            this.localPieChartDataBigSlices,
            this.localPieChartData.length - 1
          );
        }
      });

      let slice = pieSeries.slices.template;
      slice.states.getKey('hover').properties.scale = 1;
      slice.states.getKey('active').properties.shiftRadius = 0;

      let grouper = pieSeries.plugins.push(
        new am4plugins_sliceGrouper.SliceGrouper()
      );
      // grouper.threshold = 3;
      grouper.limit = 6;
      grouper.groupName = 'Other';
      grouper.clickBehavior = 'none';
      setTimeout(() => {
        this.localPieChartDataBigSlices = grouper.bigSlices.length;
      }, 1000);
    }, 1);
  }

  fundsCountryChart() {
    setTimeout(() => {
      this.localPieChartCountry = am4core.create(
        'fundsCountryPieChartDiv',
        am4charts.PieChart
      );
      // $(document).ready(function () {
      //   $('g[aria-labelledby]').hide();
      // });
      am4core.options.commercialLicense = true;

      this.localPieChartCountry.data = this.localPieChartCountryData;

      this.localPieChartCountry.events.on('beforedatavalidated', (ev: any) => {
        // check if there's data
        if (
          ev.target.data.length === 0 &&
          this.chartDataAvailableLocalCountryPEVC
        ) {
          let indicator =
            this.localPieChartCountry.tooltipContainer.createChild(
              am4core.Container
            );
          let indicatorLabel = indicator.createChild(am4core.Label);
          indicatorLabel.text = 'No Data Available';
          indicatorLabel.isMeasured = false;
          indicatorLabel.x = 160;
          indicatorLabel.y = 110;
          indicatorLabel.fontSize = 14;
          indicatorLabel.fill = am4core.color('#ffc000');
        }
      });

      this.localPieChartCountry.numberFormatter.numberFormat = '#,###.##';

      // Add and configure Series
      let pieSeries = this.localPieChartCountry.series.push(
        new am4charts.PieSeries()
      );
      pieSeries.dataFields.id = 'code';
      pieSeries.dataFields.value = 'amount';
      pieSeries.dataFields.category = 'country';
      pieSeries.slices.template.strokeWidth = 2;
      pieSeries.slices.template.strokeOpacity = 1;
      pieSeries.labels.template.fill = am4core.color('#ffc000');
      pieSeries.labels.template.fontSize = 10;
      pieSeries.slices.template.propertyFields.fill = 'color';
      // This creates initial animation
      pieSeries.ticks.template.disabled = false;
      pieSeries.ticks.template.fill = am4core.color('#ffc000');
      pieSeries.ticks.template.stroke = am4core.color('#ffc000');
      pieSeries.ticks.template.strokeWidth = 2;
      pieSeries.labels.template.text = '{value.percent}%';
      pieSeries.labels.template.fontSize = 12;
      pieSeries.slices.template.tooltipText = `{country} : {value} ${this.selectedPEVCCurrency} Million`;
      pieSeries.tooltip.label.fontSize = 14;
      pieSeries.colors.list = [
        am4core.color('rgb(68, 114, 196)'),
        am4core.color('rgb(237, 125, 49)'),
        am4core.color('rgb(255, 192, 0)'),
        am4core.color('rgb(91, 155, 213)'),
        am4core.color('rgb(23, 145, 114)'),
        am4core.color('rgb(255, 199, 95)'),
        am4core.color('rgb(255, 150, 113)'),
        am4core.color('#67b7dc'),
        am4core.color('#dc67ab'),
        am4core.color('#a367dc'),
        am4core.color('#8067dc'),
      ];

      let slice = pieSeries.slices.template;
      slice.states.getKey('hover').properties.scale = 1;
      slice.states.getKey('active').properties.shiftRadius = 0;

      let grouper = pieSeries.plugins.push(
        new am4plugins_sliceGrouper.SliceGrouper()
      );
      grouper.threshold = 3;
      grouper.groupName = 'Other';
      grouper.clickBehavior = 'none';
    }, 1);
  }
  // IPO
  api_type: any;
  download_type: any;
  handleIPOExpandClick(params: any, e: any) {
    if (params === 'upcoming-ipo-list') {
      this.api_type = 'upcoming-ipo';
      this.download_type = 'filtered-upcoming-sheet';
      // console.log('in', this.api_type);
    } else if (params === 'open-for-subscription-ipo-list') {
      this.api_type = 'open-for-subscription-ipo';
      this.download_type = 'filtered-open-for-subscription-sheet';
    } else if (params === 'historical-ipo-list') {
      this.api_type = 'historical-ipo';
      this.download_type = 'filtered-historical-sheet';
    }
    // this.count_res = 0;
    // this.total_count_res = 1;
    // this.util.loaderService.display(true);

    this.modalTypeIPO =
      e.target.parentElement.parentElement.parentElement.parentElement.parentElement.previousSibling.firstChild.innerText;
  }

  globalPieChartDataBigSlices: any;
  GlobalFundsChart() {
    setTimeout(() => {
      this.globalPieChart = am4core.create(
        'globalFundsPieChartDiv',
        am4charts.PieChart
      );
      // $(document).ready(function () {
      //   $('g[aria-labelledby]').hide();
      // });
      am4core.options.commercialLicense = true;

      this.globalPieChart.data = this.globalPieChartData;

      this.globalPieChart.events.on('beforedatavalidated', (ev: any) => {
        // check if there's data
        if (ev.target.data.length === 0 && this.chartDataAvailableGlobalPEVC) {
          let indicator = this.globalPieChart.tooltipContainer.createChild(
            am4core.Container
          );
          let indicatorLabel = indicator.createChild(am4core.Label);
          indicatorLabel.text = 'No Data Available';
          indicatorLabel.isMeasured = false;
          indicatorLabel.x = 660;
          indicatorLabel.y = 110;
          indicatorLabel.fontSize = 14;
          indicatorLabel.fill = am4core.color('#ffc000');
        }
      });

      this.globalPieChart.numberFormatter.numberFormat = '#,###.##';

      // Add and configure Series
      let pieSeries = this.globalPieChart.series.push(
        new am4charts.PieSeries()
      );
      pieSeries.dataFields.id = 'code';
      pieSeries.dataFields.value = 'amount';
      pieSeries.dataFields.category = 'sector';
      pieSeries.slices.template.strokeWidth = 2;
      pieSeries.slices.template.strokeOpacity = 1;
      pieSeries.labels.template.fill = am4core.color('#ffc000');
      pieSeries.labels.template.fontSize = 10;
      pieSeries.slices.template.propertyFields.fill = 'color';
      // This creates initial animation
      pieSeries.ticks.template.disabled = false;
      pieSeries.ticks.template.fill = am4core.color('#ffc000');
      pieSeries.ticks.template.stroke = am4core.color('#ffc000');
      pieSeries.ticks.template.strokeWidth = 2;
      pieSeries.labels.template.text = '{value.percent}%';
      pieSeries.labels.template.fontSize = 12;
      pieSeries.slices.template.tooltipText = `{sector} : {value} ${this.selectedPEVCCurrency} Million`;
      pieSeries.tooltip.label.fontSize = 14;
      pieSeries.colors.list = [
        am4core.color('rgb(68, 114, 196)'),
        am4core.color('rgb(237, 125, 49)'),
        am4core.color('rgb(255, 192, 0)'),
        am4core.color('rgb(91, 155, 213)'),
        am4core.color('rgb(23, 145, 114)'),
        am4core.color('rgb(255, 199, 95)'),
        am4core.color('rgb(255, 150, 113)'),
        am4core.color('#67b7dc'),
        am4core.color('#dc67ab'),
        am4core.color('#a367dc'),
        am4core.color('#8067dc'),
      ];

      pieSeries.slices.template.events.on('hit', (ev: any) => {
        if (ev.target._dataItem.properties.category !== 'Other') {
          this.chartModalTitle = 'Global';
          this.openChartModal = true;
          this.count_res = 0;
          this.total_count_res = 1;
          this.util.loaderService.display(true);

          this.getGlobalFundingSectorChart(ev.target.dataItem.id);
        } else if (ev.target._dataItem.properties.category === 'Other') {
          this.chartModalTitle = 'Global';
          this.openOtherChartModal = true;
          this.globalOtherSliceClicked = true;

          this.fundingSectorChartOtherData = this.globalPieChartData.slice(
            this.globalPieChartDataBigSlices,
            this.globalPieChartData.length - 1
          );
        }
      });

      let slice = pieSeries.slices.template;
      slice.states.getKey('hover').properties.scale = 1;
      slice.states.getKey('active').properties.shiftRadius = 0;

      let grouper = pieSeries.plugins.push(
        new am4plugins_sliceGrouper.SliceGrouper()
      );
      // grouper.threshold = 3;
      grouper.limit = 6;
      grouper.groupName = 'Other';
      grouper.clickBehavior = 'none';
      setTimeout(() => {
        this.globalPieChartDataBigSlices = grouper.bigSlices.length;
      }, 1000);
    }, 1);
  }

  pieChartData: any = {};
  pieChartDataArray: any = [];
  industrChart: any;
  chartLevel: any = 0;
  fundsChartIPO() {
    // this.pieChartData = {};

    // this.fundsIPOPieChartData = [];
    am4core.options.autoDispose = true;
    setTimeout(() => {
      this.fundsIPOPieChart = am4core.create(
        'fundingSectorPieChart',
        am4charts.PieChart
      );

      am4core.options.commercialLicense = true;

      // this.fundsIPOPieChart.numberFormatter.numberFormat = '#.##';

      this.fundsIPOPieChart.data = this.pieChartDataArray;
      // console.log(this.pieChartDataArray);

      // Add and configure Series
      let pieSeries = this.fundsIPOPieChart.series.push(
        new am4charts.PieSeries()
      );
      pieSeries.dataFields.value = 'amount';
      pieSeries.dataFields.category = 'sector';
      pieSeries.slices.template.strokeWidth = 2;
      pieSeries.slices.template.strokeOpacity = 1;
      pieSeries.labels.template.fill = am4core.color('#ffc000');
      pieSeries.labels.template.fontSize = 10;
      pieSeries.slices.template.propertyFields.fill = 'color';
      // This creates initial animation
      pieSeries.ticks.template.disabled = false;
      pieSeries.ticks.template.fill = am4core.color('#ffc000');
      pieSeries.ticks.template.stroke = am4core.color('#ffc000');
      pieSeries.ticks.template.strokeWidth = 2;
      pieSeries.labels.template.text = '{value.percent}%';
      pieSeries.labels.template.fontSize = 12;
      pieSeries.slices.template.tooltipText = '{sector}:{value} USD Million';
      pieSeries.tooltip.label.fontSize = 14;
      pieSeries.slices.template.events.on('hit', (ev: any) => {
        if (
          ev.target._dataItem.properties.category !== 'Other' &&
          this.chartLevel < 1
        ) {
          this.chartModalTitle = this.selectedPEVCCountry;
          this.industrChart = ev.target._dataItem.properties.category;
          var data = this.pieChartDataArray.filter((data: any) => {
            return data?.sector == this.industrChart;
          });
          this.count_res = 0;
          this.total_count_res = 1;
          this.util.loaderService.display(true);
          this.financialMarketData
            .getIndustryChart(data[0]?.sector_code)
            .subscribe((res) => {
              ++this.count_res;
              ++this.chartLevel;
              this.util.checkCountValue(this.total_count_res, this.count_res);
              this.onIndustryChartDataClicked(res);
            });
          //   this.openChartModal = true;
          //   this.count_res = 0;
          //   this.total_count_res = 1;
          //   this.util.loaderService.display(true);
          //   this.getCountryFundingSectorChart(ev.target.dataItem.id);
          // } else if (ev.target._dataItem.properties.category === 'Other') {
          //   this.chartModalTitle = this.selectedPEVCCountry;
          //   this.openOtherChartModal = true;
          //   this.globalOtherSliceClicked = false;
          //   this.fundingSectorChartOtherData = this.localPieChartData.slice(
          //     6,
          //     this.localPieChartData.length - 1
          //   );
          // }
          // });
          // pieSeries.slices.template.events.on('hit', (ev: any) => {
          //   if (ev.target._dataItem.properties.category !== 'Other') {
          //     this.chartModalTitle = this.selectedPEVCCountry;
          //     this.openChartModal = true;
          //     this.count_res = 0;
          //     this.total_count_res = 1;
          //     this.util.loaderService.display(true);

          //     this.getCountryFundingSectorChart(ev.target.dataItem.id);
        }
      });

      let slice = pieSeries.slices.template;
      slice.states.getKey('hover').properties.scale = 1;
      slice.states.getKey('active').properties.shiftRadius = 0;

      let grouper = pieSeries.plugins.push(
        new am4plugins_sliceGrouper.SliceGrouper()
      );
      grouper.threshold = 3;
      grouper.groupName = 'Other';
      grouper.clickBehavior = 'zoom';
    }, 1000);
  }

  upcommingDataLength: any;
  openSubsDataLength: any;
  historicalDataLength: any;
  getAllIpoData(e: any) {
    this.financialMarketData.getExpandedSectionData(e).subscribe(
      (res: any) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);
        res[0].data.forEach((ele: any) => {
          if (e === 'upcoming-ipo-list/1/10') {
            if (this.upcoming_ipo_table_data.value.length < 5) {
              this.upcoming_ipo_table_data.value.push({
                companyName: ele.issuer_name,
                country: ele.cntry_inc === null ? '-' : ele.cntry_inc,
                exchange: ele.mic === 'null' ? '-' : ele.mic,
                issueOpenDate:
                  ele.sub_period_from == null ? '-' : ele.sub_period_from,
                currency: ele.currency == 'null' ? '-' : ele.currency,
                offerSize:
                  ele.total_offer_size == 'null'
                    ? '-'
                    : this.util.standardformatCustom(
                        ele.total_offer_size,
                        2,
                        ''
                      ),
              });
            }

            this.upcoming_ipo_modal_table_data.value.push({
              compId: ele.id,
              status: ele.status,
              companyName: ele.issuer_name,
              country: ele.cntry_inc === null ? '-' : ele.cntry_inc,
              exchange: ele.mic === 'null' ? '-' : ele.mic,
              issueOpenDate:
                ele.sub_period_from == null ? '-' : ele.sub_period_from,
              securityType:
                ele.sec_description === 'null' ? '-' : ele.sec_description,
              currency: ele.currency == 'null' ? '-' : ele.currency,
              offerSize:
                ele.total_offer_size == 'null'
                  ? '-'
                  : this.util.standardformatCustom(ele.total_offer_size, 2, ''),
              proposedPrice:
                ele.proposed_price == 'null' ? '-' : ele.proposed_price,
              ipoPriceChange:
                ele.share_price_lowest == ele.share_price_highest
                  ? ele.share_price_highest == null
                    ? '-'
                    : ele.share_price_highest
                  : ele.share_price_lowest !== null
                  ? ele.share_price_lowest
                  : ele.share_price_highest !== null
                  ? ele.share_price_highest
                  : `${
                      ele.share_price_lowest !== null &&
                      ele.share_price_lowest !== ele.share_price_highest &&
                      ele.share_price_lowest
                    } - ${
                      ele.share_price_highest !== null &&
                      ele.share_price_highest !== ele.share_price_lowest &&
                      ele.share_price_highest
                    }`,
              rumoured: ele.status == 'Rumour' ? true : false,
              icon: true,
              notes: ele.notes,
            });
            this.upcommingDataLength = res[0].data_length;
          }

          if (e === 'historical-ipo-list/1/10') {
            if (this.historical_ipo_table_data.value.length < 5) {
              this.historical_ipo_table_data.value.push({
                compId: ele.id,
                companyName: ele.issuer_name,
                country: ele.cntry_inc === null ? '-' : ele.cntry_inc,
                exchange: ele.mic === 'null' ? '-' : ele.mic,
                listingDate:
                  ele.first_trading_date == null ? '-' : ele.first_trading_date,
                issueOpenDate: ele.sub_period_from ? ele.sub_period_from : '-',
                currency: ele.currency == 'null' ? '-' : ele.currency,
                offerSize:
                  ele.total_offer_size == 'null'
                    ? '-'
                    : this.util.standardformatCustom(
                        ele.total_offer_size,
                        2,
                        ''
                      ),
              });
            }

            this.historical_ipo_modal_table_data.value.push({
              compId: ele.id,
              companyName: ele.issuer_name,
              country: ele.cntry_inc === null ? '-' : ele.cntry_inc,
              exchange: ele.mic === 'null' ? '-' : ele.mic,
              listingDate:
                ele.first_trading_date == null ? '-' : ele.first_trading_date,
              issueOpenDate: ele.sub_period_from ? ele.sub_period_from : '-',
              currency: ele.currency == 'null' ? '-' : ele.currency,
              securityType:
                ele.sec_description === 'null' ? '-' : ele.sec_description,
              offerSize:
                ele.total_offer_size == 'null'
                  ? '-'
                  : this.util.standardformatCustom(ele.total_offer_size, 2, ''),
              issuePrice:
                ele.proposed_price === 'null' ? '-' : ele.proposed_price,
              icon: true,
              notes: ele.notes,
              listingDayReturn:
                ele.listing_day_return == 'null'
                  ? '-'
                  : this.util.standardformatCustom(
                      ele.listing_day_return,
                      2,
                      ''
                    ),
              // priceReturn: '',
            });
            this.historicalDataLength = res[0].data_length;
          }
          if (e === 'open-for-subscription-ipo-list/1/10') {
            if (this.subscription_ipo_table_data.value.length < 5) {
              this.subscription_ipo_table_data.value.push({
                companyName: ele.issuer_name,
                country: ele.cntry_inc === null ? '-' : ele.cntry_inc,
                exchange: ele.mic === 'null' ? '-' : ele.mic,
                issueCloseDate: ele.sub_period_to ? ele.sub_period_to : '-',
                currency: ele.currency == 'null' ? '-' : ele.currency,
                offerSize:
                  ele.total_offer_size == 'null'
                    ? '-'
                    : this.util.standardformatCustom(
                        ele.total_offer_size,
                        2,
                        ''
                      ),
              });
            }

            this.subscription_ipo_modal_table_data.value.push({
              companyName: ele.issuer_name,
              country: ele.cntry_inc === null ? '-' : ele.cntry_inc,
              exchange: ele.mic === 'null' ? '-' : ele.mic,
              issueCloseDate: ele.sub_period_to ? ele.sub_period_to : '-',
              issueOpenDate: ele.sub_period_from ? ele.sub_period_from : '-',
              currency: ele.currency == 'null' ? '-' : ele.currency,
              securityType:
                ele.sec_description === 'null' ? '-' : ele.sec_description,
              offerSize:
                ele.total_offer_size == 'null'
                  ? '-'
                  : this.util.standardformatCustom(ele.total_offer_size, 2, ''),
              proposedPrice:
                ele.proposed_price == 'null' ? '-' : ele.proposed_price,
              ipoPriceChange:
                ele.share_price_lowest == ele.share_price_highest
                  ? ele.share_price_highest == null
                    ? '-'
                    : ele.share_price_highest
                  : ele.share_price_lowest !== null
                  ? ele.share_price_lowest
                  : ele.share_price_highest !== null
                  ? ele.share_price_highest
                  : `${
                      ele.share_price_lowest !== null &&
                      ele.share_price_lowest !== ele.share_price_highest &&
                      ele.share_price_lowest
                    } - ${
                      ele.share_price_highest !== null &&
                      ele.share_price_highest !== ele.share_price_lowest &&
                      ele.share_price_highest
                    }`,
              icon: true,
              notes: ele.notes,
            });
            this.openSubsDataLength = res[0].data_length;
          }
        });
      },
      (err) => {
        console.log('err', err.message);
      }
    );
  }
  pieChartPeriodData: any;
  selectedPeriodData: any = '';
  getPeriodsData() {
    this.pieChartPeriodData = [];
    var data: any = [];
    this.financialMarketData.getIpoPageData('periods').subscribe((res) => {
      ++this.count_res;
      this.util.checkCountValue(this.total_count_res, this.count_res);
      res.forEach((element: any) => {
        data.push({
          id: element.timePeriod,
          text: element.timePeriod,
        });
      });
      this.pieChartPeriodData = data;
    });
  }
  advisorList: any;
  getAdvisorList() {
    this.financialMarketData.getIpoPageData('advisor-list').subscribe((res) => {
      ++this.count_res;
      this.util.checkCountValue(this.total_count_res, this.count_res);
      var data: any = [];
      res.forEach((element: any) => {
        data.push({
          id: element,
          text: element,
        });
      });
      this.advisorList = data;
    });
  }

  ipoSelectedCountry: any = '';
  ipoSelectedCurrency: any = '';
  ipoSelectedCompany: any = '';
  selectedCountryStringIPO: any = '';
  ipoGlobalListLength: any = 0;
  Iposelection: any = {};

  onValueChangedIpo(id: any, e: any) {
    if (id === 'country') {
      if (id && this.ipoGlobalListLength !== e.length) {
        this.ipoGlobalListLength = e.length;
        this.selectedCountryStringIPO = e.toString();
        if (this.selectedCountryStringIPO !== '') {
          // loginc to clear selection
          // console.log('3483----');
          this.count_res = 0;
          this.total_count_res = 3;
          this.util.loaderService.display(true);
          this.Iposelection.cntry_inc = e;
          if (this.ipoGlobalListLength == 0) {
            this.clearSelection();
          } else {
            this.getFilteredIpoData();
          }
        } else {
          this.clearSelection();
        }
      }
    } else if (id === 'currency') {
      if (this.ipoSelectedCurrency !== e) {
        // this.ipoSelectedCurrency = e.toString();

        this.count_res = 0;
        this.total_count_res = 3;
        this.util.loaderService.display(true);
        this.ipoSelectedCurrency = e;
        this.Iposelection.currency = [e];
        this.getFilteredIpoData();
      }
    } else if (id === 'company') {
      if (this.ipoSelectedCompany !== e) {
        this.ipoSelectedCompany = e;
      }
    }
  }
  industrisDataIPo: any;
  getIndustryList() {
    var foramttedData: any = [];

    this.financialMarketData.getIpoIndustries().subscribe((res: any) => {
      res.forEach((element: any) => {
        foramttedData.push({
          id: element.industry_name,
          text: element.industry_name,
        });

        this.industrisDataIPo = foramttedData;
      });
    });
  }
  getFilteredIpoData() {
    ['upcoming-ipo', 'open-for-subscription-ipo', 'historical-ipo'].map(
      (params) => {
        this.financialMarketData
          .getFilteredIpos(
            params, // api type
            '1',
            this.Iposelection
          )
          .subscribe((res: any) => {
            ++this.count_res;
            this.util.checkCountValue(this.total_count_res, this.count_res);
            // res[0].data?.forEach((ele: any) => {
            if (params === 'upcoming-ipo') {
              this.upcoming_ipo_table_data.value = [];
              this.upcoming_ipo_modal_table_data.value = [];

              res[0].data?.forEach((ele: any) => {
                if (this.upcoming_ipo_table_data.value.length < 5) {
                  this.upcoming_ipo_table_data.value.push({
                    companyName: ele.issuer_name,
                    country: ele.cntry_inc === 'null' ? '-' : ele.cntry_inc,
                    exchange: ele.mic === 'null' ? '-' : ele.mic,
                    issueOpenDate:
                      ele.sub_period_from == null ? '-' : ele.sub_period_from,
                    currency: ele.currency,
                    offerSize:
                      ele.total_offer_size == 'null'
                        ? '-'
                        : this.util.standardformatCustom(
                            ele.total_offer_size,
                            2,
                            ''
                          ),
                  });
                }
                this.upcoming_ipo_modal_table_data.value.push({
                  compId: ele.id,
                  status: ele.status,
                  companyName: ele.issuer_name,
                  country: ele.cntry_inc === null ? '-' : ele.cntry_inc,
                  exchange: ele.mic === 'null' ? '-' : ele.mic,
                  issueOpenDate:
                    ele.sub_period_from == null ? '-' : ele.sub_period_from,
                  securityType:
                    ele.sec_description === 'null' ? '-' : ele.sec_description,
                  currency: ele.currency == 'null' ? '-' : ele.currency,
                  offerSize:
                    ele.total_offer_size == 'null'
                      ? '-'
                      : this.util.standardformatCustom(
                          ele.total_offer_size,
                          2,
                          ''
                        ),
                  proposedPrice:
                    ele.proposed_price == 'null' ? '-' : ele.proposed_price,
                  ipoPriceChange:
                    ele.share_price_lowest == ele.share_price_highest
                      ? ele.share_price_highest == null
                        ? '-'
                        : ele.share_price_highest
                      : ele.share_price_lowest !== null
                      ? ele.share_price_lowest
                      : ele.share_price_highest !== null
                      ? ele.share_price_highest
                      : `${
                          ele.share_price_lowest !== null &&
                          ele.share_price_lowest !== ele.share_price_highest &&
                          ele.share_price_lowest
                        } - ${
                          ele.share_price_highest !== null &&
                          ele.share_price_highest !== ele.share_price_lowest &&
                          ele.share_price_highest
                        }`,
                  rumoured: ele.status == 'Rumour' ? true : false,
                  icon: true,
                  notes: ele.notes,
                });
              });
              this.upcommingDataLength = res[0].data_length;
            } else if (params === 'historical-ipo') {
              this.historical_ipo_table_data.value = [];
              this.historical_ipo_modal_table_data.value = [];

              res[0].data?.forEach((ele: any) => {
                if (this.historical_ipo_table_data.value.length < 5) {
                  this.historical_ipo_table_data.value.push({
                    companyName: ele.issuer_name,
                    country: ele.cntry_inc === 'null' ? '-' : ele.cntry_inc,
                    exchange: ele.mic === 'null' ? '-' : ele.mic,
                    issueOpenDate:
                      ele.sub_period_from == 'null' ? '-' : ele.sub_period_from,
                    currency: ele.currency,
                    offerSize:
                      ele.total_offer_size == 'null'
                        ? '-'
                        : this.util.standardformatCustom(
                            ele.total_offer_size,
                            2,
                            ''
                          ),
                  });
                }
                this.historical_ipo_modal_table_data.value.push({
                  companyName: ele.issuer_name,
                  country: ele.cntry_inc === null ? '-' : ele.cntry_inc,
                  exchange: ele.mic === 'null' ? '-' : ele.mic,
                  listingDate:
                    ele.first_trading_date == null
                      ? '-'
                      : ele.first_trading_date,
                  issueOpenDate: ele.sub_period_from
                    ? ele.sub_period_from
                    : '-',
                  currency: ele.currency == 'null' ? '-' : ele.currency,
                  securityType:
                    ele.sec_description === 'null' ? '-' : ele.sec_description,
                  offerSize:
                    ele.total_offer_size == 'null'
                      ? '-'
                      : this.util.standardformatCustom(
                          ele.total_offer_size,
                          2,
                          ''
                        ),
                  issuePrice:
                    ele.proposed_price === 'null' ? '-' : ele.proposed_price,
                  listingDayReturn:
                    ele.listing_day_return == 'null'
                      ? '-'
                      : this.util.standardformatCustom(
                          ele.listing_day_return,
                          2,
                          ''
                        ),
                  // priceReturn: '',
                });
              });
              this.historicalDataLength = res[0].data_length;
            } else if (params === 'open-for-subscription-ipo') {
              this.subscription_ipo_table_data.value = [];
              this.subscription_ipo_modal_table_data.value = [];

              res[0].data?.forEach((ele: any) => {
                if (this.subscription_ipo_table_data.value.length < 5) {
                  this.subscription_ipo_table_data.value.push({
                    companyName: ele.issuer_name,
                    country: ele.cntry_inc === 'null' ? '-' : ele.cntry_inc,
                    exchange: ele.mic === 'null' ? '-' : ele.mic,
                    issueOpenDate:
                      ele.sub_period_from == 'null' ? '-' : ele.sub_period_from,
                    currency: ele.currency,
                    offerSize:
                      ele.total_offer_size == 'null'
                        ? '-'
                        : this.util.standardformatCustom(
                            ele.total_offer_size,
                            2,
                            ''
                          ),
                  });
                }
                this.subscription_ipo_modal_table_data.value.push({
                  companyName: ele.issuer_name,
                  country: ele.cntry_inc === null ? '-' : ele.cntry_inc,
                  exchange: ele.mic === 'null' ? '-' : ele.mic,
                  issueCloseDate: ele.sub_period_to ? ele.sub_period_to : '-',
                  issueOpenDate: ele.sub_period_from
                    ? ele.sub_period_from
                    : '-',
                  currency: ele.currency == 'null' ? '-' : ele.currency,
                  securityType:
                    ele.sec_description === 'null' ? '-' : ele.sec_description,
                  offerSize:
                    ele.total_offer_size == 'null'
                      ? '-'
                      : this.util.standardformatCustom(
                          ele.total_offer_size,
                          2,
                          ''
                        ),
                  proposedPrice:
                    ele.proposed_price == 'null' ? '-' : ele.proposed_price,
                  ipoPriceChange:
                    ele.share_price_lowest == ele.share_price_highest
                      ? ele.share_price_highest == null
                        ? '-'
                        : ele.share_price_highest
                      : ele.share_price_lowest !== null
                      ? ele.share_price_lowest
                      : ele.share_price_highest !== null
                      ? ele.share_price_highest
                      : `${
                          ele.share_price_lowest !== null &&
                          ele.share_price_lowest !== ele.share_price_highest &&
                          ele.share_price_lowest
                        } - ${
                          ele.share_price_highest !== null &&
                          ele.share_price_highest !== ele.share_price_lowest &&
                          ele.share_price_highest
                        }`,
                  icon: true,
                  notes: ele.notes,
                });
              });
              this.openSubsDataLength = res[0].data_length;
            }
            // });
          });
      }
    );
  }

  clearSelection() {
    if (this.ipoGlobalListLength !== 0) {
      this.count_res = 0;
      this.total_count_res = 3;
      this.util.loaderService.display(true);
      this.ipoSelectedCountry = '';
      this.upcoming_ipo_table_data.value = [];
      this.ipoGlobalListLength = 0;
      this.Iposelection.cntry_inc = '';
      this.historical_ipo_table_data.value = [];
      this.subscription_ipo_table_data.value = [];
      this.upcoming_ipo_modal_table_data.value = [];
      this.historical_ipo_modal_table_data.value = [];
      this.subscription_ipo_modal_table_data.value = [];
      [
        'upcoming-ipo-list/1/10',
        'open-for-subscription-ipo-list/1/10',
        'historical-ipo-list/1/10',
      ].map((ele: any) => {
        this.getAllIpoData(ele);
      });
    }
  }
  statusList: any;
  getstatusList() {
    this.financialMarketData.getIpoPageData('status-lists').subscribe((res) => {
      ++this.count_res;
      this.util.checkCountValue(this.total_count_res, this.count_res);
      var data: any = [];
      res.forEach((element: any) => {
        data.push({
          id: element,
          text: element,
        });
      });
      this.statusList = data;
    });
  }
  onRemoveCurrency() {
    this.count_res = 0;
    this.total_count_res = 3;
    this.util.loaderService.display(true);
    this.ipoSelectedCountry = '';
    this.upcoming_ipo_table_data.value = [];
    this.ipoGlobalListLength = 0;
    this.ipoSelectedCurrency = '';
    this.historical_ipo_table_data.value = [];
    this.subscription_ipo_table_data.value = [];
    this.upcoming_ipo_modal_table_data.value = [];
    this.historical_ipo_modal_table_data.value = [];
    this.subscription_ipo_modal_table_data.value = [];
    [
      'upcoming-ipo-list/1/10',
      'open-for-subscription-ipo-list/1/10',
      'historical-ipo-list/1/10',
    ].map((ele: any) => {
      this.getAllIpoData(ele);
    });
  }
  onIpoChartDataChanged(id: any, e: any) {
    if (this.selectedPeriodData !== e && id == 'ipo-chart') {
      this.count_res = 0;
      this.total_count_res = 1;
      this.util.loaderService.display(true);
      this.selectedPeriodData = e;
      this.financialMarketData.getIpoChartData(e).subscribe(
        (res: any) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);
          this.pieChartDataArray = [];
          res.forEach((ele: any, i: any) => {
            this.pieChartData = {
              sector: ele.sector_name,
              amount: this.util.standardFormat(ele.offer_size, 2, ''),
              sector_code: ele.sector_code,
            };
            this.pieChartDataArray = [
              ...this.pieChartDataArray,
              this.pieChartData,
            ];
          });
          this.fundsChartIPO();
        },
        (err) => {
          console.error(err);
        }
      );
    }
  }
  onIndustryChartDataClicked(res: any) {
    this.pieChartDataArray = [];
    res.forEach((ele: any, i: any) => {
      this.pieChartData = {
        sector: ele.industry_name,
        amount: this.util.standardFormat(ele.offer_size, 2, ''),
      };
      this.pieChartDataArray = [...this.pieChartDataArray, this.pieChartData];
    });
    if (this.pieChartDataArray.length !== 0) {
      this.fundsChartIPO();
    }
  }
  onReturntoDefualtChart() {
    this.industrChart = null;
    this.chartLevel = 0;
    this.onIpoChartDataChanged('ipo-chart', 'Last 12 months');
    this.selectedPeriodData = '';
  }

  onDownloadExcel(id: any) {
    this.count_res = 0;
    this.total_count_res = 1;
    this.util.loaderService.display(true);

    this.financialMarketData.downloadIpoData(id).subscribe(
      (res: any) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);
        const blob = new Blob([res.body], {
          type: 'application/vnd.ms.excel',
        });
        const file = new File([blob], '' + `${id}.xlsx`, {
          type: 'application/vnd.ms.excel',
        });
        saveAs(file);
      },
      (err) => {
        console.error(err);
      }
    );
  }
}

import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FinancialMarketDataService } from 'src/app/services/financialmarketdata.service';

@Component({
  selector: 'app-advanced-search',
  templateUrl: './advanced-search.component.html',
  styleUrls: ['./advanced-search.component.scss'],
})
export class AdvancedSearchComponent implements OnInit {
  selectCountryData: any = [];
  selectedCountry: any = 'IND';
  selectIndustryData: any = [];
  selectedIndustry: any = 'All';
  selectFinTypeData: any = [];
  selectedFinType: any = 'All';
  selectAdvisorData: any = [];
  selectedAdvisor: any = '';
  selectCompanyData: any = [];
  selectedCompany: any = '';
  selectCurrencyData: any = [];
  selectedCurrency: any = 'USD';
  startDate: any = '2019-03-07';
  endDate: any = '2022-03-06';
  funds_details_table_data = {
    title: [
      {
        label: 'Company Name',
        key: 'companyName',
        shorting: true,
        color: '#fff',
      },
      {
        label: 'Country',
        key: 'countryName',
        shorting: true,
      },
      {
        label: 'Industry',
        key: 'industryName',
        shorting: true,
      },
      {
        label: 'Latest Round name',
        key: 'latestRound',
        shorting: true,
      },
      {
        label: 'Latest Round Date',
        key: 'latestRoundDate',
        shorting: true,
      },
      {
        label: 'Financing Type',
        key: 'financingType',
        shorting: true,
      },
      {
        label: 'Total Funding Amount (USD Million)',
        key: 'totalFundingAmount',
        shorting: true,
        width: '12rem',
        align: 'left',
        formattedNum: true,
      },
    ],
    value: [],
  };
  fundingDetailsData: any = [];
  pageNumbers: any;
  rowOffset: any = 0;
  rowCount: any;
  currentPage: any = 1;
  isPeriodSelected: any = false;
  periodValue: any = 'Last 3 Years';

  constructor(
    public auth: AuthService,
    private financialMarketData: FinancialMarketDataService
  ) {}

  ngOnInit(): void {
    this.getTransactionsCountryDataHandler();
    this.getTransactionsIndustryDataHandler(this.selectedCountry);
    this.getTransactionsFinTypeDataHandler();
    this.getTransactionsPEVCSearchCompanyDataHandler();
    this.getTransactionsCurrencyDataHandler();
    this.getTransactionsFundingDetailsDataHandler();
  }

  transactionsAdvancedSearchClose() {
    this.auth.openAdvancedSearch = false;
  }

  handlePagination(page: any) {
    this.currentPage = page;
    this.rowOffset = page * 10 - 10;
    this.getTransactionsFundingDetailsDataHandler();
  }

  handlePrevClick() {
    this.currentPage -= 1;
    this.rowOffset = this.currentPage * 10 - 10;
    this.getTransactionsFundingDetailsDataHandler();
  }

  handleNextClick() {
    this.currentPage += 1;
    this.rowOffset = this.currentPage * 10 - 10;
    this.getTransactionsFundingDetailsDataHandler();
  }

  handlePeriodClick() {
    if (this.isPeriodSelected === true) {
      this.isPeriodSelected = false;
    } else {
      this.isPeriodSelected = true;
    }
  }

  handleFromDatePickerChange(ev: any) {
    this.startDate = ev.target.value;
  }

  handleToDatePickerChange(ev: any) {
    this.endDate = ev.target.value;
  }

  handleGoBtn() {
    this.isPeriodSelected = false;
    this.periodValue = 'Period - Custom';

    this.getTransactionsFundingDetailsDataHandler();
  }

  handlePeriodsValues(ev: any) {
    this.periodValue = ev.target.textContent;

    switch (ev.target.textContent) {
      case 'Last 3 Months':
        this.endDate = new Date();
        this.startDate = new Date(
          this.endDate.getFullYear(),
          this.endDate.getMonth() - 3,
          this.endDate.getDate()
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
        this.getPeriodDates(10);
        break;

      case '2021':
        this.startDate = '2021-01-01';
        this.endDate = '2021-12-31';
        break;
      case '2020':
        this.startDate = '2020-01-01';
        this.endDate = '2020-12-31';
        break;
      case '2019':
        this.startDate = '2019-01-01';
        this.endDate = '2019-12-31';
        break;
      case '2018':
        this.startDate = '2018-01-01';
        this.endDate = '2018-12-31';
        break;
      case '2017':
        this.startDate = '2017-01-01';
        this.endDate = '2017-12-31';
        break;

      default:
        break;
    }
    this.isPeriodSelected = false;

    this.getTransactionsFundingDetailsDataHandler();
  }

  getTransactionsCountryDataHandler() {
    let transactionsCountryFormattedData: any = [];

    this.financialMarketData.getTransactionsPEVCCountryData().subscribe(
      (res: any) => {
        res?.forEach((element: any) => {
          transactionsCountryFormattedData.push({
            id: element.countryIsoCode3,
            text: element.countryName,
          });
        });
        this.selectCountryData = transactionsCountryFormattedData;
      },
      (err) => {
        console.log('error', err.message);
      }
    );
  }

  getTransactionsIndustryDataHandler(country: any) {
    let transactionsIndustryFormattedData: any = [];

    this.financialMarketData
      .getTransactionsPEVCIndustryData(country, this.startDate, this.endDate)
      .subscribe(
        (res: any) => {
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
          console.log('error', err.message);
        }
      );
  }

  getTransactionsFinTypeDataHandler() {
    let transactionsFinTypeFormattedData: any = [];

    this.financialMarketData.getTransactionsAdvSearchFinTypeData().subscribe(
      (res: any) => {
        res?.forEach((element: any) => {
          transactionsFinTypeFormattedData.push({
            id: element,
            text: `Financing Type - ${element}`,
          });
        });
        this.selectFinTypeData = transactionsFinTypeFormattedData;
      },
      (err) => {
        console.log('error', err.message);
      }
    );
  }

  getTransactionsPEVCSearchCompanyDataHandler() {
    let transactionsComapnyFormattedData: any = [];

    this.financialMarketData.getTransactionsPEVCSearchCompanyData().subscribe(
      (res) => {
        res?.forEach((element: any) => {
          transactionsComapnyFormattedData.push({
            id: element.factSetEntityId,
            text: element.properName,
          });
        });
        this.selectCompanyData = transactionsComapnyFormattedData;
      },
      (err) => {
        console.log('error', err.message);
      }
    );
  }

  getTransactionsCurrencyDataHandler() {
    let transactionsCurrencyFormattedData: any = [];

    this.financialMarketData.getTransactionsCurrencyData().subscribe(
      (res: any) => {
        res?.forEach((element: any) => {
          transactionsCurrencyFormattedData.push({
            id: element.isoCode,
            text: element.currencyName,
          });
        });
        this.selectCurrencyData = transactionsCurrencyFormattedData;
      },
      (err) => {
        console.log('error', err.message);
      }
    );
  }

  getTransactionsFundingDetailsDataHandler() {
    this.financialMarketData
      .getTransactionsFundingDetailsData(
        this.selectedCountry,
        this.selectedIndustry,
        this.startDate,
        this.endDate,
        this.selectedCurrency,
        this.selectedFinType
      )
      .subscribe(
        (res) => {
          this.fundingDetailsData = res;

          this.funds_details_table_data = {
            ...this.funds_details_table_data,
            value: res.pevcFundingList,
          };
          this.pageNumbers = Array(
            Math.ceil(this.fundingDetailsData.totalCount / 10)
          )
            .fill(0)
            .map((x, i) => i + 1);
        },
        (err) => {
          console.log('error', err.message);
        }
      );
  }

  getTransactionsFundingDetailsCompanySearchDataHandler() {
    this.financialMarketData
      .getTransactionsFundingDetailsCompanySearchData(
        this.selectedCountry,
        this.selectedIndustry,
        this.startDate,
        this.endDate,
        this.selectedCurrency,
        this.selectedFinType,
        this.selectedCompany,
        this.rowOffset
      )
      .subscribe(
        (res) => {
          this.fundingDetailsData = res;

          this.funds_details_table_data = {
            ...this.funds_details_table_data,
            value: res.pevcFundingList,
          };
          this.pageNumbers = Array(
            Math.ceil(this.fundingDetailsData.totalCount / 10)
          )
            .fill(0)
            .map((x, i) => i + 1);
        },
        (err) => {
          console.log('error', err.message);
        }
      );
  }

  valueChangedHandler(type: any, data: any) {
    if (type === 'Country') {
      if (this.selectCountryData && this.selectedCountry !== data) {
        this.selectedCountry = data;
        this.getTransactionsFundingDetailsDataHandler();
      }
    } else if (type === 'Industry') {
      if (this.selectIndustryData && this.selectedIndustry !== data) {
        this.selectedIndustry = data;
        this.getTransactionsFundingDetailsDataHandler();
      }
    } else if (type === 'Financing Type') {
      if (this.selectFinTypeData && this.selectedFinType !== data) {
        this.selectedFinType = data;
        this.getTransactionsFundingDetailsDataHandler();
      }
    } else if (type === 'Company') {
      if (this.selectCompanyData && this.selectedCompany !== data) {
        this.selectedCompany = data;
        this.getTransactionsFundingDetailsCompanySearchDataHandler();
      }
    } else if (type === 'Currency') {
      if (this.selectCurrencyData && this.selectedCurrency !== data) {
        this.selectedCurrency = data;

        this.getTransactionsFundingDetailsDataHandler();
      }
    }
  }

  getPeriodDates(period: any) {
    this.endDate = new Date();
    this.startDate = new Date(
      this.endDate.getFullYear() - period,
      this.endDate.getMonth(),
      this.endDate.getDate()
    );
    this.startDate = this.startDate.toISOString().slice(0, 10);
    this.endDate = new Date().toISOString().slice(0, 10);
  }
}

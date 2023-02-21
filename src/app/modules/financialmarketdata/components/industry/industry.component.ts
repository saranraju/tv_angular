import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FinancialMarketDataService } from 'src/app/services/financialmarketdata.service';
import * as moment from 'moment';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { UtilService } from 'src/app/services/util.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { LoaderServiceService } from '../loader-service.service';
@Component({
  selector: 'app-industry',
  templateUrl: './industry.component.html',
  styleUrls: ['./industry.component.scss'],
})
export class IndustryComponent implements OnInit {
  unitMCap: any = '';
  currencyMcap: any = '';
  unitSales: any = '';
  currencySales: any = '';
  unitNetIncome: any = '';
  currencyNetIncome: any = '';
  market_date: any = '';
  unitRoE: any = '';
  unitRoA: any = '';
  unitPBT: any = '';
  m_cap_data: any = [];
  sales_data: any = [];
  net_income: any = [];
  roa_data: any = [];
  roe_data: any = [];
  pbt_data: any = [];
  m_cap_industry_data: any = [];
  sales_industry_data: any = [];
  net_industry_income: any = [];
  roa_industry_data: any = [];
  roe_industry_data: any = [];
  pbt_industry_data: any = [];
  equity_data: any = [];
  asset_data: any = [];
  pbt_argin: any = [];
  data_element: any = '';
  showChart: boolean = false;
  tabValue: any = 'industry';
  ticSectorCode: any;
  industrySecondLevel: any = [];
  thirdLevelBack: boolean = false;
  secondLevelBack: boolean = false;
  page_Title: any = '';
  newSelectedCountry: any;
  page_CountryName = 'World';
  seconLevelIndustryPrimaryData: any = [];
  tableflag: any = false;
  titleflag: any = false;
  graphflag: any = false;
  chartData: any = [
    {
      date: '2020-01-01',
      value: 10000,
    },
    {
      date: '2021-01-01',
      value: 20000,
    },
    {
      date: '2022-01-01',
      value: 30000,
    },
    {
      date: '2023-01-01',
      value: 40000,
    },
    {
      date: '2024-01-01',
      value: 50000,
    },
  ];
  industry_table_data_primary: any = {
    title: [
      {
        label: 'Sector',
        key: 'ticsSectorName',
        width: '200px',
        align: 'left',
        shorting: true,
        pointer: true,
      },
      {
        label: 'Company Count',
        key: 'Company Count',
        width: '130px',
        align: 'right',
        shorting: true,
        formattedNum: true,
      },
      {
        label: 'MCap ',
        key: 'MCap',
        width: '156.89px',
        align: 'right',
        shorting: true,
        formattedNum: true,
        unit: this.unitMCap,
        currency: this.currencyMcap,
      },
      {
        label: 'Sales/Revenue ',
        key: 'Sales/Revenue',
        width: '200px',
        align: 'right',
        shorting: true,
        formattedNum: true,
        unit: this.unitSales,
        currency: this.currencySales,
      },
      {
        label: 'Net Income ',
        key: 'Net Income',
        width: '210.84px',
        align: 'right',
        shorting: true,
        formattedNum: true,
        unit: this.unitNetIncome,
        currency: this.currencyNetIncome,
      },
      {
        label: 'RoE ',
        key: 'RoE',
        width: '94.94px',
        align: 'right',
        shorting: true,
        formattedNum: true,
        unit: this.unitRoE,
      },
      {
        label: 'RoA ',
        key: 'RoA',
        width: '96.94px',
        align: 'right',
        shorting: true,
        formattedNum: true,
        unit: this.unitRoA,
      },
      {
        label: 'PBT ',
        key: 'PBT',
        width: '94px',
        align: 'right',
        shorting: true,
        formattedNum: true,
        unit: this.unitPBT,
      },
    ],
    value: [],
  };

  periodDropdownData = [
    {
      id: 'YEARLY',
      text: 'Yearly',
    },
    {
      id: 'QUARTERLY',
      text: 'Quarterly',
    },
  ];

  industry_table_data = this.industry_table_data_primary;
  selectCurrencyData: any;
  periodType: any = 'YEARLY';
  date: any;
  countryId: any = '';
  periodListData: any = [];
  dateListData: any = [];
  selectedCountry: any = 'all';
  selectedCurrency: any = 'USD';
  sectorData: any = [];
  newKey: any;
  sectorOject: any = {};
  formateSectorData: any = [];
  sectorListData: any = [];
  graphAllData: any = {};
  filterarrayMcap: any = [];
  filterarraySales: any = [];
  filterarrayNet: any = [];
  filterarrayRoa: any = [];
  filterarrayRoe: any = [];
  filterarrayPBT: any = [];
  filterarrayIndustryMcap: any = [];
  filterarrayIndustrySales: any = [];
  filterarrayIndustryNet: any = [];
  filterarrayIndustryRoa: any = [];
  filterarrayIndustryRoe: any = [];
  filterarrayIndustryPBT: any = [];
  newArraySeconLevel: any = [];
  formateIndustrySectorData: any = [];
  sector_id: any;
  sector_industry_id: any;
  showIndustrychart: boolean = false;
  ticsIndustryCode: any;
  graphThirdLevelData: any = {};
  count_res: any = 0;
  total_count_res: any = '';
  countryData: any;

  constructor(
    public auth: AuthService,
    private financialMarketData: FinancialMarketDataService,
    public util: UtilService,
    private _location: Location,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public loaderService: LoaderServiceService
  ) {}
  countryFromGeoLocation: any;
  ngOnInit(): void {
    if (
      Object.keys((this.activatedRoute.queryParams as any)?.value).length != 0
    ) {
      this.activatedRoute.queryParamMap.subscribe((params: any) => {
        this.sector_id = params.params.sector_id;
        this.sector_industry_id = params.params.sector_industry_id;
        this.selectedCurrency = params?.params?.currency;

        this.selectedCountry = params.params.countryId
          ? params.params.countryId
          : '';
        this.countryId = this.selectedCountry;
        this.page_CountryName = params.params.country
          ? params.params.country
          : 'World';
      });
    } else {
      // this.financialMarketData.getCountryIp().subscribe((res: any) => {
      //   var data = res;
      //   this.selectedCurrency = data.currency;
      //   this.countryFromGeoLocation = data.country;
      // });
    }

    $(document).on('select2:open', () => {
      const inputs: any = document.querySelectorAll(
        '.select2-search__field[aria-controls]'
      );
      const mostRecentlyOpenedInput = inputs[inputs.length - 1];
      mostRecentlyOpenedInput.focus();
    });
    this.loaderService.display(true);
    this.count_res = 0;
    this.total_count_res = this.sector_industry_id ? 6 : 5;
    this.getIndustryCountryList();
    this.getIndustryCurrencyList();
    this.getIndustryPeriodList();
  }

  doCheckCount: any = false;
  ngDoCheck(): void {
    let countCheck: any = this.sector_industry_id ? 6 : 5;
    if (this.count_res === countCheck && !this.doCheckCount) {
      this.util.loaderService.showTutorial(true);
      this.doCheckCount = true;
    }
  }

  getIndustryCountryList() {
    this.financialMarketData.getIndustryCountryList().subscribe(
      (res) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);
        res.push({ id: 'all', countryName: 'World' });
        let formattedData: any = [];
        res.forEach((element: any) => {
          formattedData.push({
            id: element.id,
            text: element.countryName,
          });
          if (element.countryName == this.countryFromGeoLocation) {
            this.countryId = element.id;
            this.selectedCountry = element.id;
          }
          this.countryData = formattedData.sort((a: any, b: any) =>
            a.text > b.text ? 1 : -1
          );
        });
      },
      (err) => {
        console.log('error', err.message);
      }
    );
  }

  getIndustryCurrencyList() {
    this.financialMarketData.getCurrency().subscribe(
      (res) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);
        let currencyFormattedData: any = [];
        res?.forEach((element: any) => {
          currencyFormattedData.push({
            id: element.isoCode,
            text: element.currencyName + ' (' + element.isoCode + ')',
          });
          this.selectCurrencyData = currencyFormattedData.sort(
            (a: any, b: any) => (a.text > b.text ? 1 : -1)
          );
        });
      },
      (err) => {
        console.log('error', err.message);
      }
    );
  }

  getIndustryPeriodList() {
    if (this.sector_id && this.sector_industry_id) {
      this.financialMarketData
        .getIndustryPeriodListThirdLevel(
          this.sector_id,
          this.countryId,
          this.sector_industry_id
        )
        .subscribe(
          (res) => {
            ++this.count_res;
            this.util.checkCountValue(this.total_count_res, this.count_res);
            let dateFormateListData: any = [];
            this.periodListData = res.filter(
              (val: any) => val.periodType == this.periodType
            );
            this.date = moment(this.periodListData[0].period).format(
              'YYYY-MM-DD'
            );
            this.periodListData?.forEach((element: any) => {
              dateFormateListData.push({
                id: moment(element.period).format('YYYY-MM-DD'),
                text: moment(element.period).format('MMM-YYYY'),
              });
              this.dateListData = dateFormateListData;
            });
            this.getIndustrySectorList();
          },
          (err) => {
            console.log('error', err.message);
          }
        );
    } else {
      this.financialMarketData.getIndustryPeriodList().subscribe(
        (res) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);
          let dateFormateListData: any = [];
          this.periodListData = res.filter(
            (val: any) => val.periodType == this.periodType
          );
          this.date = moment(this.periodListData[0].period).format(
            'YYYY-MM-DD'
          );
          this.periodListData?.forEach((element: any) => {
            dateFormateListData.push({
              id: moment(element.period).format('YYYY-MM-DD'),
              text: moment(element.period).format('MMM-YYYY'),
            });
            this.dateListData = dateFormateListData;
          });
          this.getIndustrySectorList();
        },
        (err) => {
          console.log('error', err.message);
        }
      );
    }
  }

  onValueChanged(type: any, data: any) {
    if (type == 'Country') {
      if (this.countryData && this.selectedCountry !== data) {
        this.loaderService.display(true);
        this.count_res = 0;
        this.total_count_res = 2;
        this.selectedCountry = data;
        this.newSelectedCountry = this.countryData.filter(
          (val: any) => val.id == this.selectedCountry
        )[0];
        if (this.selectedCountry === 'all') {
          this.selectedCountry = '';
        }
        this.page_CountryName = this.newSelectedCountry.text;
        this.countryId = this.selectedCountry;
        if (this.selectedCountry !== '') {
          this.financialMarketData
            .getCurrencyBasedCountryId(this.selectedCountry)
            .subscribe((res) => {
              this.selectedCurrency = res?.currencyCode;
              this.getIndustrySectorList();
            });
        } else {
          this.selectedCurrency = 'USD';
          this.getIndustrySectorList();
        }
      }
    }
    if (type == 'Currency') {
      if (this.selectCurrencyData && this.selectedCurrency !== data) {
        this.loaderService.display(true);
        this.count_res = 0;
        this.total_count_res = 2;
        this.selectedCurrency = data;
        this.getIndustrySectorList();
      }
    }
    if (type == 'Date') {
      if (this.dateListData && this.date !== data) {
        this.loaderService.display(true);
        this.count_res = 0;
        this.total_count_res = 2;
        this.date = data;
        this.getIndustrySectorList();
      }
    }
    if (type == 'Period') {
      if (this.periodDropdownData && this.periodType !== data) {
        this.loaderService.display(true);
        this.count_res = 0;
        this.total_count_res = 2;
        this.periodType = data;
        this.getIndustryPeriodList();
      }
      this.tableflag = false;
      this.graphflag = false;
      this.titleflag = false;
    }
  }

  getIndustrySectors() {
    this.financialMarketData
      .getIndustrySectors(
        this.periodType,
        this.date,
        this.countryId,
        this.selectedCurrency
      )
      .subscribe(
        (res) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);
          this.page_Title = 'SECTOR WATCH';
          this.sectorData = res;
          this.sectorData.find((val: any) => {
            switch (val.shortName) {
              case 'MCap':
                this.currencyMcap = val.currency;
                this.unitMCap = val.unit;
                break;
              case 'Sales/Revenue':
                this.currencySales = val.currency;
                this.unitSales = val.unit;
                break;
              case 'Net Income':
                this.currencyNetIncome = val.currency;
                this.unitNetIncome = val.unit;
                break;
              case 'RoA':
                this.unitRoA = val.unit;
                break;
              case 'RoE':
                this.unitRoE = val.unit;
                break;
              case 'PBT':
                this.unitPBT = val.unit;
            }
          });

          this.industry_table_data.value = [];
          this.formateSectorData = [];
          this.sectorListData.map((val2: any) => {
            this.sectorData.map((val1: any) => {
              if (
                val1.ticsSectorName == val2.ticsSectorName &&
                val1.ticsSectorCode == val2.ticsSectorCode
              ) {
                var index = this.formateSectorData.findIndex(
                  (data: any) => data.ticsSectorName == val2.ticsSectorName
                );
                if (index > -1) {
                  this.formateSectorData.splice(index, 1);
                } else {
                  this.sectorOject = {};
                }
                const newKey = val1['shortName'];
                this.sectorOject[newKey] = val1.data;
                this.sectorOject = {
                  ...this.sectorOject,
                  ticsSectorName: val2.ticsSectorName,
                  ticsSectorCode: val2.ticsSectorCode,
                };
                this.formateSectorData = [
                  ...this.formateSectorData,
                  this.sectorOject,
                ];

                this.industry_table_data.value = this.formateSectorData;
                this.industry_table_data.title.filter((val3: any) => {
                  switch (val3.key) {
                    case 'MCap':
                      val3.currency = this.currencyMcap;
                      val3.unit = this.unitMCap;
                      break;
                    case 'Sales/Revenue':
                      val3.currency = this.currencySales;
                      val3.unit = this.unitSales;
                      break;
                    case 'Net Income':
                      val3.currency = this.currencyNetIncome;
                      val3.unit = this.unitNetIncome;
                      break;
                    case 'RoA':
                      val3.unit = this.unitRoA;
                      break;
                    case 'RoE':
                      val3.unit = this.unitRoE;
                      break;
                    case 'PBT':
                      val3.unit = this.unitPBT;
                  }
                });
                this.industry_table_data.title.map((data: any, ind: any) => {
                  if (data.label == 'Industry') {
                    data.label = 'Sector';
                    data.key = 'ticsSectorName';
                  }
                });
              }
            });
          });
          this.titleflag = true;
          this.graphflag = true;
          this.tableflag = true;
        },
        (err) => {
          console.log('error', err.message);
        }
      );
  }
  getIndustrySectorList() {
    this.tableflag = false;
    this.graphflag = false;
    this.titleflag = false;
    this.financialMarketData
      .getIndustrySectorList(
        this.periodType,
        this.date,
        this.countryId,
        this.selectedCurrency
      )
      .subscribe(
        (res) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);
          if (this.selectedCountry == '') {
            this.selectedCountry = 'all';
          }
          this.sectorListData = res;
          if (
            (this.showChart && this.showIndustrychart) ||
            (this.sector_id && this.sector_industry_id)
          ) {
            if (this.sector_industry_id) {
              this.getIndustryThirdLevel(this.sector_industry_id);
            } else {
              this.getIndustryThirdLevel(this.ticsIndustryCode);
            }
          } else if (this.showChart || this.sector_id) {
            if (this.sector_id) {
              this.getIndustrySecondLevel(this.sector_id);
              // this.page_Title = this.sectorListData.filter((val:any) => val.ticsSectorCode == this.sector_id)[0].ticsSectorName
            } else {
              this.getIndustrySecondLevel(this.ticSectorCode);
              // this.page_Title = this.sectorListData.filter((val:any) => val.ticsSectorCode == this.ticSectorCode)[0].ticsSectorName
            }
          } else {
            this.getIndustrySectors();
          }
        },
        (err) => {
          console.log('error', err.message);
        }
      );
  }

  secondLevelChartFunction() {
    // this.graphThirdLevelData = {}

    this.m_cap_industry_data = [];
    this.sales_industry_data = [];
    this.net_industry_income = [];
    this.roa_industry_data = [];
    this.roe_industry_data = [];
    this.pbt_industry_data = [];
    this.filterarrayIndustryMcap = [];
    this.filterarrayIndustrySales = [];
    this.filterarrayIndustryNet = [];
    this.filterarrayIndustryRoa = [];
    this.filterarrayIndustryRoe = [];
    this.filterarrayIndustryPBT = [];

    this.showIndustrychart = false;
    this.showChart = false;
    if (this.sector_industry_id) {
      this.ticsIndustryCode = this.sector_industry_id;
    }
    if (this.seconLevelIndustryPrimaryData && this.ticsIndustryCode) {
      this.seconLevelIndustryPrimaryData.map((val: any) => {
        switch (val.shortName) {
          case 'MCap':
            if (val.ticsIndustryCode == this.ticsIndustryCode) {
              this.filterarrayIndustryMcap.push(val);
            }
            break;
          case 'Sales/Revenue':
            if (val.ticsIndustryCode == this.ticsIndustryCode) {
              this.filterarrayIndustrySales.push(val);
            }
            break;
          case 'Net Income':
            if (val.ticsIndustryCode == this.ticsIndustryCode) {
              this.filterarrayIndustryNet.push(val);
            }
            break;
          case 'RoA':
            if (val.ticsIndustryCode == this.ticsIndustryCode) {
              this.filterarrayIndustryRoa.push(val);
            }
            break;
          case 'RoE':
            if (val.ticsIndustryCode == this.ticsIndustryCode) {
              this.filterarrayIndustryRoe.push(val);
            }
            break;
          case 'PBT':
            if (val.ticsIndustryCode == this.ticsIndustryCode) {
              this.filterarrayIndustryPBT.push(val);
            }
        }
      });
      this.filterarrayIndustryMcap.map((element: any) => {
        if (element) {
          var newObject = {
            date: element.applicablePeriod,
            value: element.data,
          };
          var index = this.m_cap_industry_data.findIndex(
            (data: any) => data.date == element.applicablePeriod
          );
          if (index > -1) {
            this.m_cap_industry_data.splice(index, 1);
            this.m_cap_industry_data.push(newObject);
          } else {
            this.m_cap_industry_data.push(newObject);
          }
        }
      });
      this.filterarrayIndustrySales.map((element: any) => {
        if (element) {
          var newObject = {
            date: element.applicablePeriod,
            value: element.data,
          };
          var index = this.sales_industry_data.findIndex(
            (data: any) => data.date == element.applicablePeriod
          );
          if (index > -1) {
            this.sales_industry_data.splice(index, 1);
            this.sales_industry_data.push(newObject);
          } else {
            this.sales_industry_data.push(newObject);
          }
        }
      });
      this.filterarrayIndustryNet.map((element: any) => {
        if (element) {
          var newObject = {
            date: element.applicablePeriod,
            value: element.data,
          };
          var index = this.net_industry_income.findIndex(
            (data: any) => data.date == element.applicablePeriod
          );
          if (index > -1) {
            this.net_industry_income.splice(index, 1);
            this.net_industry_income.push(newObject);
          } else {
            this.net_industry_income.push(newObject);
          }
        }
      });
      this.filterarrayIndustryRoa.map((element: any) => {
        if (element) {
          var newObject = {
            date: element.applicablePeriod,
            value: element.data,
          };
          var index = this.roa_industry_data.findIndex(
            (data: any) => data.date == element.applicablePeriod
          );
          if (index > -1) {
            this.roa_industry_data.splice(index, 1);
            this.roa_industry_data.push(newObject);
          } else {
            this.roa_industry_data.push(newObject);
          }
        }
      });
      this.filterarrayIndustryRoe.map((element: any) => {
        if (element) {
          var newObject = {
            date: element.applicablePeriod,
            value: element.data,
          };
          var index = this.roe_industry_data.findIndex(
            (data: any) => data.date == element.applicablePeriod
          );
          if (index > -1) {
            this.roe_industry_data.splice(index, 1);
            this.roe_industry_data.push(newObject);
          } else {
            this.roe_industry_data.push(newObject);
          }
        }
      });
      this.filterarrayIndustryPBT.map((element: any) => {
        if (element) {
          var newObject = {
            date: element.applicablePeriod,
            value: element.data,
          };
          var index = this.pbt_industry_data.findIndex(
            (data: any) => data.date == element.applicablePeriod
          );
          if (index > -1) {
            this.pbt_industry_data.splice(index, 1);
            this.pbt_industry_data.push(newObject);
          } else {
            this.pbt_industry_data.push(newObject);
          }
        }
      });
      this.graphThirdLevelData = {};

      this.graphThirdLevelData = {
        m_cap_data: this.m_cap_industry_data,
        sales_data: this.sales_industry_data,
        net_income: this.net_industry_income,
        roa_data: this.roa_industry_data,
        roe_data: this.roe_industry_data,
        pbt_data: this.pbt_industry_data,
      };

      this.showIndustrychart = true;
      this.showChart = true;
      console.log('this.graphThirdLevelData', this.graphThirdLevelData);
      this.tableflag = true;
      this.graphflag = true;
      this.titleflag = true;
    }
  }

  subtractYears(numOfYears: any, dateR: any) {
    var date = new Date(dateR);
    date.setFullYear(date.getFullYear() - numOfYears);
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  getIndustrySecondLevel(sectorCode: any) {
    this.titleflag = false;
    this.graphflag = false;
    this.tableflag = false;
    this.showChart = false;
    this.sector_id;
    const startDate = this.subtractYears(5, this.date);
    var graphStartDate;
    if (this.periodType == 'QUARTERLY') {
      graphStartDate = this.subtractYears(1, this.date);
    } else {
      graphStartDate = this.subtractYears(4, this.date);
    }
    this.getGraphData(
      this.periodType,
      this.date,
      this.countryId,
      this.selectedCurrency,
      graphStartDate,
      sectorCode
    );
    this.financialMarketData
      .getIndustrySecondLevel(
        this.periodType,
        sectorCode,
        this.date,
        this.countryId,
        this.selectedCurrency,
        startDate
      )
      .subscribe(
        (res) => {
          ++this.count_res;
          this.showChart = true;
          this.page_Title =
            res && res.length > 0 ? res[0].ticsSectorName : this.page_Title;
          this.industrySecondLevel = res;
          this.newArraySeconLevel = [];
          this.filterarrayMcap = [];
          this.filterarraySales = [];
          this.filterarrayNet = [];
          this.filterarrayRoa = [];
          this.filterarrayRoe = [];
          this.filterarrayPBT = [];
          this.m_cap_data = [];
          this.sales_data = [];
          this.net_income = [];
          this.roa_data = [];
          this.roe_data = [];
          this.pbt_data = [];
          this.m_cap_industry_data = [];
          this.sales_industry_data = [];
          this.net_industry_income = [];
          this.roa_industry_data = [];
          this.roe_industry_data = [];
          this.pbt_industry_data = [];
          this.util.checkCountValue(this.total_count_res, this.count_res);
          this.sectorData = res;
          this.seconLevelIndustryPrimaryData = res;

          // For 2nd graph chart

          // this.secondLevelChartFunction();

          //For 2nd graph chart

          this.sectorData.find((val: any) => {
            switch (val.shortName) {
              case 'MCap':
                this.currencyMcap = val.currency;
                this.unitMCap = val.unit;
                break;
              case 'Sales/Revenue':
                this.currencySales = val.currency;
                this.unitSales = val.unit;
                break;
              case 'Net Income':
                this.currencyNetIncome = val.currency;
                this.unitNetIncome = val.unit;
                break;
              case 'RoA':
                this.unitRoA = val.unit;
                break;
              case 'RoE':
                this.unitRoE = val.unit;
                break;
              case 'PBT':
                this.unitPBT = val.unit;
            }
          });

          this.graphAllData = {};
          this.graphThirdLevelData = {};
          this.industrySecondLevel.map((val: any, i: any) => {
            var index = this.newArraySeconLevel.findIndex(
              (data: any) => data.ticsIndustryCode == val.ticsIndustryCode
            );
            if (index > -1) {
              this.newArraySeconLevel.splice(index, 1);
              this.newArraySeconLevel.push(val);
            } else {
              this.newArraySeconLevel.push(val);
            }
          });
          this.industry_table_data.value = [];
          this.formateIndustrySectorData = [];

          this.newArraySeconLevel.map((val2: any) => {
            this.industrySecondLevel.map((val1: any) => {
              if (
                val1.ticsIndustryName == val2.ticsIndustryName &&
                val1.ticsIndustryCode == val2.ticsIndustryCode
              ) {
                var index = this.formateIndustrySectorData.findIndex(
                  (data: any) => data.ticsIndustryName == val2.ticsIndustryName
                );
                if (index > -1) {
                  this.formateIndustrySectorData.splice(index, 1);
                } else {
                  this.sectorOject = {};
                }
                const newKey = val1['shortName'];
                this.sectorOject[newKey] = val1.data;
                this.sectorOject = {
                  ...this.sectorOject,
                  ticsIndustryName: val2.ticsIndustryName,
                  ticsIndustryCode: val2.ticsIndustryCode,
                };
                this.formateIndustrySectorData = [
                  ...this.formateIndustrySectorData,
                  this.sectorOject,
                ];

                this.industry_table_data.value = this.formateIndustrySectorData;
                this.industry_table_data.title.filter((val3: any) => {
                  switch (val3.key) {
                    case 'MCap':
                      val3.currency = this.currencyMcap;
                      val3.unit = this.unitMCap;
                      break;
                    case 'Sales/Revenue':
                      val3.currency = this.currencySales;
                      val3.unit = this.unitSales;
                      break;
                    case 'Net Income':
                      val3.currency = this.currencyNetIncome;
                      val3.unit = this.unitNetIncome;
                      break;
                    case 'RoA':
                      val3.unit = this.unitRoA;
                      break;
                    case 'RoE':
                      val3.unit = this.unitRoE;
                      break;
                    case 'PBT':
                      val3.unit = this.unitPBT;
                  }
                });
              }
            });
          });

          this.industry_table_data.title.map((data: any, ind: any) => {
            if (data.label == 'Sector' || data.label == 'Company') {
              data.label = 'Industry';
              data.key = 'ticsIndustryName';
            }
          });
          this.industry_table_data.title =
            this.industry_table_data_primary.title;

          this.graphData.map((val: any) => {
            switch (val.shortName) {
              case 'MCap':
                this.filterarrayMcap.push(val);
                break;
              case 'Sales/Revenue':
                this.filterarraySales.push(val);
                break;
              case 'Net Income':
                this.filterarrayNet.push(val);
                break;
              case 'RoA':
                this.filterarrayRoa.push(val);
                break;
              case 'RoE':
                this.filterarrayRoe.push(val);
                break;
              case 'PBT':
                this.filterarrayPBT.push(val);
            }
          });

          this.filterarrayMcap.map((element: any) => {
            if (element) {
              var newObject = {
                date: element.applicablePeriod,
                value: element.data,
              };
              var index = this.m_cap_data.findIndex(
                (data: any) => data.date == element.applicablePeriod
              );
              if (index > -1) {
                this.m_cap_data.map((ele: any, i: any) => {
                  if (ele.date == newObject.date) {
                    this.m_cap_data[i].value += newObject.value;
                  }
                });
              } else {
                this.m_cap_data.push(newObject);
              }
            }
          });
          this.filterarraySales.map((element: any) => {
            if (element) {
              var newObject = {
                date: element.applicablePeriod,
                value: element.data,
              };
              var index = this.sales_data.findIndex(
                (data: any) => data.date == element.applicablePeriod
              );
              if (index > -1) {
                this.sales_data.map((ele: any, i: any) => {
                  if (ele.date == newObject.date) {
                    this.sales_data[i].value += newObject.value;
                  }
                });
              } else {
                this.sales_data.push(newObject);
              }
            }
          });
          this.filterarrayNet.map((element: any) => {
            if (element) {
              var newObject = {
                date: element.applicablePeriod,
                value: element.data,
              };
              var index = this.net_income.findIndex(
                (data: any) => data.date == element.applicablePeriod
              );
              if (index > -1) {
                this.net_income.map((ele: any, i: any) => {
                  if (ele.date == newObject.date) {
                    this.net_income[i].value += newObject.value;
                  }
                });
              } else {
                this.net_income.push(newObject);
              }
            }
          });
          this.filterarrayRoa.map((element: any) => {
            if (element) {
              var newObject = {
                date: element.applicablePeriod,
                value: element.data,
              };
              var index = this.roa_data.findIndex(
                (data: any) => data.date == element.applicablePeriod
              );
              if (index > -1) {
                this.roa_data.map((ele: any, i: any) => {
                  if (ele.date == newObject.date) {
                    this.roa_data[i].value += newObject.value;
                  }
                });
              } else {
                this.roa_data.push(newObject);
              }
            }
          });
          this.filterarrayRoe.map((element: any) => {
            if (element) {
              var newObject = {
                date: element.applicablePeriod,
                value: element.data,
              };
              var index = this.roe_data.findIndex(
                (data: any) => data.date == element.applicablePeriod
              );
              if (index > -1) {
                // this.roe_data.splice(index, 1);
                // this.roe_data.push(newObject);
                this.roe_data.map((ele: any, i: any) => {
                  if (ele.date == newObject.date) {
                    this.roe_data[i].value += newObject.value;
                  }
                });
              } else {
                this.roe_data.push(newObject);
              }
            }
          });
          this.filterarrayPBT.map((element: any) => {
            if (element) {
              var newObject = {
                date: element.applicablePeriod,
                value: element.data,
              };
              var index = this.pbt_data.findIndex(
                (data: any) => data.date == element.applicablePeriod
              );
              if (index > -1) {
                // this.pbt_data.splice(index, 1);
                // this.pbt_data.push(newObject);
                this.pbt_data.map((ele: any, i: any) => {
                  if (ele.date == newObject.date) {
                    this.pbt_data[i].value += newObject.value;
                  }
                });
              } else {
                this.pbt_data.push(newObject);
              }
            }
          });
          this.graphAllData = {
            m_cap_data: this.m_cap_data,
            sales_data: this.sales_data,
            net_income: this.net_income,
            roa_data: this.roa_data,
            roe_data: this.roe_data,
            pbt_data: this.pbt_data,
          };
          console.log('this.graphAllData', this.graphAllData);
          this.showChart = true;
          this.titleflag = true;
          this.graphflag = true;
          this.tableflag = true;
        },
        (err) => {
          console.log('error', err.message);
        }
      );
  }

  getIndustryThirdLevel(sectorCode: any) {
    this.loaderService.display(true);
    if (this.sector_id) {
      this.titleflag = false;
      this.graphflag = false;
      this.tableflag = false;
      this.ticSectorCode = this.sector_id;
      // this.getIndustrySecondLevel(this.sector_id);
    } else {
      this.titleflag = false;
      this.graphflag = false;
      this.tableflag = false;
      // this.getIndustrySecondLevel(this.ticSectorCode);
    }
    this.showChart = false;
    this.showIndustrychart = false;
    this.seconLevelIndustryPrimaryData = [];
    const startDate = this.subtractYears(4, this.date);

    this.financialMarketData
      .getIndustryThirdLevel(
        this.periodType,
        sectorCode,
        this.date,
        this.countryId,
        this.selectedCurrency,
        startDate
      )
      .subscribe(
        (res) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);
          this.sectorData = res;
          this.m_cap_industry_data = [];
          this.sales_industry_data = [];
          this.net_industry_income = [];
          this.roa_industry_data = [];
          this.roe_industry_data = [];
          this.pbt_industry_data = [];
          this.financialMarketData
            .getIndustrySecondLevel(
              this.periodType,
              this.ticSectorCode,
              this.date,
              this.countryId,
              this.selectedCurrency,
              startDate
            )
            .subscribe((res) => {
              ++this.count_res;
              this.util.checkCountValue(this.total_count_res, this.count_res);
              // this.sectorData = res;
              this.seconLevelIndustryPrimaryData = res;
              this.secondLevelChartFunction();
            });
          this.sectorData.find((val: any) => {
            switch (val.shortName) {
              case 'MCap':
                this.currencyMcap = val.currency;
                this.unitMCap = val.unit;
                break;
              case 'Sales/Revenue':
                this.currencySales = val.currency;
                this.unitSales = val.unit;
                break;
              case 'Net Income':
                this.currencyNetIncome = val.currency;
                this.unitNetIncome = val.unit;
                break;
              case 'RoA':
                this.unitRoA = val.unit;
                break;
              case 'RoE':
                this.unitRoE = val.unit;
                break;
              case 'PBT':
                this.unitPBT = val.unit;
            }
          });

          this.industrySecondLevel = [];
          this.page_Title =
            res && res.length > 0 ? res[0].ticsIndustryName : this.page_Title;
          this.industrySecondLevel = res;
          this.newArraySeconLevel = [];
          this.filterarrayMcap = [];
          this.filterarraySales = [];
          this.filterarrayNet = [];
          this.filterarrayRoa = [];
          this.filterarrayRoe = [];
          this.filterarrayPBT = [];
          this.m_cap_data = [];
          this.sales_data = [];
          this.net_income = [];
          this.roa_data = [];
          this.roe_data = [];
          this.pbt_data = [];
          this.m_cap_industry_data = [];
          this.sales_industry_data = [];
          this.net_industry_income = [];
          this.roa_industry_data = [];
          this.roe_industry_data = [];
          this.pbt_industry_data = [];

          this.graphAllData = {};
          // this.graphThirdLevelData = {};
          this.industrySecondLevel.map((val: any, i: any) => {
            var index = this.newArraySeconLevel.findIndex(
              (data: any) => data.companyCode == val.companyCode
            );
            if (index > -1) {
              this.newArraySeconLevel.splice(index, 1);
              this.newArraySeconLevel.push(val);
            } else {
              this.newArraySeconLevel.push(val);
            }
          });
          this.industry_table_data.value = [];
          this.formateIndustrySectorData = [];
          this.newArraySeconLevel.map((val2: any) => {
            this.industrySecondLevel.map((val1: any) => {
              if (
                val1.companyName == val2.companyName &&
                val1.companyCode == val2.companyCode
              ) {
                var index = this.formateIndustrySectorData.findIndex(
                  (data: any) => data.companyName == val2.companyName
                );
                if (index > -1) {
                  this.formateIndustrySectorData.splice(index, 1);
                } else {
                  this.sectorOject = {};
                }
                const newKey = val1['shortName'];
                this.sectorOject[newKey] = val1.data;
                this.sectorOject = {
                  ...this.sectorOject,
                  companyName: val2.companyName,
                  companyCode: val2.companyCode,
                  currency: val2.currency,
                };

                this.formateIndustrySectorData = [
                  ...this.formateIndustrySectorData,
                  this.sectorOject,
                ];

                this.industry_table_data.value = this.formateIndustrySectorData;

                this.industry_table_data.title.filter((val3: any) => {
                  switch (val3.key) {
                    case 'MCap':
                      val3.currency = this.currencyMcap;
                      val3.unit = this.unitMCap;
                      break;
                    case 'Sales/Revenue':
                      val3.currency = this.currencySales;
                      val3.unit = this.unitSales;
                      break;
                    case 'Net Income':
                      val3.currency = this.currencyNetIncome;
                      val3.unit = this.unitNetIncome;
                      break;
                    case 'RoA':
                      val3.unit = this.unitRoA;
                      break;
                    case 'RoE':
                      val3.unit = this.unitRoE;
                      break;
                    case 'PBT':
                      val3.unit = this.unitPBT;
                  }
                });
              }
            });
          });

          var newIndex = this.industry_table_data.title.findIndex(
            (data: any) => data.label == 'Company Count'
          );

          if (newIndex > -1) {
            this.industry_table_data.title.splice(newIndex, 1);
          }
          this.industry_table_data.title.map((data: any, ind: any) => {
            if (data.label == 'Industry' || data.label == 'Sector') {
              data.label = 'Company';
              data.key = 'companyName';
            }
          });

          this.sortdata();

          this.industrySecondLevel.map((val: any) => {
            switch (val.shortName) {
              case 'MCap':
                this.filterarrayMcap.push(val);
                break;
              case 'Sales/Revenue':
                this.filterarraySales.push(val);
                break;
              case 'Net Income':
                this.filterarrayNet.push(val);
                break;
              case 'RoA':
                this.filterarrayRoa.push(val);
                break;
              case 'RoE':
                this.filterarrayRoe.push(val);
                break;
              case 'PBT':
                this.filterarrayPBT.push(val);
            }
          });
          // this.filterarrayMcap.map((element:any) => {
          //   if(element){
          //     var newObject = {
          //       date:element.applicablePeriod,
          //       value:element.data
          //     }
          //       this.m_cap_data.push(newObject)
          //   }
          // });
          // this.filterarraySales.map((element:any) => {
          //   if(element){
          //     var newObject = {
          //       date:element.applicablePeriod,
          //       value:element.data
          //     }
          //     this.sales_data.push(newObject)
          //   }
          // });
          // this.filterarrayNet.map((element:any) => {
          //   if(element){
          //     var newObject = {
          //       date:element.applicablePeriod,
          //       value:element.data
          //     }
          //     this.net_income.push(newObject)
          //   }
          // });
          // this.filterarrayRoa.map((element:any) => {
          //   if(element){
          //     var newObject = {
          //       date:element.applicablePeriod,
          //       value:element.data
          //     }
          //     this.roa_data.push(newObject)
          //   }
          // });
          // this.filterarrayRoe.map((element:any) => {
          //   if(element){
          //     var newObject = {
          //       date:element.applicablePeriod,
          //       value:element.data
          //     }
          //     this.roe_data.push(newObject)
          //   }
          // });
          // this.filterarrayPBT.map((element:any) => {
          //   if(element){
          //     var newObject = {
          //       date:element.applicablePeriod,
          //       value:element.data
          //     }
          //     this.pbt_data.push(newObject)
          //   }
          // });
          // this.graphThirdLevelData = {
          //   m_cap_data:this.m_cap_data,
          //   sales_data:this.sales_data,
          //   net_income:this.net_income,
          //   roa_data:this.roa_data,
          //   roe_data:this.roe_data,
          //   pbt_data:this.pbt_data
          // }
          // console.log("this.graphThirdLevelData", this.graphThirdLevelData)

          // this.showChart = true;
          // this.showIndustrychart = true;
          this.titleflag = true;
          this.graphflag = true;
          this.tableflag = true;
          // this.loaderService.display(false);
        },
        (err) => {
          console.log('error', err.message);
        }
      );
  }

  sortdata() {
    var keyVal = this.industry_table_data?.title[0].key;

    this.industry_table_data?.value?.sort(function (a: any, b: any) {
      var nameA = a[keyVal].toLowerCase(),
        nameB = b[keyVal].toLowerCase();
      if (nameA < nameB)
        //sort string ascending
        return -1;
      if (nameA > nameB) return 1;
      return 0; //default return value (no sorting)
    });
  }

  backClicked() {
    this._location.back();
    this.showChart = false;
    this.showChart = true;
    am4core.disposeAllCharts();
    if (this.showChart && this.showIndustrychart) {
      this.thirdLevelBack = true;
      this.showIndustrychart = false;
      this.industry_table_data = this.industry_table_data_primary;
      let companyCountObj = {
        label: 'Company Count',
        key: 'Company Count',
        width: '130px',
        align: 'right',
        shorting: true,
        formattedNum: true,
      };
      this.industry_table_data.title.splice(1, 0, companyCountObj);
      if (this.sector_id) {
        this.count_res = 0;
        this.loaderService.display(true);
        this.total_count_res = 1;
        this.getIndustrySecondLevel(this.sector_id);
      } else {
        this.count_res = 0;
        this.loaderService.display(true);
        this.total_count_res = 1;
        this.getIndustrySecondLevel(this.ticSectorCode);
      }
      // this._location.back();
    } else {
      this.showChart = false;
      this.secondLevelBack = true;
      this.getIndustrySectors();
      // this._location.back();
    }
  }

  graphData: any;
  getGraphData(
    periodType: any,
    date: any,
    countryId: any,
    currency: any,
    startDate: any,
    sectorCode: any
  ) {
    this.financialMarketData
      .getIndustryListGraphData(
        periodType,
        date,
        countryId,
        currency,
        startDate,
        sectorCode
      )
      .subscribe((res) => {
        this.graphData = res;
      });
  }
  handleTicSectorId(e: any) {
    if (e && e.ticsSectorCode) {
      this.loaderService.display(true);
      this.count_res = 0;
      this.total_count_res = 1;
      this.ticSectorCode = e.ticsSectorCode;
      this.getIndustrySecondLevel(this.ticSectorCode);
    } else if (e && e.ticsIndustryCode) {
      this.ticsIndustryCode = e.ticsIndustryCode;
      // this.secondLevelChartFunction();
      this.count_res = 0;
      this.loaderService.display(true);
      this.total_count_res = 2;
      this.getIndustryThirdLevel(this.ticsIndustryCode);
    } else {
      console.log('Third level click');
    }
  }
}

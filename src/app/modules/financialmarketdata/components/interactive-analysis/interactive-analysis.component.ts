import {
  ChangeDetectorRef,
  Component,
  DoCheck,
  HostListener,
  OnInit,
} from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { FinancialMarketDataService } from 'src/app/services/financialmarketdata.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { DatePipe } from '@angular/common';
import { saveAs } from 'file-saver';
import { MAT_DATE_FORMATS } from '@angular/material/core';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'YYYY-MM-DD',
  },
  display: {
    dateInput: 'YYYY-MM-DD',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
/* Chart code */
// Themes begin
am4core.useTheme(am4themes_animated);
// Themes end

@Component({
  selector: 'app-interactive-analysis',
  templateUrl: './interactive-analysis.component.html',
  styleUrls: ['./interactive-analysis.component.scss'],
  providers: [{ provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }],
})
export class InteractiveAnalysisComponent implements OnInit, DoCheck {
  isChartOrTable: boolean = true;
  selectCompanyData: any = [];
  selectCurrencyData: any = [];
  selectedCurrency: any = 'USD';
  selectIndustryCountryData: any = [];
  selectedIndustryCountry: any = [];
  selectPeriodData: any = [
    {
      id: 'QUARTERLY',
      text: 'Quarterly',
    },
    {
      id: 'YEARLY',
      text: 'Yearly',
    },
  ];
  selectedPeriod: any = 'YEARLY';
  selectedCompany: any = [];
  selectedCompanyMetrices: any = [];
  selectedIndustryMetrices: any = [];
  selectedEconomyCountryData: any = [];
  selectedEconomyIndicatorData: any = [];
  selectedIndustry: any = [];
  selectCommodityData: any = [];
  selectedCommodity: any = [];
  selectForex: any = [];
  selectedForex: any = [];
  todayDate: any = new Date();
  industryChoice: any = 'country';
  startDate: any = new Date(
    this.todayDate.getFullYear() - 10,
    this.todayDate.getMonth(),
    this.todayDate.getDate()
  );
  endDate: any = '';
  alertmsg: any;

  metricesData: any;
  metricesDataindustry: any;
  industryData: any;
  economyCountryData: any;
  economyIndicatorData: any;

  chartModelData: any;
  chartModelTitle: any;
  chartModelType: any;

  allCompanyDataTables: any = [];
  allCompanyStockDataTables: any = [];
  allIndustryDataTables: any = [];
  allEconomyDataTables: any = [];
  allCommodityDataTables: any = [];
  allForexDataTables: any = [];

  colorList = [
    '#4472c4',
    '#ed7d31',
    '#ffc000',
    '#5b9bd5',
    '#179172',
    '#ffc75f',
    '#ff9671',
    '#67b7dc',
    '#dc67ab',
    '#a367dc',
    '#8067dc',
    '#6771dc',
    '#FF6633',
    '#FFB399',
    '#FF33FF',
    '#FFFF99',
    '#00B3E6',
    '#E6B333',
    '#3366E6',
    '#999966',
    '#99FF99',
    '#B34D4D',
    '#80B300',
    '#809900',
    '#E6B3B3',
    '#6680B3',
    '#66991A',
    '#FF99E6',
    '#CCFF1A',
    '#FF1A66',
    '#E6331A',
    '#33FFCC',
    '#66994D',
    '#B366CC',
    '#4D8000',
    '#B33300',
    '#CC80CC',
    '#66664D',
    '#991AFF',
    '#E666FF',
    '#4DB3FF',
    '#1AB399',
    '#E666B3',
    '#33991A',
    '#CC9999',
    '#B3B31A',
    '#00E680',
    '#4D8066',
    '#809980',
    '#E6FF80',
    '#1AFF33',
    '#999933',
    '#FF3380',
    '#CCCC00',
    '#66E64D',
    '#4D80CC',
    '#9900B3',
    '#E64D66',
    '#4DB380',
    '#FF4D4D',
    '#99E6E6',
    '#6666FF',
  ];
  monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  tempSelectCompanyData: any;
  date_type: any;
  CommodityChartData: any = [];
  chart: any;
  commodityData: any = [];
  currentDate: any = new Date();

  tempExapandId: any;
  tempExapandIdCheck: any = 0;

  queryParamMetriceID: any;
  queryParamCompanyName: any;
  queryParamComparableList: any;
  queryParamTabFrom: any;

  constructor(
    public util: UtilService,
    private financialMarketData: FinancialMarketDataService,
    private router: Router,
    private activateRoute: ActivatedRoute,
    public auth: AuthService,
    public datepipe: DatePipe,
    public cd: ChangeDetectorRef
  ) {}

  count_res: any = 0;
  total_count_res: any = '';

  forLocalCompany: any = [];
  forLocalCompanyMetrices: any = [];
  forLocalCommodity: any = [];
  forLocalEconomyCountry: any = [];
  forLocalEconomyIndicator: any = [];
  forLocalForex: any = [];

  ngOnInit() {
    this.count_res = 0;
    this.total_count_res = 6;
    this.util.loaderService.display(true);

    this.activateRoute.queryParams.subscribe((params: Params) => {
      this.queryParamTabFrom = params['tabFrom'];
    });

    if (
      Object.keys((this.activateRoute.queryParams as any)?.value).length == 0
    ) {
      localStorage.removeItem('forLocalCompany');
      localStorage.removeItem('forLocalCompanyMetrices');
      localStorage.removeItem('forLocalCommodity');
      localStorage.removeItem('forLocalEconomyCountry');
      localStorage.removeItem('forLocalEconomyIndicator');
      localStorage.removeItem('forLocalForex');
    }

    this.forLocalCompany = JSON.parse(
      localStorage.getItem('forLocalCompany') as any
    );
    this.forLocalCompanyMetrices = JSON.parse(
      localStorage.getItem('forLocalCompanyMetrices') as any
    );
    this.forLocalCommodity = JSON.parse(
      localStorage.getItem('forLocalCommodity') as any
    );
    this.forLocalEconomyCountry = JSON.parse(
      localStorage.getItem('forLocalEconomyCountry') as any
    );
    this.forLocalEconomyIndicator = JSON.parse(
      localStorage.getItem('forLocalEconomyIndicator') as any
    );
    this.forLocalForex = JSON.parse(
      localStorage.getItem('forLocalForex') as any
    );

    if (
      JSON.parse(localStorage.getItem('companyMetricesLocal') as any)?.length
    ) {
      this.selectedCompany = JSON.parse(
        localStorage.getItem('companyLocal') as any
      );

      this.selectedCompanyMetrices = JSON.parse(
        localStorage.getItem('companyMetricesLocal') as any
      );

      if (
        JSON.parse(localStorage.getItem('forLocalSelectedMetrics') as any)
          ?.length
      ) {
        this.selectedCompanyMetricsParam = JSON.parse(
          localStorage.getItem('forLocalSelectedMetrics') as any
        );
      }
      this.getMetricesData(this.selectedCompanyMetricsParam);
      this.companyTabData('init');
    }

    if (
      JSON.parse(localStorage.getItem('industryMetricesLocal') as any)?.length
    ) {
      this.selectedIndustry = JSON.parse(
        localStorage.getItem('industryLocal') as any
      );
      this.selectedIndustryCountry = JSON.parse(
        localStorage.getItem('industryCountryLocal') as any
      );
      this.selectedIndustryMetrices = JSON.parse(
        localStorage.getItem('industryMetricesLocal') as any
      );

      if (
        JSON.parse(
          localStorage.getItem('forLocalIndustrySelectedMetrics') as any
        )?.length
      ) {
        this.selectedIndustryMetricsParams = JSON.parse(
          localStorage.getItem('forLocalIndustrySelectedMetrics') as any
        );
      }
      this.getMetricesDataIndustry(this.selectedIndustryMetricsParams);
      this.industryTabData('init');

      if (!this.selectedCompanyMetrices.length) {
        $('#collapseOne').removeClass('show');
        $('#collapseTwo').addClass('show');
        $('#collapseFour').removeClass('show');
        $('#collapseThree').removeClass('show');
      }
    }

    if (
      JSON.parse(localStorage.getItem('economyIndicatorLocal') as any)
        ?.length ||
      JSON.parse(localStorage.getItem('economyForexLocal') as any)?.length
    ) {
      this.selectedEconomyCountryData = JSON.parse(
        localStorage.getItem('economyCountryLocal') as any
      );
      this.selectedEconomyIndicatorData = JSON.parse(
        localStorage.getItem('economyIndicatorLocal') as any
      );
      this.selectedForex = JSON.parse(
        localStorage.getItem('economyForexLocal') as any
      );

      this.getEconomyIndicatorData(this.selectedEconomyCountryData);
      this.economyTabData('init');
      this.forexTabData('init');

      if (
        !this.selectedCompanyMetrices?.length &&
        !this.selectedIndustryMetrices?.length
      ) {
        $('#collapseOne').removeClass('show');
        $('#collapseThree').addClass('show');
      }
    }

    if (JSON.parse(localStorage.getItem('commodityLocal') as any)?.length) {
      this.selectedCommodity = JSON.parse(
        localStorage.getItem('commodityLocal') as any
      );

      this.commodityTabData('3M', 'init');

      if (
        !this.selectedCompanyMetrices?.length &&
        !this.selectedIndustryMetrices?.length &&
        !this.selectedEconomyIndicatorData?.length
      ) {
        $('#collapseOne').removeClass('show');
        $('#collapseFour').addClass('show');
      }
    }

    this.util.setDateHandler('1Y');

    this.chartDataCheck();
    this.getCurrencyData();
    this.analysisEmptyChart();
    this.getcompanyTabData();
    this.getIndustryCountryData();
    // this.getMetricesData();
    this.getIndustryData();
    this.getEconomyCountryData();
    this.getCommodityData();

    //Auto Focus for ng-select
    $(document).on('select2:open', () => {
      const inputs: any = document.querySelectorAll(
        '.select2-search__field[aria-controls]'
      );
      const mostRecentlyOpenedInput = inputs[inputs.length - 1];
      mostRecentlyOpenedInput.focus();
    });
  }

  doCheckCount: any = false;
  ngDoCheck(): void {
    if (this.count_res === 6 && !this.doCheckCount) {
      this.util.loaderService.showTutorial(true);
      this.doCheckCount = true;
    }
  }

  companyQueryParam() {
    if (Object.keys((this.activateRoute.queryParams as any)?.value).length) {
      this.activateRoute.queryParams.subscribe((params: Params) => {
        this.selectedCurrency = params['currency'];
        this.selectedCompanyMetricsParam.push({
          companyId: params['comparableList'],
          industry: params['industry'],
        });
        this.selectedPeriod = params['periodcity'].toUpperCase();
        this.queryParamCompanyName = params['companyName'];
        this.queryParamComparableList = params['comparableList'];
        this.queryParamMetriceID = params['filter2'];

        this.getMetricesData(this.selectedCompanyMetricsParam);
        this.util.loaderService.display(true);

        setTimeout(() => {
          let tempQueryParamComparableList: any = [];
          if (this.queryParamComparableList.includes('&')) {
            tempQueryParamComparableList =
              this.queryParamComparableList.split('&');
          }
          let finalsplittedArray = tempQueryParamComparableList.slice(
            0,
            tempQueryParamComparableList.length - 1
          );
          if (finalsplittedArray.length) {
            finalsplittedArray.forEach(
              (element: any, finalsplittedArrayIndex: any) => {
                this.queryParamComparableList = element;
                let temp: any = null;
                this.selectCompanyData.filter((el: any) => {
                  if (el.id == this.queryParamComparableList) {
                    temp = el;
                  }
                });

                if (temp == null) {
                  this.count_res = 0;
                  this.total_count_res = 1;
                  this.util.loaderService.display(true);
                  this.forLocalCompany = [];
                  this.financialMarketData
                    .getInteractiveAnalysisQueryCompanySearch(
                      this.queryParamComparableList
                    )
                    .subscribe((res: any) => {
                      //Loader check
                      ++this.count_res;
                      this.util.checkCountValue(
                        this.total_count_res,
                        this.count_res
                      );
                      res['customLableCheck'] = true;
                      this.forLocalCompany.push(res);
                      localStorage.setItem(
                        'forLocalCompany',
                        JSON.stringify(this.forLocalCompany)
                      );
                      this.selectedCompany = JSON.parse(
                        localStorage.getItem('forLocalCompany') as any
                      );
                      if (
                        finalsplittedArray.length == this.selectedCompany.length
                      )
                        this.companyTabData();
                    });
                } else {
                  if (this.forLocalCompany == null) {
                    this.forLocalCompany = [];
                  }
                  let isRepeated: any = true;
                  this.forLocalCompany.forEach((element: any) => {
                    if (element.id == temp?.id) {
                      isRepeated = false;
                    }
                  });
                  if (isRepeated) {
                    this.forLocalCompany.push(temp);
                    localStorage.setItem(
                      'forLocalCompany',
                      JSON.stringify(this.forLocalCompany)
                    );
                    this.selectedCompany = JSON.parse(
                      localStorage.getItem('forLocalCompany') as any
                    );
                  } else {
                    this.selectedCompany = JSON.parse(
                      localStorage.getItem('forLocalCompany') as any
                    );
                    if (
                      finalsplittedArray.length ==
                      finalsplittedArrayIndex + 1
                    )
                      this.companyTabData();
                  }
                }
              }
            );
          } else {
            let temp: any = null;
            this.selectCompanyData.filter((el: any) => {
              if (el.id == this.queryParamComparableList) {
                temp = el;
              }
            });

            if (temp == null) {
              this.count_res = 0;
              this.total_count_res = 1;
              this.util.loaderService.display(true);
              this.forLocalCompany = [];
              this.financialMarketData
                .getInteractiveAnalysisQueryCompanySearch(
                  this.queryParamComparableList
                )
                .subscribe((res: any) => {
                  //Loader check
                  ++this.count_res;
                  this.util.checkCountValue(
                    this.total_count_res,
                    this.count_res
                  );
                  res['customLableCheck'] = true;
                  this.forLocalCompany.push(res);
                  localStorage.setItem(
                    'forLocalCompany',
                    JSON.stringify(this.forLocalCompany)
                  );
                  this.selectedCompany = JSON.parse(
                    localStorage.getItem('forLocalCompany') as any
                  );
                  this.companyTabData();
                });
            } else {
              if (this.forLocalCompany == null) {
                this.forLocalCompany = [];
              }
              let isRepeated: any = true;
              this.forLocalCompany.forEach((element: any) => {
                if (element.id == temp?.id) {
                  isRepeated = false;
                }
              });
              if (isRepeated) {
                this.forLocalCompany.push(temp);
                localStorage.setItem(
                  'forLocalCompany',
                  JSON.stringify(this.forLocalCompany)
                );
                this.selectedCompany = JSON.parse(
                  localStorage.getItem('forLocalCompany') as any
                );
              } else {
                this.selectedCompany = JSON.parse(
                  localStorage.getItem('forLocalCompany') as any
                );
              }
            }
          }

          this.metricesData.filter((el: any) => {
            if (el.fieldName == this.queryParamMetriceID) {
              if (this.forLocalCompanyMetrices == null) {
                this.forLocalCompanyMetrices = [];
              }
              let isRepeated: any = true;
              this.forLocalCompanyMetrices.forEach((element: any) => {
                if (element.fieldName == el.fieldName) {
                  isRepeated = false;
                }
              });
              if (isRepeated) {
                this.forLocalCompanyMetrices.push(el);
                localStorage.setItem(
                  'forLocalCompanyMetrices',
                  JSON.stringify(this.forLocalCompanyMetrices)
                );
                this.selectedCompanyMetrices = JSON.parse(
                  localStorage.getItem('forLocalCompanyMetrices') as any
                );
              } else {
                this.selectedCompanyMetrices = JSON.parse(
                  localStorage.getItem('forLocalCompanyMetrices') as any
                );
              }
            }
          });

          if (finalsplittedArray.length == 0) {
            if (
              this.selectedCompany.length &&
              this.selectedCompanyMetrices.length
            ) {
              this.companyTabData();
            }
          }
          this.util.loaderService.display(false);
        }, 1000);
      });
    }
  }

  queryParamEconomyType: any;
  queryParamEconomyIndicatorName: any;
  queryParamEconomyPeriodicity: any;
  queryParamEconomyCountryName: any;
  queryParamEconomyForexName: any;

  economyQueryParam() {
    $('#economyAcc').click();
    if (Object.keys((this.activateRoute.queryParams as any)?.value).length) {
      this.activateRoute.queryParams.subscribe((params: Params) => {
        this.selectedCurrency = params['currency'];
        this.queryParamEconomyType = params['type'];
        this.queryParamEconomyCountryName = params['countryName'];
        this.queryParamEconomyIndicatorName = params['indicatorName'];
        this.queryParamEconomyPeriodicity = params['indicatorPeriodcity'];
      });
      this.economyCountryData.filter((el: any) => {
        if (el.countryIsoCode3 == this.queryParamEconomyCountryName) {
          if (this.forLocalEconomyCountry == null) {
            this.forLocalEconomyCountry = [];
          }
          if (this.forLocalEconomyIndicator == null) {
            this.forLocalEconomyIndicator = [];
          }
          let isRepeat: any = true;
          this.forLocalEconomyCountry.forEach((element: any) => {
            if (element.id == el.id) {
              isRepeat = false;
            }
          });

          if (isRepeat) {
            this.forLocalEconomyCountry.push(el);
            localStorage.setItem(
              'forLocalEconomyCountry',
              JSON.stringify(this.forLocalEconomyCountry)
            );
            this.selectedEconomyCountryData = JSON.parse(
              localStorage.getItem('forLocalEconomyCountry') as any
            );
            this.getEconomyIndicatorData([el]);
          } else {
            this.selectedEconomyCountryData = JSON.parse(
              localStorage.getItem('forLocalEconomyCountry') as any
            );
            this.getEconomyIndicatorData([el]);
          }
        }
      });
    }
  }

  forexQueryParam() {
    $('#economyAcc').click();
    if (Object.keys((this.activateRoute.queryParams as any)?.value).length) {
      this.activateRoute.queryParams.subscribe((params: Params) => {
        this.queryParamEconomyCountryName = params['countryName'];
        this.queryParamEconomyForexName = params['forexName'];
      });
      this.economyCountryData.filter((el: any) => {
        if (el.countryIsoCode3 == this.queryParamEconomyCountryName) {
          if (this.forLocalEconomyCountry == null) {
            this.forLocalEconomyCountry = [];
          }
          let isRepeat: any = true;
          this.forLocalEconomyCountry.forEach((element: any) => {
            if (element.id == el.id) {
              isRepeat = false;
            }
          });

          if (isRepeat) {
            this.forLocalEconomyCountry.push(el);
            localStorage.setItem(
              'forLocalEconomyCountry',
              JSON.stringify(this.forLocalEconomyCountry)
            );
            this.selectedEconomyCountryData = JSON.parse(
              localStorage.getItem('forLocalEconomyCountry') as any
            );
            this.getEconomyIndicatorData(this.selectedEconomyCountryData);
            this.forexTabData();
          } else {
            this.selectedEconomyCountryData = JSON.parse(
              localStorage.getItem('forLocalEconomyCountry') as any
            );
            this.getEconomyIndicatorData(this.selectedEconomyCountryData);
            this.forexTabData();
          }
        }
      });
      this.selectForex.filter((el: any) => {
        if (el.id == this.queryParamEconomyForexName) {
          if (this.forLocalForex == null) {
            this.forLocalForex = [];
          }
          let isRepeat: any = true;
          this.forLocalForex.forEach((element: any) => {
            if (element.id == el.id) {
              isRepeat = false;
            }
          });

          if (isRepeat) {
            this.forLocalForex.push(el);
            localStorage.setItem(
              'forLocalForex',
              JSON.stringify(this.forLocalForex)
            );
            this.selectedForex = JSON.parse(
              localStorage.getItem('forLocalForex') as any
            );
            this.forexTabData();
          } else {
            this.selectedForex = JSON.parse(
              localStorage.getItem('forLocalForex') as any
            );
            this.forexTabData();
          }
        }
      });
    }
  }

  commodityQueryParam() {
    $('#commodityAcc').click();
    if (Object.keys((this.activateRoute.queryParams as any)?.value).length) {
      this.activateRoute.queryParams.subscribe((params: Params) => {
        this.selectedCurrency = params['currency'];
        this.selectedPeriod = params['periodcity'].toUpperCase();
        this.queryParamComparableList = params['comparableList'];
      });
      this.selectCommodityData.filter((el: any) => {
        if (el.symbol == this.queryParamComparableList) {
          if (this.forLocalCommodity == null) {
            this.forLocalCommodity = [];
          }
          let isRepeated: any = true;
          this.forLocalCommodity.forEach((element: any) => {
            if (element.symbol == el.symbol) {
              isRepeated = false;
            }
          });
          if (isRepeated) {
            this.forLocalCommodity.push(el);
            localStorage.setItem(
              'forLocalCommodity',
              JSON.stringify(this.forLocalCommodity)
            );
            this.selectedCommodity = JSON.parse(
              localStorage.getItem('forLocalCommodity') as any
            );
          } else {
            this.selectedCommodity = JSON.parse(
              localStorage.getItem('forLocalCommodity') as any
            );
          }
        }
      });
      this.commodityTabData('3M', 'init');
    }
  }

  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (event.path) {
      if (
        event.path[0].classList.value == 'forex' ||
        event.path[0].classList.value.includes('fa fa-caret-right')
      ) {
        document.getElementById('economy-forex-div')?.classList.toggle('show');
      } else if (event.path[0].tagName != 'INPUT') {
        let id: any = document.getElementById(this.tempExapandId);
        if (id != null) {
          let checkClass = id?.classList?.value;
          if (checkClass.includes('show')) {
            if (this.tempExapandIdCheck == 1) {
              id?.classList.remove('show');
              document
                .getElementById('economy-forex-div')
                ?.classList.remove('show');
              this.tempExapandIdCheck = 0;
            } else {
              this.tempExapandIdCheck++;
            }
          }
        }
      }
    } else {
      if (
        event.composedPath()[0].classList.value == 'forex' ||
        event.composedPath()[0].classList.value.includes('fa fa-caret-right')
      ) {
        document.getElementById('economy-forex-div')?.classList.toggle('show');
      } else if (event.composedPath()[0].tagName != 'INPUT') {
        let id: any = document.getElementById(this.tempExapandId);
        if (id != null) {
          let checkClass = id?.classList?.value;
          if (checkClass.includes('show')) {
            if (this.tempExapandIdCheck == 1) {
              id?.classList.remove('show');
              document
                .getElementById('economy-forex-div')
                ?.classList.remove('show');
              this.tempExapandIdCheck = 0;
            } else {
              this.tempExapandIdCheck++;
            }
          }
        }
      }
    }
  }

  previousAPI: any = null;
  searchCompany(event: any) {
    if (this.previousAPI != null) {
      this.previousAPI.unsubscribe();
    }
    let value = event.target.value;
    if (value.trim() == '') {
      this.selectCompanyData = this.tempSelectCompanyData;
    } else {
      this.previousAPI = this.financialMarketData
        .getInteractiveAnalysisCompanySearch(value)
        .subscribe((res: any) => {
          this.util.loaderService.display(true);
          setTimeout(() => {
            this.util.loaderService.display(false);
          }, 1000);
          this.selectCompanyData = res;
          this.selectCompanyData.forEach((el: any) => {
            el['customLableCheck'] = true;
          });

          this.selectCompanyData.forEach((x: any, index: any) => {
            this.selectedCompany.forEach((element: any) => {
              if (x.id == element.id) {
                this.selectCompanyData.splice(index, 1);
              }
            });
          });
        });
    }
  }

  analysisEmptyChart() {
    // Create chart instance
    let chart = am4core.create('chartdiv', am4charts.XYChart);
    $(document).ready(function () {
      $('g[aria-labelledby]').hide();
    });
    // Add data
    chart.data = [];

    chart.events.on('beforedatavalidated', (ev: any) => {
      if (ev.target.data.length === 0) {
        let indicator = (chart.tooltipContainer as any).createChild(
          am4core.Container
        );
        let indicatorLabel = indicator.createChild(am4core.Label);
        indicatorLabel.text = 'Please make selection from the panel';
        indicatorLabel.isMeasured = false;
        indicatorLabel.x = 350;
        indicatorLabel.y = 180;
        indicatorLabel.fontSize = 14;
        indicatorLabel.fill = am4core.color('#fff');
      }
    }); // Create axes
    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.minGridDistance = 50;
    dateAxis.renderer.line.strokeOpacity = 1;
    dateAxis.renderer.line.strokeWidth = 2;
    dateAxis.renderer.line.stroke = am4core.color('#ffc000');

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.line.strokeOpacity = 1;
    valueAxis.renderer.line.strokeWidth = 2;
    valueAxis.renderer.line.stroke = am4core.color('#ffc000');
  }

  getCurrencyData() {
    this.financialMarketData.getCurrency().subscribe((res: any) => {
      ++this.count_res;
      this.util.checkCountValue(this.total_count_res, this.count_res);
      let formattedData: any = [];
      res.forEach((element: any) => {
        formattedData.push({
          id: element.isoCode,
          text: element.currencyName + ' (' + element.isoCode + ')',
        });
        this.selectCurrencyData = formattedData;
      });
      this.selectForex = this.selectCurrencyData;
      this.selectForex.forEach((el: any) => {
        el['customLableCheck'] = true;
      });
    });
  }

  industryChoose(event: any) {
    this.industryChoice = event.target.value;
    if (this.selectedIndustryMetrices.length > 0) {
      this.industryTabData();
    }
  }

  getcompanyTabData() {
    this.financialMarketData
      .getInteractiveAnalysisCompany()
      .subscribe((res: any) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);
        this.selectCompanyData = this.tempSelectCompanyData = res;
        this.selectCompanyData.forEach((el: any) => {
          el['customLableCheck'] = true;
        });
        if (this.queryParamTabFrom == 'Company') {
          this.selectedEconomyCountryData = JSON.parse(
            localStorage.getItem('forLocalEconomyCountry') as any
          );
          this.selectedEconomyIndicatorData = JSON.parse(
            localStorage.getItem('forLocalEconomyIndicator') as any
          );
          this.selectedForex = JSON.parse(
            localStorage.getItem('forLocalForex') as any
          );
          this.selectedCommodity = JSON.parse(
            localStorage.getItem('forLocalCommodity') as any
          );
          this.forexTabData();
          this.economyTabData();
          this.commodityTabData('3M');
          this.companyQueryParam();
        }
      });
  }

  getIndustryCountryData() {
    this.financialMarketData
      .getInteractiveAnalysisCountry()
      .subscribe((res: any) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);
        this.selectIndustryCountryData = res;
        this.selectIndustryCountryData.forEach((el: any) => {
          el['customLableCheck'] = true;
        });
        this.selectIndustryCountryData.unshift({
          id: 0,
          countryName: 'World',
          customLableCheck: true,
        });
      });
  }

  getEconomyCountryData() {
    if (
      this.queryParamTabFrom == 'economy' ||
      this.queryParamTabFrom == 'forex'
    ) {
      this.selectedEconomyCountryData = JSON.parse(
        localStorage.getItem('forLocalEconomyCountry') as any
      );
    }
    this.financialMarketData
      .getInteractiveAnalysisEconomyCountry()
      .subscribe((res: any) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);
        this.economyCountryData = res;
        this.economyCountryData.forEach((el: any) => {
          el['customLableCheck'] = true;
        });
        if (this.queryParamTabFrom == 'economy') {
          this.selectedForex = JSON.parse(
            localStorage.getItem('forLocalForex') as any
          );
          this.selectedCompany = JSON.parse(
            localStorage.getItem('forLocalCompany') as any
          );
          this.selectedCompanyMetrices = JSON.parse(
            localStorage.getItem('forLocalCompanyMetrices') as any
          );
          this.selectedCommodity = JSON.parse(
            localStorage.getItem('forLocalCommodity') as any
          );
          this.economyQueryParam();
          this.forexTabData();
          this.companyTabData();
          this.commodityTabData('3M');
        }
        if (this.queryParamTabFrom == 'forex') {
          this.selectedEconomyIndicatorData = JSON.parse(
            localStorage.getItem('forLocalEconomyIndicator') as any
          );
          this.selectedCompany = JSON.parse(
            localStorage.getItem('forLocalCompany') as any
          );
          this.selectedCompanyMetrices = JSON.parse(
            localStorage.getItem('forLocalCompanyMetrices') as any
          );
          this.selectedCommodity = JSON.parse(
            localStorage.getItem('forLocalCommodity') as any
          );
          this.forexQueryParam();
          this.economyTabData();
          this.companyTabData();
          this.commodityTabData('3M');
        }
      });
  }

  getEconomyIndicatorData(value: any) {
    let temp: any = '';
    value.forEach((element: any) => {
      temp += `countryIsoCodeList=${element.countryIsoCode3}&`;
    });
    this.financialMarketData
      .getInteractiveAnalysisEconomyIndicator(temp)
      .subscribe((res: any) => {
        this.economyIndicatorData = res;
        this.economyIndicatorData.forEach((el: any) => {
          el['customLableCheck'] = true;
        });
        if (this.queryParamTabFrom == 'economy') {
          this.economyIndicatorData.filter((el: any) => {
            if (el.category == this.queryParamEconomyIndicatorName) {
              let isRepeat: any = true;
              this.forLocalEconomyIndicator.forEach((element: any) => {
                if (element.category == el.category) {
                  isRepeat = false;
                }
              });
              if (isRepeat) {
                this.forLocalEconomyIndicator.push(el);
                localStorage.setItem(
                  'forLocalEconomyIndicator',
                  JSON.stringify(this.forLocalEconomyIndicator)
                );
                this.selectedEconomyIndicatorData = JSON.parse(
                  localStorage.getItem('forLocalEconomyIndicator') as any
                );
                this.economyTabData();
              } else {
                this.selectedEconomyIndicatorData = JSON.parse(
                  localStorage.getItem('forLocalEconomyIndicator') as any
                );
                this.economyTabData();
              }
            }
          });
        }
      });
  }

  getMetricesData(industryParam: any) {
    let industryParams: any = [];
    industryParam.forEach((ele: any) => {
      if (!industryParams.includes(ele.industry)) {
        industryParams.push(ele.industry);
      }
    });

    this.financialMarketData
      .getInteractiveAnalysisMetrices(industryParams.join())
      .subscribe((res: any) => {
        this.metricesData = res;
        this.metricesData.push({
          id: 201,
          financialType: 'stock',
          displayOrder: '001',
          displayLevel: 'L0',
          fieldName: 'volume',
          description: 'Daily Volume',
          shortName: 'Daily Volume',
          factsetIndustry: 'Industrial',
          displayFlag: null,
          currencyFlag: 1,
          unit: 'Million',
          fxAod: 1,
          keyParameter: 1,
          keyParameterOrder: 1,
          section: null,
          isActive: 1,
          icFlag: 1,
          screenerFlag: 0,
          watchlistFlag: 1,
          financialField: null,
        });
        this.metricesData.push({
          id: 201,
          financialType: 'stock',
          displayOrder: '001',
          displayLevel: 'L0',
          fieldName: 'stock',
          description: 'Stock Price (closing)',
          shortName: 'Stock Price (closing)',
          factsetIndustry: 'Industrial',
          displayFlag: null,
          currencyFlag: 1,
          unit: 'Million',
          fxAod: 1,
          keyParameter: 1,
          keyParameterOrder: 1,
          section: null,
          isActive: 1,
          icFlag: 1,
          screenerFlag: 0,
          watchlistFlag: 1,
          financialField: null,
        });
        this.metricesData.forEach((el: any) => {
          el['customLableCheck'] = true;
        });
        this.metricesData.sort(function (a: any, b: any) {
          var keyA = a.shortName,
            keyB = b.shortName;
          // Compare the 2 dates
          if (keyA < keyB) return -1;
          if (keyA > keyB) return 1;
          return 0;
        });
      });
  }

  getMetricesDataIndustry(industryParam: any) {
    let industryParams: any = [];
    industryParam.forEach((ele: any) => {
      if (!industryParams.includes(ele.industry)) {
        industryParams.push(ele.industry);
      }
    });

    this.financialMarketData
      .getInteractiveAnalysisMetrices(industryParams.join())
      .subscribe((res: any) => {
        this.metricesDataindustry = res;
        this.metricesDataindustry.forEach((el: any) => {
          el['customLableCheck'] = true;
        });
        this.metricesDataindustry.sort(function (a: any, b: any) {
          var keyA = a.shortName,
            keyB = b.shortName;
          // Compare the 2 dates
          if (keyA < keyB) return -1;
          if (keyA > keyB) return 1;
          return 0;
        });
      });
  }

  getIndustryData() {
    this.financialMarketData
      .getInteractiveAnalysisIndustry()
      .subscribe((res: any) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);
        this.industryData = res;
        this.industryData.forEach((el: any) => {
          el['customLableCheck'] = true;
        });
      });
  }

  getCommodityData() {
    this.financialMarketData.getCommodityList().subscribe((res: any) => {
      ++this.count_res;
      this.util.checkCountValue(this.total_count_res, this.count_res);
      this.selectCommodityData = res;
      this.selectCommodityData.forEach((el: any) => {
        el['customLableCheck'] = true;
      });
      if (this.queryParamTabFrom == 'commodity') {
        this.selectedEconomyCountryData = JSON.parse(
          localStorage.getItem('forLocalEconomyCountry') as any
        );
        this.selectedEconomyIndicatorData = JSON.parse(
          localStorage.getItem('forLocalEconomyIndicator') as any
        );
        this.selectedForex = JSON.parse(
          localStorage.getItem('forLocalForex') as any
        );
        this.selectedCompany = JSON.parse(
          localStorage.getItem('forLocalCompany') as any
        );
        this.selectedCompanyMetrices = JSON.parse(
          localStorage.getItem('forLocalCompanyMetrices') as any
        );
        this.forexTabData();
        this.economyTabData();
        this.companyTabData();
        this.commodityQueryParam();
      }
    });
  }

  nodeFilter(event: any) {
    let nodes = Array.from(event.srcElement.parentElement.nextSibling.children);
    let value = event.target.value;
    nodes.forEach((element: any) => {
      if (element.innerText.toLowerCase().includes(value.toLowerCase())) {
        element.style.display = 'block';
      } else {
        element.style.display = 'none';
        if (element.nextElementSibling != null) {
        }
      }
    });
  }

  childNodeToggle(id: any, e: any) {
    e.stopPropagation();
    this.tempExapandId = id;
    if (id == 'company-metrices-div') {
      if (this.selectedCompany.length == 0) {
        this.alertmsg = 'Please select comparable Company first.';
        this.auth.closeInsidePopup = true;
      } else {
        document.getElementById(id)?.classList.toggle('show');
      }
    } else if (id == 'industry-metrices-div') {
      if (this.selectedIndustry.length == 0) {
        this.alertmsg = 'Please Select Industry First';
        this.auth.closeInsidePopup = true;
      } else {
        document.getElementById(id)?.classList.toggle('show');
      }
    } else if (id == 'economy-indicator-div') {
      if (this.selectedEconomyCountryData.length == 0) {
        this.alertmsg = 'Please select comparable Country first';
        this.auth.closeInsidePopup = true;
      } else {
        document.getElementById(id)?.classList.toggle('show');
      }
    } else {
      document.getElementById(id)?.classList.toggle('show');
    }
    const search: any = document.querySelector(`#${id} input`);
    search.focus();
  }

  selectedCompanyMetricsParam: any = [];
  selectedIndustryMetricsParams: any = [];
  listStyleClick(data: any, id: any, e: any) {
    if (id == 'company-div') {
      if (this.selectedCompany == null) {
        this.selectedCompany = [];
      }
      if (!this.selectedCompany.includes(data)) {
        this.stockVolumeTableDatas = [];

        if (e.path) {
          e.path[2].childNodes[0].children[0].value = '';
        } else {
          e.composedPath()[2].childNodes[0].children[0].value = '';
        }

        this.selectedCompanyMetricsParam.push({
          companyId: data.id,
          industry: data.ff_industry,
        });
        localStorage.setItem(
          'forLocalSelectedMetrics',
          JSON.stringify(this.selectedCompanyMetricsParam)
        );
        this.selectCompanyData = this.tempSelectCompanyData;
        this.selectedCompany.push(data);
        this.getMetricesData(this.selectedCompanyMetricsParam);
        this.companyTabData();

        localStorage.setItem(
          'companyLocal',
          JSON.stringify(this.selectedCompany)
        );
      }
    } else if (id == 'company-metrices-div') {
      if (this.selectedCompanyMetrices == null) {
        this.selectedCompanyMetrices = [];
      }
      if (!this.selectedCompanyMetrices.includes(data)) {
        this.stockVolumeTableDatas = [];

        let nodes: any;
        if (e.path) {
          e.path[2].childNodes[0].children[0].value = '';
          nodes = Array.from(e.path[2].childNodes[1].children);
        } else {
          e.composedPath()[2].childNodes[0].children[0].value = '';
          nodes = Array.from(e.composedPath()[2].childNodes[1].children);
        }
        nodes.forEach((element: any) => {
          element.style.display = 'block';
        });
        this.selectedCompanyMetrices.push(data);
        this.companyTabData();

        localStorage.setItem(
          'companyMetricesLocal',
          JSON.stringify(this.selectedCompanyMetrices)
        );
      }
    } else if (id == 'industry-div') {
      if (this.selectedIndustry == null) {
        this.selectedIndustry = [];
      }
      if (!this.selectedIndustry.includes(data)) {
        let nodes: any;
        if (e.path) {
          e.path[2].childNodes[0].children[0].value = '';
          nodes = Array.from(e.path[2].childNodes[1].children);
        } else {
          e.composedPath()[2].childNodes[0].children[0].value = '';
          nodes = Array.from(e.composedPath()[2].childNodes[1].children);
        }
        nodes.forEach((element: any) => {
          element.style.display = 'block';
        });
        this.selectedIndustryMetricsParams.push({
          industryId: data.industryId,
          industry: data.factsetIndustry,
        });
        localStorage.setItem(
          'forLocalIndustrySelectedMetrics',
          JSON.stringify(this.selectedIndustryMetricsParams)
        );
        this.selectedIndustry.push(data);
        this.getMetricesDataIndustry(this.selectedIndustryMetricsParams);
        this.industryTabData();

        localStorage.setItem(
          'industryLocal',
          JSON.stringify(this.selectedIndustry)
        );
      }
    } else if (id == 'industry-country-div') {
      if (this.selectedIndustryCountry == null) {
        this.selectedIndustryCountry = [];
      }
      if (!this.selectedIndustryCountry.includes(data)) {
        let nodes: any;
        if (e.path) {
          e.path[2].childNodes[0].children[0].value = '';
          nodes = Array.from(e.path[2].childNodes[1].children);
        } else {
          e.composedPath()[2].childNodes[0].children[0].value = '';
          nodes = Array.from(e.composedPath()[2].childNodes[1].children);
        }
        nodes.forEach((element: any) => {
          element.style.display = 'block';
        });
        this.selectedIndustryCountry.push(data);
        this.industryTabData();

        localStorage.setItem(
          'industryCountryLocal',
          JSON.stringify(this.selectedIndustryCountry)
        );
      }
    } else if (id == 'industry-metrices-div') {
      if (this.selectedIndustryMetrices == null) {
        this.selectedIndustryMetrices = [];
      }
      if (!this.selectedIndustryMetrices.includes(data)) {
        let nodes: any;
        if (e.path) {
          e.path[2].childNodes[0].children[0].value = '';
          nodes = Array.from(e.path[2].childNodes[1].children);
        } else {
          e.composedPath()[2].childNodes[0].children[0].value = '';
          nodes = Array.from(e.composedPath()[2].childNodes[1].children);
        }
        nodes.forEach((element: any) => {
          element.style.display = 'block';
        });
        this.selectedIndustryMetrices.push(data);
        this.industryTabData();

        localStorage.setItem(
          'industryMetricesLocal',
          JSON.stringify(this.selectedIndustryMetrices)
        );
      }
    } else if (id == 'economy-country-div') {
      if (this.selectedEconomyCountryData == null) {
        this.selectedEconomyCountryData = [];
      }
      if (!this.selectedEconomyCountryData.includes(data)) {
        let nodes: any;
        if (e.path) {
          e.path[2].childNodes[0].children[0].value = '';
          nodes = Array.from(e.path[2].childNodes[1].children);
        } else {
          e.composedPath()[2].childNodes[0].children[0].value = '';
          nodes = Array.from(e.composedPath()[2].childNodes[1].children);
        }
        nodes.forEach((element: any) => {
          element.style.display = 'block';
        });
        this.selectedEconomyCountryData.push(data);
        this.getEconomyIndicatorData(this.selectedEconomyCountryData);
        this.economyTabData();
        this.forexTabData();

        localStorage.setItem(
          'economyCountryLocal',
          JSON.stringify(this.selectedEconomyCountryData)
        );
      }
    } else if (id == 'economy-indicator-div') {
      if (this.selectedEconomyIndicatorData == null) {
        this.selectedEconomyIndicatorData = [];
      }
      if (!this.selectedEconomyIndicatorData.includes(data)) {
        let nodes: any;
        if (e.path) {
          e.path[2].childNodes[0].children[0].value = '';
          nodes = Array.from(e.path[2].childNodes[1].children);
        } else {
          e.composedPath()[2].childNodes[0].children[0].value = '';
          nodes = Array.from(e.composedPath()[2].childNodes[1].children);
        }
        nodes.forEach((element: any) => {
          element.style.display = 'block';
        });
        this.selectedEconomyIndicatorData.push(data);
        this.economyTabData();

        localStorage.setItem(
          'economyIndicatorLocal',
          JSON.stringify(this.selectedEconomyIndicatorData)
        );
      }
    } else if (id == 'economy-forex-div') {
      document
        .getElementById('economy-indicator-div')
        ?.classList.remove('show');
      if (this.selectedForex == null) {
        this.selectedForex = [];
      }
      if (!this.selectedForex.includes(data)) {
        let nodes: any;
        if (e.path) {
          e.path[2].childNodes[0].children[0].value = '';
          nodes = Array.from(e.path[2].childNodes[1].children);
        } else {
          e.composedPath()[2].childNodes[0].children[0].value = '';
          nodes = Array.from(e.composedPath()[2].childNodes[1].children);
        }
        nodes.forEach((element: any) => {
          element.style.display = 'block';
        });
        this.selectedForex.push(data);
        this.forexTabData();

        localStorage.setItem(
          'economyForexLocal',
          JSON.stringify(this.selectedForex)
        );
      }
    } else if (id == 'commodity-div') {
      if (this.selectedCommodity == null) {
        this.selectedCommodity = [];
      }
      if (!this.selectedCommodity.includes(data)) {
        let nodes: any;
        if (e.path) {
          e.path[2].childNodes[0].children[0].value = '';
          nodes = Array.from(e.path[2].childNodes[1].children);
        } else {
          e.composedPath()[2].childNodes[0].children[0].value = '';
          nodes = Array.from(e.composedPath()[2].childNodes[1].children);
        }
        nodes.forEach((element: any) => {
          element.style.display = 'block';
        });
        this.selectedCommodity.push(data);
        this.commodityTabData('3M');

        localStorage.setItem(
          'commodityLocal',
          JSON.stringify(this.selectedCommodity)
        );
      }
    }
    this.childNodeToggle(id, e);
  }

  removeListStyleData(data: any, id: any) {
    if (id == 'company-div') {
      const index = this.selectedCompany.indexOf(data);
      if (index > -1) {
        this.selectedCompany.splice(index, 1);
        if (this.selectedCompany.length == 0) {
          this.selectedCompanyMetrices = [];
          this.allCompanyDataTables = [];
          this.stockVolumeTableDatas = [];
          this.allCompanyStockDataTables = [];
          this.selectedCompanyMetricsParam = [];
          let temp: any = document.getElementById('companyChartCustom');
          let temp1: any = document.getElementById('companyStockChartCustom');
          temp.innerHTML = '';
          temp1.innerHTML = '';
          this.chartDataCheck();
        } else {
          this.selectedCompanyMetricsParam =
            this.selectedCompanyMetricsParam.filter(
              (item: any) => item.companyId !== data.id
            );
          this.stockVolumeTableDatas = [];
          this.allCompanyStockDataTables = [];
          this.getMetricesData(this.selectedCompanyMetricsParam);
          this.companyTabData();
        }
      }
    } else if (id == 'company-metrices-div') {
      const index = this.selectedCompanyMetrices.indexOf(data);
      this.stockVolumeTableDatas.map((el: any, index: any) => {
        if (el.tableTitle.includes(data.description)) {
          this.allCompanyStockDataTables.splice(index, 1);
          this.stockVolumeTableDatas.splice(index, 1);
        }
      });
      if (index > -1) {
        this.selectedCompanyMetrices.splice(index, 1);
        if (this.selectedCompanyMetrices.length == 0) {
          this.selectedCompanyMetrices = [];
          this.allCompanyDataTables = [];
          let temp: any = document.getElementById('companyChartCustom');
          let temp1: any = document.getElementById('companyStockChartCustom');
          temp.innerHTML = '';
          temp1.innerHTML = '';
          this.chartDataCheck();
        } else {
          this.stockVolumeTableDatas = [];
          this.allCompanyStockDataTables = [];
          this.companyTabData();
        }
      }
    } else if (id == 'industry-div') {
      const index = this.selectedIndustry.indexOf(data);
      if (index > -1) {
        this.selectedIndustry.splice(index, 1);
        if (this.selectedIndustry.length == 0) {
          this.allIndustryDataTables = [];
          this.selectedIndustryMetricsParams = [];
          let temp: any = document.getElementById('industryChartCustom');
          temp.innerHTML = '';
          this.chartDataCheck();
        } else {
          this.selectedIndustryMetricsParams =
            this.selectedIndustryMetricsParams.filter(
              (item: any) => item.industryId !== data.industryId
            );
          this.getMetricesDataIndustry(this.selectedIndustryMetricsParams);
          this.industryTabData();
        }
      }
    } else if (id == 'industry-country-div') {
      const index = this.selectedIndustryCountry.indexOf(data);
      if (index > -1) {
        this.selectedIndustryCountry.splice(index, 1);
        if (this.selectedIndustryCountry.length == 0) {
          this.allIndustryDataTables = [];
          let temp: any = document.getElementById('industryChartCustom');
          temp.innerHTML = '';
          this.chartDataCheck();
        } else {
          this.industryTabData();
        }
      }
    } else if (id == 'industry-metrices-div') {
      const index = this.selectedIndustryMetrices.indexOf(data);
      if (index > -1) {
        this.selectedIndustryMetrices.splice(index, 1);
        if (this.selectedIndustryMetrices.length == 0) {
          this.allIndustryDataTables = [];
          let temp: any = document.getElementById('industryChartCustom');
          temp.innerHTML = '';
          this.chartDataCheck();
        } else {
          this.industryTabData();
        }
      }
    } else if (id == 'economy-country-div') {
      const index = this.selectedEconomyCountryData.indexOf(data);
      if (index > -1) {
        this.selectedEconomyCountryData.splice(index, 1);
        if (this.selectedEconomyCountryData.length == 0) {
          this.selectedEconomyIndicatorData = [];
          this.selectedForex = [];

          this.allEconomyDataTables = [];
          this.allForexDataTables = [];

          let temp: any = document.getElementById('economyChartCustom');
          temp.innerHTML = '';
          let temp1: any = document.getElementById('forexChartCustom');
          temp1.innerHTML = '';
          this.chartDataCheck();
        } else {
          this.getEconomyIndicatorData(this.selectedEconomyCountryData);
          this.economyTabData();
          this.forexTabData();
        }
      }
    } else if (id == 'economy-indicator-div') {
      const index = this.selectedEconomyIndicatorData.indexOf(data);
      if (index > -1) {
        this.selectedEconomyIndicatorData.splice(index, 1);
        if (this.selectedEconomyIndicatorData.length == 0) {
          this.allEconomyDataTables = [];
          let temp: any = document.getElementById('economyChartCustom');
          temp.innerHTML = '';
          this.chartDataCheck();
        } else {
          this.economyTabData();
        }
      }
    } else if (id == 'economy-forex-div') {
      const index = this.selectedForex.indexOf(data);
      if (index > -1) {
        this.selectedForex.splice(index, 1);
        if (this.selectedForex.length == 0) {
          this.allForexDataTables = [];
          let temp: any = document.getElementById('forexChartCustom');
          temp.innerHTML = '';
          this.chartDataCheck();
        } else {
          this.forexTabData();
        }
      }
    } else if (id == 'commodity-div') {
      const index = this.selectedCommodity.indexOf(data);
      if (index > -1) {
        this.selectedCommodity.splice(index, 1);
        if (this.selectedCommodity.length == 0) {
          this.allCommodityDataTables = [];
          let temp: any = document.getElementById('commodityChartCustom');
          temp.innerHTML = '';
          this.chartDataCheck();
        } else {
          this.commodityTabData('3M');
        }
      }
    }
  }

  companyMetricDataToHide(data: any) {
    this.util.loaderService.display(true);
    setTimeout(() => {
      this.util.loaderService.display(false);
    }, 500);
    if (!data.customLableCheck) {
      (
        document.querySelector(`#${data.fieldName}analysisChart`) as any
      ).style.display = 'none';
      (
        document.querySelector(`#${data.fieldName}analysisChartImg`) as any
      ).style.display = 'none';
    } else {
      (
        document.querySelector(`#${data.fieldName}analysisChart`) as any
      ).style.display = 'block';
      (
        document.querySelector(`#${data.fieldName}analysisChartImg`) as any
      ).style.display = 'block';
    }
  }

  valueChangeHandler(type: any, data: any) {
    if (type === 'Currency') {
      if (this.selectCurrencyData && this.selectedCurrency !== data) {
        this.selectedCurrency = data;
        this.refreshData();
      }
    }
    if (type === 'Period') {
      if (this.selectPeriodData && this.selectedPeriod !== data) {
        this.selectedPeriod = data;
        this.refreshData();
      }
    }
  }

  refreshPage() {
    window.location.search = '';

    localStorage.removeItem('companyLocal');
    localStorage.removeItem('companyMetricesLocal');
    localStorage.removeItem('forLocalSelectedMetrics');

    localStorage.removeItem('industryLocal');
    localStorage.removeItem('industryCountryLocal');
    localStorage.removeItem('industryMetricesLocal');
    localStorage.removeItem('forLocalIndustrySelectedMetrics');

    localStorage.removeItem('economyCountryLocal');
    localStorage.removeItem('economyIndicatorLocal');
    localStorage.removeItem('economyForexLocal');

    localStorage.removeItem('commodityLocal');
  }

  refreshData() {
    this.companyTabData();
    this.industryTabData();
    this.economyTabData();
    this.commodityTabData('3M');
    this.forexTabData();
  }

  timeout: any = null;

  refreshDataStart(event?: any) {
    clearTimeout(this.timeout);

    this.timeout = setTimeout(() => {
      this.refreshData();
    }, 1000);
  }

  refreshDataEnd() {
    clearTimeout(this.timeout);

    this.timeout = setTimeout(() => {
      this.refreshData();
    }, 1000);
  }

  // ----------------- For Company Tab Data -------------------
  companyGroupData: any = [];
  stockAndVolumeData: any = [];

  companyTabData(type?: any) {
    let ticsIndustryCodes: any = [];
    let fieldNames: any = [];
    let lableCheck: boolean = true;
    let fieldType: any = [];
    if (this.selectedCompany != null) {
      this.selectedCompany.forEach((el: any) => {
        if (el.customLableCheck) {
          ticsIndustryCodes.push(el.id);
        }
      });
      this.selectedCompanyMetrices.forEach((el: any) => {
        if (el.customLableCheck) {
          fieldNames.push(el.fieldName);
          if (!fieldType.includes(el.financialType)) {
            fieldType.push(el.financialType);
          }
        }
      });
      // For checkinng all values are checked or not
      if (ticsIndustryCodes.length == 0 || fieldNames.length == 0) {
        lableCheck = false;
      }

      let splittedMetrics: any = [];
      fieldType.forEach((e: any) => {
        let temp: any = [];
        this.selectedCompanyMetrices.forEach((element: any) => {
          if (e == element.financialType) {
            temp.push(element);
          }
        });
        splittedMetrics.push(temp);
      });

      this.companyGroupData = [];
      this.stockAndVolumeData = [];
      let requestListsBody: any = [];

      if (lableCheck && this.selectedCompanyMetrices.length > 0) {
        splittedMetrics.forEach((element: any, index: any) => {
          let tempFieldNames: any = [];
          element.forEach((el: any) => {
            tempFieldNames.push(el.fieldName);
          });
          let body = {
            companyList: ticsIndustryCodes,
            endDate: this.endDate,
            fieldName: tempFieldNames,
            fieldType: element[0].financialType,
            periodicity: this.selectedPeriod,
            startDate: this.startDate,
            currency: this.selectedCurrency,
          };

          requestListsBody.push({ body: body, element: element });
        });

        if (type === 'init') {
          this.total_count_res += requestListsBody.length;
        } else {
          this.count_res = 0;
          this.total_count_res = requestListsBody.length;
          this.util.loaderService.display(true);
        }

        requestListsBody.forEach((el: any) => {
          this.financialMarketData
            .getCompanyDetailsData(el.body)
            .subscribe((res: any) => {
              ++this.count_res;
              this.util.checkCountValue(this.total_count_res, this.count_res);
              if (res[0].dataType == 'stock') {
                this.companyGroupData.push({
                  data: res,
                  alteredMetrices: el.element,
                  dataType: 'stock',
                });
              } else {
                this.companyGroupData.push({
                  data: res,
                  alteredMetrices: el.element,
                });
              }
              if (this.companyGroupData.length) {
                this.companyDataStructureFormation();
              }
              if (this.stockAndVolumeData.length) {
                this.companyDataStructureFormation();
              }
            });
        });
      } else {
        this.allCompanyDataTables = [];
        this.allCompanyStockDataTables = [];
        // If selected company is empty Remove element
        let d1: any = document.querySelector('#companyChartCustom');
        let d2: any = document.querySelector('#companyStockChartCustom');
        d1.innerHTML = '';
        d2.innerHTML = '';
        this.chartDataCheck();
      }
    }
  }

  // ----------------- For Industry Tab Data -------------------
  industryTabData(type?: any) {
    let countryId: any = [];
    let ticsIndustryCodes: any = [];
    let fieldNames: any = [];
    let lableCheck: boolean = true;

    this.selectedIndustry.forEach((el: any) => {
      if (el.customLableCheck) {
        ticsIndustryCodes.push(el.ticsIndustryCode);
      }
    });
    this.selectedIndustryCountry.forEach((el: any) => {
      if (el.customLableCheck) {
        countryId.push(el.id);
      }
    });
    this.selectedIndustryMetrices.forEach((el: any) => {
      if (el.customLableCheck) {
        fieldNames.push(el.fieldName);
      }
    });

    // For checkinng all values are checked or not
    if (
      ticsIndustryCodes.length == 0 ||
      countryId.length == 0 ||
      fieldNames.length == 0
    ) {
      lableCheck = false;
    }

    let body = {
      countryId: countryId,
      currency: this.selectedCurrency,
      endDate: this.endDate,
      fieldNames: fieldNames,
      ticsIndustryCodes: ticsIndustryCodes,
      periodicity: this.selectedPeriod,
      startDate: this.startDate,
    };
    if (lableCheck && this.selectedIndustryMetrices.length > 0) {
      if (type === 'init') {
        this.total_count_res += 1;
      } else {
        this.count_res = 0;
        this.total_count_res = 1;
        this.util.loaderService.display(true);
      }
      var temp: any = [];
      var selectedIndustryRef: any = [];
      this.financialMarketData
        .getCompanyIndustryData(body)
        .subscribe((res: any) => {
          temp.push(res);
          //Loader check
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);
          this.industryDataStructureFormation(res);
        });
    } else {
      this.allIndustryDataTables = [];

      // If selected industry is empty Remove element
      let d1: any = document.querySelector('#industryChartCustom');
      d1.innerHTML = '';
      this.chartDataCheck();
    }
  }

  // ----------------- For Economy Tab Data -------------------
  economyTabData(type?: any) {
    let countryId: any = [];
    let indicatorsList: any = [];
    let lableCheck: boolean = true;
    if (this.selectedEconomyCountryData != null)
      this.selectedEconomyCountryData.forEach((el: any) => {
        if (el.customLableCheck) {
          countryId.push(el.countryIsoCode3);
        }
      });
    if (this.selectedEconomyIndicatorData != null)
      this.selectedEconomyIndicatorData.forEach((el: any) => {
        if (el.customLableCheck) {
          indicatorsList.push({
            indicatorName: el.category,
            periodicity: el.periodType,
          });
        }
      });

    // For checkinng all values are checked or not
    if (countryId.length == 0 || indicatorsList.length == 0) {
      lableCheck = false;
    }

    let body = {
      countryList: countryId,
      endDate: this.endDate,
      fieldType: 'indicator',
      startDate: this.startDate,
      currencyList: [],
      indicators: indicatorsList,
      targetCurrency: this.selectedCurrency,
    };

    if (lableCheck && this.selectedEconomyIndicatorData.length > 0) {
      if (type === 'init') {
        this.total_count_res += body.indicators.length;
      } else {
        this.count_res = 0;
        this.total_count_res = body.indicators.length;
        this.util.loaderService.display(true);
      }
      let temp: any = [];
      var selectedEconomyRef: any = [];
      body.indicators.forEach((element: any, ind: any) => {
        body.indicators = [element];
        this.financialMarketData
          .getEconomyIndustryData(body)
          .subscribe((res: any) => {
            temp.push(res);
            //Loader check
            ++this.count_res;
            this.util.checkCountValue(this.total_count_res, this.count_res);
            // if (body.indicators.length == 1)
            if (this.selectedEconomyIndicatorData.length === temp.length) {
              this.selectedEconomyIndicatorData.forEach((ele: any) => {
                selectedEconomyRef.push(ele.category);
              });

              temp.sort((a: any, b: any) => {
                return (
                  selectedEconomyRef.indexOf(
                    a[0].indicatorsDataList[0].category
                  ) -
                  selectedEconomyRef.indexOf(
                    b[0].indicatorsDataList[0].category
                  )
                );
              });
              this.economyDataStructureFormation(temp);
            } else {
              return;
            }
          });
      });
    } else {
      // If selected economy is empty Remove element
      this.allEconomyDataTables = [];

      let d1: any = document.querySelector('#economyChartCustom');
      d1.innerHTML = '';
      this.chartDataCheck();
    }
  }

  // ----------------- For Economy Tab Data -------------------
  forexTabData(type?: any) {
    let countryId: any = [];
    let forexList: any = [];
    let lableCheck: boolean = true;

    if (this.selectedEconomyCountryData != null) {
      this.selectedEconomyCountryData.forEach((el: any) => {
        if (el.customLableCheck) {
          countryId.push(el.countryIsoCode3);
        }
      });
      if (this.selectedForex != null) {
        this.selectedForex.forEach((el: any) => {
          if (el.customLableCheck) {
            forexList.push(el.id);
          }
        });
      }

      // For checkinng all values are checked or not
      if (countryId.length == 0 || forexList.length == 0) {
        lableCheck = false;
      }

      let body = {
        countryList: countryId,
        endDate: this.endDate,
        fieldType: 'forex',
        startDate: this.startDate,
        currencyList: forexList,
        indicators: [],
        targetCurrency: this.selectedCurrency,
      };

      if (lableCheck && this.selectedForex.length > 0) {
        if (type === 'init') {
          this.total_count_res += 1;
        } else {
          this.count_res = 0;
          this.total_count_res = 1;
          this.util.loaderService.display(true);
        }
        this.financialMarketData
          .getEconomyIndustryData(body)
          .subscribe((res: any) => {
            //Loader check
            ++this.count_res;
            this.util.checkCountValue(this.total_count_res, this.count_res);
            this.forexDataStructureFormation(res);
          });
      } else {
        // If selected economy is empty Remove element
        this.allForexDataTables = [];

        let d1: any = document.querySelector('#forexChartCustom');
        d1.innerHTML = '';
        this.chartDataCheck();
      }
    }
  }

  // ----------------- For Commodity Tab Data -------------------
  commodityTabData(dateRangeGraph: any, type?: any) {
    let symbol: any = [];
    let lableCheck: boolean = true;

    if (this.selectedCommodity != null) {
      this.selectedCommodity.forEach((el: any) => {
        if (el.customLableCheck) {
          symbol.push(el.symbol);
        }
      });

      // For checkinng all values are checked or not
      if (symbol.length == 0) {
        lableCheck = false;
      }

      let body = {
        commoditySymbolList: symbol,
        endDate: this.endDate,
        startDate: this.startDate,
      };

      if (lableCheck && this.selectedCommodity.length > 0) {
        if (type === 'init') {
          this.total_count_res += 1;
        } else {
          this.count_res = 0;
          this.total_count_res = 1;
          this.util.loaderService.display(true);
        }
        this.commodityData = [];
        this.CommodityChartData = [];

        this.financialMarketData
          .getCommodityComparisonData(body)
          .subscribe((res: any) => {
            //Loader check
            ++this.count_res;
            this.util.checkCountValue(this.total_count_res, this.count_res);

            this.commodityData = res;

            this.util.setDateHandler(dateRangeGraph);

            this.selectedCommodity.forEach((element: any, index: any) => {
              if (element.customLableCheck) {
                let filterRangeData: any = this.commodityData.commodityDataMap[
                  element.symbol
                ].filter((el: any) => {
                  return new Date(el.period) > this.util.startDate ? el : '';
                });
                filterRangeData.forEach((el: any) => {
                  this.CommodityChartData.push({
                    date: el.period,
                    value: el.dailyChange,
                    name: el.name,
                  });
                });
              }
            });
            this.commodityChart();
            const type = '3M';
            if (type) {
              let temp: any = [];
              this.util.setDateHandler(type);
              this.selectedCommodity.forEach((element: any) => {
                let endDate =
                  this.commodityData.commodityDataMap[element.symbol][
                    this.commodityData.commodityDataMap[element.symbol].length -
                      1
                  ].period;
                this.util.endDate = new Date(endDate);
                let filterRangeData: any = this.commodityData.commodityDataMap[
                  element.symbol
                ].filter((el: any) => {
                  return new Date(el.period) > this.util.startDate ? el : '';
                });
                filterRangeData.forEach((el: any) => {
                  temp.push({
                    date: el.period,
                    value: el.dailyChange,
                    name: el.name,
                  });
                });
              });
              this.CommodityChartData = temp;
              this.commodityChart();
              this.dateChange('3M');
            }
            // this.commodityChart();
          });
      } else {
        // If selected commodity is empty Remove element
        this.allCommodityDataTables = [];

        let d1: any = document.querySelector('#commodityChartCustom');
        d1.innerHTML = '';
        this.chartDataCheck();
      }
    }
  }

  // checking chart is rendered or not
  chartDataCheck() {
    let temp1 = document.getElementById('companyChartCustom');
    let temp2 = document.getElementById('industryChartCustom');
    let temp3 = document.getElementById('economyChartCustom');
    let temp4 = document.getElementById('commodityChartCustom');
    let temp5 = document.getElementById('forexChartCustom');
    let temp6 = document.getElementById('companyStockChartCustom');

    if (
      (temp1 as any).childNodes.length ||
      (temp2 as any).childNodes.length ||
      (temp3 as any).childNodes.length ||
      (temp4 as any).childNodes.length ||
      (temp5 as any).childNodes.length ||
      (temp6 as any).childNodes.length
    ) {
      (document.getElementById('chartdiv') as any).style.display = 'none';
    } else {
      (document.getElementById('chartdiv') as any).style.display = 'block';
    }
    // this.dateChange("3M");
  }

  vRDailyMetrics: any = [
    't_enterprise_value',
    't_ev_ebit',
    't_ev_ebitda',
    't_ev_fcf',
    't_ev_sales',
    't_ex_cash_pe',
    't_mcap',
    't_price_cashflow',
    't_price_earnings',
    't_price_income',
    't_price_to_book_value',
    't_price_to_cash_eps',
    't_price_to_free_cash_flow',
    't_price_to_sales_ratio',
  ];

  //For company Data Structure Formation and graph
  companyDataStructureFormation() {
    let forChartData: any = [];
    let finalResult: any = [];
    // if (type == 'stock') {
    // this.stockAndVolumeData.forEach((x: any) => {
    //   x.alteredMetrices.forEach((element: any) => {
    //     let temp: any = [];
    //     x.data.forEach((element: any) => {
    //       temp.push(element.stockDataList);
    //     });
    //     temp['metricName'] = element.description;
    //     temp['fieldName'] = element.fieldName;
    //     finalResult.push(temp);
    //   });
    // });
    // } else {
    this.companyGroupData.forEach((x: any) => {
      if (x.dataType == 'stock') {
        x.alteredMetrices.forEach((element: any) => {
          let temp: any = [];
          x.data.forEach((element: any) => {
            temp.push(element.stockDataList);
          });
          temp['metricName'] = element.description;
          temp['fieldName'] = element.fieldName;
          temp.dataType = 'stock';
          finalResult.push(temp);
        });
      } else {
        x.alteredMetrices.forEach((element: any) => {
          x.data.forEach((e: any) => {
            if (e.financialDataList != null) {
              let temp = e.financialDataList.filter((el: any) => {
                if (element.fieldName == el.fieldName) return el;
              });
              forChartData.push(temp);
            }
          });
        });

        x.alteredMetrices.forEach((element: any) => {
          let temp: any = [];
          forChartData.forEach((el: any) => {
            if (element.fieldName == el[0]?.fieldName) {
              temp.push(el);
            }
          });
          finalResult.push(temp);
          temp['metricName'] = element.description;
          temp['fieldName'] = element.fieldName;
          if (this.vRDailyMetrics.includes(element.fieldName)) {
            temp['isVRDaily'] = true;
          } else {
            temp['isVRDaily'] = false;
          }
        });
      }
    });
    if (finalResult.length == this.selectedCompanyMetrices.length) {
      let companyMatrixArray: any = [];
      this.selectedCompanyMetrices.forEach((ele: any) => {
        companyMatrixArray.push(ele.description);
      });
      finalResult.sort((a: any, b: any) => {
        return (
          companyMatrixArray.indexOf(a.metricName) -
          companyMatrixArray.indexOf(b.metricName)
        );
      });
      // finalResult.forEach((ele: any) => {
      //   let index;
      //   if (ele.dataType == 'stock') {
      //     this.analysisCompanyChartForStock([ele]);
      //   }
      // });
      this.analysisCompanyChart(finalResult);
    } else {
      return;
    }
  }

  analysisCompanyChart(data: any) {
    this.cd.markForCheck();
    this.allCompanyDataTables = [];
    let mainElement: any = document.getElementById('companyChartCustom');
    let mainElementStock: any = document.getElementById(
      'companyStockChartCustom'
    );
    mainElement.innerHTML = '';
    mainElementStock.innerHTML = '';
    data.forEach((e: any) => {
      if (e.dataType == 'stock') {
        var d1: any, d2: any, d3: any;
        let NoDataContent: any = '';

        if (document.querySelector(`#${e?.fieldName}analysisChart`) == null) {
          d1 = document.createElement('div');
          d1.setAttribute('id', e?.fieldName + 'analysisChart');
          d1.setAttribute('style', 'min-height: 16rem;');
          d1.appendChild(document.createTextNode(''));

          d2 = document.createElement('img');
          d2.setAttribute('id', e?.fieldName + 'analysisChartImg');
          d2.setAttribute('src', 'assets/img/resize-icon.png');
          d2.setAttribute(
            'style',
            'position: relative; top: 2.1rem; left: 4rem;cursor:pointer;z-index: 1;'
          );

          d3 = document.createElement('p');
          d3.setAttribute(
            'style',
            'font-size: 12px;margin-left: 5rem;position: relative;top:6rem'
          );

          mainElementStock.appendChild(d1);
          $(`#companyStockChartCustom > div:last`).before(d2);
        } else {
          d1 = document.querySelector(`#${e?.fieldName}analysisChart`);
          d1.innerHTML = '';
        }

        am4core.options.commercialLicense = true;
        // Create chart instance
        let chart = am4core.create(
          e?.fieldName + 'analysisChart',
          am4charts.XYChart
        );
        // $(document).ready(function () {
        //   $('g[aria-labelledby]').hide();
        // });

        let currency = '';
        let unit = '';
        if (e[0] != undefined) {
          currency = e[0][0]?.currency ? e[0][0]?.currency : '';
          unit = e[0][0]?.unit ? ' ' + e[0][0]?.unit : '';
          !currency ? (unit = unit.trim()) : (unit = unit);
        }

        let title = chart.titles.create();
        if (e.metricName !== 'Daily Volume') {
          title.text =
            `Company - ` +
            e?.metricName +
            ` (${currency ? currency : ''}${unit ? unit : ''}) `;
          // title.text = `Company - ` + e?.metricName + ` (${currency}${unit}) `;
          if (unit == '' && currency == '') {
            title.text = title.text.split('(')[0].trim();
          }
        } else {
          title.text = `Company - ` + e?.metricName;
          // title.text = `Company - ` + e?.metricName + ` (${currency}${unit}) `;
          if (unit == '' && currency == '') {
            title.text = title.text.split('(')[0].trim();
          }
        }

        title.fontWeight = '500';
        title.fontSize = 15;
        title.marginBottom = 13;
        title.fill = am4core.color('#ffff');

        // Create axes
        let dateAxis: any = chart.xAxes.push(new am4charts.DateAxis());
        dateAxis.renderer.line.strokeOpacity = 1;
        dateAxis.renderer.line.strokeWidth = 2;
        dateAxis.renderer.line.stroke = am4core.color('#ffc000');
        dateAxis.renderer.labels.template.fill = am4core.color('#ffc000');
        dateAxis.renderer.labels.template.fontSize = 12;
        dateAxis.tooltip.background.cornerRadius = 3;
        dateAxis.tooltip.label.fontSize = 12;
        dateAxis.tooltip.label.padding(5, 5, 5, 5);
        dateAxis.tooltipDateFormat = 'dd-MM-yyyy';
        dateAxis.startLocation = 0.5;
        dateAxis.endLocation = 0.5;

        dateAxis.dateFormats.setKey('day', 'dd-MM-yy');
        dateAxis.dateFormats.setKey('month', 'MMM yyyy');
        dateAxis.dateFormats.setKey('week', 'dd-MM-yy');

        dateAxis.periodChangeDateFormats.setKey('day', 'dd-MM-yy');
        dateAxis.periodChangeDateFormats.setKey('month', 'MMM yyyy');
        dateAxis.periodChangeDateFormats.setKey('week', 'dd-MM-yy');

        let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        (valueAxis.tooltip as any).disabled = true;
        valueAxis.renderer.line.strokeOpacity = 1;
        valueAxis.renderer.line.strokeWidth = 2;
        valueAxis.renderer.line.stroke = am4core.color('#ffc000');
        valueAxis.renderer.labels.template.fill = am4core.color('#ffc000');
        valueAxis.renderer.labels.template.fontSize = 12;
        // valueAxis.numberFormatter = new am4core.NumberFormatter();
        // valueAxis.numberFormatter.numberFormat = '#.0a';
        valueAxis.renderer.labels.template.adapter.add(
          'text',
          (label: any, target: any) => {
            if (target.dataItem) {
              let data;
              if (Number(target.dataItem.value) > 1000) {
                return this.util.standardFormat(
                  Number(target.dataItem.value),
                  1,
                  ''
                );
              }
              return this.util.standardFormat(
                Number(target.dataItem.value),
                2,
                ''
              );
            }
          }
        );

        chart.data = [];
        let forCheck: any = [];

        // Add data
        this.selectedCompany.forEach((companyElement: any, z: any) => {
          if (companyElement.customLableCheck) {
            let temp: any = [];
            e?.forEach((elem: any) => {
              let temp1: any = [];
              elem?.forEach((x: any) => {
                if (companyElement.id == x.companyId) {
                  if (e.fieldName == 'stock' ? x.close : x.volume) {
                    temp1.push({
                      date: x.date,
                      value: e.fieldName == 'stock' ? x.close : x.volume,
                      company: companyElement.name,
                    });
                  }
                }
              });
              if (temp1.length) {
                temp.push(temp1);
              }
            });
            if (temp.length == 0) {
              temp[0] = [];
            }
            temp[0]['company'] = companyElement.name;
            forCheck.push(temp);
            if (e.metricName !== 'Daily Volume') {
              forCheck['tableTitle'] =
                `Company - ` +
                e?.metricName +
                ` (${currency ? currency : ''}${unit ? unit : ''}) `;
            } else {
              forCheck['tableTitle'] = `Company - ` + e?.metricName;
            }

            if (this.selectedCompany.length == z + 1)
              forCheck.forEach((z: any, i: any) => {
                z.forEach((element: any) => {
                  chart.data = element;
                  if (chart.data.length) {
                    let series = chart.series.push(new am4charts.LineSeries());
                    series.dataFields.valueY = 'value';
                    series.dataFields.dateX = 'date';
                    series.strokeWidth = 2;
                    series.minBulletDistance = 10;
                    series.stroke = am4core.color(this.colorList[i]);
                    series.fill = am4core.color(this.colorList[i]);
                    (series.tooltip as any).label.fontSize = 10;
                    // series.tooltipText = `[bold]{company} : {value}`;
                    (series?.tooltip as any).pointerOrientation = 'vertical';
                    series.data = chart.data;
                    let self = this;
                    series.adapter.add(
                      'tooltipHTML',
                      function (html: any, target: any) {
                        let data, company;
                        if (target.tooltipDataItem.dataContext) {
                          data = target.tooltipDataItem.dataContext.value;
                          company = target.tooltipDataItem.dataContext.company;
                          let formattedPrice = self.util.standardFormat(
                            data,
                            2,
                            ''
                          );
                          let customHtml =
                            '<p style="text-align: center' +
                            company +
                            data +
                            '</p>';
                          customHtml = formattedPrice;

                          return company + ' : ' + customHtml;
                        }
                        return html;
                      }
                    );
                  } else {
                    NoDataContent +=
                      `** No data Available for Company ` + element.company;
                  }
                });
              });
          }
        });

        let chartDataCheck = true;
        for (let x of forCheck) {
          if (x.length != 0) {
            chartDataCheck = false;
            break;
          }
        }

        chart.events.on('beforedatavalidated', (ev: any) => {
          if (chartDataCheck) {
            let indicator = (chart.tooltipContainer as any).createChild(
              am4core.Container
            );
            let indicatorLabel = indicator.createChild(am4core.Label);
            indicatorLabel.text = 'No Data Available';
            indicatorLabel.isMeasured = false;
            indicatorLabel.x = 520;
            indicatorLabel.y = 120;
            indicatorLabel.fontSize = 14;
            indicatorLabel.fill = am4core.color('#fff');
          } else {
            let data = NoDataContent.replaceAll(
              '** No data Available for Company ',
              ', '
            ).replace(',', '** No data Available for Company ');
            d3.appendChild(document.createTextNode(data));
            d1.appendChild(d3);
          }
        });

        d2.onclick = () => {
          this.chartDataGets(forCheck, title.text, 'companyStock');
        };
        this.stockVolumeTableDatas.push(forCheck);

        this.stockVolumeTableDatas = [
          ...new Map(
            this.stockVolumeTableDatas.map((x: any) => [JSON.stringify(x), x])
          ).values(),
        ];

        if (this.isChartOrTable == false) {
          this.stockVolumeTableData();
        }

        // Add cursor
        chart.cursor = new am4charts.XYCursor();
        chart.cursor.xAxis = dateAxis;
      } else {
        var d1: any, d2: any, d3: any;
        let NoDataContent: any = '';
        if (document.querySelector(`#${e?.fieldName}analysisChart`) == null) {
          d1 = document.createElement('div');
          d1.setAttribute('id', e?.fieldName + 'analysisChart');
          d1.setAttribute('style', 'min-height: 16rem;');
          d1.appendChild(document.createTextNode(''));

          d2 = document.createElement('img');
          d2.setAttribute('id', e?.fieldName + 'analysisChartImg');
          d2.setAttribute('src', 'assets/img/resize-icon.png');
          d2.setAttribute(
            'style',
            'position: relative; top: 2.1rem; left: 4rem;cursor:pointer;z-index: 1;'
          );

          d3 = document.createElement('p');
          d3.setAttribute(
            'style',
            'font-size: 12px;margin-left: 5rem;position: relative;top:6rem'
          );

          mainElement.appendChild(d1);
          $(`#companyChartCustom > div:last`).before(d2);
        } else {
          d1 = document.querySelector(`#${e?.fieldName}analysisChart`);
          d1.innerHTML = '';
        }

        // Create chart instance
        am4core.options.commercialLicense = true;

        let chart = am4core.create(
          e?.fieldName + 'analysisChart',
          am4charts.XYChart
        );
        // $(document).ready(function () {
        //   $('g[aria-labelledby]').hide();
        // });
        let currency = '';
        let unit = '';
        if (e[0] != undefined) {
          currency = e[0][0]?.currency ? e[0][0]?.currency : '';
          unit = e[0][0]?.unit ? ' ' + e[0][0]?.unit : '';
          !currency ? (unit = unit.trim()) : (unit = unit);
        }

        let title = chart.titles.create();
        title.text =
          `Company - ` +
          e?.metricName +
          ` (${currency ? currency : ''}${unit ? unit : ''}) `;
        if (unit == '' && currency == '') {
          title.text = title.text.split('(')[0].trim();
        }
        title.fontWeight = '500';
        title.fontSize = 15;
        title.marginBottom = 13;
        title.fill = am4core.color('#ffff');

        // Create axes
        let dateAxis: any = chart.xAxes.push(new am4charts.DateAxis());
        dateAxis.renderer.line.strokeOpacity = 1;
        dateAxis.renderer.line.strokeWidth = 2;
        dateAxis.renderer.line.stroke = am4core.color('#ffc000');
        dateAxis.renderer.labels.template.fill = am4core.color('#ffc000');
        dateAxis.renderer.labels.template.fontSize = 12;
        dateAxis.tooltip.background.cornerRadius = 3;
        dateAxis.tooltip.label.fontSize = 12;
        dateAxis.tooltip.label.padding(5, 5, 5, 5);
        dateAxis.startLocation = 0.5;
        dateAxis.endLocation = 0.5;
        if (e?.isVRDaily) {
          dateAxis.tooltipDateFormat = 'dd-MM-yyyy';

          dateAxis.dateFormats.setKey('day', 'dd-MM-yy');
          dateAxis.dateFormats.setKey('month', 'MMM yyyy');
          dateAxis.dateFormats.setKey('week', 'dd-MM-yy');

          dateAxis.periodChangeDateFormats.setKey('day', 'dd-MM-yy');
          dateAxis.periodChangeDateFormats.setKey('month', 'MMM yyyy');
          dateAxis.periodChangeDateFormats.setKey('week', 'dd-MM-yy');
        } else {
          dateAxis.skipEmptyPeriods = true;
          if (this.selectedPeriod === 'YEARLY') {
            dateAxis.tooltipDateFormat = 'yyyy';
            dateAxis.gridIntervals.setAll([{ timeUnit: 'year', count: 1 }]);
            dateAxis.dateFormats.setKey('day', 'yyyy');
            dateAxis.dateFormats.setKey('week', 'yyyy');
            dateAxis.dateFormats.setKey('month', 'yyyy');
            dateAxis.dateFormats.setKey('year', 'yyyy');
            dateAxis.periodChangeDateFormats.setKey('day', 'yyyy');
            dateAxis.periodChangeDateFormats.setKey('week', 'yyyy');
            dateAxis.periodChangeDateFormats.setKey('month', 'yyyy');
            dateAxis.periodChangeDateFormats.setKey('year', 'yyyy');
          } else if (this.selectedPeriod == 'QUARTERLY') {
            dateAxis.tooltipDateFormat = 'MMM yyyy';
            dateAxis.dateFormats.setKey('day', 'MMM yyyy');
            dateAxis.dateFormats.setKey('week', 'MMM yyyy');
            dateAxis.dateFormats.setKey('month', 'MMM yyyy');
            dateAxis.dateFormats.setKey('year', 'yyyy');
            dateAxis.periodChangeDateFormats.setKey('day', 'MMM yyyy');
            dateAxis.periodChangeDateFormats.setKey('week', 'MMM yyyy');
            dateAxis.periodChangeDateFormats.setKey('month', 'MMM yyyy');
            dateAxis.periodChangeDateFormats.setKey('year', 'yyyy');
          }
        }

        let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        (valueAxis.tooltip as any).disabled = true;
        valueAxis.renderer.line.strokeOpacity = 1;
        valueAxis.renderer.line.strokeWidth = 2;
        valueAxis.renderer.line.stroke = am4core.color('#ffc000');
        valueAxis.renderer.labels.template.fill = am4core.color('#ffc000');
        valueAxis.renderer.labels.template.fontSize = 12;
        // valueAxis.numberFormatter = new am4core.NumberFormatter();
        // valueAxis.numberFormatter.numberFormat = '#.0a';
        valueAxis.renderer.labels.template.adapter.add(
          'text',
          (label: any, target: any) => {
            if (target.dataItem) {
              let data;
              if (Number(target.dataItem.value) > 1000) {
                return this.util.standardFormat(
                  Number(target.dataItem.value),
                  1,
                  ''
                );
              }
              return this.util.standardFormat(
                Number(target.dataItem.value),
                2,
                ''
              );
            }
          }
        );

        chart.data = [];
        let forCheck: any = [];

        // Add data
        this.selectedCompany.forEach((companyElement: any, i: any) => {
          if (companyElement.customLableCheck) {
            let temp: any = [];
            if (e.isVRDaily) {
              e.forEach((element: any) => {
                element = element?.sort((a: any, b: any) => {
                  let date: any = new Date(b.period);
                  let date1: any = new Date(a.period);

                  return date - date1;
                });
              });
            }
            e.forEach((elem: any) => {
              let fieldMonth: any = new Date(elem[0].period).toLocaleString(
                'default',
                {
                  month: 'short',
                }
              );
              let temp1: any = [];
              let isVRDailyLocal: any = e.isVRDaily;
              elem.forEach((e: any) => {
                if (companyElement.id == e.companyId) {
                  if (e.data) {
                    temp1.push({
                      date:
                        this.selectedPeriod == 'YEARLY' && !isVRDailyLocal
                          ? `${new Date(e.period).getFullYear()}-01-01`
                          : e.period,
                      value: e.data,
                      company: isVRDailyLocal
                        ? `${companyElement.name}`
                        : `${companyElement.name} (${fieldMonth})`,
                      isVRDaily: isVRDailyLocal,
                    });
                  }
                }
              });
              if (temp1.length) {
                temp.push(temp1);
              }
            });
            if (temp.length == 0) {
              temp[0] = [];
            }
            forCheck.push(temp);

            temp.forEach((element: any) => {
              chart.data = element;
              if (chart.data.length) {
                let series = chart.series.push(new am4charts.LineSeries());
                series.dataFields.valueY = 'value';
                series.dataFields.dateX = 'date';
                series.strokeWidth = 2;
                series.minBulletDistance = 10;
                series.stroke = am4core.color(this.colorList[i]);
                series.fill = am4core.color(this.colorList[i]);
                (series.tooltip as any).label.fontSize = 10;
                // series.tooltipText = `[bold]{company} : {value}`;
                (series?.tooltip as any).pointerOrientation = 'vertical';
                series.data = chart.data;
                let self = this;
                series.adapter.add(
                  'tooltipHTML',
                  function (html: any, target: any) {
                    let data, company;
                    if (target.tooltipDataItem.dataContext) {
                      data = target.tooltipDataItem.dataContext.value;
                      company = target.tooltipDataItem.dataContext.company;
                      let formattedPrice = self.util.standardFormat(
                        data,
                        2,
                        ''
                      );
                      let customHtml =
                        '<p style="text-align: center' +
                        company +
                        data +
                        '</p>';
                      customHtml = formattedPrice;

                      return company + ' : ' + customHtml;
                    }
                    return html;
                  }
                );
              } else {
                NoDataContent +=
                  `** No data Available for Company ` + companyElement.name;
              }
            });
          }
        });

        let chartDataCheck = true;
        for (let x of forCheck) {
          if (x.length != 0) {
            chartDataCheck = false;
            break;
          }
        }

        chart.events.on('beforedatavalidated', (ev: any) => {
          if (chartDataCheck) {
            let indicator = (chart.tooltipContainer as any).createChild(
              am4core.Container
            );
            let indicatorLabel = indicator.createChild(am4core.Label);
            indicatorLabel.text = 'No Data Available';
            indicatorLabel.isMeasured = false;
            indicatorLabel.x = 520;
            indicatorLabel.y = 120;
            indicatorLabel.fontSize = 14;
            indicatorLabel.fill = am4core.color('#fff');
          } else {
            let data = NoDataContent.replaceAll(
              '** No data Available for Company ',
              ', '
            ).replace(',', '** No data Available for Company ');
            d3.appendChild(document.createTextNode(data));
            d1.appendChild(d3);
          }
        });

        d2.onclick = () => {
          this.chartDataGets(forCheck, title.text, 'company');
        };

        // Add chart's data into a table
        let tableData: any = [];
        let finalForCheck: any = [];
        forCheck.forEach((element: any) => {
          finalForCheck.push(element[0].sort().reverse());
        });

        let tempComp: any = [];
        finalForCheck
          .sort()
          .reverse()
          .forEach((element: any, index: any) => {
            if (element.length) {
              tempComp.push(element[0]?.company ?? element[0][0]?.company);
              element.forEach((el: any, i: any) => {
                if (this.selectedPeriod == 'YEARLY') {
                  let temp: any = {};
                  if (index == 0) {
                    if (el?.isVRDaily) {
                      temp['Date'] = el.date;
                    } else {
                      temp['Date'] = new Date(el.date).getFullYear();
                    }
                    temp[`${el.company}`] = el.value
                      ? this.util.standardFormat(el.value, 2, '')
                      : '-';
                    // temp[
                    //   `${el.company} (${
                    //     this.monthNames[new Date(el.date).getMonth()]
                    //   })`
                    // ] = el.value ? this.util.standardFormat(el.value, 2, '') : '-';
                    if (tableData.indexOf(el) === -1) {
                      tableData.push(temp);
                    }
                  } else {
                    tableData.forEach((e: any, ind: any) => {
                      if (el?.isVRDaily) {
                        if (e.Date == el.date) {
                          tableData[ind][`${el.company}`] = el.value
                            ? this.util.standardFormat(el.value, 2, '')
                            : '-';
                        }
                      } else {
                        if (e.Date == new Date(el.date).getFullYear()) {
                          tableData[ind][`${el.company}`] = el.value
                            ? this.util.standardFormat(el.value, 2, '')
                            : '-';
                        }
                      }
                    });
                  }
                } else if (this.selectedPeriod == 'QUARTERLY') {
                  let temp: any = {};
                  if (el?.isVRDaily) {
                    temp['Date'] = el.date;
                  } else {
                    temp['Date'] = `${
                      this.monthNames[new Date(el.date).getMonth()]
                    }-${new Date(el.date).getFullYear()}`;
                  }
                  temp[`${el.company}`] = el.value
                    ? this.util.standardFormat(el.value, 2, '')
                    : '-';
                  let isDateRepeat: boolean = true;
                  tableData.forEach((element: any, index: any) => {
                    if (element.Date == temp['Date']) {
                      isDateRepeat = false;
                      tableData[index][`${el.company}`] = el.value
                        ? this.util.standardFormat(el.value, 2, '')
                        : '-';
                    }
                  });
                  if (isDateRepeat) {
                    tableData.push(temp);
                  }

                  if (finalForCheck.length - 1 == index) {
                    tableData.forEach((element: any) => {
                      tempComp.forEach((el: any) => {
                        if (!Object.keys(element).includes(el)) {
                          element[el] = '-';
                        }
                      });
                    });
                  }
                }
              });
            }
          });

        if (tableData.length) {
          // Adding empty value if its not there
          let maxlength: any = 0;
          let maxlengthId: any = 0;

          tableData.forEach((element: any, index: any) => {
            if (Object.keys(element).length > maxlength) {
              maxlength = Object.keys(element).length;
              maxlengthId = index;
            }
          });

          let tempKeys = Object.keys(tableData[maxlengthId]);

          tableData.forEach((element: any) => {
            tempKeys.forEach((el: any) => {
              if (!Object.keys(element).includes(el)) {
                element[el] = '-';
              }
            });
          });

          tableData.sort((a: any, b: any) => a.Date - b.Date).reverse();

          this.allCompanyDataTables.push(tableData);

          let curUnit;
          if (currency && unit) {
            curUnit = `(${currency}${unit})`;
          } else if (currency && !unit) {
            curUnit = `(${currency.trim()})`;
          } else if (!currency && unit) {
            curUnit = `(${unit})`;
          }
          curUnit = curUnit ?? '';

          this.allCompanyDataTables[this.allCompanyDataTables.length - 1][
            'tableTitle'
          ] = `Company - ` + e?.metricName + ' ' + curUnit;
        }

        // Add cursor
        chart.cursor = new am4charts.XYCursor();
        chart.cursor.xAxis = dateAxis;
      }
    });
    this.chartDataCheck();
  }

  companyStockDataStructureFormation() {
    let forChartData: any = [];
    this.stockAndVolumeData.forEach((x: any) => {
      x.alteredMetrices.forEach((element: any) => {
        let temp: any = [];
        x.data.forEach((element: any) => {
          temp.push(element.stockDataList);
        });
        temp['metricName'] = element.description;
        temp['fieldName'] = element.fieldName;
        forChartData.push(temp);
      });
    });
    this.analysisCompanyChartForStock(forChartData);
  }

  analysisCompanyChartForStock(data: any) {
    this.cd.markForCheck();
    this.allCompanyStockDataTables = [];
    this.stockVolumeTableDatas = [];
    var mainElement: any = document.getElementById('companyStockChartCustom');
    mainElement.innerHTML = '';
    data.forEach((e: any) => {
      var d1: any, d2: any, d3: any;
      let NoDataContent: any = '';

      if (document.querySelector(`#${e?.fieldName}analysisChart`) == null) {
        d1 = document.createElement('div');
        d1.setAttribute('id', e?.fieldName + 'analysisChart');
        d1.setAttribute('style', 'min-height: 16rem;');
        d1.appendChild(document.createTextNode(''));

        d2 = document.createElement('img');
        d2.setAttribute('id', e?.fieldName + 'analysisChartImg');
        d2.setAttribute('src', 'assets/img/resize-icon.png');
        d2.setAttribute(
          'style',
          'position: relative; top: 2.1rem; left: 4rem;cursor:pointer;z-index: 1;'
        );

        d3 = document.createElement('p');
        d3.setAttribute(
          'style',
          'font-size: 12px;margin-left: 5rem;position: relative;top:6rem'
        );

        mainElement.appendChild(d1);
        $(`#companyStockChartCustom > div:last`).before(d2);
      } else {
        d1 = document.querySelector(`#${e?.fieldName}analysisChart`);
        d1.innerHTML = '';
      }

      // Create chart instance
      let chart = am4core.create(
        e?.fieldName + 'analysisChart',
        am4charts.XYChart
      );
      // $(document).ready(function () {
      //   $('g[aria-labelledby]').hide();
      // });

      let currency = '';
      let unit = '';
      if (e[0] != undefined) {
        currency = e[0][0]?.currency ? e[0][0]?.currency : '';
        unit = e[0][0]?.unit ? ' ' + e[0][0]?.unit : '';
        !currency ? (unit = unit.trim()) : (unit = unit);
      }

      let title = chart.titles.create();
      if (e.metricName !== 'Daily Volume') {
        title.text =
          `Company - ` +
          e?.metricName +
          ` (${currency ? currency : ''}${unit ? unit : ''}) `;
        // title.text = `Company - ` + e?.metricName + ` (${currency}${unit}) `;
        if (unit == '' && currency == '') {
          title.text = title.text.split('(')[0].trim();
        }
      } else {
        title.text = `Company - ` + e?.metricName;
        // title.text = `Company - ` + e?.metricName + ` (${currency}${unit}) `;
        if (unit == '' && currency == '') {
          title.text = title.text.split('(')[0].trim();
        }
      }

      title.fontWeight = '500';
      title.fontSize = 15;
      title.marginBottom = 13;
      title.fill = am4core.color('#ffff');

      // Create axes
      let dateAxis: any = chart.xAxes.push(new am4charts.DateAxis());
      dateAxis.renderer.line.strokeOpacity = 1;
      dateAxis.renderer.line.strokeWidth = 2;
      dateAxis.renderer.line.stroke = am4core.color('#ffc000');
      dateAxis.renderer.labels.template.fill = am4core.color('#ffc000');
      dateAxis.renderer.labels.template.fontSize = 12;
      dateAxis.tooltip.background.cornerRadius = 3;
      dateAxis.tooltip.label.fontSize = 12;
      dateAxis.tooltip.label.padding(5, 5, 5, 5);
      dateAxis.tooltipDateFormat = 'dd-MM-yyyy';
      dateAxis.startLocation = 0.5;
      dateAxis.endLocation = 0.5;

      dateAxis.dateFormats.setKey('day', 'yyyy');
      dateAxis.dateFormats.setKey('week', 'yyyy');
      dateAxis.dateFormats.setKey('month', 'yyyy');
      dateAxis.dateFormats.setKey('year', 'yyyy');
      dateAxis.periodChangeDateFormats.setKey('day', 'yyyy');
      dateAxis.periodChangeDateFormats.setKey('week', 'yyyy');
      dateAxis.periodChangeDateFormats.setKey('month', 'yyyy');
      dateAxis.periodChangeDateFormats.setKey('year', 'yyyy');

      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      (valueAxis.tooltip as any).disabled = true;
      valueAxis.renderer.line.strokeOpacity = 1;
      valueAxis.renderer.line.strokeWidth = 2;
      valueAxis.renderer.line.stroke = am4core.color('#ffc000');
      valueAxis.renderer.labels.template.fill = am4core.color('#ffc000');
      valueAxis.renderer.labels.template.fontSize = 12;
      // valueAxis.numberFormatter = new am4core.NumberFormatter();
      // valueAxis.numberFormatter.numberFormat = '#.0a';
      valueAxis.renderer.labels.template.adapter.add(
        'text',
        (label: any, target: any) => {
          if (target.dataItem) {
            let data;
            if (Number(target.dataItem.value) > 1000) {
              return this.util.standardFormat(
                Number(target.dataItem.value),
                1,
                ''
              );
            }
            return this.util.standardFormat(
              Number(target.dataItem.value),
              2,
              ''
            );
          }
        }
      );

      chart.data = [];
      let forCheck: any = [];

      // Add data
      this.selectedCompany.forEach((companyElement: any, z: any) => {
        if (companyElement.customLableCheck) {
          let temp: any = [];
          e?.forEach((elem: any) => {
            let temp1: any = [];
            elem?.forEach((x: any) => {
              if (companyElement.id == x.companyId) {
                if (e.fieldName == 'stock' ? x.close : x.volume) {
                  temp1.push({
                    date: x.date,
                    value: e.fieldName == 'stock' ? x.close : x.volume,
                    company: companyElement.name,
                  });
                }
              }
            });
            if (temp1.length) {
              temp.push(temp1);
            }
          });
          if (temp.length == 0) {
            temp[0] = [];
          }
          temp[0]['company'] = companyElement.name;
          forCheck.push(temp);
          if (e.metricName !== 'Daily Volume') {
            forCheck['tableTitle'] =
              `Company - ` +
              e?.metricName +
              ` (${currency ? currency : ''}${unit ? unit : ''}) `;
          } else {
            forCheck['tableTitle'] = `Company - ` + e?.metricName;
          }

          if (this.selectedCompany.length == z + 1)
            forCheck.forEach((z: any, i: any) => {
              z.forEach((element: any) => {
                chart.data = element;
                if (chart.data.length) {
                  let series = chart.series.push(new am4charts.LineSeries());
                  series.dataFields.valueY = 'value';
                  series.dataFields.dateX = 'date';
                  series.strokeWidth = 2;
                  series.minBulletDistance = 10;
                  series.stroke = am4core.color(this.colorList[i]);
                  series.fill = am4core.color(this.colorList[i]);
                  (series.tooltip as any).label.fontSize = 10;
                  // series.tooltipText = `[bold]{company} : {value}`;
                  (series?.tooltip as any).pointerOrientation = 'vertical';
                  series.data = chart.data;
                  let self = this;
                  series.adapter.add(
                    'tooltipHTML',
                    function (html: any, target: any) {
                      let data, company;
                      if (target.tooltipDataItem.dataContext) {
                        data = target.tooltipDataItem.dataContext.value;
                        company = target.tooltipDataItem.dataContext.company;
                        let formattedPrice = self.util.standardFormat(
                          data,
                          2,
                          ''
                        );
                        let customHtml =
                          '<p style="text-align: center' +
                          company +
                          data +
                          '</p>';
                        customHtml = formattedPrice;

                        return company + ' : ' + customHtml;
                      }
                      return html;
                    }
                  );
                } else {
                  NoDataContent +=
                    `** No data Available for Company ` + element.company;
                }
              });
            });
        }
      });

      let chartDataCheck = true;
      for (let x of forCheck) {
        if (x.length != 0) {
          chartDataCheck = false;
          break;
        }
      }

      chart.events.on('beforedatavalidated', (ev: any) => {
        if (chartDataCheck) {
          let indicator = (chart.tooltipContainer as any).createChild(
            am4core.Container
          );
          let indicatorLabel = indicator.createChild(am4core.Label);
          indicatorLabel.text = 'No Data Available';
          indicatorLabel.isMeasured = false;
          indicatorLabel.x = 520;
          indicatorLabel.y = 120;
          indicatorLabel.fontSize = 14;
          indicatorLabel.fill = am4core.color('#fff');
        } else {
          let data = NoDataContent.replaceAll(
            '** No data Available for Company ',
            ', '
          ).replace(',', '** No data Available for Company ');
          d3.appendChild(document.createTextNode(data));
          d1.appendChild(d3);
        }
      });

      d2.onclick = () => {
        this.chartDataGets(forCheck, title.text, 'companyStock');
      };
      this.stockVolumeTableDatas.push(forCheck);
      if (this.isChartOrTable == false) {
        this.stockVolumeTableData();
      }

      // Add cursor
      chart.cursor = new am4charts.XYCursor();
      chart.cursor.xAxis = dateAxis;
    });
    this.chartDataCheck();
  }

  stockVolumeTableDatas: any = [];
  stockVolumeTableData() {
    this.allCompanyStockDataTables = [];
    // Add chart's data into a table
    this.stockVolumeTableDatas.forEach((element: any) => {
      let tableData: any = [];
      let vsk1 = element.sort().reverse();
      let abc: any = [];
      for (let index = 0; index < vsk1.length; index++) {
        abc = [...abc, ...vsk1[index][0]];
      }
      let vikranrt: any = [];
      abc.reduce((groups: any, game: any) => {
        const date = game.date;
        if (!groups[date]) {
          groups[date] = [];
        }
        vikranrt.push({
          [`${game.company}`]: game.value
            ? this.util.standardFormat(game.value, 2, '')
            : '-',
          Date: game.date,
        });
        return groups;
      }, {});

      let newData = vikranrt.reduce(function (acc: any, curr: any) {
        let findIndex = acc.findIndex(function (item: any) {
          return item.Date === curr.Date;
        });
        if (findIndex === -1) {
          acc.push(curr);
        } else {
          acc[findIndex] = Object.assign({}, acc[findIndex], curr);
        }
        return acc;
      }, []);

      tableData = newData;
      if (tableData.length) {
        // Adding empty value if its not there
        let maxlength: any = 0;
        let maxlengthId: any = 0;

        tableData.forEach((element: any, index: any) => {
          if (Object.keys(element).length > maxlength) {
            maxlength = Object.keys(element).length;
            maxlengthId = index;
          }
        });

        let tempKeys = Object.keys(tableData[maxlengthId]);

        tableData.forEach((element: any) => {
          tempKeys.forEach((el: any) => {
            if (!Object.keys(element).includes(el)) {
              element[el] = '-';
            }
          });
        });

        tableData.sort((a: any, b: any) => a.Date - b.Date).reverse();
        this.allCompanyStockDataTables.push(tableData);
        this.allCompanyStockDataTables[
          this.allCompanyStockDataTables.length - 1
        ]['tableTitle'] = element['tableTitle'];
      }
    });
  }

  //For Industry Data Structure Formation and graph
  industryDataStructureFormation(data: any) {
    let forChartData: any = [];

    this.selectedIndustryMetrices.forEach((element: any) => {
      let temp = data.filter((el: any) => {
        if (element.customLableCheck) {
          if (element.fieldName == el.fieldName) return el;
        }
      });
      temp['metriceName'] = element.description;
      forChartData.push(temp);
    });
    this.industryChart(forChartData);
  }

  industryChart(data: any) {
    var mainElement: any = document.getElementById('industryChartCustom');
    mainElement.innerHTML = '';

    let countryWiseSplittedData: any = [];
    let industrySplittedData: any = [];
    let checkIndex = 1;
    this.allIndustryDataTables = [];
    data.forEach((e: any, index: any) => {
      if (this.industryChoice == 'country') {
        // For remving industry chart
        this.selectedIndustry.forEach((industryElement: any) => {
          checkIndex++;
          if (
            document.querySelector(
              `#industryChart${industryElement?.id + '' + checkIndex}`
            ) != null
          ) {
            var d1: any = document.querySelector(
              `#industryChart${industryElement?.id + '' + checkIndex}`
            );
            d1.innerHTML = '';
          }
        });
        // For add country chart
        this.selectedIndustryCountry.forEach((industryCountryElement: any) => {
          if (industryCountryElement.customLableCheck) {
            checkIndex++;
            let d1: any, d2: any, d3: any;
            if (
              document.querySelector(
                `#countryChart${industryCountryElement?.id + '' + checkIndex}`
              ) == null
            ) {
              d1 = document.createElement('div');
              d1.setAttribute(
                'id',
                'countryChart' + industryCountryElement?.id + '' + checkIndex
              );
              d1.setAttribute('style', 'min-height: 16rem;');
              d1.appendChild(document.createTextNode(''));

              d2 = document.createElement('img');
              d2.setAttribute('src', 'assets/img/resize-icon.png');
              d2.setAttribute(
                'style',
                'position: relative; top: 2.1rem; left: 4rem;cursor:pointer;z-index:1'
              );

              d3 = document.createElement('p');
              d3.setAttribute(
                'style',
                'font-size: 12px;margin-left: 5rem;position: relative;top:6rem'
              );

              mainElement.appendChild(d1);
              $(`#industryChartCustom > div:last`).before(d2);
            } else {
              d1 = document.querySelector(
                `#countryChart${industryCountryElement.id + '' + checkIndex}`
              );
              d1.innerHTML = '';
            }

            let temp: any = [];
            e.forEach((element: any) => {
              if (industryCountryElement.id == element.countryId) {
                temp.push(element);
              }
            });
            countryWiseSplittedData.push(temp);

            countryWiseSplittedData.forEach(
              (countryWiseElement: any, index: any) => {
                if (
                  industryCountryElement.countryName ==
                  countryWiseElement[0]?.countryName
                ) {
                  // Create chart instance
                  am4core.options.commercialLicense = true;

                  let chart = am4core.create(
                    'countryChart' +
                      industryCountryElement.id +
                      '' +
                      checkIndex,
                    am4charts.XYChart
                  );
                  // $(document).ready(function () {
                  //   $('g[aria-labelledby]').hide();
                  // });

                  let currency = '';
                  let unit = '';
                  if (e[0] != undefined) {
                    currency = e[0]?.currency ? e[0]?.currency : '';
                    unit = e[0]?.unit ? ' ' + e[0]?.unit : '';
                    !currency ? (unit = unit.trim()) : (unit = unit);
                  }
                  let title = chart.titles.create();
                  title.text =
                    industryCountryElement?.countryName +
                    ' - ' +
                    e[`metriceName`] +
                    ` (${currency}${unit}) `;
                  if (unit == '' && currency == '') {
                    title.text = title.text.split('(')[0].trim();
                  }
                  title.fontWeight = '500';
                  title.fontSize = 15;
                  title.marginBottom = 13;
                  title.fill = am4core.color('#ffff');

                  // Create axes
                  let dateAxis: any = chart.xAxes.push(
                    new am4charts.DateAxis()
                  );
                  // dateAxis.renderer.minGridDistance = 50;
                  dateAxis.renderer.line.strokeOpacity = 1;
                  dateAxis.renderer.line.strokeWidth = 2;
                  dateAxis.renderer.line.stroke = am4core.color('#ffc000');
                  dateAxis.renderer.labels.template.fill =
                    am4core.color('#ffc000');
                  dateAxis.renderer.labels.template.fontSize = 12;
                  dateAxis.tooltip.background.cornerRadius = 3;
                  dateAxis.tooltip.label.fontSize = 12;
                  dateAxis.tooltip.label.padding(5, 5, 5, 5);
                  if (this.selectedPeriod == 'YEARLY') {
                    dateAxis.dateFormats.setKey('day', 'yyyy');
                    dateAxis.dateFormats.setKey('week', 'yyyy');
                    dateAxis.dateFormats.setKey('month', 'yyyy');
                    dateAxis.dateFormats.setKey('year', 'yyyy');
                    dateAxis.periodChangeDateFormats.setKey('day', 'yyyy');
                    dateAxis.periodChangeDateFormats.setKey('week', 'yyyy');
                    dateAxis.periodChangeDateFormats.setKey('month', 'yyyy');
                    dateAxis.periodChangeDateFormats.setKey('year', 'yyyy');
                  } else if (this.selectedPeriod == 'QUARTERLY') {
                    dateAxis.dateFormats.setKey('day', 'MMM yyyy');
                    dateAxis.dateFormats.setKey('week', 'MMM yyyy');
                    dateAxis.dateFormats.setKey('month', 'MMM yyyy');
                    dateAxis.dateFormats.setKey('year', 'yyyy');
                    dateAxis.periodChangeDateFormats.setKey('day', 'MMM yyyy');
                    dateAxis.periodChangeDateFormats.setKey('week', 'MMM yyyy');
                    dateAxis.periodChangeDateFormats.setKey(
                      'month',
                      'MMM yyyy'
                    );
                    dateAxis.periodChangeDateFormats.setKey('year', 'yyyy');
                  }
                  dateAxis.skipEmptyPeriods = true;

                  let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
                  (valueAxis.tooltip as any).disabled = true;
                  valueAxis.renderer.line.strokeOpacity = 1;
                  valueAxis.renderer.line.strokeWidth = 2;
                  valueAxis.renderer.line.stroke = am4core.color('#ffc000');
                  valueAxis.renderer.labels.template.fill =
                    am4core.color('#ffc000');
                  valueAxis.renderer.labels.template.fontSize = 12;
                  // valueAxis.numberFormatter = new am4core.NumberFormatter();
                  // valueAxis.numberFormatter.numberFormat = '#.0a';
                  valueAxis.renderer.labels.template.adapter.add(
                    'text',
                    (label: any, target: any) => {
                      if (target.dataItem) {
                        let data;
                        if (Number(target.dataItem.value) > 1000) {
                          return this.util.standardFormat(
                            Number(target.dataItem.value),
                            1,
                            ''
                          );
                        }
                        return this.util.standardFormat(
                          Number(target.dataItem.value),
                          2,
                          ''
                        );
                      }
                    }
                  );

                  chart.data = [];
                  let forCheck: any = [];
                  let seriesCheck: any = '';

                  // For Data
                  this.selectedIndustry.forEach(
                    (industryElement: any, ind: any) => {
                      if (industryElement.customLableCheck) {
                        let temproveryData: any = [];
                        countryWiseElement.filter((el: any) => {
                          if (
                            industryElement.ticsIndustryName ==
                            el.ticsIndustryName
                          ) {
                            if (el.data) {
                              temproveryData.push({
                                date:
                                  this.selectedPeriod == 'YEARLY'
                                    ? `${new Date(
                                        el.period
                                      ).getFullYear()}-01-01`
                                    : el.period,
                                value: el.data,
                                ticsIndustryName: el.ticsIndustryName,
                              });
                            }
                          }
                        });
                        //Removing Duplicate
                        chart.data = Array.from(
                          new Set(temproveryData.map((a: any) => a.date))
                        ).map((date) => {
                          return temproveryData.find(
                            (a: any) => a.date === date
                          );
                        });

                        if (chart.data.length) {
                          forCheck.push(chart.data);
                          // Create series
                          let series = chart.series.push(
                            new am4charts.LineSeries()
                          );
                          series.dataFields.valueY = 'value';
                          series.dataFields.dateX = 'date';
                          series.strokeWidth = 2;
                          series.stroke = am4core.color(this.colorList[ind]);
                          series.fill = am4core.color(this.colorList[ind]);
                          series.minBulletDistance = 10;
                          (series.tooltip as any).label.fontSize = 12;
                          // series.tooltipText = `[bold]{ticsIndustryName} : {value}`;
                          (series?.tooltip as any).pointerOrientation =
                            'vertical';
                          series.data = chart.data;
                          let self = this;
                          series.adapter.add(
                            'tooltipHTML',
                            function (html: any, target: any) {
                              let data, ticsIndustryName;
                              if (target.tooltipDataItem.dataContext) {
                                data = target.tooltipDataItem.dataContext.value;
                                ticsIndustryName =
                                  target.tooltipDataItem.dataContext
                                    .ticsIndustryName;
                                let formattedPrice = self.util.standardFormat(
                                  data,
                                  2,
                                  ''
                                );
                                let customHtml =
                                  '<p style="text-align: center' +
                                  data +
                                  '</p>';
                                customHtml =
                                  ticsIndustryName + ' : ' + formattedPrice;

                                return customHtml;
                              }
                              return html;
                            }
                          );
                        } else {
                          seriesCheck +=
                            `** No data Available for Industry ` +
                            industryElement.ticsIndustryName;
                        }
                      }
                    }
                  );

                  let chartDataCheck = true;
                  for (let x of forCheck) {
                    if (x.length != 0) {
                      chartDataCheck = false;
                      break;
                    }
                  }

                  chart.events.on('beforedatavalidated', (ev: any) => {
                    if (chartDataCheck) {
                      let indicator = (
                        chart.tooltipContainer as any
                      ).createChild(am4core.Container);
                      let indicatorLabel = indicator.createChild(am4core.Label);
                      indicatorLabel.text = 'No Data Available';
                      indicatorLabel.isMeasured = false;
                      indicatorLabel.x = 520;
                      indicatorLabel.y = 120;
                      indicatorLabel.fontSize = 14;
                      indicatorLabel.fill = am4core.color('#fff');
                    } else {
                      let data = seriesCheck
                        .replaceAll('** No data Available for country ', ',')
                        .replace(',', '** No data Available for country ');
                      d3.innerHTML = data;
                      d1.appendChild(d3);
                    }
                  });

                  d2.onclick = () => {
                    this.chartDataGets(forCheck, title.text, 'countryWise');
                  };

                  if (forCheck.length == 0) {
                    d3.innerHTML = '';
                  }

                  // Add chart's data into a table
                  let tableData: any = [];
                  let tempComp: any = [];
                  forCheck
                    .sort()
                    .reverse()
                    .forEach((element: any, index: any) => {
                      if (element.length) {
                        tempComp.push(element[0].ticsIndustryName);
                        element.forEach((el: any, i: any) => {
                          if (this.selectedPeriod == 'YEARLY') {
                            let temp: any = {};
                            if (index == 0) {
                              temp['Date'] = new Date(el.date).getFullYear();
                              temp[el.ticsIndustryName] =
                                this.util.standardFormat(el.value, 2, '');
                              if (tableData.indexOf(el) === -1) {
                                tableData.push(temp);
                              }
                            } else {
                              tableData.forEach((e: any, ind: any) => {
                                if (e.Date == new Date(el.date).getFullYear()) {
                                  tableData[ind][el.ticsIndustryName] = el.value
                                    ? this.util.standardFormat(el.value, 2, '')
                                    : '-';
                                }
                              });
                            }
                          } else if (this.selectedPeriod == 'QUARTERLY') {
                            let temp: any = {};
                            temp['Date'] = `${
                              this.monthNames[new Date(el.date).getMonth()]
                            }-${new Date(el.date).getFullYear()}`;

                            temp[el.ticsIndustryName] =
                              this.util.standardFormat(el.value, 2, '');
                            let isDateRepeat: boolean = true;
                            tableData.forEach((element: any, index: any) => {
                              if (element.Date == temp['Date']) {
                                isDateRepeat = false;
                                tableData[index][el.ticsIndustryName] =
                                  this.util.standardFormat(el.value, 2, '');
                              }
                            });
                            if (isDateRepeat) {
                              tableData.push(temp);
                            }
                            if (forCheck.length - 1 == index) {
                              tableData.forEach((element: any) => {
                                tempComp.forEach((el: any) => {
                                  if (!Object.keys(element).includes(el)) {
                                    element[el] = '-';
                                  }
                                });
                              });
                            }
                          }
                        });
                      }
                    });

                  tableData.sort((a: any, b: any) => a.Date - b.Date).reverse();

                  if (tableData.length) {
                    // Adding empty value if its not there
                    let maxlength: any = 0;
                    let maxlengthId: any = 0;

                    tableData.forEach((element: any, index: any) => {
                      if (Object.keys(element).length > maxlength) {
                        maxlength = Object.keys(element).length;
                        maxlengthId = index;
                      }
                    });

                    let tempKeys = Object.keys(tableData[maxlengthId]);

                    tableData.forEach((element: any) => {
                      tempKeys.forEach((el: any) => {
                        if (!Object.keys(element).includes(el)) {
                          element[el] = '-';
                        }
                      });
                    });

                    let curUnit;
                    if (currency && unit) {
                      curUnit = `(${currency}${unit})`;
                    } else if (currency && !unit) {
                      curUnit = `(${currency.trim()})`;
                    } else if (!currency && unit) {
                      curUnit = `(${unit})`;
                    }
                    curUnit = curUnit ?? '';

                    tableData['tableTitle'] =
                      industryCountryElement?.countryName +
                      ' - ' +
                      e[`metriceName`] +
                      ' ' +
                      curUnit;
                    let isThere = true;
                    this.allIndustryDataTables.forEach(
                      (element: any, index: any) => {
                        if (element.tableTitle == tableData.tableTitle) {
                          this.allIndustryDataTables[index] = tableData;
                          isThere = false;
                        }
                      }
                    );
                    if (isThere) this.allIndustryDataTables.push(tableData);
                  }

                  // Add cursor
                  chart.cursor = new am4charts.XYCursor();
                  chart.cursor.xAxis = dateAxis;
                } else {
                  let chart = am4core.create(
                    'countryChart' +
                      industryCountryElement.id +
                      '' +
                      checkIndex,
                    am4charts.XYChart
                  );
                  let currency = '';
                  let unit = '';
                  if (e[0] != undefined) {
                    currency = e[0]?.currency ? e[0]?.currency : '';
                    unit = e[0]?.unit ? ' ' + e[0]?.unit : '';
                  }
                  let title = chart.titles.create();
                  title.text =
                    industryCountryElement?.countryName +
                    ' - ' +
                    e[`metriceName`] +
                    ` (${currency}${unit}) `;
                  if (unit == '' && currency == '') {
                    title.text = title.text.split('(')[0].trim();
                  }
                  title.fontWeight = '500';
                  title.fontSize = 15;
                  title.marginBottom = 13;
                  title.fill = am4core.color('#ffff');

                  // Create axes
                  let dateAxis: any = chart.xAxes.push(
                    new am4charts.DateAxis()
                  );
                  dateAxis.renderer.minGridDistance = 50;
                  dateAxis.renderer.line.strokeOpacity = 1;
                  dateAxis.renderer.line.strokeWidth = 2;
                  dateAxis.renderer.line.stroke = am4core.color('#ffc000');
                  dateAxis.renderer.labels.template.fill =
                    am4core.color('#ffc000');
                  dateAxis.renderer.labels.template.fontSize = 12;
                  dateAxis.tooltip.background.cornerRadius = 3;
                  dateAxis.tooltip.label.fontSize = 12;
                  dateAxis.tooltip.label.padding(5, 5, 5, 5);

                  let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
                  (valueAxis.tooltip as any).disabled = true;
                  valueAxis.renderer.line.strokeOpacity = 1;
                  valueAxis.renderer.line.strokeWidth = 2;
                  valueAxis.renderer.line.stroke = am4core.color('#ffc000');
                  valueAxis.renderer.labels.template.fill =
                    am4core.color('#ffc000');
                  valueAxis.renderer.labels.template.fontSize = 12;
                  chart.events.on('beforedatavalidated', (ev: any) => {
                    let indicator = (chart.tooltipContainer as any).createChild(
                      am4core.Container
                    );
                    let indicatorLabel = indicator.createChild(am4core.Label);
                    indicatorLabel.text = 'No Data Available';
                    indicatorLabel.isMeasured = false;
                    indicatorLabel.x = 520;
                    indicatorLabel.y = 120;
                    indicatorLabel.fontSize = 14;
                    indicatorLabel.fill = am4core.color('#fff');
                  });
                }
              }
            );
          }
        });
      } else {
        // For remving country chart
        this.selectedIndustryCountry.forEach((industryCountryElement: any) => {
          checkIndex++;
          if (
            document.querySelector(
              `#countryChart${industryCountryElement?.id + '' + checkIndex}`
            ) != null
          ) {
            var d1: any = document.querySelector(
              `#countryChart${industryCountryElement?.id + '' + checkIndex}`
            );
            d1.innerHTML = '';
          }
        });

        // For add country chart
        this.selectedIndustry.forEach((industryElement: any) => {
          if (industryElement.customLableCheck) {
            checkIndex++;
            let d1: any, d2: any, d3: any;
            if (
              document.querySelector(
                `#industryChart${industryElement.id + '' + checkIndex}`
              ) == null
            ) {
              d1 = document.createElement('div');
              d1.setAttribute(
                'id',
                'industryChart' + industryElement.id + '' + checkIndex
              );
              d1.setAttribute('style', 'min-height: 16rem;');
              d1.appendChild(document.createTextNode(''));

              d2 = document.createElement('img');
              d2.setAttribute('src', 'assets/img/resize-icon.png');
              d2.setAttribute(
                'style',
                'position: relative; top: 2.1rem; left: 4rem;cursor:pointer;z-index:1'
              );

              d3 = document.createElement('p');
              d3.setAttribute(
                'style',
                'font-size: 12px;margin-left: 5rem;position: relative;top:6rem'
              );

              mainElement.appendChild(d1);
              $(`#industryChartCustom > div:last`).before(d2);
            } else {
              d1 = document.querySelector(
                `#industryChart${industryElement.id + '' + checkIndex}`
              );
              d1.innerHTML = '';
            }

            let temp: any = [];
            e.forEach((element: any) => {
              if (
                industryElement.ticsIndustryCode == element.ticsIndustryCode
              ) {
                temp.push(element);
              }
            });
            industrySplittedData.push(temp);

            industrySplittedData.forEach(
              (industryWiseElement: any, index: any) => {
                if (
                  industryElement.ticsIndustryName ==
                  industryWiseElement[0]?.ticsIndustryName
                ) {
                  // Create chart instance
                  let chart = am4core.create(
                    'industryChart' + industryElement.id + '' + checkIndex,
                    am4charts.XYChart
                  );
                  // $(document).ready(function () {
                  //   $('g[aria-labelledby]').hide();
                  // });

                  let currency = '';
                  let unit = '';
                  if (e[0] != undefined) {
                    currency = e[0]?.currency ? e[0]?.currency : '';
                    unit = e[0]?.unit ? ' ' + e[0]?.unit : '';
                  }
                  let title = chart.titles.create();
                  title.text =
                    industryElement?.ticsIndustryName +
                    ' - ' +
                    e[`metriceName`] +
                    ` (${currency}${unit}) `;
                  if (unit == '' && currency == '') {
                    title.text = title.text.split('(')[0].trim();
                  }
                  title.fontWeight = '500';
                  title.fontSize = 15;
                  title.marginBottom = 13;
                  title.fill = am4core.color('#ffff');

                  // Create axes
                  let dateAxis: any = chart.xAxes.push(
                    new am4charts.DateAxis()
                  );
                  dateAxis.renderer.minGridDistance = 50;
                  dateAxis.renderer.line.strokeOpacity = 1;
                  dateAxis.renderer.line.strokeWidth = 2;
                  dateAxis.renderer.line.stroke = am4core.color('#ffc000');
                  dateAxis.renderer.labels.template.fill =
                    am4core.color('#ffc000');
                  dateAxis.renderer.labels.template.fontSize = 12;
                  dateAxis.tooltip.background.cornerRadius = 3;
                  dateAxis.tooltip.label.fontSize = 12;
                  dateAxis.tooltip.label.padding(5, 5, 5, 5);
                  if (this.selectedPeriod == 'YEARLY') {
                    dateAxis.dateFormats.setKey('day', 'yyyy');
                    dateAxis.dateFormats.setKey('week', 'yyyy');
                    dateAxis.dateFormats.setKey('month', 'yyyy');
                    dateAxis.dateFormats.setKey('year', 'yyyy');
                    dateAxis.periodChangeDateFormats.setKey('day', 'yyyy');
                    dateAxis.periodChangeDateFormats.setKey('week', 'yyyy');
                    dateAxis.periodChangeDateFormats.setKey('month', 'yyyy');
                    dateAxis.periodChangeDateFormats.setKey('year', 'yyyy');
                  } else if (this.selectedPeriod == 'QUARTERLY') {
                    dateAxis.dateFormats.setKey('day', 'MMM yyyy');
                    dateAxis.dateFormats.setKey('week', 'MMM yyyy');
                    dateAxis.dateFormats.setKey('month', 'MMMyyyy');
                    dateAxis.dateFormats.setKey('year', 'MMM yyyy');
                    dateAxis.periodChangeDateFormats.setKey('day', 'MMM yyyy');
                    dateAxis.periodChangeDateFormats.setKey('week', 'MMM yyyy');
                    dateAxis.periodChangeDateFormats.setKey(
                      'month',
                      'MMM yyyy'
                    );
                    dateAxis.periodChangeDateFormats.setKey('year', 'MMM yyyy');
                  }
                  dateAxis.skipEmptyPeriods = true;

                  let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
                  (valueAxis.tooltip as any).disabled = true;
                  valueAxis.renderer.line.strokeOpacity = 1;
                  valueAxis.renderer.line.strokeWidth = 2;
                  valueAxis.renderer.line.stroke = am4core.color('#ffc000');
                  valueAxis.renderer.labels.template.fill =
                    am4core.color('#ffc000');
                  valueAxis.renderer.labels.template.fontSize = 12;
                  // valueAxis.numberFormatter = new am4core.NumberFormatter();
                  // valueAxis.numberFormatter.numberFormat = '#.0a';
                  valueAxis.renderer.labels.template.adapter.add(
                    'text',
                    (label: any, target: any) => {
                      if (target.dataItem) {
                        let data;
                        if (Number(target.dataItem.value) > 1000) {
                          return this.util.standardFormat(
                            Number(target.dataItem.value),
                            1,
                            ''
                          );
                        }
                        return this.util.standardFormat(
                          Number(target.dataItem.value),
                          2,
                          ''
                        );
                      }
                    }
                  );

                  chart.data = [];
                  let forCheck: any = [];
                  let seriesCheck: any = '';
                  // For Data
                  this.selectedIndustryCountry.forEach(
                    (countryElement: any, ind: any) => {
                      if (countryElement.customLableCheck) {
                        let temproveryData: any = [];
                        industryWiseElement.filter((el: any) => {
                          if (countryElement.id == el.countryId) {
                            if (el.data) {
                              temproveryData.push({
                                date:
                                  this.selectedPeriod == 'YEARLY'
                                    ? `${new Date(
                                        el.period
                                      ).getFullYear()}-01-01`
                                    : el.period,
                                value: el.data,
                                countryName: el.countryName,
                              });
                            }
                          }
                        });

                        //Removing Duplicate
                        chart.data = Array.from(
                          new Set(temproveryData.map((a: any) => a.date))
                        ).map((date) => {
                          return temproveryData.find(
                            (a: any) => a.date === date
                          );
                        });

                        if (chart.data.length) {
                          forCheck.push(chart.data);
                          // Create series
                          let series = chart.series.push(
                            new am4charts.LineSeries()
                          );
                          series.dataFields.valueY = 'value';
                          series.dataFields.dateX = 'date';
                          series.strokeWidth = 2;
                          series.stroke = am4core.color(this.colorList[ind]);
                          series.fill = am4core.color(this.colorList[ind]);
                          series.minBulletDistance = 10;
                          (series.tooltip as any).label.fontSize = 12;
                          // series.tooltipText = `[bold]{countryName} : {value}`;
                          (series?.tooltip as any).pointerOrientation =
                            'vertical';
                          series.data = chart.data;
                          let self = this;
                          series.adapter.add(
                            'tooltipHTML',
                            function (html: any, target: any) {
                              let data, countryName;
                              if (target.tooltipDataItem.dataContext) {
                                data = target.tooltipDataItem.dataContext.value;
                                countryName =
                                  target.tooltipDataItem.dataContext
                                    .countryName;
                                let formattedPrice = self.util.standardFormat(
                                  data,
                                  2,
                                  ''
                                );
                                let customHtml =
                                  '<p style="text-align: center' +
                                  data +
                                  '</p>';
                                customHtml =
                                  countryName + ' : ' + formattedPrice;

                                return customHtml;
                              }
                              return html;
                            }
                          );
                        } else {
                          seriesCheck +=
                            `** No data Available for country ` +
                            countryElement.countryName;
                        }
                      }
                    }
                  );

                  let chartDataCheck = true;
                  for (let x of forCheck) {
                    if (x.length != 0) {
                      chartDataCheck = false;
                      break;
                    }
                  }

                  chart.events.on('beforedatavalidated', (ev: any) => {
                    if (chartDataCheck) {
                      let indicator = (
                        chart.tooltipContainer as any
                      ).createChild(am4core.Container);
                      let indicatorLabel = indicator.createChild(am4core.Label);
                      indicatorLabel.text = 'No Data Available';
                      indicatorLabel.isMeasured = false;
                      indicatorLabel.x = 520;
                      indicatorLabel.y = 120;
                      indicatorLabel.fontSize = 14;
                      indicatorLabel.fill = am4core.color('#fff');
                    } else {
                      let data = seriesCheck
                        .replaceAll('** No data Available for country ', ',')
                        .replace(',', '** No data Available for country ');
                      d3.innerHTML = data;
                      d1.appendChild(d3);
                    }
                  });

                  d2.onclick = () => {
                    this.chartDataGets(forCheck, title.text, 'industryWise');
                  };

                  if (forCheck.length == 0) {
                    d3.innerHTML = '';
                  }

                  // Add chart's data into a table
                  let tableData: any = [];
                  let tempComp: any = [];
                  forCheck
                    .sort()
                    .reverse()
                    .forEach((element: any, index: any) => {
                      if (element.length) {
                        tempComp.push(element[0].countryName);
                        element.forEach((el: any, i: any) => {
                          if (this.selectedPeriod == 'YEARLY') {
                            let temp: any = {};
                            if (index == 0) {
                              temp['Date'] = new Date(el.date).getFullYear();
                              temp[el.countryName] = this.util.standardFormat(
                                el.value,
                                2,
                                ''
                              );
                              if (tableData.indexOf(el) === -1) {
                                tableData.push(temp);
                              }
                            } else {
                              tableData.forEach((e: any, ind: any) => {
                                if (e.Date == new Date(el.date).getFullYear()) {
                                  tableData[ind][el.countryName] = el.value
                                    ? this.util.standardFormat(el.value, 2, '')
                                    : '-';
                                }
                              });
                            }
                          } else if (this.selectedPeriod == 'QUARTERLY') {
                            let temp: any = {};
                            temp['Date'] = `${
                              this.monthNames[new Date(el.date).getMonth()]
                            }-${new Date(el.date).getFullYear()}`;

                            temp[el.countryName] = this.util.standardFormat(
                              el.value,
                              2,
                              ''
                            );
                            let isDateRepeat: boolean = true;
                            tableData.forEach((element: any, index: any) => {
                              if (element.Date == temp['Date']) {
                                isDateRepeat = false;
                                tableData[index][el.countryName] =
                                  this.util.standardFormat(el.value, 2, '');
                              }
                            });
                            if (isDateRepeat) {
                              tableData.push(temp);
                            }
                            if (forCheck.length - 1 == index) {
                              tableData.forEach((element: any) => {
                                tempComp.forEach((el: any) => {
                                  if (!Object.keys(element).includes(el)) {
                                    element[el] = '-';
                                  }
                                });
                              });
                            }
                          }
                        });
                      }
                    });

                  tableData.sort((a: any, b: any) => a.Date - b.Date).reverse();

                  if (tableData.length) {
                    // Adding empty value if its not there
                    let maxlength: any = 0;
                    let maxlengthId: any = 0;

                    tableData.forEach((element: any, index: any) => {
                      if (Object.keys(element).length > maxlength) {
                        maxlength = Object.keys(element).length;
                        maxlengthId = index;
                      }
                    });

                    let tempKeys = Object.keys(tableData[maxlengthId]);

                    tableData.forEach((element: any) => {
                      tempKeys.forEach((el: any) => {
                        if (!Object.keys(element).includes(el)) {
                          element[el] = '-';
                        }
                      });
                    });

                    let curUnit;
                    if (currency && unit) {
                      curUnit = `(${currency}${unit})`;
                    } else if (currency && !unit) {
                      curUnit = `(${currency.trim()})`;
                    } else if (!currency && unit) {
                      curUnit = `(${unit})`;
                    }
                    curUnit = curUnit ?? '';

                    tableData['tableTitle'] =
                      industryElement?.ticsIndustryName +
                      ' - ' +
                      e[`metriceName`] +
                      ' ' +
                      curUnit;
                    let isThere = true;
                    this.allIndustryDataTables.forEach(
                      (element: any, index: any) => {
                        if (element.tableTitle == tableData.tableTitle) {
                          this.allIndustryDataTables[index] = tableData;
                          isThere = false;
                        }
                      }
                    );
                    if (isThere) this.allIndustryDataTables.push(tableData);
                  }

                  // Add cursor
                  chart.cursor = new am4charts.XYCursor();
                  chart.cursor.xAxis = dateAxis;
                } else {
                  let chart = am4core.create(
                    'countryChart' + industryElement.id + '' + checkIndex,
                    am4charts.XYChart
                  );

                  let currency = '';
                  let unit = '';
                  if (e[0] != undefined) {
                    currency = e[0]?.currency ? e[0]?.currency : '';
                    unit = e[0]?.unit ? ' ' + e[0]?.unit : '';
                  }
                  let title = chart.titles.create();
                  title.text =
                    industryElement?.ticsIndustryName +
                    ' - ' +
                    e[`metriceName`] +
                    ` (${currency}${unit}) `;
                  if (unit == '' && currency == '') {
                    title.text = title.text.split('(')[0].trim();
                  }
                  title.fontWeight = '500';
                  title.fontSize = 15;
                  title.marginBottom = 13;
                  title.fill = am4core.color('#ffff');

                  // Create axes
                  let dateAxis: any = chart.xAxes.push(
                    new am4charts.DateAxis()
                  );
                  dateAxis.renderer.minGridDistance = 50;
                  dateAxis.renderer.line.strokeOpacity = 1;
                  dateAxis.renderer.line.strokeWidth = 2;
                  dateAxis.renderer.line.stroke = am4core.color('#ffc000');
                  dateAxis.renderer.labels.template.fill =
                    am4core.color('#ffc000');
                  dateAxis.renderer.labels.template.fontSize = 12;
                  dateAxis.tooltip.background.cornerRadius = 3;
                  dateAxis.tooltip.label.fontSize = 12;
                  dateAxis.tooltip.label.padding(5, 5, 5, 5);

                  let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
                  (valueAxis.tooltip as any).disabled = true;
                  valueAxis.renderer.line.strokeOpacity = 1;
                  valueAxis.renderer.line.strokeWidth = 2;
                  valueAxis.renderer.line.stroke = am4core.color('#ffc000');
                  valueAxis.renderer.labels.template.fill =
                    am4core.color('#ffc000');
                  valueAxis.renderer.labels.template.fontSize = 12;
                  chart.events.on('beforedatavalidated', (ev: any) => {
                    let indicator = (chart.tooltipContainer as any).createChild(
                      am4core.Container
                    );
                    let indicatorLabel = indicator.createChild(am4core.Label);
                    indicatorLabel.text = 'No Data Available';
                    indicatorLabel.isMeasured = false;
                    indicatorLabel.x = 520;
                    indicatorLabel.y = 120;
                    indicatorLabel.fontSize = 14;
                    indicatorLabel.fill = am4core.color('#fff');
                  });
                }
              }
            );
          }
        });
      }
    });

    this.chartDataCheck();
  }

  //For Economy Data Structure Formation and graph
  economyDataStructureFormation(data: any) {
    let forChartData: any = [];
    data.forEach((z: any, ind: any) => {
      if (z[0].indicatorsDataList.length) {
        this.selectedEconomyIndicatorData.forEach((element: any) => {
          if (z[0].indicatorsDataList[0].category == element.category)
            if (element.customLableCheck) {
              let temp: any = [];
              z[0]?.indicatorsDataList.forEach((el: any) => {
                if (element.category == el.category) temp.push(el);
              });
              temp['indicatorName'] =
                element.category + ' ' + '(' + element.periodType + ')';
              forChartData.push(temp);
            }
        });
        if (data.length == ind + 1) this.economyChart(forChartData);
      }
    });
  }

  economyChart(data: any) {
    this.allEconomyDataTables = [];
    var mainElement: any = document.getElementById('economyChartCustom');
    mainElement.innerHTML = '';

    data.forEach((e: any, index: any) => {
      let d1: any, d2: any, d3: any;
      let NoDataContent: any = '';

      if (
        document.querySelector(`${data[index][0]?.category}economyChart`) !=
        null
      ) {
        d1 = document.querySelector(`${data[index][0]?.category}economyChart`);
        d1.innerHTML = '';
      } else {
        d1 = document.createElement('div');
        d1.setAttribute('id', data[index][0]?.category + 'economyChart');
        d1.setAttribute('style', 'min-height: 16rem;');
        d1.appendChild(document.createTextNode(''));

        d2 = document.createElement('img');
        d2.setAttribute('src', 'assets/img/resize-icon.png');
        d2.setAttribute(
          'style',
          'position: relative; top: 2.1rem; left: 4rem;cursor:pointer;z-index:1'
        );

        d3 = document.createElement('p');
        d3.setAttribute(
          'style',
          'font-size: 12px;margin-left: 5rem;position: relative;top:6rem'
        );

        mainElement.appendChild(d1);
        $(`#economyChartCustom > div:last`).before(d2);
      }

      // Create chart instance
      am4core.options.commercialLicense = true;

      let chart = am4core.create(
        data[index][0]?.category + 'economyChart',
        am4charts.XYChart
      );
      // $(document).ready(function () {
      //   $('g[aria-labelledby]').hide();
      // });

      let title = chart.titles.create();
      let unit = '';
      if (e[0] != undefined) {
        unit = e[0]?.unit;
      }
      title.text = e?.indicatorName + ` (${unit})`;
      if (unit == '' || unit == undefined) {
        title.text = title.text.split('(')[0].trim();
      }
      title.fontWeight = '500';
      title.fontSize = 15;
      title.marginBottom = 13;
      title.fill = am4core.color('#ffff');

      // Create axes
      let dateAxis: any = chart.xAxes.push(new am4charts.DateAxis());
      dateAxis.renderer.minGridDistance = 60;
      dateAxis.renderer.line.strokeOpacity = 1;
      dateAxis.renderer.line.strokeWidth = 2;
      dateAxis.renderer.line.stroke = am4core.color('#ffc000');
      dateAxis.renderer.labels.template.fill = am4core.color('#ffc000');
      dateAxis.renderer.labels.template.fontSize = 12;
      dateAxis.tooltip.background.cornerRadius = 3;
      dateAxis.tooltip.label.fontSize = 12;
      dateAxis.tooltip.label.padding(5, 5, 5, 5);
      dateAxis.dateFormats.setKey('day', 'dd-MM-yy');
      dateAxis.dateFormats.setKey('week', 'dd-MM-yy');
      dateAxis.dateFormats.setKey('month', 'yyyy');
      dateAxis.dateFormats.setKey('year', 'yyyy');

      dateAxis.periodChangeDateFormats.setKey('day', 'dd-MM-yy');
      dateAxis.periodChangeDateFormats.setKey('week', 'dd-MM-yy');
      dateAxis.periodChangeDateFormats.setKey('month', 'yyyy');
      dateAxis.periodChangeDateFormats.setKey('year', 'yyyy');
      data.skipEmptyPeriods = true;

      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      (valueAxis.tooltip as any).disabled = true;
      valueAxis.renderer.line.strokeOpacity = 1;
      valueAxis.renderer.line.strokeWidth = 2;
      valueAxis.renderer.line.stroke = am4core.color('#ffc000');
      valueAxis.renderer.labels.template.fill = am4core.color('#ffc000');
      valueAxis.renderer.labels.template.fontSize = 12;
      // valueAxis.numberFormatter = new am4core.NumberFormatter();
      // valueAxis.numberFormatter.numberFormat = '#.0a';
      valueAxis.renderer.labels.template.adapter.add(
        'text',
        (label: any, target: any) => {
          if (target.dataItem) {
            let data;
            if (Number(target.dataItem.value) > 1000) {
              return this.util.standardFormat(
                Number(target.dataItem.value),
                1,
                ''
              );
            }
            return this.util.standardFormat(
              Number(target.dataItem.value),
              2,
              ''
            );
          }
        }
      );

      chart.data = [];
      let forCheck: any = [];

      // Add data
      this.selectedEconomyCountryData.forEach((economyElement: any, i: any) => {
        if (economyElement.customLableCheck) {
          let temp: any = [];
          e.forEach((elem: any) => {
            if (economyElement.countryIsoCode3 == elem.countryIsoCode3) {
              if (elem.data) {
                temp.push({
                  date: elem.period,
                  value: elem.data,
                  country: elem.country,
                  periodType: elem.periodType,
                });
                if (elem.periodType === 'Daily') {
                  dateAxis.renderer.minGridDistance = 90;

                  dateAxis.dateFormats.setKey('day', 'dd-MM-yy');
                  dateAxis.dateFormats.setKey('month', 'MMM yyyy');
                  dateAxis.dateFormats.setKey('week', 'dd MMM');

                  dateAxis.periodChangeDateFormats.setKey('day', 'dd-MM-yy');
                  dateAxis.periodChangeDateFormats.setKey('month', 'MMM yyyy');
                  dateAxis.periodChangeDateFormats.setKey('week', 'dd MMM');
                } else if (elem.periodType === 'Quarterly') {
                  dateAxis.renderer.minGridDistance = 90;

                  dateAxis.dateFormats.setKey('year', 'yyyy');
                  dateAxis.dateFormats.setKey('day', 'MMM yyyy');
                  dateAxis.dateFormats.setKey('month', 'MMM yyyy');
                  dateAxis.dateFormats.setKey('week', 'MMM yyyy');

                  dateAxis.periodChangeDateFormats.setKey('year', 'yyyy');
                  dateAxis.periodChangeDateFormats.setKey('day', 'MMM yyyy');
                  dateAxis.periodChangeDateFormats.setKey('month', 'MMM yyyy');
                  dateAxis.periodChangeDateFormats.setKey('week', 'MMM yyyy');
                } else {
                  dateAxis.tooltipDateFormat = 'MMM yyyy';

                  dateAxis.dateFormats.setKey('month', 'MMM yyyy');
                  dateAxis.dateFormats.setKey('week', 'dd MMM');

                  dateAxis.periodChangeDateFormats.setKey('month', 'MMM yyyy');
                  dateAxis.periodChangeDateFormats.setKey('week', 'dd MMM');
                }
                if (elem.periodType === 'Yearly') {
                  dateAxis.tooltipDateFormat = 'yyyy';
                }
              }
            }
          });

          chart.data = temp;
          forCheck.push(chart.data);

          // Create series
          if (chart.data.length) {
            let series = chart.series.push(new am4charts.LineSeries());
            series.dataFields.valueY = 'value';
            series.dataFields.dateX = 'date';
            series.strokeWidth = 2;
            series.stroke = am4core.color(this.colorList[i]);
            series.fill = am4core.color(this.colorList[i]);
            series.minBulletDistance = 10;
            (series.tooltip as any).label.fontSize = 12;
            // series.tooltipText = `[bold]{category} : {value}`;
            (series?.tooltip as any).pointerOrientation = 'vertical';
            series.data = chart.data;
            let self = this;
            series.adapter.add(
              'tooltipHTML',
              function (html: any, target: any) {
                let data, country;
                if (target.tooltipDataItem.dataContext) {
                  data = target.tooltipDataItem.dataContext.value;
                  country = target.tooltipDataItem.dataContext.country;
                  let formattedPrice = self.util.standardFormat(data, 2, '');
                  let customHtml =
                    '<p style="text-align: center' + data + '</p>';
                  customHtml = country + ' : ' + formattedPrice;

                  return customHtml;
                }
                return html;
              }
            );
          } else {
            NoDataContent +=
              `** No data Available for country ` + economyElement.countryName;
          }
        }
      });

      let chartDataCheck = true;
      for (let x of forCheck) {
        if (x.length != 0) {
          chartDataCheck = false;
          break;
        }
      }

      chart.events.on('beforedatavalidated', (ev: any) => {
        if (chartDataCheck) {
          let indicator = (chart.tooltipContainer as any).createChild(
            am4core.Container
          );
          let indicatorLabel = indicator.createChild(am4core.Label);
          indicatorLabel.text = 'No Data Available';
          indicatorLabel.isMeasured = false;
          indicatorLabel.x = 520;
          indicatorLabel.y = 120;
          indicatorLabel.fontSize = 14;
          indicatorLabel.fill = am4core.color('#fff');
        } else {
          let data = NoDataContent.replaceAll(
            '** No data Available for country ',
            ', '
          ).replace(',', '** No data Available for country ');
          d3.appendChild(document.createTextNode(data));
          d1.appendChild(d3);
        }
      });

      d2.onclick = () => {
        this.chartDataGets(forCheck, title.text, 'economy');
      };

      // Add chart's data into a table
      let tableData: any = [];
      forCheck
        .sort()
        .reverse()
        .forEach((element: any, index: any) => {
          if (element.length) {
            element.forEach((el: any, i: any) => {
              let temp: any = {};
              if (index == 0) {
                if (el.periodType === 'Daily') {
                  temp['Date'] = el.date;
                } else if (el.periodType === 'Yearly') {
                  temp['Date'] = new Date(el.date).getFullYear();
                } else {
                  temp['Date'] =
                    this.monthNames[new Date(el.date).getMonth()] +
                    '-' +
                    new Date(el.date).getFullYear();
                }
                temp[el.country] = this.util.standardFormat(el.value, 2, '');
                if (tableData.indexOf(el) === -1) {
                  tableData.push(temp);
                }
              } else {
                tableData.forEach((e: any, ind: any) => {
                  if (
                    e.Date ==
                      this.monthNames[new Date(el.date).getMonth()] +
                        '-' +
                        new Date(el.date).getFullYear() ||
                    new Date(el.date).getFullYear() ||
                    el.date
                  ) {
                    tableData[ind][el.country] = el.value
                      ? this.util.standardFormat(el.value, 2, '')
                      : '-';
                  }
                });
              }
            });
          }
        });

      tableData.sort((a: any, b: any) => a.Date - b.Date).reverse();

      if (tableData.length) {
        // Adding empty value if its not there
        let maxlength: any = 0;
        let maxlengthId: any = 0;

        tableData.forEach((element: any, index: any) => {
          if (Object.keys(element).length > maxlength) {
            maxlength = Object.keys(element).length;
            maxlengthId = index;
          }
        });

        let tempKeys = Object.keys(tableData[maxlengthId]);

        tableData.forEach((element: any) => {
          tempKeys.forEach((el: any) => {
            if (!Object.keys(element).includes(el)) {
              element[el] = '-';
            }
          });
        });
        this.allEconomyDataTables.push(tableData);
        this.allEconomyDataTables[this.allEconomyDataTables.length - 1][
          'tableTitle'
        ] = e.indicatorName + ` (${e[0].unit})`;
      }

      // Add cursor
      chart.cursor = new am4charts.XYCursor();
      chart.cursor.xAxis = dateAxis;
    });
    this.chartDataCheck();
  }

  //For Forex Data Structure Formation and Graph
  forexDataStructureFormation(data: any) {
    let forCheck: any = [];

    this.selectedForex.forEach((element: any) => {
      if (element.customLableCheck) {
        let temp: any = [];
        this.selectedEconomyCountryData.forEach((elem: any) => {
          data.forEach((el: any) => {
            let tempData: any = [];
            if (elem.countryIsoCode3 == el.countryIsoCode) {
              el.exchangeRate.forEach((e: any) => {
                e.forEach((x: any) => {
                  if (element.id == x.targetCurrencyCode) {
                    tempData.push(x);
                  }
                });
              });
              temp.push(tempData);
            }
          });
        });
        temp['forexName'] = element.text;
        forCheck.push(temp);
      }
    });

    this.forexChart(forCheck);
  }

  forexChart(data: any) {
    this.allForexDataTables = [];
    var mainElement: any = document.getElementById('forexChartCustom');
    mainElement.innerHTML = '';

    data.forEach((e: any, index: any) => {
      let d1: any, d2: any, d3: any;
      let NoDataContent: any = '';

      if (document.querySelector(`forexChart${index}`) != null) {
        d1 = document.querySelector(`forexChart${index}`);
        d1.innerHTML = '';
      } else {
        d1 = document.createElement('div');
        d1.setAttribute('id', 'forexChart' + index);
        d1.setAttribute('style', 'min-height: 16rem;');
        d1.appendChild(document.createTextNode(''));

        d2 = document.createElement('img');
        d2.setAttribute('src', 'assets/img/resize-icon.png');
        d2.setAttribute(
          'style',
          'position: relative; top: 2.1rem; left: 4rem;cursor:pointer;z-index:1'
        );

        d3 = document.createElement('p');
        d3.setAttribute(
          'style',
          'font-size: 12px;margin-left: 5rem;position: relative;top:6rem'
        );

        mainElement.appendChild(d1);
        $(`#forexChartCustom > div:last`).before(d2);
      }

      am4core.options.commercialLicense = true;
      // Create chart instance
      let chart = am4core.create('forexChart' + index, am4charts.XYChart);
      // $(document).ready(function () {
      //   $('g[aria-labelledby]').hide();
      // });

      let title = chart.titles.create();
      title.text = e?.forexName;
      title.fontWeight = '500';
      title.fontSize = 15;
      title.marginBottom = 13;
      title.fill = am4core.color('#ffff');

      // Create axes
      let dateAxis: any = chart.xAxes.push(new am4charts.DateAxis());
      dateAxis.renderer.minGridDistance = 70;
      dateAxis.renderer.line.strokeOpacity = 1;
      dateAxis.renderer.line.strokeWidth = 2;
      dateAxis.renderer.line.stroke = am4core.color('#ffc000');
      dateAxis.renderer.labels.template.fill = am4core.color('#ffc000');
      dateAxis.renderer.labels.template.fontSize = 12;
      dateAxis.tooltip.background.cornerRadius = 3;
      dateAxis.tooltip.label.fontSize = 12;
      dateAxis.tooltip.label.padding(5, 5, 5, 5);
      dateAxis.dateFormats.setKey('day', 'dd-MM-yy');
      dateAxis.dateFormats.setKey('month', 'MMM yyyy');
      dateAxis.dateFormats.setKey('week', 'dd-MM-yy');
      dateAxis.periodChangeDateFormats.setKey('day', 'dd-MM-yy');
      dateAxis.periodChangeDateFormats.setKey('month', 'MMM yyyy');
      dateAxis.periodChangeDateFormats.setKey('week', 'dd-MM-yy');
      dateAxis.skipEmptyPeriods = true;

      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      (valueAxis.tooltip as any).disabled = true;
      valueAxis.renderer.line.strokeOpacity = 1;
      valueAxis.renderer.line.strokeWidth = 2;
      valueAxis.renderer.line.stroke = am4core.color('#ffc000');
      valueAxis.renderer.labels.template.fill = am4core.color('#ffc000');
      valueAxis.renderer.labels.template.fontSize = 12;
      // valueAxis.numberFormatter = new am4core.NumberFormatter();
      // valueAxis.numberFormatter.numberFormat = '#.0a';
      valueAxis.renderer.labels.template.adapter.add(
        'text',
        (label: any, target: any) => {
          if (target.dataItem) {
            let data;
            if (Number(target.dataItem.value) > 1000) {
              return this.util.standardFormat(
                Number(target.dataItem.value),
                1,
                ''
              );
            }
            return this.util.standardFormat(
              Number(target.dataItem.value),
              2,
              ''
            );
          }
        }
      );

      chart.data = [];
      let forCheck: any = [];

      // Add data
      e.forEach((dataElement: any, i: any) => {
        chart.data = dataElement;
        forCheck.push(dataElement);
        // Create series
        if (chart.data.length) {
          let series = chart.series.push(new am4charts.LineSeries());
          series.dataFields.valueY = 'data';
          series.dataFields.dateX = 'period';
          series.strokeWidth = 2;
          series.stroke = am4core.color(this.colorList[i]);
          series.fill = am4core.color(this.colorList[i]);
          series.minBulletDistance = 10;
          (series.tooltip as any).label.fontSize = 12;
          // series.tooltipText = `[bold]{sourceCurrencyName} : {data}`;
          (series?.tooltip as any).pointerOrientation = 'vertical';
          series.data = chart.data;
          let self = this;
          series.adapter.add('tooltipHTML', function (html: any, target: any) {
            let data, sourceCurrencyName;
            if (target.tooltipDataItem.dataContext) {
              data = target.tooltipDataItem.dataContext.data;
              sourceCurrencyName =
                target.tooltipDataItem.dataContext.sourceCurrencyName;
              let formattedPrice = self.util.standardFormat(data, 2, '');
              let customHtml = '<p style="text-align: center' + data + '</p>';
              customHtml = sourceCurrencyName + ' : ' + formattedPrice;

              return customHtml;
            }
            return html;
          });
        } else {
          NoDataContent +=
            `** No data Available for country ` +
            this.selectedEconomyCountryData[i].countryName;
        }
      });

      let chartDataCheck = true;
      for (let x of forCheck) {
        if (x.length != 0) {
          chartDataCheck = false;
          break;
        }
      }

      chart.events.on('beforedatavalidated', (ev: any) => {
        if (chartDataCheck) {
          let indicator = (chart.tooltipContainer as any).createChild(
            am4core.Container
          );
          let indicatorLabel = indicator.createChild(am4core.Label);
          indicatorLabel.text = 'No Data Available';
          indicatorLabel.isMeasured = false;
          indicatorLabel.x = 620;
          indicatorLabel.y = 120;
          indicatorLabel.fontSize = 14;
          indicatorLabel.fill = am4core.color('#fff');
        } else {
          let data = NoDataContent.replaceAll(
            '** No data Available for country ',
            ', '
          ).replace(',', '** No data Available for country ');
          d3.appendChild(document.createTextNode(data));
          d1.appendChild(d3);
        }
      });

      d2.onclick = () => {
        this.chartDataGets(forCheck, title.text, 'forex');
      };

      // Add chart's data into a table
      let tableData: any = [];
      forCheck
        .sort()
        .reverse()
        .forEach((element: any, index: any) => {
          if (element.length) {
            element.forEach((el: any, i: any) => {
              let temp: any = {};
              if (index == 0) {
                temp['Date'] = el.period;
                temp[
                  el.sourceCurrencyCode + ' (' + el.sourceCurrencyName + ')'
                ] = parseFloat(el.data).toFixed(2);
                if (tableData.indexOf(el) === -1) {
                  tableData.push(temp);
                }
              } else {
                tableData.forEach((e: any, ind: any) => {
                  if (e.Date == e.period) {
                    tableData[ind][
                      el.sourceCurrencyCode + ' (' + el.sourceCurrencyName + ')'
                    ] = el.data
                      ? this.util.standardFormat(el.period, 2, '')
                      : '-';
                  }
                });
              }
            });
          }
        });

      tableData.sort((a: any, b: any) => a.Date - b.Date).reverse();

      if (tableData.length) {
        // Adding empty value if its not there
        let maxlength: any = 0;
        let maxlengthId: any = 0;

        tableData.forEach((element: any, index: any) => {
          if (Object.keys(element).length > maxlength) {
            maxlength = Object.keys(element).length;
            maxlengthId = index;
          }
        });

        let tempKeys = Object.keys(tableData[maxlengthId]);

        tableData.forEach((element: any) => {
          tempKeys.forEach((el: any) => {
            if (!Object.keys(element).includes(el)) {
              element[el] = '-';
            }
          });
        });
        this.allForexDataTables.push(tableData);
        this.allForexDataTables[this.allForexDataTables.length - 1][
          'tableTitle'
        ] = e.forexName;
      }

      // Add cursor
      chart.cursor = new am4charts.XYCursor();
      chart.cursor.xAxis = dateAxis;
    });
    this.chartDataCheck();
  }

  //For company Data Structure Formation and graph
  commodityChart() {
    this.allCommodityDataTables = [];
    var mainElement: any = document.getElementById('commodityChartCustom');
    mainElement.innerHTML = '';
    let d1: any, d2: any, d3: any;
    let NoDataContent: any = '';

    if (document.querySelector('#commodityChart') == null) {
      d1 = document.createElement('div');
      d1.setAttribute('id', 'commodityChart');
      d1.setAttribute('style', 'min-height: 16rem;');
      d1.appendChild(document.createTextNode(''));

      d2 = document.createElement('img');
      d2.setAttribute('src', 'assets/img/resize-icon.png');
      d2.setAttribute(
        'style',
        'position: relative; top: -1rem; left: 5rem;cursor:pointer;z-index:1'
      );

      d3 = document.createElement('p');
      d3.setAttribute(
        'style',
        'font-size: 12px;margin-left: 5rem;position: relative;top:6rem'
      );

      mainElement.appendChild(d1);
      $(`#commodityChartCustom > div:last`).before(d2);
    } else {
      d1 = document.querySelector('#commodityChart');
      d1.innerHTML = '';
    }

    // Create chart instance
    am4core.options.commercialLicense = true;

    this.chart = am4core.create('commodityChart', am4charts.XYChart);
    // $(document).ready(function () {
    //   $('g[aria-labelledby]').hide();
    // });

    // Create axes

    let dateAxis: any = this.chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.tooltipDateFormat = 'dd-MM-yy';
    dateAxis.renderer.line.strokeOpacity = 1;
    dateAxis.renderer.line.strokeWidth = 2;
    dateAxis.renderer.line.stroke = am4core.color('#ffc000');
    dateAxis.renderer.labels.template.fill = am4core.color('#ffc000');
    dateAxis.renderer.minGridDistance = 70;
    dateAxis.renderer.labels.template.fontSize = 12;
    dateAxis.tooltip.background.cornerRadius = 3;
    dateAxis.tooltip.label.fontSize = 12;
    dateAxis.tooltip.label.padding(5, 5, 5, 5);
    dateAxis.startLocation = 0.5;
    dateAxis.endLocation = 0.6;

    if (this.date_type == '1W') {
      dateAxis.dateFormats.setKey('day', 'dd-MM-yy');
      dateAxis.dateFormats.setKey('week', 'dd-MM-yy');
      dateAxis.dateFormats.setKey('month', 'dd-MM-yy');
      dateAxis.dateFormats.setKey('year', 'dd-MM-yy');
    } else if (this.date_type == '3M') {
      dateAxis.dateFormats.setKey('day', 'dd-MM-yy');
      dateAxis.dateFormats.setKey('week', 'dd MMM');
      dateAxis.dateFormats.setKey('month', 'dd MMM');
      dateAxis.dateFormats.setKey('year', 'dd MMM');
      dateAxis.periodChangeDateFormats.setKey('day', 'dd-MM-yy');
      dateAxis.periodChangeDateFormats.setKey('week', 'dd MMM');
      dateAxis.periodChangeDateFormats.setKey('month', 'dd MMM');
      dateAxis.periodChangeDateFormats.setKey('year', 'dd MMM');
    } else if (
      this.date_type == '6M' ||
      this.date_type == '1Y' ||
      this.date_type == '5Y'
    ) {
      dateAxis.dateFormats.setKey('day', 'dd-MM-yy');
      dateAxis.dateFormats.setKey('week', 'dd MMM');
      dateAxis.dateFormats.setKey('month', 'MMM yyyy');
      dateAxis.dateFormats.setKey('year', 'MMM yyyy');
      dateAxis.periodChangeDateFormats.setKey('day', 'dd-MM-yy');
      dateAxis.periodChangeDateFormats.setKey('week', 'dd MMM');
      dateAxis.periodChangeDateFormats.setKey('month', 'MMM yyyy');
      dateAxis.periodChangeDateFormats.setKey('year', 'MMM yyyy');
    } else if (this.date_type == '10Y') {
      dateAxis.renderer.minGridDistance = 80;
      dateAxis.dateFormats.setKey('day', 'dd-MM-yy');
      dateAxis.dateFormats.setKey('week', 'dd MMM');
      dateAxis.dateFormats.setKey('month', 'MMM yyyy');
      dateAxis.dateFormats.setKey('year', 'yyyy');
      dateAxis.periodChangeDateFormats.setKey('day', 'dd-MM-yy');
      dateAxis.periodChangeDateFormats.setKey('week', 'dd MMM');
      dateAxis.periodChangeDateFormats.setKey('month', 'MMM yyyy');
      dateAxis.periodChangeDateFormats.setKey('year', 'yyyy');
    } else if (this.date_type == 'MAX') {
      dateAxis.renderer.minGridDistance = 80;
      dateAxis.dateFormats.setKey('day', 'dd-MM-yy');
      dateAxis.dateFormats.setKey('week', 'dd MMM');
      dateAxis.dateFormats.setKey('month', 'MMM yyyy');
      dateAxis.dateFormats.setKey('year', 'yyyy');
      dateAxis.periodChangeDateFormats.setKey('day', 'dd-MM-yy');
      dateAxis.periodChangeDateFormats.setKey('week', 'dd MMM');
      dateAxis.periodChangeDateFormats.setKey('month', 'MMM yyyy');
      dateAxis.periodChangeDateFormats.setKey('year', 'yyyy');
    } else {
      dateAxis.dateFormats.setKey('day', 'dd-MM-yy');
      dateAxis.dateFormats.setKey('week', 'dd MMM');
      dateAxis.dateFormats.setKey('month', 'dd MMM');
      dateAxis.dateFormats.setKey('year', 'dd MMM');
      dateAxis.periodChangeDateFormats.setKey('day', 'dd-MM-yy');
      dateAxis.periodChangeDateFormats.setKey('week', 'dd MMM');
      dateAxis.periodChangeDateFormats.setKey('month', 'dd MMM');
      dateAxis.periodChangeDateFormats.setKey('year', 'dd MMM');
    }

    // dateAxis.renderer.minLabelPosition = 0.01;
    // dateAxis.skipEmptyPeriods = true;

    let valueAxis = this.chart.yAxes.push(new am4charts.ValueAxis());
    (valueAxis.tooltip as any).disabled = true;
    valueAxis.renderer.line.strokeOpacity = 1;
    valueAxis.renderer.line.strokeWidth = 2;
    valueAxis.renderer.line.stroke = am4core.color('#ffc000');
    valueAxis.renderer.labels.template.fill = am4core.color('#ffc000');
    valueAxis.renderer.labels.template.fontSize = 12;
    // valueAxis.numberFormatter = new am4core.NumberFormatter();
    // valueAxis.numberFormatter.numberFormat = '#.0a';
    valueAxis.renderer.labels.template.adapter.add(
      'text',
      (label: any, target: any) => {
        if (target.dataItem) {
          let data;
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

    this.chart.data = [];
    let forCheck: any = [];

    this.selectedCommodity.forEach((element: any, index: any) => {
      if (element.customLableCheck) {
        this.chart.data = this.CommodityChartData.filter(
          (elem: any) => elem.name === element.name
        );
        forCheck.push(this.chart.data);
        // Create series
        if (this.chart.data.length) {
          let series = this.chart.series.push(new am4charts.LineSeries());
          series.dataFields.valueY = 'value';
          series.dataFields.dateX = 'date';
          series.strokeWidth = 2;
          series.stroke = am4core.color(this.colorList[index]);
          series.fill = am4core.color(this.colorList[index]);
          series.minBulletDistance = 10;
          (series.tooltip as any).label.fontSize = 12;
          // series.tooltipText = `[bold]{name} : {value}`;
          (series?.tooltip as any).pointerOrientation = 'vertical';
          series.data = this.chart.data;
          let self = this;
          series.adapter.add('tooltipHTML', function (html: any, target: any) {
            let data, name;
            if (target.tooltipDataItem.dataContext) {
              data = target.tooltipDataItem.dataContext.value;
              name = target.tooltipDataItem.dataContext.name;
              let formattedPrice = self.util.standardFormat(data, 2, '');
              let customHtml = '<p style="text-align: center' + data + '</p>';
              customHtml = name + ' : ' + formattedPrice;

              return customHtml;
            }
            return html;
          });
        } else {
          NoDataContent += `** No data Available for commodity ` + element.name;
        }
      }
    });

    let chartDataCheck = true;
    for (let x of forCheck) {
      if (x.length != 0) {
        chartDataCheck = false;
        break;
      }
    }

    if (chartDataCheck) {
      let indicator = (this.chart.tooltipContainer as any).createChild(
        am4core.Container
      );
      let indicatorLabel = indicator.createChild(am4core.Label);
      indicatorLabel.text = 'No Data Available';
      indicatorLabel.isMeasured = false;
      indicatorLabel.x = 520;
      indicatorLabel.y = 120;
      indicatorLabel.fontSize = 14;
      indicatorLabel.fill = am4core.color('#fff');
    } else {
      let data = NoDataContent.replaceAll(
        '** No data Available for country ',
        ', '
      ).replace(',', '** No data Available for country ');
      d3.appendChild(document.createTextNode(data));
      d1.appendChild(d3);
    }

    d2.onclick = () => {
      this.chartDataGets(forCheck, 'Commodity (% Daily Change)', 'commodity');
    };

    // Add chart's data into a table
    let tableData: any = [];
    forCheck
      .sort()
      .reverse()
      .forEach((element: any, index: any) => {
        if (element.length) {
          element.forEach((el: any, i: any) => {
            let temp: any = {};
            if (index == 0) {
              temp['Date'] = el.date;
              temp[el.name] = this.util.standardFormat(el.value, 2, '');
              if (tableData.indexOf(el) === -1) {
                tableData.push(temp);
              }
            } else {
              tableData.forEach((e: any, ind: any) => {
                if (e.Date == el.date) {
                  tableData[ind][el.name] = el.value
                    ? this.util.standardFormat(el.value, 2, '')
                    : '-';
                }
              });
            }
          });
        }
      });

    tableData.sort((a: any, b: any) => a.Date - b.Date).reverse();

    if (tableData.length) {
      // Adding empty value if its not there
      let maxlength: any = 0;
      let maxlengthId: any = 0;

      tableData.forEach((element: any, index: any) => {
        if (Object.keys(element).length > maxlength) {
          maxlength = Object.keys(element).length;
          maxlengthId = index;
        }
      });

      let tempKeys = Object.keys(tableData[maxlengthId]);

      tableData.forEach((element: any) => {
        tempKeys.forEach((el: any) => {
          if (!Object.keys(element).includes(el)) {
            element[el] = '-';
          }
        });
      });
      this.allCommodityDataTables.push(tableData);
    }

    // Add cursor
    this.chart.cursor = new am4charts.XYCursor();
    this.chart.cursor.xAxis = dateAxis;

    this.chartDataCheck();
  }

  dateChange(type: any) {
    this.date_type = type;
    if (type) {
      let temp: any = [];
      this.util.setDateHandler(type);
      this.selectedCommodity.forEach((element: any) => {
        let endDate =
          this.commodityData.commodityDataMap[element.symbol][
            this.commodityData.commodityDataMap[element.symbol].length - 1
          ].period;
        this.util.endDate = new Date(endDate);
        if (this.util.startDate) {
          this.util.startDate = new Date(
            this.util.startDate.getFullYear(),
            this.util.startDate.getMonth(),
            this.util.startDate.getDate() + 1
          );
        } else {
          this.util.startDate = new Date('01-01-1960');
        }
        let filterRangeData: any = this.commodityData.commodityDataMap[
          element.symbol
        ].filter((el: any) => {
          return new Date(el.period) > this.util.startDate ? el : '';
        });
        filterRangeData.forEach((el: any) => {
          temp.push({
            date: el.period,
            value: el.dailyChange,
            name: el.name,
          });
        });
      });
      this.CommodityChartData = temp;
      this.commodityChart();
    }
  }

  downloadExcel() {
    let companyRequestData: any = [];
    let industryequestData: any = [];
    let economyRequestData: any = [];
    let commodityRequestData: any = [];
    let stockRequestData: any = null;

    // For company Data Formation
    let companyIds: any = [];
    this.selectedCompany.forEach((el: any) => {
      if (el.customLableCheck) {
        companyIds.push(el.id);
      }
    });
    let stockMetrics: any = [];
    this.selectedCompanyMetrices.forEach((el: any) => {
      if (el.customLableCheck) {
        if (el?.financialType === 'stock') {
          stockMetrics.push(el.fieldName);
          stockRequestData = {
            companyList: companyIds,
            endDate: this.endDate,
            fieldName: stockMetrics,
            fieldType: el.financialType,
            periodicity: 'daily',
            startDate: this.startDate,
            currency: this.selectedCurrency,
          };
        } else {
          companyRequestData.push({
            companyList: companyIds,
            endDate: this.endDate,
            fieldName: [el.fieldName],
            fieldType: el.financialType,
            periodicity: this.selectedPeriod,
            startDate: this.startDate,
            currency: this.selectedCurrency,
          });
        }
      }
    });

    //For Economy Data Formation
    let economyCountryLists: any = [];
    let economyIndicatorsList: any = [];
    this.selectedEconomyCountryData.forEach((el: any) => {
      if (el.customLableCheck) {
        economyCountryLists.push(el.countryIsoCode3);
      }
    });
    this.selectedEconomyIndicatorData.forEach((el: any) => {
      if (el.customLableCheck) {
        economyIndicatorsList.push({
          indicatorName: el.category,
          periodicity: el.periodType,
        });
      }
    });

    // For Commodity Data Formation
    let symbol: any = [];
    this.selectedCommodity.forEach((el: any) => {
      if (el.customLableCheck) {
        symbol.push(el.symbol);
      }
    });

    // For Industry Data Formation
    let industryCountryIds: any = [];
    let industryTicsIndustryCodes: any = [];
    let industryFieldNames: any = [];

    this.selectedIndustry.forEach((el: any) => {
      if (el.customLableCheck) {
        industryTicsIndustryCodes.push(el.ticsIndustryCode);
      }
    });
    this.selectedIndustryCountry.forEach((el: any) => {
      if (el.customLableCheck) {
        industryCountryIds.push(el.id);
      }
    });
    this.selectedIndustryMetrices.forEach((el: any) => {
      if (el.customLableCheck) {
        industryFieldNames.push(el.fieldName);
      }
    });

    // All Datas

    economyRequestData = {
      countryList: economyCountryLists,
      endDate: this.endDate,
      fieldType: 'indicator',
      startDate: this.startDate,
      currencyList: [this.selectedCurrency],
      indicators: economyIndicatorsList,
      targetCurrency: 'USD',
    };

    industryequestData = {
      countryId: industryCountryIds,
      currency: this.selectedCurrency,
      endDate: this.endDate,
      fieldNames: industryFieldNames,
      ticsIndustryCodes: industryTicsIndustryCodes,
      periodicity: this.selectedPeriod,
      startDate: this.startDate,
      type: this.industryChoice,
    };

    commodityRequestData = {
      commoditySymbolList: symbol,
      startDate: this.startDate,
      endDate: this.endDate,
      currency: this.selectedCurrency,
    };

    // For Economy empty check
    let economyNullCheck = true;
    if (economyCountryLists.length == 0 || economyIndicatorsList.length == 0) {
      economyNullCheck = false;
    }

    // For Industry empty check
    let industryNullCheck = true;
    if (
      industryCountryIds.length == 0 ||
      industryFieldNames.length == 0 ||
      industryTicsIndustryCodes.length == 0
    ) {
      industryNullCheck = false;
    }

    // For Commodity Empty check
    let commodityNullCheck = true;
    if (symbol.length == 0) {
      commodityNullCheck = false;
    }

    let value: any = {
      stockRequest: stockRequestData,
      companyRequest:
        companyRequestData.length == 0 ? null : companyRequestData,
      economyRequest: economyNullCheck ? economyRequestData : null,
      forexRequest: null,
      industryRequest: industryNullCheck ? industryequestData : null,
      commodityRequest: commodityNullCheck ? commodityRequestData : null,
    };

    this.financialMarketData.downloadExcelFile(value).subscribe(
      (res: any) => {
        const blob = new Blob([res.body], {
          type: 'application/vnd.ms.excel',
        });
        const file = new File([blob], 'DataDownload.xls', {
          type: 'application/vnd.ms.excel',
        });
        saveAs(file);
      },
      (err) => {
        console.log('err', err.message);

        if (err.status === 402) {
          this.auth.freeTrialAlert = true;
        }
      }
    );
  }

  chartDataGets(data: any, title: any, type: any) {
    this.chartModelData = data;
    this.chartModelTitle = title;
    this.chartModelType = type;
    this.auth.openPopupModal = true;
  }

  toggleTable() {
    this.isChartOrTable = !this.isChartOrTable;
    if (this.isChartOrTable == false) {
      this.stockVolumeTableData();
    }
  }
}

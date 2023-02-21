import { Component, OnInit } from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FinancialMarketDataService } from 'src/app/services/financialmarketdata.service';
import { UtilService } from 'src/app/services/util.service';
import { ActivatedRoute } from '@angular/router';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-economy',
  templateUrl: './economy.component.html',
  styleUrls: ['./economy.component.scss'],
})
export class EconomyComponent implements OnInit {
  single_news_detail: any;
  news_list: any = [];
  selectEconomyData: any = [];
  selectedEconomyObj: any;
  selectedEconomy: any = 'GDP Annual Growth Rate (Quarterly)';
  economyList: any;
  countryData: any = [];
  selectedCountry: any = '';
  selectedCountryObj: any;
  economyHistoricalChart: any;
  national_accounts: any = [];
  price_index: any = [];
  money_market: any = [];
  consumer: any = [];
  industrial_productivity: any = [];
  labour_and_wages: any = [];
  other_indicator: any = [];
  country_risk_profile_data: any = [];
  country_exchange_data: any = [];
  country_exchange_object: any = {};
  filter_currency_data: any = [];
  forecastCommodityDataMap = new Map();
  quarterList: any = [];
  allEconomyData: any = [];
  price_list: any;
  MergeChartDate: any = [];
  startDate: any;
  childData: any = {};
  exponse_table_data = {
    title: [
      {
        label: 'Indicator',
        width: '230px',
      },
      {
        label: 'Period',
        width: '70px',
      },
      {
        label: 'Value',
        width: '75px',
      },
      {
        label: 'YOY Change',
        width: '65px',
        align: 'right',
      },
      {
        label: 'Estimates',
        align: 'center',
      },
    ],
  };
  chart: any;
  constructor(
    public auth: AuthService,
    private financialMarketData: FinancialMarketDataService,
    public util: UtilService,
    private activatedRoute: ActivatedRoute
  ) {}

  count_res: any = 0;
  total_count_res: any = '';
  selectedCountryCode: any = 'USA';
  country_list: any;
  ngOnInit(): void {
    this.util.loaderService.display(true);
    $(document).on('select2:open', () => {
      const inputs: any = document.querySelectorAll(
        '.select2-search__field[aria-controls]'
      );
      const mostRecentlyOpenedInput = inputs[inputs.length - 1];
      mostRecentlyOpenedInput.focus();
    });
    if (
      Object.keys((this.activatedRoute.queryParams as any)?.value).length != 0
    ) {
      this.activatedRoute.queryParamMap.subscribe((params: any) => {
        this.selectedCountry = params.params.countryCode;
        if (params.params.category) {
          let category = params.params.category;
          let period = params.params.period;
          this.selectedEconomy = `${category} (${period})`;
        }

        this.util.loaderService.display(true);
        this.count_res = 0;
        this.total_count_res = 8;
        this.countryListHandler();
      });
    } else {
      this.financialMarketData.getCountryIp().subscribe((res: any) => {
        this.selectedCountry = res.countryCode;
        this.util.loaderService.display(true);
        this.count_res = 0;
        this.total_count_res = 8;
        this.countryListHandler();
      });
    }
  }

  doCheckCount: any = false;
  ngDoCheck(): void {
    if (this.count_res === 8 && !this.doCheckCount) {
      this.util.loaderService.showTutorial(true);
      this.doCheckCount = true;
    }
  }

  indicatorListDataAvail: any = false;
  economyListHandler(data: any) {
    let formattedData: any = [];
    let body = {
      countryIsoCodeList: data ? data : '',
    };
    this.financialMarketData
      .getIndicatorsListSelection(body)
      .subscribe((res) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);
        if (res.length) {
          this.indicatorListDataAvail = true;
          this.economyList = res;
          res.forEach((element: any) => {
            formattedData.push({
              id: element.category + ' (' + element.periodType + ')',
              text: element.category + ' (' + element.periodType + ')',
            });
            this.selectEconomyData = formattedData;
          });

          res.filter((el: any) => {
            if (
              el.category + ' (' + el.periodType + ')' ==
              this.selectedEconomy
            ) {
              this.selectedEconomyObj = el;
            }
          });
          if (!this.selectedEconomyObj) {
            res.filter((el: any) => {
              if (
                el.category + ' (' + el.periodType + ')' ==
                'GDP Annual Growth Rate (Yearly)'
              ) {
                this.selectedEconomyObj = el;
                this.selectedEconomy =
                  this.selectedEconomyObj.category +
                  ' (' +
                  this.selectedEconomyObj.periodType +
                  ')';
              }
            });
          }
          if (!this.selectedEconomyObj) {
            this.selectedEconomyObj = res[0];
            this.selectedEconomy =
              this.selectedEconomyObj.category +
              ' (' +
              this.selectedEconomyObj.periodType +
              ')';
          }
          this.EconomyHistorical(
            this.selectedEconomyObj,
            this.selectedCountryObj.countryIsoCode3
          );
          this.EconomyHistoricalData(
            this.selectedEconomyObj,
            this.selectedCountryObj.countryIsoCode3
          );
        } else {
          this.indicatorListDataAvail = false;
          this.count_res += 2;
          this.lineGraph();
        }
      });
  }

  onEconomyChanged(data: any) {
    if (this.economyHistoricalChart && this.selectedEconomy !== data) {
      this.selectedEconomy = data;
      this.economyList.filter((el: any) => {
        if (el.category + ' (' + el.periodType + ')' == this.selectedEconomy) {
          this.selectedEconomyObj = el;
          this.count_res = 0;
          this.total_count_res = 1;
          this.util.loaderService.display(true);
          this.EconomyHistorical(
            this.selectedEconomyObj,
            this.selectedCountryObj.countryIsoCode3
          );
          this.EconomyHistoricalData(
            this.selectedEconomyObj,
            this.selectedCountryObj.countryIsoCode3
          );
        }
      });
    }
  }

  countryListHandler() {
    this.financialMarketData.getCountry().subscribe(
      (res) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);
        let formattedData: any = [];
        res.forEach((element: any) => {
          this.country_list = res;
          formattedData.push({
            id: element.countryIsoCode3,
            text: element.countryName,
          });
          this.countryData = formattedData;
        });
        res.filter((el: any) => {
          if (
            el.countryIsoCode3 == this.selectedCountry ||
            el.countryIsoCode2 == this.selectedCountry
          ) {
            this.selectedCountryObj = el;
            this.economyListHandler(this.selectedCountryObj.countryIsoCode3);
            this.nationalBelowTableDate(
              this.selectedCountryObj.countryIsoCode3
            );
            this.CountryRiskProfile(this.selectedCountryObj.countryIsoCode3);
            this.countryExchangeRate(this.selectedCountryObj.id);
            this.newsList(this.selectedCountryObj.countryIsoCode3);
          }
        });
      },
      (err) => {
        console.log('error', err.message);
      }
    );
  }
  onCountryChanged(data: any) {
    if (this.countryData && this.selectedCountry !== data) {
      this.selectedCountry = data;
      this.country_list.filter((el: any) => {
        if (el.countryIsoCode3 == data) this.selectedCountryObj = el;
      });
      this.count_res = 0;
      this.total_count_res = 6;
      this.util.loaderService.display(true);
      window.location.search = `countryCode=${data}`;
      this.nationalBelowTableDate(data, 'country');
      this.EconomyHistoricalData(this.selectedEconomyObj, data);
      this.EconomyHistorical(this.selectedEconomyObj, data);
      this.economyListHandler(data);
      this.CountryRiskProfile(data);
      this.countryExchangeRate(this.selectedCountryObj.id);
      this.newsList(data);
    }
  }

  EconomyHistoricalData(data: any, country_code?: any) {
    this.economyHistoricalChart = [];
    let body = {
      countryIsoCodeList: country_code,
      indicatorNameList: data.category,
      periodType: data.periodType,
    };
    this.financialMarketData
      .getEconomyHistoricalDataWithForecast(body)
      .subscribe(
        (res) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);
          this.economyHistoricalChart = res;

          this.price_list = res.slice(1);
          let today = new Date();
          this.startDate = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate() - 1
          );

          this.forcastCaluclate();
        },
        (err) => {
          console.log('error', err.message);
        }
      );
  }
  economyGraphData: any;
  EconomyHistorical(data: any, country_code?: any) {
    this.economyGraphData = [];
    let body = {
      countryIsoCodeList: country_code,
      indicatorNameList: data?.category,
      periodType: data?.periodType,
    };
    this.financialMarketData.getEconomyHistoricalData(body).subscribe(
      (res) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);
        this.economyGraphData = res;

        this.price_list = res.slice(1);
        let today = new Date();
        this.startDate = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() - 1
        );
        // if (this.allEconomyData.length > 0) {
        //   this.forcastCaluclate();
        // }
      },
      (err) => {
        console.log('error', err.message);
      }
    );
  }

  formatEconomyData() {
    this.economyList?.map((val1: any) => {
      this.allEconomyData?.map((val2: any) => {
        if (val1?.indicatorDataId == val2?.indicatorDataId) {
          val1.forecastQ1 = val2.forecastQ1;
          val1.forecastQ2 = val2.forecastQ2;
          val1.forecastQ3 = val2.forecastQ3;
          val1.forecastQ4 = val2.forecastQ4;
          val1.forecastY1 = val2.forecastY1;
          val1.forecastY2 = val2.forecastY2;
          val1.forecastY3 = val2.forecastY3;
        }
      });
    });
    // this.forcastCaluclate();
  }
  CountryRiskProfile(country_code: any) {
    this.financialMarketData.getCountryRiskProfile(country_code).subscribe(
      (res) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);
        this.country_risk_profile_data = res;
      },
      (err) => {
        console.log('error', err.message);
      }
    );
  }
  countryExchangeRate(country_id: any) {
    this.financialMarketData.getCountryExchangeRate(country_id).subscribe(
      (res) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);
        this.country_exchange_data = res;
        this.country_exchange_object = res[0];
        this.filter_currency_data = res;

        for (var i = 0; i < this.country_exchange_data.length; i++) {
          this.country_exchange_data[i].data =
            1 / this.country_exchange_data[i].data;
        }
      },
      (err) => {
        console.log('error', err.message);
      }
    );
  }
  filter_currency_data1: any = [];
  applyFilterExchangeRate(event: any) {
    this.filter_currency_data1 = this.filter_currency_data;
    this.country_exchange_data = this.filter_currency_data1.filter(
      (e: any) =>
        e.targetCurrencyCode
          .toLowerCase()
          .includes(event.target.value.toLowerCase()) ||
        e.targetCurrencyName
          .toLowerCase()
          .includes(event.target.value.toLowerCase())
    );
  }

  handleSortType(e: any) {
    this.filter_currency_data1 = this.filter_currency_data;
    if (e) {
      for (var i = 0; i < this.filter_currency_data.length; i++) {
        this.filter_currency_data1[i].data =
          1 / this.filter_currency_data[i].data;
      }
    } else {
      for (var i = 0; i < this.filter_currency_data.length; i++) {
        this.filter_currency_data1[i].data =
          1 / this.filter_currency_data[i].data;
      }
    }
  }

  newsList(country_code: any) {
    let body = {
      countryIsoCode: country_code,
    };
    this.financialMarketData.getNewsEconomy(body).subscribe(
      (res) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);
        this.news_list = res;
        if (this.news_list.length <= 16) {
          for (let i = this.news_list.length; i <= 16; i++) {
            this.news_list.push({
              emptyTitle: '-',
              emptyPriod: '-',
            });
          }
        }
      },
      (err) => {
        console.log('error', err.message);
      }
    );
  }

  dialogPopup(news_detail: any) {
    this.auth.closeInsidePopup = true;
    this.single_news_detail = news_detail;
  }

  nationalBelowTableDate(country_code: any, type?: any) {
    this.national_accounts = [];
    this.price_index = [];
    this.money_market = [];
    this.industrial_productivity = [];
    this.consumer = [];
    this.labour_and_wages = [];
    this.other_indicator = [];
    this.childData = {};
    this.financialMarketData
      .getNationalBelowTableData(country_code)
      .subscribe((res) => {
        this.allEconomyData = res;
        this.formatEconomyData();
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);
        res.forEach((el: any) => {
          if (el?.telCategory) {
            if (!el?.telCategeoryParentId) {
              this.filterEconomyTableHandler(el, el.telCategoryGroup);
            }
            this.createChildDataHandler(el);
          }
        });
      });
  }

  onExcelDownload() {
    var body: any = {};
    body.startDate = null;
    body.endDate = null;
    body.equity = [];
    // console.log(this.selectedCountryObj);
    this.util.loaderService.display(true);
    this.count_res = 0;
    this.total_count_res = 1;
    body.economy = [
      {
        type: 'economyCountry',
        id: this.selectedCountryObj.countryIsoCode3,
        periodicity: this.selectedEconomyObj.periodType,
        filterList: [this.selectedEconomyObj.category],
      },
    ];
    this.financialMarketData.downloadEconomyExcel(body).subscribe(
      (res: any) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);
        const blob = new Blob([res.body], {
          type: 'application/vnd.ms.excel',
        });
        const file = new File(
          [blob],
          `${this.selectedEconomyObj.category}(${this.selectedEconomyObj.periodType}).XLSX`,
          {
            type: 'application/vnd.ms.excel',
          }
        );
        saveAs(file);
      },
      (err: any) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);
        if (err.status === 402) {
          this.auth.freeTrialAlert = true;
        }
      }
    );
  }

  createChildDataHandler(el: any) {
    if (this.selectedCountry == 'JPN') {
      if (this.childData['child' + el?.telCategeoryParentId] !== undefined) {
        this.childData['child' + el?.telCategeoryParentId].push(el);
      } else {
        if (el?.telCategeoryParentId) {
          this.childData['child' + el?.telCategeoryParentId] = [];
          this.childData['child' + el?.telCategeoryParentId].push(el);
        }
      }
    } else {
      if (el.telCategory != 'Tokyo CPI') {
        if (this.childData['child' + el?.telCategeoryParentId] !== undefined) {
          this.childData['child' + el?.telCategeoryParentId].push(el);
        } else {
          if (el?.telCategeoryParentId) {
            this.childData['child' + el?.telCategeoryParentId] = [];
            this.childData['child' + el?.telCategeoryParentId].push(el);
          }
        }
      }
    }
  }

  filterEconomyTableHandler(data: object, key: string) {
    switch (key) {
      case 'National Accounts':
        this.national_accounts.push(data);
        break;
      case 'Price Index':
        this.price_index.push(data);
        break;
      case 'Money Market':
        this.money_market.push(data);
        break;
      case 'Industrial Productivity':
        this.industrial_productivity.push(data);
        break;
      case 'Consumer':
        this.consumer.push(data);
        break;
      case 'Labor and Wages':
        this.labour_and_wages.push(data);
        break;
      case 'Other Indicators':
        this.other_indicator.push(data);
        break;
      default:
    }
  }

  lineGraph() {
    am4core.options.commercialLicense = true;
    this.chart = am4core.create('chartdiv', am4charts.XYChart);
    // $(document).ready(function () {
    //   $('g[aria-labelledby]').hide();
    // });
    let data: any = [];
    let all_data: any;
    let dashDot: any;
    this.MergeChartDate.map((ele: any, i: any) => {
      dashDot = ele.dashLength;
      data.push({
        date: ele.period,
        value: ele.data,
        dataType: ele.dataType,
      });
    });

    this.chart.data = data;
    this.chart.events.on('beforedatavalidated', (ev: any) => {
      // check if there's data

      if (ev.target.data.length === 0) {
        let indicator = this.chart.tooltipContainer.createChild(
          am4core.Container
        );

        let indicatorLabel = indicator.createChild(am4core.Label);

        indicatorLabel.text = 'No Data Available';

        indicatorLabel.isMeasured = false;

        indicatorLabel.x = 310;

        indicatorLabel.y = 100;

        indicatorLabel.fontSize = 14;

        indicatorLabel.fill = am4core.color('#fff');
      }
    });
    this.chart.dateFormatter.inputDateFormat = 'dd-MMM-yyyy';
    // Create axes
    let dateAxis: any = this.chart.xAxes.push(new am4charts.DateAxis());
    if (this.checkingPeriodType == 'Yearly') {
      dateAxis.tooltipDateFormat = 'yyyy';
    } else if (
      this.checkingPeriodType == 'Quarterly' ||
      this.checkingPeriodType == 'Monthly'
    ) {
      dateAxis.tooltipDateFormat = 'MMM yyyy';
    } else {
      dateAxis.tooltipDateFormat = 'dd-MM-yy';
    }

    dateAxis.renderer.labels.template.fill = am4core.color('#ffc000');
    dateAxis.renderer.line.stroke = am4core.color('#ffc000');
    dateAxis.renderer.line.strokeWidth = 2;
    dateAxis.renderer.line.strokeOpacity = 1;

    let valueAxis: any = this.chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.tooltip.disabled = true;
    dateAxis.baseInterval = {
      timeUnit: 'day',
      count: 1,
    };
    valueAxis.renderer.grid.template.strokeOpacity = 0.1;
    dateAxis.renderer.grid.template.strokeOpacity = 0.1;

    dateAxis.maxZoomDeclination = 0;

    valueAxis.tooltip.fontSize = 9;
    dateAxis.tooltip.fontSize = 9;

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

    valueAxis.renderer.labels.template.fill = am4core.color('#ffc000');

    valueAxis.renderer.line.stroke = am4core.color('#ffc000');
    valueAxis.renderer.line.strokeWidth = 2;
    valueAxis.renderer.line.strokeOpacity = 1;

    dateAxis.renderer.minGridDistance = 70;

    valueAxis.renderer.fontSize = 12;
    dateAxis.renderer.fontSize = 12;

    valueAxis.renderer.minWidth = 5;

    // Create series
    let series: any = this.chart.series.push(new am4charts.LineSeries());
    series.dataFields.valueY = 'value';
    series.dataFields.dateX = 'date';
    series.dataFields.value = 'dashlength';
    series.tooltipText = '{value}';

    series.tooltipHTML = '{valueY}';
    series.tooltip.getFillFromObject = false;
    series.tooltip.background.cornerRadius = 3;
    series.tooltip.label.fontSize = 9;
    series.tooltip.label.padding(5, 5, 5, 5);
    series.tooltip.pointerOrientation = 'vertical';
    series.tooltip.background.fill = am4core.color('#000000');
    series.strokeWidth = 1.5;
    series.minBulletDistance = 10;
    series.adapter.add('tooltipHTML', function (html: any, target: any) {
      let data;

      if (target.tooltipDataItem.dataContext) {
        data = target.tooltipDataItem.dataContext.value;

        let formattedPrice = self.util.standardFormat(data, 1, '');

        let customHtml = '<p style="text-align: center' + data + '</p>';

        customHtml = formattedPrice;
        return customHtml;
      }

      return html;
    });

    let self = this;

    //range of dash of dotted
    let range = dateAxis.createSeriesRange(series);
    let date = this.MergeChartDate.filter((ele: any) => ele.dashLength == 8);
    var length = this.economyGraphData?.length;
    let i = date.length - 1;
    if (length && date && date[i]['period']) {
      range.date = new Date(this.economyGraphData[length - 1].period);
      range.endDate = new Date(date[i]['period']);
    }
    range.contents.strokeDasharray = '8';
    series.tooltip.background.fill = am4core.color('#000000');

    series.strokeWidth = 1.5;
    series.minBulletDistance = 10;
    //range of dash of dotted

    // make a cursor point
    this.chart.cursor = new am4charts.XYCursor();
    this.chart.cursor.lineY.disabled = true;
    this.chart.cursor.snapToSeries = series;

    this.chart.responsive.enabled = true;
    this.chart.responsive.useDefault = false;
  }

  listNext4Quarters(startDate: any, EndDate: any) {
    var currentMonth = startDate.getMonth() + 1;

    var quarterNames;
    var sYear = startDate.getFullYear();

    if (currentMonth <= 3)
      quarterNames = [
        sYear + '-03-31',
        sYear + '-06-30',
        sYear + '-09-30',
        sYear + '-12-31',
      ];
    else if (currentMonth > 3 && currentMonth <= 6)
      quarterNames = [
        sYear + '-06-30',
        sYear + '-09-30',
        sYear + '-12-31',
        sYear + 1 + '-03-31',
      ];
    else if (currentMonth > 6 && currentMonth <= 9)
      quarterNames = [
        sYear + '-09-30',
        sYear + '-12-31',
        sYear + 1 + '-03-31',
        sYear + 1 + '-06-30',
      ];
    else if (currentMonth > 9 && currentMonth <= 12)
      quarterNames = [
        sYear + '-12-31',
        sYear + 1 + '-03-31',
        sYear + 1 + '-06-30',
        sYear + 1 + '-09-30',
      ];

    // var quarterList = [];

    // for (let i = 0; i < 4; i++) {
    //   quarterList.push(sYear + '-' + quarterNames[i]);

    //   if (quarterNames[i] == '12-31') {
    //     sYear++;
    //   }
    // }
    return quarterNames;
  }

  priviousFourWeeks(date: any, type: any) {
    var d = date.getDate();
    var weekList = [];
    for (let i = 0; i < 4; i++) {
      if (type == 'Weekly') {
        date.setDate(date.getDate() - 7);
      } else if (type == 'Biweekly') {
        date.setDate(date.getDate() - 14);
      } else {
        date.setDate(date.getDate() - 1);
      }
      let newdate = date.toLocaleDateString('en-us', { day: 'numeric' });
      let month = date.toLocaleDateString('en-us', { month: 'numeric' });
      let year = date.toLocaleDateString('en-us', { year: 'numeric' });
      const FormattedDate = year + '-' + month + '-' + newdate;
      weekList.push(FormattedDate);
    }
    return weekList;
  }

  priviousFourMonths(date: any) {
    var d = date.getDate();
    var monthList = [];
    for (let i = 0; i < 4; i++) {
      date.setMonth(date.getMonth() - 1);
      let newdate = date.toLocaleDateString('en-us', { day: 'numeric' });
      let month = date.toLocaleDateString('en-us', { month: 'numeric' });
      let year = date.toLocaleDateString('en-us', { year: 'numeric' });
      const FormattedDate = year + '-' + month + '-' + newdate;
      monthList.push(FormattedDate);
    }
    return monthList;
  }
  nextThreeYears(start: any, endDate: any) {
    var syears = start.getFullYear();
    var yearList = [];
    for (let i = 0; i < 3; i++) {
      // quarterList.push(sYear + '-' + quarterNames[sQuarter - 1]);
      yearList.push(syears + '-' + '12-31');
      if (syears >= 4) {
        syears++;
      }
    }
    return yearList;
  }
  yearsList: any;
  periodType: any;
  monthList: any;
  weekList: any;
  checkingPeriodType: any;
  forcastCaluclate() {
    var forcastData: any;
    // this.quarterList = this.listNext4Quarters(this.startDate, '');
    this.allEconomyData.forEach((element: any) => {
      if (
        element.category + ' (' + element.periodType + ')' ===
        this.selectedEconomy
      ) {
        var newDate = new Date(element.period);
        this.quarterList = this.listNext4Quarters(newDate, '');
        this.monthList = this.priviousFourMonths(newDate);
        this.weekList = this.priviousFourWeeks(newDate, element.periodType);
        this.yearsList = this.nextThreeYears(newDate, '');
        this.periodType = element.periodType;
        this.checkingPeriodType = this.periodType;

        if (element.periodType == 'Yearly') {
          forcastData = [
            {
              period: this.yearsList[0],
              data: element.forecastY1,
              dataType: 'forecast',
              dashLength: 8,
            },
            {
              period: this.yearsList[1],
              data: element.forecastY2,
              dataType: 'forecast',
              dashLength: 8,
            },
            {
              period: this.yearsList[2],
              data: element.forecastY3,
              dataType: 'forecast',
              dashLength: 8,
            },
          ];
        } else if (element.periodType != 'Yearly' && element.q1Date !== null) {
          forcastData = [
            {
              period: element.q1Date ? element.q1Date : '',
              data: element.forecastQ1,
              dataType: 'forecast',
              dashLength: 8,
            },
            {
              period: element.q2Date ? element.q2Date : '',
              data: element.forecastQ2,
              dataType: 'forecast',
              dashLength: 8,
            },
            {
              period: element.q3Date ? element.q3Date : '',
              data: element.forecastQ3,
              dataType: 'forecast',
              dashLength: 8,
            },
            {
              period: element.q4Date ? element.q4Date : '',
              data: element.forecastQ4,
              dataType: 'forecast',
              dashLength: 8,
            },
          ];
        } else {
          forcastData = [];
        }
        // {
        // {
        //   period: this.yearsList[0],
        //   data: element.forecastY1,
        //   dataType: 'forecast',
        //   dashLength: 8,
        // },
        // {
        //   period: this.yearsList[1],
        //   data: element.forecastY2,
        //   dataType: 'forecast',
        //   dashLength: 8,
        // },
        // {
        //   period: this.yearsList[2],
        //   data: element.forecastY3,
        //   dataType: 'forecast',
        //   dashLength: 8,
        // },
        // ];
      }
    });
    if (this.price_list.length) {
      this.price_list[this.price_list.length - 1]['dashLength'] = 8;
    }
    this.MergeChartDate = [...this.economyHistoricalChart];
    this.lineGraph();
  }
}

import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FinancialMarketDataService } from 'src/app/services/financialmarketdata.service';
import { DatePipe} from '@angular/common';
import { UtilService } from 'src/app/services/util.service';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { saveAs } from 'file-saver';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Params, Router } from '@angular/router';

/* Chart code */
// Themes begin
am4core.useTheme(am4themes_animated);
// Themes end
@Component({
  selector: 'app-commodity',
  templateUrl: './commodity.component.html',
  styleUrls: ['./commodity.component.scss'],
})
export class CommodityComponent implements OnInit {
  // Env variable
  phase_two_commodity_base_url: any = environment.phase_two_commodity_base_url;

  news_list: any = [];
  commodityList: any = [];
  energy: any = [];
  agricultural: any = [];
  livestock: any = [];
  base_metals: any = [];
  precious_metals: any = [];
  industrial: any = [];
  indices: any = [];
  single_news_detail: any;
  price_list: any;
  selectCommodityData: any = [];
  selectedCommodityData: any;
  selectedCommodity: any = 'CL1:COM';
  currencyData: any = [];
  selectedCurrency: any;
  selectedChartType = '1W';
  // chart data
  forecastCommodityDataMap = new Map();
  quarterList: any = [];
  MergeChartDate: any = [];
  startDate: any;
  //intro js
  @ViewChild('labelRef ', { static: false }) labelRef: ElementRef | any;
  // chart data

  // -------------------- For OTC Data
  tabName: any = 'Details';
  otcTabName: any = 'Precious Metals';

  constructor(
    public auth: AuthService,
    private financialMarketData: FinancialMarketDataService,
    public datepipe: DatePipe,
    public util: UtilService,
    public router: Router,
    private elementRef: ElementRef,
    private activateRoute: ActivatedRoute
  ) {
    this.activateRoute.queryParams.subscribe((params: Params) => {
      this.queryParamSection = params['tabSection'];
      if (this.queryParamSection == 'Dashboard') {
        this.tabName = 'Dashboard';
      } else if (this.queryParamSection == 'leftDetails') {
        this.tabName = 'leftDetails';
      }
    });
  }

  count_res: any = 0;
  total_count_res: any = '';
  queryParamSection: any;
  ngOnInit(): void {
    if (
      Object.keys((this.activateRoute.queryParams as any)?.value).length > 1
    ) {
      this.activateRoute.queryParamMap.subscribe((params: any) => {
        if (this.queryParamSection != 'Dashboard') {
          this.socketConnection();
        }
        // Dashboad section
        if (this.queryParamSection == 'Dashboard') {
          this.selectedCurrency = params.params.currency;
          this.count_res = 0;
          this.total_count_res = 4;
          this.util.loaderService.display(true);
          this.dashboardRedirectInside(params.params);
        }
        if (this.queryParamSection == undefined) {
          this.commodityListHandler(this.selectedCurrency);
        }

        $(document).on('select2:open', () => {
          const inputs: any = document.querySelectorAll(
            '.select2-search__field[aria-controls]'
          );
          const mostRecentlyOpenedInput = inputs[inputs.length - 1];
          mostRecentlyOpenedInput.focus();
        });
        $(document).on('select2:open', () => {
          const search_cursor_point: any = document.querySelector(
            '.select2-search__field'
          );
          search_cursor_point.focus();
        });
      });
    } else {
      if (this.queryParamSection != 'Dashboard') {
        this.socketConnection();
      }
      // Dashboad section
      if (this.queryParamSection == 'Dashboard') {
        this.count_res = 0;
        this.total_count_res = 4;
        this.util.loaderService.display(true);
        this.dashboardRedirectInside(
          JSON.parse(localStorage.getItem('commoditySymbol') as any)
        );
      }
      if (this.queryParamSection == undefined) {
        this.commodityListHandler(this.selectedCurrency);
      }

      $(document).on('select2:open', () => {
        const inputs: any = document.querySelectorAll(
          '.select2-search__field[aria-controls]'
        );
        const mostRecentlyOpenedInput = inputs[inputs.length - 1];
        mostRecentlyOpenedInput.focus();
      });
      $(document).on('select2:open', () => {
        const search_cursor_point: any = document.querySelector(
          '.select2-search__field'
        );
        search_cursor_point.focus();
      });
    }
  }

  // ngOnDestroy(): void {
  //   if (this.ws.connected) this.ws.disconnect();
  // }

  // WebSocket connection for commodity api -- Start
  greetings: string[] = [];
  showConversation: boolean = false;
  ws: any;
  name: any;
  disabled: any;
  newWebSocketRes: any;
  metalSubID: any;
  socketConnection() {
    let socket = new SockJS(
      `${this.phase_two_commodity_base_url}/commodity/commodity-socket`
    );
    this.ws = Stomp.over(socket);
    let that = this;
    this.ws.connect(
      {},
      function (frame: any) {
        that.ws.subscribe('/errors', function (message: any) {
          console.log('Error ' + message.body);
        });
        if (that.queryParamSection == undefined) {
          that.energySocket();
          that.metalSocket();
        }
        if (that.queryParamSection == 'leftDetails') {
          that.redirectionToDetailsInner(
            JSON.parse(localStorage.getItem('commodityMEDetails') as any)
          );
        }
      },
      function (error: any) {
        console.log('STOMP error ' + error);
      }
    );
  }

  energySocket() {
    let that = this;
    that.ws.subscribe('/commodity/otc-energy', function (message: any) {
      that.showEnergyData(message.body);
    });
    that.ws.send('/app/connect-commodity', {}, {});
  }

  metalSocket(pageNo?: any) {
    const page_number = pageNo ? pageNo : 0;
      let that = this;
    const metalUrl = `/commodity/metals-energy/${page_number}`;
    const metalSendUrl = `/app/connect-metals/${page_number}`;
    that.ws.subscribe(metalUrl, function (message: any) {
      that.showMetalData(message);
    });

    that.ws.send(metalSendUrl, {}, {});
  }

  showMetalData(message: any) {
    this.tableDataMetal = [];
    this.showConversation = true;
    const metalDataRes = JSON.parse(message.body);
  //  const metalID = message.headers.subscription;
    this.metalSubID = message.headers.subscription;
    this.greetings.push(message);
    this.tableDataMetal = metalDataRes;
    this.tableDataMetal?.content.forEach((element: any) => {
      element['cityIdAndRegionId'] = `${element.cityId} | ${element.regionId}`;
    });
  }

  showEnergyData(message: any) {
    this.showConversation = true;
    const enrgyDataRes = JSON.parse(message);
    let temp: any = [];
    enrgyDataRes.forEach((element: any, index: any) => {
      temp.push(element);
      temp[index][
        'cityIdAndRegionId'
      ] = `${element.cityId} | ${element.regionId}`;
    });
    this.greetings.push(message);
    this.tableDataEnergy = temp;
  }

  // WebSocket connection for commodity api -- End

  excelDownloadHandler() {
    this.count_res = 0;
    this.total_count_res = 1;
    this.util.loaderService.display(true);
    this.financialMarketData
      .excelDownload({
        startDate: this.util.startDate ? this.util.startDate : null,
        endDate: this.util.endDate ? this.util.endDate : null,
        equity: [],
        economy: [],
        commodity: {
          commodityList: [this.selectedCommodity],
          currency: this.selectedCurrency ? this.selectedCurrency : '',
        },
      })
      .subscribe(
        (res: any) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);
          const blob = new Blob([res.body], {
            type: 'application/vnd.ms.excel',
          });
          const file = new File(
            [blob],
            '' + `${this.selectedCommodityData.name}.xlsx`,
            {
              type: 'application/vnd.ms.excel',
            }
          );
          saveAs(file);
        },
        (err) => {
          console.log('err', err.message);
        }
      );
  }

  refreshHandlerResetCurrency() {
    this.selectedCurrency = '';

    this.count_res = 0;
    this.total_count_res = 4;
    this.util.loaderService.display(true);
    this.util.setDateHandler('1Y');
    this.newsList();
    this.currencyListHandler();
    this.commodityListHandler(this.selectedCurrency);

    const url = this.router.serializeUrl(
      this.router.createUrlTree(['financialmarketdata/commodity'], {
        queryParams: {
          symbol: this.selectedCommodity,
          currency: '',
          tabSection: 'Dashboard',
        },
      })
    );

    window.open(url, '_self');
  }

  refreshHandler(sybmbol?: any) {
    this.count_res = 0;
    this.total_count_res = 4;
    this.util.loaderService.display(true);
    this.selectedCommodity = sybmbol ? sybmbol : 'CL1:COM';
    // this.selectedCurrency = '';
    this.util.setDateHandler('1Y');
    this.newsList();
    this.currencyListHandler();
    this.commodityListHandler(this.selectedCurrency);
  }

  refreshHandler1(sybmbol?: any) {
    this.count_res = 0;
    this.total_count_res = 4;
    this.util.loaderService.display(true);
    this.selectedCommodity = sybmbol ? sybmbol :'';
    this.selectedCurrency = '';
    this.util.setDateHandler('1Y');
    this.newsList();
    this.currencyListHandler();
    this.commodityListHandler(this.selectedCurrency);
  }

  onCommodityChanged(data: any) {
    if (this.price_list && this.selectedCommodity !== data) {
      this.selectedCommodity = data;
      // if (this.root !== null) this.root.dispose();
      this.count_res = 0;
      this.total_count_res = 1;
      this.util.loaderService.display(true);
      this.priceHistoryChart(data);

      const url = this.router.serializeUrl(
        this.router.createUrlTree(['financialmarketdata/commodity'], {
          queryParams: {
            symbol: this.selectedCommodity,
            currency: this.selectedCurrency,
            tabSection: 'Dashboard',
          },
        })
      );

      window.open(url, '_self');
    }
    this.commodityList.filter((el: any) => {
      if (el.symbol == this.selectedCommodity) {
        this.selectedCommodityData = el;
      }
    });
  }

  onCurrencyChanged(data: any) {
    if (this.currencyData && this.selectedCurrency !== data) {
      this.selectedCurrency = data;
      this.count_res = 0;
      this.total_count_res = 1;
      this.util.loaderService.display(true);
      this.commodityListHandler(data);

      const url = this.router.serializeUrl(
        this.router.createUrlTree(['financialmarketdata/commodity'], {
          queryParams: {
            symbol: this.selectedCommodity,
            currency: this.selectedCurrency,
            tabSection: 'Dashboard',
          },
        })
      );

      window.open(url, '_self');
    }
  }

  newsList() {
    this.financialMarketData.getNews().subscribe(
      (res) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);
        this.news_list = res;
      },
      (err) => {
        console.log('error', err.message);
      }
    );
  }

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
          this.currencyData = formattedData;
        });
      },
      (err) => {
        console.log('error', err.message);
      }
    );
  }

  commodityListHandler(data: any) {
    this.financialMarketData.getAllCommodity(data).subscribe(
      (res) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);
        let formattedData: any = [];
        this.commodityList = [];
        this.energy = [];
        this.agricultural = [];
        this.livestock = [];
        this.base_metals = [];
        this.precious_metals = [];
        this.industrial = [];
        this.indices = [];
        this.commodityList = res;
        res.forEach((element: any) => {
          this.filterCommodityHandler(element, element.telMarketGroup);
          formattedData.push({
            id: element.symbol,
            text: element.name,
          });
        });
        this.selectCommodityData = formattedData;
        res.filter((el: any) => {
          if (el.symbol == this.selectedCommodity) {
            this.selectedCommodityData = el;
          }
        });
        // if (this.price_list) if (this.root !== null) this.root.dispose();
        this.priceHistoryChart(this.selectedCommodity);
      },
      (err) => {
        console.log('error', err.message);
      }
    );
  }

  tempType: any = '1Y';
  dateChange(type: any) {
    if (type != this.tempType) {
      this.tempType = type;
      this.util.setDateHandler(type);
      // if (this.root !== null) this.root.dispose();
      this.count_res = 0;
      this.total_count_res = 1;
      this.util.loaderService.display(true);
      this.priceHistoryChart(this.selectedCommodity);
    }
  }

  priceHistoryChart(data: any) {
    this.financialMarketData
      .getPriceHistory(
        data,
        this.selectedCurrency ? this.selectedCurrency : '',
        this.datepipe.transform(
          this.util.startDate ? this.util.startDate : '',
          'yyyy-MM-dd'
        ),
        this.datepipe.transform(this.util.endDate, 'yyyy-MM-dd')
      )
      .subscribe(
        (res) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);
          this.price_list = res.slice(1);
          let lastDate = new Date(res[res.length - 1].period);
          this.util.endDate = new Date(
            lastDate.getFullYear(),
            lastDate.getMonth(),
            lastDate.getDate() + 1
          );
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

  filterCommodityHandler(data: object, key: string) {
    switch (key) {
      case 'Energy':
        this.energy.push(data);
        break;
      case 'Agricultural':
        this.agricultural.push(data);
        break;
      case 'Livestock':
        this.livestock.push(data);
        break;
      case 'Metals':
        this.base_metals.push(data);
        break;
      case 'Precious Metals':
        this.precious_metals.push(data);
        break;
      case 'Industrial':
        this.industrial.push(data);
        break;
      case 'Index':
        this.indices.push(data);
        break;
      default:
    }
  }

  dialogPopup(news_detail: any) {
    this.auth.closeInsidePopup = true;
    this.single_news_detail = news_detail;
  }

  commodityChart() {
    am4core.options.commercialLicense = true;
    let chart: any = am4core.create('chartdiv', am4charts.XYChart);
    // $(document).ready(function () {
    //   $('g[aria-labelledby]').hide();
    // });
    let data: any = [];
    let dashDot: any;
    this.MergeChartDate.map((ele: any, i: any) => {
      dashDot = ele.dashLength;
      data.push({
        date: ele.period,
        value: ele.close,
        dataType: ele.dataType,
        dailyChange: ele.dailyChange,
      });
    });

    chart.tapToActivate = true;

    chart.padding(16, 35, 0, -5);
    chart.maskBullets = false;
    chart.preloader.backgroundSlice.fill = am4core.color('#ffc000');
    chart.preloader.background.fill = am4core.color('#00071e');
    chart.preloader.fill = am4core.color('#ffc000');
    // Add data
    chart.data = data;
    chart.dateFormatter.dateFormat = 'dd-MMM-yyyy';
    // Create axes
    let dateAxis: any = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.dateFormats.setKey('day', 'dd-MM-yy');
    dateAxis.dateFormats.setKey('month', 'MMM yyyy');
    dateAxis.dateFormats.setKey('week', 'dd-MM-yy');
    dateAxis.periodChangeDateFormats.setKey('day', 'dd-MM-yy');
    dateAxis.periodChangeDateFormats.setKey('month', 'MMM yyyy');
    dateAxis.periodChangeDateFormats.setKey('week', 'dd-MM-yy');
    dateAxis.renderer.labels.template.fill = am4core.color('#ffc000');
    dateAxis.renderer.line.stroke = am4core.color('#ffc000');
    dateAxis.renderer.line.strokeWidth = 2;
    dateAxis.renderer.line.strokeOpacity = 1;

    let valueAxis: any = chart.yAxes.push(new am4charts.ValueAxis());
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

    valueAxis.ghostLabel.adapter.add('text', (text: any) => {
      return '';
    });
    /**
     * Adapter to format the tooptip values
     */

    valueAxis.renderer.labels.template.fill = am4core.color('#ffc000');
    valueAxis.renderer.line.stroke = am4core.color('#ffc000');
    valueAxis.renderer.line.strokeWidth = 2;
    valueAxis.renderer.line.strokeOpacity = 1;
    dateAxis.renderer.minGridDistance = 70;

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

    valueAxis.renderer.fontSize = 12;
    dateAxis.renderer.fontSize = 12;
    valueAxis.renderer.minGridDistance = 30;
    valueAxis.renderer.minWidth = 5;

    const valueAxisTooltip = valueAxis.tooltip;
    valueAxisTooltip.fontSize = 10;
    valueAxisTooltip.paddingLeft = 0;

    const dateAxisTooltip = dateAxis.tooltip;
    dateAxisTooltip.fontSize = 10;
    dateAxisTooltip.paddingLeft = 0;
    // Create series
    let series: any = chart.series.push(new am4charts.LineSeries());
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
    let self = this;
    series.adapter.add('tooltipHTML', function (html: any, target: any) {
      let data;
      let perChange = 0;
      if (target.tooltipDataItem.dataContext) {
        data = target.tooltipDataItem.dataContext.value;
        let formattedPrice = self.util.standardFormat(data, 2, '');
        perChange = target.tooltipDataItem.dataContext?.dailyChange?.toFixed(2);
        let percentage_dailyChange: any = perChange ? perChange : 0;
        //let dataVal = (data<0)?(-data):data;

        let customHtml = '<p style="text-align: center' + data + '</p>';

        if (target.tooltipDataItem.dataContext.dataType !== undefined) {
          customHtml =
            "<table><tr><th align='left'>Price</th><td align='right'>" +
            formattedPrice +
            '</td></tr><tr>' +
            "<th align='left' style='padding-right:5px'>% Change</th><td align='right' >" +
            percentage_dailyChange +
            '</td>' +
            '</tr></table>';
        } else {
          customHtml =
            "<table><tr><th align='left'>Price</th><td align='right'>" +
            formattedPrice +
            '</td></tr><tr>' +
            "<th align='left' style='padding-right:5px'>% Daily Change</th><td align='right' >" +
            percentage_dailyChange +
            '</td>' +
            '</tr></table>';
        }

        return customHtml;
      }
      return html;
    });
    //range of dash of dotted
    let range = dateAxis.createSeriesRange(series);
    let date = this.MergeChartDate.filter((ele: any) => ele.dashLength == 8);
    range.date = new Date(date[0].period);
    let i = date.length - 1;
    range.endDate = new Date(date[i]['period']);
    range.contents.strokeDasharray = '8';
    series.tooltip.background.fill = am4core.color('#000000');

    series.strokeWidth = 1.5;
    series.minBulletDistance = 10;
    //range of dash of dotted

    // make a cursor point
    chart.cursor = new am4charts.XYCursor();
    chart.cursor.lineY.disabled = true;
    chart.cursor.snapToSeries = series;

    chart.responsive.enabled = true;
    chart.responsive.useDefault = false;
  }

  listNext4Quarters(startDate: any, EndDate: any) {
    //Get the quarter of the current month
    let sQuarter = Math.floor((startDate.getMonth() + 3) / 3);
    let sYear = startDate.getFullYear();

    const quarterNames = ['03-31', '06-30', '09-30', '12-31'];
    const quarterList = [];

    for (let i = 0; i < 4; i++) {
      quarterList.push(sYear + '-' + quarterNames[sQuarter - 1]);

      sQuarter++;

      if (sQuarter >= 4) {
        sQuarter = 1;
        sYear++;
      }
    }
    return quarterList;
  }

  forcastCaluclate() {
    this.quarterList = this.listNext4Quarters(this.startDate, '');
    this.commodityList.forEach((element: any) => {
      this.forecastCommodityDataMap.set(element.symbol, [
        {
          close: element.forecastQ1,
          period: this.quarterList[0],
          dailyChange: element.forecastQ1PerChange,
          dataType: 'forecast',
          dashLength: 8,
        },
        {
          close: element.forecastQ2,
          period: this.quarterList[1],
          dailyChange: element.forecastQ2PerChange,
          dataType: 'forecast',
          dashLength: 8,
        },
        {
          close: element.forecastQ3,
          period: this.quarterList[2],
          dailyChange: element.forecastQ3PerChange,
          dataType: 'forecast',
          dashLength: 8,
        },
        {
          close: element.forecastQ4,
          period: this.quarterList[3],
          dailyChange: element.forecastQ4PerChange,
          dataType: 'forecast',
          dashLength: 8,
        },
      ]);
    });
    const forecastChartData = this.forecastCommodityDataMap.get(
      this.price_list[0].symbol
    );

    this.price_list[this.price_list.length - 1]['dashLength'] = 8;
    this.MergeChartDate = [...this.price_list, ...forecastChartData];
    this.commodityChart();
  }

  // ---------------------- For Phase 2
  //Data Strucure for Table
  headerData: any = [
    {
      width: 'auto',
      label: 'Description',
      field: 'name',
    },
    {
      width: 'auto',
      label: 'Market',
      field: 'cityIdAndRegionId',
    },
    {
      width: 'auto',
      label: 'Time',
      field: 'datetime',
    },
    {
      width: 'auto',
      label: 'Trade price',
      field: 'tradePrice',
    },
    {
      width: 'auto',
      label: '1 Day Change',
      field: 'oneDayChange',
    },
    {
      width: 'auto',
      label: '% Change',
      field: 'perChange',
    },
  ];

  commodityQueueheaderData: any = [
    {
      width: 'auto',
      label: 'Symbol',
      field: 'symbol',
    },
    {
      width: 'auto',
      label: 'Time',
      field: 'time',
    },
    {
      width: 'auto',
      label: 'Bid Price',
      field: 'bidPrice',
    },
    {
      width: 'auto',
      label: 'Ask price',
      field: 'askPrice',
    },
    {
      width: 'auto',
      label: 'Trade Price',
      field: 'tradePrice',
    },
  ];

  // Mainpage table datas
  tableDataEnergy: any = [];
  tableDataMetal: any = [];

  // After clicking the title
  detailTableData: any = [];
  detailData: any = [];

  //For dropdown
  selectCommodityContractData: any = [];
  selectedCommodityContractData: any = 'USD';

  metalDetailID: any = null;
  energyDetailID: any = null;
  energyListData: any = [];
  metalListData: any = [];
  typeOfRedirect: any;

  // getOtcEnergyData() {
  //   this.financialMarketData.getOTCEnergy().subscribe((res: any) => {
  //     res.forEach((element: any) => {
  //       element['cityId'] = element.cityId | element.regionId;
  //     });
  //     this.tableDataEnergy = res;
  //   });
  // }
  // getOtcMetalsData() {
  //   this.financialMarketData.getOTCMetals().subscribe((res: any) => {
  //     res.forEach((element: any) => {
  //       element['cityId'] = element.cityId | element.regionId;
  //     });
  //     // this.tableDataMetal = res;
  //   });
  // }

  expandDashboard() {
    let temp = { symbol: 'CL1:COM' };
    this.dashboardRedirect(temp);
  }

  dashboardRedirect(event: any) {
    let temp = { symbol: event.symbol };
    localStorage.setItem('commoditySymbol', JSON.stringify(temp));
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('tabSection', 'Dashboard');
    (window as any).location.search = urlParams;
  }

  dashboardRedirectInside(event: any) {
    this.tabName = 'Dashboard';
    this.refreshHandler(event.symbol);
    localStorage.setItem('commoditySymbol', JSON.stringify(event));
  }

  dashboardRedirectInside1(event: any) {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['financialmarketdata/commodity'], {
        queryParams: {
          symbol: event.symbol,
          currency: this.selectedCurrency,
          tabSection: 'Dashboard',
        },
      })
    );

    window.open(url, '_self');

    this.tabName = 'Dashboard';
    this.refreshHandler1(event.symbol);
    localStorage.setItem('commoditySymbol', JSON.stringify(event));
  }

  redirectionToDetails(event: any) {
    let temp = {
      id: event.id,
      symbolDescription: event.symbolDescription,
      OTCorEnergy: event.OTCorEnergy,
    };
    localStorage.setItem('commodityMEDetails', JSON.stringify(temp));
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('tabSection', 'leftDetails');
    (window as any).location.search = urlParams;
  }

  tempAllDetail: any;
  redirectionToDetailsInner(event: any) {
    if (this.metalDetailID != null) this.ws.unsubscribe(this.metalDetailID);
    if (this.energyDetailID != null) this.ws.unsubscribe(this.energyDetailID);
    if (this.redirectWSID != null) this.ws.unsubscribe(this.redirectWSID);
    if (this.energyORMetalGraphID != null)
      this.ws.unsubscribe(this.energyORMetalGraphID);

    if (this.energyORMetalTableID != null)
      this.ws.unsubscribe(this.energyORMetalTableID);

    this.tabName = 'leftDetails';
    this.detailTableData = [];
    // calling Metals Dropdown API
    this.financialMarketData.getOTCMetalDropdown().subscribe((res: any) => {
      this.metalListData = res;
      let formattedData: any = [];
      let tempMetals: any = [];
      let tempEnergy: any = [];
      res.forEach((element: any) => {
        formattedData.push({
          id: element.id,
          text: element.description,
          type: 'Metals',
        });
        tempMetals = formattedData;
      });
      // calling Energy Dropdown API
      this.financialMarketData.getOTCEnergyDropdown().subscribe((res: any) => {
        this.energyListData = res;
        let formattedData: any = [];
        res.forEach((element: any) => {
          formattedData.push({
            id: element.id,
            text: element.description,
            type: 'Energy',
          });
          tempEnergy = formattedData;
        });
        this.tempAllDetail = [...this.metalListData, ...this.energyListData];
        this.selectCommodityContractData = [...tempEnergy, ...tempMetals];
      });
    });
    if (event.OTCorEnergy == 'Metals') {
      const metalsDetailUrl = `/commodity/metalsid/${event.id}`;
      let appSendUrl = `/app/connect-metalsid/${event.id}`;
      let that = this;
      that.ws.subscribe(metalsDetailUrl, function (message: any) {
        that.detailData = JSON.parse(message.body).content[0];
        if (that.detailTableData.length)
          that.detailTableData[0] = {
            symbol: `${that.detailData.name} ( ${that.detailData.baseCurrency} ${that.detailData.unit} ${that.detailData.code} ) | ${that.detailData.cityId}`,
            time: that.detailData.datetime,
            bidPrice: that.detailData.bidPrice,
            askPrice: that.detailData.askPrice,
            tradePrice: that.detailData.tradePrice,
            tradeTick: that.detailData.tradeTick,
          };
        that.metalDetailID = message.headers.subscription;
      });
      that.ws.send(appSendUrl, {}, {});

      // calling Table of symbol API
      this.metalsDetailTableWebSocket(event.symbolDescription);
      // calling graph of symbol API
      this.oneWeekMetalGraph(event.symbolDescription);
    } else if (event.OTCorEnergy == 'Energy') {
      const energyDetailUrl = `/commodity/energy/${event.id}`;
      let appSendUrl = `/app/connect-energy/${event.id}`;
      let that = this;
      that.ws.subscribe(energyDetailUrl, function (message: any) {
        that.detailData = JSON.parse(message.body).content[0];
        if (that.detailTableData.length)
          that.detailTableData[0] = {
            symbol: `${that.detailData.name} ( ${that.detailData.baseCurrency} ${that.detailData.unit} ${that.detailData.code} ) | ${that.detailData.cityId}`,
            time: that.detailData.datetime,
            bidPrice: that.detailData.bidPrice,
            askPrice: that.detailData.askPrice,
            tradePrice: that.detailData.tradePrice,
            tradeTick: that.detailData.tradeTick,
          };
        that.energyDetailID = message.headers.subscription;
      });
      that.ws.send(appSendUrl, {}, {});

      // calling Table of symbol API
      this.energyDetailTableWebSocket(event.symbolDescription);
      // calling graph of symbol API
      this.oneWeekEnergyGraph(event.symbolDescription);
    }
  }

  redirectWSID: any;
  enrgyOrMetalChangeHandler(data: any) {
    if (this.selectedCommodityContractData !== data) {
      this.selectedCommodityContractData = data;
      if (data == 'USD') {
        return;
      }
      if (this.energyDetailID != null) this.ws.unsubscribe(this.energyDetailID);
      if (this.metalDetailID != null) this.ws.unsubscribe(this.metalDetailID);
      if (this.redirectWSID != null) this.ws.unsubscribe(this.redirectWSID);
      if (this.energyORMetalTableID != null)
        this.ws.unsubscribe(this.energyORMetalTableID);
      if (this.energyORMetalGraphID != null)
        this.ws.unsubscribe(this.energyORMetalGraphID);

      this.graphData = [];
      this.detailData = [];
      this.detailTableData = [];

      this.typeOfRedirect = this.selectCommodityContractData.filter(
        (el: any) => el.id == this.selectedCommodityContractData
      )[0].type;

      (document.getElementById('tradingview_chart') as any).innerHTML = '';

      if (this.typeOfRedirect == 'Metals') {
        let symbolDescription: any;
        this.metalListData.forEach((element: any) => {
          if (element.id == data) {
            symbolDescription = element.symbolDescription;
          }
        });

        let metalsDetailUrl = `/commodity/metalsid/${data}`;
        let appSendUrl = `/app/connect-metalsid/${data}`;
        let that = this;
        that.ws.subscribe(metalsDetailUrl, function (message: any) {
          that.detailData = JSON.parse(message.body).content[0];
          if (that.detailTableData.length)
            that.detailTableData[0] = {
              symbol: `${that.detailData.name} ( ${that.detailData.baseCurrency} ${that.detailData.unit} ${that.detailData.code} ) | ${that.detailData.cityId}`,
              time: that.detailData.datetime,
              bidPrice: that.detailData.bidPrice,
              askPrice: that.detailData.askPrice,
              tradePrice: that.detailData.tradePrice,
              tradeTick: that.detailData.tradeTick,
            };
          that.detailData['OTCorEnergy'] = 'Metals';
          let temp = {
            id: that.detailData.id,
            symbolDescription: that.detailData.symbolDescription,
            OTCorEnergy: that.detailData.OTCorEnergy,
          };
          localStorage.setItem('commodityMEDetails', JSON.stringify(temp));
          that.redirectWSID = message.headers.subscription;
        });
        that.ws.send(appSendUrl, {}, {});

        // calling Table of symbol API
        this.metalsDetailTableWebSocket(symbolDescription);

        // calling graph of symbol API
        this.financialMarketData
          .getOTCMetalMonthGraphData(symbolDescription)
          .subscribe((res: any) => {
            res.forEach((element: any) => {
              element.time = new Date(element.time).toLocaleDateString('fr-CA');
            });
            res = res.filter(
              (value: any, index: any, self: any) =>
                index === self.findIndex((t: any) => t.time === value.time)
            );
            this.graphData = res;
            this.renderGraph();
          });
      }
      // For Energy
      else if (this.typeOfRedirect == 'Energy') {
        let symbolDescription: any;
        this.energyListData.forEach((element: any) => {
          if (element.id == data) {
            symbolDescription = element.symbolDescription;
          }
        });

        let energyDetailUrl = `/commodity/energy/${data}`;
        let appSendUrl = `/app/connect-energy/${data}`;
        let that = this;
        that.ws.subscribe(energyDetailUrl, function (message: any) {
          that.detailData = JSON.parse(message.body).content[0];
          if (that.detailTableData.length)
            that.detailTableData[0] = {
              symbol: `${that.detailData.name} ( ${that.detailData.baseCurrency} ${that.detailData.unit} ${that.detailData.code} ) | ${that.detailData.cityId}`,
              time: that.detailData.datetime,
              bidPrice: that.detailData.bidPrice,
              askPrice: that.detailData.askPrice,
              tradePrice: that.detailData.tradePrice,
              tradeTick: that.detailData.tradeTick,
            };
          that.detailData['OTCorEnergy'] = 'Energy';
          let temp = {
            id: that.detailData.id,
            symbolDescription: that.detailData.symbolDescription,
            OTCorEnergy: that.detailData.OTCorEnergy,
          };
          localStorage.setItem('commodityMEDetails', JSON.stringify(temp));
          that.redirectWSID = message.headers.subscription;
        });
        that.ws.send(appSendUrl, {}, {});

        // calling Table of symbol API
        this.energyDetailTableWebSocket(symbolDescription);

        // calling graph of symbol API
        this.financialMarketData
          .getOTCEnergyMonthGraphData(symbolDescription)
          .subscribe((res: any) => {
            res.forEach((element: any) => {
              element.time = new Date(element.time).toLocaleDateString('fr-CA');
            });
            res = res.filter(
              (value: any, index: any, self: any) =>
                index === self.findIndex((t: any) => t.time === value.time)
            );
            this.graphData = res;
            this.renderGraph();
          });
      }
    }
  }

  metalsDetailTableWebSocket(sybmbol: any) {
    let that = this;
    that.ws.subscribe(
      `/commodity/metalsquete/${sybmbol}/0`,
      function (message: any) {
        that.metalsTableWebSocket(message);
      }
    );
    that.ws.send(`/app/connect-metalsotcquete/${sybmbol}/0`, {}, {});
  }

  energyDetailTableWebSocket(sybmbol: any) {
    let that = this;
    that.ws.subscribe(
      `/commodity/energyquete/${sybmbol}/0`,
      function (message: any) {
        that.energyTableWebSocket(message);
      }
    );
    that.ws.send(`/app/connect-energyotcquete/${sybmbol}/0`, {}, {});
  }

  metalsDetailGraphWebSocket(sybmbol: any) {
    let that = this;
    that.ws.subscribe(
      `/commodity/metalspgraph/${sybmbol}`,
      function (message: any) {
        that.metalsGraphWebSocket(message);
      }
    );
    that.ws.send(`/app/connect-metalsgraph/${sybmbol}`, {}, {});
  }

  energyDetailGraphWebSocket(sybmbol: any) {
    let that = this;
    that.ws.subscribe(
      `/commodity/energygraph/${sybmbol}`,
      function (message: any) {
        that.energyGraphWebSocket(message);
      }
    );
    that.ws.send(`/app/connect-energygraph/${sybmbol}`, {}, {});
  }

  energyORMetalTableID: any;
  energyORMetalGraphID: any;
  metalsTableWebSocket(message: any) {
    this.detailTableData = [];
    let temp: any;
    this.energyORMetalTableID = message.headers.subscription;
    temp = JSON.parse(message.body);
    if (this.detailData.name != undefined)
      this.detailTableData.unshift({
        symbol: `${this.detailData.name} ( ${this.detailData.baseCurrency} ${this.detailData.unit} ${this.detailData.code} ) | ${this.detailData.cityId}`,
        time: this.detailData.datetime,
        bidPrice: this.detailData.bidPrice,
        askPrice: this.detailData.askPrice,
        tradePrice: this.detailData.tradePrice,
        tradeTick: this.detailData.tradeTick,
      });
    temp.content.forEach((element: any) => {
      this.detailTableData.push({
        symbol: `${element.name} ( ${element.baseCurrency} ${element.unit} ${element.code} ) | ${element.cityId}`,
        time: element.datetime,
        bidPrice: element.bidPrice,
        askPrice: element.askPrice,
        tradePrice: element.tradePrice,
        tradeTick: element.tradeTick,
      });
    });
  }

  energyTableWebSocket(message: any) {
    this.detailTableData = [];
    let temp: any;
    this.energyORMetalTableID = message.headers.subscription;
    temp = JSON.parse(message.body);
    if (this.detailData.name != undefined)
      this.detailTableData.unshift({
        symbol: `${this.detailData.name} ( ${this.detailData.baseCurrency} ${this.detailData.unit} ${this.detailData.code} ) | ${this.detailData.cityId}`,
        time: this.detailData.datetime,
        bidPrice: this.detailData.bidPrice,
        askPrice: this.detailData.askPrice,
        tradePrice: this.detailData.tradePrice,
        tradeTick: this.detailData.tradeTick,
      });
    temp.content.forEach((element: any) => {
      this.detailTableData.push({
        symbol: `${element.name} ( ${element.baseCurrency} ${element.unit} ${element.code} ) | ${element.cityId}`,
        time: element.datetime,
        bidPrice: element.bidPrice,
        askPrice: element.askPrice,
        tradePrice: element.tradePrice,
        tradeTick: element.tradeTick,
      });
    });
  }

  energyGraphWebSocket(message: any) {
    this.detailTableData = [];
    let temp: any;
    this.energyORMetalGraphID = message.headers.subscription;
    temp = JSON.parse(message.body);
    this.graphData = [];
    temp.forEach((el: any) => {
      if (el.time != 'null' && el.value != 'null')
        this.graphData.push({
          time: new Date(el.time).getTime() / 1000,
          value: parseFloat(el.value),
        });
    });
    this.areaSeries.setData(this.graphData);
  }

  metalsGraphWebSocket(message: any) {
    let temp: any;
    this.energyORMetalGraphID = message.headers.subscription;
    temp = JSON.parse(message.body);
    this.graphData = [];
    temp.forEach((el: any) => {
      if (el.time != 'null' && el.value != 'null')
        this.graphData.push({
          time: new Date(el.time).getTime(),
          value: parseFloat(el.value),
        });
    });
    this.areaSeries.setData(this.graphData);
  }

  graphData: any = [];
  areaSeries: any;
  renderGraph() {
    let chart: any = am4core.create('tradingview_chart', am4charts.XYChart);

    let title = chart.titles.create();
    let temp = this.detailData?.currency
      ? `(${this.detailData?.currency})`
      : '';
    title.text = `Daily Price Movement ` + temp;
    title.fontWeight = '500';
    title.fontSize = 15;
    title.marginBottom = 20;
    title.fill = am4core.color('#ffc000');

    chart.padding(16, 35, 0, -5);
    chart.maskBullets = false;
    chart.preloader.backgroundSlice.fill = am4core.color('#ffc000');
    chart.preloader.background.fill = am4core.color('#00071e');
    chart.preloader.fill = am4core.color('#ffc000');
    // Add data
    chart.data = this.graphData.filter(
      (el: any) => el.time != new Date().toLocaleDateString('fr-CA')
    );
    chart.dateFormatter.dateFormat = 'dd-MMM-yyyy';
    // Create axes
    let dateAxis: any = chart.xAxes.push(new am4charts.DateAxis());

    if (this.selectedChartType == '1W') {
      dateAxis.dateFormats.setKey('day', 'dd-MM-yy');
      dateAxis.dateFormats.setKey('month', 'MMM yyyy');
      dateAxis.dateFormats.setKey('week', 'dd-MM-yy');
      dateAxis.periodChangeDateFormats.setKey('day', 'dd-MM-yy');
      dateAxis.periodChangeDateFormats.setKey('month', 'MMM yyyy');
      dateAxis.periodChangeDateFormats.setKey('week', 'dd-MM-yy');
    } else if (this.selectedChartType == '1M') {
      dateAxis.dateFormats.setKey('day', 'dd-MMM');
      dateAxis.dateFormats.setKey('month', 'dd-MMM');
      dateAxis.dateFormats.setKey('week', 'dd-MMM');
      dateAxis.periodChangeDateFormats.setKey('day', 'dd-MMM');
      dateAxis.periodChangeDateFormats.setKey('month', 'dd-MMM');
      dateAxis.periodChangeDateFormats.setKey('week', 'dd-MMM');
    }

    dateAxis.renderer.labels.template.fill = am4core.color('#ffc000');
    dateAxis.renderer.line.stroke = am4core.color('#ffc000');
    dateAxis.renderer.line.strokeWidth = 2;
    dateAxis.renderer.line.strokeOpacity = 1;

    let valueAxis: any = chart.yAxes.push(new am4charts.ValueAxis());
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

    /**
     * Adapter to format the tooptip values
     */

    valueAxis.renderer.labels.template.fill = am4core.color('#ffc000');
    valueAxis.renderer.line.stroke = am4core.color('#ffc000');
    valueAxis.renderer.line.strokeWidth = 2;
    valueAxis.renderer.line.strokeOpacity = 1;
    dateAxis.renderer.minGridDistance = 70;

    valueAxis.renderer.labels.template.adapter.add(
      'text',
      (label: any, target: any) => {
        if (target.dataItem) {
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

    valueAxis.renderer.fontSize = 12;
    dateAxis.renderer.fontSize = 12;
    valueAxis.renderer.minGridDistance = 30;
    valueAxis.renderer.minWidth = 5;

    let valueAxisTooltip = valueAxis.tooltip;
    valueAxisTooltip.fontSize = 10;
    valueAxisTooltip.paddingLeft = 0;

    const dateAxisTooltip = dateAxis.tooltip;
    dateAxisTooltip.fontSize = 10;
    dateAxisTooltip.paddingLeft = 0;
    // Create series
    let series: any = chart.series.push(new am4charts.LineSeries());
    series.dataFields.valueY = 'value';
    series.dataFields.dateX = 'time';
    series.tooltipHTML = '{valueY}';
    series.tooltip.background.cornerRadius = 3;
    series.tooltip.label.fontSize = 9;
    series.tooltip.label.padding(5, 5, 5, 5);
    series.tooltip.pointerOrientation = 'vertical';
    let self = this;
    series.adapter.add('tooltipHTML', function (html: any, target: any) {
      let data;
      if (target.tooltipDataItem.dataContext) {
        data = target.tooltipDataItem.dataContext.value;
        let formattedPrice = data;
        let customHtml = '<p style="text-align: center' + data + '</p>';
        customHtml = formattedPrice;

        return customHtml;
      }
      return html;
    });
    // Add cursor
    chart.cursor = new am4charts.XYCursor();
    chart.cursor.xAxis = dateAxis;
  }

  pagenumber: any = 0;
  onPageChange(event: any) {
    this.ws.unsubscribe(this.metalSubID);
   // let page: number = event - 1;
    this.pagenumber  = event - 1;
    const metalUrl = `/commodity/metals-energy/${this.pagenumber}`;
    const metalSendUrl = `/app/connect-metals/${this.pagenumber}`;
    let that = this;
    that.ws.subscribe(metalUrl, function (message: any) {
      that.showMetalData(message);
    });

    that.ws.send(metalSendUrl, {}, {});
    // this.socketConnection(this.pagenumber)
    // this.financialMarketData.getOTCMetals(page).subscribe((res: any) => {
    //   this.tableDataMetal = res;
    // });
  }

  commodityDataClick(data: any) {
    this.onCommodityChanged(data.symbol);
  }

  goBack() {
    window.location.search = '';
  }

  isPositive(num: any) {
    return num > 0;
  }

  switchKey: boolean = false;
  chartSwitch(type: any) {
    if (this.selectedChartType == type) return;
    // Proccessing
    (document.getElementById('tradingview_chart') as any).innerHTML = '';
    this.graphData.length = 0;
    this.switchKey = true;
    //---------------
    let event: any = JSON.parse(
      localStorage.getItem('commodityMEDetails') as any
    );
    this.selectedChartType = type;
    if (event.OTCorEnergy == 'Energy') {
      if (type == '1W') {
        this.oneWeekEnergyGraph(event.symbolDescription);
      } else if ('1M') {
        this.oneMonthEnergyGraph(event.symbolDescription);
      }
    }
    if (event.OTCorEnergy == 'Metals') {
      if (type == '1W') {
        this.oneWeekMetalGraph(event.symbolDescription);
      } else if ('1M') {
        this.oneMonthMetalGraph(event.symbolDescription);
      }
    }
  }

  oneWeekMetalGraph(symbolDescription: any) {
    this.financialMarketData
      .getOTCMetalMonthGraphData(symbolDescription)
      .subscribe((res: any) => {
        res.forEach((element: any) => {
          element.time = new Date(element.time).toLocaleDateString('fr-CA');
        });
        res = res.filter(
          (value: any, index: any, self: any) =>
            index === self.findIndex((t: any) => t.time === value.time)
        );
        this.graphData = res;
        this.renderGraph();
      });
  }

  oneMonthMetalGraph(symbolDescription: any) {
    this.financialMarketData
      .getOTCMetalMonthGraphData(symbolDescription)
      .subscribe((res: any) => {
        res.forEach((element: any) => {
          element.time = new Date(element.time).toLocaleDateString('fr-CA');
        });
        res = res.filter(
          (value: any, index: any, self: any) =>
            index === self.findIndex((t: any) => t.time === value.time)
        );
        this.graphData = res;
        this.renderGraph();
      });
  }

  oneWeekEnergyGraph(symbolDescription: any) {
    this.financialMarketData
      .getOTCEnergyMonthGraphData(symbolDescription)
      .subscribe((res: any) => {
        res.forEach((element: any) => {
          element.time = new Date(element.time).toLocaleDateString('fr-CA');
        });
        res = res.filter(
          (value: any, index: any, self: any) =>
            index === self.findIndex((t: any) => t.time === value.time)
        );
        this.graphData = res;
        this.renderGraph();
      });
  }

  oneMonthEnergyGraph(symbolDescription: any) {
    this.financialMarketData
      .getOTCEnergyMonthGraphData(symbolDescription)
      .subscribe((res: any) => {
        res.forEach((element: any) => {
          element.time = new Date(element.time).toLocaleDateString('fr-CA');
        });
        res = res.filter(
          (value: any, index: any, self: any) =>
            index === self.findIndex((t: any) => t.time === value.time)
        );
        this.graphData = res;
        this.renderGraph();
      });
  }
}

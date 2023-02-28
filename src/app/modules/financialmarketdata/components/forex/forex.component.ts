import { Component, HostListener, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { UtilService } from 'src/app/services/util.service';
import { Location } from '@angular/common';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { FinancialMarketDataService } from 'src/app/services/financialmarketdata.service';
import { createChart } from 'lightweight-charts';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
declare const TradingView: any;
@Component({
  selector: 'app-forex',
  templateUrl: './forex.component.html',
  styleUrls: ['./forex.component.scss'],
})
export class ForexComponent implements OnInit {
  col: any = 'White';
  clicked: any;
  buttonTwo: any = 1;
  pageActive: any = 10;
  selectedCountry: any = 'fxMajor';
  forexCompanyData: any;
  fxPairsData: any;
  selectedFxPairs: any = '';
  forexBaseURL: any = 'http://52.221.8.139';
  fxViewChartData: any = [];
  fxForwardPremiumChart: any = [];

  activefxMatrixDropDown: boolean = false;

  buttonCategoryTwo = [
    {
      id: 1,
      title: 'BASE CURRENCY',
    },
    {
      id: 2,
      title: 'FX PAIRS',
    },
  ];

  constructor(
    public auth: AuthService,
    public util: UtilService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    private _location: Location,
    public financialMarketData: FinancialMarketDataService
  ) {}

  countryLists: any = [];
  otcContractData: any;
  selectedOTC: any;
  forexPriceQuoteGraph: any = [];
  fxPairsTableLoading: any = true;
  fxMatrixTableLoding: any = true;

  @HostListener('document:click', ['$event']) onDocumentClick(event: any) {
    this.childNodeToggle(2, event);
    event.stopPropagation();
  }

  tablPaginationArray = [
    {
      id: 10,
      text: '10',
    },
    {
      id: 25,
      text: '25',
    },
    {
      id: 50,
      text: '50',
    },
    {
      id: 100,
      text: '100',
    },
  ];

  table_data_two: any = {
    title: [],
    value: [],
  };
  forwardPriceQuoteData: any = {
    title: [
      {
        field: 'symbol',
        label: 'Symbol',
      },
      {
        field: 'time',
        label: 'Time',
      },
      {
        field: 'bidPrice',
        label: 'Bid Price',
        align: 'center',
        colorChange: true,
      },
      {
        field: 'askPrice',
        label: 'Ask Price',
        align: 'center',
        colorChange: true,
      },
      {
        field: 'tradePrice',
        label: 'Trade Price',
        align: 'center',
        tradeTick: true,
      },
    ],
    value: [],
  };
  table_data: any = {
    title: [
      {
        field: 'description',
        label: 'Description',
        hover: true,
        title: true,
      },
      {
        align: 'center',
        field: 'category',
        label: 'Category',
      },
      {
        align: 'center',
        field: 'market',
        label: 'Market',
      },
      {
        align: 'center',
        field: 'time',
        label: 'Time',
      },
      {
        align: 'center',
        field: 'tradePrice',
        label: 'Trade Price',
        tradeTick: true,
      },
      {
        align: 'center',
        field: 'oneDayChange',
        label: '1 Day Change',
        colorChange: true,
      },
      {
        align: 'center',
        field: 'change',
        label: '% Change',
        colorChange: true,
      },
    ],
    value: [],
  };
  userLocation: any = '';
  ngOnInit(): void {
    $(document).on('select2:open', () => {
      const inputs: any = document.querySelectorAll(
        '.select2-search__field[aria-controls]'
      );
      const mostRecentlyOpenedInput = inputs[inputs.length - 1];
      mostRecentlyOpenedInput.focus();
    });

    this.financialMarketData.getCountryIp().subscribe((res: any) => {
      this.userLocation = res.currency;
      this.selectedCurrency = res.currency;
      if (
        Object.keys((this.activatedRoute.queryParams as any)?.value).length != 0
      ) {
        this.activatedRoute.queryParams.subscribe((params: any) => {
          if (params.tab_name === 'forex-details') {
            this.clicked = true;
            this.selectedOTCCurrency = params.currency;
            this.socketConnection();
          }
        });
      } else {
        this.clicked = false;
        // this.getForexTableData();
        this.getForexOTCFXContract();
        this.getBaseCurrencyData();
        // this.getForwardPriceQuote();
        this.getForexfxPairs();
        // this.getForexTableDataBasedOnSelection();
        // this.getCategoryDescriptionMapping();
        // this.getForexMajorData();
        this.getMatrixList();
        this.socketConnection();
        this.getFxViewData(this.userLocation);
        // this.getLiveGraphData('');
        // this.renderGraph(this.chartData);
      }
    });
  }
  ws: any;
  socketConnection(pageNo?: any) {
    let socket = new SockJS(`${this.forexBaseURL}/forex-socket`);
    this.ws = Stomp.over(socket);
    // this.ws.debug = null;
    let that = this;
    this.ws.connect(
      {},
      function (frame: any) {
        that.ws.subscribe('/errors', function (message: any) {
          console.log('Error ' + message.body);
        });
        // latestnews;
        that.ws.subscribe(
          `/forex/searchByBaseCurrency/${that.userLocation}/0/10`,
          function (message: any) {
            // that.showGreeting(message.body);
            that.getForexSocketData(message);
            that.fxPairsTableLoading = false;
          }
        );
        that.ws.send(
          `/app/connect-forex/searchByBaseCurrency/${that.userLocation}/0/10`,
          {},
          {}
        );

        that.ws.subscribe(
          '/forex/customForexMatrix/fxMajor',
          function (message: any) {
            // that.showGreeting(message.body);
            that.fxMatrixTableLoding = false;
            that.generateMatrixData(message);
          }
        );
        that.ws.send('/app/connect-forex/customForexMatrix/fxMajor', {}, {});

        const generalURL = `/forex/fxView/${that.userLocation}`;
        var generalSendURl = `/app/connect-forex/fxView/${that.userLocation}`;
        // console.log(generalURL, generalSendURl);
        that.ws.subscribe(generalURL, function (message: any) {
          // that.getGraphSocketData(message);
        });

        that.ws.send(generalSendURl, {}, {});

        if (
          Object.keys((that.activatedRoute.queryParams as any)?.value).length !=
          0
        ) {
          that.activatedRoute.queryParams.subscribe((params: any) => {
            if (params.tab_name === 'forex-details') {
              that.getForexforexData(params.currency);
              that.getForexOTCFXContract();
              that.getForexForwardPriceQuoteGraph(params.currency);
              that.onGraphDataClicked(params.currency);
              that.getIceDescriptionGraph(params.currency);
            }
          });
        }
      },
      function (error: any) {
        console.log('STOMP error ' + error);
      }
    );
  }

  searchMatrixDropdown(e: any) {
    if (e.target.value) {
      this.countryLists = this.dataRegion.filter((item: any) =>
        item.text.toLowerCase().includes(e.target.value.toLowerCase())
      );
    }
  }

  onClickCustomForexMatrix(e: any) {
    if (this.forexMatrixId != null) this.ws.unsubscribe(this.forexMatrixId);
    this.fxMatrixTableLoding = true;
    const generalURL = `/forex/customForexMatrix/fxMatrix/${e}`;
    var generalSendURl = `/app/connect-forex/customForexMatrix/fxMatrix/${e}`;
    let that = this;
    // console.log(generalURL, generalSendURl);
    that.ws.subscribe(generalURL, function (message: any) {
      that.fxMatrixTableLoding = false;
      that.generateMatrixData(message);
    });

    that.ws.send(generalSendURl, {}, {});
  }

  graphId: any;
  forexTableData: any = [];
  getForexSocketData(message: any) {
    const DataRes = JSON.parse(message?.body);
    const forexHeaderId = message?.headers?.subscription;
    // this.generalNewsId = generalNewsID;
    this.forexId = forexHeaderId;
    this.getForexTableData(DataRes.body.content);
    this.tableDataLength = DataRes.body.totalElements;
  }

  getFxViewData(e: any) {
    this.financialMarketData.getForexfxView(e).subscribe((res) => {
      this.fxViewChartData = res;
      this.renderGraph(res, 'chartdivFxView');
    });
  }

  // getGraphSocketData(message: any) {
  //   const DataRes = JSON.parse(message?.body);
  //   const forexHeaderId = message?.headers?.subscription;
  //   // this.generalNewsId = generalNewsID;
  //   this.graphId = forexHeaderId;
  //   this.renderGraph(DataRes.body);
  //   // this.tableDataLength = DataRes.ResponseEntity.body.totalItems;
  // }

  onSelectedCurrencySave(e: any) {
    this.selectedCountry = e.name;
    this.customMatrixName = e.name;
    this.postForexcustomForexMatrix(e);

    setTimeout(() => {
      this.getMatrixList();
    }, 1000);
  }

  onEditSelectedCurrencySave(e: any) {
    this.selectedCountry = e.name;
    this.customMatrixName = e.name;
    this.putCustomForexMatrix(e);

    setTimeout(() => {
      this.getMatrixList();
    }, 1000);
  }

  //new 10 api integration
  getForextradeQuoteGraph() {
    this.financialMarketData.getForextradeQuoteGraph().subscribe(
      (res) => {},
      (err) => {
        console.error(err);
      }
    );
  }
  getForexForwardPriceQuoteGraph(params: any) {
    this.financialMarketData
      .getForexForwardPriceQuoteGraph(params)
      .subscribe((res: any) => {
        this.forexPriceQuoteGraph = [];
        res?.forEach((ele: any) => {
          this.forexPriceQuoteGraph.push({
            date: ele.datetime,
            value: ele.forwardPremium,
          });
        });
        setTimeout(() => {
          this.lineGraph();
          this.lineGraphFP();
        }, 2000);
      });
  }

  getIceDescriptionGraph(params: any) {
    this.financialMarketData
      .getIceDescriptionGraph(params)
      .subscribe((res: any) => {
        this.fxForwardPremiumChart = res;
        // this.renderGraph(res, 'chartdivIceDesc');
        this.lineGraph();
      });
  }

  getForexMajorData() {
    if (this.forexMatrixId != null) this.ws.unsubscribe(this.forexMatrixId);
    const generalURL = `/forex/customForexMatrix/fxMajor`;
    var generalSendURl = `/app/connect-forex/customForexMatrix/fxMajor`;
    let that = this;
    // console.log(generalURL, generalSendURl);
    that.ws.subscribe(generalURL, function (message: any) {
      that.generateMatrixData(message);
    });

    that.ws.send(generalSendURl, {}, {});
  }

  editMatrixDataId: any;
  getEditCustomMatrixData(params: any) {
    this.financialMarketData.getEditCustomMatrixData(params).subscribe(
      (res: any) => {
        this.editMatrixDataId = res;
      },
      (err) => {
        console.error(err);
      }
    );
  }

  forexMatrixId: any;
  generateMatrixData(res: any) {
    // console.log('metrix re******', res);
    const DataRes = JSON.parse(res?.body);
    // console.log('DataRes', DataRes);
    const forexHeaderId = res?.headers?.subscription;
    // this.generalNewsId = generalNewsID;
    this.forexMatrixId = forexHeaderId;
    var baseCurrency = DataRes.body.baseCurrencies;
    var valueCurrency = DataRes.body.valueCurrencies;
    var forexData = DataRes.body.forexMatrixDTOS;
    // console.log('forexData', forexData);
    this.table_data_two.value = [];
    this.table_data_two.title = [];
    this.table_data_two.title.push({
      field: 'title',
      label: '',
    });
    baseCurrency?.forEach((base: any) => {
      this.table_data_two.title.push({
        field: `${base}`,
        label: `${base}`,
        tradeTickMultiple: true,
      });
    });

    if (this.table_data_two.title && this.table_data_two.title.length > 0) {
      let checkEmpty = 8 - this.table_data_two.title.length;
      if (checkEmpty > 0) {
        for (let i = 0; i < checkEmpty; i++) {
          this.table_data_two.title.push({ label: '' });
        }
      }
    }

    valueCurrency.forEach((valCurncy: any) => {
      var obj: any = {};
      (obj['title'] = `${valCurncy}`),
        forexData?.forEach((Data: any) => {
          Data?.forEach((fxData: any) => {
            if (valCurncy == fxData.valueCurrency) {
              if (valCurncy == fxData.baseCurrency) {
                obj[fxData.baseCurrency] = '';
              } else {
                obj[fxData.baseCurrency] = `${fxData.tradePrice}`;
                obj[fxData.baseCurrency + 'ticker'] = fxData.tradeTick;
              }
            }
          });
        });
      this.table_data_two.value.push(obj);
    });

    if (this.table_data_two.value && this.table_data_two.value.length > 0) {
      let checkEmpty = 7 - this.table_data_two.value.length;
      if (checkEmpty > 0) {
        for (let i = 0; i < checkEmpty; i++) {
          this.table_data_two.value.push({});
        }
      }
    }
  }

  onCurrencyChanged(id: any, e: any) {
    if (id === 'base') {
      if (this.baseCurrencyData && this.selectedCurrency !== e) {
        this.selectedCurrency = e;

        this.getForexTableDataBasedOnSelection(e);
        this.getFxViewData(e);
        if (this.graphId != null) this.ws.unsubscribe(this.graphId);
        let that = this;
        const generalURL = `/forex/fxView/${e}`;
        var generalSendURl = `/app/connect-forex/fxView/${e}`;
        // console.log(generalURL, generalSendURl);
        that.ws.subscribe(generalURL, function (message: any) {
          // that.getGraphSocketData(message);
          // [TODO:]
        });
      }
    } else if (id === 'pairs') {
      if (this.fxPairsData && this.selectedCurrency !== e) {
        this.selectedCurrency = e;
        this.getFxViewData(e.split('/')[0]);
        this.getForexPairsTableDataBasedOnSelection(e);
      }
    }
  }

  //on otc currency changed
  descrptionPageParamas: any;
  selectedOTCCurrency: any;
  onOTCCurrencyChanged(params: any, ishome: any) {
    if (params && this.selectedOTCCurrency != params) {
      // this.selectedOTCCurrency = params;
      // this.selectedDescriptionPage = 0;
      // this.getForexforexData(params);
      // this.onGraphDataClicked(params);
      // this.getForexForwardPriceQuoteGraph(params);
      // this.getIceDescriptionGraph(params);
      let currency = params;
      const url = this.router.serializeUrl(
        this.router.createUrlTree(['financialmarketdata/forex'], {
          queryParams: {
            currency: currency,
            tab_name: 'forex-details',
          },
        })
      );
      if (ishome) {
        window.open(url, '_blank');
      } else {
        window.open(url, '_self');
      }
    }
  }

  forwardQuoteBidAndAskPrice: any;
  forwardPriceLoading: any = true;
  getForexforexData(params: any) {
    this.descrptionPageParamas = params;
    if (this.forexId != null) this.ws.unsubscribe(this.forexId);
    if (this.forwardPriceId != null) this.ws.unsubscribe(this.forwardPriceId);
    // this.selectedPage = page;
    // let tempPage: number = page - 1;
    const generalURL = `/forex/iceDescription/${params}/0`;
    var generalSendURl = `/app/connect-forex/iceDescription/${params}/0`;
    let that = this;
    // console.log(generalURL, generalSendURl);
    that.ws.subscribe(generalURL, function (message: any) {
      that.forwardPriceQuotesData(message);
      that.forwardPriceLoading = false;
    });

    that.ws.send(generalSendURl, {}, {});
  }

  forwardPriceId: any;
  forwardPriceQuotesData(message: any) {
    // console.log('metrix re******', message);
    const forwardDataRes = JSON.parse(message?.body);
    // console.log('forwardDataRes', forwardDataRes);
    const forexHeaderId = message?.headers?.subscription;
    // this.generalNewsId = generalNewsID;
    this.forwardPriceId = forexHeaderId;
    this.forexCompanyData = forwardDataRes.body;
    this.forwardPriceQuoteData.value = [];
    this.forwardQuoteBidAndAskPrice = forwardDataRes.body.tradeQuoteDTO;
    forwardDataRes.body.forwardPriceQuoteDTOList.content?.forEach(
      (ele: any) => {
        this.forwardPriceQuoteData.value.push({
          symbol: ele.symbol,
          time: ele.tradeDatetime,
          bidPrice: ele.bidPrice,
          askPrice: ele.askPrice,
          tradePrice: ele.tradePrice,
        });
      }
    );
  }

  getForexOTCFXContract() {
    this.financialMarketData.getForexOTCFXContract().subscribe(
      (res: any) => {
        var formattedOtcData: any = [];
        res?.forEach((element: any, i: any) => {
          formattedOtcData.push({
            id: `${element.baseCurrency}/${element.valueCurrency}`,
            text: `${element.baseCurrency}${element.valueCurrency} (${element.symbol}) | ${element.description}`,
          });
        });
        this.otcContractData = formattedOtcData;
      },
      (err) => {
        console.error(err);
      }
    );
  }

  getForexfxPairs() {
    this.financialMarketData.getForexfxPairs().subscribe(
      (res: any) => {
        let formattedData: any = [];
        res?.forEach((element: any) => {
          formattedData.push({
            id: `${element.baseCurrency}/${element.valueCurrency}`,
            text: `${element.baseCurrency}/${element.valueCurrency}`,
          });
        });
        this.fxPairsData = formattedData;

        if (this.userLocation === 'USD') {
          this.selectedFxPairs = `${this.userLocation}/EUR`;
        } else if (
          !this.fxPairsData.find(
            (el: any) => el.id.split('/')[0] === this.userLocation
          )
        ) {
          this.selectedFxPairs = `USD/EUR`;
        } else {
          this.selectedFxPairs = `${this.userLocation}/USD`;
        }
      },
      (err) => {
        console.error(err);
      }
    );
  }
  getForexcustomForexMatrix() {
    this.financialMarketData.getForexcustomForexMatrix().subscribe(
      (res) => {},
      (err) => {
        console.error(err);
      }
    );
  }
  postForexcustomForexMatrix(obj: any) {
    this.financialMarketData.postForexcustomForexMatrix(obj).subscribe(
      (res) => {
        this.onClickCustomForexMatrix(this.selectedCountry);
      },
      (err) => {
        console.error(err);
      }
    );
  }
  putCustomForexMatrix(obj: any) {
    this.financialMarketData.putCustomForexMatrix(obj).subscribe(
      (res) => {
        this.onClickCustomForexMatrix(this.selectedCountry);
      },
      (err) => {
        console.error(err);
      }
    );
  }
  getForexfxView(params: any) {
    this.financialMarketData.getForexfxView(params).subscribe(
      (res) => {},
      (err) => {
        console.error(err);
      }
    );
  }

  //end new api
  viewStartPage: any = 1;
  viewEndPage: any = 10;
  onPaginationClicked(e: any) {
    this.pageActive = e;
    this.dataPerPage = this.pageActive;

    this.viewEndPage = this.pageActive * this.selectedPage;
    this.viewStartPage = this.pageActive - this.viewEndPage + 1;

    this.onPageChage(1, e);
    // this.getForexTableData();
  }

  backClicked() {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['financialmarketdata/forex'], {
        queryParams: {},
      })
    );

    window.open(url, '_self');

    // this.clicked = false;
    // this._location.back();
  }

  onDataClicked(e: any) {
    let currency = `${e.baseCurrency}${
      e.valueCurrency ? `/${e.valueCurrency}` : ''
    }`;

    const url = this.router.serializeUrl(
      this.router.createUrlTree(['financialmarketdata/forex'], {
        queryParams: {
          currency: currency,
          tab_name: 'forex-details',
        },
      })
    );

    window.open(url, '_blank');

    // console.log('graphcurrency', currency);
    // this.clicked = !this.clicked;
    // this.getForexforexData(currency);
    // this.getForexOTCFXContract();
    // this.getForexForwardPriceQuoteGraph(currency);
    // this.onGraphDataClicked(currency);
  }
  customMatrixName: any = 'Global Majors';
  onCountryChanged(e: any, name?: any) {
    // if (this.selectedCountry !== e) {
    this.selectedCountry = e;
    if (e == 'fxMajor') {
      this.customMatrixName = name;
      this.getForexMajorData();
    } else if (e == 'custom') {
      this.auth.expandopendfxmatrix = true;
    } else {
      this.customMatrixName = name;
      this.onClickCustomForexMatrix(e);
    }
    // }
  }

  editCustomMatrixName: any;
  handleCustomEditCLick(data: any, e: any) {
    e.stopPropagation();
    this.auth.opendEditCustomMatrixmodal = true;
    this.editCustomMatrixName = data.id;
    this.getEditCustomMatrixData(data.id);
  }

  getMatixData(e: any) {
    // this.financialMarketData.getForexcutomMatrix(e).subscribe((res: any) => {
    //   this.generateMatrixData(res);
    // });
  }

  getAnnualQuarterly(e: any) {
    this.buttonTwo = e;
    if (e === 2) {
      this.getFxViewData(this.selectedFxPairs.split('/')[0]);
      this.getForexPairsTableDataBasedOnSelection(this.selectedFxPairs);
    }
  }
  // For right end dropdown value check
  isInstruments: any = false;

  toggleInstrumentView() {
    this.isInstruments = true;
  }

  areaSeries: any;
  extraSeriesOne: any;
  extraSeriesTwo: any;

  renderGraph(res: any, chartName: any) {
    // (document.getElementById('tradingview_bac65') as any).innerHTML = '';
    // For Chart
    // setTimeout(() => {
    let data: any = [];
    let dataOne: any = [];
    let dataTwo: any = [];
    // [TODO:]
    // if (res && res[0]?.timeTradeGraphDTOS) {
    //   res[0]?.timeTradeGraphDTOS?.forEach((el: any) => {
    //     if (el.datetime != 'null' && el.tradePrice != 'null')
    //       data.push({
    //         time: new Date(el.datetime).getDate(),
    //         value: parseFloat(el.tradePrice),
    //       });
    //   });
    //   res[1]?.timeTradeGraphDTOS?.forEach((el: any) => {
    //     if (el.datetime != 'null' && el.tradePrice != 'null')
    //       dataOne.push({
    //         time: new Date(el.datetime).getDate(),
    //         value: parseFloat(el.tradePrice),
    //       });
    //   });
    //   res[2]?.timeTradeGraphDTOS?.forEach((el: any) => {
    //     if (el.datetime != 'null' && el.tradePrice != 'null')
    //       dataTwo.push({
    //         time: new Date(el.datetime).getDate(),
    //         value: parseFloat(el.tradePrice),
    //       });
    //   });
    // } else {
    //   res?.forEach((el: any) => {
    //     if (el.datetime != 'null' && el.tradePrice != 'null')
    //       data.push({
    //         time: new Date(el.datetime).getDate(),
    //         value: parseFloat(el.tradePrice),
    //       });
    //   });
    // }
    // var chart = createChart(
    //   document.getElementById('tradingview_bac65') as any,
    //   {
    //     height: 250,
    //     width: 620,
    //     rightPriceScale: {
    //       visible: false,
    //     },
    //     grid: {
    //       horzLines: {
    //         visible: false,
    //       },
    //       vertLines: {
    //         visible: false,
    //       },
    //     },
    //     timeScale: {
    //       timeVisible: true,
    //       secondsVisible: true,
    //     },
    //     leftPriceScale: {
    //       visible: true,
    //     },
    //     layout: {
    //       background: {
    //         color: '#00000000',
    //       },
    //       textColor: '#fec134',
    //     },
    //   }
    // );
    // if (res && res[0]?.timeTradeGraphDTOS) {
    //   this.areaSeries = chart.addAreaSeries({
    //     topColor: 'rgba(251, 192, 45, 0.56)',
    //     bottomColor: 'rgba(251, 192, 45, 0.04)',
    //     lineColor: 'rgba(251, 192, 45, 1)',
    //     lineWidth: 2,
    //   });
    //   this.extraSeriesOne = chart.addAreaSeries({
    //     topColor: 'rgba(67, 83, 254, 0.7)',
    //     bottomColor: 'rgba(67, 83, 254, 0.3)',
    //     lineColor: 'rgba(67, 83, 254, 1)',
    //     lineWidth: 2,
    //   });
    //   this.extraSeriesTwo = chart.addAreaSeries({
    //     topColor: 'rgba(255, 192, 0, 0.7)',
    //     bottomColor: 'rgba(255, 192, 0, 0.3)',
    //     lineColor: 'rgba(255, 192, 0, 1)',
    //     lineWidth: 2,
    //   });

    //   this.areaSeries.setData(data);
    //   this.extraSeriesOne.setData(data);
    //   this.extraSeriesTwo.setData(data);
    // } else {
    //   this.extraSeriesOne = chart.addAreaSeries({
    //     topColor: 'rgba(67, 83, 254, 0.7)',
    //     bottomColor: 'rgba(67, 83, 254, 0.3)',
    //     lineColor: 'rgba(67, 83, 254, 1)',
    //     lineWidth: 2,
    //   });
    //   this.extraSeriesOne.setData(data);
    // }

    // }, 3000);
    am4core.useTheme(am4themes_animated);
    am4core.options.commercialLicense = true;
    // Create chart instance
    var chart = am4core.create(chartName, am4charts.XYChart);
    chart.dateFormatter.dateFormat = 'dd-MMM-yyyy';

    if (res && res[0]?.timeTradeGraphDTOS) {
      res[0]?.timeTradeGraphDTOS?.forEach((el: any, index: any) => {
        if (el.datetime != 'null' && el.tradePrice != 'null') var obj: any = {};

        (obj.date = el.datetime.split(' ')[0]),
          (obj.value = parseFloat(el.tradePrice));
        data[index] = obj;
      });
      res[1]?.timeTradeGraphDTOS?.forEach((el: any, index: any) => {
        if (el.datetime != 'null' && el.tradePrice != 'null')
          data[index].value2 = parseFloat(el.tradePrice);
      });
      res[2]?.timeTradeGraphDTOS?.forEach((el: any, index: any) => {
        if (el.datetime != 'null' && el.tradePrice != 'null')
          data[index].value3 = parseFloat(el.tradePrice);
      });
    } else {
      data = [];
      res?.forEach((el: any) => {
        if (el.datetime != 'null' && el.value != 'null')
          data.push({
            time: el.datetime.split(' ')[0],
            value: parseFloat(el.value),
          });
      });
    }

    var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.renderer.labels.template.fill = am4core.color('#ffc000');
    dateAxis.renderer.line.stroke = am4core.color('#ffc000');
    dateAxis.renderer.line.strokeWidth = 2;
    dateAxis.renderer.line.strokeOpacity = 1;

    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

    valueAxis.renderer.labels.template.fill = am4core.color('#ffc000');
    valueAxis.renderer.line.stroke = am4core.color('#ffc000');
    valueAxis.renderer.line.strokeWidth = 2;
    valueAxis.renderer.line.strokeOpacity = 1;
    dateAxis.renderer.minGridDistance = 70;

    valueAxis.renderer.fontSize = 12;
    dateAxis.renderer.fontSize = 12;
    valueAxis.renderer.minGridDistance = 30;
    valueAxis.renderer.minWidth = 5;

    chart.data = data;
    // Create series
    function createSeries(field: any, name: any) {
      var series = chart.series.push(new am4charts.LineSeries());
      series.dataFields.valueY = field;
      series.dataFields.dateX = 'date';
      series.name = name;
      series.tooltipText = '{valueY}';
      series.strokeWidth = 2;

      var bullet = series.bullets.push(new am4charts.CircleBullet());
      bullet.circle.stroke = am4core.color('#fff');
      bullet.circle.strokeWidth = 2;
      return series;
    }

    var series1 = createSeries('value', 'Series #1');
    var series2 = createSeries('value2', 'Series #2');
    var series3 = createSeries('value3', 'Series #3');
    var series4 = createSeries('void', 'Toggle All');

    series4.events.on('hidden', function () {
      series1.hide();
      series2.hide();
      series3.hide();
    });

    // series4.events.on('shown', function () {
    //   series1.show();
    //   series2.show();
    //   series3.show();
    // });

    // chart.legend = new am4charts.Legend();
    chart.cursor = new am4charts.XYCursor();
  }

  currencyData = [
    {
      key: 'none',
      label: '',
      selected: false,
    },
  ];
  lineGraph() {
    am4core.useTheme(am4themes_animated);
    am4core.options.commercialLicense = true;
    let chart = am4core.create('chartdivIceDesc', am4charts.XYChart);
    chart.data = this.fxForwardPremiumChart;
    // chart.dateFormatter.inputDateFormat = 'dd-MMM-yyyy';
    // Create axes
    let dateAxis: any = chart.xAxes.push(new am4charts.DateAxis());
    // dateAxis.dateFormats.setKey('day', 'MMM yyyy');
    // dateAxis.dateFormats.setKey('month', 'MMM yyyy');
    // dateAxis.dateFormats.setKey('week', 'dd-MM-yy');

    // dateAxis.periodChangeDateFormats.setKey('day', 'dd-MM-yy');
    // dateAxis.periodChangeDateFormats.setKey('month', 'MMM yyyy');
    // dateAxis.periodChangeDateFormats.setKey('week', 'dd-MM-yy');

    // dateAxis.tooltipDateFormat = 'MMM yyyy';
    dateAxis.renderer.minGridDistance = 90;

    dateAxis.dateFormats.setKey('day', 'dd-MM-yy');
    dateAxis.dateFormats.setKey('week', 'dd-MM-yy');
    dateAxis.dateFormats.setKey('month', 'MMM yyyy');
    dateAxis.dateFormats.setKey('year', 'yyyy');
    dateAxis.periodChangeDateFormats.setKey('day', 'dd-MM-yy');
    dateAxis.periodChangeDateFormats.setKey('week', 'dd-MM-yy');
    dateAxis.periodChangeDateFormats.setKey('month', 'MMM yyyy');
    dateAxis.periodChangeDateFormats.setKey('year', 'yyyy');

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

    valueAxis.renderer.labels.template.adapter.add(
      'text',
      (label: any, target: any) => {
        if (target.dataItem) {
          let data;
          if (Number(target.dataItem.forwardPremium) > 1000) {
            return this.util.standardFormat(
              Number(target.dataItem.forwardPremium),
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
    valueAxis.renderer.opposite = true;
    dateAxis.renderer.minGridDistance = 70;

    valueAxis.renderer.fontSize = 12;
    dateAxis.renderer.fontSize = 12;
    valueAxis.renderer.minGridDistance = 30;

    valueAxis.renderer.minWidth = 5;

    // Create series
    let series: any = chart.series.push(new am4charts.LineSeries());
    series.dataFields.valueY = 'value';
    series.dataFields.dateX = 'datetime';
    // series.dataFields.value = 'dashlength';
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

    chart.cursor = new am4charts.XYCursor();
    chart.cursor.lineY.disabled = true;
    chart.cursor.snapToSeries = series;
  }

  lineGraphFP() {
    am4core.useTheme(am4themes_animated);
    am4core.options.commercialLicense = true;
    let chart = am4core.create('chartdivFP', am4charts.XYChart);
    chart.data = this.forexPriceQuoteGraph;
    console.log('forwardpremiumgraph', this.forexPriceQuoteGraph);
    // chart.dateFormatter.inputDateFormat = 'dd-MMM-yyyy';
    // Create axes
    let dateAxis: any = chart.xAxes.push(new am4charts.DateAxis());
    // dateAxis.dateFormats.setKey('day', 'MMM yyyy');
    // dateAxis.dateFormats.setKey('month', 'MMM yyyy');
    // dateAxis.dateFormats.setKey('week', 'dd-MM-yy');

    // dateAxis.periodChangeDateFormats.setKey('day', 'dd-MM-yy');
    // dateAxis.periodChangeDateFormats.setKey('month', 'MMM yyyy');
    // dateAxis.periodChangeDateFormats.setKey('week', 'dd-MM-yy');

    // dateAxis.tooltipDateFormat = 'MMM yyyy';
    dateAxis.renderer.minGridDistance = 30;

    dateAxis.dateFormats.setKey('day', 'dd-MM-yy');
    dateAxis.dateFormats.setKey('week', 'dd-MM-yy');
    dateAxis.dateFormats.setKey('month', 'MMM yyyy');
    dateAxis.dateFormats.setKey('year', 'yyyy');
    dateAxis.periodChangeDateFormats.setKey('day', 'dd-MM-yy');
    dateAxis.periodChangeDateFormats.setKey('week', 'dd-MM-yy');
    dateAxis.periodChangeDateFormats.setKey('month', 'MMM yyyy');
    dateAxis.periodChangeDateFormats.setKey('year', 'yyyy');

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

    valueAxis.renderer.labels.template.adapter.add(
      'text',
      (label: any, target: any) => {
        if (target.dataItem) {
          let data;
          if (Number(target.dataItem.forwardPremium) > 1000) {
            return this.util.standardFormat(
              Number(target.dataItem.forwardPremium),
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
    valueAxis.renderer.opposite = true;
    dateAxis.renderer.minGridDistance = 70;

    valueAxis.renderer.fontSize = 12;
    dateAxis.renderer.fontSize = 12;
    valueAxis.renderer.minGridDistance = 30;

    valueAxis.renderer.minWidth = 5;

    // Create series
    let series: any = chart.series.push(new am4charts.LineSeries());
    series.dataFields.valueY = 'value';
    series.dataFields.dateX = 'date';
    // series.dataFields.value = 'dashlength';
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

    chart.cursor = new am4charts.XYCursor();
    chart.cursor.lineY.disabled = true;
    chart.cursor.snapToSeries = series;
  }

  selectedPage: any = 1;
  dataPerPage: any = this.pageActive;
  tableDataLength: any = '-';
  getForexTableData(res: any) {
    this.table_data.value = [];

    res?.forEach((ele: any) => {
      this.table_data.value.push({
        description: `${ele.baseCurrency}${ele.valueCurrency} | ${
          ele.tenor == null ? '-' : ele.tenor
        }`,
        category: ele.categoryDescription,
        market: `${ele.cityCode} | ${ele.regionCode}`,
        time: ele.tradeDatetime,
        tradePrice: ele.tradePrice,
        oneDayChange: ele.chg,
        change: ele.percentChange,
        tradeTick: ele.tradeTick,
        baseCurrency: ele.baseCurrency,
        valueCurrency: ele.valueCurrency,
        hoverDesc: ele.description,
      });
    });
  }
  baseCurrencyData: any;
  selectedCurrency: any;

  getBaseCurrencyData() {
    this.financialMarketData.getForexBaseCurrency().subscribe(
      (res: any) => {
        var formattedData: any = [];
        var formattedModalCurrencyData: any = [];

        res = res.filter((value: any, index: any, self: any) => {
          return index === self.findIndex((t: any) => t === value);
        });

        res?.forEach((ele: any) => {
          formattedData.push({
            id: ele,
            text: ele,
          });
          formattedModalCurrencyData.push({
            key: ele,
            label: ele,
            selected: false,
          });
        });
        this.baseCurrencyData = formattedData;
        // console.log('res baseCurrencyData', res);
        // console.log('baseCurrencyData', this.baseCurrencyData);
        this.currencyData = formattedModalCurrencyData;
      },
      (err) => {
        console.error(err);
      }
    );
  }

  getForwardPriceQuote() {
    this.financialMarketData.getForwardPriceQuote().subscribe((res) => {});
  }

  getForexTableDataBasedOnSelection(e: any) {
    this.selectedForex = e;
    this.currencyQuery = 'searchByBaseCurrency';
    this.onPageChage(1);
  }
  getForexPairsTableDataBasedOnSelection(params: any) {
    var value = params.split('/');
    var paramsNew = `${value[0]}/${value[1]}`;
    this.selectedForex = paramsNew;
    this.currencyQuery = 'searchByForexPair';
    this.onPageChage(1);
  }
  getCategoryDescriptionMapping() {
    this.financialMarketData.getCategoryDescriptionMapping().subscribe(
      (res) => {},
      (err) => {
        console.error(err);
      }
    );
  }

  dataRegion: any = [];
  regionData: any = [];

  getMatrixList() {
    this.financialMarketData.getMatrixList().subscribe((res: any) => {
      var formattedData: any = [];
      res?.forEach((elemetRegion: any) => {
        formattedData.push({
          id: elemetRegion,
          text: elemetRegion,
        });
      });
      this.dataRegion = [...formattedData];
      // this.getCountryListData(this.dataRegion, formattedData);

      this.dataRegion.unshift({
        id: 'custom',
        text: 'Custom',
      });
      this.dataRegion.unshift({
        id: 'fxMajor',
        text: 'Global Majors',
      });

      this.countryLists = this.dataRegion;
    });
  }

  forexId: any = '';
  selectedForex: any = '';
  currencyQuery = 'searchByBaseCurrency';

  onPageChage(page: any, views?: any) {
    views = views ?? this.pageActive;
    this.selectedPage = page;
    this.fxPairsTableLoading = true;
    // this.selectedForex = this.selectedCurrency;
    if (this.forexId != null) this.ws.unsubscribe(this.forexId);
    this.selectedPage = page;
    let tempPage: number = page - 1;
    const generalURL = `/forex/${this.currencyQuery}/${
      this.selectedForex == '' ? this.userLocation : this.selectedForex
    }/${tempPage}/${views}`;
    var generalSendURl = `/app/connect-forex/${this.currencyQuery}/${
      this.selectedForex == '' ? this.userLocation : this.selectedForex
    }/${tempPage}/${views}`;
    let that = this;
    // console.log(generalURL, generalSendURl);
    that.ws.subscribe(generalURL, function (message: any) {
      that.getForexSocketData(message);
      that.fxPairsTableLoading = false;
      that.viewEndPage = that.pageActive * that.selectedPage;
      that.viewStartPage = that.viewEndPage - that.pageActive + 1;
      if (that.viewEndPage > that.tableDataLength) {
        that.viewEndPage = that.tableDataLength;
      }
    });

    that.ws.send(generalSendURl, {}, {});
  }

  selectedDescriptionPage: any;
  onDescriptionPageChage(page: any) {
    this.selectedDescriptionPage = page;
    this.forwardPriceLoading = true;
    this.ws.unsubscribe(this.forexId);
    this.ws.unsubscribe(this.forwardPriceId);
    // this.selectedPage = page;
    // let tempPage: number = page - 1;
    const generalURL = `/forex/iceDescription/${this.descrptionPageParamas}/${
      this.selectedDescriptionPage - 1
    }`;
    var generalSendURl = `/app/connect-forex/iceDescription/${
      this.descrptionPageParamas
    }/${this.selectedDescriptionPage - 1}`;
    let that = this;
    // console.log(generalURL, generalSendURl);
    that.ws.subscribe(generalURL, function (message: any) {
      that.forwardPriceQuotesData(message);
      that.forwardPriceLoading = false;
    });

    that.ws.send(generalSendURl, {}, {});
  }
  onGraphDataClicked(currency: any) {
    // this.selectedPage = page;
    if (this.forexId != null) this.ws.unsubscribe(this.forexId);
    if (this.graphId != null) this.ws.unsubscribe(this.graphId);
    // this.selectedPage = page;
    // let tempPage: number = page - 1;
    const generalURL = `/forex/iceDescriptionGraph/${currency}`;
    var generalSendURl = `/app/connect-forex/iceDescriptionGraph/${currency}`;
    let that = this;
    // console.log(generalURL, generalSendURl);
    that.ws.subscribe(generalURL, function (message: any) {
      // that.getGraphSocketData(message);
      // [TODO:]
    });

    that.ws.send(generalSendURl, {}, {});
  }
  childNodeToggle(id: any, event: any) {
    this.countryLists = this.dataRegion;
    if (id == 1) {
      this.activefxMatrixDropDown = !this.activefxMatrixDropDown;
      event.stopPropagation();
    } else {
      this.activefxMatrixDropDown = false;
    }
  }
}

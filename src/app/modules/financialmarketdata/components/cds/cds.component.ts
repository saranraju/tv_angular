import { Component, OnInit } from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { UtilService } from 'src/app/services/util.service';
import { FinancialMarketDataService } from 'src/app/services/financialmarketdata.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { DatePipe } from '@angular/common';
import { lighten } from '@amcharts/amcharts4/.internal/core/utils/Colors';
import { any } from '@amcharts/amcharts4/.internal/core/utils/Array';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-cds',
  templateUrl: './cds.component.html',
  styleUrls: ['./cds.component.scss'],
})
export class CdsComponent implements OnInit {
  allCDSData: any;
  comparableCDS: any = [];

  pricing: any = [];
  pricingInfo: any = [];
  analytics: any = [];
  system: any = {};

  selectSectorData: any = [];
  selectedSector: any = '';
  selectCurrencyData: any = [];
  selectedCurrency: any = '';
  selectCDSNameListData: any = [];
  ComparableCDSNameListData: any = [];
  selectedCDSNameListData: any;
  selectedCDSNameList: any = '';
  selectBalanceModelData: any = [];
  selectedBalanceModelData: any = [];
  selectedBalanceModel: any = 'quote_spread_mid';
  comportable_table: any;
  cds_identifier: any = '04297120EURSeniorCR';
  cds_identifierMain: any = '04297120EURSeniorCR';
  cds_histrical_data: any;
  cdsLatestData: any;
  chartData: any;
  date_type: any;
  type: any;
  edit_search_dropdown: boolean = false;
  remove_table_length: any;
  previousAPI: any = null;
  selectedcdsSearchTerm: any;
  comparablesSearch: any = '';

  constructor(
    public util: UtilService,
    private financialMarketData: FinancialMarketDataService,
    public auth: AuthService,
    public datepipe: DatePipe,
    public router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  count_res: any = 0;
  total_count_res: any = '';
  ngOnInit(): void {
    $(document).on('select2:open', () => {
      const inputs: any = document.querySelectorAll(
        '.select2-search__field[aria-controls]'
      );

      const mostRecentlyOpenedInput = inputs[inputs.length - 1];

      mostRecentlyOpenedInput.focus();
    });
    $(document).on('select2:open', (e) => {
      if (e.target.id === 'cdsSearch') {
        const selectSearchInput = document.querySelector(
          '.select2-search__field'
        );

        let timeout: any = null;

        selectSearchInput?.addEventListener('input', (e: any) => {
          clearTimeout(timeout);

          if (this.previousAPI !== null) {
            this.previousAPI.unsubscribe();
          }
          this.selectedcdsSearchTerm = e.target.value;
          let cdsNameListFormattedData: any = [];
          timeout = setTimeout(() => {
            this.count_res = 0;
            this.total_count_res = 1;
            this.util.loaderService.display(true);
            let body = {
              sector: this.selectedSector,
              currency: this.selectedCurrency,
            };
            this.previousAPI = this.financialMarketData
              .getCDSListSearchDropDown(this.selectedcdsSearchTerm, body)
              .subscribe((res) => {
                // this.util.loaderService.display(false);
                ++this.count_res;
                this.util.checkCountValue(this.total_count_res, this.count_res);
                res?.forEach((element: any) => {
                  cdsNameListFormattedData.push({
                    id: element?.identifier,
                    text:
                      element?.entityName +
                      ' | ' +
                      element?.tenor +
                      'Y | ' +
                      element?.currency +
                      ' | ' +
                      element?.restructuringType +
                      ' | ' +
                      element?.seniority,
                  });
                });
                this.selectCDSNameListData = cdsNameListFormattedData;

                if (res.length == 0) {
                  setTimeout(() => {
                    document

                      .getElementById('select2-cdsSearch-results')

                      ?.classList.add('noDataApply');
                  }, 1500);
                }

                setTimeout(() => {
                  $('#cdsSearch').select2('open');
                  (
                    document.querySelector('.select2-search__field') as any
                  ).value = this.selectedcdsSearchTerm;
                }, 100);
              });
          }, 1000);
        });
      }
      if (e.target.id === 'comaparablesSearch') {
        const selectSearchInput = document.querySelector(
          '.select2-search__field'
        );

        let timeout: any = null;

        selectSearchInput?.addEventListener('input', (e: any) => {
          clearTimeout(timeout);

          if (this.previousAPI !== null) {
            this.previousAPI.unsubscribe();
          }
          this.selectedcdsSearchTerm = e.target.value;
          let cdsNameListFormattedData: any = [];
          timeout = setTimeout(() => {
            this.count_res = 0;
            this.total_count_res = 1;
            this.util.loaderService.display(true);
            let body = {
              sector: this.selectedSector,
              currency: this.selectedCurrency,
            };
            this.previousAPI = this.financialMarketData
              .getCDSListSearchDropDown(this.selectedcdsSearchTerm, body)
              .subscribe((res) => {
                // this.util.loaderService.display(false);
                ++this.count_res;
                this.util.checkCountValue(this.total_count_res, this.count_res);
                res?.forEach((element: any) => {
                  cdsNameListFormattedData.push({
                    id: element?.identifier,
                    text:
                      element?.entityName +
                      ' | ' +
                      element?.tenor +
                      'Y | ' +
                      element?.currency +
                      ' | ' +
                      element?.restructuringType +
                      ' | ' +
                      element?.seniority,
                  });
                });
                this.ComparableCDSNameListData = cdsNameListFormattedData;

                if (res.length == 0) {
                  setTimeout(() => {
                    document

                      .getElementById('select2-comaparablesSearch-results')

                      ?.classList.add('noDataApply');
                  }, 1500);
                }

                setTimeout(() => {
                  $('#comaparablesSearch').select2('open');
                  (
                    document.querySelector('.select2-search__field') as any
                  ).value = this.selectedcdsSearchTerm;
                }, 100);
              });
          }, 1000);
        });
      }
    });
    if (
      Object.keys((this.activatedRoute.queryParams as any)?.value).length !== 0
    ) {
      this.activatedRoute.queryParams.subscribe((params: any) => {
        this.cds_identifier = params.identifier ?? '04297120EURSeniorCR';
        this.cds_identifierMain = params.identifier ?? '04297120EURSeniorCR';

        this.util.setDateHandler('1Y');

        this.count_res = 0;
        this.total_count_res = 3;
        this.util.loaderService.display(true);
        // this.getCDSNameListData();
        this.getAllCDSDataHandler('1Y');
        this.getComparableCDSDataHandler('');
        this.getCurrencyData();
      });
    } else {
      this.util.setDateHandler('1Y');

      this.count_res = 0;
      this.total_count_res = 3;
      this.util.loaderService.display(true);
      // this.getCDSNameListData();
      this.getAllCDSDataHandler('1Y');
      this.getComparableCDSDataHandler('');
      this.getCurrencyData();
    }
  }

  userAddedSecurities: any = [];
  userRemovedSecurities: any = [];
  getComparableCDSDataHandler(func: any) {
    const id = localStorage.getItem('id');

    this.financialMarketData
      .getUserBondsCds(id, this.cds_identifierMain)
      .subscribe((res: any) => {
        this.userAddedSecurities = [];
        this.userRemovedSecurities = [];

        res?.forEach((el: any) => {
          if (el?.status === 'ADDED') {
            this.userAddedSecurities.push(el?.preferenceId);
          } else {
            this.userRemovedSecurities.push(el?.preferenceId);
          }
        });

        if (res?.length) {
          this.showReset = true;
        }

        this.financialMarketData
          .getComparableCDSData(
            this.cds_identifier,
            this.userAddedSecurities?.toString(),
            this.userRemovedSecurities?.toString()
          )
          .subscribe(
            (res) => {
              ++this.count_res;
              this.util.checkCountValue(this.total_count_res, this.count_res);
              this.selectedCDSNameList = '';
              // if (this.remove_table_length && func === 'append') {
              //   const ifNotPresent = this.comparableCDS.filter((ele: any) => {
              //     return ele.identifier == res[0].identifier;
              //   });
              //   if (ifNotPresent.length === 0) {
              //     this.comparableCDS.push(res[0]);
              //   }
              //   this.selectedCDSNameList = '';
              //   this.comparablesSearch = '';
              // } else {
              //   this.comparableCDS = res;
              //   this.remove_table_length = res.length;
              //   this.comportable_table = res[0];
              //   this.selectCDSNameListData = null;
              // }

              if (res?.length > 6) {
                this.comparableCDS = res.slice(0, 6);
              } else {
                this.comparableCDS = res;
              }
              this.remove_table_length = res.length;
              this.comportable_table = res[0];
            },
            (err) => {
              console.log('error', err.message);
            }
          );
      });
  }

  compartableTableDataHandler(value: any) {
    this.count_res = 0;
    this.total_count_res = 2;
    this.util.loaderService.display(true);
    this.comportable_table = value;
    this.cds_identifier = value.identifier;
    this.getComparableCDSDataHandler('');
    this.getAllCDSDataHandler(this.date_type ? this.date_type : '1Y');

    const url = this.router.serializeUrl(
      this.router.createUrlTree(['financialmarketdata/cds'], {
        queryParams: {
          identifier: this.cds_identifier,
        },
      })
    );

    window.open(url, '_self');
  }

  comportable_table_paricular_Data(value: any) {
    let temp = {
      businessDateTime: value.cdsDataDetails['entityName'],
      currency: value.cdsDataDetails['currency'],
      entityName: value.cdsDataDetails['entityName'],
      identifier: value.identifier,
      parSpreadMid: value.par_spread_mid,
      quoteSpreadMid: value.quote_spread_mid,
      region: value.region,
      restructuringType: value.cdsDataDetails['restructuringType'],
      seniority: value.cdsDataDetails['seniority'],
      tenor: value.cdsDataDetails['tenor'],
      upFrontMid: value.up_front_mid,
    };
    this.count_res = 0;
    this.total_count_res = 2;
    this.util.loaderService.display(true);
    this.comportable_table = temp;
    this.cds_identifier = temp['identifier'];
    this.getComparableCDSDataHandler('');
    this.getAllCDSDataHandler(this.date_type ? this.date_type : '1Y');
  }

  getCurrencyData() {
    let currencyFormattedData: any = [];
    let body = {
      sector: this.selectedSector,
    };
    this.financialMarketData.getCDSCurrency(body).subscribe((res) => {
      ++this.count_res;
      this.util.checkCountValue(this.total_count_res, this.count_res);
      res?.forEach((element: any) => {
        currencyFormattedData.push({
          id: element,
          text: element,
        });
        this.selectCurrencyData = [...['All'], ...currencyFormattedData];
      });
    });
  }
  searchcds() {
    this.count_res = 0;
    this.total_count_res = 1;
    this.util.loaderService.display(true);

    if (this.previousAPI !== null) {
      this.previousAPI.unsubscribe();
    }
    this.resetClick = false;
    this.getCDSNameListData();
  }

  SearchCDScomaparables() {
    this.count_res = 0;
    this.total_count_res = 1;
    this.util.loaderService.display(true);

    if (this.previousAPI !== null) {
      this.previousAPI.unsubscribe();
    }
    let cdsNameListFormattedData: any = [];
    let body = {
      sector: this.selectedSector,
      currency: this.selectedCurrency,
    };
    this.previousAPI = this.financialMarketData
      .getCDSListDropDown(body)
      .subscribe((res) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);
        res?.forEach((element: any) => {
          cdsNameListFormattedData.push({
            id: element?.identifier,
            text:
              element?.entityName +
              ' | ' +
              element?.tenor +
              'Y | ' +
              element?.currency +
              ' | ' +
              element?.restructuringType +
              ' | ' +
              element?.seniority,
          });
        });
        this.ComparableCDSNameListData = cdsNameListFormattedData;

        if (res.length == 0) {
          setTimeout(() => {
            document
              .getElementById('select2-comaparablesSearch-results')
              ?.classList.add('noDataApply');
          }, 1500);
        }

        setTimeout(() => {
          $('#comaparablesSearch').select2('open');
        }, 100);
      });
  }
  Refreshpage() {
    this.selectedSector = '';
    this.selectedCurrency = '';
    this.selectedBalanceModel = '';
    this.edit_search_dropdown = false;
    $('#cdsSearch').select2('close');
  }

  getCDSNameListData() {
    let cdsNameListFormattedData: any = [];
    let body = {
      sector: this.selectedSector,
      currency: this.selectedCurrency,
    };
    this.previousAPI = this.financialMarketData
      .getCDSListDropDown(body)
      .subscribe((res) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);
        res?.forEach((element: any) => {
          cdsNameListFormattedData.push({
            id: element?.identifier,
            text:
              element?.entityName +
              ' | ' +
              element?.tenor +
              'Y | ' +
              element?.currency +
              ' | ' +
              element?.restructuringType +
              ' | ' +
              element?.seniority,
          });
        });
        this.selectCDSNameListData = cdsNameListFormattedData;
        this.ComparableCDSNameListData = cdsNameListFormattedData;
        setTimeout(() => {
          !this.resetClick ? $('#cdsSearch').select2('open') : '';
        }, 100);
        this.selectCDSNameListData = cdsNameListFormattedData;
      });
  }

  getAllCDSDataHandler(dateChangeType?: any) {
    let sectorFormattedData: any = [];

    let selectBalanceModelFormattedData: any = [];

    this.financialMarketData
      .getAllCDSData(
        this.cds_identifier,
        this.datepipe.transform(this.util.startDate, 'yyyy-MM-dd'),
        this.datepipe.transform(this.util.endDate, 'yyyy-MM-dd'),
        this.selectedBalanceModel
      )
      .subscribe(
        (res) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);
          this.allCDSData = res;
          this.cdsLatestData = res.cdsLatestData;
          this.cds_histrical_data = res.cdsHistoricalData;

          let endDate =
            this.cds_histrical_data[this.cds_histrical_data.length - 1].period;
          this.util.endDate = new Date(endDate);

          if (dateChangeType) {
            this.util.setDateHandler(dateChangeType);
            let dates1W: any = this.cds_histrical_data.filter((el: any) => {
              return new Date(el.period) > this.util.startDate ? el : '';
            });
            this.chartData = [];
            dates1W.forEach((el: any) => {
              this.chartData.push({
                date: el.period,
                value: el.data?.toFixed(2),
              });
            });
            this.CDSChart();
          }
          res?.sector.forEach((element: any) => {
            sectorFormattedData.push({
              id: element,
              text: element,
            });

            this.selectSectorData = sectorFormattedData;
          });
          this.selectSectorData.splice(0, 0, 'All');

          res?.balanceModel.forEach((element: any) => {
            if (this.type) {
              if (!res?.balanceModel.includes(element))
                this.filterCDSNameListsHandler(element, element.tableName);
            } else {
              this.filterCDSNameListsHandler(element, element.tableName);
            }
            if (element.metricDisplayOrder != 0) {
              selectBalanceModelFormattedData.push({
                id: element?.fieldName,
                text: element?.description,
              });
              this.selectBalanceModelData = selectBalanceModelFormattedData;
            }
          });
        },
        (err) => {
          console.log('error', err.message);
        }
      );
  }

  editTable() {
    this.edit_search_dropdown = !this.edit_search_dropdown;
  }
  resetClick: any;
  showReset: any = false;
  resetTable(type?: any) {
    this.resetClick = true;
    this.edit_search_dropdown = false;
    if (!type) {
      // this.cds_identifier = '04297120EURSeniorCR';
      // this.getComparableCDSDataHandler('');
      // this.selectedCDSNameList = '';
      // this.getCDSNameListData();
      this.showReset = false;

      const id = localStorage.getItem('id');

      this.financialMarketData
        .removeUserBondsCds(id, this.cds_identifierMain)
        .subscribe((res: any) => {
          console.log(res);
          this.getComparableCDSDataHandler('');
          this.selectedCDSNameList = '';
          this.getCDSNameListData();
        });
    }
  }

  filterCDSNameListsHandler(data: any, key: string) {
    switch (key) {
      case 'bidAsk':
        this.pricing.push(data);
        break;
      case 'pricing':
        this.pricingInfo.push(data);
        break;
      case 'analytics':
        this.analytics.push(data);
        break;
      case '':
        this.system[data.fieldName] = data.unit;
        break;
      default:
    }
  }

  handleselectedRowData(e: any) {
    this.showReset = true;

    const id = localStorage.getItem('id');
    let body = {
      userId: id,
      selectionId: this.cds_identifier,
      preferenceId: e.identifier,
      status: 'REMOVED',
      type: 'cds',
    };

    this.financialMarketData.addUserBondsCds(body).subscribe((res: any) => {
      console.log(res);
    });
  }

  valueChangedHandler(type: any, data: any, func: any) {
    if (type === 'Sector') {
      if (this.selectSectorData && this.selectedSector !== data) {
        this.selectedSector = data;
        this.count_res = 0;
        this.total_count_res = data == 'All' ? 2 : 3;
        this.util.loaderService.display(true);
        this.getComparableCDSDataHandler('');
        this.getAllCDSDataHandler(this.date_type ? this.date_type : '1Y');
        if (data != 'All') {
          this.selectCurrencyData = [];
          this.selectedCurrency = '';
          this.getCurrencyData();
        }
        // this.getCDSNameListData();
      }
    }
    if (type === 'Currency') {
      if (this.selectCurrencyData && this.selectedCurrency !== data) {
        this.selectedCurrency = data;
        // this.count_res = 0;
        // this.total_count_res = 1;
        // this.util.loaderService.display(true);
        // this.getComparableCDSDataHandler('');
        // this.getAllCDSDataHandler(this.date_type ? this.date_type : '1Y');
        // this.getCDSNameListData();
      }
    }
    if (type === 'CDSNameList') {
      if (this.selectCDSNameListData && this.selectedCDSNameList !== data) {
        this.selectedCDSNameList = data;
        this.cds_identifier = data;
        this.count_res = 0;
        this.total_count_res = 2;
        this.util.loaderService.display(true);
        this.getComparableCDSDataHandler(func);
        this.getAllCDSDataHandler(this.date_type ? this.date_type : '1Y');
        this.Refreshpage();

        const url = this.router.serializeUrl(
          this.router.createUrlTree(['financialmarketdata/cds'], {
            queryParams: {
              identifier: this.selectedCDSNameList,
            },
          })
        );

        window.open(url, '_self');
      }
      this.selectCDSNameListData?.filter((el: any) => {
        if (el?.id == this.selectedCDSNameList) {
          this.selectedCDSNameListData = el;
        }
      });
    }
    if (type == 'CDSNameList_edit') {
      if (this.ComparableCDSNameListData && this.comparablesSearch !== data) {
        if (this.comparableCDS?.length <= 5) {
          // this.cds_identifier = data;
          this.comparablesSearch = data;
          // this.count_res = 0
          // this.total_count_res = 1
          // this.util.loaderService.display(true)
          const id = localStorage.getItem('id');
          let body = {
            userId: id,
            selectionId: this.cds_identifierMain,
            preferenceId: data,
            status: 'ADDED',
            type: 'cds',
          };

          this.financialMarketData
            .addUserBondsCds(body)
            .subscribe((res: any) => {
              this.getComparableCDSDataHandler(func);

              console.log(res);
            });
        } else {
          this.edit_search_dropdown = false;
          this.comparablesSearch = '';
          this.auth.closeInsidePopup = true;
          setTimeout(() => {
            $('#comaparablesSearch').select2('close');
            this.edit_search_dropdown = true;
          }, 500);
        }
      }
      this.ComparableCDSNameListData.filter((el: any) => {
        if (el?.id == this.comparablesSearch) {
          this.comparablesSearch = el;
        }
      });
    }
    if (type === 'BalanceModel') {
      this.type = 'BalanceModel';
      if (this.selectBalanceModelData && this.selectedBalanceModel !== data) {
        this.selectedBalanceModel = data;
        this.count_res = 0;
        this.total_count_res = 2;
        this.util.loaderService.display(true);
        this.getComparableCDSDataHandler('');
        this.getAllCDSDataHandler(this.date_type ? this.date_type : '1Y');
        this.selectedSector = '';
        this.selectedCurrency = '';
        this.getCurrencyData();
      }
      this.selectBalanceModelData.filter((el: any) => {
        if (el?.id == this.selectedBalanceModel) {
          this.selectedBalanceModelData = el;
        }
      });
    }
  }

  dateChange(type: string) {
    this.date_type = type;
    this.util.selectedDatetype = type;
    let endDate =
      this.cds_histrical_data[this.cds_histrical_data.length - 1].period;
    this.util.endDate = new Date(endDate);
    if (type) {
      this.util.setDateHandler(type);

      let dates1W: any = this.cds_histrical_data.filter((el: any) => {
        return new Date(el.period) > this.util.startDate ? el : '';
      });

      this.chartData = [];
      dates1W.forEach((el: any) => {
        this.chartData.push({
          date: el.period,
          value: el.data?.toFixed(2),
        });
      });
      this.CDSChart();
    }
  }

  CDSChart() {
    // Create chart
    am4core.options.commercialLicense = true;
    let chart: any = am4core.create('chartdiv', am4charts.XYChart);
    // $(document).ready(function () {
    //   $('g[aria-labelledby]').hide();
    // });

    // chart.paddingRight = 20;
    chart.tapToActivate = true;

    chart.padding(28, 20, 10, 0);
    chart.maskBullets = false;
    chart.preloader.backgroundSlice.fill = am4core.color('#ffc000');
    chart.preloader.background.fill = am4core.color('#00071e');
    chart.preloader.fill = am4core.color('#ffc000');
    // the following line makes value axes to be arranged vertically.
    chart.leftAxesContainer.layout = 'vertical';

    //set data
    chart.data = this.chartData;
    chart.dateFormatter.dateFormat = 'dd-MMM-yyyy';

    // Create axes
    let dateAxis: any = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.baseInterval = {
      timeUnit: 'day',
      count: 1,
    };
    // dateAxis.tooltipDateFormat = 'HH:mm, d MMMM';

    dateAxis.dateFormats.setKey('day', 'dd-MM-yy');
    dateAxis.dateFormats.setKey('month', 'MMM yyyy');
    dateAxis.dateFormats.setKey('week', 'dd-MM-yy');

    dateAxis.periodChangeDateFormats.setKey('day', 'dd-MM-yy');
    dateAxis.periodChangeDateFormats.setKey('month', 'MMM yyyy');
    dateAxis.periodChangeDateFormats.setKey('week', 'dd-MM-yy');

    dateAxis.renderer.labels.template.fill = am4core.color('#ffc000');
    dateAxis.renderer.line.stroke = am4core.color('#ffc000');
    dateAxis.renderer.minLabelPosition = 0.01;
    dateAxis.renderer.maxLabelPosition = 0.99;
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.renderer.ticks.template.length = 8;
    dateAxis.renderer.grid.template.disabled = true;
    dateAxis.renderer.ticks.template.disabled = false;
    dateAxis.renderer.grid.template.strokeOpacity = 0.1;
    dateAxis.renderer.line.strokeWidth = 2;
    dateAxis.renderer.line.strokeOpacity = 1;
    dateAxis.maxZoomDeclination = 0;
    dateAxis.startLocation = 0.5;
    dateAxis.endLocation = 0.6;
    dateAxis.tooltip.fontSize = 9;

    dateAxis.renderer.minGridDistance = 70;

    let valueAxis: any = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.tooltip.disabled = true;
    valueAxis.renderer.grid.template.strokeOpacity = 0.1;

    valueAxis.tooltip.fontSize = 9;

    // valueAxis.title.text = 'Unique visitors';

    /**
     * Adapter to format the tooptip values
     */

    valueAxis.renderer.labels.template.fill = am4core.color('#ffc000');

    valueAxis.renderer.line.stroke = am4core.color('#ffc000');
    valueAxis.renderer.line.strokeWidth = 2;
    valueAxis.renderer.line.strokeOpacity = 1;

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

    var valueAxisTooltip = valueAxis.tooltip;
    valueAxisTooltip.fontSize = 10;
    valueAxisTooltip.paddingLeft = 0;

    var dateAxisTooltip = dateAxis.tooltip;
    dateAxisTooltip.fontSize = 10;
    dateAxisTooltip.paddingLeft = 0;

    //creat series
    let series: any = chart.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = 'date';
    series.dataFields.valueY = 'value';
    series.tooltipText = '[bold]{valueY}[/]';
    // if (series.dataFields.valueY > 0)
    //   series.fillOpacity = 0.3;
    // else {
    //   series.fillOpacity = 0
    // }
    series.tooltip.getFillFromObject = false;
    series.tooltip.background.cornerRadius = 3;
    series.tooltip.label.fontSize = 9;
    series.tooltip.label.padding(5, 5, 5, 5);
    series.tooltip.pointerOrientation = 'vertical';
    series.tooltip.background.fill = am4core.color('#000000');

    this.chartData.forEach((el: any) => {
      if (el.value < 0) {
        series.fillOpacity = 0.01;
      } else {
        series.fillOpacity = 0.3;
      }
    });

    // series.adapter.add("opacity", function (fill: any, target: any) {
    //   console.log(target.dataFields.valueY);
    //   if (target.dataItem && (target.dataItem.valueY < 0)) {
    //     return series.fillOpacity = 0;
    //   }
    //   else {
    //     return series.fillOpacity = 0.3;
    //   }
    // });

    let self = this;
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
    // make a cursor point
    chart.cursor = new am4charts.XYCursor();
    chart.cursor.lineY.disabled = true;
    chart.cursor.snapToSeries = series;

    chart.responsive.enabled = true;
    chart.responsive.useDefault = false;

    // dateAxis.start = 0.8;
    // dateAxis.keepSelection = true;
  }
}

import { Component, OnInit, Output } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { FinancialMarketDataService } from 'src/app/services/financialmarketdata.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

/* Chart code */
// Themes begin
am4core.useTheme(am4themes_animated);

// Themes end
@Component({
  selector: 'app-bonds',
  templateUrl: './bonds.component.html',
  styleUrls: ['./bonds.component.scss'],
})
export class BondsComponent implements OnInit {
  allBondsData: any;
  comparableSecuritiesData: any = [];
  remove_table_length: any;
  yield: any = [];
  duration: any = [];
  convexity: any = [];
  spread: any = [];

  selectCategoryData: any = [];
  selectedCategory: any = '';
  selectCurrencyData: any = [];
  selectedCurrency: any = '';
  selectBondData: any = [];
  selectedBondData: any;
  selectedBond: any = '';
  selectBalanceModelData: any = [];
  selectedBalanceModelData: any;
  selectedBalanceModel: any = 'price';
  comportable_table: any;
  bonds_isn_Number: any = 'US912810FM54';
  bondLatestData: any;
  bonds_histrical_data: any;
  chartData: any;
  date_type: any;
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
  edit_search_dropdown: boolean = false;
  previousAPI: any = null;
  selectedBondSearchTerm: any;
  selectedBondSearchTerm1: any;

  ngOnInit(): void {
    $(document).on('select2:open', (e) => {
      const inputs: any = document.querySelectorAll(
        '.select2-search__field[aria-controls]'
      );

      const mostRecentlyOpenedInput = inputs[inputs.length - 1];

      mostRecentlyOpenedInput.focus();

      if (e.target.id === 'bondDropdown') {
        const selectSearchInput = document.querySelector(
          '.select2-search__field'
        );

        let timeout: any = null;

        selectSearchInput?.addEventListener('input', (e: any) => {
          clearTimeout(timeout);

          if (this.previousAPI !== null) {
            this.previousAPI.unsubscribe();
          }

          this.selectedBondSearchTerm = e.target.value;

          timeout = setTimeout(() => {
            this.count_res = 0;
            this.total_count_res = 1;
            this.util.loaderService.display(true);

            this.getBondsSearchList(e.target.value);
          }, 1000);
        });
      } else if (e.target.id === 'customers_select') {
        const selectSearchInput = document.querySelector(
          '.select2-search__field'
        );

        let timeout: any = null;

        selectSearchInput?.addEventListener('input', (e: any) => {
          clearTimeout(timeout);

          if (this.previousAPI !== null) {
            this.previousAPI.unsubscribe();
          }

          this.selectedBondSearchTerm1 = e.target.value;

          timeout = setTimeout(() => {
            this.count_res = 0;
            this.total_count_res = 1;
            this.util.loaderService.display(true);

            this.getBondsSearchList1(e.target.value);
          }, 1000);
        });
      }
    });

    if (
      Object.keys((this.activatedRoute.queryParams as any)?.value).length !== 0
    ) {
      this.activatedRoute.queryParams.subscribe((params: any) => {
        this.bonds_isn_Number = params.identifier ?? 'US912810FM54';
        this.bonds_isn_NumberMain = params.identifier ?? 'US912810FM54';

        this.util.setDateHandler('1Y');
        this.count_res = 0;
        this.total_count_res = 4;
        this.util.loaderService.display(true);
        this.getAllBondsDataHandler('1Y');
        this.getComparableSecuritiesDataHandler('');
        // this.getBondsList();
        this.getCurrency();
        this.getCategeory();
      });
    } else {
      this.util.setDateHandler('1Y');
      this.count_res = 0;
      this.total_count_res = 4;
      this.util.loaderService.display(true);
      this.getAllBondsDataHandler('1Y');
      this.getComparableSecuritiesDataHandler('');
      // this.getBondsList();
      this.getCurrency();
      this.getCategeory();
    }
  }

  compartableTableDataHandler(value: any) {
    this.count_res = 0;
    this.total_count_res = 2;
    this.util.loaderService.display(true);
    this.comportable_table = value;
    this.bonds_isn_Number = value.isinNumber
      ? value.isinNumber
      : value.isin_number;
    this.getComparableSecuritiesDataHandler('');
    this.getAllBondsDataHandler(this.date_type ? this.date_type : '1Y');

    const url = this.router.serializeUrl(
      this.router.createUrlTree(['financialmarketdata/bonds'], {
        queryParams: {
          identifier: this.bonds_isn_Number,
        },
      })
    );

    window.open(url, '_self');
  }

  userAddedSecurities: any = [];
  userRemovedSecurities: any = [];
  getComparableSecuritiesDataHandler(func: any) {
    const id = localStorage.getItem('id');

    this.financialMarketData
      .getUserBondsCds(id, this.bonds_isn_NumberMain)
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
          .getComparableSecuritiesData(
            this.bonds_isn_Number,
            this.userAddedSecurities?.toString(),
            this.userRemovedSecurities?.toString()
          )
          .subscribe(
            (res) => {
              ++this.count_res;
              this.util.checkCountValue(this.total_count_res, this.count_res);
              this.selectedBond = '';
              // if (func == 'append') {
              //   const ifNotPresent = this.comparableSecuritiesData.filter(
              //     (ele: any) => {
              //       return ele.isinNumber == res[0].isinNumber;
              //     }
              //   );
              //   if (ifNotPresent.length === 0) {
              //     this.comparableSecuritiesData.splice(1, 0, res[0]);
              //   }
              // } else {
              //   this.comparableSecuritiesData = res;
              //   this.remove_table_length = res.length;
              //   this.comportable_table = res[0];
              // }

              if (res?.length > 6) {
                this.comparableSecuritiesData = res.slice(0, 6);
              } else {
                this.comparableSecuritiesData = res;
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

  editTable() {
    this.edit_search_dropdown = !this.edit_search_dropdown;
    this.selectBondData = null;
  }
  getBondsList() {
    let body = {
      categeory: this.selectedCategory,
      currency: this.selectedCurrency,
    };
    this.previousAPI = this.financialMarketData
      .getBondsListDropDown(body)
      .subscribe(
        (res) => {
          let bondFormattedData: any = [];
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);
          res.forEach((element: any) => {
            bondFormattedData.push({
              id: element?.isin_number,
              text: element?.description + ' | ' + element?.maturity_date,
            });
          });

          this.selectBondData = bondFormattedData;

          setTimeout(() => {
            $('#bondDropdown').select2('open');
          }, 100);
        },
        (err) => {
          console.log('error', err.message);
        }
      );
  }

  getBondsList1() {
    let body = {
      categeory: this.selectedCategory,
      currency: this.selectedCurrency,
    };
    this.previousAPI = this.financialMarketData
      .getBondsListDropDown(body)
      .subscribe(
        (res) => {
          let bondFormattedData: any = [];
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);
          res.forEach((element: any) => {
            bondFormattedData.push({
              id: element?.isin_number,
              text: element?.description + ' | ' + element?.maturity_date,
            });
          });

          this.selectBondData = bondFormattedData;

          setTimeout(() => {
            $('#customers_select').select2('open');
          }, 100);
        },
        (err) => {
          console.log('error', err.message);
        }
      );
  }

  getBondsSearchList(searchTerm: any) {
    let body = {
      categeory: this.selectedCategory,
      currency: this.selectedCurrency,
    };
    this.previousAPI = this.financialMarketData
      .getBondsSearchListDropDown(body, searchTerm)
      .subscribe(
        (res) => {
          let bondFormattedData: any = [];
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);
          res.forEach((element: any) => {
            bondFormattedData.push({
              id: element?.isin_number,
              text: element?.description + ' | ' + element?.maturity_date,
            });
          });

          this.selectBondData = bondFormattedData;

          if (res.length == 0) {
            setTimeout(() => {
              document
                .getElementById('select2-bondDropdown-results')
                ?.classList.add('noDataApply');
            }, 1500);
          }
          setTimeout(() => {
            $('#bondDropdown').select2('open');
            (document.querySelector('.select2-search__field') as any).value =
              this.selectedBondSearchTerm;
          }, 100);
        },
        (err) => {
          console.log('error', err.message);
        }
      );
  }

  getBondsSearchList1(searchTerm: any) {
    let body = {
      categeory: this.selectedCategory,
      currency: this.selectedCurrency,
    };
    this.previousAPI = this.financialMarketData
      .getBondsSearchListDropDown(body, searchTerm)
      .subscribe(
        (res) => {
          let bondFormattedData: any = [];
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);
          res.forEach((element: any) => {
            bondFormattedData.push({
              id: element?.isin_number,
              text: element?.description + ' | ' + element?.maturity_date,
            });
          });

          this.selectBondData = bondFormattedData;

          if (res.length == 0) {
            setTimeout(() => {
              document
                .getElementById('select2-customers_select-results')
                ?.classList.add('noDataApply');
            }, 1500);
          }
          setTimeout(() => {
            $('#customers_select').select2('open');
            (document.querySelector('.select2-search__field') as any).value =
              this.selectedBondSearchTerm1;
          }, 100);
        },
        (err) => {
          console.log('error', err.message);
        }
      );
  }

  handleBondsDropdownClick() {
    if (this.previousAPI !== null) {
      this.previousAPI.unsubscribe();
    }

    this.count_res = 0;
    this.total_count_res = 1;
    this.util.loaderService.display(true);

    this.getBondsList();
  }

  handleSecurityDropdownClick() {
    if (this.previousAPI !== null) {
      this.previousAPI.unsubscribe();
    }

    this.count_res = 0;
    this.total_count_res = 1;
    this.util.loaderService.display(true);

    this.getBondsList1();
  }

  getCurrency() {
    let body = {
      categeory: this.selectedCategory,
    };
    let currencyFormattedData: any = [];
    this.financialMarketData.getBondsCurrency(body).subscribe((res) => {
      ++this.count_res;
      this.util.checkCountValue(this.total_count_res, this.count_res);
      res?.forEach((element: any) => {
        currencyFormattedData.push({
          id: element,
          text: element,
        });
      });

      currencyFormattedData.unshift({
        id: 'All',
        text: 'All',
      });
      this.selectCurrencyData = currencyFormattedData;
    });
  }

  getCategeory() {
    let categoryFormattedData: any = [];
    this.financialMarketData.getBondsCategeory().subscribe((res) => {
      ++this.count_res;
      this.util.checkCountValue(this.total_count_res, this.count_res);
      res?.forEach((element: any) => {
        categoryFormattedData.push({
          id: element,
          text: element,
        });
      });

      categoryFormattedData.unshift({
        id: 'All',
        text: 'All',
      });
      this.selectCategoryData = categoryFormattedData;
    });
  }

  getAllBondsDataHandler(dateChangeType?: any) {
    let selectBalanceModelFormattedData: any = [];
    this.yield = [];
    this.duration = [];
    this.convexity = [];
    this.spread = [];
    this.financialMarketData
      .getAllBondsData(this.bonds_isn_Number, this.selectedBalanceModel)
      .subscribe(
        (res) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);
          this.allBondsData = res;
          this.bondLatestData = res.bondLatestData;
          this.bonds_histrical_data = res.bondHistoricalData;

          let endDate =
            this.bonds_histrical_data[this.bonds_histrical_data.length - 1]
              .period;
          this.util.endDate = new Date(endDate);

          if (dateChangeType) {
            this.util.setDateHandler(dateChangeType);

            let dates1W: any = this.bonds_histrical_data.filter((el: any) => {
              return new Date(el.period) > this.util.startDate ? el : '';
            });

            this.chartData = [];
            dates1W.forEach((el: any) => {
              this.chartData.push({
                date: el.period,
                value: el.data?.toFixed(2),
              });
            });
            this.bondsChart();
          }
          res?.balanceModel.forEach((element: any) => {
            this.filterBondsHandler(element, element.section);
            selectBalanceModelFormattedData.push({
              id: element?.fieldName,
              text: element?.displayName,
            });
            this.selectBalanceModelData = selectBalanceModelFormattedData;
          });
        },
        (err) => {
          console.log('error', err.message);
        }
      );
  }

  filterBondsHandler(data: object, key: string) {
    switch (key) {
      case 'YIELD':
        this.yield.push(data);
        break;
      case 'DURATION':
        this.duration.push(data);
        break;
      case 'CONVEXITY':
        this.convexity.push(data);
        break;
      case 'SPREAD':
        this.spread.push(data);
        break;
      default:
    }
  }

  handleselectedRowData(e: any) {
    this.showReset = true;

    const id = localStorage.getItem('id');
    let body = {
      userId: id,
      selectionId: this.bonds_isn_Number,
      preferenceId: e.isinNumber,
      status: 'REMOVED',
      type: 'bond',
    };

    this.financialMarketData.addUserBondsCds(body).subscribe((res: any) => {
      console.log(res);
    });
  }
  bonds_isn_NumberMain: any = 'US912810FM54';
  valueChangedHandler(type: any, data: any, func: any) {
    if (type === 'Category') {
      if (this.selectCategoryData && this.selectedCategory !== data) {
        this.selectedCategory = data;
        this.count_res = 0;
        this.total_count_res = 3;
        this.util.loaderService.display(true);

        this.selectCurrencyData = [];
        this.selectedCurrency = '';
        this.getCurrency();
        this.getComparableSecuritiesDataHandler('');
        this.getAllBondsDataHandler(this.date_type ? this.date_type : '1Y');
        // this.getBondsList();
      }
    }
    if (type === 'Currency') {
      if (this.selectCurrencyData && this.selectedCurrency !== data) {
        this.selectedCurrency = data;
        // this.count_res = 0;
        // this.total_count_res = 2;
        // this.util.loaderService.display(true);
        // this.getComparableSecuritiesDataHandler('');
        // this.getAllBondsDataHandler(this.date_type ? this.date_type : '1Y');
        // this.getBondsList();
      }
    }
    if (type === 'Bond') {
      if (this.selectBondData && this.selectedBond !== data) {
        this.selectedBond = data;
        this.bonds_isn_Number = data;
        this.count_res = 0;
        this.total_count_res = 2;
        this.util.loaderService.display(true);
        this.getComparableSecuritiesDataHandler('');
        this.getAllBondsDataHandler(this.date_type ? this.date_type : '1Y');

        this.selectedCategory = '';
        this.selectedCurrency = '';
        this.selectedBalanceModel = 'price';

        const url = this.router.serializeUrl(
          this.router.createUrlTree(['financialmarketdata/bonds'], {
            queryParams: {
              identifier: this.selectedBond,
            },
          })
        );

        window.open(url, '_self');
      }
      this.selectBondData?.filter((el: any) => {
        if (el?.id == this.selectedBond) {
          this.selectedBondData = el;
        }
      });
    }
    if (type === 'bond_edit') {
      if (this.selectBondData && this.selectedBond !== data) {
        if (this.comparableSecuritiesData?.length <= 5) {
          this.selectedBond = data;
          // this.bonds_isn_Number = data;

          this.count_res = 0;
          this.total_count_res = 1;
          this.util.loaderService.display(true);
          const id = localStorage.getItem('id');
          let body = {
            userId: id,
            selectionId: this.bonds_isn_NumberMain,
            preferenceId: data,
            status: 'ADDED',
            type: 'bond',
          };

          this.financialMarketData
            .addUserBondsCds(body)
            .subscribe((res: any) => {
              this.getComparableSecuritiesDataHandler(func);

              console.log(res);
            });
        } else {
          this.selectedBond = undefined;
          this.auth.closeInsidePopup = true;
        }
      }
      this.selectBondData.filter((el: any) => {
        if (el?.id == this.selectedBond) {
          this.selectedBondData = el;
        }
      });
    }
    if (type === 'BalanceModel') {
      if (this.selectBalanceModelData && this.selectedBalanceModel !== data) {
        this.selectedBalanceModel = data;
        this.count_res = 0;
        this.total_count_res = 2;
        this.util.loaderService.display(true);
        this.getComparableSecuritiesDataHandler('');
        this.getAllBondsDataHandler(this.date_type ? this.date_type : '1Y');

        this.selectedCategory = '';
        this.selectedCurrency = '';
        this.getCurrency();
      }
      this.selectBalanceModelData.filter((el: any) => {
        if (el?.id == this.selectedBalanceModel) {
          this.selectedBalanceModelData = el;
        }
      });
    }
  }

  showReset: any = false;
  resetTable(type?: any) {
    this.edit_search_dropdown = false;
    if (!type) {
      // this.bonds_isn_Number = 'US912810FM54';
      // this.getComparableSecuritiesDataHandler('');
      this.showReset = false;

      const id = localStorage.getItem('id');

      this.financialMarketData
        .removeUserBondsCds(id, this.bonds_isn_NumberMain)
        .subscribe((res: any) => {
          this.getComparableSecuritiesDataHandler('');
        });
    }
  }

  dateChange(type: any) {
    this.date_type = type;
    // this.getAllBondsDataHandler(this.date_type);
    let endDate =
      this.bonds_histrical_data[this.bonds_histrical_data.length - 1].period;
    this.util.endDate = new Date(endDate);
    if (type) {
      this.util.setDateHandler(type);

      let dates1W: any = this.bonds_histrical_data.filter((el: any) => {
        return new Date(el.period) > this.util.startDate ? el : '';
      });

      this.chartData = [];
      dates1W.forEach((el: any) => {
        this.chartData.push({
          date: el.period,
          value: el.data?.toFixed(2),
        });
      });
      this.bondsChart();
    }
  }

  bondsChart() {
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
    dateAxis.renderer.line.strokeWidth = 2;
    dateAxis.renderer.line.strokeOpacity = 1;
    dateAxis.renderer.minLabelPosition = 0.01;
    dateAxis.renderer.maxLabelPosition = 0.99;
    dateAxis.maxZoomDeclination = 0;
    dateAxis.startLocation = 0.5;
    dateAxis.endLocation = 0.6;
    dateAxis.tooltip.fontSize = 9;
    dateAxis.renderer.grid.template.strokeOpacity = 0.1;
    dateAxis.renderer.minGridDistance = 70;
    dateAxis.renderer.fontSize = 12;

    let valueAxis: any = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.tooltip.disabled = true;
    valueAxis.renderer.grid.template.strokeOpacity = 0.1;
    valueAxis.tooltip.fontSize = 9;
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
    series.fillOpacity = 0.3;
    series.tooltip.getFillFromObject = false;
    series.tooltip.background.cornerRadius = 3;
    series.tooltip.label.fontSize = 9;
    series.tooltip.label.padding(5, 5, 5, 5);
    series.tooltip.pointerOrientation = 'vertical';
    series.tooltip.background.fill = am4core.color('#000000');
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

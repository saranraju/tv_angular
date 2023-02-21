import { Component, OnInit } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { FinancialMarketDataService } from 'src/app/services/financialmarketdata.service';

/* Chart code */
// Themes begin
am4core.useTheme(am4themes_animated);
// Themes end
@Component({
  selector: 'app-derivatives',
  templateUrl: './derivatives.component.html',
  styleUrls: ['./derivatives.component.scss'],
})
export class DerivativesComponent implements OnInit {
  derivatives_table_data: any = {
    title: [
      {
        label: 'Last Traded Price (USD)',
        key: 'calls_last_trade_price',
      },
      {
        label: 'Volume',
        key: 'calls_volume',
      },
      {
        label: 'Open Interest',
        key: 'calls_open_interest',
      },
      {
        label: '',
        key: 'strike_price',
        display: 'none',
      },
      {
        label: 'Last Traded Price (USD)',
        key: 'puts_last_trade_price',
      },
      {
        label: 'Volume',
        key: 'puts_volume',
      },
      {
        label: 'Open Interest',
        key: 'puts_open_interest',
      },
    ],
    value: [],
  };
  comparable_future_data = {
    title: [
      {
        label: 'Details',
        key: 'displayName',
        width: '20rem',
        hover: true,
      },
      {
        label: 'Date',
        key: 'expiryDate',
        width: '6rem',
        align: 'center',
      },
      {
        label: 'Price (USD)',
        key: 'lastTrade',
        width: '6rem',
        align: 'center',
        formattedNum: true,
      },
      {
        label: 'Open Interest',
        key: 'openInterest',
        width: '6rem',
        align: 'center',
        formattedNum: true,
      },
      {
        label: 'Change In OI',
        key: 'changeInOI',
        width: '6rem',
        align: 'right',
        formattedNum: true,
      },
    ],
    value: [],
  };

  selectNameData: any = [];
  selectedName: any = '';
  selectSettlementDate: any = [];
  selectedSettlementDate: any = '';
  selectOptions: any = [];
  selectedOptions: any = '';
  selectType: any = [];
  selectedType: any = '';
  assetType: any = 'Options';
  showComparableTable: boolean = false;
  showSettlementPrice: any = false;
  derivativesCurrency: any;
  derivativesAllData: any = [];
  derivativesLatestData: any = [];
  derivativesHistoricalData: any = [];
  derivativesOptionComparableDataIdentifier: any =
    '16dO%3AQRTEA%5C23A20%5C12.0';
  showFuturesTable: any = false;
  selectedNameDer: any;

  //set chart data
  chartData: any = [];
  constructor(
    public util: UtilService,
    private financialMarketData: FinancialMarketDataService
  ) {}

  count_res: any = 0;
  total_count_res: any = '';
  previousAPI: any = null;

  ngOnInit(): void {
    $('#nameDropdown').on('select2:open', () => {
      const inputs: any = document.querySelectorAll(
        '.select2-search__field[aria-controls]'
      );
      const mostRecentlyOpenedInput = inputs[inputs.length - 1];
      mostRecentlyOpenedInput.focus();

      const selectSearchInput = document.querySelector(
        '.select2-search__field'
      );

      let timeout: any = null;

      selectSearchInput?.addEventListener('input', (e: any) => {
        clearTimeout(timeout);

        if (this.previousAPI !== null) {
          this.previousAPI.unsubscribe();
        }

        this.selectedNameDer = e.target.value;

        timeout = setTimeout(() => {
          this.count_res = 0;
          this.total_count_res = 1;
          this.util.loaderService.display(true);

          this.getDerivativeNameSearchHandler(e.target.value);
        }, 1000);
      });
    });

    this.util.setDateHandler('1M');

    this.count_res = 0;
    this.total_count_res = 2;
    this.util.loaderService.display(true);

    this.getDerivativesAllDataHandler('');
    this.getDerivativesOptionComparableDataHandler(
      this.derivativesOptionComparableDataIdentifier
    );
  }

  dateChange(type: any) {
    this.util.setDateHandler(type);
    this.util.selectedDatetype = type;
    let endDate =
      this.derivativesHistoricalData[this.derivativesHistoricalData.length - 1]
        .period;
    this.util.endDate = new Date(endDate);
    if (type) {
      this.util.setDateHandler(type);

      let dates1W: any = this.derivativesHistoricalData.filter((el: any) => {
        return new Date(el.period) > this.util.startDate ? el : '';
      });

      this.chartData = [];
      dates1W.forEach((el: any) => {
        this.chartData.push({
          date: el.period,
          value: el.data?.toFixed(2),
        });
      });
      this.derivativesChart();
    }
  }

  handleNameClick() {
    this.count_res = 0;
    this.total_count_res = 1;
    // this.util.loaderService.display(true);
    this.getDerivativeNameHandler();
  }

  handleSelectedRow(e: any) {
    let identifier = e.symbol.replaceAll(':', '%3A').replaceAll('\\', '%5C');
    this.count_res = 0;
    this.total_count_res = 2;
    this.util.loaderService.display(true);

    this.getDerivativesAllDataHandler(identifier);
    this.getDerivativesFutureComparableDataHandler(identifier);

    let newCompany = {
      id: e.underlyingName,
      text: `${e.underlyingName} : ${this.assetType}`,
    };

    this.selectNameData = [...this.selectNameData, newCompany];
    this.selectedName = e.underlyingName;

    this.getDerivativeSettlementDateHandler(this.selectedName);
  }

  getDerivativeNameHandler() {
    let derivativeNameFormattedData: any = [];

    this.previousAPI = this.financialMarketData
      .getDerivativesNameData()
      .subscribe(
        (res: any) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);

          res?.forEach((element: any) => {
            derivativeNameFormattedData.push({
              id: element.underlyingName,
              text: `${element.underlyingName} : ${element.assetType}`,
            });
          });
          this.selectNameData = derivativeNameFormattedData;

          setTimeout(() => {
            $('#nameDropdown').select2('open');
          }, 100);
        },
        (err) => {
          console.log('error', err.message);
        }
      );
  }

  getDerivativeNameSearchHandler(searchTerm: any) {
    this.previousAPI = this.financialMarketData
      .getDerivativeNameSearchData(searchTerm)
      .subscribe(
        (res: any) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);

          let derivativeNameFormattedData: any = [];
          res?.forEach((element: any) => {
            derivativeNameFormattedData.push({
              id: element.underlyingName,
              text: `${element.underlyingName} : ${element.assetType}`,
            });
          });
          this.selectNameData = derivativeNameFormattedData;

          setTimeout(() => {
            $('#nameDropdown').select2('open');
            (document.querySelector('.select2-search__field') as any).value =
              this.selectedNameDer;
          }, 100);
          if (res.length == 0) {
            setTimeout(() => {
              document
                .getElementById('select2-nameDropdown-results')
                ?.classList.add('noDataApply');
            }, 1500);
          }
        },
        (err) => {
          console.log('error', err.message);
        }
      );
  }

  getDerivativeSettlementDateHandler(name: any) {
    let derivativeSettlementDateFormattedData: any = [];

    this.financialMarketData
      .getDerivativesSettlementDateData(name, this.assetType)
      .subscribe(
        (res: any) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);

          res?.forEach((element: any) => {
            if (this.assetType === 'Futures') {
              derivativeSettlementDateFormattedData.push({
                id: element.identifier,
                text: element.expiryDate,
              });
              this.selectSettlementDate = derivativeSettlementDateFormattedData;
            } else {
              derivativeSettlementDateFormattedData.push({
                id: element.expiryDate,
                text: element.expiryDate,
              });
              this.selectSettlementDate = derivativeSettlementDateFormattedData;
            }
          });
          if (res?.length == 0) {
            this.selectSettlementDate = derivativeSettlementDateFormattedData;
          }
        },
        (err) => {
          console.log('error', err.message);
        }
      );
  }

  getDerivativesOptionsDataHandler(name: any, date: any) {
    let derivativeOptionsFormattedData: any = [];

    this.financialMarketData
      .getDerivativesOptionsData(name, date)
      .subscribe((res: any) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);

        res?.forEach((element: any) => {
          derivativeOptionsFormattedData.push({
            id: element,
            text: element,
          });
        });
        this.selectOptions = derivativeOptionsFormattedData;
      });
  }

  getDerivativesFutureComparableDataHandler(identifier: any) {
    this.financialMarketData
      .getDerivativesFutureComparableData(identifier)
      .subscribe(
        (res: any) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);

          this.comparable_future_data = {
            ...this.comparable_future_data,
            value: res,
          };

          this.showComparableTable = true;
        },
        (err) => {
          console.log('error', err.message);
        }
      );
  }

  getDerivativesStrikePriceDataHandler(name: any, date: any, type: any) {
    let derivativeTypeFormattedData: any = [];

    this.financialMarketData
      .getDerivativesStrikePriceData(name, date, type)
      .subscribe((res: any) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);

        res?.forEach((element: any) => {
          derivativeTypeFormattedData.push({
            id: element[1],
            text: element[0],
          });
        });
        this.selectType = derivativeTypeFormattedData;
      });
  }

  getDerivativesAllDataHandler(identifier: any) {
    this.financialMarketData
      .getDerivativesAllData(identifier)
      .subscribe((res) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);
        this.derivativesAllData = res;
        this.derivativesLatestData = this.derivativesAllData.latestData;
        this.derivativesCurrency = this.derivativesLatestData.currency;
        this.comparable_future_data.title[2].label = `Price (${this.derivativesLatestData.currency})`;
        this.derivativesHistoricalData = this.derivativesAllData.historicalData;

        this.chartData = [];
        if (this.derivativesHistoricalData) {
          this.derivativesHistoricalData.forEach((el: any) => {
            this.chartData.push({
              date: el.period,
              value: el.data?.toFixed(2),
            });
          });
          this.derivativesChart();
        }
      });
  }

  getDerivativesOptionComparableDataHandler(identifier: any) {
    this.financialMarketData
      .getDerivativesOptionComparableData(identifier)
      .subscribe((res) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);
        this.derivatives_table_data.value = res;

        if (res[0].call_latest_settlement) {
          this.showSettlementPrice = true;
        } else {
          this.showSettlementPrice = false;
        }
      });
  }

  valueChangedHandler(type: any, data: any) {
    if (type === 'Name') {
      if (this.selectNameData && this.selectedName !== data) {
        this.selectedName = data;
        this.count_res = 0;
        this.total_count_res = 1;
        this.util.loaderService.display(true);

        this.assetType = this.selectNameData
          .filter((ele: any) => {
            return ele.id === this.selectedName;
          })[0]
          .text.split(' : ')[1];

        if (this.assetType === 'Futures') {
          $('#optionDropdown').css('display', 'none');

          $('#priceDropdown').css('display', 'none');
        } else {
          $('#optionDropdown').css('display', 'block');

          $('#priceDropdown').css('display', 'block');
        }

        this.getDerivativeSettlementDateHandler(this.selectedName);
      }
    } else if (type === 'Settlement Date') {
      if (this.selectSettlementDate && this.selectedSettlementDate !== data) {
        this.selectedSettlementDate = data;

        if (this.assetType === 'Futures') {
          let temp2 = this.selectedSettlementDate
            .replaceAll(':', '%3A')
            .replaceAll('\\', '%5C');

          this.count_res = 0;
          this.total_count_res = 2;
          this.util.loaderService.display(true);

          this.getDerivativesAllDataHandler(temp2);
          this.getDerivativesFutureComparableDataHandler(temp2);

          this.selectedSettlementDate = null;
          this.showFuturesTable = true;
        } else {
          this.count_res = 0;
          this.total_count_res = 1;
          this.util.loaderService.display(true);

          this.getDerivativesOptionsDataHandler(
            this.selectedName,
            this.selectedSettlementDate
          );
        }
      }
    } else if (type === 'Options') {
      if (this.selectOptions && this.selectedOptions !== data) {
        this.selectedOptions = data;
        this.count_res = 0;
        this.total_count_res = 1;
        this.util.loaderService.display(true);

        this.getDerivativesStrikePriceDataHandler(
          this.selectedName,
          this.selectedSettlementDate,
          this.selectedOptions
        );
      }
    } else if (type === 'Strike Price') {
      if (this.selectType && this.selectedType !== data) {
        this.selectedType = data;
        this.count_res = 0;
        this.total_count_res = 2;
        this.util.loaderService.display(true);

        let temp2 = this.selectedType
          .replaceAll(':', '%3A')
          .replaceAll('\\', '%5C');

        this.getDerivativesAllDataHandler(temp2);
        this.getDerivativesOptionComparableDataHandler(temp2);
        this.selectedSettlementDate = '';
        this.selectOptions = [];
        this.selectedOptions = '';
        this.selectType = [];
        this.selectedType = null;
        this.showFuturesTable = false;
      }
    }
  }

  derivativesChart() {
    // Create chart
    am4core.options.commercialLicense = true;
    let chart: any = am4core.create('chartdiv', am4charts.XYChart);
    // $(document).ready(function () {
    //   $('g[aria-labelledby]').hide();
    // });
    chart.tapToActivate = true;
    chart.strokeWidth = 1.5;
    chart.padding(16, 35, 0, -5);
    chart.maskBullets = false;
    chart.preloader.backgroundSlice.fill = am4core.color('#ffc000');
    chart.preloader.background.fill = am4core.color('#00071e');
    chart.preloader.fill = am4core.color('#ffc000');

    chart.data = this.chartData;

    chart.events.on('beforedatavalidated', function (ev: any) {
      // check if there's data
      if (ev.target.data.length === 0) {
        let indicator = chart.tooltipContainer.createChild(am4core.Container);
        let indicatorLabel = indicator.createChild(am4core.Label);
        indicatorLabel.text = 'No Data Available';
        indicatorLabel.isMeasured = false;
        indicatorLabel.x = 300;
        indicatorLabel.y = 70;
        indicatorLabel.fontSize = 12;
        indicatorLabel.fill = am4core.color('#fff');
      }
    });

    chart.dateFormatter.dateFormat = 'dd-MMM-yyyy';

    // Create axes
    let dateAxis: any = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.baseInterval = {
      timeUnit: 'day',
      count: 1,
    };

    dateAxis.dateFormats.setKey('day', 'dd-MM-yy');
    dateAxis.dateFormats.setKey('month', 'MMM yy');
    dateAxis.dateFormats.setKey('week', 'dd-MM-yy');
    dateAxis.periodChangeDateFormats.setKey('day', 'dd-MM-yy');
    dateAxis.periodChangeDateFormats.setKey('month', 'MMM yy');
    dateAxis.periodChangeDateFormats.setKey('week', 'dd-MM-yy');
    dateAxis.renderer.labels.template.fill = am4core.color('#ffc000');
    dateAxis.renderer.line.stroke = am4core.color('#ffc000');
    dateAxis.renderer.line.strokeWidth = 2;
    dateAxis.renderer.line.strokeOpacity = 1;

    let valueAxis: any = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.tooltip.disabled = true;
    valueAxis.renderer.grid.template.strokeOpacity = 0.1;
    dateAxis.renderer.grid.template.strokeOpacity = 0.1;

    dateAxis.maxZoomDeclination = 0;

    valueAxis.tooltip.fontSize = 9;
    dateAxis.tooltip.fontSize = 9;
    dateAxis.startLocation = 0.5;
    dateAxis.endLocation = 0.6;
    /**
     * Adapter to format the tooptip values
     */

    valueAxis.renderer.labels.template.fill = am4core.color('#ffc000');

    valueAxis.renderer.line.stroke = am4core.color('#ffc000');
    valueAxis.renderer.line.strokeWidth = 2;
    valueAxis.renderer.line.strokeOpacity = 1;

    dateAxis.renderer.minGridDistance = 80;
    valueAxis.renderer.fontSize = 12;
    dateAxis.renderer.fontSize = 12;
    valueAxis.renderer.minGridDistance = 40;

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
    series.tooltipText = ' [bold]{valueY}[/]';
    series.fillOpacity = 0.2;
    series.tooltip.getFillFromObject = false;
    series.tooltip.background.cornerRadius = 3;
    series.tooltip.label.fontSize = 9;
    series.tooltip.label.padding(5, 5, 5, 5);
    series.tooltip.pointerOrientation = 'vertical';
    series.tooltip.background.fill = am4core.color('#000000');

    // make a cursor point
    chart.cursor = new am4charts.XYCursor();
    chart.cursor.lineY.disabled = true;
    chart.cursor.snapToSeries = series;

    chart.responsive.enabled = true;
    chart.responsive.useDefault = false;

    dateAxis.keepSelection = true;
  }
}

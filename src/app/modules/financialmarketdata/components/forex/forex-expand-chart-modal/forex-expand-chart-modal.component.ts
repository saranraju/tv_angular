import {
  Component,
  DoCheck,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { FinancialMarketDataService } from 'src/app/services/financialmarketdata.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-forex-expand-chart-modal',
  templateUrl: './forex-expand-chart-modal.component.html',
  styleUrls: ['./forex-expand-chart-modal.component.scss'],
})
export class ForexExpandChartModalComponent implements OnInit, OnChanges {
  @Input() item_Data_list: any;
  @Input() fxview_Data_chart: any;
  @Input() lastCategoryValue: any = '';
  @Input() expandFxViewChartData: any;

  filterFxViewAllData: any = [];
  constructor(
    public auth: AuthService,
    public util: UtilService,
    public financialMarketData: FinancialMarketDataService
  ) {}

  ngOnChanges(): void {
    this.renderGraph(this.expandFxViewChartData, 'chartdivExpand');
  }

  ngOnInit(): void {}

  // ngAfterViewInit() {
  //   this.renderGraph();
  // }

  fxviewDialogClose() {
    this.auth.expandopendfxViewChart = false;
  }
  getFxViewData(e: any) {
    this.financialMarketData.getForexfxView(e).subscribe((res) => {
      this.renderGraph(res, 'chartdiv');
    });
  }
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
    // am4core.options.commercialLicense = true;
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
}

import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { FinancialMarketDataService } from 'src/app/services/financialmarketdata.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-forex-expand-commodity-chart-modal',
  templateUrl: './forex-expand-commodity-chart-modal.component.html',
  styleUrls: ['./forex-expand-commodity-chart-modal.component.scss'],
})
export class ForexExpandCommodityChartModalComponent
  implements OnInit, OnChanges
{
  @Input() expandforexCompanyData: any;
  @Input() expandFxForwardPremiumChart: any;

  filterFxViewAllData: any = [];
  constructor(
    public auth: AuthService,
    public util: UtilService,
    public financialMarketData: FinancialMarketDataService
  ) {}

  ngOnChanges(): void {
    this.lineGraph();
  }

  ngOnInit(): void {}

  fxForwardPremiumDialogClose() {
    this.auth.expandopendFxIceDescChart = false;
    this.auth.expandopendFxForwardPremiumChart = false;
  }

  lineGraph() {
    am4core.useTheme(am4themes_animated);
    am4core.options.commercialLicense = true;
    let chart = am4core.create('chartdivFQExpand', am4charts.XYChart);
    chart.data = this.expandFxForwardPremiumChart;
    // chart.dateFormatter.inputDateFormat = 'dd-MMM-yyyy';
    // Create axes
    let dateAxis: any = chart.xAxes.push(new am4charts.DateAxis());
    // dateAxis.dateFormats.setKey('day', 'MMM yyyy');
    // dateAxis.dateFormats.setKey('month', 'MMM yyyy');
    // dateAxis.dateFormats.setKey('week', 'dd-MM-yy');

    // dateAxis.periodChangeDateFormats.setKey('day', 'dd-MM-yy');
    // dateAxis.periodChangeDateFormats.setKey('month', 'MMM yyyy');
    // dateAxis.periodChangeDateFormats.setKey('week', 'dd-MM-yy');
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
}

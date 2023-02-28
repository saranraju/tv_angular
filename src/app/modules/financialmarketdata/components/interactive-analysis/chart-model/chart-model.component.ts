import { Component, HostListener, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';

import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { UtilService } from 'src/app/services/util.service';

/* Chart code */
// Themes begin
am4core.useTheme(am4themes_animated);
// Themes end

@Component({
  selector: 'app-chart-model',
  templateUrl: './chart-model.component.html',
  styleUrls: ['./chart-model.component.scss'],
})
export class ChartModelComponent implements OnInit {
  @Input() chartModelData: any;
  @Input() chartModelTitle: any;
  @Input() chartModelType: any;
  @Input() selectedCommodity: any;
  @Input() CommodityChartData: any;
  @Input() commodityData: any;
  @Input() selectedPeriod: any;

  chart: any;

  startDate: any;
  selectedDatetype: any;
  today = new Date();
  endDate: any = new Date(
    this.today.getFullYear(),
    this.today.getMonth(),
    this.today.getDate() - 1
  );

  constructor(public auth: AuthService, public util: UtilService) {}

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

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.keyCode === 27) {
      this.auth.openPopupModal = false;
    }
  }

  ngOnInit(): void {
    this.selectedDatetype = this.util.selectedDatetype;

    if (this.chartModelType == 'commodity') {
      this.commodityChart();
    } else if (this.chartModelType == 'forex') {
      this.forexChart();
    } else if (this.chartModelType == 'company') {
      this.companyChart();
    } else if (this.chartModelType == 'companyStock') {
      this.companyStockChart();
    } else if (this.chartModelType == 'economy') {
      this.economyChart();
    } else {
      this.chartRender();
    }
  }

  economyChart() {
    // Create chart instance
    let chart = am4core.create('chartDiv', am4charts.XYChart);
    // $(document).ready(function () {
    //   $('g[aria-labelledby]').hide();
    // });
    // Create axes
    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    // dateAxis.renderer.minGridDistance = 50;
    dateAxis.renderer.line.strokeOpacity = 1;
    dateAxis.renderer.line.strokeWidth = 2;
    dateAxis.renderer.line.stroke = am4core.color('#ffc000');
    dateAxis.renderer.labels.template.fill = am4core.color('#ffc000');
    dateAxis.renderer.labels.template.fontSize = 12;

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.line.strokeOpacity = 1;
    valueAxis.renderer.line.strokeWidth = 2;
    valueAxis.renderer.line.stroke = am4core.color('#ffc000');
    valueAxis.renderer.labels.template.fill = am4core.color('#ffc000');
    valueAxis.renderer.labels.template.fontSize = 12;
    valueAxis.numberFormatter = new am4core.NumberFormatter();
    valueAxis.numberFormatter.numberFormat = '#.0a';

    this.chartModelData.forEach((element: any, index: any) => {
      if (element[0]?.periodType === 'Daily') {
        dateAxis.renderer.minGridDistance = 90;

        dateAxis.dateFormats.setKey('day', 'dd-MM-yy');
        dateAxis.dateFormats.setKey('month', 'MMM yyyy');
        dateAxis.dateFormats.setKey('week', 'dd MMM');

        dateAxis.periodChangeDateFormats.setKey('day', 'dd-MM-yy');
        dateAxis.periodChangeDateFormats.setKey('month', 'MMM yyyy');
        dateAxis.periodChangeDateFormats.setKey('week', 'dd MMM');
      } else {
        dateAxis.tooltipDateFormat = 'MMM yyyy';

        dateAxis.dateFormats.setKey('month', 'MMM yyyy');
        dateAxis.dateFormats.setKey('week', 'dd MMM');

        dateAxis.periodChangeDateFormats.setKey('month', 'MMM yyyy');
        dateAxis.periodChangeDateFormats.setKey('week', 'dd MMM');
      }
      if (element[0]?.periodType === 'Yearly') {
        dateAxis.tooltipDateFormat = 'yyyy';
      }

      // Create series
      let series = chart.series.push(new am4charts.LineSeries());
      series.dataFields.valueY = 'value';
      series.dataFields.dateX = 'date';
      series.strokeWidth = 2;
      series.stroke = am4core.color(this.colorList[index]);
      series.fill = am4core.color(this.colorList[index]);
      series.minBulletDistance = 10;
      (series.tooltip as any).label.fontSize = 12;

      let self = this;
      series.adapter.add('tooltipHTML', function (html: any, target: any) {
        let data, country;
        if (target.tooltipDataItem.dataContext) {
          data = target.tooltipDataItem.dataContext.value;
          country = target.tooltipDataItem.dataContext.country;
          let formattedPrice = self.util.standardFormat(data, 2, '');
          let customHtml = '<p style="text-align: center' + data + '</p>';
          customHtml = country + ' : ' + formattedPrice;

          return customHtml;
        }
        return html;
      });

      (series?.tooltip as any).pointerOrientation = 'vertical';
      series.data = element;
    });

    chart.events.on('beforedatavalidated', (ev: any) => {
      if (this.chartModelData.length === 0) {
        let indicator = (chart.tooltipContainer as any).createChild(
          am4core.Container
        );
        let indicatorLabel = indicator.createChild(am4core.Label);
        indicatorLabel.text = 'No Data Available';
        indicatorLabel.isMeasured = false;
        indicatorLabel.x = 620;
        indicatorLabel.y = 235;
        indicatorLabel.fontSize = 14;
        indicatorLabel.fill = am4core.color('#fff');
      }
    });

    // Add cursor
    chart.cursor = new am4charts.XYCursor();
    chart.cursor.xAxis = dateAxis;
  }

  chartRender() {
    // Create chart instance
    let chart = am4core.create('chartDiv', am4charts.XYChart);
    // $(document).ready(function () {
    //   $('g[aria-labelledby]').hide();
    // });
    // Create axes
    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    // dateAxis.renderer.minGridDistance = 50;
    dateAxis.renderer.line.strokeOpacity = 1;
    dateAxis.renderer.line.strokeWidth = 2;
    dateAxis.renderer.line.stroke = am4core.color('#ffc000');
    dateAxis.renderer.labels.template.fill = am4core.color('#ffc000');
    dateAxis.renderer.labels.template.fontSize = 12;

    if (this.chartModelType == 'industryWise' || 'countryWise') {
      if (this.selectedPeriod == 'YEARLY') {
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
    } else if (this.chartModelType == 'economy') {
      dateAxis.dateFormats.setKey('day', 'dd-MM-yy');
      dateAxis.dateFormats.setKey('month', 'MMM yyyy');
      dateAxis.dateFormats.setKey('week', 'dd-MM-yy');
      dateAxis.periodChangeDateFormats.setKey('day', 'dd-MM-yy');
      dateAxis.periodChangeDateFormats.setKey('month', 'MMM yyyy');
      dateAxis.periodChangeDateFormats.setKey('week', 'dd-MM-yy');
    }
    dateAxis.skipEmptyPeriods = true;

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.line.strokeOpacity = 1;
    valueAxis.renderer.line.strokeWidth = 2;
    valueAxis.renderer.line.stroke = am4core.color('#ffc000');
    valueAxis.renderer.labels.template.fill = am4core.color('#ffc000');
    valueAxis.renderer.labels.template.fontSize = 12;
    valueAxis.numberFormatter = new am4core.NumberFormatter();
    valueAxis.numberFormatter.numberFormat = '#.0a';

    this.chartModelData.forEach((element: any, index: any) => {
      // Create series
      let series = chart.series.push(new am4charts.LineSeries());
      series.dataFields.valueY = 'value';
      series.dataFields.dateX = 'date';
      series.strokeWidth = 2;
      series.stroke = am4core.color(this.colorList[index]);
      series.fill = am4core.color(this.colorList[index]);
      series.minBulletDistance = 10;
      (series.tooltip as any).label.fontSize = 12;

      if (this.chartModelType == 'countryWise') {
        let self = this;
        series.adapter.add('tooltipHTML', function (html: any, target: any) {
          let data, ticsIndustryName;
          if (target.tooltipDataItem.dataContext) {
            data = target.tooltipDataItem.dataContext.value;
            ticsIndustryName =
              target.tooltipDataItem.dataContext.ticsIndustryName;
            let formattedPrice = self.util.standardFormat(data, 2, '');
            let customHtml = '<p style="text-align: center' + data + '</p>';
            customHtml = ticsIndustryName + ' : ' + formattedPrice;

            return customHtml;
          }
          return html;
        });
      } else if (this.chartModelType == 'industryWise') {
        let self = this;
        series.adapter.add('tooltipHTML', function (html: any, target: any) {
          let data, countryName;
          if (target.tooltipDataItem.dataContext) {
            data = target.tooltipDataItem.dataContext.value;
            countryName = target.tooltipDataItem.dataContext.countryName;
            let formattedPrice = self.util.standardFormat(data, 2, '');
            let customHtml = '<p style="text-align: center' + data + '</p>';
            customHtml = countryName + ' : ' + formattedPrice;

            return customHtml;
          }
          return html;
        });
      } else if (this.chartModelType == 'economy') {
        let self = this;
        series.adapter.add('tooltipHTML', function (html: any, target: any) {
          let data, country;
          if (target.tooltipDataItem.dataContext) {
            data = target.tooltipDataItem.dataContext.value;
            country = target.tooltipDataItem.dataContext.country;
            let formattedPrice = self.util.standardFormat(data, 2, '');
            let customHtml = '<p style="text-align: center' + data + '</p>';
            customHtml = country + ' : ' + formattedPrice;

            return customHtml;
          }
          return html;
        });
      }

      (series?.tooltip as any).pointerOrientation = 'vertical';
      series.data = element;
    });

    chart.events.on('beforedatavalidated', (ev: any) => {
      if (this.chartModelData.length === 0) {
        let indicator = (chart.tooltipContainer as any).createChild(
          am4core.Container
        );
        let indicatorLabel = indicator.createChild(am4core.Label);
        indicatorLabel.text = 'No Data Available';
        indicatorLabel.isMeasured = false;
        indicatorLabel.x = 620;
        indicatorLabel.y = 235;
        indicatorLabel.fontSize = 14;
        indicatorLabel.fill = am4core.color('#fff');
      }
    });

    // Add cursor
    chart.cursor = new am4charts.XYCursor();
    chart.cursor.xAxis = dateAxis;
  }

  forexChart() {
    // Create chart instance
    let chart = am4core.create('chartDiv', am4charts.XYChart);
    // $(document).ready(function () {
    //   $('g[aria-labelledby]').hide();
    // });

    // Create axes
    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.minGridDistance = 70;
    dateAxis.renderer.line.strokeOpacity = 1;
    dateAxis.renderer.line.strokeWidth = 2;
    dateAxis.renderer.line.stroke = am4core.color('#ffc000');
    dateAxis.renderer.labels.template.fill = am4core.color('#ffc000');
    dateAxis.renderer.labels.template.fontSize = 12;
    dateAxis.dateFormats.setKey('day', 'dd-MM-yy');
    dateAxis.dateFormats.setKey('month', 'MMM yyyy');
    dateAxis.dateFormats.setKey('week', 'dd-MM-yy');
    dateAxis.periodChangeDateFormats.setKey('day', 'dd-MM-yy');
    dateAxis.periodChangeDateFormats.setKey('month', 'MMM yyyy');
    dateAxis.periodChangeDateFormats.setKey('week', 'dd-MM-yy');
    dateAxis.skipEmptyPeriods = true;

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.line.strokeOpacity = 1;
    valueAxis.renderer.line.strokeWidth = 2;
    valueAxis.renderer.line.stroke = am4core.color('#ffc000');
    valueAxis.renderer.labels.template.fill = am4core.color('#ffc000');
    valueAxis.renderer.labels.template.fontSize = 12;
    valueAxis.numberFormatter = new am4core.NumberFormatter();
    valueAxis.numberFormatter.numberFormat = '#.0a';

    this.chartModelData.forEach((element: any, index: any) => {
      // Create series
      let series = chart.series.push(new am4charts.LineSeries());
      series.dataFields.valueY = 'data';
      series.dataFields.dateX = 'period';
      series.strokeWidth = 2;
      series.stroke = am4core.color(this.colorList[index]);
      series.fill = am4core.color(this.colorList[index]);
      series.minBulletDistance = 10;
      (series.tooltip as any).label.fontSize = 12;
      series.data = element;
      let self = this;
      series.adapter.add('tooltipHTML', function (html: any, target: any) {
        let data, targetCurrencyName;
        if (target.tooltipDataItem.dataContext) {
          data = target.tooltipDataItem.dataContext.data;
          targetCurrencyName =
            target.tooltipDataItem.dataContext.targetCurrencyName;
          let formattedPrice = self.util.standardFormat(data, 2, '');
          let customHtml = '<p style="text-align: center' + data + '</p>';
          customHtml = targetCurrencyName + ' : ' + formattedPrice;

          return customHtml;
        }
        return html;
      });
    });

    chart.events.on('beforedatavalidated', (ev: any) => {
      if (this.chartModelData.length === 0) {
        let indicator = (chart.tooltipContainer as any).createChild(
          am4core.Container
        );
        let indicatorLabel = indicator.createChild(am4core.Label);
        indicatorLabel.text = 'No Data Available';
        indicatorLabel.isMeasured = false;
        indicatorLabel.x = 620;
        indicatorLabel.y = 235;
        indicatorLabel.fontSize = 14;
        indicatorLabel.fill = am4core.color('#fff');
      }
    });

    // Add cursor
    chart.cursor = new am4charts.XYCursor();
    chart.cursor.xAxis = dateAxis;
  }

  companyChart() {
    let isVRDailyLocal: any;
    if (this.chartModelData) {
      isVRDailyLocal = this.chartModelData[0][0][0]?.isVRDaily;
    }
    // Create chart instance
    let chart = am4core.create('chartDiv', am4charts.XYChart);
    // $(document).ready(function () {
    //   $('g[aria-labelledby]').hide();
    // });
    // Create axes
    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.line.strokeOpacity = 1;
    dateAxis.renderer.line.strokeWidth = 2;
    dateAxis.renderer.line.stroke = am4core.color('#ffc000');
    dateAxis.renderer.labels.template.fill = am4core.color('#ffc000');
    dateAxis.renderer.labels.template.fontSize = 12;
    if (isVRDailyLocal) {
      dateAxis.tooltipDateFormat = 'dd-MM-yyyy';

      dateAxis.dateFormats.setKey('day', 'dd-MM-yy');
      dateAxis.dateFormats.setKey('month', 'MMM yyyy');
      dateAxis.dateFormats.setKey('week', 'dd-MM-yy');

      dateAxis.periodChangeDateFormats.setKey('day', 'dd-MM-yy');
      dateAxis.periodChangeDateFormats.setKey('month', 'MMM yyyy');
      dateAxis.periodChangeDateFormats.setKey('week', 'dd-MM-yy');
    } else {
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
      dateAxis.skipEmptyPeriods = true;
    }

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.line.strokeOpacity = 1;
    valueAxis.renderer.line.strokeWidth = 2;
    valueAxis.renderer.line.stroke = am4core.color('#ffc000');
    valueAxis.renderer.labels.template.fill = am4core.color('#ffc000');
    valueAxis.renderer.labels.template.fontSize = 12;
    valueAxis.numberFormatter = new am4core.NumberFormatter();
    valueAxis.numberFormatter.numberFormat = '#.0a';

    this.chartModelData.forEach((element: any, index: any) => {
      element.forEach((element: any) => {
        // Create series
        let series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.valueY = 'value';
        series.dataFields.dateX = 'date';
        series.strokeWidth = 2;
        series.stroke = am4core.color(this.colorList[index]);
        series.fill = am4core.color(this.colorList[index]);
        series.minBulletDistance = 10;
        (series.tooltip as any).label.fontSize = 12;
        let self = this;
        series.adapter.add('tooltipHTML', function (html: any, target: any) {
          let data, company;
          if (target.tooltipDataItem.dataContext) {
            data = target.tooltipDataItem.dataContext.value;
            company = target.tooltipDataItem.dataContext.company;
            let formattedPrice = self.util.standardFormat(data, 2, '');
            let customHtml =
              '<p style="text-align: center' + company + data + '</p>';
            customHtml = formattedPrice;

            return company + ' : ' + customHtml;
          }
          return html;
        });

        (series?.tooltip as any).pointerOrientation = 'vertical';
        series.data = element;
      });
    });

    chart.events.on('beforedatavalidated', (ev: any) => {
      if (this.chartModelData.length === 0) {
        let indicator = (chart.tooltipContainer as any).createChild(
          am4core.Container
        );
        let indicatorLabel = indicator.createChild(am4core.Label);
        indicatorLabel.text = 'No Data Available';
        indicatorLabel.isMeasured = false;
        indicatorLabel.x = 620;
        indicatorLabel.y = 235;
        indicatorLabel.fontSize = 14;
        indicatorLabel.fill = am4core.color('#fff');
      }
    });

    // Add cursor
    chart.cursor = new am4charts.XYCursor();
    chart.cursor.xAxis = dateAxis;
  }

  companyStockChart() {
    // Create chart instance
    let chart = am4core.create('chartDiv', am4charts.XYChart);
    // $(document).ready(function () {
    //   $('g[aria-labelledby]').hide();
    // });
    // Create axes
    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.line.strokeOpacity = 1;
    dateAxis.renderer.line.strokeWidth = 2;
    dateAxis.renderer.line.stroke = am4core.color('#ffc000');
    dateAxis.renderer.labels.template.fill = am4core.color('#ffc000');
    dateAxis.renderer.labels.template.fontSize = 12;
    dateAxis.tooltipDateFormat = 'dd-MM-yyyy';
    dateAxis.dateFormats.setKey('day', 'dd-MM-yy');
    dateAxis.dateFormats.setKey('month', 'MMM yyyy');
    dateAxis.dateFormats.setKey('week', 'dd-MM-yy');
    dateAxis.periodChangeDateFormats.setKey('day', 'dd-MM-yy');
    dateAxis.periodChangeDateFormats.setKey('month', 'MMM yyyy');
    dateAxis.periodChangeDateFormats.setKey('week', 'dd-MM-yy');

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.line.strokeOpacity = 1;
    valueAxis.renderer.line.strokeWidth = 2;
    valueAxis.renderer.line.stroke = am4core.color('#ffc000');
    valueAxis.renderer.labels.template.fill = am4core.color('#ffc000');
    valueAxis.renderer.labels.template.fontSize = 12;
    valueAxis.numberFormatter = new am4core.NumberFormatter();
    valueAxis.numberFormatter.numberFormat = '#.0a';

    this.chartModelData.forEach((x: any, index: any) => {
      x.forEach((element: any) => {
        // Create series
        let series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.valueY = 'value';
        series.dataFields.dateX = 'date';
        series.strokeWidth = 2;
        series.stroke = am4core.color(this.colorList[index]);
        series.fill = am4core.color(this.colorList[index]);
        series.minBulletDistance = 10;
        series.tooltipText = `[bold]{company} : {value}`;
        (series.tooltip as any).label.fontSize = 12;
        // let self = this;
        // series.adapter.add('tooltipHTML', function (html: any, target: any) {
        //   let data, company;
        //   if (target.tooltipDataItem.dataContext) {
        //     data = target.tooltipDataItem.dataContext.value;
        //     company = target.tooltipDataItem.dataContext.company;
        //     let formattedPrice = self.util.standardFormat(data, 2, '');
        //     let customHtml =
        //       '<p style="text-align: center' + company + data + '</p>';
        //     customHtml = formattedPrice;

        //     return company + ' : ' + customHtml;
        //   }
        //   return html;
        // });

        (series?.tooltip as any).pointerOrientation = 'vertical';
        series.data = element;
      });
    });

    chart.events.on('beforedatavalidated', (ev: any) => {
      if (this.chartModelData.length === 0) {
        let indicator = (chart.tooltipContainer as any).createChild(
          am4core.Container
        );
        let indicatorLabel = indicator.createChild(am4core.Label);
        indicatorLabel.text = 'No Data Available';
        indicatorLabel.isMeasured = false;
        indicatorLabel.x = 620;
        indicatorLabel.y = 235;
        indicatorLabel.fontSize = 14;
        indicatorLabel.fill = am4core.color('#fff');
      }
    });

    // Add cursor
    chart.cursor = new am4charts.XYCursor();
    chart.cursor.xAxis = dateAxis;
  }

  commodityChart() {
    this.chart = am4core.create('chartDiv', am4charts.XYChart);

    // Create axes
    let dateAxis = this.chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.minGridDistance = 90;
    dateAxis.renderer.line.strokeOpacity = 1;
    dateAxis.renderer.line.strokeWidth = 2;
    dateAxis.renderer.line.stroke = am4core.color('#ffc000');
    dateAxis.renderer.labels.template.fill = am4core.color('#ffc000');
    dateAxis.renderer.labels.template.fontSize = 12;
    // dateAxis.skipEmptyPeriods = true;
    dateAxis.tooltipDateFormat = 'dd-MM-yyyy';
    dateAxis.dateFormats.setKey('day', 'dd-MM-yy');
    dateAxis.dateFormats.setKey('month', 'MMM yyyy');
    dateAxis.dateFormats.setKey('week', 'dd MMM');
    dateAxis.periodChangeDateFormats.setKey('day', 'dd-MM-yy');
    dateAxis.periodChangeDateFormats.setKey('month', 'MMM yyyy');
    dateAxis.periodChangeDateFormats.setKey('week', 'dd MMM');

    let valueAxis = this.chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.line.strokeOpacity = 1;
    valueAxis.renderer.line.strokeWidth = 2;
    valueAxis.renderer.line.stroke = am4core.color('#ffc000');
    valueAxis.renderer.labels.template.fill = am4core.color('#ffc000');
    valueAxis.renderer.labels.template.fontSize = 12;
    valueAxis.numberFormatter = new am4core.NumberFormatter();
    valueAxis.numberFormatter.numberFormat = '#.0a';

    this.chart.data = [];
    let forCheck: any = [];

    this.selectedCommodity.forEach((element: any, index: any) => {
      if (element.customLableCheck) {
        this.chart.data = this.CommodityChartData.filter(
          (elem: any) => elem.name === element.name
        );
        forCheck.push(this.chart.data);

        // Create series
        let series = this.chart.series.push(new am4charts.LineSeries());
        series.dataFields.valueY = 'value';
        series.dataFields.dateX = 'date';
        series.strokeWidth = 2;
        series.stroke = am4core.color(this.colorList[index]);
        series.fill = am4core.color(this.colorList[index]);
        series.minBulletDistance = 10;
        (series.tooltip as any).label.fontSize = 12;
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
      }
    });

    this.chart.events.on('beforedatavalidated', (ev: any) => {
      if (ev.target.data.length === 0) {
        let indicator = (this.chart.tooltipContainer as any).createChild(
          am4core.Container
        );
        let indicatorLabel = indicator.createChild(am4core.Label);
        indicatorLabel.text = 'No Data Available';
        indicatorLabel.isMeasured = false;
        indicatorLabel.x = 620;
        indicatorLabel.y = 120;
        indicatorLabel.fontSize = 14;
        indicatorLabel.fill = am4core.color('#fff');
      }
    });

    // Add cursor
    this.chart.cursor = new am4charts.XYCursor();
    this.chart.cursor.xAxis = dateAxis;
  }

  dateChange(type: any) {
    this.selectedDatetype = type;
    if (type) {
      let temp: any = [];
      this.setDateHandler(type);
      this.selectedCommodity.forEach((element: any) => {
        let endDate =
          this.commodityData.commodityDataMap[element.symbol][
            this.commodityData.commodityDataMap[element.symbol].length - 1
          ].period;
        this.endDate = new Date(endDate);
        let filterRangeData: any = this.commodityData.commodityDataMap[
          element.symbol
        ].filter((el: any) => {
          return new Date(el.period) > this.startDate ? el : '';
        });
        filterRangeData.forEach((el: any) => {
          temp.push({
            date: el.period,
            value: el.close?.toFixed(2),
            name: el.name,
          });
        });
      });
      this.CommodityChartData = temp;
      this.commodityChart();
    }
  }

  setDateHandler(key: any) {
    this.selectedDatetype = key;
    let end_date = this.endDate;
    switch (key) {
      case '1W':
        this.startDate = new Date(
          end_date.getFullYear(),
          end_date.getMonth(),
          end_date.getDate() - 8
        );
        break;
      case '1M':
        this.startDate = new Date(
          end_date.getFullYear(),
          end_date.getMonth() - 1,
          end_date.getDate() - 1
        );
        break;
      case '3M':
        this.startDate = new Date(
          end_date.getFullYear(),
          end_date.getMonth() - 3,
          end_date.getDate() - 1
        );
        break;
      case '6M':
        this.startDate = new Date(
          end_date.getFullYear(),
          end_date.getMonth() - 6,
          end_date.getDate() - 1
        );
        break;
      case '1Y':
        this.startDate = new Date(
          end_date.getFullYear() - 1,
          end_date.getMonth(),
          end_date.getDate() - 1
        );
        break;
      case '5Y':
        this.startDate = new Date(
          end_date.getFullYear() - 5,
          end_date.getMonth(),
          end_date.getDate() - 1
        );
        break;
      case '10Y':
        this.startDate = new Date(
          end_date.getFullYear() - 10,
          end_date.getMonth(),
          end_date.getDate() - 1
        );
        break;
      case 'MAX':
        this.startDate = '';
        break;
      default:
    }
  }
}

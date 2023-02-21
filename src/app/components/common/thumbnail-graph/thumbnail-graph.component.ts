import { Component, Input, OnInit } from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import am4themes_microchart from '@amcharts/amcharts4/themes/microchart';
import am4themes_material from '@amcharts/amcharts4/themes/material';
@Component({
  selector: 'app-thumbnail-graph',
  templateUrl: './thumbnail-graph.component.html',
  styleUrls: ['./thumbnail-graph.component.scss'],
})
export class ThumbnailGraphComponent implements OnInit {
  @Input() data: any;
  @Input() ind: any;
  constructor() {}
  inputdata: any = [];
  formattedInputData: any = [];
  key: any;

  ngOnInit(): void {
    this.sparkLines();
  }

  sparkLines() {
    this.inputdata = Object.keys(this.data);
    this.inputdata.forEach((element: any) => {
      this.key = element;
      if (typeof this.data[this.key] === 'number') {
        if (this.data)
          this.formattedInputData.push({
            date: this.key,
            value: this.data[this.key],
          });
      }
    });
    this.svgGraph(this.formattedInputData, this.data);
  }

  svgGraph(inputdata: any, data: any) {
    am4core.useTheme(am4themes_microchart);

    // Cretae chart
    var chartTrend = am4core.create(`${data.fieldName}`, am4charts.XYChart);

    chartTrend.maskBullets = false;

    // Axes
    chartTrend.xAxes.push(new am4charts.DateAxis());
    chartTrend.yAxes.push(new am4charts.ValueAxis());

    // Series
    var seriesTrend = chartTrend.series.push(new am4charts.LineSeries());
    seriesTrend.tooltipText = '{date}: [bold]{value}';
    seriesTrend.dataFields.dateX = 'date';
    seriesTrend.dataFields.valueY = 'value';

    processNextChart();

    // Generates next chart
    function processNextChart() {
      var newData = inputdata;

      if (newData.length) {
        seriesTrend.data = newData;
        seriesTrend.data[seriesTrend.data.length - 1].disabled = false;
        chartTrend.strokeWidth = 2;
        chartTrend.chartContainer.minHeight = 23;
        chartTrend.chartContainer.minWidth = 50;
        seriesTrend.events.once('dataitemsvalidated', createImage);
      } else {
        chartTrend.dispose();
      }
    }

    function createImage() {
      var invalidSprites = am4core.registry.invalidSprites[chartTrend.uid];
      if (invalidSprites && invalidSprites.length) {
        am4core.registry.events.once('exitframe', createImage);
      } else {
        am4core.registry.events.once('exitframe', image1);
      }
    }
    function image1() {
      var target = chartTrend.chartAndLegendContainer;
      chartTrend.responsive.enabled = true;

      var svg = chartTrend.exporting.normalizeSVG(
        chartTrend.exporting.serializeElement(target.dom),
        {},
        target.pixelWidth,
        target.pixelHeight,
        1
      );
      if (document.getElementById('sparklines') != null) {
        var div: any = document.getElementById('sparklines');
        div.innerHTML += svg;
      }
    }
    am4core.unuseTheme(am4themes_microchart);
    am4core.useTheme(am4themes_animated);
  }
}

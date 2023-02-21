import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { UtilService } from 'src/app/services/util.service';
import { LoaderServiceService } from '../../loader-service.service';
@Component({
  selector: 'app-industry-chart',
  templateUrl: './industry-chart.component.html',
  styleUrls: ['./industry-chart.component.scss'],
})
export class IndustryChartComponent implements OnInit, OnDestroy {
  unitMCap: any = '';
  currencyMcap: any = '';
  unitSales: any = '';
  currencySales: any = '';
  unitNetIncome: any = '';
  currencyNetIncome: any = '';
  market_date: any = '';
  unitRoE: any = '';
  unitRoA: any = '';
  unitPBT: any = '';
  // m_cap_data:any = [];
  sales_data: any = [];
  net_income: any = [];
  equity_data: any = [];
  asset_data: any = [];
  pbt_argin: any = [];
  data_element: any = '';
  l_graph_currency: any;
  l_graph_unit: any;
  count_res: any = 0;
  total_count_res: any = '';
  chart: any;
  chartData: any = [
    {
      date: '2020-01-01',
      value: 10000,
    },
    {
      date: '2021-01-01',
      value: 20000,
    },
    {
      date: '2022-01-01',
      value: 30000,
    },
    {
      date: '2023-01-01',
      value: 40000,
    },
    {
      date: '2024-01-01',
      value: 50000,
    },
  ];
  @Input() graphAllData: any;
  @Input() graphThirdLevelData: any;
  @Input() m_cap_data: any;
  @Input() graph_currency: any;
  @Input() graph_unit: any;
  @Input() period_type: any;
  graphColumnData: any = {};

  constructor(
    public auth: AuthService,
    public util: UtilService,
    public loaderService: LoaderServiceService
  ) {
    this.graphColumnData = this.graphAllData || this.graphThirdLevelData;
    this.m_cap_data = this.m_cap_data;
  }

  ngOnInit(): void {
    // this.loaderService.display(true);
    // this.count_res = 0;
    // this.total_count_res = 1;
    this.l_graph_currency = this.graph_currency;
    this.l_graph_unit = this.graph_unit;
    this.graphColumnData = this.graphAllData || this.graphThirdLevelData;
    // console.log("this.graphColumnData", this.graphThirdLevelData)
    console.log('83---', this.period_type);
    this.m_cap_data = this.m_cap_data;
    this.IndustryChart();
  }
  ngOnDestroy(): void {
    am4core.disposeAllCharts();
  }

  IndustryChart() {
    setTimeout(() => {
      this.chart = {};
      // console.log(this.period_type, '76-----');

      // Create chart
      am4core.options.commercialLicense = true;
      var newArray = [
        'chartdiv',
        'chartdiv2',
        'chartdiv3',
        'chartdiv4',
        'chartdiv5',
        'chartdiv6',
      ];
      newArray.forEach((val: any) => {
        this.chart = am4core.create(val, am4charts.XYChart);
        // $(document).ready(function () {
        //   $('g[aria-labelledby]').hide();
        // });
        this.chart.tapToActivate = true;

        this.chart.padding(16, 35, 0, -5);
        this.chart.maskBullets = false;
        this.chart.preloader.backgroundSlice.fill = am4core.color('#ffc000');
        this.chart.preloader.background.fill = am4core.color('#00071e');
        this.chart.preloader.fill = am4core.color('#ffc000');
        //set data
        switch (val) {
          case 'chartdiv':
            this.chartData = this.graphColumnData.m_cap_data;
            break;
          case 'chartdiv2':
            this.chartData = this.graphColumnData.sales_data;
            break;
          case 'chartdiv3':
            this.chartData = this.graphColumnData.net_income;
            break;
          case 'chartdiv4':
            this.chartData = this.graphColumnData.roe_data;
            break;
          case 'chartdiv5':
            this.chartData = this.graphColumnData.roa_data;
            break;
          case 'chartdiv6':
            this.chartData = this.graphColumnData.pbt_data;
        }
        this.chart.data = this.chartData;
        if (this.chartData.length == 0) {
          let label = this.chart.createChild(am4core.Label);
          label.text = 'No Data Available';
          label.fill = am4core.color('#FFFFFF');
          label.fontSize = 11;
          label.horizontalCenter = 'middle';
          label.fontFamily = 'Lucida Sans Unicode';
          label.isMeasured = false;
          label.x = am4core.percent(50);
          label.y = am4core.percent(30);
        }
        if (this.period_type == 'YEARLY') {
          this.chart.dateFormatter.dateFormat = 'yyyy';
        } else {
          this.chart.dateFormatter.dateFormat = 'MMM-yyyy';
        }
        // Create axes
        let dateAxis: any = this.chart.xAxes.push(new am4charts.DateAxis());
        // dateAxis.baseInterval = {
        //   timeUnit: 'year',
        //   count: 1,
        // };
        // if(typeDte = "Yearly"){
        //   dateAxis.dateFormats.setKey('year', 'yyyy');
        //   dateAxis.periodChangeDateFormats.setKey('year', 'yyyy');
        // }else {
        // dateAxis.dateFormats.setKey('year', 'yyyy');
        // dateAxis.periodChangeDateFormats.setKey('year', 'yyyy');
        // }
        if (this.period_type == 'YEARLY') {
          dateAxis.dateFormats.setKey('year', 'yyyy');
          dateAxis.periodChangeDateFormats.setKey('year', 'yyyy');
        } else {
          dateAxis.dateFormats.setKey('month', 'MMM-yyyy');
          dateAxis.periodChangeDateFormats.setKey('month', 'MMM-yyyy');
        }
        dateAxis.renderer.labels.template.fill = am4core.color('#ffc000');
        dateAxis.renderer.line.stroke = am4core.color('#ffc000');
        dateAxis.renderer.line.strokeWidth = 2;
        dateAxis.renderer.line.strokeOpacity = 1;

        let valueAxis: any = this.chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.tooltip.disabled = true;
        valueAxis.renderer.grid.template.strokeOpacity = 0.1;
        dateAxis.renderer.grid.template.strokeOpacity = 0.1;

        dateAxis.maxZoomDeclination = 0;

        valueAxis.tooltip.fontSize = 9;
        dateAxis.tooltip.fontSize = 9;

        // valueAxis.title.text = 'Unique visitors';

        /**
         * Adapter to format the tooptip values
         */

        valueAxis.renderer.labels.template.fill = am4core.color('#ffc000');

        valueAxis.renderer.line.stroke = am4core.color('#ffc000');
        valueAxis.renderer.line.strokeWidth = 2;
        valueAxis.renderer.line.strokeOpacity = 1;

        if (this.period_type === 'YEARLY') {
          dateAxis.renderer.minGridDistance = 60;
          dateAxis.startLocation = 0.5;
          dateAxis.endLocation = 0.5;
          dateAxis.renderer.fontSize = 12;
        } else {
          dateAxis.renderer.minGridDistance = 60;
          dateAxis.baseInterval = {
            timeUnit: 'month',
            count: 1,
          };
          dateAxis.skipEmptyPeriods = true;
          dateAxis.startLocation = 0.5;
          dateAxis.endLocation = 0.5;
          dateAxis.renderer.fontSize = 12;
          dateAxis.renderer.labels.template.location = 0.5;
        }

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
              return this.util.standardFormat(
                Number(target.dataItem.value),
                2,
                ''
              );
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

        //creat series
        let series: any = this.chart.series.push(new am4charts.LineSeries());
        series.dataFields.dateX = 'date';
        series.dataFields.valueY = 'value';
        series.tooltipText = '[bold]{value}[/]';
        series.fillOpacity = 0.3;
        series.tooltip.getFillFromObject = false;
        series.tooltip.background.cornerRadius = 3;
        series.tooltip.label.fontSize = 9;
        series.tooltip.label.padding(5, 5, 5, 5);
        series.tooltip.pointerOrientation = 'vertical';
        series.tooltip.background.fill = am4core.color('#000000');
        let fillModifier = new am4core.LinearGradientModifier();
        fillModifier.opacities = [1, 0];
        fillModifier.offsets = [0, 0.6];
        fillModifier.gradient.rotation = 90;
        series.segments.template.fillModifier = fillModifier;
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
        this.chart.cursor = new am4charts.XYCursor();
        this.chart.cursor.lineY.disabled = true;
        this.chart.cursor.snapToSeries = series;

        this.chart.responsive.enabled = true;
        this.chart.responsive.useDefault = false;
      });
      // chart.paddingRight = 20;

      // dateAxis.start = 0.8;
      // dateAxis.keepSelection = true;/
      ++this.count_res;
      this.util.checkCountValue(this.total_count_res, this.count_res);
    }, 10);
  }
}

import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  OnChanges,
} from '@angular/core';

import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

/* Chart code */
// Themes begin
am4core.useTheme(am4themes_animated);
// Themes end
@Component({
  selector: 'app-chart-modal',
  templateUrl: './chart-modal.component.html',
  styleUrls: ['./chart-modal.component.scss'],
})
export class ChartModalComponent implements OnInit, OnChanges {
  globalPieChart: any;

  @Input() chartModalTitle: any;
  @Input() fundingSectorChartData: any;
  @Input() selectedPEVCCurrency: any;
  @Input() chartDataAvailableGlobalSectorPEVC: any;
  @Output() closeChartModal = new EventEmitter<any>();

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(): void {
    if (this.fundingSectorChartData) {
      this.sectorFundsChart();
    }
  }

  handleChartModalClick() {
    this.closeChartModal.emit(true);
  }

  sectorFundsChart() {
    setTimeout(() => {
      this.globalPieChart = am4core.create(
        'fundsSectorPieChartDiv',
        am4charts.PieChart
      );
      // $(document).ready(function () {
      //   $('g[aria-labelledby]').hide();
      // });
      am4core.options.commercialLicense = true;

      this.fundingSectorChartData = this.fundingSectorChartData.filter(
        (el: any) => el.amount !== undefined
      );

      this.globalPieChart.data = this.fundingSectorChartData;

      this.globalPieChart.events.on('beforedatavalidated', (ev: any) => {
        // check if there's data
        if (
          ev.target.data.length === 0 &&
          this.chartDataAvailableGlobalSectorPEVC
        ) {
          let indicator = this.globalPieChart.tooltipContainer.createChild(
            am4core.Container
          );
          let indicatorLabel = indicator.createChild(am4core.Label);
          indicatorLabel.text = 'No Data Available';
          indicatorLabel.isMeasured = false;
          indicatorLabel.x = 660;
          indicatorLabel.y = 220;
          indicatorLabel.fontSize = 14;
          indicatorLabel.fill = am4core.color('#ffc000');
        }
      });

      this.globalPieChart.numberFormatter.numberFormat = '#,###.##';

      // Add and configure Series
      let pieSeries = this.globalPieChart.series.push(
        new am4charts.PieSeries()
      );

      pieSeries.dataFields.value = 'amount';
      pieSeries.dataFields.category = 'name';
      pieSeries.slices.template.strokeWidth = 2;
      pieSeries.slices.template.strokeOpacity = 1;
      pieSeries.labels.template.fill = am4core.color('#ffc000');
      pieSeries.labels.template.fontSize = 10;
      pieSeries.labels.template.paddingTop = 0;
      pieSeries.labels.template.paddingBottom = 0;
      pieSeries.slices.template.propertyFields.fill = 'color';
      // This creates initial animation
      pieSeries.ticks.template.disabled = false;
      pieSeries.ticks.template.fill = am4core.color('#ffc000');
      pieSeries.ticks.template.stroke = am4core.color('#ffc000');
      pieSeries.ticks.template.strokeWidth = 2;
      pieSeries.labels.template.text = '{value.percent}%';
      pieSeries.labels.template.fontSize = 12;
      pieSeries.slices.template.tooltipText = `{name} : {value} ${this.selectedPEVCCurrency} Million`;
      pieSeries.tooltip.label.fontSize = 14;
      pieSeries.colors.list = [
        am4core.color('rgb(68, 114, 196)'),
        am4core.color('rgb(237, 125, 49)'),
        am4core.color('rgb(255, 192, 0)'),
        am4core.color('rgb(91, 155, 213)'),
        am4core.color('rgb(23, 145, 114)'),
        am4core.color('rgb(255, 199, 95)'),
        am4core.color('rgb(255, 150, 113)'),
        am4core.color('#67b7dc'),
        am4core.color('#dc67ab'),
        am4core.color('#a367dc'),
        am4core.color('#8067dc'),
      ];

      let slice = pieSeries.slices.template;
      slice.states.getKey('hover').properties.scale = 1;
      slice.states.getKey('active').properties.shiftRadius = 0;
    }, 1);
  }
}

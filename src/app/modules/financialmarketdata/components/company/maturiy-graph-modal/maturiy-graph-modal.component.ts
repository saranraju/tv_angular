import {
  Component,
  HostListener,
  Input,
  OnChanges,
  OnInit,
} from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import am4themes_microchart from '@amcharts/amcharts4/themes/microchart';
@Component({
  selector: 'app-maturiy-graph-modal',
  templateUrl: './maturiy-graph-modal.component.html',
  styleUrls: ['./maturiy-graph-modal.component.scss'],
})
export class MaturiyGraphModalComponent implements OnInit {
  @Input() item_Data_list: any;
  @Input() maturity_Data_chart: any;
  @Input() lastCategoryValue: any = '';

  filterMaturityAllData: any = [];
  constructor(public auth: AuthService) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.stackGraph();
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.keyCode === 27) {
      this.auth.openPopupModal = false;
    }
  }

  tableDialogClose() {
    this.auth.openPopupModal = false;
  }

  stackGraph() {
    let currentYear = new Date().getFullYear();
    let tempChartData: any = [];
    let finalChartData: any = [];

    if (this.maturity_Data_chart.length) {
      let res = this.maturity_Data_chart;

      let item_array = [];

      for (var i = 0; i < res.length; i++) {
        let sho: any = {};
        sho[res[i].instrumentType.replace(/\s+/g, '').toLowerCase()] =
          Math.round(res[i].outstandingAmount);
        item_array.push({
          category: res[i].maturityYear,
          instrumentType: res[i].instrumentType,
          ...sho,
        });
      }

      let item_of_year: any = [];
      let finalObj: any = [];
      item_array.map((ele: any) => {
        item_of_year.push(ele.category);
      });
      const uniqueList = [...new Set(item_of_year)];

      uniqueList.map((list) => {
        finalObj.push({
          category: list,
        });
      });

      item_array.map((ele: any) => {
        const ItemYear = ele.category;
        finalObj.map((obj: any, index: any) => {
          if (obj.category === ItemYear) {
            finalObj[index] = Object.assign(ele, obj);
          }
        });
      });
      this.maturity_Data_chart = finalObj;

      this.maturity_Data_chart.sort((a: any, b: any) =>
        a.category > b.category ? 1 : b.category > a.category ? -1 : 0
      );
      this.maturity_Data_chart.map((val: any, ind: any) => {
        if (
          val &&
          val.category &&
          val.category.charAt(val.category.length - 1) == '+'
        ) {
          this.maturity_Data_chart[ind].category = val.category.slice(0, -1);
          this.maturity_Data_chart[ind][
            val.instrumentType.replace(/\s+/g, '').toLowerCase()
          ] = this.lastCategoryValue;
        }
      });

      this.maturity_Data_chart = this.maturity_Data_chart.filter(
        (el: any) => el.category !== null
      );
      let yearRange: any;
      if (this.maturity_Data_chart.length < 12) {
        yearRange =
          this.maturity_Data_chart[this.maturity_Data_chart.length - 1]
            .category - currentYear;
      }

      yearRange = yearRange ?? 11;

      let tempYear = currentYear;
      for (let i = tempYear; i < tempYear + yearRange + 1; i++) {
        let isThere = true;
        this.maturity_Data_chart.forEach((element: any) => {
          if (element.category == i) {
            isThere = false;
          }
        });
        if (isThere) {
          this.maturity_Data_chart.push({
            category: i.toString(),
            instrumentType: 'Senior Unsec.',
          });
        }
      }

      this.maturity_Data_chart.sort(function (a: any, b: any) {
        var keyA = new Date(a.category),
          keyB = new Date(b.category);
        // Compare the 2 dates
        if (keyA < keyB) return -1;
        if (keyA > keyB) return 1;
        return 0;
      });

      //converting category string to number
      this.maturity_Data_chart.forEach((element: any, index: any) => {
        element.category = element.category;
      });

      //pushing all data from the current year
      this.maturity_Data_chart.forEach((element: any) => {
        if (tempYear <= element.category) {
          tempChartData.push(element);
        }
      });

      //splitting the all data after the 10th array
      let afterTenthIndexValue: any = [];
      tempChartData.forEach((element: any, index: any) => {
        if (index > 10) {
          afterTenthIndexValue.push(element);
        } else {
          element.category = element.category.toString();
          finalChartData.push(element);
          if (index == 10) {
            element.category = element.category + '+';
          }
        }
      });

      // adding the all data to the last index of array
      let temp10th: any = {};
      afterTenthIndexValue.forEach((e: any) => {
        Object.entries(e).forEach(([keyOfEnd, valueOfEnd]: any) => {
          if (keyOfEnd != 'category') {
            if (temp10th[keyOfEnd]) {
              temp10th[keyOfEnd] = temp10th[keyOfEnd] + valueOfEnd;
            } else {
              temp10th[keyOfEnd] = valueOfEnd;
            }
          }
        });
      });
      if (finalChartData[10] !== undefined && temp10th !== undefined) {
        // Object.assign(finalChartData[5], temp10th);
        Object.entries(temp10th).forEach(([keyOfEnd, valueOfEnd]: any) => {
          if (keyOfEnd != 'category') {
            if (temp10th[keyOfEnd]) {
              if (finalChartData[10][keyOfEnd]) {
                finalChartData[10][keyOfEnd] =
                  temp10th[keyOfEnd] + finalChartData[10][keyOfEnd];
              } else {
                finalChartData[10][keyOfEnd] = temp10th[keyOfEnd];
              }
            } else {
              finalChartData[10][keyOfEnd] = valueOfEnd;
            }
          }
        });
      }
    }

    am4core.useTheme(am4themes_animated);
    am4core.unuseTheme(am4themes_microchart);
    var chart = am4core.create('chartdivPopup', am4charts.XYChart);
    // $(document).ready(function () {
    //   $('g[aria-labelledby]').hide();
    // });
    chart.data = finalChartData;

    chart.cursor = new am4charts.XYCursor();

    var categoryAxis: any = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = 'category';
    categoryAxis.renderer.grid.template.location = 0;

    categoryAxis.renderer.minGridDistance = 40;
    categoryAxis.renderer.grid.template.disabled = true;
    categoryAxis.renderer.fontSize = 11;
    categoryAxis.renderer.line.stroke = am4core.color('#ffc000');
    categoryAxis.renderer.labels.template.fill = am4core.color('#ffc000');
    categoryAxis.renderer.labels.template.fontSize = 11;

    categoryAxis.renderer.line.strokeWidth = 2;
    categoryAxis.renderer.line.strokeOpacity = 1;
    categoryAxis.tooltip.background.cornerRadius = 3;
    categoryAxis.tooltip.label.fontSize = 9;
    categoryAxis.tooltip.label.padding(5, 5, 5, 5);

    let valueAxis: any = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.tooltip.disabled = true;
    valueAxis.calculateTotals = true;
    valueAxis.renderer.minWidth = 50;
    valueAxis.renderer.grid.template.disabled = true;
    valueAxis.renderer.fontSize = 11;
    valueAxis.min = 0;
    valueAxis.renderer.inside = false;
    valueAxis.renderer.labels.template.disabled = false;
    valueAxis.renderer.line.stroke = am4core.color('#ffc000');
    valueAxis.renderer.labels.template.fill = am4core.color('#ffc000');
    valueAxis.renderer.line.strokeWidth = 2;
    valueAxis.renderer.labels.template.fontSize = 11;
    valueAxis.renderer.line.strokeOpacity = 1;

    chart.colors.list = [
      am4core.color('#4472c4'),
      am4core.color('#ed7d31'),
      am4core.color('#ffc000'),
      am4core.color('#5b9bd5'),
      am4core.color('#ed7d31'),
      am4core.color('#ffc000'),
      am4core.color('#ff9671'),
      am4core.color('#67b7dc'),
      am4core.color('#5b9bd5'),
    ];

    for (var g = 0; g < this.item_Data_list.length; g++) {
      createSeries(
        this.item_Data_list[g].replace(/\s+/g, '').toLowerCase(),
        this.item_Data_list[g]
      );
    }

    function createSeries(field: any, name: any) {
      var series1: any = chart.series.push(new am4charts.ColumnSeries());
      series1.name = name;
      series1.dataFields.valueY = field;
      series1.dataFields.categoryX = 'category';
      series1.columns.template.width = am4core.percent(60);
      series1.tooltipText = '{name}: {valueY}';
      series1.dataItems.template.locations.categoryX = 0.5;
      series1.stacked = true;
      series1.tooltip.pointerOrientation = 'vertical';
    }

    if (this.maturity_Data_chart.length === 0) {
      // Create label for no data available
      let label = chart.createChild(am4core.Label);
      label.text = 'No Data Available';
      label.horizontalCenter = 'middle';
      label.fontSize = 11;
      label.fill = am4core.color('#FFFFFF');
      label.fontFamily = 'Lucida Sans Unicode';
      label.isMeasured = false;
      label.x = am4core.percent(50);
      label.y = am4core.percent(30);
    }
  }
}

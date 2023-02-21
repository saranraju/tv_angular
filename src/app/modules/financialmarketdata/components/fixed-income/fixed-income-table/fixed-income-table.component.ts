import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-fixed-income-table',
  templateUrl: './fixed-income-table.component.html',
  styleUrls: ['./fixed-income-table.component.scss'],
})
export class FixedIncomeTableComponent implements OnInit {
  @Input() tableData: any;
  @Input() tableDataHeader: any;
  @Input() sort: any;
  @Input() isEdit: any;
  @Input() isDetailName: any = false;
  @Input() pagination: any;
  @Input() totalResultCount: any;
  @Input() headerBorder: any;
  @Input() bottomBorder: any;
  @Input() isFromCommodity: any = false;
  @Output() commodityData = new EventEmitter();
  @Output() removeEditComparableData = new EventEmitter();

  currentPageSelected: any = 1;

  labels: any = {
    previousLabel: '◄',
    nextLabel: '►',
  };

  iconIndex: any = 0;
  shortDown: boolean = false;
  shortUp: boolean = false;

  constructor() {}

  ngOnInit(): void {}

  sortByKey(key: any, i: any) {
    this.iconIndex = i;
    this.shortDown = !this.shortDown;
    return this.tableData.data.sort((a: any, b: any) => {
      var x = a[key];
      var y = b[key];
      if (this.shortDown == true) {
        return x < y ? 1 : x > y ? -1 : 0;
      } else {
        return x < y ? -1 : x > y ? 1 : 0;
      }
    });
  }

  transformWordFirstLetterToCapital(value: any) {
    return value.replace(/(\w+)/g, function (x: any) {
      return x[0].toUpperCase() + x.substring(1);
    });
  }

  commodityEmitData(event: any) {
    if (this.isFromCommodity) {
      this.commodityData.emit(event);
    }
  }

  removeEditComparable(event: any) {
    let temp: any = [];
    this.tableData.forEach((element: any) => {
      if (element.id == event.id) {
        temp.push({
          templateDataId: element.id,
          status: 0,
        });
      } else {
        temp.push({
          templateDataId: element.id,
          status: 1,
        });
      }
    });
    this.removeEditComparableData.emit(temp);
  }
}

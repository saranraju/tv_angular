import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-screener-table',
  templateUrl: './screener-table.component.html',
  styleUrls: ['./screener-table.component.scss'],
})
export class ScreenerTableComponent implements OnInit {
  iconIndex: any = 0;
  shortDown: boolean = false;
  shortUp: boolean = false;

  @Input() screenerTable: any;
  @Input() paginate: any;
  @Input() currentPageSelected: any;
  @Input() itemsPerPage: any;
  @Input() pageLength: any;
  @Input() pageChanged: any;

  @Output() changePage = new EventEmitter<any>();

  public labels: any = {
    previousLabel: '◄',
    nextLabel: '►',
  };

  constructor(public util: UtilService) {}

  ngOnInit(): void {
    let keyVal = this.screenerTable.title[0].key;
    this.screenerTable.value.sort(function (a: any, b: any) {
      var nameA = a[keyVal].toLowerCase(),
        nameB = b[keyVal].toLowerCase();
      if (nameA < nameB)
        //sort string ascending
        return -1;
      if (nameA > nameB) return 1;
      return 0; //default return value (no sorting)
    });
  }

  ngOnChanges(): void {
    if (this.pageChanged) {
      this.currentPageSelected = 1;
    }
  }

  dropCol(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.screenerTable.title,
      event.previousIndex,
      event.currentIndex
    );
  }

  sortByKey(key: any, i: any, sort?: any) {
    if (sort) {
      this.iconIndex = i;
      this.shortDown = !this.shortDown;
      return this.screenerTable.value.sort((a: any, b: any) => {
        var x = a[key];
        var y = b[key];
        if (x == null || x == undefined) {
          x = isNaN(x) ? '' : 0;
        }
        if (y == null || y == undefined) {
          y = isNaN(y) ? '' : 0;
        }
        if (isNaN(x) && isNaN(y)) {
          if (this.shortDown == true) {
            return x < y ? 1 : x > y ? -1 : 0;
          } else {
            return x < y ? -1 : x > y ? 1 : 0;
          }
        }
        if (this.shortDown == true) {
          return x - y;
        } else {
          return y - x;
        }
      });
    }
  }

  onPageChange(event: any) {
    this.currentPageSelected = event;
    this.changePage.emit(event);
  }
}

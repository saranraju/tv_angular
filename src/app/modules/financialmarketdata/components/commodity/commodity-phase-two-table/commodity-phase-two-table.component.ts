import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'commodity-phase-two-table',
  templateUrl: './commodity-phase-two-table.component.html',
  styleUrls: ['./commodity-phase-two-table.component.scss'],
})
export class CommodityPhaseTwoTableComponent implements OnInit {
  @Input() tableData: any;
  @Input() tableDataHeader: any;
  @Input() sort: any;
  @Input() pagination: any;
  @Input() totalResultCount: any;
  @Input() headerBorder: any;
  @Input() bottomBorder: any;
  @Input() OTCorEnergy: any;
  @Input() type: any;
  @Input() homeData: any = false;
  @Input() currentPageSelected: any;
  @Input() paginateId: any;

  @Input() tableDataLength: any;
  @Output() commodityData = new EventEmitter();
  @Output() changePage = new EventEmitter<any>();
  @Output() onForexDataClick = new EventEmitter<any>();

  labels: any = {
    previousLabel: '◄',
    nextLabel: '►',
  };

  iconIndex: any = 0;
  shortDown: boolean = false;
  shortUp: boolean = false;

  constructor(public util: UtilService) {}

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

  commodityEmitData(index: any, event: any) {
    if (this.type == 'forex') {
      this.onForexDataClick.emit(event);
    } else {
      if (index == 0) {
        event['OTCorEnergy'] = this.OTCorEnergy;
        this.commodityData.emit(event);
      }
    }
  }

  onPageChange(event: any) {
    this.tableData.length = 0;
    this.currentPageSelected = event;
    this.changePage.emit(event);
  }
}

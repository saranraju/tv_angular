import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { FinancialMarketDataService } from 'src/app/services/financialmarketdata.service';

@Component({
  selector: 'fixed-income-table-drag-drop',
  templateUrl: './fixed-income-table-drag-drop.component.html',
  styleUrls: ['./fixed-income-table-drag-drop.component.scss'],
})
export class FixedIncomeTableDragDropComponent implements OnInit, OnChanges {
  @Input() expandDataTable: any;
  @Input() tableDataHeader: any;
  @Input() pagination: any;
  @Input() totalResultCount: any;
  @Output() columnUpdated = new EventEmitter();
  @Output() changePage = new EventEmitter();

  currentPageSelected: any = 1;

  labels: any = {
    previousLabel: '◄',
    nextLabel: '►',
  };

  // For display column
  displayColumn: any = [];

  constructor(private financialDataService: FinancialMarketDataService) {}

  ngOnInit(): void {
    let sortedHeader: any = [];
    if (this.tableDataHeader[0]) {
      Object.entries(this.tableDataHeader[0]).forEach((el: any) => {
        sortedHeader.push({
          label: el[0].replaceAll('_', ' '),
          field: el[0],
          position: el[1],
        });
      });
      sortedHeader.sort((a: any, b: any) => a.position - b.position);
      this.displayColumn = sortedHeader;
    }
  }

  ngOnChanges(): void {
    let sortedHeader: any = [];
    if (this.tableDataHeader[0]) {
      Object.entries(this.tableDataHeader[0]).forEach((el: any) => {
        sortedHeader.push({
          label: el[0].replaceAll('_', ' '),
          field: el[0],
          position: el[1],
        });
      });
      sortedHeader.sort((a: any, b: any) => a.position - b.position);
      this.displayColumn = sortedHeader;
    }
  }

  transformWordFirstLetterToCapital(value: any) {
    return value.replace(/(\w+)/g, function (x: any) {
      return x[0].toUpperCase() + x.substring(1);
    });
  }

  dropCol(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.displayColumn,
      event.previousIndex,
      event.currentIndex
    );
    let body: any = {};
    body['user_id'] = '11';
    this.displayColumn.forEach((element: any, index: any) => {
      body[element.field] = `${index + 1}`;
    });
    this.financialDataService.saveUserMetrics(body).subscribe((res: any) => {
      this.columnUpdated.emit(true);

      let sortedHeader: any = [];
      Object.entries(res.sort_order).forEach((el: any) => {
        sortedHeader.push({
          label: el[0].replaceAll('_', ' '),
          field: el[0],
          position: el[1],
        });
      });
      sortedHeader.sort((a: any, b: any) => a.position - b.position);
      this.displayColumn = sortedHeader;
    });
  }

  onPageChange(event: any) {
    this.currentPageSelected = event;
    this.changePage.emit(event);
  }
}

import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { UtilService } from 'src/app/services/util.service';
import { AuthService } from 'src/app/services/auth/auth.service';
@Component({
  selector: 'app-exchange-expandable-table',
  templateUrl: './exchange-expandable-table.component.html',
  styleUrls: ['./exchange-expandable-table.component.scss'],
})
export class ExchangeExpandableTableComponent implements OnInit {
  @Input() tableData: any = [];
  @Input() pagination: any;
  @Input() totalResultCount: any;
  @Output() exchange_detail = new EventEmitter<any>();
  currentPageSelected: any = 1;

  labels: any = {
    previousLabel: '◄',
    nextLabel: '►',
  };
  expandedIndex: any;
  expandInsideType: any = 'chart';

  timeButtons: any = [
    { value: '1 Min' },
    { value: '5 Min' },
    { value: '15 Min' },
    { value: '30 Min' },
    { value: '1 Hour' },
    { value: 'Daily' },
    { value: 'Weekly' },
    { value: 'Monthly' },
  ];
  selectedTimeButton: any = '15 Min';

  //Data Strucure for Table
  chartTimeData: any = {
    header: [
      {
        width: 'auto',
        label: 'Security Name',
        field: 'SecurityName',
      },
      {
        width: 'auto',
        label: 'Ticker',
        field: 'Ticker',
      },
      {
        width: 'auto',
        label: 'Current Price (INR )',
        field: 'CurrentPrice',
      },
      {
        width: 'auto',
        label: '% change',
        field: 'change',
      },
    ],
    data: [
      {
        SecurityName: 'ABC XYZ Ltd. ABCXYZ…​',
        Ticker: 'ABC',
        CurrentPrice: 'xx.xx',
        change: 'xx.xx',
      },
      {
        SecurityName: 'ABC XYZ Ltd. ABCXYZ…​',
        Ticker: 'ABC',
        CurrentPrice: 'xx.xx',
        change: 'xx.xx',
      },
      {
        SecurityName: 'ABC XYZ Ltd. ABCXYZ…​',
        Ticker: 'ABC',
        CurrentPrice: 'xx.xx',
        change: 'xx.xx',
      },
      {
        SecurityName: 'ABC XYZ Ltd. ABCXYZ…​',
        Ticker: 'ABC',
        CurrentPrice: 'xx.xx',
        change: 'xx.xx',
      },
      {
        SecurityName: 'ABC XYZ Ltd. ABCXYZ…​',
        Ticker: 'ABC',
        CurrentPrice: 'xx.xx',
        change: 'xx.xx',
      },
    ],
  };

  top_gains_modal_table_data: any = {
    header: [
      {
        width: 'auto',
        label: 'Stock Name',
        key: 'instructionName',
        align: 'left',
        plusIcon: true,
        color: '#ffc000',
        pointer: true,
      },
      {
        width: 'auto',
        label: 'Ticker',
        key: 'lastPrice',
        color: '#fff',
      },
      {
        width: 'auto',
        label: 'Current Price​ (INR)',
        key: 'oneDayChange',
        color: '#fff',
      },
      {
        width: 'auto',
        label: '1 Day Change (%)',
        key: 'oneWeekChange',
        color: '#fff',
      },
      {
        width: 'auto',
        label: 'Open (INR)​',
        key: 'issuerName',
        color: '#fff',
      },
      {
        width: 'auto',
        label: 'High (INR)',
        key: 'industry',
        color: '#fff',
      },
      {
        width: 'auto',
        label: 'Low (INR)',
        key: 'country',
        color: '#fff',
      },
      {
        width: 'auto',
        label: 'Previous Close',
        key: 'yieldToMaturity',
        color: '#fff',
        align: 'center',
      },
    ],
    data: [
      {
        instructionName: '0% CP 25/02/2022 INR',
        lastPrice: 'xx.x',
        oneDayChange: 'xx',
        oneWeekChange: 'xx',
        issuerName: 'A Corp',
        industry: 'Technology',
        country: 'India',
        yieldToMaturity: 'xx.xx',
        modifiedDuration: 'xx.xx',
      },
      {
        instructionName: '1% CP 25/02/2022 INR',
        lastPrice: 'xx.x',
        oneDayChange: 'xx',
        oneWeekChange: 'xx',
        issuerName: 'AB Corp',
        industry: 'Technology',
        country: 'India',
        yieldToMaturity: 'xx.xx',
        modifiedDuration: 'xx.xx',
      },
      {
        instructionName: '2% CP 25/02/2022 INR',
        lastPrice: 'xx.x',
        oneDayChange: 'xx',
        oneWeekChange: 'xx',
        issuerName: 'ABC Corp',
        industry: 'Technology',
        country: 'India',
        yieldToMaturity: 'xx.xx',
        modifiedDuration: 'xx.xx',
      },
      {
        instructionName: '3% CP 25/02/2022 INR',
        lastPrice: 'xx.x',
        oneDayChange: 'xx',
        oneWeekChange: 'xx',
        issuerName: 'ABCD Corp',
        industry: 'Technology',
        country: 'India',
        yieldToMaturity: 'xx.xx',
        modifiedDuration: 'xx.xx',
      },
      {
        instructionName: '4% CP 25/02/2022 INR',
        lastPrice: 'xx.x',
        oneDayChange: 'xx',
        oneWeekChange: 'xx',
        issuerName: 'ABCDE Corp',
        industry: 'Technology',
        country: 'India',
        yieldToMaturity: 'xx.xx',
        modifiedDuration: 'xx.xx',
      },
      {
        instructionName: '4% CP 25/02/2022 INR',
        lastPrice: 'xx.x',
        oneDayChange: 'xx',
        oneWeekChange: 'xx',
        issuerName: 'ABCDE Corp',
        industry: 'Technology',
        country: 'India',
        yieldToMaturity: 'xx.xx',
        modifiedDuration: 'xx.xx',
      },
      {
        instructionName: '4% CP 25/02/2022 INR',
        lastPrice: 'xx.x',
        oneDayChange: 'xx',
        oneWeekChange: 'xx',
        issuerName: 'ABCDE Corp',
        industry: 'Technology',
        country: 'India',
        yieldToMaturity: 'xx.xx',
        modifiedDuration: 'xx.xx',
      },
      {
        instructionName: '4% CP 25/02/2022 INR',
        lastPrice: 'xx.x',
        oneDayChange: 'xx',
        oneWeekChange: 'xx',
        issuerName: 'ABCDE Corp',
        industry: 'Technology',
        country: 'India',
        yieldToMaturity: 'xx.xx',
        modifiedDuration: 'xx.xx',
      },
      {
        instructionName: '4% CP 25/02/2022 INR',
        lastPrice: 'xx.x',
        oneDayChange: 'xx',
        oneWeekChange: 'xx',
        issuerName: 'ABCDE Corp',
        industry: 'Technology',
        country: 'India',
        yieldToMaturity: 'xx.xx',
        modifiedDuration: 'xx.xx',
      },
    ],
  };
  type: any;
  constructor(public auth: AuthService) {}

  ngOnInit(): void {}

  handleExpandTableClick(i: any) {
    if (this.expandedIndex == i) {
      this.expandedIndex = null;
    } else {
      this.expandedIndex = i;
    }
  }

  handlePaginator() {
    this.expandedIndex = null;
  }

  topOpenFuntion(type: any) {
    this.type = type;
    this.auth.openPopupModal = true;
  }
  dropCol(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.tableData.header,
      event.previousIndex,
      event.currentIndex
    );
  }

  exchangeDetail(index: any) {
    if (index == 0) {
      this.exchange_detail.emit(true);
    }
  }
}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-transactions-modal',
  templateUrl: './transactions-modal.component.html',
  styleUrls: ['./transactions-modal.component.scss'],
})
export class TransactionsModalComponent implements OnInit {
  modal_table_data = {
    title: [
      {
        label: 'Entity Name',
        key: 'entityName',
        width: '10rem',
        align: 'left',
        shorting: true,
        hover: true,
      },
      {
        label: 'Financing Type',
        key: 'finType',
        width: '4rem',
        align: 'right',
        shorting: true,
      },
      {
        label: 'Number of Rounds',
        key: 'rounds',
        width: '4rem',
        align: 'right',
        shorting: true,
      },
      {
        label: 'Total Funding Amount (USD Million)',
        key: 'totalValuation',
        width: '6rem',
        shorting: true,
        formattedNum: true,
      },
    ],
    value: [],
  };

  temp_modal_table_data: any;
  pageEntriesValue: any = 10;
  rowOffset: any = 0;
  rowEnd: any = 10;
  currentPage: any = 1;

  @Input() topFundedCompaniesData: any;
  @Input() selectedPEVCPeriod: any;
  @Input() modalPageNumbers: any;
  @Input() currency: any;
  @Input() country: any;
  @Input() startDate: any;
  @Input() endDate: any;
  @Output() pageEntries = new EventEmitter<any>();
  @Output() modalClickEntity = new EventEmitter<any>();
  constructor(public auth: AuthService) {}

  ngOnInit(): void {
    this.topFundedCompaniesHandler();
  }

  transactionsModalClose() {
    this.auth.openPopupModal = false;
  }

  topFundedCompaniesHandler() {
    this.modal_table_data = {
      ...this.modal_table_data,
      value: this.topFundedCompaniesData.slice(this.rowOffset, this.rowEnd),
    };
  }

  handleEntries(ev: any) {
    this.pageEntries.emit(ev);
    this.pageEntriesValue = parseInt(ev.target.value);
    this.currentPage = 1;
    this.rowOffset = 0;

    if (this.pageEntriesValue === 10) {
      this.rowEnd = 10;
    } else if (this.pageEntriesValue === 25) {
      this.rowEnd = 25;
    } else if (this.pageEntriesValue === 50) {
      this.rowEnd = 50;
    } else if (this.pageEntriesValue === 100) {
      this.rowEnd = 100;
    }
    this.topFundedCompaniesHandler();
  }

  handlePagination(page: any) {
    this.currentPage = page;

    if (this.pageEntriesValue === 10) {
      this.rowOffset = page * 10 - 10;
      this.rowEnd = page * 10;
    } else if (this.pageEntriesValue === 25) {
      this.rowOffset = page * 25 - 25;
      this.rowEnd = page * 25;
    } else if (this.pageEntriesValue === 50) {
      this.rowOffset = page * 50 - 50;
      this.rowEnd = page * 50;
    } else if (this.pageEntriesValue === 100) {
      this.rowOffset = page * 100 - 100;
      this.rowEnd = page * 100;
    }

    this.topFundedCompaniesHandler();
  }

  handlePrevClick() {
    this.currentPage -= 1;

    if (this.pageEntriesValue === 10) {
      this.rowOffset = this.currentPage * 10 - 10;
      this.rowEnd = this.currentPage * 10;
    } else if (this.pageEntriesValue === 25) {
      this.rowOffset = this.currentPage * 25 - 25;
      this.rowEnd = this.currentPage * 25;
    } else if (this.pageEntriesValue === 50) {
      this.rowOffset = this.currentPage * 50 - 50;
      this.rowEnd = this.currentPage * 50;
    } else if (this.pageEntriesValue === 100) {
      this.rowOffset = this.currentPage * 100 - 100;
      this.rowEnd = this.currentPage * 100;
    }
    this.topFundedCompaniesHandler();
  }

  handleNextClick() {
    this.currentPage += 1;

    if (this.pageEntriesValue === 10) {
      this.rowOffset = this.currentPage * 10 - 10;
      this.rowEnd = this.currentPage * 10;
    } else if (this.pageEntriesValue === 25) {
      this.rowOffset = this.currentPage * 25 - 25;
      this.rowEnd = this.currentPage * 25;
    } else if (this.pageEntriesValue === 50) {
      this.rowOffset = this.currentPage * 50 - 50;
      this.rowEnd = this.currentPage * 50;
    } else if (this.pageEntriesValue === 100) {
      this.rowOffset = this.currentPage * 100 - 100;
      this.rowEnd = this.currentPage * 100;
    }

    this.topFundedCompaniesHandler();
  }

  handleSelectedRow(ev: any) {
    this.modalClickEntity.emit(ev);
  }
}

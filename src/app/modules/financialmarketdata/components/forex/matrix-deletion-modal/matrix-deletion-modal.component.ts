import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FinancialMarketDataService } from 'src/app/services/financialmarketdata.service';

@Component({
  selector: 'app-matrix-deletion-modal',
  templateUrl: './matrix-deletion-modal.component.html',
  styleUrls: ['./matrix-deletion-modal.component.scss'],
})
export class MatrixDeletionModalComponent implements OnInit {
  @Input() fxMatrixName: any;
  @Output() confirmDeletion = new EventEmitter<any>();

  constructor(
    public auth: AuthService,
    public financialMarketData: FinancialMarketDataService
  ) {}

  ngOnInit(): void {}

  handleCancelBtnClick() {
    this.auth.showFxMatrixDeletionModal = false;
  }

  handleDeleteBtnClick() {
    this.deleteCustomForexMatrix(this.fxMatrixName);
    this.auth.showFxMatrixDeletionModal = false;
    // this.confirmDeletion.emit(true);
  }

  deleteCustomForexMatrix(id: any) {
    this.financialMarketData.deleteCustomForexMatrix(id).subscribe(
      (res: any) => {
        // window.location.search = '';
      },
      (error) => {
        // window.location.search = '';
      }
    );
  }
}

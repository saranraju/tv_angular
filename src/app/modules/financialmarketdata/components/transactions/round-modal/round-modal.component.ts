import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UtilService } from 'src/app/services/util.service';
import { FinancialMarketDataService } from 'src/app/services/financialmarketdata.service';
import { saveAs } from 'file-saver';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-round-modal',
  templateUrl: './round-modal.component.html',
  styleUrls: ['./round-modal.component.scss'],
})
export class RoundModalComponent implements OnInit {
  @Input() fundingRoundHeaderData: any;
  @Input() round_table: any;
  @Input() selectedRowDetData: any;
  @Input() startDateDet: any;
  @Input() endDateDet: any;
  @Input() selectedPEVCCurrency: any;

  count_res: any = 0;
  total_count_res: any = '';

  constructor(
    public auth: AuthService,
    public util: UtilService,
    public datepipe: DatePipe,
    private financialMarketData: FinancialMarketDataService
  ) {}

  ngOnInit(): void {}

  transactionsRoundModalClose() {
    this.auth.openRoundModal = false;
  }

  handleFundingRoundExcelDownload() {
    this.count_res = 0;
    this.total_count_res = 1;
    this.util.loaderService.display(true);

    this.financialMarketData
      .getFundingRoundExcelDownloadData(
        this.selectedRowDetData.entityId,
        this.selectedRowDetData.round,
        this.datepipe.transform(this.startDateDet, 'yyyy-MM-dd'),
        this.datepipe.transform(this.endDateDet, 'yyyy-MM-dd'),
        this.selectedRowDetData.financingType,
        this.selectedRowDetData.currency
      )
      .subscribe(
        (res: any) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);

          const blob = new Blob([res.body], {
            type: 'application/vnd.ms.excel',
          });
          const file = new File(
            [blob],
            '' + `PEVC Funding Details-${this.endDateDet}.xls`,
            {
              type: 'application/vnd.ms.excel',
            }
          );
          saveAs(file);
        },
        (err) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);
          if (err.status === 402) {
            this.auth.freeTrialAlert = true;
          }
          console.log('err', err.message);
        }
      );
  }
}

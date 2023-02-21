import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FinancialMarketDataService } from 'src/app/services/financialmarketdata.service';

@Component({
  selector: 'app-events-table',
  templateUrl: './events-table.component.html',
  styleUrls: ['./events-table.component.scss'],
})
export class EventsTableComponent implements OnInit {
  @Input() table_data: any;
  @Input() header_data: any;
  @Input() column: any;
  @Input() mh: any;
  @Output() modalData: EventEmitter<any> = new EventEmitter();
  constructor(
    public auth: AuthService,
    private financialMarketData: FinancialMarketDataService
  ) {}

  ngOnInit(): void {}

  handelEventClick(data: any) {
    if (data.transcriptCompleted === 'C') {
      var reportId = data.reportId;
      var title = data.title;
      this.financialMarketData
        .getEventTranscriptModalData(reportId, title)
        .subscribe((res: any) => {
          this.modalData.emit(res);
        });
    }
  }
}

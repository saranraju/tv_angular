import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';

declare const TradingView: any;

@Component({
  selector: 'app-expand-table-cds-dashboard',
  templateUrl: './expand-table-cds-dashboard.component.html',
  styleUrls: ['./expand-table-cds-dashboard.component.scss'],
})
export class ExpandTableCdsDashboardComponent implements OnInit {
  @Input() table_data: any;
  @Output() hideCdsDashboard = new EventEmitter<any>();
  @Output() cdsCompanyData = new EventEmitter<any>();

  index: any = 0;
  hideChildContent: any;
  isInstruments: any = false;
  selectedPlus_icon: boolean = false;
  currentPageDet: any;

  public labels: any = {
    previousLabel: '◄',
    nextLabel: '►',
  };

  constructor(public util: UtilService) {}

  ngOnInit(): void {
    this.currentPageDet = 1;
    this.selectedPlus_icon = false;
    this.hideChildContent = false;
  }

  handleExpandTableClick(data: any, i: any) {
    if (this.selectedPlus_icon && this.index === i) {
      this.selectedPlus_icon = false;
      this.hideChildContent = false;
    } else {
      if (i === this.index) {
        if (this.selectedPlus_icon === false) {
          this.selectedPlus_icon = true;
          this.hideChildContent = true;
          this.toggleInstrumentView();
        } else {
          this.selectedPlus_icon = false;
          this.hideChildContent = false;
        }
      } else {
        this.index = i;
        this.selectedPlus_icon = true;
        this.hideChildContent = true;
        this.toggleInstrumentView();
      }
    }
  }

  handlePaginateClick() {
    this.selectedPlus_icon = false;
    this.hideChildContent = false;
  }

  toggleInstrumentView() {
    this.isInstruments = true;
    if (this.isInstruments == true) {
      setTimeout(() => {
        new TradingView.widget({
          autosize: true,
          symbol: 'NASDAQ:AAPL',
          timezone: 'Etc/UTC',
          theme: 'Dark',
          style: '1',
          locale: 'en',
          toolbar_bg: '#f1f3f6',
          enable_publishing: false,
          withdateranges: true,
          range: 'ytd',
          hide_side_toolbar: false,
          allow_symbol_change: true,
          show_popup_button: true,
          popup_width: '1000',
          popup_height: '650',
          no_referral_id: true,
          container_id: 'tradingview-cds-table',
        });
      });
    }
  }

  handleCdsCompanyClick(content: any) {
    this.hideCdsDashboard.emit(true);
    this.cdsCompanyData.emit(content);
  }
}

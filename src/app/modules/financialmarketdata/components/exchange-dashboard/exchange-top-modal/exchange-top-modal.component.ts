import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UtilService } from 'src/app/services/util.service';
import { Options } from '@angular-slider/ngx-slider';

interface SliderDetails {
  value: number;
  highValue: number;
  floor: number;
  ceil: number;
  step: number;
  showTicks: boolean;
  enforceStep: boolean;
  enforceRange: boolean;
}
declare const TradingView: any;

@Component({
  selector: 'app-exchange-top-modal',
  templateUrl: './exchange-top-modal.component.html',
  styleUrls: ['./exchange-top-modal.component.scss'],
})
export class ExchangeTopModalComponent implements OnInit {
  @Input() table_data: any;
  @Input() title: any;
  index: any = 0;
  hideChildContent: any;
  isInstruments: any = false;
  selectedPlus_icon: boolean = false;
  currentPageDet: any;

  public labels: any = {
    previousLabel: '◄',
    nextLabel: '►',
  };

  value: number = 100;
  maxValue: number = 112443;
  options: Options = {
    floor: 0,
    ceil: 112443,
    step: 450,
    showTicks: true,
    noSwitching: true,
  };
  slider: Array<SliderDetails> = [];

  market_quote_table_data: any = {
    title: [
      {
        key: 'Description',
        label: 'Bid Quantity',
      },
      {
        align: 'center',
        key: 'Category',
        label: 'Bid Price',
      },
      {
        align: 'center',
        key: 'Market',
        label: 'Ask Price',
      },
      {
        align: 'center',
        key: 'Time',
        label: 'Ask Quantity​',
      },
    ],
    value: [
      {
        Description: 'XX.XX',
        Category: 'XX.XX',
        Market: 'XX.XX',
        Time: 'XX.XX',
      },
      {
        Description: 'XX.XX',
        Category: 'XX.XX',
        Market: 'XX.XX',
        Time: 'XX.XX',
      },
      {
        Description: 'XX.XX',
        Category: 'XX.XX',
        Market: 'XX.XX',
        Time: 'XX.XX',
      },
      {
        Description: 'XX.XX',
        Category: 'XX.XX',
        Market: 'XX.XX',
        Time: 'XX.XX',
      },
      {
        Description: 'XX.XX',
        Category: 'XX.XX',
        Market: 'XX.XX',
        Time: 'XX.XX',
      },
      {
        Description: 'XX.XX',
        Category: 'XX.XX',
        Market: 'XX.XX',
        Time: 'XX.XX',
      },
      {
        Description: 'XX.XX',
        Category: 'XX.XX',
        Market: 'XX.XX',
        Time: 'XX.XX',
      },
      {
        Description: 'XX.XX',
        Category: 'XX.XX',
        Market: 'XX.XX',
        Time: 'XX.XX',
      },
      {
        Description: 'XX.XX',
        Category: 'XX.XX',
        Market: 'XX.XX',
        Time: 'XX.XX',
      },
    ],
  };
  constructor(public util: UtilService, public auth: AuthService) {}

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
}

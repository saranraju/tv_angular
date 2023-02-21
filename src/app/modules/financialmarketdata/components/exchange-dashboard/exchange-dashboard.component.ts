import { Component, OnInit } from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';
import { AuthService } from 'src/app/services/auth/auth.service';

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

@Component({
  selector: 'app-exchange-dashboard',
  templateUrl: './exchange-dashboard.component.html',
  styleUrls: ['./exchange-dashboard.component.scss'],
})
export class ExchangeDashboardComponent implements OnInit {
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

  tableData: any = {
    header: [
      {
        width: 'auto',
        label: 'Exchange Name',
        field: 'instructionName',
      },
      {
        width: 'auto',
        label: 'Exchange Code',
        field: 'lastPrice',
      },
      {
        width: 'auto',
        label: 'Code',
        field: 'oneDayChange',
      },
      {
        width: 'auto',
        label: 'Real Time Securities',
        field: 'oneWeekChange',
      },
      {
        width: 'auto',
        label: 'EOD Securities',
        field: 'issuerName',
      },
      {
        width: 'auto',
        label: 'Top Ganier',
        field: 'industry',
        color: '#fec134',
      },
      {
        width: 'auto',
        label: 'Top Loser',
        field: 'country',
        color: '#fec134',
      },
      {
        width: 'auto',
        label: 'Most Active',
        field: 'yieldToMaturity',
        color: '#fec134',
      },
    ],
    data: [
      {
        instructionName: 'Bombay Stock Exchange',
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
        instructionName: 'Hong Kong Stock Exchange',
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
    ],
  };

  constructor(public auth: AuthService) {}

  ngOnInit(): void {}

  exchangeDetailFn(event: any) {
    if (event) {
      this.auth.openTermsModal = true;
    }
  }
}

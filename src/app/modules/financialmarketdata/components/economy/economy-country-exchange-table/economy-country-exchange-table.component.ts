import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Router } from '@angular/router';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-economy-country-exchange-table',
  templateUrl: './economy-country-exchange-table.component.html',
  styleUrls: ['./economy-country-exchange-table.component.scss'],
})
export class EconomyCountryExchangeTableComponent implements OnInit, OnChanges {
  @Input() table_data: any;
  @Input() country_exchange_object: any;
  @Input() exchangeTable: any;
  @Input() mh: any;
  @Input() selectedCountry: any;
  @Input() country_code: any;
  @Input() type: any;
  @Output() sortType = new EventEmitter();
  currency_code_filter: any = [];
  country_risk_profile_data_ref: any = [
    'S&P',
    "Moody's",
    'Fitch',
    'DBRS',
    'Country Risk Premium',
    'Default Spread',
    'Equity Risk Premium',
  ];
  ascNumberSort = false;
  constructor(public util: UtilService, private router: Router) {}

  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges): void {
    this.currency_code_filter = [];
    // this.sortCurrency();
    let orderCountry = [
      'NZD',
      'AUD',
      'JPY',
      'SGD',
      'CHF',
      'EUR',
      'GBP',
      'CAD',
      'USD',
    ];

    if (this.exchangeTable && this.table_data?.length) {
      orderCountry.forEach((el: any) => {
        this.table_data.filter((element: any) => {
          if (element.targetCurrencyCode == el) {
            this.currency_code_filter.unshift(element);
          } else {
            this.currency_code_filter.push(element);
          }
        });
      });
      this.currency_code_filter = [...new Set(this.currency_code_filter)];
    }
    if (this.type == 'countryRiskProfile') {
      this.country_risk_profile_data_ref.forEach((ele2: any) => {
        var index = this.table_data.findIndex((x: any) => x.agency == ele2);
        index == -1
          ? this.table_data.push({
              agency: ele2,
              rating: '-',
              hypen: true,
              date: '-',
            })
          : '';
      });

      let data = this.table_data.filter((ele: any) => {
        return this.country_risk_profile_data_ref.includes(ele.agency);
      });
      this.table_data = data;

      this.table_data.sort((a: any, b: any) => {
        return (
          this.country_risk_profile_data_ref.indexOf(a.agency) -
          this.country_risk_profile_data_ref.indexOf(b.agency)
        );
      });
      console.log(this.table_data, '89---');
    }
    // this.table_data = this.table_data.filter();
  }

  sortCurrency() {
    this.ascNumberSort = !this.ascNumberSort;
    // for (var i = 0; i < data.length; i++) {
    //   this.table_data[i].data = 1 / data[i].data;
    // }
    this.sortType.emit(this.ascNumberSort);
  }

  redirectToInteractiveAnalysis(args: any) {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['financialmarketdata/interactive-analysis'], {
        queryParams: {
          forexName: args.targetCurrencyCode,
          countryName: this.selectedCountry.countryIsoCode3,
          tabFrom: 'forex',
        },
      })
    );
    if (this.util.tabInstance != undefined) {
      this.util.tabInstance.close();
      this.util.tabInstance = window.open(url, '_blank');
    } else {
      this.util.tabInstance = window.open(url, '_blank');
    }
  }
}

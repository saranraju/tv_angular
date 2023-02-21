import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Options } from '@angular-slider/ngx-slider';
import { FinancialMarketDataService } from 'src/app/services/financialmarketdata.service';
import { UtilService } from 'src/app/services/util.service';
import { saveAs } from 'file-saver';
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
  selector: 'app-ipo-advance-search',
  templateUrl: './ipo-advance-search.component.html',
  styleUrls: ['./ipo-advance-search.component.scss'],
})
export class IpoAdvanceSearchComponent implements OnInit {
  @Input() currencyData: any;
  @Input() exchnageData: any;
  @Input() securityType: any;
  @Input() periodData: any;
  @Input() countryData: any;
  @Input() advisorList: any;
  @Input() statusList: any;
  @Input() ngSelectMultipleOption: any;
  selectedCountry: any = '';
  selectedCurrency: any = '';
  selectedStatus: any = '';
  selectedAdvisor: any = '';
  selectedPeriod: any = '';
  selectedExchange: any = '';
  currentPage: any = 1;
  @Output() onCompanyClicked = new EventEmitter<any>();
  count_res: any = 0;
  total_count_res: any = '';

  @HostListener('click', ['$event.target'])
  onClick($event: any) {
    this.showDropdown = false;
  }

  ipo_table_data_modal: any = {
    title: [
      {
        label: 'Company Name',
        key: 'companyName',
        shorting: true,
        pointer: true,
        width: '12rem',
        hover: true,
      },
      {
        label: 'Country',
        key: 'country',
        align: 'center',
        shorting: true,
      },
      {
        label: 'Exchange',
        key: 'exchange',
        align: 'center',

        shorting: true,
      },
      {
        label: 'Issue Open Date',
        key: 'issueOpenDate',
        align: 'center',
        shorting: true,
      },
      {
        label: 'Issue Close Date',
        key: 'issueCloseDate',
        align: 'center',
        shorting: true,
      },
      {
        label: 'Listing Date',
        key: 'listingDate',
        align: 'center',
        shorting: true,
      },
      {
        label: 'Security Type',
        key: 'securityType',
        align: 'center',
        shorting: true,
      },
      {
        label: 'Currency',
        key: 'currency',
        align: 'center',
        shorting: true,
      },
      {
        label: 'Offer Size (Million)',
        key: 'offerSize',
        align: 'center',
        shorting: true,
      },
      {
        label: 'Proposed Price',
        key: 'proposedPrice',
        align: 'center',
        shorting: true,
      },
      {
        label: 'IPO Price Range',
        key: 'ipoPriceChange',
        align: 'center',
        shorting: true,
      },
    ],
    value: [],
  };
  minvalue: any;
  maxValue: any;

  options: Options = {
    floor: 0,
    ceil: 800000,
    step: 450,
    showTicks: true,
    noSwitching: true,
  };
  slider: Array<SliderDetails> = [];

  constructor(
    public auth: AuthService,
    public fiancialService: FinancialMarketDataService,
    public util: UtilService
  ) {}

  ngOnInit(): void {
    this.last5Years = this.getLast5Years();
    this.countryData.push({ id: 'All', text: 'World' });
    this.onSearch();
  }
  newsDialogClose() {
    this.auth.openPopupModal = false;
  }

  onValueChanged(id: any, params: any) {
    if (id === 'country') {
      if (this.selectedCountryString !== params) {
        this.selectedCountryString = params;
      }
    }
    if (id === 'exchnage') {
      if (this.selectedExchangeString !== params) {
        this.selectedExchangeString = params;
      }
    }
    if (id === 'status') {
      if (this.selectedStatusString !== params) {
        this.selectedStatusString = params;
      }
    }
    if (id === 'advisorList') {
      if (this.selectedAdvisorListString !== params) {
        this.selectedAdvisorListString = params;
      }
    }
    if (id === 'period') {
      if (this.selectedPeriod !== params) {
        this.selectedPeriod = params;
      }
    }
    if (id == 'currency') {
      if (this.selectedCurrency !== params) {
        this.selectedCurrency = params;
      }
    }
  }

  selectedCountryString: any = '';
  selectedAdvisorListString: any = '';
  selectedExchangeString: any = '';
  selectedStatusString: any = '';
  showDropdown: any;
  isPeriodSelected: any = false;
  periodValue: any = 'Period';
  fromDate: any;
  minDate: any;
  maxDate: any;
  startDatePEVC: any = '2017-03-07';
  endDatePEVC: any = '2022-03-06';
  toDate: any;
  last5Years: any = [];
  dataLength: any = 0;

  getLast5Years() {
    const currentYear = new Date().getFullYear();
    const range = (start: any, stop: any, step: any) =>
      Array.from(
        { length: (stop - start) / step + 1 },
        (_, i) => start + i * step
      );

    return range(currentYear, currentYear - 5, -1).slice(1);
  }

  handlePeriodClick() {
    if (this.showDropdown == false) {
      this.showDropdown = true;
      this.isPeriodSelected == true;
    } else {
      this.showDropdown = true;
      this.isPeriodSelected = !this.isPeriodSelected;
    }
  }

  handleFromDatePickerChange(ev: any) {
    this.startDatePEVC = ev.target.value;
  }
  handleToDatePickerChange(ev: any) {
    this.endDatePEVC = ev.target.value;
  }
  handlePeriodsValues(ev: any) {
    // console.log(ev.target.textContent);

    // this.count_res = 0;
    // this.total_count_res = 3;
    // this.util.loaderService.display(true);
    this.periodValue = ev.target.textContent;
    this.selectedPeriod = ev.target.textContent;

    switch (ev.target.textContent) {
      case 'Last 3 Months':
        this.endDatePEVC = new Date();
        this.startDatePEVC = new Date(
          this.endDatePEVC.getFullYear(),
          this.endDatePEVC.getMonth() - 3,
          this.endDatePEVC.getDate()
        );
        this.startDatePEVC = this.startDatePEVC.toISOString().slice(0, 10);
        this.endDatePEVC = new Date().toISOString().slice(0, 10);
        break;

      case 'Last 12 Months':
        // this.getPeriodDatesPEVC(1);
        break;

      case 'Last 3 Years':
        // this.getPeriodDatesPEVC(3);
        break;

      case 'Last 5 Years':
        // this.getPeriodDatesPEVC(5);
        break;

      case 'Last 10 Years':
        // this.getPeriodDatesPEVC(10);
        break;

      case 'Last 20 Years':
        // this.getPeriodDatesPEVC(10);
        break;

      case ev.target.textContent:
        this.startDatePEVC = `${ev.target.textContent}-01-01`;
        this.endDatePEVC = `${ev.target.textContent}-12-31`;
        break;

      default:
        break;
    }
    this.isPeriodSelected = false;
  }

  downloadFilteredExcel() {
    this.fiancialService.downloadIpoData('advance-search-sheet').subscribe(
      (res: any) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);
        const blob = new Blob([res.body], {
          type: 'application/vnd.ms.excel',
        });
        const file = new File([blob], '' + `advance-search-sheet.xlsx`, {
          type: 'application/vnd.ms.excel',
        });
        saveAs(file);
      },
      (err: any) => {
        console.error(err);
      }
    );
  }

  handleGoBtn() {
    this.isPeriodSelected = false;
    this.periodValue = 'Period - Custom';
  }

  changeValue(id: any, e: any) {
    setTimeout(() => {
      if (id == 'min') {
        this.minvalue = e.target.value;
      }
      if (id == 'max') {
        this.maxValue = e.target.value;
      }
    }, 1000);
  }

  onSearch() {
    this.count_res = 0;
    this.total_count_res = 1;
    this.util.loaderService.display(true);
    var obj: any = {};
    // console.log(
    //   this.selectedCountryString,
    //   '----count---',
    //   this.selectedExchangeString,
    //   '----selectedex----',
    //   this.selectedStatusString,
    //   '----status----',
    //   this.selectedPeriod,
    //   '----period----',
    //   this.selectedAdvisorListString,
    //   '----advisor---',
    //   this.selectedCurrency,
    //   '---------------curr'
    // );
    // const data =

    if (
      this.selectedCountryString !== '' &&
      this.selectedCountryString.length !== 0
    ) {
      obj.cntry_inc = this.selectedCountryString;
      this.currentPage = 1;
    }
    if (
      this.selectedExchangeString !== '' &&
      this.selectedExchangeString.length !== 0
    ) {
      obj.mic = this.selectedExchangeString;
      this.currentPage = 1;
    }
    if (
      this.selectedStatusString !== '' &&
      this.selectedStatusString.length !== 0
    ) {
      obj.status = this.selectedStatusString;
      this.currentPage = 1;
    }
    if (this.selectedPeriod !== '' && this.selectedPeriod.length !== 0) {
      obj.period = [this.selectedPeriod];
    }
    if (
      this.selectedAdvisorListString !== '' &&
      this.selectedAdvisorListString.length !== 0
    ) {
      obj.advisor = this.selectedAdvisorListString;
      this.currentPage = 1;
    }
    if (this.selectedCurrency !== '') {
      obj.currency = [this.selectedCurrency];
      this.currentPage = 1;
    }

    // if (this.minvalue) {
    obj.min = [this.minvalue ? this.minvalue : '0'];
    // }
    // if (this.maxValue) {
    obj.max = [this.maxValue ? this.maxValue : '800000'];
    // }

    this.ipo_table_data_modal.value = [];
    this.fiancialService
      .getAdvanceSearchIpoData(this.currentPage, obj)
      .subscribe(
        (res) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);
          res[0].data.map((elemet: any) => {
            this.ipo_table_data_modal.value.push({
              companyName: elemet.issuer_name,
              country: elemet.cntry_inc == null ? '-' : elemet.cntry_inc,
              exchange: elemet.mic == 'null' ? '-' : elemet.mic,
              issueOpenDate:
                elemet.sub_period_from == null ? '-' : elemet.sub_period_from,
              issueCloseDate:
                elemet.sub_period_to == null ? '-' : elemet.sub_period_to,
              listingDate:
                elemet.first_trading_date == null
                  ? '-'
                  : elemet.first_trading_date,
              securityType:
                elemet.sec_description == 'null' ? '-' : elemet.sec_description,
              currency: elemet.currency,
              offerSize:
                elemet.total_offer_size == 'null'
                  ? ''
                  : this.util.standardFormat(elemet.total_offer_size, 2, ''),
              proposedPrice:
                elemet.proposed_price == null ? '-' : elemet.proposed_price,
              ipoPriceChange:
                elemet.share_price_lowest == elemet.share_price_highest
                  ? elemet.share_price_highest == null
                    ? '-'
                    : elemet.share_price_highest
                  : elemet.share_price_lowest == null ||
                    elemet.share_price_highest == null
                  ? elemet.share_price_highest ?? elemet.share_price_lowest
                  : `${
                      elemet.share_price_lowest !== null &&
                      elemet.share_price_lowest
                    } - ${
                      elemet.share_price_highest !== null &&
                      elemet.share_price_highest
                    }`,
            });
          });
          this.dataLength = res[0].data_length;
        },
        (err) => {
          console.error(err);
        }
      );
  }

  onPageChanged(e: any) {
    this.currentPage = e;
    this.onSearch();
  }
}

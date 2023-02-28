import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FinancialMarketDataService } from 'src/app/services/financialmarketdata.service';
import { UtilService } from 'src/app/services/util.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-ipo-modal',
  templateUrl: './ipo-modal.component.html',
  styleUrls: ['./ipo-modal.component.scss'],
})
export class IpoModalComponent implements OnInit, OnChanges {
  @Input() apiType: any;
  @Input() modalTypeIPO: any;
  @Input() upcoming_ipo_modal_table_data: any;
  @Input() subscription_ipo_modal_table_data: any;
  @Input() historical_ipo_modal_table_data: any;
  @Input() countryData: any;
  @Input() exchnageData: any;
  @Input() securityType: any;
  @Input() company_name: any;
  @Input() upcommingDataLength: any;
  @Input() openSubsDataLength: any;
  @Input() historicalDataLength: any;
  @Input() ngSelectMultipleOption: any;
  @Input() periodData: any;
  @Input() statusList: any;
  @Input() industrydata: any;
  @Input() downloadType: any;
  @Input() selectedCountryInput: any;
  @Input() ipoSelectedCurrency: any;

  @Output() rumoured_data = new EventEmitter<any>();

  selectedCountry: any = '';
  selectExchange: any = '';
  selectedSecurity: any = '';
  selectedCompany: any = '';
  selectedPeriod: any = '';
  selectedStatus: any = '';
  selectedIndustry: any = '';
  count_res: any = 0;
  total_count_res: any = '';
  sortingAscDec: any = true;
  companyList: any = [];
  IpoNgSelectoptions = {
    multiple: true,
    // tags: true,
  };

  constructor(
    public auth: AuthService,
    private financialMarketData: FinancialMarketDataService,
    public util: UtilService
  ) {}

  ngOnInit(): void {
    this.selectedCountry = this.selectedCountryInput
      ? this.selectedCountryInput
      : '';

    var data;
    if (this.modalTypeIPO == 'Upcoming IPOs') {
      data = this.statusList.filter((data: any) => {
        return data.text != 'HISTORY';
      });
    } else {
      data = this.statusList;
    }
    this.statusList = data;
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.getDropdownFilterdCompanies();
  }

  ipoModalClose() {
    if (
      this.selectedCountry == '' &&
      this.selectExchange == '' &&
      this.selectedSecurity == '' &&
      this.selectedCompany == ''
    ) {
      this.auth.openIPOModal = false;
    } else {
      this.ipoSelectedCurrency = '';
      this.selectedCountry = '';
      this.selectExchange = '';
      this.selectedStatus = '';
      this.selectedSecurity = '';
      this.selectedIndustry = '';
      this.selectedCompany = '';
      this.selectedPeriod = '';
      this.sortingKey = '';
      this.count_res = 0;
      this.total_count_res = 1;
      this.util.loaderService.display(true);
      this.selectedPage = 1;
      this.auth.openIPOModal = false;

      // var params = `${this.apiType}-list/${this.selectedPage}/10`;
      // this.getIpoPagesData(params);
      this.getFilteredIpoData();
    }
  }

  defaulTablesData() {
    this.count_res = 0;
    this.total_count_res = 1;
    this.util.loaderService.display(true);
    this.selectedPage = 1;
    this.auth.openIPOModal = false;
    var params = `${this.apiType}-list/${this.selectedPage}/10`;
    this.getIpoPagesData(params);
  }

  selectedCountryArray: any = [];
  selectedexchangeArray: any = [];
  selectedsecurityString: any;
  selectedcompanyNameString: any;

  onModalValueChanged(id: any, e: any) {
    if (id == 'country') {
      if (this.selectedCountry?.length !== e?.length) {
        this.count_res = 0;
        this.total_count_res = 2;
        this.selectedPage = 1;
        this.util.loaderService.display(true);
        this.selectedCountry = e.filter((n: any) => n);
        this.getFilteredIpoData();
        this.getDropdownFilterdCompanies();
      }
    }
    if (id == 'exchnage') {
      if (this.selectExchange?.length !== e?.length) {
        this.count_res = 0;
        this.total_count_res = 2;
        this.selectedPage = 1;
        this.util.loaderService.display(true);
        this.selectExchange = e.filter((n: any) => n);
        this.getFilteredIpoData();
        this.getDropdownFilterdCompanies();
      }
    }
    if (id == 'status') {
      if (this.selectedStatus?.length !== e?.length) {
        this.count_res = 0;
        this.total_count_res = 2;
        this.selectedPage = 1;
        this.util.loaderService.display(true);
        this.selectedStatus = e.filter((n: any) => n);
        this.getFilteredIpoData();
        this.getDropdownFilterdCompanies();
      }
    }
    if (id == 'security') {
      if (this.selectedSecurity?.length !== e?.length) {
        this.count_res = 0;
        this.total_count_res = 2;
        this.util.loaderService.display(true);
        this.selectedSecurity = e.filter((n: any) => n);
        this.getFilteredIpoData();
        this.selectedPage = 1;
        this.getDropdownFilterdCompanies();
      }
    }
    if (id == 'comName') {
      if (this.selectedCompany?.toString() !== e?.toString()) {
        this.count_res = 0;
        this.total_count_res = 2;
        this.util.loaderService.display(true);
        this.selectedCompany = e.filter((n: any) => n);
        this.getFilteredIpoData();
        this.selectedPage = 1;
        this.getDropdownFilterdCompanies();
      }
    }
    if (id == 'industry') {
      if (this.selectedIndustry?.length !== e?.length) {
        this.count_res = 0;
        this.total_count_res = 2;
        this.util.loaderService.display(true);
        this.selectedIndustry = e;
        this.getFilteredIpoData();
        this.selectedPage = 1;
        this.getDropdownFilterdCompanies();
      }
    }
    if (id == 'period') {
      if (this.selectedPeriod !== e) {
        this.count_res = 0;
        this.total_count_res = 2;
        this.util.loaderService.display(true);
        this.selectedPeriod = e;
        this.getFilteredIpoData();
        this.selectedPage = 1;
        this.getDropdownFilterdCompanies();
      }
    }
  }

  selectedPage = 1;
  getFilteredIpoData() {
    this.companyList = [];
    if (this.apiType == 'upcoming-ipo') {
      this.upcoming_ipo_modal_table_data.value = [];
    } else if (this.apiType == 'open-for-subscription-ipo') {
      this.subscription_ipo_modal_table_data.value = [];
    } else if (this.apiType == 'historical-ipo') {
      this.historical_ipo_modal_table_data.value = [];
    }
    var body: any = {};
    if (this.ipoSelectedCurrency) {
      body.currency = [this.ipoSelectedCurrency];
    }
    if (this.selectedCountry?.length > 0) {
      body.cntry_inc = this.selectedCountry;
    }
    if (this.selectExchange?.length > 0) {
      body.mic = this.selectExchange;
    }
    if (this.selectedStatus?.length > 0) {
      body.status = this.selectedStatus;
    }
    if (this.selectedSecurity?.length > 0) {
      body.sec_description = this.selectedSecurity;
    }
    if (this.selectedCompany?.length > 0) {
      body.issuer_name = this.selectedCompany;
    }
    if (this.selectedIndustry?.length > 0) {
      body.industry = this.selectedIndustry;
    }
    if (this.selectedPeriod !== '') {
      body.period = [this.selectedPeriod];
    }
    if (this.sortingKey !== '') {
      body.column_key = [this.sortingKey];
      body.sorting_order = [this.sortingFunction];
    }
    this.financialMarketData
      .getFilteredIpos(this.apiType, this.selectedPage, body)
      .subscribe((res: any) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);
        // console.log(res);
        res[0].data.forEach((ele: any) => {
          if (this.apiType == 'upcoming-ipo') {
            this.upcoming_ipo_modal_table_data.value.push({
              compId: ele.id,
              status: ele.status,
              companyName: ele.issuer_name,
              country: ele.cntry_inc === 'null' ? '-' : ele.cntry_inc,
              exchange: ele.mic === 'null' ? '-' : ele.mic,
              issueOpenDate:
                ele.sub_period_from == 'null' ? '-' : ele.sub_period_from,
              securityType:
                ele.sec_description === 'null' ? '-' : ele.sec_description,
              currency: ele.currency == 'null' ? '-' : ele.currency,
              offerSize:
                ele.total_offer_size == 'null'
                  ? '-'
                  : this.util.standardformatCustom(ele.total_offer_size, 2, ''),
              proposedPrice:
                ele.proposed_price == 'null' ? '-' : ele.proposed_price,
              ipoPriceChange:
                ele.share_price_lowest == ele.share_price_highest
                  ? ele.share_price_highest == null
                    ? '-'
                    : ele.share_price_highest
                  : ele.share_price_lowest !== null
                  ? ele.share_price_lowest
                  : ele.share_price_highest !== null
                  ? ele.share_price_highest
                  : `${
                      ele.share_price_lowest !== null &&
                      ele.share_price_lowest !== ele.share_price_highest &&
                      ele.share_price_lowest
                    } - ${
                      ele.share_price_highest !== null &&
                      ele.share_price_highest !== ele.share_price_lowest &&
                      ele.share_price_highest
                    }`,
              rumoured: ele.status == 'Rumour' ? true : false,
              icon: true,
              notes: ele.notes,
            });
            this.upcommingDataLength = res[0].data_length;
          } else if (this.apiType == 'open-for-subscription-ipo') {
            this.subscription_ipo_modal_table_data.value.push({
              companyName: ele.issuer_name,
              country: ele.cntry_inc === 'null' ? '-' : ele.cntry_inc,
              exchange: ele.mic === 'null' ? '-' : ele.mic,
              issueCloseDate: ele.sub_period_to ? ele.sub_period_to : '-',
              issueOpenDate: ele.sub_period_from ? ele.sub_period_from : '-',
              currency: ele.currency == 'null' ? '-' : ele.currency,
              securityType:
                ele.sec_description === 'null' ? '-' : ele.sec_description,
              offerSize:
                ele.total_offer_size == 'null'
                  ? '-'
                  : this.util.standardformatCustom(ele.total_offer_size, 2, ''),
              proposedPrice:
                ele.proposed_price == 'null' ? '-' : ele.proposed_price,
              ipoPriceChange:
                ele.share_price_lowest == ele.share_price_highest
                  ? ele.share_price_highest == null
                    ? '-'
                    : ele.share_price_highest
                  : ele.share_price_lowest !== null
                  ? ele.share_price_lowest
                  : ele.share_price_highest !== null
                  ? ele.share_price_highest
                  : `${
                      ele.share_price_lowest !== null &&
                      ele.share_price_lowest !== ele.share_price_highest &&
                      ele.share_price_lowest
                    } - ${
                      ele.share_price_highest !== null &&
                      ele.share_price_highest !== ele.share_price_lowest &&
                      ele.share_price_highest
                    }`,
              icon: true,
              notes: ele.notes,
            });
            this.openSubsDataLength = res[0].data_length;
          } else if (this.apiType == 'historical-ipo') {
            this.historical_ipo_modal_table_data.value.push({
              companyName: ele.issuer_name,
              country: ele.cntry_inc === 'null' ? '-' : ele.cntry_inc,
              exchange: ele.mic === 'null' ? '-' : ele.mic,
              listingDate:
                ele.first_trading_date == null ? '-' : ele.first_trading_date,
              issueOpenDate: ele.sub_period_from ? ele.sub_period_from : '-',
              currency: ele.currency == 'null' ? '-' : ele.currency,
              securityType:
                ele.sec_description === 'null' ? '-' : ele.sec_description,
              offerSize:
                ele.total_offer_size == 'null'
                  ? '-'
                  : this.util.standardformatCustom(ele.total_offer_size, 2, ''),
              issuePrice: '',
              listingDayReturn:
                ele.listing_day_return == 'null'
                  ? '-'
                  : this.util.standardformatCustom(
                      ele.listing_day_return,
                      2,
                      ''
                    ),
              // priceReturn: '',
              icon: true,
              notes: ele.notes,
            });
            this.historicalDataLength = res[0].data_length;
          }
        });
      });
  }

  rumouredTableDataHandler(event: any) {
    this.rumoured_data.emit(event);
  }
  onPageChage(e: any) {
    this.selectedPage = e;
    // if (
    //   this.selectedCountry.length == 0 &&
    //   this.selectExchange.length == 0 &&
    //   this.selectedSecurity == '' &&
    //   this.selectedCompany == ''
    // ) {
    //   this.count_res = 0;
    //   this.total_count_res = 1;
    //   this.util.loaderService.display(true);

    //   var params = `${this.apiType}-list/${this.selectedPage}/10`;
    //   this.getIpoPagesData(params);
    // } else {
    this.count_res = 0;
    this.total_count_res = 2;
    this.util.loaderService.display(true);
    this.getFilteredIpoData();
    this.getDropdownFilterdCompanies();

    // }
  }

  downloadFilteredExcel() {
    var params = this.downloadType;

    this.financialMarketData.downloadIpoData(params).subscribe(
      (res: any) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);
        const blob = new Blob([res.body], {
          type: 'application/vnd.ms.excel',
        });
        const file = new File([blob], '' + `${params}.xls`, {
          type: 'application/vnd.ms.excel',
        });
        saveAs(file);
      },
      (err) => {
        console.error(err);
        ++this.count_res;
      }
    );
  }

  getIpoPagesData(params: any) {
    if (this.apiType == 'upcoming-ipo') {
      this.upcoming_ipo_modal_table_data.value = [];
    } else if (this.apiType == 'open-for-subscription-ipo') {
      this.subscription_ipo_modal_table_data.value = [];
    } else if (this.apiType == 'historical-ipo') {
      this.historical_ipo_modal_table_data.value = [];
    }
    this.financialMarketData.getIpoPageData(params).subscribe(
      (res) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);
        res[0].data.forEach((ele: any) => {
          if (this.apiType == 'upcoming-ipo') {
            this.upcoming_ipo_modal_table_data.value.push({
              compId: ele.id,
              status: ele.status,
              companyName: ele.issuer_name,
              country: ele.cntry_inc === null ? '-' : ele.cntry_inc,
              exchange: ele.mic === 'null' ? '-' : ele.mic,
              issueOpenDate:
                ele.sub_period_from == null ? '-' : ele.sub_period_from,
              securityType:
                ele.sec_description === 'null' ? '-' : ele.sec_description,
              currency: ele.currency == 'null' ? '-' : ele.currency,
              offerSize:
                ele.total_offer_size == 'null'
                  ? '-'
                  : this.util.standardFormat(ele.total_offer_size, 2, ''),
              proposedPrice:
                ele.proposed_price == 'null' ? '-' : ele.proposed_price,
              ipoPriceChange:
                ele.share_price_lowest == ele.share_price_highest
                  ? ele.share_price_highest == null
                    ? '-'
                    : ele.share_price_highest
                  : ele.share_price_lowest !== null
                  ? ele.share_price_lowest
                  : ele.share_price_highest !== null
                  ? ele.share_price_highest
                  : `${
                      ele.share_price_lowest !== null &&
                      ele.share_price_lowest !== ele.share_price_highest &&
                      ele.share_price_lowest
                    } - ${
                      ele.share_price_highest !== null &&
                      ele.share_price_highest !== ele.share_price_lowest &&
                      ele.share_price_highest
                    }`,
              rumoured: ele.status == 'Rumour' ? true : false,
              icon: true,
              notes: ele.notes,
            });
            this.upcommingDataLength = res[0].data_length;
          } else if (this.apiType == 'open-for-subscription-ipo') {
            this.subscription_ipo_modal_table_data.value.push({
              companyName: ele.issuer_name,
              country: ele.cntry_inc === null ? '-' : ele.cntry_inc,
              exchange: ele.mic === 'null' ? '-' : ele.mic,
              issueCloseDate: ele.sub_period_to ? ele.sub_period_to : '-',
              issueOpenDate: ele.sub_period_from ? ele.sub_period_from : '-',
              currency: ele.currency == 'null' ? '-' : ele.currency,
              securityType:
                ele.sec_description === 'null' ? '-' : ele.sec_description,
              offerSize:
                ele.total_offer_size == 'null'
                  ? '-'
                  : this.util.standardFormat(ele.total_offer_size, 2, ''),
              proposedPrice:
                ele.proposed_price == 'null' ? '-' : ele.proposed_price,
              ipoPriceChange:
                ele.share_price_lowest == ele.share_price_highest
                  ? ele.share_price_highest == null
                    ? '-'
                    : ele.share_price_highest
                  : ele.share_price_lowest !== null
                  ? ele.share_price_lowest
                  : ele.share_price_highest !== null
                  ? ele.share_price_highest
                  : `${
                      ele.share_price_lowest !== null &&
                      ele.share_price_lowest !== ele.share_price_highest &&
                      ele.share_price_lowest
                    } - ${
                      ele.share_price_highest !== null &&
                      ele.share_price_highest !== ele.share_price_lowest &&
                      ele.share_price_highest
                    }`,
              icon: true,
              notes: ele.notes,
            });
            this.openSubsDataLength = res[0].data_length;
          } else if (this.apiType == 'historical-ipo') {
            this.historical_ipo_modal_table_data.value.push({
              companyName: ele.issuer_name,
              country: ele.cntry_inc === null ? '-' : ele.cntry_inc,
              exchange: ele.mic === 'null' ? '-' : ele.mic,
              listingDate:
                ele.first_trading_date == null ? '-' : ele.first_trading_date,
              issueOpenDate: ele.sub_period_from ? ele.sub_period_from : '-',
              currency: ele.currency == 'null' ? '-' : ele.currency,
              securityType:
                ele.sec_description === 'null' ? '-' : ele.sec_description,
              offerSize:
                ele.total_offer_size == 'null'
                  ? '-'
                  : this.util.standardFormat(ele.total_offer_size, 2, ''),
              issuePrice:
                ele.proposed_price === 'null' ? '-' : ele.proposed_price,
              listingDayReturn: '',
              priceReturn: '',
            });
            this.historicalDataLength = res[0].data_length;
          }
        });
      },

      (err) => {
        console.error(err);
      }
    );
  }
  alertmsg: any;
  onNoData(e: any) {
    this.alertmsg = 'No Notes Found';
    this.auth.closeInsidePopup = true;
  }
  getDropdownFilterdCompanies() {
    var body: any = {};
    if (this.ipoSelectedCurrency) {
      body.currency = [this.ipoSelectedCurrency];
    }
    if (this.selectedCountry?.length > 0) {
      body.cntry_inc = this.selectedCountry;
    } else {
      body.cntry_inc = [''];
    }
    if (this.selectExchange?.length > 0) {
      body.mic = this.selectExchange;
    } else {
      body.mic = [''];
    }
    if (this.selectedStatus?.length > 0) {
      body.status = this.selectedStatus;
    } else {
      body.status = [''];
    }
    if (this.selectedSecurity?.length > 0) {
      body.sec_description = this.selectedSecurity;
    } else {
      body.sec_description = [''];
    }
    if (this.selectedCompany?.length > 0) {
      body.issuer_name = this.selectedCompany;
    } else {
      body.issuer_name = [''];
    }
    if (this.selectedIndustry?.length > 0) {
      body.industry = this.selectedIndustry;
    } else {
      body.industry = [''];
    }
    if (this.selectedPeriod !== '') {
      body.period = [this.selectedPeriod];
    } else {
      body.period = [''];
    }
    if (this.sortingKey !== '') {
      body.column_key = [this.sortingKey];
      body.sorting_order = [this.sortingFunction];
    }
    this.financialMarketData.getIpoCompanies('companies', body).subscribe(
      (res) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);
        var formattedData: any = [];
        res.forEach((data: any) => {
          formattedData.push({
            id: data?.issuer_name,
            text: data?.issuer_name,
          });
        });
        this.companyList = formattedData;
      },
      (err) => {
        ++this.count_res;
      }
    );
  }
  prevEvent: any;
  sortingFunction: any;
  sortingKey: any = '';
  handleSorting(event: any) {
    this.count_res = 0;
    this.total_count_res = 1;
    this.util.loaderService.display(true);
    this.sortingKey = event;
    if (event == this.prevEvent) {
      this.sortingAscDec = !this.sortingAscDec;
    } else {
      this.sortingAscDec = true;
      this.prevEvent = null;
    }
    this.sortingFunction = this.sortingAscDec == false ? 'ASC' : 'DESC';
    this.getFilteredIpoData();
    this.prevEvent = event;
  }
}

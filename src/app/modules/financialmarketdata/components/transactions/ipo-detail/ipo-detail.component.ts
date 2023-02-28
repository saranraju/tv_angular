import {
  Component,
  DoCheck,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FinancialMarketDataService } from 'src/app/services/financialmarketdata.service';
import { UtilService } from 'src/app/services/util.service';
import { saveAs } from 'file-saver';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-ipo-detail',
  templateUrl: './ipo-detail.component.html',
  styleUrls: ['./ipo-detail.component.scss'],
})
export class IpoDetailComponent implements OnInit, DoCheck {
  @Input() ipoDetailsevent: any;
  @Input() apiType: any;
  @Input() company_name: any;

  selectedCompany: any = '';
  selectedCurrency: any = '';
  @Output() back_button = new EventEmitter<any>();
  ipo_table_data_detail_one: any = {
    title: [
      {
        label: 'Company Name',
        key: 'key',
      },
      {
        label: 'Country',
        key: 'value',
        align: 'end',
      },
    ],
    value: [],
  };

  ipo_table_data_detail_two: any = {
    title: [
      {
        label: 'Company Name',
        key: 'key',
      },
      {
        label: 'Country',
        key: 'value',
        align: 'end',
      },
    ],
    value: [],
  };
  ipo_table_data_detail_three: any = {
    title: [
      {
        label: 'Company Name',
        key: 'iponotes',
      },
      {
        label: 'Country',
        key: 'country',
        align: 'end',
      },
    ],
    value: [],
  };
  ipo_table_data_detail_four: any = {
    title: [
      {
        label: 'Metric',
        key: 'metric',
      },
      {
        label: 'Initial Offer',
        key: 'initialOffer',
        align: 'center',
      },
      {
        label: 'Revised Offer',
        key: 'revisedOffer',
        align: 'center',
      },
      {
        label: 'Final Offer',
        key: 'finalOffer',
        align: 'center',
      },
    ],
    value: [],
  };
  constructor(
    private financialMarketData: FinancialMarketDataService,
    public auth: AuthService,
    public util: UtilService,
    private router: Router
  ) {}

  count_res: any = 0;
  total_count_res: any = '';

  ngOnInit(): void {
    this.count_res = 0;
    this.total_count_res = 5;
    this.util.loaderService.display(true);
    this.ngDoCheck();
    // this.countryListHandler();
    this.currencyListHandler();
    this.getIpoCompanyData();
    this.getCompanyRedirect();
  }
  check = 0;
  ngDoCheck(): void {
    if (this.check <= 1) {
      this.getIpoDetails();
      this.check++;
    }
  }
  companyName: any;
  country: any;
  exchange: any;
  ticker: any;
  status: any;
  finalTableOne: any;
  currencyData: any;

  compamyRedirectData: any;
  getCompanyRedirect() {
    var obj: any = {};
    obj.issuer_name = this.ipoDetailsevent.companyName;
    this.financialMarketData.getCompanyRedirectData(obj).subscribe((res) => {
      ++this.count_res;
      this.util.checkCountValue(this.total_count_res, this.count_res);
      this.compamyRedirectData = res;
    });
  }
  tabIndustryInstance: any;
  routeToCompanyPage() {
    if (this.compamyRedirectData.length > 0) {
      const url = this.router.serializeUrl(
        this.router.createUrlTree(['/financialmarketdata/company'], {
          // relativeTo: this.route,
          queryParams: {
            comp_id: this.compamyRedirectData[0]?.company_id,
            company_name: this.compamyRedirectData[0]?.proper_name,
            currency: this.compamyRedirectData[0]?.currency,
            security_id: this.compamyRedirectData[0]?.security_id,
            entity_id: this.compamyRedirectData[0]?.factset_entity_id,
            tabName: 'company',
          },
          // queryParamsHandling: 'merge',
        })
      );
      this.tabIndustryInstance = window.open(url, '_blank');
    }
  }

  getIpoDetails() {
    var obj: any = {};
    if (this.selectedCurrency !== '') {
      obj.currency = this.selectedCurrency;
    }
    this.financialMarketData
      .getissueDetailsCurrency(this.ipoDetailsevent.companyName, obj)
      .subscribe(
        (res) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);
          var dataRcvd = res[0].issue_details[0];
          var initalOffer = res[0].offer_revision[0]?.initial_offer;
          var revised_offer = res[0].offer_revision[0]?.revised_offer;
          var final_offer = res[0].offer_revision[0]?.final_offer;
          var initalOfferNotes: any = {};
          initalOfferNotes.notes = initalOffer?.notes;
          initalOfferNotes.id = initalOffer?.id;
          var revisedOfferNotes: any = {};
          revisedOfferNotes.notes = revised_offer?.notes;
          revisedOfferNotes.id = revised_offer?.id;
          var finalOfferNotes: any = {};
          finalOfferNotes.notes = final_offer?.notes;
          finalOfferNotes.id = final_offer?.id;

          this.companyName = dataRcvd.issuer_name;
          this.country = dataRcvd.cntry_inc;
          this.status = dataRcvd.status;
          this.exchange = dataRcvd.mic == 'null' ? '' : `${dataRcvd.mic}`;
          this.ticker = dataRcvd.symbol == 'null' ? '' : `${dataRcvd.symbol}`;
          this.currencyData =
            dataRcvd?.currency === 'null' ? '' : dataRcvd?.currency;

          this.ipo_table_data_detail_one.value = [
            {
              order: 1,
              key: `Offer Size (${this.currencyData} M)`,
              value:
                dataRcvd.total_offer_size == 'null'
                  ? '-'
                  : this.util.standardFormat(dataRcvd.total_offer_size, 2, ''),
            },
            {
              order: 2,
              key: `Proposed Price (${this.currencyData})`,
              value:
                dataRcvd.proposed_price == 'null'
                  ? '-'
                  : dataRcvd.proposed_price,
            },
            {
              order: 3,
              key: `Issue Price Range (${this.currencyData})`,
              value:
                dataRcvd?.share_price_lowest == dataRcvd?.share_price_highest
                  ? dataRcvd?.share_price_highest == null
                    ? '-'
                    : dataRcvd?.share_price_highest
                  : dataRcvd?.share_price_lowest == null ||
                    dataRcvd?.share_price_highest == null
                  ? dataRcvd?.share_price_highest ??
                    dataRcvd?.share_price_lowest
                  : `${
                      dataRcvd?.share_price_lowest !== null &&
                      dataRcvd?.share_price_lowest
                    } - ${
                      dataRcvd?.share_price_highest !== null &&
                      dataRcvd?.share_price_highest
                    }`,
            },
            {
              order: 4,
              key: `Max Share Offered (${this.currencyData})`,
              value:
                dataRcvd.maxSharesOffered == null
                  ? '-'
                  : dataRcvd.maxSharesOffered,
            },
            {
              order: 5,
              key: 'Shares Outstanding',
              value:
                dataRcvd.shares_out_standing == null
                  ? '-'
                  : dataRcvd.shares_out_standing,
            },
          ];
          this.ipo_table_data_detail_one.value =
            this.ipo_table_data_detail_one.value.sort(
              (a: any, b: any) => a.order - b.order
            );

          this.ipo_table_data_detail_two.value = [
            {
              order: 1,
              key: 'Issue Open Date',
              value:
                dataRcvd.sub_period_from == null
                  ? '-'
                  : dataRcvd.sub_period_from,
            },
            {
              order: 2,
              key: 'Issue Close Date',
              value:
                dataRcvd.sub_period_to == null ? '-' : dataRcvd.sub_period_to,
            },
            {
              order: 3,
              key: 'Listing Date',
              value:
                dataRcvd.first_trading_date == null
                  ? '-'
                  : dataRcvd.first_trading_date,
            },
            {
              order: 4,
              key: 'Security Type',
              value:
                dataRcvd.sec_description == 'null'
                  ? '-'
                  : dataRcvd.sec_description,
            },
            {
              order: 5,
              key: 'Lot Size',
              value: dataRcvd.lot_size == 'null' ? '-' : dataRcvd.lot_size,
            },
          ];
          this.ipo_table_data_detail_two.value =
            this.ipo_table_data_detail_two.value.sort(
              (a: any, b: any) => a.order - b.order
            );
          this.ipo_table_data_detail_three.value = [
            {
              order: 1,
              iponotes: 'Underwriter',
              country:
                dataRcvd.under_writer == 'null' ? '-' : dataRcvd.under_writer,
            },
            {
              order: 2,
              iponotes: 'Underwriting Level',
              country: dataRcvd.deal_type == 'null' ? '-' : dataRcvd.deal_type,
            },
            {
              order: 3,
              iponotes: 'Law Firm',
              country: dataRcvd.law_firm == 'null' ? '-' : dataRcvd.law_firm,
            },
            {
              order: 3,
              iponotes: 'Transfer Agent',
              country:
                dataRcvd.transfer_agent == 'null'
                  ? '-'
                  : dataRcvd.transfer_agent,
            },
            {
              order: 5,
              iponotes: 'IPO Notes',
              icon: true,
              notes: dataRcvd.notes,
              id: dataRcvd.id,
              type: 'ipo-notes',
            },
          ];
          // 'DD-MM-YYYY'
          this.ipo_table_data_detail_three.value =
            this.ipo_table_data_detail_three.value.sort(
              (a: any, b: any) => a.order - b.order
            );
          this.ipo_table_data_detail_four.value = [
            {
              order: 1,
              metric: 'Effective Date',
              initialOffer:
                initalOffer?.modified == 'null' ? '-' : initalOffer?.modified,
              revisedOffer:
                revised_offer?.modified == 'null'
                  ? '-'
                  : revised_offer?.modified,
              finalOffer:
                final_offer?.modified == 'null' ? '-' : final_offer?.modified,
            },
            {
              order: 2,
              metric: `Offer Size (${this.currencyData} M)`,
              initialOffer:
                initalOffer?.total_offer_size == 'null'
                  ? '-'
                  : initalOffer?.total_offer_size,
              revisedOffer:
                revised_offer?.total_offer_size == 'null'
                  ? '-'
                  : revised_offer?.total_offer_size,
              finalOffer:
                final_offer?.total_offer_size == 'null'
                  ? '-'
                  : final_offer?.total_offer_size,
            },
            {
              order: 3,
              metric: `Issue Price (${this.currencyData})`,
              initialOffer:
                initalOffer?.proposed_price == 'null'
                  ? '-'
                  : initalOffer?.proposed_price,
              revisedOffer:
                revised_offer?.proposed_price == 'null'
                  ? '-'
                  : revised_offer?.proposed_price,
              finalOffer:
                final_offer?.proposed_price == 'null'
                  ? '-'
                  : final_offer?.proposed_price,
            },
            {
              order: 4,
              metric: `Issue Price Range (${this.currencyData})`,
              initialOffer:
                initalOffer?.share_price_lowest ==
                initalOffer?.share_price_highest
                  ? initalOffer?.share_price_highest == null
                    ? '-'
                    : initalOffer?.share_price_highest
                  : initalOffer?.share_price_lowest == null ||
                    initalOffer?.share_price_highest == null
                  ? initalOffer?.share_price_highest ??
                    initalOffer?.share_price_lowest
                  : `${
                      initalOffer?.share_price_lowest !== null &&
                      initalOffer?.share_price_lowest
                    } - ${
                      initalOffer?.share_price_highest !== null &&
                      initalOffer?.share_price_highest
                    }`,
              revisedOffer:
                revised_offer?.share_price_lowest ==
                revised_offer?.share_price_highest
                  ? revised_offer?.share_price_highest == null
                    ? '-'
                    : revised_offer?.share_price_highest
                  : revised_offer?.share_price_lowest == null ||
                    revised_offer?.share_price_highest == null
                  ? revised_offer?.share_price_highest ??
                    revised_offer?.share_price_lowest
                  : `${
                      revised_offer?.share_price_lowest !== null &&
                      revised_offer?.share_price_lowest
                    } - ${
                      revised_offer?.share_price_highest !== null &&
                      revised_offer?.share_price_highest
                    }`,
              finalOffer:
                final_offer?.share_price_lowest ==
                final_offer?.share_price_highest
                  ? final_offer?.share_price_highest == null
                    ? '-'
                    : final_offer?.share_price_highest
                  : final_offer?.share_price_lowest == null ||
                    final_offer?.share_price_highest == null
                  ? final_offer?.share_price_highest ??
                    final_offer?.share_price_lowest
                  : `${
                      final_offer?.share_price_lowest !== null &&
                      final_offer?.share_price_lowest
                    } - ${
                      final_offer?.share_price_highest !== null &&
                      final_offer?.share_price_highest
                    }`,
            },
            {
              order: 5,
              metric: 'Max Shares Offered',
              initialOffer:
                initalOffer?.max_shares_offered == 'null'
                  ? '-'
                  : initalOffer?.max_shares_offered,
              revisedOffer:
                revised_offer?.max_shares_offered == 'null'
                  ? '-'
                  : revised_offer?.max_shares_offered,
              finalOffer:
                final_offer?.max_shares_offered == 'null'
                  ? '-'
                  : final_offer?.max_shares_offered,
            },

            {
              order: 6,
              metric: 'Notes',
              icon: true,
              icon_two: true,
              icon_three: true,
              initalOffer: initalOfferNotes,
              revisedOfferNotes: revisedOfferNotes,
              finalOfferNotes: finalOfferNotes,
            },
          ];
          this.ipo_table_data_detail_four.value =
            this.ipo_table_data_detail_four.value.sort(
              (a: any, b: any) => a.order - b.order
            );
          //  const value = this.sort(this.ipo_table_data_detail_one.value)
        },
        (err) => {
          console.log('error', err.message);
        }
      );
  }
  notesData: any;
  notesId = '';

  countryListIpo: any;
  countryListHandler() {
    this.financialMarketData.getCountry().subscribe(
      (res) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);
        let formattedData: any = [];
        res.forEach((element: any) => {
          formattedData.push({
            id: element.countryIsoCode2,
            text: element.countryName,
          });
          this.countryListIpo = formattedData;
        });
      },
      (err) => {
        console.log('error', err.message);
      }
    );
  }

  currencyDataList: any;
  currencyListHandler() {
    this.financialMarketData.getCurrency().subscribe(
      (res) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);
        let formattedData: any = [];
        res.forEach((element: any) => {
          formattedData.push({
            id: element.isoCode,
            text: element.currencyName + ' (' + element.isoCode + ')',
          });
          this.currencyDataList = formattedData;
        });
      },
      (err) => {
        console.log('error', err.message);
      }
    );
  }

  downloadFilteredExcel() {
    this.financialMarketData.downloadIpoData('issue-details-sheet').subscribe(
      (res: any) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);
        const blob = new Blob([res.body], {
          type: 'application/vnd.ms.excel',
        });
        const file = new File([blob], '' + `issue-details-sheet.xls`, {
          type: 'application/vnd.ms.excel',
        });
        saveAs(file);
      },
      (err) => {
        console.error(err);
      }
    );
  }

  getIpoCompanyData() {
    this.financialMarketData.getIpoCompanyName().subscribe(
      (res) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);
        let formattedData: any = [];
        res.forEach((element: any) => {
          formattedData.push({
            id: element,
            text: element,
          });
          this.company_name = formattedData;
        });
      },
      (err) => {
        console.log('error', err.message);
      }
    );
  }

  valueChangedHandler(id: any, e: any) {
    if (id == 'company') {
      if (this.selectedCompany !== e) {
        this.count_res = 0;
        this.total_count_res = 1;
        this.util.loaderService.display(true);
        this.selectedCompany = e;
        this.ipoDetailsevent.companyName = e;
        this.selectedCurrency = '';
        this.getIpoDetails();
        this.getCompanyRedirect();
      }
    }
    if (id == 'currency') {
      if (this.selectedCurrency !== e) {
        this.selectedCurrency = e;
        this.count_res = 0;
        this.total_count_res = 1;
        this.util.loaderService.display(true);
        this.getIpoDetails();
      }
    }
  }

  backButton() {
    this.back_button.emit(true);
  }

  openModalPopUp(params: any) {
    this.notesData = params.notes;
    this.notesId = params.id;
    if (this.notesData !== '') {
      this.auth.ipoNotesModalOne = true;
    }
  }
  alertmsg: any;
  onNoData(e: any) {
    this.alertmsg = 'No Notes Found';
    this.auth.closeInsidePopup = true;
  }
  openNotesOfferRevision(e: any) {
    if (e.notes == undefined || e.notes == 'null') {
      this.onNoData(e.notes);
    } else {
      this.notesData = e.notes;
      this.notesId = e.id;
      if (this.notesData !== '') {
        this.auth.ipoNotesModalOne = true;
      }
    }
  }
}

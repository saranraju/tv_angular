import { DatePipe } from '@angular/common';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FinancialMarketDataService } from 'src/app/services/financialmarketdata.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-advance-search-modal',
  templateUrl: './advance-search-modal.component.html',
  styleUrls: ['./advance-search-modal.component.scss'],
})
export class AdvanceSearchModalComponent implements OnInit {
  @Input() type: any;
  @Input() isin_number: any;
  @Input() SectorData: any = [];
  @Input() selectedBalanceModel: any;
  industry_table_data = {
    title: [
      {
        label: 'Bond Details',
        shorting: true,
        pointer: true,
        width: '17rem',
        left: '10rem',
        field: 'description',
      },
      {
        label: 'Category',
        shorting: true,
        pointer: true,
        formattedNum: true,
        left: '06rem',
        field: 'industry_lvl_1_desc',
      },
      {
        label: 'Country',
        shorting: true,
        pointer: true,
        formattedNum: true,
        left: '06rem',
        field: 'country_name',
      },
      {
        label: 'Currency',
        shorting: true,
        pointer: true,
        formattedNum: true,
        left: '06rem',
        field: 'iso_currency_code',
      },
      {
        label: 'Tenor in Years',
        shorting: true,
        pointer: true,
        formattedNum: true,
        left: '04rem',
        field: 'effective_duration',
      },
      {
        label: 'Yield to Maturity',
        shorting: true,
        pointer: true,
        formattedNum: true,
        left: '06rem',
        field: 'yield_to_maturity',
      },
      {
        label: 'Modified Duration',
        shorting: true,
        pointer: true,
        formattedNum: true,
        left: '0rem',
        field: 'modified_duration',
      },
    ],
  };
  cds_table_data = {
    title: [
      {
        label: 'Entity Name',
        shorting: true,
        pointer: true,
        width: '17rem',
        left: '10rem',
      },
      {
        label: 'Tenor in Years',
        shorting: true,
        pointer: true,
        formattedNum: true,
        left: '01rem',
      },
      {
        label: 'Currency',
        shorting: true,
        pointer: true,
        formattedNum: true,
        left: '03rem',
      },
      {
        label: 'Par Spread',
        shorting: true,
        pointer: true,
        formattedNum: true,
        left: '02.5rem',
      },
      {
        label: 'Quote Spread',
        shorting: true,
        pointer: true,
        formattedNum: true,
        left: '01.5rem',
      },
      {
        label: 'Upfront Premium',
        shorting: true,
        pointer: true,
        formattedNum: true,
        left: '0.3rem',
      },
      {
        label: 'Hazard Rate',
        shorting: true,
        pointer: true,
        formattedNum: true,
        left: '2rem',
      },
      {
        label: 'Commulative Probability of Default',
        shorting: true,
        pointer: true,
        formattedNum: true,
        left: '1rem',
        width: '10rem',
        alignItems: 'center',
        display: 'flex',
      },
      {
        label: 'Sector',
        shorting: true,
        pointer: true,
        formattedNum: true,
        left: '0rem',
      },
    ],
  };

  tenoryData: any = [
    {
      id: '-',
      text: 'All',
    },
    {
      id: '2:::',
      text: ' < 2',
    },
    {
      id: '2:::3',
      text: '2 to 3',
    },
    {
      id: '3:::4',
      text: '3 to 4',
    },
    {
      id: '4:::5',
      text: '4 to 5',
    },
    {
      id: '5:::6',
      text: '5 to 6',
    },
    {
      id: '6:::7',
      text: '6 to 7',
    },
    {
      id: '7:::8',
      text: '7 to 8',
    },
    {
      id: '8:::10',
      text: '8 to 10',
    },
    {
      id: '10:::20',
      text: '10 to 20',
    },
    {
      id: ':::20',
      text: ' > 20',
    },
  ];
  YieldData: any = [
    {
      id: '-',
      text: 'All',
    },
    {
      id: '-0.05:::',
      text: '< -0.05',
    },
    {
      id: '-0.05:::0.40',
      text: '-0.05 to 0.40',
    },
    {
      id: '0.40:::0.88',
      text: '0.40 to 0.88',
    },
    {
      id: '0.88:::1.43',
      text: '0.88 to 1.43',
    },
    {
      id: '1.43:::2.03',
      text: '1.43 to 2.03',
    },
    {
      id: '2.03:::2.75',
      text: '2.03 to 2.75',
    },
    {
      id: '2.75:::3.25',
      text: '2.75 to 3.25',
    },
    {
      id: '3.25:::3.96',
      text: '3.25 to 3.96',
    },
    {
      id: '3.96:::5.49',
      text: '3.96 to 5.49',
    },
    {
      id: ':::5.49',
      text: ' > 5.49',
    },
  ];
  modifiedData: any = [
    {
      id: '-',
      text: 'All',
    },
    {
      id: '1.67:::',
      text: '< 1.67',
    },
    {
      id: '1.67:::2.35',
      text: '1.67 to 2.35',
    },
    {
      id: '2.35:::3.13',
      text: '2.35 to 3.13',
    },
    {
      id: '3.13:::3.88',
      text: '3.13 to 3.88',
    },
    {
      id: '3.88:::4.62',
      text: '3.88 to 4.62',
    },
    {
      id: '4.62:::5.69',
      text: '4.62 to 5.69',
    },
    {
      id: '5.69:::6.92',
      text: '5.69 to 6.92',
    },
    {
      id: '6.92:::8.95',
      text: '6.92 to 8.95',
    },
    {
      id: '8.95:::14.22',
      text: '8.95 to 14.22',
    },
    {
      id: '8.95 to 14.22',
      text: ' > 14.22 ',
    },
  ];
  par_speed: any = [
    {
      id: '-',
      text: 'All',
    },
    {
      id: '0:::25',
      text: '0 to 25',
    },
    {
      id: '25:::50',
      text: '25 to 50',
    },
    {
      id: '50:::100',
      text: '50 to 100',
    },
    {
      id: '100:::125',
      text: '100 to 125',
    },
    {
      id: '125:::150',
      text: '125 to 150',
    },
    {
      id: '150:::175',
      text: '150 to 175',
    },
    {
      id: '175:::200',
      text: '175 to 200',
    },
    {
      id: '200:::300',
      text: '200 to 300',
    },
    {
      id: '300:::500',
      text: '300 to 500',
    },
    {
      id: ':::500',
      text: ' >500',
    },
  ];
  quote_speed: any = [
    {
      id: '-',
      text: 'All',
    },
    {
      id: '0:::25',
      text: '0 to 25',
    },
    {
      id: '25:::50',
      text: '25 to 50',
    },
    {
      id: '50:::100',
      text: '50 to 100',
    },
    {
      id: '100:::125',
      text: '100 to 125',
    },
    {
      id: '125:::150',
      text: '125 to 150',
    },
    {
      id: '150:::175',
      text: '150 to 175',
    },
    {
      id: '175:::200',
      text: '175 to 200',
    },
    {
      id: '200:::300',
      text: '200 to 300',
    },
    {
      id: '300:::500',
      text: '300 to 500',
    },
    {
      id: ':::500',
      text: ' >500',
    },
  ];
  upfront_premium: any = [
    {
      id: '-',
      text: 'All',
    },
    {
      id: '-10:::',
      text: '< -10',
    },
    {
      id: '-10:::-5',
      text: '-10 to -5',
    },
    {
      id: '-5:::-3',
      text: '-5 to -3',
    },
    {
      id: '-3:::-2',
      text: '-3 to -2 ',
    },
    {
      id: '-2:::-1',
      text: '-2 to -1',
    },
    {
      id: '-1:::0',
      text: '-1 to 0',
    },
    {
      id: '0:::5',
      text: '0 to 5',
    },
    {
      id: ':::5',
      text: '> 5',
    },
  ];
  hazard_rate: any = [
    {
      id: '-',
      text: 'All',
    },
    {
      id: '0:::0.5',
      text: '0 to 0.5',
    },
    {
      id: '0.5:::1',
      text: '0.5 to 1',
    },
    {
      id: '1:::1.5',
      text: '1 to 1.5',
    },
    {
      id: '1.5:::2',
      text: '1.5 to 2 ',
    },
    {
      id: '2:::3',
      text: '2 to 3',
    },
    {
      id: '3:::5',
      text: '3 to 5',
    },
    {
      id: '5:::10',
      text: '5 to 10',
    },
    {
      id: ':::10',
      text: '> 10',
    },
  ];
  cumulative_probability: any = [
    {
      id: '-',
      text: 'All',
    },
    {
      id: '0:::0.5',
      text: '0 to 0.5',
    },
    {
      id: '0.5:::1',
      text: '0.5 to 1',
    },
    {
      id: '1:::1.5',
      text: '1 to 1.5',
    },
    {
      id: '1.5:::2',
      text: '1.5 to 2 ',
    },
    {
      id: '2:::3',
      text: '2 to 3',
    },
    {
      id: '3:::5',
      text: '3 to 5',
    },
    {
      id: '5:::10',
      text: '5 to 10',
    },
    {
      id: ':::10',
      text: '> 10',
    },
  ];
  selectedTenory: any = null;
  selectedYield: any = null;
  selectedModified: any = null;
  advance_search_data: any;
  allBondsData: any;
  allcdsData: any;
  selectCategoryData: any = [];
  selectedCategory: any = 'All';
  selectCurrencyData: any = [];
  selectedCurrency: any = 'All';
  countryData: any = [];
  selectedCountry: any = 'All';
  selectedCountryObj: any;
  search = '';
  search_filter_data: any;
  selectedParSpeed: any = null;
  selectedQuoteSpeed: any = null;
  selectedUpfront: any = null;
  selectedhazard_rate: any = null;
  selectedcumulative_probability: any = null;
  selectedSector: any = 'All';
  count_res: any = 0;
  total_count_res: any = '';
  comportable_Search_table: any;
  no_found = 'false';
  @Output() comportable_table = new EventEmitter<any>();

  constructor(
    public auth: AuthService,
    public financialMarketData: FinancialMarketDataService,
    public datepipe: DatePipe,
    public util: UtilService
  ) {}

  ngOnInit(): void {
    this.count_res = 0;
    this.total_count_res = 3;
    this.util.loaderService.display(true);
    this.getAllBondsDataHandler();
    this.countryListHandler();
    this.AdvanceSearch();
    this.SectorData[0] = 'All';
  }

  newsDialogClose() {
    this.auth.openPopupModal = false;
  }
  countryListHandler() {
    this.financialMarketData.getCountry().subscribe(
      (res) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);
        let formattedData: any = [];
        res.forEach((element: any) => {
          formattedData.push({
            id: element.countryName,
            text: element.countryName,
          });
          formattedData[0] = 'All';
          this.countryData = formattedData;
        });
        res.filter((el: any) => {
          if (el.countryIsoCode3 == this.selectedCountry) {
            this.selectedCountryObj = el;
          }
        });
      },
      (err) => {
        console.log('error', err.message);
      }
    );
  }
  previousAPI: any = null;
  applyFilterAdvanceTable(event: any) {
    if (this.previousAPI != null) {
      this.previousAPI.unsubscribe();
    }
    let body = {};
    this.advance_search_data = event.target.value;

    if (this.type) {
      if (this.advance_search_data == '' || this.advance_search_data == null) {
      }
      body = {
        tenor: this.selectedTenory == '-' ? null : this.selectedTenory,
        currency: this.selectedCurrency == 'All' ? null : this.selectedCurrency,
        par_spread_mid:
          this.selectedParSpeed == '-' ? null : this.selectedParSpeed,
        quote_spread_mid:
          this.selectedQuoteSpeed == '-' ? null : this.selectedQuoteSpeed,
        up_front_mid: this.selectedUpfront == '-' ? null : this.selectedUpfront,
        hazard_rate:
          this.selectedhazard_rate == '-' ? null : this.selectedhazard_rate,
        cum_probability_of_default:
          this.selectedcumulative_probability == '-'
            ? null
            : this.selectedcumulative_probability,
        sector: this.selectedSector == 'All' ? null : this.selectedSector,
        entity_name: this.advance_search_data,
      };
    } else {
      body = {
        industry_lvl_1_desc:
          this.selectedCategory == 'All' ? null : this.selectedCategory,
        iso_currency_code:
          this.selectedCurrency == 'All' ? null : this.selectedCurrency,
        country_name:
          this.selectedCountry == 'All' ? null : this.selectedCountry,
        effective_duration:
          this.selectedTenory == '-' ? null : this.selectedTenory,
        yield_to_maturity:
          this.selectedYield == '-' ? null : this.selectedYield,
        modified_duration:
          this.selectedModified == '-' ? null : this.selectedModified,
        description: this.advance_search_data,
      };
    }
    let type = this.type ? 'cds' : 'bond';

    this.count_res = 0;
    this.total_count_res = 1;
    this.util.loaderService.display(true);
    this.previousAPI = this.financialMarketData
      .getAdvanceSearch(type, body)
      .subscribe((res) => {
        ++this.count_res;
        let data: any = res;
        this.util.checkCountValue(this.total_count_res, this.count_res);
        if (data.length > 0) {
          this.search_filter_data.length = 0;
          this.advance_search_data = 0;
        }
        this.search_filter_data = res;
        this.advance_search_data = res;
      });
    // this.advance_search_data = this.search_filter_data.filter((e: any) =>
    //   this.type
    //     ? e.cdsDataDetails.entityName
    //         .toLowerCase()
    //         .includes(event.target.value.toLowerCase())
    //     : e.description.toLowerCase().includes(event.target.value.toLowerCase())
    // );
  }

  filterValue(event: any) {
    this.search = event.target.value;
    this.AdvanceSearch();
  }

  compartableTableDataHandler(value: any) {
    this.comportable_table.emit(value);
  }

  AdvanceSearch() {
    let body = {};
    if (this.type) {
      body = {
        tenor: this.selectedTenory == '-' ? null : this.selectedTenory,
        currency: this.selectedCurrency == 'All' ? null : this.selectedCurrency,
        par_spread_mid:
          this.selectedParSpeed == '-' ? null : this.selectedParSpeed,
        quote_spread_mid:
          this.selectedQuoteSpeed == '-' ? null : this.selectedQuoteSpeed,
        up_front_mid: this.selectedUpfront == '-' ? null : this.selectedUpfront,
        hazard_rate:
          this.selectedhazard_rate == '-' ? null : this.selectedhazard_rate,
        cum_probability_of_default:
          this.selectedcumulative_probability == '-'
            ? null
            : this.selectedcumulative_probability,
        sector: this.selectedSector == 'All' ? null : this.selectedSector,
        entity_name: '',
      };
    } else {
      body = {
        industry_lvl_1_desc:
          this.selectedCategory == 'All' ? null : this.selectedCategory,
        iso_currency_code:
          this.selectedCurrency == 'All' ? null : this.selectedCurrency,
        country_name:
          this.selectedCountry == 'All' ? null : this.selectedCountry,
        effective_duration:
          this.selectedTenory == '-' ? null : this.selectedTenory,
        yield_to_maturity:
          this.selectedYield == '-' ? null : this.selectedYield,
        modified_duration:
          this.selectedModified == '-' ? null : this.selectedModified,
        description: '',
      };
    }

    let type = this.type ? 'cds' : 'bond';

    this.financialMarketData.getAdvanceSearch(type, body).subscribe((res) => {
      this.no_found = 'true';
      ++this.count_res;
      this.util.checkCountValue(this.total_count_res, this.count_res);
      this.search_filter_data = res;
      this.advance_search_data = res;
    });
  }

  getAllBondsDataHandler() {
    let categoryFormattedData: any = [];
    let currencyFormattedData: any = [];
    if (this.type) {
      this.financialMarketData
        .getAllCDSData(
          this.isin_number,
          this.datepipe.transform(
            this.util.startDate ? this.util.startDate : '',
            'yyyy-MM-dd'
          ),
          this.datepipe.transform(this.util.endDate, 'yyyy-MM-dd'),
          this.selectedBalanceModel
        )
        .subscribe(
          (res) => {
            ++this.count_res;
            this.util.checkCountValue(this.total_count_res, this.count_res);
            this.allcdsData = res;
            res?.currency?.forEach((element: any) => {
              currencyFormattedData.push({
                id: element,
                text: element,
              });
              this.selectCurrencyData = [...['All'], ...currencyFormattedData];
            });
          },
          (err) => {
            console.log('error', err.message);
          }
        );
    } else {
      this.financialMarketData
        .getAllBondsData(this.isin_number, this.selectedBalanceModel)
        .subscribe(
          (res) => {
            ++this.count_res;
            this.util.checkCountValue(this.total_count_res, this.count_res);
            this.allBondsData = res;
            res?.category.forEach((element: any) => {
              categoryFormattedData.push({
                id: element,
                text: element,
              });
              this.selectCategoryData = [...['All'], ...categoryFormattedData];
            });
            res?.currency.forEach((element: any) => {
              currencyFormattedData.push({
                id: element,
                text: element,
              });
              this.selectCurrencyData = [...['All'], ...currencyFormattedData];
            });
          },
          (err) => {
            console.log('error', err.message);
          }
        );
    }
  }

  valueChangedHandler(type: any, data: any) {
    if (type === 'Category') {
      if (this.selectCategoryData && this.selectedCategory !== data) {
        this.selectedCategory = data;
        this.count_res = 0;
        this.total_count_res = 1;
        this.util.loaderService.display(true);
        this.AdvanceSearch();
      }
    }
    if (type === 'Currency') {
      if (this.selectCurrencyData && this.selectedCurrency !== data) {
        this.selectedCurrency = data;
        this.count_res = 0;
        this.total_count_res = 1;
        this.util.loaderService.display(true);
        this.AdvanceSearch();
      }
    }
    if (type == 'Country') {
      if (this.countryData && this.selectedCountry !== data) {
        this.selectedCountry = data;
        this.count_res = 0;
        this.total_count_res = 1;
        this.util.loaderService.display(true);
        this.AdvanceSearch();
      }
    }
    if (type == 'tenor') {
      if (this.selectedTenory !== data) {
        this.selectedTenory = data;
        this.count_res = 0;
        this.total_count_res = 1;
        this.util.loaderService.display(true);
        this.AdvanceSearch();
      }
    }
    if (type == 'yield') {
      if (this.selectedYield !== data) {
        this.selectedYield = data;
        this.count_res = 0;
        this.total_count_res = 1;
        this.util.loaderService.display(true);
        this.AdvanceSearch();
      }
    }
    if (type == 'modified') {
      if (this.selectedModified !== data) {
        this.selectedModified = data;
        this.count_res = 0;
        this.total_count_res = 1;
        this.util.loaderService.display(true);
        this.AdvanceSearch();
      }
    }
    if (type == 'par_speed') {
      if (this.selectedParSpeed !== data) {
        this.selectedParSpeed = data;
        this.count_res = 0;
        this.total_count_res = 1;
        this.util.loaderService.display(true);
        this.AdvanceSearch();
      }
    }
    if (type == 'quote_speed') {
      if (this.selectedQuoteSpeed !== data) {
        this.selectedQuoteSpeed = data;
        this.count_res = 0;
        this.total_count_res = 1;
        this.util.loaderService.display(true);
        this.AdvanceSearch();
      }
    }
    if (type == 'upfront_premium') {
      if (this.selectedUpfront !== data) {
        this.selectedUpfront = data;
        this.count_res = 0;
        this.total_count_res = 1;
        this.util.loaderService.display(true);
        this.AdvanceSearch();
      }
    }
    if (type == 'hazard_rate') {
      if (this.selectedhazard_rate !== data) {
        this.selectedhazard_rate = data;
        this.count_res = 0;
        this.total_count_res = 1;
        this.util.loaderService.display(true);
        this.AdvanceSearch();
      }
    }
    if (type == 'cumulative_probability') {
      if (this.selectedcumulative_probability !== data) {
        this.selectedcumulative_probability = data;
        this.count_res = 0;
        this.total_count_res = 1;
        this.util.loaderService.display(true);
        this.AdvanceSearch();
      }
    }
    if (type === 'Sector') {
      if (this.selectedSector !== data) {
        this.selectedSector = data;
        this.count_res = 0;
        this.total_count_res = 1;
        this.util.loaderService.display(true);
        this.AdvanceSearch();
      }
    }
  }
}

import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FinancialMarketDataService } from 'src/app/services/financialmarketdata.service';
import { UtilService } from 'src/app/services/util.service';
import { LoaderServiceService } from '../../loader-service.service';

@Component({
  selector: 'app-advance-search-company',
  templateUrl: './advance-search-company.component.html',
  styleUrls: ['./advance-search-company.component.scss'],
})
export class AdvanceSearchCompanyComponent implements OnInit {
  // selectCategoryData: any = [];
  @Input() currency: any;
  @Input() country: any;

  selectEntitydata = [
    {
      id: 'ALL',
      text: 'ALL',
    },
    {
      id: 'Public',
      text: 'Public',
    },
    {
      id: 'Private',
      text: 'Private',
    },
  ];
  selectedEntity: any = 'Private';
  constructor(
    private financialMarketData: FinancialMarketDataService,
    private auth: AuthService,
    private util: UtilService,
    private loaderService: LoaderServiceService
  ) {}

  ngOnInit(): void {
    if (this.auth.openPopupModalcompanySearchPublic) {
      this.selectedEntity = 'Public';
    } else if (this.auth.openPopupModalcompanySearch) {
      this.selectedEntity = 'Private';
    }
    this.loaderService.display(true);
    this.total_count_res = 4;
    this.count_res = 0;
    this.getUserLocation();
    // this.getScreenerIndustry();
    // this.getIndustryCountryList();
    // this.getCurreny();
    // // this.selectedcurrecny = this.userLocation.currency;
    // // this.selectedCountry = this.country;
    // this.advanceSearchCompany();
  }

  getUserLocation() {
    this.financialMarketData.getCountryIp().subscribe((res: any) => {
      ++this.count_res;
      this.util.checkCountValue(this.total_count_res, this.count_res);

      this.selectedcurrecny = res.currency;

      this.getScreenerIndustry();
      this.getIndustryCountryList(res.countryCode);
      this.getCurreny();
      // this.selectedcurrecny = this.userLocation.currency;
      // this.selectedCountry = this.country;
      // this.advanceSearchCompany();
    });
  }

  currency_data: any = [];
  currecny_list: any = [];
  selectedcurrecny: any = '';
  getCurreny() {
    // this.loaderService.display(true);
    // this.total_count_res = 1;
    // this.count_res = 0;
    this.currecny_list = [];
    this.financialMarketData.getCurrencies().subscribe((res) => {
      // ++this.count_res;
      // this.util.checkCountValue(this.total_count_res, this.count_res);
      this.currecny_list = res;
      let categoryFormattedData: any = [];
      // this.company_list = res;
      res?.forEach((element: any) => {
        categoryFormattedData.push({
          id: element.isoCode,
          text: element.isoCode,
        });
        this.currency_data = categoryFormattedData;
      });
    });
  }

  countryData: any;
  selectedCountry: any = '';
  // selectedCountry: any = 'all';
  getIndustryCountryList(countryCode: any) {
    // this.loaderService.display(true);
    // this.total_count_res = 1;
    // this.count_res = 0;
    this.financialMarketData.getIndustryCountryList().subscribe(
      (res) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);
        // res.push({ id: 'all', countryName: 'World' });
        let formattedData: any = [];
        res.forEach((element: any) => {
          formattedData.push({
            id: element.countryIsoCode3,
            text: element.countryName,
          });
        });
        formattedData.unshift({
          id: 'world',
          text: 'World',
        });
        this.countryData = formattedData;
        res.forEach((el: any) => {
          if (el.countryIsoCode2 === countryCode) {
            this.selectedCountry = el.countryIsoCode3;
            this.advanceSearchCompany();
          }
        });
      },
      (err) => {
        console.log('error', err.message);
      }
    );
  }

  selectedSector: any = 'All';
  industryData: any;
  getScreenerIndustry() {
    // this.loaderService.display(true);
    // this.total_count_res = 1;
    // this.count_res = 0;
    this.financialMarketData.getIndustry().subscribe((res) => {
      ++this.count_res;
      this.util.checkCountValue(this.total_count_res, this.count_res);
      let formattedData: any = [];
      for (let i = 0; i < res.length; i++) {
        // if (
        //   Number(this.selectedSector) === Number(res[i].ticsSector.sectorId)
        // ) {
        formattedData.push({
          id: res[i].ticsIndustryName,
          text: res[i].ticsIndustryName,
        });
        // }
      }
      formattedData.unshift({
        id: 'All',
        text: 'All',
      });
      this.industryData = formattedData;
    });
  }

  valueChangedHandler(type: any, data: any) {
    if (type === 'Entity') {
      if (this.selectEntitydata && this.selectedEntity !== data) {
        this.selectedEntity = data;
        this.loaderService.display(true);
        this.total_count_res = 1;
        this.count_res = 0;
        this.advanceSearchCompany();
      }
    }
    if (type === 'Industry') {
      if (this.industryData && this.selectedSector !== data) {
        this.selectedSector = data;
        this.loaderService.display(true);
        this.total_count_res = 1;
        this.count_res = 0;
        this.advanceSearchCompany();
      }
    }
    if (type == 'Country') {
      if (this.countryData && this.selectedCountry !== data) {
        this.selectedCountry = data;
        this.loaderService.display(true);
        this.total_count_res = 1;
        this.count_res = 0;
        this.advanceSearchCompany();
      }
    }
    if (type == 'Currency') {
      if (this.currency_data && this.selectedcurrecny !== data) {
        this.selectedcurrecny = data;
        this.loaderService.display(true);
        this.total_count_res = 1;
        this.count_res = 0;
        this.advanceSearchCompany();
      }
    }
  }

  total_count_res: any = '';
  count_res: any = '';
  advance_search_data: any = '';
  timeout: any = null;
  previousAPI: any = null;
  applyFilterAdvanceTable(event: any) {
    this.advance_search_data = event.target.value;
    clearTimeout(this.timeout);

    if (this.previousAPI !== null) {
      this.previousAPI.unsubscribe();
    }

    this.timeout = setTimeout(() => {
      this.count_res = 0;
      this.total_count_res = 1;
      this.loaderService.display(true);

      this.advanceSearchCompany();
    }, 1000);
    // setTimeout(() =>
    //   function () {
    //     this.advanceSearchCompany();
    //   }.bind(this),
    //   5000
    // );
  }

  newsDialogClose() {
    this.auth.openPopupModalcompanySearch = false;
    this.auth.openPopupModalcompanySearchPublic = false;
  }

  company_response: any = [];
  noCompany: any = false;
  advanceSearchCompany() {
    if (this.selectedCountry === 'IND' && this.selectedEntity !== 'Public') {
      this.previousAPI = this.financialMarketData
        .getIndianPVTAdvanceSearchCompany(
          this.selectedEntity,
          this.selectedSector,
          this.selectedCountry,
          this.selectedcurrecny,
          this.advance_search_data
        )
        .subscribe(
          (res) => {
            ++this.count_res;
            this.util.checkCountValue(this.total_count_res, this.count_res);

            this.company_response = res;
            if (this.company_response && this.company_response.length > 0) {
              this.noCompany = false;
            } else {
              this.noCompany = true;
            }
          },
          (err) => {
            ++this.count_res;
            this.util.checkCountValue(this.total_count_res, this.count_res);

            console.log('error', err.message);
          }
        );
    } else {
      this.previousAPI = this.financialMarketData
        .getAdvanceSearchCompany(
          this.selectedEntity,
          this.selectedSector,
          this.selectedCountry,
          this.selectedcurrecny,
          this.advance_search_data
        )
        .subscribe(
          (res) => {
            ++this.count_res;
            this.util.checkCountValue(this.total_count_res, this.count_res);

            this.company_response = res;
            if (this.company_response && this.company_response.length > 0) {
              this.noCompany = false;
            } else {
              this.noCompany = true;
            }
          },
          (err) => {
            ++this.count_res;
            this.util.checkCountValue(this.total_count_res, this.count_res);

            console.log('error', err.message);
          }
        );
    }
  }
}

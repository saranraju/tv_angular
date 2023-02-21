import { Component, OnInit } from '@angular/core';
import { FinancialMarketDataService } from 'src/app/services/financialmarketdata.service';
import { HostListener } from '@angular/core';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
declare var $: any;
import { saveAs } from 'file-saver';
import { UtilService } from 'src/app/services/util.service';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-indutry-monitor',
  templateUrl: './indutry-monitor.component.html',
  styleUrls: ['./indutry-monitor.component.scss'],
})
export class IndutryMonitorComponent implements OnInit {
  company_url: any;
  industry_monitor: any;
  industry: any = 'industry';
  val: any = false;
  periodDropdownData = [
    {
      id: 'YEARLY',
      text: 'YEARLY',
    },
    {
      id: 'QUARTERLY',
      text: 'QUARTERLY',
    },
  ];
  IndustryData: any;
  IndustryList: any = [
    {
      id: 1111,
      disabled: true,
      text: 'Select Industry',
    },
  ];

  constructor(
    private financialMarketData: FinancialMarketDataService,
    public datepipe: DatePipe,
    public util: UtilService,
    public auth: AuthService
  ) {}

  @HostListener('document:click', ['$event'])
  clickout() {
    this.show = false;
  }

  currentDate: any = new Date();
  count_res: any = 0;
  total_count_res: any = '';
  yearArr: any = [];
  ngOnInit(): void {
    // this.financialMarketData.getCountryIp().subscribe((res: any) => {
    //   var data = res
    //   this.localCurrency = data.currency

    // });

    $(document).on('select2:open', () => {
      const inputs: any = document.querySelectorAll(
        '.select2-search__field[aria-controls]'
      );
      const mostRecentlyOpenedInput = inputs[inputs.length - 1];
      mostRecentlyOpenedInput.focus();
    });

    this.count_res = 0;
    this.total_count_res = 7;
    this.util.loaderService.display(true);
    this.getSectorList();
    this.getIndustryListInitial();
    this.getIndustryPeriodList();
    this.getIndustryData();
    this.getIndustryInsideData();
    this.show = false;
    this.getCountryList();
    this.getCurrencyList();
    this.industryValue = 1111;

    // this.localCurrency = 4;
  }

  doCheckCount: any = false;
  ngDoCheck(): void {
    if (this.count_res === 7 && !this.doCheckCount) {
      this.util.loaderService.showTutorial(true);
      this.doCheckCount = true;
    }
  }

  SectorData: any;
  SectorValue: any;
  SectorFilter: any;
  Currencydefault: any = 3;
  selectPeriodvalue: boolean = false;
  SelectQuqrtor: boolean = false;
  SelectYear: boolean = false;
  SelectMonth: boolean = false;
  show: any;
  btnperiod: any = 'Select Period';

  //period
  periodListData: any = [];
  dateListData: any = [];
  periodType: any;
  date: any;
  SelectPeriod: any = '';
  yearlyDates: any = [];
  QuartarlyDates: any = [];
  periodTypes: any;

  getSectorList() {
    this.financialMarketData.getSectorList().subscribe(
      (res) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);
        this.SectorFilter = res;
        // console.log('Sector data response*****', res);
        let formattedData: any = [];
        res.forEach((element: any) => {
          formattedData.push({
            id: element.sectorId,
            text: element.ticsSectorName,
          });
          this.SectorData = formattedData;
        });
        let defaultSector = {
          id: 1111,
          disabled: true,
          text: 'Select Sectors',
        };
        this.SectorData.unshift(defaultSector);
        this.SectorValue = 1111;
      },
      (err) => {
        console.log('error', err.message);
      }
    );
    $('.southAmerica').css('height', '26px');
    $('.northAmerica').css('height', '26px');
    $('.middleeast').css('height', '26px');
    $('.Europeformat').css('height', '26px');
    $('.asiaformat').css('height', '26px');
    $('.section-table').css('height', '275px');
    $('#fun').css('overflow', 'hidden');
  }

  SelectedSector: any;
  industryValue: any;
  countryValue: any;
  SelectedIndustry: any = '';
  Selectedcountry: any;
  selectedCurrency: any;

  onValueChanged(type: any, data: any) {
    if (type == 'Sector') {
      if (this.SectorData && this.SectorValue !== data) {
        this.SelectedSector = data;
        this.count_res = 0;
        this.total_count_res = 1;
        this.util.loaderService.display(true);
        this.getIndustryList();
        this.SectorValue = data;
      }
    }
    if (type == 'industry') {
      if (this.SectorData && this.industryValue !== data) {
        this.SelectedIndustry = data;
        this.total_count_res = 1;
        this.count_res = 0;
        //this.util.loaderService.display(true);
        this.getCountryList();
        //this.getIndustryPeriodList();
        this.industryValue = data;
        this.SectorValue = this.setSectorOfSelectedIndustry(data);
        this.getIndustryPeriodList();
        this.show == true;
      }
    }
    if (type == 'country') {
      this.btnperiod = 'Select Period';
      if (this.SectorData && this.countryValue !== data) {
        this.Selectedcountry = data;

        // this.total_count_res = 1;
        // this.count_res = 0;
        // this.util.loaderService.display(true);
        this.countryValue = data;
        this.getIndustryPeriodList();
      }
    }
    if (type == 'currency') {
      if (this.Currencydefault !== data) {
        for (let i = 0; i < this.CurrencyList.length; i++) {
          if (data == this.CurrencyList[i].id) {
            this.selectedCurrency = this.CurrencyList[i].text;
            this.Currencydefault = data;
          }
        }
      }
    }
  }

  // localCurrency: any;
  // setCurrencyDefault() {
  //   var data2;
  //   data2 = this.CurrencyList.filter((el: any) => el.id == this.localCurrency);
  //   // console.log(data2 , this.localCurrency)
  //   this.Currencydefault = data2[0].id;
  // }

  setSectorOfSelectedIndustry(id: any) {
    var data = this.IndustryData;
    var data2;
    data2 = data.filter((el: any) => el.ticsIndustryCode == id);
    return data2[0].ticsSector.sectorId;
  }
  getIndustryListInitial() {
    this.financialMarketData.getSectorIndustryList().subscribe(
      (res) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);
        this.IndustryData = res;

        let formattedData: any = [];
        this.IndustryData.forEach((element: any) => {
          formattedData.push({
            id: element.ticsIndustryCode,
            text: element.ticsIndustryName,
          });
          this.IndustryList = formattedData;
        });
        let industry = {
          id: 1111,
          disabled: true,
          text: 'Select Industry',
        };
        this.IndustryList.unshift(industry);
        this.industryValue = 1111;
      },
      (err) => {
        console.log('error', err.message);
      }
    );
  }

  getIndustryList() {
    this.financialMarketData.getSectorIndustryList().subscribe(
      (res) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);
        var data = res;
        this.IndustryData = res;
        var data2;
        data2 = data.filter(
          (el: any) => el.ticsSector.sectorId == this.SelectedSector
        );
        let formattedData: any = [];
        data2.forEach((element: any) => {
          formattedData.push({
            id: element.ticsIndustryCode,
            text: element.ticsIndustryName,
          });

          this.IndustryList = formattedData;
        });
        let industry = {
          id: 1111,
          disabled: true,
          text: 'Select Industry',
        };
        this.IndustryList.unshift(industry);
        this.industryValue = 1111;
      },
      (err) => {
        console.log('error', err.message);
      }
    );
  }
  CountryList: any;
  formatDataasia: any;
  formatDataEurope: any;
  formatDataMiddle_East: any;
  formatDataSouth_America: any;
  formatDataNorth_America: any;
  EuropeData: any = [];
  Middle_East: any = [];
  NorthAmerica: any = [];
  SouthAmerica: any = [];
  countryData: any = [];
  getCountryList() {
    this.financialMarketData
      .getIndustryCountryListWithSectorCode(this.SelectedIndustry)
      .subscribe(
        (res) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);
          this.countryData = res;
          var data = res;
          this.Asia_Pacific = data.filter((el: any) => {
            return el.regionId.regionName == 'Asia Pacific';
          });
          this.EuropeData = data.filter((el: any) => {
            return el.regionId.regionName == 'Europe';
          });
          this.Middle_East = data.filter((el: any) => {
            return el.regionId.regionName == 'Middle East & Africa';
          });
          this.NorthAmerica = data.filter((el: any) => {
            return el.regionId.regionName == 'North America';
          });
          this.SouthAmerica = data.filter((el: any) => {
            return el.regionId.regionName == 'South America';
          });

          this.formatDataasia = [
            {
              category: 'Asia Pacific',

              child_table_data: [],
            },
          ];
          this.formatDataEurope = [
            {
              category: 'Europe',

              child_table_data: [],
            },
          ];
          this.formatDataMiddle_East = [
            {
              category: 'Middle East & Africa',

              child_table_data: [],
            },
          ];
          this.formatDataSouth_America = [
            {
              category: 'South America',

              child_table_data: [],
            },
          ];
          this.formatDataNorth_America = [
            {
              category: 'North America',

              child_table_data: [],
            },
          ];
          this.Asia_Pacific.forEach((element: any) => {
            this.formatDataasia[0].child_table_data.push({
              telCategory: element.countryName,
            });
          });
          this.EuropeData.forEach((element: any) => {
            this.formatDataEurope[0].child_table_data.push({
              telCategory: element.countryName,
            });
          });
          this.Middle_East.forEach((element: any) => {
            this.formatDataMiddle_East[0].child_table_data.push({
              telCategory: element.countryName,
            });
          });
          this.NorthAmerica.forEach((element: any) => {
            this.formatDataNorth_America[0].child_table_data.push({
              telCategory: element.countryName,
            });
          });
          this.SouthAmerica.forEach((element: any) => {
            this.formatDataSouth_America[0].child_table_data.push({
              telCategory: element.countryName,
            });
          });
          var data2;

          let formattedData: any = [];
          data.forEach((element: any) => {
            formattedData.push({
              id: element.id,
              countryIsoCode3: element.countryIsoCode3,
              text: element.countryName,
            });

            this.CountryList = formattedData;
          });
          let defaultcountry = {
            id: 1111,
            disabled: true,
            text: 'Select Country',
          };

          this.CountryList.unshift(defaultcountry);
          // this.countryValue = '';
        },
        (err) => {
          console.log('error', err.message);
        }
      );
  }

  getIndustryData() {
    this.financialMarketData.getIndustryCoverage().subscribe((res) => {
      ++this.count_res;
      this.util.checkCountValue(this.total_count_res, this.count_res);
      var formattedData: any = [];
      res.forEach((element: any) => {
        formattedData.push({
          category: element.ticsSectorName,
          child_table_data: [],
        });
      });
      this.FormattedData = formattedData;
      this.getIndustryInsideData();
    });
  }
  Asia_Pacific: any = [];
  Europe: any = [];
  Middle_East_Africa = [];
  South_America: any = [];
  North_America: any = [];
  monitor_table_data1: any = [];
  FormattedData: any = [];
  dataFormatting: any = [];
  monitor_table_data2: any = [];
  monitor_table_data: any = [];
  modalFooter: any = false;

  getIndustryInsideData() {
    this.financialMarketData.getIndustryILcd().subscribe((res) => {
      this.FormattedData.forEach((element: any) => {
        for (let re of res) {
          if (element.category == re.ticsSector.ticsSectorName) {
            element.child_table_data.push({
              telCategory: re.ticsIndustryName,
            });
          }
        }

        this.dataFormatting[0] = this.FormattedData[0];
        this.dataFormatting[1] = this.FormattedData[2];
        this.dataFormatting[2] = this.FormattedData[4];
        this.dataFormatting[3] = this.FormattedData[6];
        this.dataFormatting[4] = this.FormattedData[8];
        this.dataFormatting[5] = this.FormattedData[10];
        this.dataFormatting[6] = this.FormattedData[12];
        this.dataFormatting[7] = this.FormattedData[14];
        this.dataFormatting[8] = this.FormattedData[16];
        this.dataFormatting[9] = this.FormattedData[18];
        this.dataFormatting[10] = this.FormattedData[1];
        this.dataFormatting[11] = this.FormattedData[3];
        this.dataFormatting[12] = this.FormattedData[5];
        this.dataFormatting[13] = this.FormattedData[7];
        this.dataFormatting[14] = this.FormattedData[9];
        this.dataFormatting[15] = this.FormattedData[11];
        this.dataFormatting[16] = this.FormattedData[13];
        this.dataFormatting[17] = this.FormattedData[15];
        this.dataFormatting[18] = this.FormattedData[17];
        this.dataFormatting[19] = this.FormattedData[19];
      });
      this.monitor_table_data1 = this.dataFormatting.filter(
        (el: any, i: any) => {
          return i < 10;
        }
      );
      this.monitor_table_data2 = this.dataFormatting.filter(
        (el: any, i: any) => {
          return i >= 10;
        }
      );

      ++this.count_res;
      this.util.checkCountValue(this.total_count_res, this.count_res);
    });
  }

  CurrencyList: any;

  getCurrencyList() {
    this.financialMarketData.getCurrencyList().subscribe(
      (res) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);
        let formattedData: any = [];
        res.forEach((element: any) => {
          formattedData.push({
            id: element.id,
            text: element.isoCode,
          });
          this.CurrencyList = formattedData;
        });
        this.Currencydefault = 3;
        // this.setCurrencyDefault();
      },
      (err) => {
        console.log('error', err.message);
      }
    );
  }

  yearsList: any = [];
  getIndustryPeriodList() {
    this.financialMarketData
      .Getperoiddetails(this.countryValue, this.SelectedIndustry)
      .subscribe((res) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);
        this.periodTypes = res;
        this.yearlyDates = [];
        this.yearsList = [];
        this.QuartarlyDates = [];
        this.SelectQuqrtor = false;
        this.val = false;
        this.SelectYear = false;
        for (let i = 0; i < this.periodTypes.length; i++) {
          if (this.periodTypes[i].periodType == 'YEARLY') {
            if (this.yearlyDates.length < 1) {
              this.periodTypes.forEach((el: any) => {
                if (el.periodType == 'YEARLY') {
                  var year = new Date(el.period).getFullYear();
                  this.yearsList.push(year);
                  this.yearlyDates.push(el);
                }
              });
            }
          } else {
            if (this.QuartarlyDates.length < 1) {
              this.periodTypes.forEach((el: any) => {
                if (el.periodType == 'QUARTERLY') {
                  this.QuartarlyDates.push(el);
                  this.val = true;
                }
              });
            }
          }
        }
        let uniqueChars = [...new Set(this.yearsList)];
        this.yearsList = uniqueChars;
      });
  }

  selectPeriod() {
    if (this.industryValue === 1111 || this.industryValue === '') {
      this.ErrorMessage = 'Select Industry first';

      $('#SubmitIssue').modal('show');
    }

    if (
      this.industryValue != undefined &&
      this.industryValue != '' &&
      this.industryValue != 1111
    ) {
      if (this.show == false) {
        this.show = true;
        this.selectPeriodvalue = true;
        this.SelectQuqrtor = false;
        this.SelectMonth = false;
        this.SelectYear = false;
        this.selectedyear2 = '';
        this.selectedPeriod2 = '';
      } else {
        this.show = true;
        this.selectPeriodvalue = !this.selectPeriodvalue;
        this.SelectQuqrtor = false;
        this.SelectMonth = false;
        this.SelectYear = false;
        this.selectedyear2 = '';
        this.selectedPeriod2 = '';
      }
    }
  }
  selectedPeriod2: any;

  showQuqr(e: any) {
    this.selectedPeriod2 = e;
    this.SelectQuqrtor = !this.SelectQuqrtor;
    this.SelectYear = false;
    this.SelectMonth = false;
  }
  showYear(e: any) {
    this.selectedPeriod2 = e;
    this.SelectYear = !this.SelectYear;
    this.SelectQuqrtor = false;
    this.SelectMonth = false;
  }

  monthsOfYear: any = [];
  row = [''];
  selectedyear2: any;

  selectmonth(e: any) {
    this.selectedyear2 = e;
    this.monthsOfYear = [];
    if (this.row[0] != e) {
      this.SelectMonth = true;
      this.row[0] = e;
    } else {
      this.SelectMonth = false;
      this.row[0] = '';
    }

    this.yearlyDates.forEach((el: any) => {
      var selectYear = new Date(el.period).getFullYear();
      if (selectYear == e) {
        this.monthsOfYear.push(el);
      }
    });
  }
  periodofbtn: any;
  selectedIndutryMonitor: any;
  selectQuartordate(e: any) {
    this.selectPeriodvalue = false;
    this.SelectQuqrtor = false;
    this.SelectMonth = false;
    this.SelectYear = false;
    this.periodofbtn = e.period;
    this.btnperiod = this.datepipe.transform(e.period, 'MMM - y');
    this.selectedIndutryMonitor = e;
  }

  changeLayout(e: any, clas: any) {
    if (e == 'true') {
      $('.' + clas).css('height', '26px');
      if (clas == 'asiafo') {
        $('#fun').css('overflow', 'hidden');
      }
      $('.section-table').css('height', '275px');
    } else {
      $('.' + clas).removeAttr('style');
      if (clas == 'asiafo') {
        $('#fun').css('overflow', 'auto');
      }
      $('.section-table').removeAttr('style');
    }
  }
  selectedAsia: any = false;
  selectedEurope: any = false;
  selectedMiddle: any = false;
  selectedNorthAmerica: any = false;
  selectedSouthAmerica: any = false;
  handleRegionSelected(e: any, region: any) {
    if (region === 'asiaformat') {
      this.selectedAsia = !this.selectedAsia;
    }
    if (region === 'Europeformat') {
      this.selectedEurope = !this.selectedEurope;
    }
    if (region == 'middleeast') {
      this.selectedMiddle = !this.selectedMiddle;
    }
    if (region == 'northAmerica') {
      this.selectedNorthAmerica = !this.selectedNorthAmerica;
    }
    if (region == 'southAmerica') {
      this.selectedSouthAmerica = !this.selectedSouthAmerica;
    }
  }
  Currencyvalue: any;
  clear() {
    this.SectorValue = '';
    this.industryValue = '';
    this.countryValue = '';
    this.btnperiod = 'Select Period';
    this.Currencydefault = '3';
  }
  ErrorMessage: any;
  industryname: any;
  sendSector: any;
  sendIndustry: any;
  continueToDownload: any = false;
  onSubmit() {
    this.util.loaderService.display(true);
    if (
      this.SectorValue != undefined &&
      this.SectorValue != '' &&
      this.SectorValue != 1111
    ) {
      this.sendSector = this.SectorFilter.filter((el: any) => {
        return this.SectorValue == el.sectorId;
      });
    }
    if (
      this.industryValue != undefined &&
      this.industryValue != '' &&
      this.industryValue != 1111
    ) {
      this.sendIndustry = this.IndustryData.filter((el: any) => {
        return this.industryValue == el.ticsIndustryCode;
      });
    }
    if (Array.isArray(this.sendSector) && this.sendSector.length > 0) {
      this.sendSector = this.sendSector[0].ticsSectorCode;
    }

    if (Array.isArray(this.sendIndustry) && this.sendIndustry.length > 0) {
      this.industryname = this.sendIndustry[0].ticsIndustryName;
      this.sendIndustry = this.sendIndustry[0].ticsIndustryCode;
    }

    if (this.countryValue == 1111) {
      this.countryValue = '';
    }

    let obj = {
      ticsSectorCode: this.sendSector,
      ticsIndustryCode: this.sendIndustry,
      period: this.periodofbtn,
      countryId: this.countryValue,
      periodType: this.selectedIndutryMonitor?.periodType,
      currency: this.selectedCurrency,
    };

    if (
      !this.SectorValue ||
      this.SectorValue == '' ||
      this.SectorValue == 1111 ||
      !this.industryValue ||
      this.industryValue == '' ||
      this.industryValue == 1111 ||
      this.btnperiod == 'Select Period'
    ) {
      if (
        !this.SectorValue ||
        this.SectorValue == '' ||
        this.SectorValue == 1111
      ) {
        this.ErrorMessage = 'Please Select Sector';
        this.util.loaderService.display(false);
      } else {
        if (
          !this.industryValue ||
          this.industryValue == '' ||
          this.industryValue == 1111
        ) {
          this.ErrorMessage = 'Please Select Industry';
          this.util.loaderService.display(false);
        } else {
          if (this.btnperiod == 'Select Period') {
            this.ErrorMessage = 'Please Select Period';
            this.util.loaderService.display(false);
          }
        }
      }

      $('#SubmitIssue').modal('show');
    } else {
      if (this.auth.exploreUser) {
        this.util.loaderService.display(false);
        this.auth.openUnavailableExploreModal = true;
      } else {
        if (
          this.selectedIndutryMonitor.companyCount < 5 &&
          this.continueToDownload == false
        ) {
          let industryName1 = this.IndustryList.filter((ele: any) => {
            return ele.id === this.sendIndustry;
          });
          let industryName2 = industryName1[0].text;
          let countryCode6 = this.CountryList.filter((element: any) => {
            return (
              element.countryIsoCode3 ===
              this.selectedIndutryMonitor.countryCode
            );
          });
          let countryName6 = countryCode6[0].text;

          if (this.selectedIndutryMonitor.companyCount > 1) {
            this.ErrorMessage = `Only ${this.selectedIndutryMonitor.companyCount} found in ${industryName2} in ${countryName6} for the selected period.<br/>Do you want to continue?`;
            this.util.loaderService.display(false);
          } else {
            this.ErrorMessage = ` Only ${this.selectedIndutryMonitor.companyCount} company found in  ${industryName2} in ${countryName6} for the selected period.<br/>Do you want to continue?`;
            this.util.loaderService.display(false);
          }
          this.modalFooter = true;
          $('#SubmitIssue').modal('show');
        } else {
          this.financialMarketData.DownloadPdfIndutryMonitor(obj).subscribe(
            (res: any) => {
              this.util.loaderService.display(false);
              if (this.countryValue != 1111) {
                var country = this.countryData.filter((el: any) => {
                  return this.countryValue == el.id;
                });
                country = country[0]?.countryName;
              }
              const blob = new Blob([res.body], {
                type: 'application/pdf',
              });
              const file = new File(
                [blob],
                '' +
                  `Industry_Monitor ${this.industryname} ${
                    country ? country : ''
                  } ${this.btnperiod}`,
                {
                  type: 'application/pdf',
                }
              );
              saveAs(file);
            },
            (err) => {
              this.util.loaderService.display(false);

              if (err.status === 402) {
                this.auth.freeTrialAlert = true;
              }
            }
          );
        }
      }
    }
  }
}

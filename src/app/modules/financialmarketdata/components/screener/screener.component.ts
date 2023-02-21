import { Component, OnInit, EventEmitter, DoCheck } from '@angular/core';
import { FinancialMarketDataService } from 'src/app/services/financialmarketdata.service';
import { Options } from '@angular-slider/ngx-slider';
import { any } from '@amcharts/amcharts4/.internal/core/utils/Array';
import { UtilService } from 'src/app/services/util.service';
import * as XLSX from 'xlsx';
import { debounceTime } from 'rxjs/operators';
import * as Excel from 'exceljs';
import * as ExcelProper from 'exceljs';
import { saveAs } from 'file-saver';
import { AuthService } from 'src/app/services/auth/auth.service';

declare var $: any;
// declare var jQuery: any;

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
  selector: 'app-screener',
  templateUrl: './screener.component.html',
  styleUrls: ['./screener.component.scss'],
})
export class ScreenerComponent implements OnInit, DoCheck {
  Object = Object;
  titlesData = [
    {
      label: 'Company',
      key: 'company',
      shorting: true,
      pointer: true,
    },
    {
      label: 'Country',
      key: 'country',
      shorting: true,
    },
    {
      label: 'Latest Reported Year',
      key: 'latest_reported_year',
      shorting: true,
      align: 'left',
      headerAlign: 'left',
    },
  ];

  screener_data = {
    title: this.getClone(this.titlesData),
    value: [],
  };

  finalScrenerData: any = {};

  value: number = 0;
  highValue: number = 112443;
  // options: Options = {
  //   floor:  -10000,
  //   ceil: 112443,
  //   step: 450,
  //   showTicks: true,  noSwitching: true,
  // noSwitching: true
  // };

  slider: Array<SliderDetails> = [];

  // highValue: any;
  // value: any;
  // sliderData: any =Options;
  isFieldSelected: any = {};
  metricType: any = 'Financials';
  // metricType: any = '';
  currencyData: any;
  countryId: any = '';
  countryData: any;
  industryData: any;
  selectCurrencyData: any;
  selectedSector: any;
  sectorData: any;
  financialsData: any;
  fundamentalRatioData: any;
  ValuationRatioData: any;
  priceVolumeData: any;
  matrixData: any;
  resultPages: any = 0;
  screenerResultTable: any;
  clickedMetric: any;
  clickedFieldName: any;
  clickedMetricLabel: any;
  totalData: any = [];
  sortedTotalData: any;
  maxTotalData: any;
  periodData: any = [];
  currentCurrency: any;
  tableAllData: any;
  isLoading: any;
  minValue: any;
  maxValue: any;
  tabValue: any = 'screener';
  ngselectoptions = {
    multiple: true,
    // tags: true,
  };
  errorMessage = false;
  metricSubTypes: any;
  addedColumns: Array<any> = [];
  manualRefresh: EventEmitter<void> = new EventEmitter<void>();
  highValueData: any;

  constructor(
    private financialMarketData: FinancialMarketDataService,
    public util: UtilService,
    public auth: AuthService
  ) {}

  industryListData: any[] = [];
  sectorListData: any[] = [];
  count_res: any = 0;
  total_count_res: any = '';

  ngOnInit(): void {
    $(document).on('select2:open', () => {
      const inputs: any = document.querySelectorAll(
        '.select2-search__field[aria-controls]'
      );
      const mostRecentlyOpenedInput = inputs[inputs.length - 1];
      mostRecentlyOpenedInput.focus();
    });

    this.count_res = 0;
    this.total_count_res = 5;
    this.util.loaderService.display(true);
    this.currencyListHandler();
    this.getIndustryCountryList();
    this.getScreenerSector();
    this.getScreenerIndustry();
    this.getMatrixData();

    this.auth.userType = localStorage.getItem('userType');
  }

  doCheckCount: any = false;
  ngDoCheck(): void {
    if (this.count_res === 5 && !this.doCheckCount) {
      this.util.loaderService.showTutorial(true);
      this.doCheckCount = true;
    }
  }

  metricChange(type: any) {
    this.metricType = type;
    // this.addMatrix();
  }

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
          this.currencyData = formattedData;
        });
      },
      (err) => {
        console.error('error', err.message);
      }
    );
  }

  getIndustryCountryList() {
    this.financialMarketData.getIndustryCountryList().subscribe(
      (res) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);
        let formattedData: any = [];
        res.forEach((element: any) => {
          formattedData.push({
            id: element.id,
            text: element.countryName,
          });
          this.countryData = formattedData;
        });
        // this.metricChange();
      },
      (err) => {
        console.error('error', err.message);
      }
    );
    // this.count_res = 0;
    // this.total_count_res = 1;
  }
  warning: any;
  selectedCountry: any = 'World';
  selectedCurrency: any = 'USD';
  selectedIndustry: any = '';
  selectedCountryArray: any = [];
  ngSelectCountryArray: any = [];
  onValueChanged(type: any, data: any) {
    if (type == 'Country') {
      if (
        this.countryData &&
        this.ngSelectCountryArray?.length !== data?.length
      ) {
        // console.log(typeof this.selectedIndustry, '192----');

        if (this.selectedIndustry === '') {
          this.warning = 'Please select industry to view results';
        }
        for (let i = 0; i < this.countryData.length; i++) {
          if (this.countryData[i].id == data) {
            this.selectedCountry = this.countryData[i].id;
          }
        }
        if (this.selectedCountry != 'World') {
          this.ngSelectCountryArray = data;
          var countryFiltered: any = [];
          this.countryData.map((dt: any) => {
            data.map((ele: any) => {
              if (dt.id == ele) {
                countryFiltered.push(dt);
              }
            });
          });
          this.selectedCountryArray = countryFiltered;
          if (this.selectedCountryArray.length > 0) {
            let screenerValueArray: any = [];
            this.tableAllData?.map((dt: any) => {
              this.selectedCountryArray.map((ele: any) => {
                if (dt.country == ele.text) {
                  screenerValueArray.push(dt);
                }
              });
            });
            if (screenerValueArray.length) {
              this.screener_data.value = screenerValueArray;
            } else {
              this.screener_data.value = [];
            }
          } else {
            if (this.selectedIndustry) {
              this.screener_data.value = this.getClone(this.tableAllData);
            }
          }
          this.finalScrenerData = this.screener_data;
          this.getMinandMaxData();
        }
        this.countryId = data;
      }
    }
    if (type == 'Currency') {
      this.currentCurrency = this.selectedCurrency;
      if (this.selectCurrencyData || this.selectedCurrency !== data) {
        this.selectedCurrency = data;
        this.tableAllData = [];
        this.screener_data.value = [];
        this.screener_data.title = this.getClone(this.titlesData);
        this.count_res = 0;
        this.total_count_res = 1;
        this.util.loaderService.display(true);
        this.isLoading = true;
        // screener_data.filter
        if (this.metricType === 'Financials') {
          this.getMatricWithCurrency();
        } else if (this.metricType === 'Fundamental Ratios') {
          this.getMatricFRWithCurrency();
        } else if (this.metricType === 'Price & Volume') {
          this.getMatricPVWithCurrency();
        } else if (this.metricType === 'Valuation Ratios') {
          this.getMatricVRWithCurrency();
        }
      }
    }
    if (type == 'Industry') {
      if (this.industryData && this.selectedIndustry !== data) {
        this.isFieldSelected = {};
        this.screener_data.title = this.screener_data.title.slice(0, 3);
        this.warning = false;
        this.selectedIndustry = data;
        this.selectedSector = this.industryListData.filter(
          (obj) => obj.ticsIndustryCode == this.selectedIndustry
        )[0].ticsSector.sectorId;

        this.metricType = 'Financials';
        // this.selectedCountry = '';
        this.count_res = 0;
        this.total_count_res = 1;
        this.util.loaderService.display(true);
        this.getScreenerResultTable();
        // this.addMatrix();
      }
    }
    if (type == 'Sector') {
      if (this.sectorData && this.selectedSector !== data) {
        this.selectedSector = data;
        // console.log(this.selectedSector);
        this.screener_data.value = [];
        this.metricType = '';
        this.count_res = 0;

        // this.total_count_res = 1;
        // this.util.loaderService.display(true);
        // this.getMatrixData();
        this.isFieldSelected = {};
        this.resultPages = 0;
        this.filter = false;
        // this.getScreenerIndustry();
        this.util.checkCountValue(this.total_count_res, this.count_res);
        let formattedData: any = [];
        for (let i = 0; i < this.industryListData.length; i++) {
          if (
            Number(this.selectedSector) ===
            Number(this.industryListData[i].ticsSector.sectorId)
          ) {
            formattedData.push({
              id: this.industryListData[i].ticsIndustryCode,
              text: this.industryListData[i].ticsIndustryName,
            });
          }
        }
        this.industryData = formattedData;
      }
    }
  }
  inputValueMax: any;
  inputValueMin: any;
  onInputValueChange(e: any, id: any, item: any, isFieldSelected: any) {
    if (this.lastClick >= Date.now() - this.delay) return;
    this.lastClick = Date.now();
    const value = parseFloat(e.target.value);
    const isFalse = isNaN(parseFloat(e.target.value));

    if (!isFalse) {
      if (id == 'min') {
        if (typeof value === 'number') {
          clearTimeout(this.inputValueMin);
          this.inputValueMin = setTimeout(() => {
            if (
              value > this.isFieldSelected[item].options.ceil ||
              value < this.isFieldSelected[item].options.floor
            ) {
              this.isFieldSelected[item].min =
                this.isFieldSelected[item].options.floor.toString();
            } else {
              this.isFieldSelected[item].min = value;
            }
          }, 1500);
        }
      }
      if (id == 'max') {
        if (typeof value === 'number' && value !== 0) {
          clearTimeout(this.inputValueMax);
          this.inputValueMax = setTimeout(() => {
            if (
              value > this.isFieldSelected[item].options.ceil ||
              value < this.isFieldSelected[item].options.floor
            ) {
              this.isFieldSelected[item].max =
                this.isFieldSelected[item].options.ceil.toString();
            } else {
              this.isFieldSelected[item].max = value;
            }
          }, 1500);
        }
      }
    } else {
      if (id == 'min') {
        if (typeof value === 'number') {
          clearTimeout(this.inputValueMin);
          this.inputValueMin = setTimeout(() => {
            (
              document.getElementById(
                `minDigitInput${isFieldSelected[item].label}`
              ) as any
            ).value = ' ';
          }, 1500);
        }
      }
      if (id == 'max') {
        if (typeof value === 'number' && value !== 0) {
          clearTimeout(this.inputValueMax);
          this.inputValueMax = setTimeout(() => {
            (
              document.getElementById(
                `maxDigitInput${isFieldSelected[item].label}`
              ) as any
            ).value = ' ';
          }, 1500);
        }
      }
    }
  }
  getScreenerIndustry() {
    this.financialMarketData.getIndustry().subscribe((res) => {
      this.industryListData = res;
      // this.industryData=this.industryListData
      ++this.count_res;
      this.util.checkCountValue(this.total_count_res, this.count_res);
      let formattedData: any = [];
      for (let i = 0; i < res.length; i++) {
        // if (
        //   Number(this.selectedSector) === Number(res[i].ticsSector.sectorId)
        // ) {
        formattedData.push({
          id: res[i].ticsIndustryCode,
          text: res[i].ticsIndustryName,
        });
        // }
      }
      this.industryData = formattedData;
    });
  }

  getScreenerSector() {
    this.financialMarketData.getSector().subscribe((res) => {
      this.sectorListData = res;
      ++this.count_res;
      this.util.checkCountValue(this.total_count_res, this.count_res);
      let formattedData: any = [];
      res.forEach((element: any) => {
        formattedData.push({
          id: element.sectorId,
          text: element.ticsSectorName,
        });
        this.sectorData = formattedData;
      });
    });
  }

  getMatrixData() {
    this.metricSubTypes = {
      'Price & Volume': [
        {
          id: 0,
          text: 'Stock Price',
          fieldName: 't_mcap',
        },
        {
          id: 1,
          text: 'Volume',
          fieldName: 't_mcap',
        },
      ],
      'Valuation Ratios': [],
      'Fundamental Ratios': [],
      Financials: [],
    };
    this.financialMarketData.getMatrixFinancials().subscribe((res) => {
      ++this.count_res;
      this.util.checkCountValue(this.total_count_res, this.count_res);
      this.matrixData = res;
      if (res && res.length) {
        res.map((rs: any) => {
          if (rs.financialType === 'IS' || rs.financialType === 'CF') {
            this.metricSubTypes['Financials'].push({
              id: rs.id,
              text: rs.description,
              fieldName: rs.fieldName,
            });
          }
          if (rs.financialType === 'FR') {
            this.metricSubTypes['Fundamental Ratios'].push({
              id: rs.id,
              text: rs.description,
              fieldName: rs.fieldName,
            });
          }
          if (rs.financialType === 'VR' && rs.fieldName === 't_mcap') {
            this.metricSubTypes['Price & Volume'].push({
              id: rs.id,
              text: rs.description,
              fieldName: rs.fieldName,
            });
          }
          if (rs.financialType === 'VR') {
            this.metricSubTypes['Valuation Ratios'].push({
              id: rs.id,
              text: rs.description,
              fieldName: rs.fieldName,
            });
          }
        });
      }
    });
  }
  getScreenerResultTable() {
    this.tableAllData = [];
    this.financialMarketData
      .getScreenerResultTable(this.selectedIndustry, this.selectedCurrency)
      .subscribe((res) => {
        this.isLoading = false;
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);
        var tableData = res;
        let formattedData: any = [];
        res.forEach((element: any) => {
          if (this.selectedCountryArray.length > 0) {
            this.selectedCountryArray.map((ele: any) => {
              if (element.countryName == ele.text) {
                formattedData.push({
                  company: element.companyName,
                  country: element.countryName,
                  latest_reported_year: element.period,
                  id: element.id,
                  companyCode: element.companyId,
                });
              }
            });
          } else {
            formattedData.push({
              company: element.companyName,
              country: element.countryName,
              latest_reported_year: element.period,
              id: element.id,
              companyCode: element.companyId,
            });
          }
        });
        this.tableAllData = formattedData;
        this.screener_data.value = this.getClone(this.tableAllData);
        this.finalScrenerData = this.screener_data;
        this.resultPages = formattedData.length;
      });
  }

  addTable(value: any) {
    this.clickedMetric = value;
    // this.getMatrixData();
    if (this.clickedMetric !== undefined) {
      let clickedFieldName = '';
      for (var data = 0; data < this.matrixData.length; data++) {
        if (this.clickedMetric === this.matrixData[data].description) {
          clickedFieldName = this.matrixData[data].fieldName;
        }
      }
      this.isFieldSelected[this.clickedMetric] = {
        selected: true,
        min: 0,
        max: 0,
        key: value,
        label: '',
        fieldName: clickedFieldName,
        options: {},
      };
      this.count_res = 0;
      this.total_count_res = 1;
      this.util.loaderService.display(true);
      if (this.metricType === 'Financials') {
        this.getEditMatricFinancial(clickedFieldName, value);
      } else if (this.metricType === 'Fundamental Ratios') {
        this.getEditMatricFR(clickedFieldName, value);
      } else if (this.metricType === 'Price & Volume') {
        this.getEditMatricPV(clickedFieldName, value);
      } else if (this.metricType === 'Valuation Ratios') {
        this.getEditMatricVR(clickedFieldName, value);
      }
    }
  }

  getCurrencyChange() {
    this.financialMarketData
      .getCurrencyChange(
        this.currentCurrency,
        this.selectedCurrency,
        this.periodData
      )
      .subscribe((res) => {
        console.log(res);
      });
  }

  getMatricWithCurrency() {
    if (Object.keys(this.isFieldSelected).length < 1) {
      this.getScreenerResultTable();
    } else {
      Object.keys(this.isFieldSelected).map((clickedKey) => {
        this.getEditMatricFinancial(
          this.isFieldSelected[clickedKey].fieldName,
          clickedKey
        );
      });
    }
  }

  getEditMatricFinancial(clickedFieldName: string, clickedMetric: string) {
    // Object.keys(this.isFieldSelected).map(clickedKey => {
    this.financialMarketData
      .getEditMatricFinancial(
        this.selectedIndustry,
        clickedFieldName,
        this.selectedCurrency
      )
      .subscribe(
        (res) => {
          this.isLoading = false;
          let editMatrixData = res;

          // for period
          res.forEach((element: any) => {
            this.periodData.push(element.period);
          });

          let curUnit;
          if (res[0].currency && res[0].unit) {
            curUnit = `(${res[0].currency} ${res[0].unit})`;
          } else if (res[0].currency && !res[0].unit) {
            curUnit = `(${res[0].currency})`;
          } else if (!res[0].currency && res[0].unit) {
            curUnit = `(${res[0].unit})`;
          }
          curUnit = curUnit ?? '';
          let label = clickedMetric + ' ' + curUnit;

          this.isFieldSelected[clickedMetric].label = label;
          let customTitle = {
            label: label,
            key: clickedMetric,
            shorting: true,
            align: 'right',
            formattedNum: true,
          };
          this.screener_data.title.push(customTitle);
          let maxValueArray: any = [];
          if (this.tableAllData.length) {
            editMatrixData.map((el: any) => {
              maxValueArray.push(Math.floor(el.data).toFixed(2));
              this.tableAllData.map((dt: any) => {
                if (dt.company == el.companyName) {
                  dt[clickedMetric] = Math.floor(el.data).toFixed(2);
                }
              });
            });
          }

          if (!this.tableAllData.length) {
            editMatrixData.map((el: any) => {
              maxValueArray.push(Math.floor(el.data).toFixed(2));
              // this.tableAllData.map((dt:any) =>{
              //   if(dt.company == el.companyName){
              //     dt[clickedMetric] = el.data;
              //   }
              // })

              let obj: any = {
                company: el.companyName,
                country: el.countryName,
                latest_reported_year: el.period,
                id: el.id,
              };
              obj[clickedMetric] = Math.floor(el.data).toFixed(2);
              this.tableAllData.push(obj);
            });
          }
          this.screener_data.value = [];
          this.screener_data.value = this.getClone(this.tableAllData);
          let maxValue = Math.max(...maxValueArray);
          let minValue = Math.min(...maxValueArray);
          this.isFieldSelected[clickedMetric].max = maxValue;
          this.isFieldSelected[clickedMetric].options = {
            floor: minValue,
            ceil: maxValue,
            step: Math.round(maxValue / maxValueArray.length),
            showTicks: true,
            noSwitching: true,
            enforceRange: true,
            enforceStep: true,
          };
          setTimeout(() => {
            if (this.selectedCountryArray.length > 0) {
              var screenerValueArray: any = [];
              this.screener_data.value = this.tableAllData.map((dt: any) => {
                this.selectedCountryArray.map((ele: any) => {
                  if (dt.country == ele.text) {
                    screenerValueArray.push(dt);
                  }
                });
              });
              this.screener_data.value = screenerValueArray;
            } else {
              this.screener_data.value = this.getClone(this.tableAllData);
            }
            let slider: any = document.getElementById(clickedMetric);
            // console.log(slider);
            slider.childNodes[slider.childNodes.length - 1].childNodes.forEach(
              (el: any, i: any) => {
                this.screener_data.value.map((dt: any, ind: any) => {
                  if (ind === i) {
                    if (parseFloat(dt[clickedMetric]) >= 0) {
                      let stdHeight = 22;
                      let height = (
                        (stdHeight * dt[clickedMetric]) /
                        maxValue
                      ).toFixed(2);
                      height = height == '0.00' ? '1.00' : height;
                      // console.log(height, dt[clickedMetric], i);
                      el.style.height = height + 'px';
                    }
                  }
                });
              }
            );

            this.finalScrenerData = this.screener_data;
          }, 1000);
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);

          this.manualRefresh.emit();
        },

        (err) => {
          console.error(err);
          delete this.isFieldSelected[clickedMetric];
          let index: any;
          this.screener_data.title.map((el: any, i: any) => {
            if (el.key === clickedMetric) {
              index = i;
            }
          });
          if (index) {
            this.screener_data.title.splice(index, 1);
          }
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);
          this.errorMessage = true;
        }
      );
  }

  getOptions(item: any) {
    return this.isFieldSelected[item].options;
  }
  getMinandMaxData() {
    this.isFieldSelected;
    // console.log('654---', this.finalScrenerData);
    const keys = Object.keys(this.isFieldSelected);
    // console.log(keys, '656------');

    keys.map((ele: any) => {
      if (this.finalScrenerData.value.length) {
        var maxMinArray: any = [];
        this.finalScrenerData?.value?.map((fVal: any) => {
          // console.log(fVal[ele], '659-------');
          if (!isNaN(parseFloat(fVal[ele]))) {
            maxMinArray.push(parseFloat(fVal[ele]).toFixed(2));
          }
        });
        let max = Math.max(...maxMinArray);
        let min = Math.min(...maxMinArray);
        this.isFieldSelected[ele].max = max;
        this.isFieldSelected[ele].min = min;
        this.isFieldSelected[ele].options = {
          floor: min,
          ceil: max,
          step: Math.round(max / maxMinArray.length),
          showTicks: true,
          noSwitching: true,
          enforceRange: true,
          enforceStep: true,
        };
      } else {
        this.isFieldSelected[ele].max = 1;
        this.isFieldSelected[ele].min = 0;
        this.isFieldSelected[ele].options = {
          floor: 0,
          ceil: 1,
          step: 1,
          showTicks: true,
          noSwitching: true,
          enforceRange: true,
          enforceStep: true,
        };
      }
      // console.log('MAX____', max, min, '665------');
    });
  }

  getMatricFRWithCurrency() {
    Object.keys(this.isFieldSelected).map((clickedKey) => {
      this.getEditMatricFR(
        this.isFieldSelected[clickedKey].fieldName,
        clickedKey
      );
    });
  }

  getEditMatricFR(clickedFieldName: string, clickedMetric: string) {
    this.financialMarketData
      .getEditMatricFR(
        this.selectedIndustry,
        clickedFieldName,
        this.selectedCurrency
      )
      .subscribe(
        (res) => {
          let marticDataFR = res;
          this.isLoading = false;
          res.forEach((element: any) => {
            this.periodData.push(element?.period);
          });
          let curUnit;
          if (res[0].currency && res[0].unit) {
            curUnit = `(${res[0].currency} ${res[0].unit})`;
          } else if (res[0].currency && !res[0].unit) {
            curUnit = `(${res[0].currency})`;
          } else if (!res[0].currency && res[0].unit) {
            curUnit = `(${res[0].unit})`;
          }
          curUnit = curUnit ?? '';

          let label = clickedMetric + ' ' + curUnit;
          this.isFieldSelected[clickedMetric].label = label;
          let customTitle = {
            label: label,
            key: clickedMetric,
            shorting: true,
            align: 'right',
            formattedNum: true,
          };
          this.screener_data.title.push(customTitle);
          let maxValueArray: any = [];
          if (this.tableAllData.length) {
            marticDataFR.map((el: any) => {
              maxValueArray.push(Math.floor(el.data).toFixed(2));
              this.tableAllData.map((dt: any) => {
                if (dt.company == el.companyName) {
                  dt[clickedMetric] = Math.floor(el.data).toFixed(2);
                }
              });
            });
          }

          if (!this.tableAllData.length) {
            marticDataFR.map((el: any) => {
              maxValueArray.push(Math.floor(el.data).toFixed(2));
              // this.tableAllData.map((dt:any) =>{
              //   if(dt.company == el.companyName){
              //     dt[clickedMetric] = el.data;
              //   }
              // })

              let obj: any = {
                company: el.companyName,
                country: el.countryName,
                latest_reported_year: el.period,
                id: el.id,
              };
              obj[clickedMetric] = Math.floor(el.data).toFixed(2);
              this.tableAllData.push(obj);
            });
          }

          // this.screener_data.value = this.getClone(this.tableAllData);
          this.screener_data.value = [];
          this.screener_data.value = this.getClone(this.tableAllData);
          let maxValue = Math.max(...maxValueArray);
          let minValue = Math.min(...maxValueArray);
          this.isFieldSelected[clickedMetric].max = maxValue;
          this.isFieldSelected[clickedMetric].options = {
            floor: minValue,
            ceil: maxValue,
            step: Math.round(maxValue / maxValueArray.length),
            showTicks: true,
            noSwitching: true,
            enforceRange: true,
            enforceStep: true,
          };
          setTimeout(() => {
            if (this.selectedCountryArray.length > 0) {
              var screenerValueArray: any = [];
              this.screener_data.value = this.tableAllData.map((dt: any) => {
                this.selectedCountryArray.map((ele: any) => {
                  if (dt.country == ele.text) {
                    screenerValueArray.push(dt);
                  }
                });
              });
              this.screener_data.value = screenerValueArray;
            } else {
              this.screener_data.value = this.getClone(this.tableAllData);
            }

            let slider: any = document.getElementById(clickedMetric);
            // console.log(slider);
            slider.childNodes[slider.childNodes.length - 1].childNodes.forEach(
              (el: any, i: any) => {
                this.screener_data.value.map((dt: any, ind: any) => {
                  if (ind === i) {
                    if (parseFloat(dt[clickedMetric]) >= 0) {
                      let stdHeight = 22;
                      let height = (
                        (stdHeight * dt[clickedMetric]) /
                        maxValue
                      ).toFixed(2);
                      height = height == '0.00' ? '1.00' : height;
                      // console.log(height, dt[clickedMetric], i);
                      el.style.height = height + 'px';
                    }
                  }
                });
              }
            );
            // if (this.countrySelected) {
            //   this.screener_data.value = this.tableAllData.filter((dt: any) => {
            //     return dt.country == this.countrySelected;
            //   });
            // } else {
            //   this.screener_data.value = this.getClone(this.tableAllData);
            // }
            this.finalScrenerData = this.screener_data;
            this.getMinandMaxData();
          }, 1000);
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);
          this.manualRefresh.emit();
        },
        (err) => {
          delete this.isFieldSelected[clickedMetric];
          let index: any;
          this.screener_data.title.map((el: any, i: any) => {
            if (el.key === clickedMetric) {
              index = i;
            }
          });
          if (index) {
            this.screener_data.title.splice(index, 1);
          }
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);
          this.errorMessage = true;
        }
      );
  }

  getMatricPVWithCurrency() {
    Object.keys(this.isFieldSelected).map((clickedKey) => {
      this.getEditMatricPV(
        this.isFieldSelected[clickedKey].fieldName,
        clickedKey
      );
    });
  }

  getEditMatricPV(clickedFieldName: string, clickedMetric: string) {
    this.financialMarketData
      .getEditMatricPV(
        clickedFieldName,
        this.selectedIndustry,
        this.selectedCurrency
      )
      .subscribe(
        (res) => {
          this.isLoading = false;
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);
          let marticDataPV = res;
          res.forEach((element: any) => {
            this.periodData.push(element.period);
          });
          let label: any = '';
          if (clickedMetric !== 'Volume') {
            let curUnit;
            if (res[0].currency && res[0].unit) {
              curUnit = `(${res[0].currency} ${res[0].unit})`;
            } else if (res[0].currency && !res[0].unit) {
              curUnit = `(${res[0].currency})`;
            } else if (!res[0].currency && res[0].unit) {
              curUnit = `(${res[0].unit})`;
            }

            curUnit = curUnit ?? '';
            label = clickedMetric + ' ' + curUnit;
          } else {
            label = clickedMetric;
          }
          this.isFieldSelected[clickedMetric].label = label;
          let customTitle = {
            label: label,
            key: clickedMetric,
            shorting: true,
            align: 'right',
            formattedNum: true,
          };
          if (this.clickedMetric == 'Stock Price') {
            this.screener_data.title.push(customTitle);
            let maxValueArray: any = [];
            if (this.tableAllData.length) {
              marticDataPV.map((el: any) => {
                maxValueArray.push(Math.floor(el.data).toFixed(2));
                this.tableAllData.map((dt: any) => {
                  if (dt.company == el.companyName) {
                    if (
                      isNaN(
                        this.util.numberWithCommas(
                          parseFloat(el.data)?.toFixed(2)
                        )
                      )
                    ) {
                      dt[clickedMetric] = '-';
                    } else {
                      dt[clickedMetric] = this.util.numberWithCommas(
                        parseFloat(el.data)?.toFixed(2)
                      );
                    }
                  }
                });
              });
            }

            if (!this.tableAllData.length) {
              marticDataPV.map((el: any) => {
                maxValueArray.push(Math.floor(el.data).toFixed(2));
                // this.tableAllData.map((dt:any) =>{
                //   if(dt.company == el.companyName){
                //     dt[clickedMetric] = el.data;
                //   }
                // })

                let obj: any = {
                  company: el.companyName,
                  country: el.countryName,
                  latest_reported_year: el.period,
                  id: el.id,
                };
                obj[clickedMetric] = Math.floor(el.data).toFixed(2);
                this.tableAllData.push(obj);
              });
            }

            // this.screener_data.value = this.getClone(this.tableAllData);
            this.screener_data.value = [];
            this.screener_data.value = this.getClone(this.tableAllData);
            let maxValue = Math.max(...maxValueArray);
            let minValue = Math.min(...maxValueArray);
            this.isFieldSelected[clickedMetric].max = maxValue;
            this.isFieldSelected[clickedMetric].options = {
              floor: minValue,
              ceil: maxValue,
              step: Math.round(maxValue / maxValueArray.length),
              showTicks: true,
              noSwitching: true,
              enforceRange: true,
              enforceStep: true,
            };
            setTimeout(() => {
              if (this.selectedCountryArray.length > 0) {
                var screenerValueArray: any = [];
                this.screener_data.value = this.tableAllData.map((dt: any) => {
                  this.selectedCountryArray.map((ele: any) => {
                    if (dt.country == ele.text) {
                      screenerValueArray.push(dt);
                    }
                  });
                });
                this.screener_data.value = screenerValueArray;
              } else {
                this.screener_data.value = this.getClone(this.tableAllData);
              }

              let slider: any = document.getElementById(clickedMetric);
              // console.log(slider);
              slider.childNodes[
                slider.childNodes.length - 1
              ].childNodes.forEach((el: any, i: any) => {
                this.screener_data.value.map((dt: any, ind: any) => {
                  if (ind === i) {
                    if (parseFloat(dt[clickedMetric]) >= 0) {
                      let stdHeight = 22;
                      let height = (
                        (stdHeight * dt[clickedMetric]) /
                        maxValue
                      ).toFixed(2);
                      height = height == '0.00' ? '1.00' : height;
                      // console.log(height, dt[clickedMetric], i);
                      el.style.height = height + 'px';
                    }
                  }
                });
              });
              // if (this.countrySelected) {
              //   this.screener_data.value = this.tableAllData.filter((dt: any) => {
              //     return dt.country == this.countrySelected;
              //   });
              // } else {
              //   this.screener_data.value = this.getClone(this.tableAllData);
              // }
              this.finalScrenerData = this.screener_data;
              this.getMinandMaxData();
            }, 1000);
            ++this.count_res;
            this.util.checkCountValue(this.total_count_res, this.count_res);

            this.manualRefresh.emit();
          } else {
            this.screener_data.title.push(customTitle);
            let maxValueArray: any = [];
            if (this.tableAllData.length) {
              marticDataPV.map((el: any) => {
                maxValueArray.push(Math.floor(el.volume ?? el.data).toFixed(2));
                this.tableAllData.map((dt: any) => {
                  if (dt.company == el.companyName) {
                    dt[clickedMetric] = Math.floor(
                      el.volume ?? el.data
                    ).toFixed(2);
                  }
                });
              });
            }

            if (!this.tableAllData.length) {
              marticDataPV.map((el: any) => {
                maxValueArray.push(Math.floor(el.volume ?? el.data).toFixed(2));
                // this.tableAllData.map((dt:any) =>{
                //   if(dt.company == el.companyName){
                //     dt[clickedMetric] = el.volume ?? el.data;
                //   }
                // })

                let obj: any = {
                  company: el.companyName,
                  country: el.countryName,
                  latest_reported_year: el.period,
                  id: el.id,
                };
                obj[clickedMetric] = Math.floor(el.volume ?? el.data).toFixed(
                  2
                );
                this.tableAllData.push(obj);
              });
            }

            // this.screener_data.value = this.getClone(this.tableAllData);
            this.screener_data.value = [];
            this.screener_data.value = this.getClone(this.tableAllData);
            let maxValue = Math.max(...maxValueArray);
            let minValue = Math.min(...maxValueArray);
            this.isFieldSelected[clickedMetric].max = maxValue;
            this.isFieldSelected[clickedMetric].options = {
              floor: minValue,
              ceil: maxValue,
              step: Math.round(maxValue / maxValueArray.length),
              showTicks: true,
              noSwitching: true,
              enforceRange: true,
              enforceStep: true,
            };
            setTimeout(() => {
              if (this.selectedCountryArray.length > 0) {
                var screenerValueArray: any = [];
                this.screener_data.value = this.tableAllData.map((dt: any) => {
                  this.selectedCountryArray.map((ele: any) => {
                    if (dt.country == ele.text) {
                      screenerValueArray.push(dt);
                    }
                  });
                });
                this.screener_data.value = screenerValueArray;
              } else {
                this.screener_data.value = this.getClone(this.tableAllData);
              }

              let slider: any = document.getElementById(clickedMetric);
              // console.log(slider);
              slider.childNodes[
                slider.childNodes.length - 1
              ].childNodes.forEach((el: any, i: any) => {
                this.screener_data.value.map((dt: any, ind: any) => {
                  if (ind === i) {
                    if (parseFloat(dt[clickedMetric]) >= 0) {
                      let stdHeight = 22;
                      let height = (
                        (stdHeight * dt[clickedMetric]) /
                        maxValue
                      ).toFixed(2);
                      height = height == '0.00' ? '1.00' : height;
                      // console.log(height, dt[clickedMetric], i);
                      el.style.height = height + 'px';
                    }
                  }
                });
              });
              // if (this.countrySelected) {
              //   this.screener_data.value = this.tableAllData.filter((dt: any) => {
              //     return dt.country == this.countrySelected;
              //   });
              // } else {
              //   this.screener_data.value = this.getClone(this.tableAllData);
              // }
              this.finalScrenerData = this.screener_data;
              this.getMinandMaxData();
            }, 1000);
            ++this.count_res;
            this.util.checkCountValue(this.total_count_res, this.count_res);
            this.manualRefresh.emit();
          }
        },
        (err) => {
          delete this.isFieldSelected[clickedMetric];
          let index: any;
          this.screener_data.title.map((el: any, i: any) => {
            if (el.key === clickedMetric) {
              index = i;
            }
          });
          if (index) {
            this.screener_data.title.splice(index, 1);
          }
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);
          this.errorMessage = true;
        }
      );
  }

  getMatricVRWithCurrency() {
    Object.keys(this.isFieldSelected).map((clickedKey) => {
      this.getEditMatricVR(
        this.isFieldSelected[clickedKey].fieldName,
        clickedKey
      );
    });
  }

  getEditMatricVR(clickedFieldName: string, clickedMetric: string) {
    // Object.keys(this.isFieldSelected).map(clickedKey => {
    this.financialMarketData
      .getEditMatricVR(
        this.selectedIndustry,
        clickedFieldName,
        this.selectedCurrency
      )
      .subscribe(
        (res) => {
          this.isLoading = false;
          let editMatrixVRData = res;

          // for period
          res.forEach((element: any) => {
            this.periodData.push(element?.period);
          });

          let curUnit;
          if (res[0].currency && res[0].unit) {
            curUnit = `(${res[0].currency} ${res[0].unit})`;
          } else if (res[0].currency && !res[0].unit) {
            curUnit = `(${res[0].currency})`;
          } else if (!res[0].currency && res[0].unit) {
            curUnit = `(${res[0].unit})`;
          }
          curUnit = curUnit ?? '';
          let label = clickedMetric + ' ' + curUnit;
          this.isFieldSelected[clickedMetric].label = label;
          let customTitle = {
            label: label,
            key: clickedMetric,
            shorting: true,
            align: 'right',
            formattedNum: true,
          };
          this.screener_data.title.push(customTitle);
          let maxValueArray: any = [];
          if (this.tableAllData.length) {
            editMatrixVRData.map((el: any) => {
              maxValueArray.push(Math.floor(el.data).toFixed(2));
              this.tableAllData.map((dt: any) => {
                if (dt.company == el.companyName) {
                  dt[clickedMetric] = Math.floor(el.data).toFixed(2);
                }
              });
            });
          }

          if (!this.tableAllData.length) {
            editMatrixVRData.map((el: any) => {
              maxValueArray.push(Math.floor(el.data).toFixed(2));
              // this.tableAllData.map((dt:any) =>{
              //   if(dt.company == el.companyName){
              //     dt[clickedMetric] = el.data;
              //   }
              // })

              let obj: any = {
                company: el.companyName,
                country: el.countryName,
                latest_reported_year: el.period,
                id: el.id,
              };
              obj[clickedMetric] = Math.floor(el.data).toFixed(2);
              this.tableAllData.push(obj);
            });
          }
          this.screener_data.value = [];
          this.screener_data.value = this.getClone(this.tableAllData);
          let maxValue = Math.max(...maxValueArray);
          let minValue = Math.min(...maxValueArray);
          this.isFieldSelected[clickedMetric].max = maxValue;
          this.isFieldSelected[clickedMetric].options = {
            floor: minValue,
            ceil: maxValue,
            step: 2,
            showTicks: true,
            noSwitching: true,
            enforceStep: true,
            enforceRange: true,
            hideLimitLabels: true,
            hidePointerLabels: true,
            draggableRange: true,
          };
          setTimeout(() => {
            if (this.selectedCountryArray.length > 0) {
              var screenerValueArray: any = [];
              this.screener_data.value = this.tableAllData.map((dt: any) => {
                this.selectedCountryArray.map((ele: any) => {
                  if (dt.country == ele.text) {
                    screenerValueArray.push(dt);
                  }
                });
              });
              this.screener_data.value = screenerValueArray;
            } else {
              this.screener_data.value = this.getClone(this.tableAllData);
            }

            let slider: any = document.getElementById(clickedMetric);
            ++this.count_res;
            this.util.checkCountValue(this.total_count_res, this.count_res);
            // console.log(slider);
            slider.childNodes[
              slider.childNodes.length - 1
            ]?.childNodes?.forEach((el: any, i: any) => {
              this.screener_data.value.map((dt: any, ind: any) => {
                if (ind === i) {
                  if (parseFloat(dt[clickedMetric]) >= 0) {
                    let stdHeight = 22;
                    let height = (
                      (stdHeight * dt[clickedMetric]) /
                      maxValue
                    )?.toFixed(2);
                    height = height == '0.00' ? '1.00' : height;
                    // console.log(height, dt[clickedMetric], i);
                    el.style.height = height + 'px';
                  }
                }
              });
            });
            // if (this.countrySelected) {
            //   this.screener_data.value = this.tableAllData.filter((dt: any) => {
            //     return dt.country == this.countrySelected;
            //   });
            // } else {
            //   this.screener_data.value = this.getClone(this.tableAllData);
            // }
            this.finalScrenerData = this.screener_data;
            this.getMinandMaxData();
          }, 1000);
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);
          this.manualRefresh.emit();
        },
        (err) => {
          console.error(err);
          delete this.isFieldSelected[clickedMetric];
          let index: any;
          this.screener_data.title.map((el: any, i: any) => {
            if (el.key === clickedMetric) {
              index = i;
            }
          });
          if (index) {
            this.screener_data.title.splice(index, 1);
          }
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);
          this.errorMessage = true;
        }
      );

    // })
  }

  displayStyle = 'none';
  countrySelected: any;
  openPopup() {
    this.displayStyle = 'block';
  }
  closePopup() {
    this.displayStyle = 'none';
    this.errorMessage = false;
  }

  getClone(obj: any) {
    let _obj: any;
    _obj = JSON.parse(JSON.stringify(obj));
    return _obj;
  }

  lastClick: any = 0;
  delay: any = 20;
  getValueData(data: any, obj: any) {
    // if (this.lastClick >= Date.now() - this.delay) return;
    // this.lastClick = Date.now();
    this.filterTableData(obj);
    // console.log('1070-------', obj);
  }

  getHighValueData(data: any, obj: any) {
    this.filterTableData(obj);

    // console.log('value', data);
    this.highValueData = data;
  }
  filter: any = false;
  filterTableData(obj: any) {
    this.filter = true;
    var data = this.tableAllData.filter((dt: any) => {
      return dt[obj.key] >= obj.min && dt[obj.key] <= obj.max;
    });

    if (this.selectedCountryArray.length > 0) {
      var screenerValueArray: any = [];
      this.screener_data.value = data.map((dt: any) => {
        this.selectedCountryArray.map((ele: any) => {
          if (dt.country == ele.text) {
            screenerValueArray.push(dt);
          }
        });
      });
      this.screener_data.value = screenerValueArray;
    } else {
      this.screener_data.value = this.getClone(data);
    }

    this.finalScrenerData = this.screener_data;
  }

  removeMatric(key: any) {
    delete this.isFieldSelected[key];
    let index: any;
    this.screener_data.title.map((el: any, i: any) => {
      if (el.key === key) {
        index = i;
      }
    });
    if (index) {
      this.screener_data.title.splice(index, 1);
    }
    this.tableAllData.map((el: any) => {
      delete el[key];
    });

    // this.screener_data.value = this.getClone(this.tableAllData);
    this.screener_data.value = [];
    if (this.selectedCountryArray.length > 0) {
      var screenerValueArray: any = [];
      this.screener_data.value = this.tableAllData.map((dt: any) => {
        this.selectedCountryArray.map((ele: any) => {
          if (dt.country == ele.text) {
            screenerValueArray.push(dt);
          }
        });
      });
      this.screener_data.value = screenerValueArray;
    } else {
      this.screener_data.value = this.getClone(this.tableAllData);
    }
    // if (this.countrySelected) {
    //   this.screener_data.value = this.tableAllData.filter((dt: any) => {
    //     return dt.country == this.countrySelected;
    //   });
    // } else {
    //   this.screener_data.value = this.getClone(this.tableAllData);
    // }
    this.finalScrenerData = this.screener_data;
    this.getMinandMaxData();
  }

  fileName = 'ExcelSheet.xls';
  workbook: ExcelProper.Workbook = new Excel.Workbook();
  blobType: string =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  exportexcel() {
    this.workbook = new Excel.Workbook();
    let headerdata = this.finalScrenerData.title;
    let tabledataValues = this.finalScrenerData.value;
    var industryName = this.industryData.filter(
      (ele: any) => ele.id == this.selectedIndustry
    );
    let worksheet = this.workbook.addWorksheet(
      industryName[0].text.replace(/[&\/\\#, +()$~%.'":*?<>{}]/g, '_'),
      { views: [{ showGridLines: false }] }
    );

    var headingList: any = [];

    // headerdata.slice(0, 3);
    headerdata.forEach((ele: any) => {
      headingList.push({ header: '', key: ele.key, width: 25 });
    });
    worksheet.columns = [
      { header: '', key: 'space', width: 5 },
      // { header: '', key: 'company', width: 25 },
      // { header: '', key: 'country', width: 20 },
      // { header: '', key: 'latest_reported_year', width: 20 },
      ...headingList,
    ];
    worksheet.getColumn(3).alignment = {
      vertical: 'middle',
      horizontal: 'left',
      wrapText: false,
    };
    // Add a couple of Rows by key-value, after the last current row, using the column keys
    worksheet.addRow([]);
    worksheet.addRow([]);
    worksheet.addRow({
      space: '',
      company: 'Industry',
      country: industryName[0]?.text,
      latest_reported_year: '',
    });
    worksheet.addRow({
      space: '',
      company: 'Currency',
      country: this.selectedCurrency,
      latest_reported_year: '',
    });
    worksheet.addRow([]);
    var obj: any = {};
    headerdata.forEach((elemet: any) => {
      var objnew: any = {};
      (objnew[elemet.key] = elemet.label), (obj = { ...obj, ...objnew });
    });
    let rowf = worksheet.addRow({
      space: '',
      company: 'Company',
      country: 'Country',
      latest_reported_year: 'Latest Reported Year',
      ...obj,
    });
    worksheet.getRow(7).eachCell({ includeEmpty: true }, function (cell) {
      worksheet.getCell(cell.address).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '203764' },
      };
      worksheet.getCell(cell.address).border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
      worksheet.getCell(cell.address).font = {
        name: 'Arial',
        bold: true,
        size: 10,
      };
      worksheet.getCell(cell.address).alignment = {
        horizontal: 'center',
      };
    });

    rowf.alignment = {
      vertical: 'middle',
      horizontal: 'left',
      wrapText: true,
    };
    worksheet.getColumn(1).border = {
      top: { style: 'thin', color: { argb: 'FFFFFF' } },
      bottom: { style: 'thin', color: { argb: 'FFFFFF' } },
    };
    let datasheet;
    tabledataValues.map((da: any) => {
      var objnew: any = {};
      objnew['space'] = '';
      var dataRow = { ...objnew, ...da };
      datasheet = worksheet.addRow(dataRow);
    });

    let rowIndex = 8;
    for (rowIndex; rowIndex <= worksheet.rowCount; rowIndex++) {
      worksheet.getRow(rowIndex).alignment = {
        vertical: 'middle',
        horizontal: 'right',
      };
      worksheet
        .getRow(rowIndex)
        .eachCell({ includeEmpty: true }, function (cell) {
          worksheet.getCell(cell.address).border = {
            right: { style: 'thin' },
          };
          worksheet.getCell(cell.address).font = {
            name: 'Arial',
            size: 10,
          };
        });
    }

    worksheet
      .getRow(worksheet.rowCount)
      .eachCell({ includeEmpty: true }, function (cell) {
        if (cell.address === `A${worksheet.rowCount}`) {
          worksheet.getCell(cell.address).border = {
            right: { style: 'thin' },
          };
        } else {
          worksheet.getCell(cell.address).border = {
            bottom: { style: 'thin' },
            right: { style: 'thin' },
          };
        }
      });

    var myBase64Image =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOYAAAAxCAYAAADOUdUsAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA49pVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ4IDc5LjE2NDAzNiwgMjAxOS8wOC8xMy0wMTowNjo1NyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOmMwNWZhOGI3LWUwMzUtMTM0My1hZWQ3LWViMTk4ZmYwNDYxNSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpEOUVGQzNDNTkyMDUxMUVCOERFN0IyQTE1QUNDNDBEMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpEOUVGQzNDNDkyMDUxMUVCOERFN0IyQTE1QUNDNDBEMSIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMSAoV2luZG93cykiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDplN2RjMTY1ZS0xOTMzLWY3NGUtOGY0ZS00ZGY1ODQ3MzdmODUiIHN0UmVmOmRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDpjMDVmYThiNy1lMDM1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';
    var imageId2 = this.workbook.addImage({
      base64: myBase64Image,
      extension: 'png',
    });

    worksheet.getRow(1).height = 40;
    worksheet.addImage(imageId2, 'B1:B1');
    worksheet.getRow(7).height = 25;
    worksheet.getColumn(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFFFF' },
    };
    worksheet.getColumn(2).alignment = {
      horizontal: 'left',
      vertical: 'middle',
    };
    worksheet.getColumn(2).font = {
      name: 'Arial',
      bold: true,
      size: 10,
    };
    worksheet.getCell('B4').font = {
      color: { argb: '2F75B5' },
      bold: true,
      name: 'Arial',
    };
    worksheet.getCell('B5').font = {
      color: { argb: '2F75B5' },
      bold: true,
      name: 'Arial',
    };
    worksheet.getCell('C4').font = {
      color: { argb: '000000' },
      name: 'Arial',
      size: 10,
    };
    worksheet.getCell('C5').font = {
      color: { argb: '000000' },
      name: 'Arial',
      size: 10,
    };
    worksheet.getRow(7).alignment = {
      horizontal: 'center',
      vertical: 'middle',
      wrapText: true,
    };
    worksheet.getRow(7).font = {
      name: 'Arial',
      bold: true,
      size: 10,
      color: { argb: 'FFFFFF' },
    };

    this.workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], { type: this.blobType });
      saveAs(blob, 'Screening List');
    });
  }
  onHighValueChanged(e: any, item: any) {
    // console.log(this.isFieldSelected[item], '1396---');
    if (e != 0) {
      this.isFieldSelected[item].max = e;
    }
    // } else {
    //   console.log(this.isFieldSelected[item]);
    // }
  }

  getFucntion(isFieldSelected: any, item: any) {
    // if (isFieldSelected[item].max != 0) {
    return isFieldSelected[item].max;
    // }
  }

  clearall() {
    window.location.reload();
  }
}

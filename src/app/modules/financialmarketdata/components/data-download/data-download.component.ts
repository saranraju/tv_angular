import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FinancialMarketDataService } from 'src/app/services/financialmarketdata.service';
import { differenceWith, find } from 'lodash';
import { elementEventFullName } from '@angular/compiler/src/view_compiler/view_compiler';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-data-download',
  templateUrl: './data-download.component.html',
  styleUrls: ['./data-download.component.scss'],
})
export class DataDownloadComponent implements OnInit {
  optionData: any = [];

  tempSecondDivData: any = [];
  tempThirdDivData: any = [];
  SecondDivData: any = [];
  thirdDivData: any = [];

  //api values
  commodity_list: any = [];
  show_icon: boolean = false;
  country_list: any;
  type: any;
  macro_indicator: any;
  Unique_macroIndicator: any;
  show_alert_message: boolean = false;
  data_type: any;
  key_type: any;
  company_list: any;
  index: any;
  show_company_detail: boolean = false;
  exchange_list: any;
  sub_exchange_list: any;
  expend_element: any;
  show_search_filter: boolean = false;
  exchange_company_value_type: any;
  indicator_name: any;
  countryISOCode: any;
  periodData: any;
  selectedPeriosData: any;
  downloadLoadValue: any;
  thirdArrayStaticValue: boolean = true;
  thirdArrayData: any;
  thirdArrayValues: any;
  check_value: boolean = false;
  commodityArrayList: any = [];
  checkBoxValue: any = [];
  selectedCommodityperiodData: any;
  SecondData: any = [];
  previousAPI: any = null;
  ErrorMessage: any;
  NextErrorMessage: any;
  @ViewChild('companycheck') iconCheck: any;
  @ViewChild('companycheck') companycheck: any;
  @ViewChild('economycheck') economycheck: any;
  @ViewChild('macrocheck') macrocheck: any;
  @ViewChild('countrycheck') countrycheck: any;
  @ViewChild('comoditycheck') comoditycheck: any;
  @ViewChild('companyTwo') companyTwo: any;
  @ViewChild('companyThree') companyThree: any;
  @ViewChild('companyOne') companyOne: any;
  @ViewChild('subexchange') subexchange: any;
  @ViewChild('exchange') exchange: any;
  CommodityperiodData: any = [
    {
      id: 1,
      text: 'Select Periodcity',
    },
    {
      id: 2,
      text: 'Daily',
    },
  ];
  constructor(
    private financialMarketData: FinancialMarketDataService,
    public auth: AuthService,
    private router: Router,
    public util: UtilService
  ) {}

  count_res: any = 0;
  total_count_res: any = '';
  duplicate_Values: boolean = false;
  periodButtonType: any;
  ngOnInit(): void {
    this.count_res = 0;
    this.total_count_res = 5;
    this.util.loaderService.display(true);
    this.commodityList();
    this.countryList();
    this.MacroIndicatorList();
    this.companyList();
    this.ExchangeList();
    this.auth.$Isdatadownload.subscribe((res) => {
      if (res == true) {
        this.NodataAlert();
      }
    });
  }

  doCheckCount: any = false;
  ngDoCheck(): void {
    if (this.count_res === 5 && !this.doCheckCount) {
      this.util.loaderService.showTutorial(true);
      this.doCheckCount = true;
    }
  }
  
  NodataAlert() {
    this.auth.openPopupModal = true;
    this.ErrorMessage = 'No Data is reported for the selected period.';
    this.NextErrorMessage =
      'Kindly select the dates as per Metrics & Periodicity selected';
  }

  searchChildNode(event: any, type?: any) {
    if (type === 'exchange') {
      if (event.target.value) {
        this.exchange_list = this.exchange_list_temp.filter((el: any) => {
          return el.exchangeName
            .toLowerCase()
            .includes(event.target.value.toLowerCase());
        });
      } else {
        this.exchange_list = this.exchange_list_temp;
      }
    } else if (type === 'macro') {
      if (event.target.value) {
        this.Unique_macroIndicator = this.Unique_macroIndicatorTemp.filter(
          (el: any) => {
            return el.category
              .toLowerCase()
              .includes(event.target.value.toLowerCase());
          }
        );
      } else {
        this.Unique_macroIndicator = this.Unique_macroIndicatorTemp;
      }
    } else if (type === 'country') {
      if (event.target.value) {
        this.country_list = this.country_list_temp.filter((el: any) => {
          return el.countryName
            .toLowerCase()
            .includes(event.target.value.toLowerCase());
        });
      } else {
        this.country_list = this.country_list_temp;
      }
    } else if (type === 'commodity') {
      if (event.target.value) {
        this.commodity_list = this.commodity_list_temp.filter((el: any) => {
          return el.name
            .toLowerCase()
            .includes(event.target.value.toLowerCase());
        });
      } else {
        this.commodity_list = this.commodity_list_temp;
      }
    } else {
      this.nodeFilter(event?.target?.value, event?.target?.nextElementSibling);
    }
  }

  getCompanySearchDataHandler(event: any) {
    let transactionsComapnyFormattedData: any = [];
    if (this.previousAPI !== null) {
      this.previousAPI.unsubscribe();
    }
    this.previousAPI = this.financialMarketData
      .getTransactionsCompanySearchDataBenchmark(event?.target.value)
      .subscribe(
        (res) => {
          this.company_list = res;
        },
        (err) => {
          console.log('error', err.message);
        }
      );
  }

  exchangeCompanySearchTimeout: any = null;
  exchangeCompanySearch(event: any, exchange: any) {
    clearTimeout(this.exchangeCompanySearchTimeout);

    if (this.previousAPI !== null) {
      this.previousAPI.unsubscribe();
    }

    this.exchangeCompanySearchTimeout = setTimeout(() => {
      this.count_res = 0;
      this.total_count_res = 1;
      this.util.loaderService.display(true);

      this.previousAPI = this.financialMarketData
        .getSubExchangeList(exchange.exchangeCode, event.target.value)
        .subscribe(
          (res: any) => {
            ++this.count_res;
            this.util.checkCountValue(this.total_count_res, this.count_res);

            this.sub_exchange_list = res;
          },
          (err) => {
            ++this.count_res;
            this.util.checkCountValue(this.total_count_res, this.count_res);

            console.log('error', err.message);
          }
        );
    }, 1000);
  }

  nodeFilter(value: any, event: any) {
    if (event?.innerText.toLowerCase().includes(value)) {
      event['style'].display = 'block';
      this.nodeFilter(value, event?.nextElementSibling);
    } else {
      if (event?.nextElementSibling != null) {
        event.style.display = 'none';
        this.nodeFilter(value, event?.nextElementSibling);
      }
    }
  }

  selectElement(data: any, event: any, type: any) {
    this.exchange_company_value_type = event.target.innerHTML;
    let forBg = document.querySelectorAll('.custom-bg-transparent');
    forBg.forEach((el: any) => {
      el.style.background = 'transparent';
    });
    event.srcElement.style.background = '#ffc000';
    this.tempSecondDivData = data;
    this.data_type = type;
  }

  removeSecondLevel(value: any, i: any) {
    const index = this.SecondDivData.indexOf(value);
    if (index > -1) {
      this.SecondDivData.splice(i, 1);
      this.removeThirdLevel(value, index, 'remove');
    }
  }

  forSecondLevel() {
    if (this.tempSecondDivData && this.data_type) {
      var data: any = [];
      var newObject: any = {};
      this.tempSecondDivData['data_type'] = this.data_type;
      this.tempSecondDivData['exchange_company_value_type'] =
        this.exchange_company_value_type;
      newObject = this.tempSecondDivData;
      var newValueType = this.exchange_company_value_type;
      var newKey = newObject['exchange_company_value_type'];
      Object.keys(this.tempSecondDivData).forEach(function (index) {
        newObject = { ...newObject, [newKey]: newValueType };
      });
      data = [...data, newObject];
      data.forEach((ele: any, i: any) => {
        let dataDuplicateCheck = true;
        this.SecondDivData.forEach((cc: any, ind: any) => {
          if (ele.data_type == 'Macro Indicator') {
            if (cc.indicatorDataId == ele.indicatorDataId) {
              dataDuplicateCheck = false;
            }
          }
          if (ele.data_type == 'Country_one') {
            if (cc.id == ele.id) {
              dataDuplicateCheck = false;
            }
          }
          if (ele.data_type == 'Commodity') {
            if (cc.telCommodityId == ele.telCommodityId) {
              dataDuplicateCheck = false;
            }
          }
          if (ele.data_type == 'Exchange') {
            if (
              cc.factSetEntityId == ele.factSetEntityId &&
              cc.exchange_company_value_type.trim() ==
              ele.exchange_company_value_type.trim() &&
              cc.exchangeCode == ele.exchangeCode
            ) {
              dataDuplicateCheck = false;
            }
          }
          if (ele.data_type == 'Company_two') {
            if (
              cc.factSetEntityId == ele.factSetEntityId &&
              cc.exchange_company_value_type.trim() ==
              ele.exchange_company_value_type.trim() &&
              cc.exchangeCode == ele.exchangeCode
            ) {
              dataDuplicateCheck = false;
            }
          }
        });
        if (dataDuplicateCheck) {
          if (
            this.SecondDivData.indexOf(ele) === -1 ||
            ele.data_type == 'Exchange' ||
            ele.data_type == 'Company_two'
          ) {
            this.SecondDivData = [...this.SecondDivData, ele];

            this.SecondDivData.forEach((ele: any, i: any) => {
              if (data.find((x: any) => x == ele)) {
                this.CheckOptionDateValues(ele, i);
              }
            });
          }
        } else {
          this.auth.closeInsidePopup = true;
          this.duplicate_Values = true;
        }
      });
    }
  }
  secondArrayOfData(item: any): any {
    if (item.data_type == 'Exchange') {
      return item.name + '-' + item.exchange_company_value_type;
    }
    if (item.data_type == 'Company_two') {
      return item.name + '-' + item.exchange_company_value_type;
    }
    if (item.data_type == 'Macro Indicator') {
      if (item.category) {
        return item.category;
      }
    }

    if (item.data_type == 'Country_one') {
      if (item.countryName) {
        return item.countryName;
      }
    }
    if (item.data_type == 'Commodity') {
      return 'Commodity' + ' - ' + item.name;
    }
  }

  CheckOptionDateValues(ele: any, i: any) {
    if (ele.data_type == 'Exchange') {
      if (ele['exchange_company_value_type'] == 'Financial') {
        ele['optionData'] = [
          {
            value: 'Balance Sheet',
            category: 'Balance Sheet',
            checked: false,
          },
          { value: 'P&L', category: 'P&L', checked: false },
          { value: 'Cash Flow', category: 'Cash Flow', checked: false },
          {
            value: 'Financial Ratios',
            category: 'Financial Ratios',
            checked: false,
          },
          {
            value: 'Valuation Ratios',
            category: 'Valuation Ratios',
            checked: false,
          },
        ];
      }
      if (ele['exchange_company_value_type'] == 'Share Price') {
        ele['optionData'] = [
          { value: 'High', category: 'High', checked: false },
          { value: 'Low', category: 'Low', checked: false },
          { value: 'Open', category: 'Open', checked: false },
          { value: 'Close', category: 'Close', checked: false },
        ];
      }
      if (
        ele['exchange_company_value_type'] == 'Beta ' ||
        ele['exchange_company_value_type'] == 'Beta' ||
        ele['exchange_company_value_type'] == ' Beta'
      ) {
        if (ele.id) this.getBetaList(ele.id, i);
      }
    }
    if (ele['data_type'] == 'Company_two') {
      if (ele['exchange_company_value_type'] == ' Financial') {
        ele['optionData'] = [
          {
            value: 'Balance Sheet',
            category: 'Balance Sheet',
            checked: false,
          },
          { value: 'P&L', category: 'P&L', checked: false },
          { value: 'Cash Flow', category: 'Cash Flow', checked: false },
          {
            value: 'Financial Ratios',
            category: 'Financial Ratios',
            checked: false,
          },
          {
            value: 'Valuation Ratios',
            category: 'Valuation Ratios',
            checked: false,
          },
        ];
      }
      if (ele['exchange_company_value_type'] == ' Share Price') {
        ele['optionData'] = [
          { value: 'High', category: 'High', checked: false },
          { value: 'Low', category: 'Low', checked: false },
          { value: 'Open', category: 'Open', checked: false },
          { value: 'Close', category: 'Close', checked: false },
        ];
      }
      if (
        ele['exchange_company_value_type'] == 'Beta ' ||
        ele['exchange_company_value_type'] == ' Beta' ||
        ele['exchange_company_value_type'] == 'Beta'
      ) {
        if (ele.id) {
          this.count_res = 0;
          this.total_count_res = 1;
          this.util.loaderService.display(true);
          this.getBetaList(ele.id, i);
        }
      }
    }
    if (ele['data_type'] == 'Macro Indicator') {
      if (ele.category) {
        this.count_res = 0;
        this.total_count_res = 1;
        this.util.loaderService.display(true);
        this.macroIndicatorBasedOnCheckList(ele.category, i);
      }
    }
    if (ele['data_type'] == 'Country_one') {
      this.count_res = 0;
      this.total_count_res = 1;
      this.util.loaderService.display(true);
      if (ele.countryIsoCode3) this.countryISOCode = ele.countryIsoCode3;
      this.getCountryBasedOnCheckBoxList(ele.countryIsoCode3, i);
    }
    if (ele['data_type'] == 'Commodity') {
      ele['optionData'] = [
        { value: 'High', category: 'High', checked: false },
        { value: 'Low', category: 'Low', checked: false },
        { value: 'Open', category: 'Open', checked: false },
        { value: 'Close', category: 'Close', checked: false },
      ];
    }
  }

  ccheck: any = [];
  checkboxdata: any = [];
  changeSelection(event: any, data: any, data_one: any, i: any, ind: any) {
    if (event.target.checked) {
      data.checked = true;
      console.log('data_one ', data_one);
      console.log('secomd div', this.SecondDivData);
      let newArray: any = [];
      newArray = this.SecondDivData.slice();
      this.SecondDivData.length = 0;
      if (newArray.length > 0) {
        newArray.forEach((e: any, i: any) => {
          e.optionData.filter((el: any) => {
            if (el.checked == true) {
              let pdata: any = [
                {
                  id: 1,
                  text: 'Select Periodicity',
                },
              ];
              pdata.push({
                id: pdata.length + 1,
                text: el.periodType,
              });
              el['periodicity'] = pdata;
            }
          });
        });
      }
      this.SecondDivData = newArray.slice();
      if (data.optionData[ind].checked) {
        if (data.data_type == 'Company_two' || data.data_type == 'Exchange') {
          let isRepeated = true;
          this.tempThirdDivData.forEach((element: any, ix: any) => {
            if (
              element.id == data.id &&
              element.exchange_company_value_type ==
                data.exchange_company_value_type
            ) {
              isRepeated = false;
              element['checkedValues'].push(data_one);
            }
          });
          if (isRepeated) {
            data['checkedValues'] = [data_one];
            this.tempThirdDivData.push(data);
          }
        } else if (data.data_type === 'Macro Indicator') {
          let isRepeated = true;
          this.tempThirdDivData.forEach((element: any, ix: any) => {
            if (
              element.category ==
                data.category
            ) {
              isRepeated = false;
              element['checkedValues'].push(data_one);
            }
          });
          if (isRepeated) {
            data['checkedValues'] = [data_one];
            this.tempThirdDivData.push(data);
          }
        } else {
          this.tempThirdDivData.push(data);
          this.tempThirdDivData = [...new Set(this.tempThirdDivData)];
        }

        console.log(' this.tempThirdDivData checked ', this.tempThirdDivData);
      }

      this.downloadLoadValue = {
        value: this.tempThirdDivData,
        option_value: data.optionData,
        duplicate_value: this.duplicate_Values,
        btnType: this.periodButtonType,
        length: this.thirdDivData?.length,
        commodity_length: this.commodityArrayList?.length,
      };

      data['optionData'][ind] = data_one;
      if (data.data_type == 'Exchange' || data.data_type == 'Company_two') {
        this.count_res = 0;
        this.total_count_res = 1;
        this.util.loaderService.display(true);
        this.getBetaPeriodicityDataList(data);
      }
      if (data.data_type == 'Macro Indicator') {
        this.count_res = 0;
        this.total_count_res = 1;
        this.util.loaderService.display(true);
        this.getPeriodicityDataList(
          data.category,
          data_one.countryIsoCode3,
          ind,
          data
        );
      }

      if (data.data_type == 'Country_one') {
        this.count_res = 0;
        this.total_count_res = 1;
        this.util.loaderService.display(true);
        this.getPeriodicityDataList(
          data_one.category,
          data.countryIsoCode3,
          ind,
          data
        );
      }
    } else {
      if (data.data_type == 'Company_two' || data.data_type == 'Exchange') {
        this.tempThirdDivData.forEach((element: any) => {
          if (
            element.id == data.id &&
            element.exchange_company_value_type ==
              data.exchange_company_value_type
          ) {
            element.checkedValues = element.checkedValues.filter((el: any) => {
              if (el.checked == true) {
                return el;
              }
            });
          }
        });
        this.thirdDivData.forEach((el: any) => {
          if (el.id == data.id &&
            el.exchange_company_value_type ==
              data.exchange_company_value_type) {
            el.periodData.selectedPeriosData = '1';
          }
        });
      } else if (data.data_type == 'Macro Indicator') {
        this.tempThirdDivData.forEach((element: any) => {
          if (
            element.category ==
              data.category
          ) {
            element.checkedValues = element.checkedValues.filter((el: any) => {
              if (el.checked == true) {
                return el;
              }
            });
          }
        });
        this.thirdDivData.forEach((el: any) => {
          if (el.category == data.category) {
            el.periodData.selectedPeriosData = '1';
            this.formattedData = el.periodData = this.formattedData.filter((element: any) => {
              return element.countryId !== data_one.countryIsoCode3
            })
            this.formattedData2 = el.periodData = this.getUniqueListBy(this.formattedData, 'text')
          }
        });
      } else {
        const index = this.tempThirdDivData.indexOf(data);
        const ind = this.checkBoxValue.indexOf(data_one);

        if (index > -1) {
          this.tempThirdDivData.splice(index, 1);
        }
        if (ind > -1) {
          this.commodityArrayList.splice(ind, 1);
          this.checkBoxValue.splice(ind, 1);
        }
      }
    }
  }

  expandCollapse(event: any, indexId: any) {
    event.srcElement.classList.toggle('fa-minus');
    var element: any = document.querySelectorAll('.for-expand');
    let index_one = indexId;
    element.forEach((el: any, index: any) => {
      if (indexId === index) {
        element[index].classList.toggle('display-none');
      }
    });
  }

  forThirdLevel(type: any) {
    if (this.tempThirdDivData.length && type) {
      let data: any = [];
      data = [...new Set(this.tempThirdDivData)];
      console.log('data', data);
      if (data.length > 0) {
        this.thirdDivData = data;
      }
      console.log('onclick', this.thirdDivData);
      this.commodityArrayList = [];
      this.commodityArrayList = this.SecondDivData.filter(
        (array: any, i: any) => {
          for (let j = 0; j < array.optionData.length; j++) {
            if (
              array.data_type == 'Commodity' &&
              array.optionData[j].checked == true
            ) {
              return array;
            }
          }
        }
      );

      this.commodityArrayList.forEach((ele: any, i: any) => {
        if (ele.data_type == 'Commodity') {
          this.commodityArrayList[i]['periodData'] = [
            {
              id: 1,
              text: 'Select Periodcity',
            },
            {
              id: 2,
              text: 'Daily',
            },
          ];
          if (
            this.commodityArrayList[i]['periodData']['selectedPeriosData'] ==
            undefined
          )
            this.commodityArrayList[i]['periodData']['selectedPeriosData'] =
              '1';
        }
      });
    }
  }

  // updateCompany(index: number, item: any, data: any, i: any) {
  //   if (index == 1) {
  //     return this.thirdDivData[i].name +
  //       this.thirdDivData[0].exchange_company_value_type + data.category ? data.category : data.name
  //   } else {
  //     return this.thirdDivData[i].name + this.thirdDivData[0].exchange_company_value_type + 'Multiple'
  //   }

  // }
  valueChangedHandler(data: any, i?: any, type?: any, value?: any) {
    // if (type == 'Commodity') {
    if (type == 'CommodityMultipe') {
      this.commodityArrayList.forEach((element: any) => {
        element.periodData['selectedPeriosData'] = data;
      });
    }
    if (this.selectedPeriosData !== data) {
      this.selectedPeriosData = data;
      console.log('   this.selectedPeriosData', this.selectedPeriosData);
    }
    if (this.selectedCommodityperiodData! == data) {
      this.selectedCommodityperiodData = data;
    }
    if (!type) {
      value['periodData']['selectedPeriosData'] = data;
      console.log(" value['periodData']", value['periodData']);
    } else {
      this.selectedCommodityperiodData = '1';
    }
  }
  formattedData: any = [
    {
      id: '1',
      text: 'Select Periodicity',
    },
  ]
  formattedData2: any = []
  getPeriodicityDataList(category: any, countryCode: any, i: any, data: any) {
    this.financialMarketData.getPriodicityData(category, countryCode).subscribe(
      (res) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);
        res.forEach((ele: any, index: any) => {
          if (data.data_type === 'Macro Indicator') {
            let formattedData1 = {
              id: ele,
              text: ele,
              countryId: countryCode
            };
            
            this.formattedData = [...this.formattedData, formattedData1];
            this.formattedData2 = this.getUniqueListBy(this.formattedData, 'text')
            data['periodData'] = this.formattedData2
            data['periodData']['selectedPeriosData'] = '1';
          } else {
            let formattedData: any = [
              {
                id: 1,
                text: 'Select Periodicity',
              },
            ];
            formattedData.push({
              id: index + 2,
              text: ele,
            });
            data['periodData'] = formattedData;
            data['periodData']['selectedPeriosData'] = '1';
          }
        });
      },
      (err) => {
        console.log('err', err.message);
      }
    );
  }

  getUniqueListBy(arr: any, key: any) {
    return [...new Map(arr.map((item:any) => [item[key], item])).values()]
  }

  getBetaPeriodicityDataList(data: any) {
    if (data[' Financial'] == ' Financial') {
      this.key_type = 'financial';
    } else if (data['Financial'] == 'Financial') {
      this.key_type = 'financial';
    } else if (data['Share Price'] == 'Share Price') {
      this.key_type = 'stockprice';
    } else if (data[' Share Price'] == ' Share Price') {
      this.key_type = 'stockprice';
    } else {
      this.key_type = 'beta';
    }
    this.financialMarketData
      .getBetaPerioicityList(this.key_type, data.id)
      .subscribe(
        (res: any) => {
          let formattedData: any = [
            {
              id: 1,
              text: 'Select Periodicity',
            },
          ];
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);
          res.forEach((ele: any, index: any) => {
            formattedData.push({
              id: index + 2,
              text: ele,
            });
            console.log('formattedData', formattedData);

            // formattedData[0] = "Select Periodcity"
            data['periodData'] = [...new Set(formattedData)];
            data['periodData']['selectedPeriosData'] = '1';
          });
        },
        (err) => {
          console.log('err', err.message);
        }
      );
  }

  check(el: any) {
    return el.countryName;
  }

  ThirdStaticOfData(item: any): any {
    if (item.data_type == 'Commodity') {
      return item.data_type + ' ' + 'Mulitiple';
    }
  }
  newArray: any = [];
  newArray1: any = [];
  avoidDuplicateEntry: boolean = true;
  removeThirdLevel(value?: any, i?: any, type?: any, optionData?: any) {
    if (type === 'third') {
      if (value.data_type === 'Macro Indicator') {
        // this.thirdDivData.forEach((el: any) => {
        //   el.optionData.forEach((element: any) => {
        //     if (optionData.countryIsoCode3 ===
        //       element.countryIsoCode3 && value.category === el.category) {
        //       element.checked = false
        //     }
        //   }
        //   );
        // })
        this.newArray = this.thirdDivData.filter(
          (element: any) =>
            value.category ==
            element.category
        );
        this.thirdDivData = differenceWith(
          this.thirdDivData,
          this.newArray,
          (arrVal: any, othVal: any) =>
            arrVal.category ==
            othVal.category
        );

      } else if (value.data_type === 'Country_one') {
        this.thirdDivData.forEach((el: any) => {
          el.optionData.forEach((element: any) => {
            if (optionData.category ===
              element.category && value.countryIsoCode3 === el.countryIsoCode3) {
              element.checked = false
            }
          }
          );
        })
      } else {
        this.newArray = this.thirdDivData.filter(
          (element: any) =>
            value.id ==
            element.id && value.exchange_company_value_type == element.exchange_company_value_type
        );
        this.newArray1 = this.commodityArrayList.filter(
          (element: any) =>
            value.exchange_company_value_type ==
            element.exchange_company_value_type
        );
        // this.tempThirdDivData.splice(i, 1);
        this.thirdDivData = differenceWith(
          this.thirdDivData,
          this.newArray,
          (arrVal: any, othVal: any) =>
            arrVal.id ==
            othVal.id && arrVal.exchange_company_value_type == othVal.exchange_company_value_type
        );
        this.commodityArrayList = differenceWith(
          this.commodityArrayList,
          this.newArray1,
          (arrVal: any, othVal: any) =>
            arrVal.exchange_company_value_type ==
            othVal.exchange_company_value_type
        );
      }
    } else if (type == 'remove') {
      if (value.data_type === 'Commodity') {
        this.newArray1 = this.commodityArrayList.filter(
          (element: any) =>
            value.exchange_company_value_type ==
            element.exchange_company_value_type
        );
        this.commodityArrayList = differenceWith(
          this.commodityArrayList,
          this.newArray1,
          (arrVal: any, othVal: any) =>
            arrVal.exchange_company_value_type ==
            othVal.exchange_company_value_type
        );
      } else if (value.data_type === 'Macro Indicator') {
        this.newArray = this.thirdDivData.filter(
          (element: any) =>
            value.category ==
            element.category
        );
        this.thirdDivData = differenceWith(
          this.thirdDivData,
          this.newArray,
          (arrVal: any, othVal: any) =>
            arrVal.category ==
            othVal.category
        );

        this.newArray = this.tempThirdDivData.filter(
          (element: any) =>
            value.category ==
            element.category
        );
        this.tempThirdDivData = differenceWith(
          this.tempThirdDivData,
          this.newArray,
          (arrVal: any, othVal: any) =>
            arrVal.category ==
            othVal.category
        );
      } else {
        this.newArray = this.thirdDivData.filter(
          (element: any) =>
            value.id ==
            element.id && value.exchange_company_value_type == element.exchange_company_value_type
        );
        this.thirdDivData = differenceWith(
          this.thirdDivData,
          this.newArray,
          (arrVal: any, othVal: any) =>
            arrVal.id ==
            othVal.id && arrVal.exchange_company_value_type == othVal.exchange_company_value_type
        );
        // this.thirdDivData.splice(i, 1);
        // this.tempThirdDivData.splice(i, 1);
        this.newArray = this.tempThirdDivData.filter(
          (element: any) =>
            value.id ==
            element.id && value.exchange_company_value_type == element.exchange_company_value_type
        );
        this.tempThirdDivData = differenceWith(
          this.tempThirdDivData,
          this.newArray,
          (arrVal: any, othVal: any) =>
            arrVal.id ==
            othVal.id && arrVal.exchange_company_value_type == othVal.exchange_company_value_type
        );
      }
    } else if (type == 'commodity') {
      this.commodityArrayList.length = 0;
      this.avoidDuplicateEntry = false;
      console.log(' this.commodityArrayList remove', this.commodityArrayList);
    } else {
      this.thirdDivData[i]?.periodData;
    }
  }

  exchange_list_temp: any;
  ExchangeList() {
    this.financialMarketData.getExchangeList().subscribe(
      (res) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);
        this.exchange_list = res;
        this.exchange_list_temp = res;
      },
      (err) => {
        console.log('err', err.message);
      }
    );
  }

  eCode: any;
  subExchangeList(exchange_code: any) {
    this.eCode = exchange_code;
    this.financialMarketData.getSubExchangeList(exchange_code).subscribe(
      (res) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);
        this.sub_exchange_list = res;
      },
      (err) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);

        console.log('err', err.message);
      }
    );
  }

  companyList() {
    this.financialMarketData.getAllCompany().subscribe(
      (res) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);
        this.company_list = res;
      },
      (err) => {
        console.log('err', err.message);
      }
    );
  }

  commodity_list_temp: any;
  commodityList() {
    this.financialMarketData.getCommidityList().subscribe(
      (res) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);
        this.commodity_list = res;
        this.commodity_list_temp = res;
      },
      (err) => {
        console.log('err', err.message);
      }
    );
  }

  Unique_macroIndicatorTemp: any;
  MacroIndicatorList() {
    this.financialMarketData.getIndicatorsListSelection().subscribe(
      (res) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);
        this.macro_indicator = res;
        let uniqueChars: any = [];
        let flagcategory: boolean = false;
        // this.macro_indicator.forEach((c:any) => {
        //     if (!uniqueChars.includes(c.category)) {
        //         uniqueChars.push(c);
        //     }
        // });
        // console.log("uuuuuu",uniqueChars);
        for (let i = 0; i < this.macro_indicator.length; i++) {
          for (let j = 0; j < uniqueChars.length; j++) {
            if (this.macro_indicator[i].category == uniqueChars[j].category) {
              flagcategory = true;
            }
          }
          if (flagcategory == false) {
            uniqueChars.push(this.macro_indicator[i]);
          } else {
            flagcategory = false;
          }
          this.Unique_macroIndicator = uniqueChars;
          this.Unique_macroIndicatorTemp = uniqueChars;
        }
      },
      (err) => {
        console.log('err', err.message);
      }
    );
  }

  macroIndicatorBasedOnCheckList(indicatorname: any, i: any) {
    this.financialMarketData
      .getMacroIndicatorCheckBoxList(indicatorname)
      .subscribe(
        (res) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);
          this.SecondDivData[i]['optionData'] = res;
        },
        (err) => {
          console.log('err', err.message);
        }
      );
  }

  getBetaList(beta_id: any, i: any) {
    this.financialMarketData.getBetaList(beta_id).subscribe(
      (res) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);
        this.SecondDivData[i]['optionData'] = res;
      },
      (err) => {
        console.log('err', err.message);
      }
    );
  }

  country_list_temp: any;
  countryList() {
    this.financialMarketData.getCountry().subscribe(
      (res) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);
        this.country_list = res;
        this.country_list_temp = res;
      },
      (err) => {
        console.log('err', err.message);
      }
    );
  }

  getCountryBasedOnCheckBoxList(countryCode: any, i: any) {
    this.financialMarketData
      .getEconomyIndicatorCheckBoxList(countryCode)
      .subscribe(
        (res) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);
          this.SecondDivData[i]['optionData'] = res;
        },
        (err) => {
          console.log('err', err.message);
        }
      );
  }

  show_plus_icon(event?: any, type?: any, detail?: any) {
    event.target.nextElementSibling?.classList?.toggle('display-block');
    event.target.childNodes[0]?.classList?.toggle('icon-collapse');
    if (type == 'sub_exchange') {
      this.show_search_filter = !this.show_search_filter;
      if (this.show_search_filter) {
        this.count_res = 0;
        this.total_count_res = 1;
        this.util.loaderService.display(true);
        this.subExchangeList(detail.exchangeCode);
      }
    }
  }

  iconClick(id: any) {
    if (id == 'iconCheck') this.iconCheck.nativeElement.click();
    if (id == 'economycheck') this.economycheck.nativeElement.click();
    if (id == 'macrocheck') this.macrocheck.nativeElement.click();
    if (id == 'countrycheck') this.countrycheck.nativeElement.click();
    if (id == 'comoditycheck') this.comoditycheck.nativeElement.click();
    if (id == 'companyTwo') this.companyTwo.nativeElement.click();
    if (id == 'companyOne') this.companyOne.nativeElement.click();
    if (id == 'companyThree') this.companyThree.nativeElement.click();
    if (id == 'subexchange') this.subexchange.nativeElement.click();
  }

  RefreshData() {
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);
  }
  SelectPeriod(type: any) {
    let valueNullCheck = true;

    for (let x of this.thirdDivData) {
      if (x.periodData.selectedPeriosData == '1') {
        console.log('x.periodData', x.periodData);
        valueNullCheck = false;
        this.auth.openPopupModal = true;
        this.ErrorMessage = 'Please select periodicity to proceed';
        break;
      } else {
        this.auth.openPopupModal = false;
      }
    }

    if (valueNullCheck == true) {
      this.periodButtonType = type;
      this.duplicate_Values = false;
      this.auth.closeInsidePopup = true;
    }

    // this.auth.closeInsidePopup = true;
    // if (valueNullCheck) {
    //   this.periodButtonType = type
    //   this.duplicate_Values = false
    //   this.auth.closeInsidePopup = true;
    // }
  }
}

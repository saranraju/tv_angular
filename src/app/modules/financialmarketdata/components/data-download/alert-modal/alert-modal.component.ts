import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FinancialMarketDataService } from 'src/app/services/financialmarketdata.service';
import { saveAs } from 'file-saver';
import { DatepickerOptions } from 'ng2-datepicker';
import { getYear } from 'date-fns';
import locale from 'date-fns/locale/en-US';
import { DatePipe } from '@angular/common';
import { UtilService } from 'src/app/services/util.service';
@Component({
  selector: 'app-alert-modal',
  templateUrl: './alert-modal.component.html',
  styleUrls: ['./alert-modal.component.scss'],
})
export class AlertModalComponent implements OnInit {
  @Input() alertbox: any;
  @Input() data_type: any;
  @Input() PeriodData: any;
  @Input() downloadData: any = [];
  @Input() duplicate_Values: boolean = false;
  @Input() third_column_data: any;
  @Input() commodityArrayList: any;

  count_res: any = 0;
  total_count_res: any = '';
  date = new Date();
  periodForm: FormGroup | any;
  options: DatepickerOptions = {
    minYear: getYear(new Date()) - 30, // minimum available and selectable year
    maxYear: getYear(new Date()) + 30, // maximum available and selectable year
    placeholder: '', // placeholder in case date model is null | undefined, example: 'Please pick a date'
    format: 'yyyy-MM-dd', // date format to display in input
    formatTitle: 'yyyy-MM-dd',
    formatDays: 'EEEEE',
    firstCalendarDay: 0, // 0 - Sunday, 1 - Monday
    locale: locale, // date-fns locale
    position: 'bottom',
    inputClass: '', // custom input CSS class to be applied
    calendarClass: 'datepicker-default', // custom datepicker calendar CSS class to be applied
    scrollBarColor: '#dfe3e9', // in case you customize you theme, here you define scroll bar color
    // keyboardEvents: true // enable keyboard events
  };
  constructor(
    public fb: FormBuilder,
    public auth: AuthService,
    private financial: FinancialMarketDataService,
    public datepipe: DatePipe,
    public util: UtilService,
  ) {}

  ngOnInit(): void {
    console.log('periodDate', this.PeriodData);
    console.log('data download', this.downloadData);
    console.log('commodity array list', this.commodityArrayList);

    this.periodForm = this.fb.group({
      startDate: ['', [Validators.required]],
      endDate: [this.date, [Validators.required]],
    });
  }

  downloadExcel(valid: any, value: any) {
    // if (valid) {
    let body: any = {
      startDate: this.datepipe.transform(
        value.startDate ? value.startDate : '',
        'yyyy-MM-dd'
      ),
      endDate: this.datepipe.transform(
        value.endDate ? value.endDate : '',
        'yyyy-MM-dd'
      ),
    };
    let data;
    data = this.downloadData?.value;
    console.log('data', data);

    let commodity = data.filter((el: any) => el.data_type == 'Commodity')[0];
    let country = data.filter((el: any) => el.data_type == 'Country_one')[0];
    console.log('country', country);

    let macroIndicator = data.filter(
      (el: any) => el.data_type == 'Macro Indicator'
    )[0];
    let exchange = data.filter((el: any) => el.data_type == 'Exchange')[0];
    let companyTwo = data.filter((el: any) => el.data_type == 'Company_two')[0];
    console.log('country', country);
    if (commodity?.data_type == 'Commodity') {
      body['commodity'] = {
        type: 'dataDownload',
        periodicity: 'DAILY',
        commodityParams: [],
      };
      let obj = data.reduce((res: any, curr: any) => {
        if (res[curr.name]) res[curr.name].push(curr);
        else Object.assign(res, { [curr.name]: [curr] });

        return res;
      }, {});
      console.log(obj);
      data?.forEach((el: any) => {
        if (el.data_type === 'Commodity') {
          let temp: any = [];
          el.optionData.filter((e: any) => {
            if (e.checked == true) temp.push(e.category.toUpperCase());
          });
          console.log('el', el);
          body['commodity']['commodityParams'].push({
            symbol: el.symbol,
            ticker_name: el.ticker + '_' + el.name,
            commodityCheckedParams: temp,
          });
        }
      });
    }
    if (country?.data_type == 'Country_one') {
      if (!body['economy']) {
        body['economy'] = [];
      }
      let countrycode: any;
      data?.forEach((el: any) => {
        if (el.data_type === 'Country_one') {
          let period: any;
          console.log('el', el);
          if(el.countryIsoCode3 != countrycode) {
            el.optionData.filter((e: any) => {
              if (e.checked == true ) {
                let filterList: any = [];
                  filterList.push(e.category);
                  period = e.periodType;
                  countrycode = el.countryIsoCode3;
    
                  body['economy'].push({
                    type: 'economyCountry',
                    dataType: el.countryName,
                    id: el.countryIsoCode3,
                    name: el.countryName,
                    filterList: filterList,
                    periodicity: period,
                  });
              }
            });
          }  
        }
      });
    }
    if (macroIndicator?.data_type == 'Macro Indicator') {
      if (!body['economy']) {
        body['economy'] = [];
      }
      data?.forEach((el: any) => {
        let filterList: any = [];
        if (el.data_type === 'Macro Indicator') {
          el.optionData.filter((e: any) => {
            if (e.checked == true)
             filterList.push(e.countryIsoCode3);                 
          });
          let selectedPeriodId = el.periodData.selectedPeriosData;

          body['economy'].push({
            type: 'economyIndicator',
            id: el.category,
            dataType: el.category,
            filterList: filterList,
            periodicity: selectedPeriodId,
          });
        }
      });
    }
    if (exchange?.data_type == 'Exchange') {      
      body['equity'] ? '' : body['equity'] = [];
      if (!body['economy']) {
        body['economy'] = [];
      }
      data?.forEach((el: any) => {
        if (el.data_type === 'Exchange') {
          let periodType: any;
          let filterList: any = [];
          el.periodData.filter((e: any) => {
            if (e.id == Number(el.periodData.selectedPeriosData))
              periodType = e.text;
          });
          el.optionData.filter((e: any) => {
            if (e.checked == true){
              if(el.exchange_company_value_type == "Share Price"){
                e.category ? filterList.push(e.category.toUpperCase()) : [];
              }
            else if(el.exchange_company_value_type == "Financial"){
              let datatype: any;
              if(e.category == "Balance Sheet"){
                datatype = 'balanceSheet';
              }else if(e.category == "P&L"){
                datatype = 'PNL';
              }else if(e.category == "Cash Flow"){
                datatype = 'cashFlow';
              }else if(e.category == "Financial Ratios"){
                datatype = 'FR';
              }else{
                datatype = 'VR';
              }
              body['equity'].push({
                code: el.id,
                exchange: el.exchangeCode,
                type: 'company',
                name: el.name,
                dataType: datatype,
                periodicity: periodType === 'Half-Yearly' ? 'semiann' : periodType.toUpperCase(),
                filterList: [],
              });
            }
            else {
              e.id ? filterList.push(e.id.toString()) : [];
            }
          }
          });
          if(el.exchange_company_value_type == "Share Price"){
            body['equity'].push({
              code: el.id,
              exchange: el.exchangeCode,
              type: 'company',
              name: el.name,
              dataType: 'stockPrice',
              periodicity: periodType,
              filterList: filterList,
            });
          }else if(el.exchange_company_value_type == "Beta"){
          body['equity'].push({
            code: el.id,
            exchange: el.exchangeCode,
            type: 'company',
            name: el.name,
            dataType: 'beta',
            periodicity: periodType,
            filterList: filterList,
          });
        }
        }
      });
    }
    if (companyTwo?.data_type == 'Company_two') {
      body['equity'] ? '' : body['equity'] = [];

      if (!body['economy']) {
        body['economy'] = [];
      }
      data?.forEach((el: any) => {
        if (el.data_type === 'Company_two') {
          let periodType: any;
          let filterList: any = [];
          console.log('el', el);
          el.periodData.filter((e: any) => {
            if (e.id == Number(el.periodData.selectedPeriosData))
              periodType = e.text;
          });
          el.optionData.filter((e: any) => {
            if (e.checked == true){
              if(el.exchange_company_value_type == " Share Price"){
                e.category ? filterList.push(e.category.toUpperCase()) : [];
              }
            else if(el.exchange_company_value_type == " Financial"){
              let datatype: any;
              if(e.category == "Balance Sheet"){
                datatype = 'balanceSheet';
              }else if(e.category == "P&L"){
                datatype = 'PNL';
              }else if(e.category == "Cash Flow"){
                datatype = 'cashFlow';
              }else if(e.category == "Financial Ratios"){
                datatype = 'FR';
              }else{
                datatype = 'VR';
              }
              body['equity'].push({
                code: el.id,
                exchange: el.exchangeCode,
                type: 'company',
                name: el.name,
                dataType: datatype,
                periodicity: periodType === 'Half-Yearly' ? 'semiann' : periodType.toUpperCase(),
                filterList: [],
              });
            }
            else {
              e.id ? filterList.push(e.id.toString()) : [];
            }
          }
          });
          if(el.exchange_company_value_type == " Share Price"){
            body['equity'].push({
              code: el.id,
              exchange: el.exchangeCode,
              type: 'company',
              name: el.name,
              dataType: 'stockPrice',
              periodicity: periodType,
              filterList: filterList,
            });
          }else if(el.exchange_company_value_type == " Beta"){
          body['equity'].push({
            code: el.id,
            exchange: el.exchangeCode,
            type: 'company',
            name: el.name,
            dataType: 'beta',
            periodicity: periodType,
            filterList: filterList,
          });
        }
        }
      });
    }

    this.count_res = 0;
    this.total_count_res = 1;
    this.util.loaderService.display(true);

    this.financial.downloadPeroadExcel(body).subscribe((res: any) => {
      ++this.count_res;
      this.util.checkCountValue(this.total_count_res, this.count_res);

      if (res.status == 204) {
        this.auth.IsdataDownload();
      } else {
        const blob = new Blob([res.body], {
          type: 'application/vnd.ms.excel',
        });
        const file = new File([blob], '' + `${'DataDownload'}.xlsx`, {
          type: 'application/vnd.ms.excel',
        });
        saveAs(file);
      }
    },
      (err) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);
        if (err.status === 402) {
          this.auth.freeTrialAlert = true;
        }
        console.log('error', err.message);
      });
  }

  startDatetoggle(e: any) {
    e.stopPropagation();
    let elem: any = document.getElementById('startDateRef');
    elem.children[0]?.children[0].click();
  }

  endDatetoggle(e: any) {
    e.stopPropagation();
    let elem: any = document.getElementById('endDateRef');
    elem.children[0]?.children[0].click();
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { LoaderServiceService } from 'src/app/modules/financialmarketdata/components/loader-service.service';
import { FinancialMarketDataService } from 'src/app/services/financialmarketdata.service';
import { UtilService } from 'src/app/services/util.service';
import { saveAs } from 'file-saver';
import { AuthService } from 'src/app/services/auth/auth.service';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-financialtab',
  templateUrl: './financialtab.component.html',
  styleUrls: ['./financialtab.component.scss'],
})
export class FinancialtabComponent implements OnInit {
  buttonactive: any = 1;
  pageActive: any = 1;
  period_finance: any = 1;
  buttonTwo = 1;
  currency = 'USD';
  buttonThree = 1;
  idName: any;
  tabledata: any;
  type = 'is_data';
  isPrivateForiegnCompanyActive: any = false;
  headerButtons = [
    {
      id: 1,
      title: 'Income Statement',
    },
    {
      id: 2,
      title: 'Balance Sheet',
    },
    {
      id: 3,
      title: 'Cash Flow',
    },
    {
      id: 4,
      title: 'Financial Ratios',
    },
    {
      id: 5,
      title: 'Valuation Ratios',
    },
  ];

  privateCompanyHeaderButtons = [
    {
      id: 1,
      title: 'Income Statement',
    },
    {
      id: 2,
      title: 'Balance Sheet',
    },
    {
      id: 3,
      title: 'Cash Flow',
    },
    {
      id: 4,
      title: 'Financial Ratios',
    },
  ];

  buttonCategoryOne = [
    {
      id: 1,
      title: 'Standardized',
    },
    {
      id: 2,
      title: 'As-Reported',
    },
  ];

  buttonCategoryTwo = [
    // {
    //   id: 1,
    //   title: 'Annual',
    //   value: 'yearly',
    // },
    // {
    //   id: 2,
    //   title: 'Quarter',
    //   value: 'quarterly',
    // },
  ];

  privateCompanyButton = [
    {
      id: 1,
      title: 'Annual',
      value: 'yearly',
    },
  ];

  buttonCategoryThree = [
    {
      id: 1,
      title: 'Consolidated',
    },
    {
      id: 2,
      title: 'Standalone',
    },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private financialMarketData: FinancialMarketDataService,
    public loaderService: LoaderServiceService,
    public util: UtilService,
    public auth: AuthService,
    public datepipe: DatePipe
  ) {}

  finance_data: any = [];
  is_data: any = [];
  bs_data: any = [];
  cf_data: any = [];
  vr_data: any = [];
  fr_data: any = [];
  periods1: any = [];
  itemName1: any = [];
  itemName2: any = [];
  itemName3: any = [];
  itemName4: any = [];
  itemName7: any = [];
  formateSectorData1: any = [];
  formateSectorData3: any = [];
  formateSectorData4: any = [];
  formateSectorData7: any = [];

  sectorOject3: any = {};
  sectorOject4: any = {};

  sectorOject1: any = {};
  formateSectorData2: any = [];
  sectorOject2: any = {};
  companydata: any;

  count_res: any = 0;
  total_count_res: any = '';

  ngOnInit(): void {
    this.getCurreny();
    this.getRouteInfo();
    // localStorage.setItem(
    //   'globalMatrixList',
    //   JSON.stringify([])
    // );
  }

  compnayid: any;
  period: any = 'yearly';
  companyname: any;
  exchange: any;
  ticker: any;
  industry: any;
  country: any;
  currency_data: any = [];
  company_type: any;
  // ç:any;

  tabIndustryInstance: any;
  redirectToIndustryPage() {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/financialmarketdata/industry'], {
        relativeTo: this.route,
        queryParams: {},
        queryParamsHandling: 'merge',
      })
    );
    if (this.tabIndustryInstance != undefined) {
      // this.tabIndustryInstance.close();
      this.tabIndustryInstance = window.open(url, '_blank');
    } else {
      this.tabIndustryInstance = window.open(url, '_blank');
    }
  }

  tabEconomyInstance: any;
  redirectToEconomyPage() {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/financialmarketdata/economy'], {
        relativeTo: this.route,
        queryParams: {},
        queryParamsHandling: 'merge',
      })
    );
    if (this.tabIndustryInstance != undefined) {
      // this.tabIndustryInstance.close();
      this.tabIndustryInstance = window.open(url, '_blank');
    } else {
      this.tabIndustryInstance = window.open(url, '_blank');
    }
  }
  industryType: any = '';
  getRouteInfo() {
    this.route.queryParams.subscribe((params: Params) => {
      this.compnayid = params['comp_id'];
      this.currency = params['currency'];
      this.period = params['period'];
      this.companyname = params['cname'];
      this.exchange = params['exchange'];
      this.ticker = params['cticker'];
      this.industry = params['inName'];
      this.country = params['country'];
      this.company_type = params['companyType'];
      this.industryType = params['industry'];
      if (this.company_type == 'Private') {
        if (this.country == 'India') {
          this.count_res = 0;
          this.total_count_res = 1;
          this.loaderService.display(true);
          this.getPrivateComapnyFinancialData(this.compnayid, this.currency);
        } else {
          this.isPrivateForiegnCompanyActive = true;
          this.count_res = 0;
          this.total_count_res = 1;
          this.loaderService.display(true);
          this.getFinancialData(this.compnayid, this.currency, this.period);
        }
      } else {
        this.count_res = 0;
        this.total_count_res = 1;
        this.loaderService.display(true);
        this.getFinancialPeriodicity(this.compnayid);
        if (this.period === 'yearly') {
          this.buttonTwo = 1;
        } else if (this.period === 'semiann') {
          this.buttonTwo = 2;
        } else if (this.period === 'quarterly') {
          this.buttonTwo = 3;
        }
        this.getFinancialData(this.compnayid, this.currency, this.period);
      }
    });
  }

  getFinancialPeriodicity(id: any) {
    this.financialMarketData
      .getPeriodicityFinancial(id)
      .subscribe((res: any) => {
        var arr: any = [];
        res.forEach((ele: any) => {
          if (ele == 'Yearly') {
            arr.push({
              id: 1,
              title: 'Yearly',
              value: 'yearly',
            });
          }
          if (ele == 'Half-Yearly') {
            arr.push({
              id: 2,
              title: 'Half-Yearly',
              value: 'semiann',
            });
          }
          if (ele == 'Quarterly') {
            arr.push({
              id: 3,
              title: 'Quarterly',
              value: 'quarterly',
            });
          }
        });
        this.buttonCategoryTwo = arr;
      });
  }
  globalMatrixList: any =[]
  redirectToInteractive(content: any) {
    let prevGlobalMatrixList = []
    prevGlobalMatrixList =  JSON.parse(localStorage.getItem('globalMatrixList') as any)
   if(prevGlobalMatrixList == null) prevGlobalMatrixList = []

   prevGlobalMatrixList.push({
     name: content.fieldName,
     type: 'companyChartCustom',
     company:true
   });
    localStorage.setItem(
      'globalMatrixList',
      JSON.stringify(prevGlobalMatrixList)
    );
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['financialmarketdata/interactive-analysis'], {
        queryParams: {
          currency: this.currency,
          filter2: content.fieldName,
          comparableList: this.compnayid,
          periodcity: this.period,
          companyName: this.companyname,
          tabFrom: 'Company',
          industry: this.industryType,
        },
      })
    );
    window.open(url, '_blank');
  }

  headerButtonFuction(e: any, title: any) {
    this.util.loaderService.display(true);
    this.buttonactive = e;
    if (e === 1) {
      this.type = 'is_data';

      if (this.formateSectorData1) {
        this.tabledata = this.formateSectorData1;
        setTimeout(() => {
          this.util.loaderService.display(false);
        }, 30);
      }
    }
    if (e === 2) {
      this.type = 'bi_data';
      if (this.formateSectorData2) {
        this.tabledata = this.formateSectorData2;
        setTimeout(() => {
          this.util.loaderService.display(false);
        }, 30);
      }
    }
    if (e === 3) {
      this.type = 'ci_data';
      if (this.formateSectorData3) {
        this.tabledata = this.formateSectorData3;
        setTimeout(() => {
          this.util.loaderService.display(false);
        }, 30);
      }
    }
    if (e === 4) {
      this.type = 'ri_data';
      if (this.formateSectorData7) {
        this.tabledata = this.formateSectorData7;
        setTimeout(() => {
          this.util.loaderService.display(false);
        }, 30);
      }
    }
    if (e === 5) {
      this.type = 'vi_data';
      if (this.formateSectorData4) {
        this.tabledata = this.formateSectorData4;
        setTimeout(() => {
          this.util.loaderService.display(false);
        }, 30);
      }
    }
  }

  getSet(e: any, title: any) {
    this.period_finance = e;
  }
  getAnnualQuarterly(e: any, title: any) {
    this.buttonTwo = e;
    this.tabledata = null;
    this.period = title;
    this.count_res = 0;
    this.total_count_res = 1;
    this.loaderService.display(true);
    this.getFinancialData(this.compnayid, this.currency, this.period, true);
  }

  getConsolidatedStandalone(e: any, title: any) {
    this.buttonThree = e;
  }

  financialExcell() {
    this.auth.openFinPeriodModal = true;
  }

  onFinancialExcelDownload(e: any) {
    if (this.company_type == 'Private') {
      this.loaderService.display(true);
      this.total_count_res = 1;
      this.count_res = 0;
      let obj: any = {};

      if (this.country === 'India') {
        obj = {
          startDate: e.startDate
            ? this.datepipe.transform(e.startDate, 'yyyy-MM-dd')
            : '2015-09-30',
          endDate: e.endDate
            ? this.datepipe.transform(e.endDate, 'yyyy-MM-dd')
            : '2022-03-10',
          equity: [
            {
              code: this.compnayid,
              exchange: 'FACTSET',
              type: 'company',
              dataType: 'PNL',
              name: this.companyname,
              periodicity: 'yearly',
              filterList: [],
              currency: this.currency,
              entityType: 'Private',
            },
            {
              code: this.compnayid,
              exchange: 'FACTSET',
              type: 'company',
              dataType: 'balanceSheet',
              name: this.companyname,
              periodicity: 'yearly',
              filterList: [],
              currency: this.currency,
              entityType: 'Private',
            },
            {
              code: this.compnayid,
              exchange: 'FACTSET',
              type: 'company',
              dataType: 'cashFlow',
              name: this.companyname,
              periodicity: 'yearly',
              filterList: [],
              currency: this.currency,
              entityType: 'Private',
            },
            {
              code: this.compnayid,
              exchange: 'FACTSET',
              type: 'company',
              dataType: 'FR',
              name: this.companyname,
              periodicity: 'yearly',
              filterList: [],
              currency: this.currency,
              entityType: 'Private',
            },
          ],
          economy: [],
        };
      } else {
        obj = {
          startDate: e.startDate
            ? this.datepipe.transform(e.startDate, 'yyyy-MM-dd')
            : '2015-09-30',
          endDate: e.endDate
            ? this.datepipe.transform(e.endDate, 'yyyy-MM-dd')
            : '2022-03-10',
          equity: [
            {
              code: this.compnayid,
              exchange: 'FACTSET',
              type: 'company',
              dataType: 'FR',
              name: this.companyname,
              periodicity: 'yearly',
              filterList: [],
              currency: this.currency,
              entityType: 'Private',
            },
          ],
          economy: [],
        };
      }

      this.financialMarketData.downloadfinancialExcel(obj).subscribe(
        (res: any) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);

          if (res.status === 204) {
            this.NodataAlert();
          } else {
            const blob = new Blob([res.body], {
              type: 'application/vnd.ms.excel',
            });
            const file = new File(
              [blob],
              '' +
                `${this.companyname}_Financials(${this.period})_${new Date()
                  .toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })
                  .replace(/ /g, '-')}.xls`,
              {
                type: 'application/vnd.ms.excel',
              }
            );
            saveAs(file);
          }
          this.auth.openFinPeriodModal = false;
        },
        (err) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);
          if (err.status === 402) {
            this.auth.freeTrialAlert = true;
          }
          console.log('err', err.message);
        }
      );
    } else {
      this.loaderService.display(true);
      this.total_count_res = 1;
      this.count_res = 0;
      let obj = {
        startDate: e.startDate
          ? this.datepipe.transform(e.startDate, 'yyyy-MM-dd')
          : '2015-09-30',
        endDate: e.endDate
          ? this.datepipe.transform(e.endDate, 'yyyy-MM-dd')
          : '2022-03-10',
        equity: [
          {
            code: this.compnayid,
            exchange: 'FACTSET',
            type: 'company',
            dataType: 'PNL',
            name: this.companyname,
            periodicity: this.period,
            filterList: [],
            currency: this.currency,
            entityType: '',
          },
          {
            code: this.compnayid,
            exchange: 'FACTSET',
            type: 'company',
            dataType: 'balanceSheet',
            name: this.companyname,
            periodicity: this.period,
            filterList: [],
            currency: this.currency,
          },
          {
            code: this.compnayid,
            exchange: 'FACTSET',
            type: 'company',
            dataType: 'cashFlow',
            name: this.companyname,
            periodicity: this.period,
            filterList: [],
            currency: this.currency,
          },
          {
            code: this.compnayid,
            exchange: 'FACTSET',
            type: 'company',
            dataType: 'FR',
            name: this.companyname,
            periodicity: this.period,
            filterList: [],
            currency: this.currency,
          },
          {
            code: this.compnayid,
            exchange: 'FACTSET',
            type: 'company',
            dataType: 'VR',
            name: this.companyname,
            periodicity: this.period,
            filterList: [],
            currency: this.currency,
          },
        ],
        economy: [],
      };
      this.financialMarketData.downloadfinancialExcel(obj).subscribe(
        (res: any) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);

          if (res.status === 204) {
            this.NodataAlert();
          } else {
            const blob = new Blob([res.body], {
              type: 'application/vnd.ms.excel',
            });
            const file = new File(
              [blob],
              '' +
                `${this.companyname}_Financials(${this.period})_${new Date()
                  .toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })
                  .replace(/ /g, '-')}.xlsx`,
              {
                type: 'application/vnd.ms.excel',
              }
            );
            saveAs(file);
          }
          this.auth.openFinPeriodModal = false;
        },
        (err) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);
          if (err.status === 402) {
            this.auth.freeTrialAlert = true;
          } else {
            this.auth.closeInsidePopup = true;
            this.auth.openFinPeriodModal = false;
          }
        }
      );
    }
  }

  errorMessage: any = '';
  nextErrorMessage: any = '';
  NodataAlert() {
    this.auth.openPopupModalFin = true;
    this.errorMessage = 'No Data is reported for the selected period.';
    this.nextErrorMessage =
      'Kindly select the dates as per Metrics & Periodicity selected';
  }

  fromFinDate: any;
  getFinancialData(
    id: any,
    currency: any,
    period: any,
    periodChange?: boolean
  ) {
    this.finance_data = [];
    this.is_data = [];
    this.bs_data = [];
    this.cf_data = [];
    this.vr_data = [];
    this.fr_data = [];
    this.periods1 = [];
    this.itemName1 = [];
    this.itemName2 = [];
    this.itemName3 = [];
    this.itemName4 = [];
    this.itemName7 = [];
    this.formateSectorData1 = [];
    this.formateSectorData2 = [];
    this.formateSectorData3 = [];
    this.formateSectorData4 = [];
    this.formateSectorData7 = [];
    this.sectorOject1 = {};
    this.sectorOject2 = {};
    this.sectorOject3 = {};
    this.sectorOject4 = {};
    this.financialMarketData
      .getFinancialData(
        id,
        currency,
        this.period,
        this.isPrivateForiegnCompanyActive
      )
      .subscribe(
        (res) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);
          this.companydata = {
            id: id,
            currency: currency,
            period: this.period_finance,
          };
          this.finance_data = res.body;
          for (var i = 0; i < this.finance_data.length; i++) {
            if (this.finance_data[i].financialType == 'IS') {
              this.is_data.push(this.finance_data[i]);
            }
            if (this.finance_data[i].financialType == 'BS') {
              this.bs_data.push(this.finance_data[i]);
            }
            if (this.finance_data[i].financialType == 'CF') {
              this.cf_data.push(this.finance_data[i]);
            }
            if (this.finance_data[i].financialType == 'VR') {
              this.vr_data.push(this.finance_data[i]);
            }
            if (this.finance_data[i].financialType == 'FR') {
              this.fr_data.push(this.finance_data[i]);
            }
          }
          for (var i = 0; i < this.is_data.length; i++) {
            if (!this.periods1.includes(this.is_data[i].period)) {
              this.periods1.push(this.is_data[i].period);
            }

            if (!this.itemName1.includes(this.is_data[i].fieldName)) {
              const key = 'name' + i;
              this.itemName1.push({
                name: this.is_data[i].fieldName,
                date: this.is_data[i].period,
                data: this.is_data[i].data,
              });
            }
          }
          this.periods1.sort((a: any, b: any) => +new Date(a) - +new Date(b));
          // Calculate from date for financials
          this.fromFinDate = new Date(this.periods1[0]);

          this.itemName1.map((val1: any, index1: any) => {
            this.is_data.map((val2: any, index2: any) => {
              if (val1.name == val2.fieldName && val1.date == val2.period) {
                var index = this.formateSectorData1.findIndex(
                  (data: any) => data[val1['date']] == val2.period
                );
                if (index > -1) {
                } else {
                  this.sectorOject1 = {};
                }
                const newKey = val1['date'];
                this.sectorOject1[newKey] = val1.data;
                this.sectorOject1 = {
                  ...this.sectorOject1,
                  description: val2.itemName,
                  fieldName: val2.fieldName,
                  depth: val2.depthLevel,
                  displayOrder: val2.displayOrder,
                  graphflag: val2.icFlag ? '1' : '0',
                };
                this.formateSectorData1 = [
                  ...this.formateSectorData1,
                  this.sectorOject1,
                ];
                this.formateSectorData1 = this.formateSectorData1.reduce(
                  (acc: any, val: any, ind: any) => {
                    const index = acc.findIndex(
                      (el: any) => el.description === val.description
                    );
                    if (index !== -1) {
                      const key = Object.keys(val)[0];
                      acc[index][key] = val[key];
                    } else {
                      acc.push(val);
                    }
                    return acc;
                  },
                  []
                );
              }
            });
          });

          for (var i = 0; i < this.bs_data.length; i++) {
            // if (!this.periods1.includes(this.is_data[i].period)) {
            //   this.periods1.push(this.is_data[i].period);
            // }

            if (!this.itemName2.includes(this.bs_data[i].fieldName)) {
              const key = 'name' + i;
              this.itemName2.push({
                name: this.bs_data[i].fieldName,
                date: this.bs_data[i].period,
                data: this.bs_data[i].data,
              });
            }
          }
          this.itemName2.map((val1: any, index1: any) => {
            this.bs_data.map((val2: any, index2: any) => {
              if (val1.name == val2.fieldName && val1.date == val2.period) {
                var index = this.formateSectorData2.findIndex(
                  (data: any) => data[val1['date']] == val2.period
                );
                if (index > -1) {
                } else {
                  this.sectorOject2 = {};
                }
                const newKey = val1['date'];
                this.sectorOject2[newKey] = val1.data;
                this.sectorOject2 = {
                  ...this.sectorOject2,
                  description: val2.itemName,
                  fieldName: val2.fieldName,
                  depth: val2.depthLevel,
                  displayOrder: val2.displayOrder,
                  graphflag: val2.icFlag ? '1' : '0',
                };
                this.formateSectorData2 = [
                  ...this.formateSectorData2,
                  this.sectorOject2,
                ];
                this.formateSectorData2 = this.formateSectorData2.reduce(
                  (acc: any, val: any, ind: any) => {
                    const index = acc.findIndex(
                      (el: any) => el.description === val.description
                    );
                    if (index !== -1) {
                      const key = Object.keys(val)[0];
                      acc[index][key] = val[key];
                    } else {
                      acc.push(val);
                    }
                    return acc;
                  },
                  []
                );
              }
            });
          });

          for (var i = 0; i < this.cf_data.length; i++) {
            // if (!this.periods1.includes(this.is_data[i].period)) {
            //   this.periods1.push(this.is_data[i].period);
            // }

            if (!this.itemName3.includes(this.cf_data[i].fieldName)) {
              const key = 'name' + i;
              this.itemName3.push({
                name: this.cf_data[i].fieldName,
                date: this.cf_data[i].period,
                data: this.cf_data[i].data,
              });
            }
          }
          this.itemName3.map((val1: any, index1: any) => {
            this.cf_data.map((val2: any, index2: any) => {
              if (val1.name == val2.fieldName && val1.date == val2.period) {
                var index = this.formateSectorData3.findIndex(
                  (data: any) => data[val1['date']] == val2.period
                );
                if (index > -1) {
                } else {
                  this.sectorOject3 = {};
                }
                const newKey = val1['date'];
                this.sectorOject3[newKey] = val1.data;
                this.sectorOject3 = {
                  ...this.sectorOject3,
                  description: val2.itemName,
                  fieldName: val2.fieldName,
                  depth: val2.depthLevel,
                  displayOrder: val2.displayOrder,
                  graphflag: val2.icFlag ? '1' : '0',
                };
                this.formateSectorData3 = [
                  ...this.formateSectorData3,
                  this.sectorOject3,
                ];
                this.formateSectorData3 = this.formateSectorData3.reduce(
                  (acc: any, val: any, ind: any) => {
                    const index = acc.findIndex(
                      (el: any) => el.description === val.description
                    );
                    if (index !== -1) {
                      const key = Object.keys(val)[0];
                      acc[index][key] = val[key];
                    } else {
                      acc.push(val);
                    }
                    return acc;
                  },
                  []
                );
              }
            });
          });

          for (var i = 0; i < this.vr_data.length; i++) {
            // if (!this.periods1.includes(this.is_data[i].period)) {
            //   this.periods1.push(this.is_data[i].period);
            // }

            if (!this.itemName4.includes(this.vr_data[i].fieldName)) {
              const key = 'name' + i;
              this.itemName4.push({
                name: this.vr_data[i].fieldName,
                date: this.vr_data[i].period,
                data: this.vr_data[i].data,
              });
            }
          }
          this.itemName4.map((val1: any, index1: any) => {
            this.vr_data.map((val2: any, index2: any) => {
              if (val1.name == val2.fieldName && val1.date == val2.period) {
                var index = this.formateSectorData4.findIndex(
                  (data: any) => data[val1['date']] == val2.period
                );
                if (index > -1) {
                } else {
                  this.sectorOject4 = {};
                }
                const newKey = val1['date'];
                this.sectorOject4[newKey] = val1.data;
                this.sectorOject4 = {
                  ...this.sectorOject4,
                  // description: val2.itemName,
                  description:
                    val2.currency != null && val2.unit != null
                      ? val2.itemName +
                        ' (' +
                        val2.currency +
                        ' ' +
                        val2.unit +
                        ')'
                      : val2.unit != null && val2.currency == null
                      ? val2.itemName + ' (' + val2.unit + ')'
                      : val2.itemName,
                  fieldName: val2.fieldName,
                  desc: val2.itemName,
                  shortName: val2.shortName,
                  currency: val2.currency,
                  unit: val2.unit,
                  depth: val2.depthLevel,
                  displayOrder: val2.displayOrder,
                  graphflag: val2.icFlag ? '1' : '0',
                };
                this.formateSectorData4 = [
                  ...this.formateSectorData4,
                  this.sectorOject4,
                ];
                this.formateSectorData4 = this.formateSectorData4.reduce(
                  (acc: any, val: any, ind: any) => {
                    const index = acc.findIndex(
                      (el: any) => el.description === val.description
                    );
                    if (index !== -1) {
                      const key = Object.keys(val)[0];
                      acc[index][key] = val[key];
                    } else {
                      acc.push(val);
                    }
                    return acc;
                  },
                  []
                );
              }
            });
          });
          for (var i = 0; i < this.fr_data.length; i++) {
            // if (!this.periods1.includes(this.is_data[i].period)) {
            //   this.periods1.push(this.is_data[i].period);
            // }

            if (!this.itemName7.includes(this.fr_data[i].fieldName)) {
              const key = 'name' + i;
              this.itemName7.push({
                name: this.fr_data[i].fieldName,
                date: this.fr_data[i].period,
                data: this.fr_data[i].data,
              });
            }
          }

          this.itemName7.map((val1: any, index1: any) => {
            this.fr_data.map((val2: any, index2: any) => {
              if (val1.name == val2.fieldName && val1.date == val2.period) {
                var index = this.formateSectorData7.findIndex(
                  (data: any) => data[val1['date']] == val2.period
                );
                if (index > -1) {
                } else {
                  this.sectorOject4 = {};
                }
                const newKey = val1['date'];
                this.sectorOject4[newKey] = val1.data;
                this.sectorOject4 = {
                  ...this.sectorOject4,
                  description:
                    val2.currency != null && val2.unit != null
                      ? val2.itemName +
                        ' (' +
                        val2.currency +
                        ' ' +
                        val2.unit +
                        ')'
                      : val2.unit != null && val2.currency == null
                      ? val2.itemName + ' (' + val2.unit + ')'
                      : val2.itemName,
                  // val2.itemName,
                  fieldName: val2.fieldName,
                  desc: val2.itemName,
                  shortName: val2.shortName,
                  currency: val2.currency,
                  unit: val2.unit,
                  depth: val2.depthLevel,
                  displayOrder: val2.displayOrder,
                  graphflag: val2.icFlag ? '1' : '0',
                  section: val2.section,
                };

                this.formateSectorData7 = [
                  ...this.formateSectorData7,
                  this.sectorOject4,
                ];
                this.formateSectorData7 = this.formateSectorData7.reduce(
                  (acc: any, val: any, ind: any) => {
                    const index = acc.findIndex(
                      (el: any) => el.description === val.description
                    );
                    if (index !== -1) {
                      const key = Object.keys(val)[0];
                      acc[index][key] = val[key];
                    } else {
                      acc.push(val);
                    }
                    return acc;
                  },
                  []
                );
              }
            });
          });

          // console.log(this.formateSectorData7, '743----');
          // this.formateSectorData7.forEach((ele: any) => {
          //   console.log(ele.displayOrder);
          // });
          let data = this.formateSectorData1.sort((a: any, b: any) => {
            return parseInt(a.displayOrder) - parseInt(b.displayOrder);
          });

          // console.log(data, this.formateSectorData1);
          this.tabledata = this.formateSectorData1;
          this.periods1.reverse();

          if (periodChange) {
            this.headerButtonFuction(this.buttonactive, '');
          }
        },
        (err) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);
        }
      );
  }

  getPrivateComapnyFinancialData(
    id: any,
    currency: any,
    periodChange?: boolean
  ) {
    this.finance_data = [];
    this.is_data = [];
    this.bs_data = [];
    this.cf_data = [];
    this.vr_data = [];
    this.fr_data = [];
    this.periods1 = [];
    this.itemName1 = [];
    this.itemName2 = [];
    this.itemName3 = [];
    this.itemName4 = [];
    this.itemName7 = [];
    this.formateSectorData1 = [];
    // this.defaultIcomeStatement =[];
    this.formateSectorData2 = [];
    this.formateSectorData3 = [];
    this.formateSectorData4 = [];
    this.formateSectorData7 = [];
    this.sectorOject1 = {};
    this.sectorOject2 = {};
    this.sectorOject3 = {};
    this.sectorOject4 = {};

    this.financialMarketData
      .getIndianPrivateFinancialData(id, currency, 'Yearly')
      .subscribe(
        (res) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);
          this.companydata = {
            id: id,
            currency: currency,
            period: this.period_finance,
          };
          this.finance_data = res;
          for (var i = 0; i < this.finance_data?.length; i++) {
            if (this.finance_data[i].financialType == 'IS') {
              this.is_data.push(this.finance_data[i]);
            }
            if (this.finance_data[i].financialType == 'BS') {
              this.bs_data.push(this.finance_data[i]);
            }
            if (this.finance_data[i].financialType == 'CF') {
              this.cf_data.push(this.finance_data[i]);
            }
            if (this.finance_data[i].financialType == 'VR') {
              this.vr_data.push(this.finance_data[i]);
            }
            if (this.finance_data[i].financialType == 'FR') {
              this.fr_data.push(this.finance_data[i]);
            }
          }
          for (var i = 0; i < this.is_data.length; i++) {
            if (!this.periods1.includes(this.is_data[i].period)) {
              this.periods1.push(this.is_data[i].period);
            }

            if (!this.itemName1.includes(this.is_data[i].fieldName)) {
              const key = 'name' + i;
              this.itemName1.push({
                name: this.is_data[i].fieldName,
                date: this.is_data[i].period,
                data: this.is_data[i].data,
              });
            }
          }
          this.periods1.sort((a: any, b: any) => +new Date(a) - +new Date(b));
          // Calculate from date for financials
          this.fromFinDate = new Date(this.periods1[0]);

          this.itemName1.map((val1: any, index1: any) => {
            this.is_data.map((val2: any, index2: any) => {
              if (val1.name == val2.fieldName && val1.date == val2.period) {
                var index = this.formateSectorData1.findIndex(
                  (data: any) => data[val1['date']] == val2.period
                );
                if (index > -1) {
                } else {
                  this.sectorOject1 = {};
                }
                const newKey = val1['date'];
                this.sectorOject1[newKey] = val1.data;
                this.sectorOject1 = {
                  ...this.sectorOject1,
                  description: val2.itemName,
                  fieldName: val2.fieldName,
                  depth: val2.depthLevel,
                  displayOrder: val2.displayOrder,
                  graphflag: val2.icFlag ? '1' : '0',
                };
                this.formateSectorData1 = [
                  ...this.formateSectorData1,
                  this.sectorOject1,
                ];
                this.formateSectorData1 = this.formateSectorData1.reduce(
                  (acc: any, val: any, ind: any) => {
                    const index = acc.findIndex(
                      (el: any) => el.description === val.description
                    );
                    if (index !== -1) {
                      const key = Object.keys(val)[0];
                      acc[index][key] = val[key];
                    } else {
                      acc.push(val);
                    }
                    return acc;
                  },
                  []
                );
              }
            });
          });

          for (var i = 0; i < this.bs_data.length; i++) {
            // if (!this.periods1.includes(this.is_data[i].period)) {
            //   this.periods1.push(this.is_data[i].period);
            // }

            if (!this.itemName2.includes(this.bs_data[i].fieldName)) {
              const key = 'name' + i;
              this.itemName2.push({
                name: this.bs_data[i].fieldName,
                date: this.bs_data[i].period,
                data: this.bs_data[i].data,
              });
            }
          }
          this.itemName2.map((val1: any, index1: any) => {
            this.bs_data.map((val2: any, index2: any) => {
              if (val1.name == val2.fieldName && val1.date == val2.period) {
                var index = this.formateSectorData2.findIndex(
                  (data: any) => data[val1['date']] == val2.period
                );
                if (index > -1) {
                } else {
                  this.sectorOject2 = {};
                }
                const newKey = val1['date'];
                this.sectorOject2[newKey] = val1.data;
                this.sectorOject2 = {
                  ...this.sectorOject2,
                  description: val2.itemName,
                  fieldName: val2.fieldName,
                  depth: val2.depthLevel,
                  displayOrder: val2.displayOrder,
                  graphflag: val2.icFlag ? '1' : '0',
                };
                this.formateSectorData2 = [
                  ...this.formateSectorData2,
                  this.sectorOject2,
                ];
                this.formateSectorData2 = this.formateSectorData2.reduce(
                  (acc: any, val: any, ind: any) => {
                    const index = acc.findIndex(
                      (el: any) => el.description === val.description
                    );
                    if (index !== -1) {
                      const key = Object.keys(val)[0];
                      acc[index][key] = val[key];
                    } else {
                      acc.push(val);
                    }
                    return acc;
                  },
                  []
                );
              }
            });
          });

          for (var i = 0; i < this.cf_data.length; i++) {
            // if (!this.periods1.includes(this.is_data[i].period)) {
            //   this.periods1.push(this.is_data[i].period);
            // }

            if (!this.itemName3.includes(this.cf_data[i].fieldName)) {
              const key = 'name' + i;
              this.itemName3.push({
                name: this.cf_data[i].fieldName,
                date: this.cf_data[i].period,
                data: this.cf_data[i].data,
              });
            }
          }
          this.itemName3.map((val1: any, index1: any) => {
            this.cf_data.map((val2: any, index2: any) => {
              if (val1.name == val2.fieldName && val1.date == val2.period) {
                var index = this.formateSectorData3.findIndex(
                  (data: any) => data[val1['date']] == val2.period
                );
                if (index > -1) {
                } else {
                  this.sectorOject3 = {};
                }
                const newKey = val1['date'];
                this.sectorOject3[newKey] = val1.data;
                this.sectorOject3 = {
                  ...this.sectorOject3,
                  description: val2.itemName,
                  fieldName: val2.fieldName,
                  depth: val2.depthLevel,
                  displayOrder: val2.displayOrder,
                  graphflag: val2.icFlag ? '1' : '0',
                };
                this.formateSectorData3 = [
                  ...this.formateSectorData3,
                  this.sectorOject3,
                ];
                this.formateSectorData3 = this.formateSectorData3.reduce(
                  (acc: any, val: any, ind: any) => {
                    const index = acc.findIndex(
                      (el: any) => el.description === val.description
                    );
                    if (index !== -1) {
                      const key = Object.keys(val)[0];
                      acc[index][key] = val[key];
                    } else {
                      acc.push(val);
                    }
                    return acc;
                  },
                  []
                );
              }
            });
          });

          for (var i = 0; i < this.vr_data.length; i++) {
            // if (!this.periods1.includes(this.is_data[i].period)) {
            //   this.periods1.push(this.is_data[i].period);
            // }

            if (!this.itemName4.includes(this.vr_data[i].fieldName)) {
              const key = 'name' + i;
              this.itemName4.push({
                name: this.vr_data[i].fieldName,
                date: this.vr_data[i].period,
                data: this.vr_data[i].data,
              });
            }
          }
          this.itemName4.map((val1: any, index1: any) => {
            this.vr_data.map((val2: any, index2: any) => {
              if (val1.name == val2.fieldName && val1.date == val2.period) {
                var index = this.formateSectorData4.findIndex(
                  (data: any) => data[val1['date']] == val2.period
                );
                if (index > -1) {
                } else {
                  this.sectorOject4 = {};
                }
                const newKey = val1['date'];
                this.sectorOject4[newKey] = val1.data;
                this.sectorOject4 = {
                  ...this.sectorOject4,
                  description:
                    val2.currency != null && val2.unit != null
                      ? val2.itemName +
                        ' (' +
                        val2.currency +
                        ' ' +
                        val2.unit +
                        ')'
                      : val2.unit != null && val2.currency == null
                      ? val2.itemName + ' (' + val2.unit + ')'
                      : val2.itemName,
                  fieldName: val2.fieldName,
                  desc: val2.itemName,
                  shortName: val2.shortName,
                  currency: val2.currency,
                  unit: val2.unit,
                  depth: val2.depthLevel,
                  displayOrder: val2.displayOrder,
                  graphflag: val2.icFlag ? '1' : '0',
                };
                this.formateSectorData4 = [
                  ...this.formateSectorData4,
                  this.sectorOject4,
                ];
                this.formateSectorData4 = this.formateSectorData4.reduce(
                  (acc: any, val: any, ind: any) => {
                    const index = acc.findIndex(
                      (el: any) => el.description === val.description
                    );
                    if (index !== -1) {
                      const key = Object.keys(val)[0];
                      acc[index][key] = val[key];
                    } else {
                      acc.push(val);
                    }
                    return acc;
                  },
                  []
                );
              }
            });
          });

          for (var i = 0; i < this.fr_data.length; i++) {
            // if (!this.periods1.includes(this.is_data[i].period)) {
            //   this.periods1.push(this.is_data[i].period);
            // }

            if (!this.itemName7.includes(this.fr_data[i].fieldName)) {
              const key = 'name' + i;
              this.itemName7.push({
                name: this.fr_data[i].fieldName,
                date: this.fr_data[i].period,
                data: this.fr_data[i].data,
              });
            }
          }
          this.itemName7.map((val1: any, index1: any) => {
            this.fr_data.map((val2: any, index2: any) => {
              if (val1.name == val2.fieldName && val1.date == val2.period) {
                var index = this.formateSectorData7.findIndex(
                  (data: any) => data[val1['date']] == val2.period
                );
                if (index > -1) {
                } else {
                  this.sectorOject4 = {};
                }
                const newKey = val1['date'];
                this.sectorOject4[newKey] = val1.data;
                this.sectorOject4 = {
                  ...this.sectorOject4,
                  description:
                    val2.currency != null && val2.unit != null
                      ? val2.itemName +
                        ' (' +
                        val2.currency +
                        ' ' +
                        val2.unit +
                        ')'
                      : val2.unit != null && val2.currency == null
                      ? val2.itemName + ' (' + val2.unit + ')'
                      : val2.itemName,
                  // val2.itemName,
                  fieldName: val2.fieldName,
                  desc: val2.itemName,
                  shortName: val2.shortName,
                  currency: val2.currency,
                  unit: val2.unit,
                  depth: val2.depthLevel,
                  displayOrder: val2.displayOrder,
                  graphflag: val2.icFlag ? '1' : '0',
                };
                this.formateSectorData7 = [
                  ...this.formateSectorData7,
                  this.sectorOject4,
                ];

                this.formateSectorData7 = this.formateSectorData7.reduce(
                  (acc: any, val: any, ind: any) => {
                    const index = acc.findIndex(
                      (el: any) => el.description === val.description
                    );
                    if (index !== -1) {
                      const key = Object.keys(val)[0];
                      acc[index][key] = val[key];
                    } else {
                      acc.push(val);
                    }
                    return acc;
                  },
                  []
                );
              }
            });
          });
          this.tabledata = this.formateSectorData1;
          this.periods1.reverse();

          if (periodChange) {
            this.headerButtonFuction(this.buttonactive, '');
          }
        },
        (err) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);
        }
      );
  }

  getCurreny() {
    this.financialMarketData.getCurrencies().subscribe((res) => {
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

  onCurrencyChangeHandler(e: any) {
    if (this.currency !== e) {
      this.tabledata = [];
      this.count_res = 0;
      this.total_count_res = 1;
      this.loaderService.display(true);
      this.currency = e;
      if (this.company_type == 'Private') {
        this.getPrivateComapnyFinancialData(
          this.compnayid,
          this.currency,
          true
        );
      } else {
        this.getFinancialData(this.compnayid, this.currency, this.period, true);
      }
    }
  }
}

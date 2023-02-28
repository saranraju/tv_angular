import {
  Component,
  ElementRef,
  HostListener,
  Inject,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import am4themes_dataviz from '@amcharts/amcharts4/themes/animated';
import { FinancialMarketDataService } from 'src/app/services/financialmarketdata.service';
import { UtilService } from 'src/app/services/util.service';
import * as am4plugins_rangeSelector from '@amcharts/amcharts4/plugins/rangeSelector';
import { LoaderServiceService } from '../loader-service.service';
import { saveAs } from 'file-saver';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import am4themes_microchart from '@amcharts/amcharts4/themes/microchart';
import { DatePipe } from '@angular/common';
import { EventEmitter } from 'stream';
import * as moment from 'moment';
import * as Excel from 'exceljs';
import * as ExcelProper from 'exceljs';
@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss'],
})
export class CompanyComponent implements OnInit {
  constructor(
    public auth: AuthService,
    private financialMarketData: FinancialMarketDataService,
    public util: UtilService,
    public loaderService: LoaderServiceService,
    private route: ActivatedRoute,
    public datepipe: DatePipe,
    public router: Router,
    private activatedRoute: ActivatedRoute
  ) {}
  user_management_expolre_id: any;
  selectedParentSet = 'summary_tab';
  debt_data: any = [];
  bonds_isn_Number: any = 'US912810FM54';
  onSectionChange(sectionId: any) {
    this.selectedParentSet = sectionId;
  }
  entityID: any;

  openPopupModal: boolean = false;
  toDaysDate = new Date();
  // this.entity_id = data[0].entity_id;
  //   this.company_id = data[0].id;
  //   this.comapny_name = data[0].company_name;
  //   this.currency = data[0].currency;
  //   this.security_id = data[0].security_id;

  show_advance: boolean = false;
  tab_name: any = '';
  previousAPI: any = null;

  // Investments
  directInvestmentsTableData: any = {
    title: [
      {
        label: 'Entity Name',
        key: 'entity_name',
        plusIcon: true,
        color: '#ffc000',
        textDecoration: 'underline',
        // sorting: true,
        headerCursor: 'pointer',
        width: '10rem',
        customSort: 'entity_proper_name',
      },
      {
        label: 'Industry',
        key: 'tics_industry_name',
        // sorting: true,
        headerCursor: 'pointer',
        width: '10rem',
        customSort: 'tics_industry_name',
      },
      {
        label: 'Country',
        key: 'country',
        // sorting: true,
        headerCursor: 'pointer',
        customSort: 'country_name',
      },
      {
        label: 'Latest Investment Date',
        key: 'latest_investment_date',
        // sorting: true,
        headerCursor: 'pointer',
        customSort: 'investment_date',
      },
      {
        label: 'Status',
        key: 'status',
        align: 'center',
        // sorting: true,
        headerCursor: 'pointer',
        customSort: 'status',
      },
      {
        label: 'Participating Funds',
        key: 'participating_funds',
        align: 'center',
        textDecoration: 'underline',
        // sorting: true,
        width: '9rem',
        headerCursor: 'pointer',
        cursor: 'pointer',
        color: '#ffc000',
        customSort: 'participating_funds',
      },
      {
        label: 'Latest Investment Round',
        key: 'latest_investment_round',
        align: 'center',
        color: '#ffc000',
        textDecoration: 'underline',
        // sorting: true,
        headerCursor: 'pointer',
        cursor: 'pointer',
        customSort: 'latest_investment_round',
      },
      {
        label: 'Total Investment (USD Million)',
        key: 'valuation',
        align: 'center',
        // sorting: true,
        headerCursor: 'pointer',
        customSort: 'valuation',
      },
      {
        label: 'Total Participated Round Funding Amount (USD Million)',
        key: 'valuation_fx',
        align: 'center',
        // sorting: true,
        width: '9.5rem',
        headerCursor: 'pointer',
        customSort: 'valuation_fx',
      },
      {
        label: 'Exit Date',
        key: 'exit_date',
        align: 'center',
        // sorting: true,
        headerCursor: 'pointer',
        customSort: 'exit_date',
      },
      {
        label: 'Exit Route',
        key: 'exit_route',
        align: 'center',
        // sorting: true,
        headerCursor: 'pointer',
        customSort: 'exit_route',
      },
    ],
    value: [],
  };
  directInvestmentsChildTableData: any = {
    title: [
      {
        label: '',
        width: '10rem',
      },
      {
        label: 'Description',
        key: 'description',
        color: '#ffc000',
        textDecoration: 'underline',
        align: 'left',
        sorting: true,
        cursor: 'pointer',
        width: '10rem',
      },
      {
        label: 'Issue Type',
        key: 'issue_type',
        align: 'left',
        sorting: true,
      },
      {
        label: 'Financing Type',
        key: 'financing_type',
        align: 'left',
        sorting: true,
      },
      {
        label: 'Round Date',
        key: 'round_date',
        align: 'center',
        sorting: true,
      },
      {
        label: 'Participating Fund',
        key: 'participating_funds',
        align: 'center',
        textDecoration: 'underline',
        sorting: true,
        cursor: 'pointer',
        color: '#ffc000',
        width: '9rem',
      },
      {
        label: 'Investment Currency',
        key: 'investment_currency',
        align: 'center',
        sorting: true,
      },
      {
        label: 'Investment in Round (USD Million)',
        key: 'valuation',
        align: 'center',
        sorting: true,
      },
      {
        label: 'Round Funding Amount (USD Million)',
        key: 'valuation_fx',
        align: 'center',
        sorting: true,
        width: '9.5rem',
      },
      {
        label: 'Exit Date',
        key: 'exit_date',
        align: 'center',
        sorting: true,
      },
      {
        label: 'Exit Route',
        key: 'exit_route',
        align: 'center',
        sorting: true,
      },
    ],
    value: [],
  };
  fundOfFundsInvestmetns: any = {
    title: [
      {
        label: 'Firm Name',
        key: 'firm_name',
        color: '#ffc000',
        textDecoration: 'underline',
        sorting: true,
        cursor: 'pointer',
        width: '8rem',
      },
      {
        label: 'Fund Name',
        key: 'fund_name',
        color: '#ffc000',
        textDecoration: 'underline',
        sorting: true,
        cursor: 'pointer',
        width: '8rem',
      },
      {
        label: 'Amount Invested (USD Million)',
        key: 'amount_invested',
        align: 'center',
        sorting: true,
      },
      {
        label: 'Country Focus',
        key: 'country_focus',
        align: 'center',
        sorting: true,
      },
      {
        label: 'Sector Focus',
        key: 'sector_focus',
        align: 'center',
        sorting: true,
        width: '16rem',
      },
      {
        label: 'Initiation Date',
        key: 'initiation_date',
        align: 'center',
        sorting: true,
      },
      {
        label: 'Amount Raised (USD Million)',
        key: 'amount_raised',
        align: 'center',
        sorting: true,
      },
      {
        label: 'Fund Type',
        key: 'fund_type_desc',
        align: 'center',
        sorting: true,
      },
      {
        label: 'Fund Status',
        key: 'fund_status',
        align: 'center',
        sorting: true,
      },
      {
        label: 'Closure Date',
        key: 'closure_date',
        align: 'center',
        sorting: true,
      },
    ],
    value: [],
  };
  entityDetailsTableData: any = {
    title: [
      {
        label: 'Investor Name',
        key: 'entityProperName',
        color: '#ffc000',
        textDecoration: 'underline',
        sorting: true,
        headerCursor: 'pointer',
        cursor: 'pointer',
      },
      {
        label: 'Fund Name',
        key: 'fundName',
        color: '#ffc000',
        sorting: true,
        headerCursor: 'pointer',
        textDecoration: 'underline',
        cursor: 'pointer',
      },
      {
        label: 'Investor Type',
        key: 'entityType',
        align: 'center',
        sorting: true,
        headerCursor: 'pointer',
      },
      {
        label: 'Investment %',
        key: 'pctHeld',
        sorting: true,
        align: 'center',
        headerCursor: 'pointer',
      },
      {
        label: 'Status',
        key: 'status',
        align: 'center',
        sorting: true,
        headerCursor: 'pointer',
      },
      {
        label: 'Exit Date',
        key: 'terminationDate',
        align: 'center',
        sorting: true,
        headerCursor: 'pointer',
      },
    ],
    value: [],
  };
  firmStructureTableData: any = {
    title: [
      {
        label: 'Fund Name',
        key: 'fund_name',
        color: '#ffc000',
        textDecoration: 'underline',
        sorting: true,
        headerCursor: 'pointer',
        cursor: 'pointer',
        width: '12rem',
      },
      {
        label: 'Country Focus',
        key: 'country_focus',
        align: 'center',
        sorting: true,
        headerCursor: 'pointer',
      },
      {
        label: 'Sector Focus',
        key: 'sector_focus',
        align: 'center',
        sorting: true,
        headerCursor: 'pointer',
        width: '19rem',
      },
      {
        label: 'Initiation Date',
        key: 'initiation_date',
        align: 'center',
        sorting: true,
        headerCursor: 'pointer',
      },
      {
        label: 'Amount Raised (USD Million)',
        key: 'amount_raised',
        align: 'center',
        sorting: true,

        headerCursor: 'pointer',
      },
      {
        label: 'Fund Type',
        key: 'fund_type',
        align: 'center',
        sorting: true,
        headerCursor: 'pointer',
      },
      {
        label: 'Fund Status',
        key: 'fund_status',
        align: 'center',
        sorting: true,
        headerCursor: 'pointer',
      },
      {
        label: 'Closure Date',
        key: 'closure_date',
        align: 'center',
        sorting: true,
        headerCursor: 'pointer',
      },
    ],
    value: [],
  };
  pevcFirmTableData: any = {
    title: [
      {
        label: 'Firm Name',
        key: 'Firm_name',
        textDecoration: 'underline',
        cursor: 'pointer',
        width: '14rem',
      },
      {
        label: 'Active Funds',
        key: 'Active_Funds',
        color: '#fff',
        align: 'center',
      },
      {
        label: 'AUM (USD M)',
        key: 'amount_raised',
        color: '#fff',
        align: 'center',
      },
      {
        label: 'Average Fund Size (USD M)',
        key: 'Average_Fund_size',
        color: '#fff',
        align: 'center',
      },
    ],
    value: [],
  };

  period: any = 'yearly';

  search_key_values: any = '';
  search_key_values_benchmark: any;
  selectPEVCCompanyData: any = [];
  selectedPEVCCompanyData: any;
  showExpandIcon: any;
  ngOnInit(): void {
    this.user_management_expolre_id =
      this.route.snapshot.queryParams['explore'];
    if (this.user_management_expolre_id == 'true') {
      localStorage.setItem('exploreUserTime', new Date().toString());
      let body = {};
      this.auth.getExploreData(body).subscribe(
        (res) => {
          if (res && res.token) {
            localStorage.setItem('access_token', res.token);
            localStorage.setItem('id', '0');
            this.getRouteInfo();
          }
          setTimeout(() => {
            this.auth.expriedPopup = true;
          }, 1800000);
        },
        (err) => {
          this.router.navigate(['/login']);
          localStorage.clear();
          console.log('error', err.error);
        }
      );
    } else {
      this.auth.userType = localStorage.getItem('userType');
      this.auth.userId = localStorage.getItem('id');
      $(document).on('select2:open', (e) => {
        if (e.target.id === 'companyDropdownMNA') {
          const selectSearchInput = document.querySelector(
            '.select2-search__field'
          );
          const inputs: any = document.querySelectorAll(
            '.select2-search__field[aria-controls]'
          );
          const mostRecentlyOpenedInput = inputs[inputs.length - 1];
          mostRecentlyOpenedInput.focus();

          let timeout: any = null;

          selectSearchInput?.addEventListener('input', (e: any) => {
            clearTimeout(timeout);

            if (this.previousAPI !== null) {
              this.previousAPI.unsubscribe();
            }
            this.search_key_values = e.target.value;

            timeout = setTimeout(() => {
              if (!this.isPrivateCompanyActive) {
                this.getCompanySearchDataHandler(e.target.value);
              } else {
                this.getPrivateCompanies(e.target.value);
              }
            }, 1000);
            // this.getTransactionsCompanySearchDataHandler(e.target.value);
          });
        } else if (e.target.id === 'companyDropdownMNAbenchmark') {
          const selectSearchInput = document.querySelector(
            '.select2-search__field'
          );
          const inputs: any = document.querySelectorAll(
            '.select2-search__field[aria-controls]'
          );

          const mostRecentlyOpenedInput = inputs[inputs.length - 1];
          mostRecentlyOpenedInput.focus();
          selectSearchInput?.addEventListener('input', (e: any) => {
            let timeout: any = null;

            if (this.previousAPI !== null) {
              this.previousAPI.unsubscribe();
            }
            this.search_key_values_benchmark = e.target.value;
            timeout = setTimeout(() => {
              if (!this.isPrivateCompanyActive) {
                this.getCompanySearchDataHandlerBenchmark(e.target.value);
              } else {
                this.getPrivateBenchmarkCompanies(e.target.value);
              }
            }, 1000);
            // this.getTransactionsCompanySearchDataHandler(e.target.value);
          });
        } else if (e.target.id === 'companyDropdownListed') {
          const inputs: any = document.querySelectorAll(
            '.select2-search__field[aria-controls]'
          );
          const mostRecentlyOpenedInput = inputs[inputs.length - 1];
          mostRecentlyOpenedInput.focus();
        }
      });
      if (
        Object.keys((this.activatedRoute.queryParams as any)?.value).length != 0
      ) {
        this.activatedRoute.queryParams.subscribe((params: any) => {
          if (params.tab_name === 'fund-benchmark-firm') {
            this.handlefirmSelected(params);
          } else if (params.tab_name === 'fund-benchmark-fund') {
            this.handleFundBenchmarkFund(params);
          } else if (params.tab_name === 'not-listed-benchmark-firm') {
            this.handlefirmSelected(params);
          } else if (params.tab_name === 'not-listed-fundsoffunds-firm') {
            this.handlefirmSelected(params);
          } else if (params.tab_name === 'not-listed-fundsoffunds-fund') {
            this.handleFundBenchmarkFund(params);
          } else if (params.tab_name === 'not-listed-direct-fund') {
            this.handleFundBenchmarkFund(params);
          } else if (params.tab_name === 'listed-benchmark-firm') {
            this.handlefirmSelectedBenchmark(params);
          } else if (params.tab_name === 'listed-firm-structure-fund') {
            this.handlefundSelectedFirmStructure(params);
          } else if (params.tab_name === 'listed-fundsoffunds-fund') {
            this.handlefundSelected(params);
          } else if (params.tab_name === 'listed-fundsoffunds-firm') {
            this.handlefirmSelected(params);
          } else if (params.tab_name === 'listed-direct-fund') {
            this.handlepevcNotListedParticipatingFunds(params);
          } else if (params.tab_name === 'investor-name-fund') {
            this.handlefirmSelected(params);
          } else {
            this.getRouteInfo();
          }
        });
      } else {
        this.loaderService.display(true);
        this.financialMarketData.getCountryIp().subscribe((res: any) => {
          this.company_url = res.countryCode;
          this.getRouteInfo();
        });
      }
    }
  }

  doCheckCount: any = false;
  ngDoCheck(): void {
    if (this.count_res === 25 && !this.doCheckCount) {
      this.util.loaderService.showTutorial(true);
      this.doCheckCount = true;
    }
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.auth.expandopenPopupPdfViewer = false;
    }
  }

  company_url: any;
  tabIndustryInstance: any;
  redirectToIndustryPage() {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/financialmarketdata/industry'], {
        relativeTo: this.route,
        queryParams: {
          sector_id: this.company_info.ticsSectorCode,
          sector_industry_id: this.company_info.ticsIndustryCode,
          currency: this.company_info.currency,
          countryId: this.company_info.countryId,
          country: this.company_info.countryName,
        },
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
  isbenchmarkLoading: any = true;
  globalMatrixList: any = [];
  benchMarkToInteractiveAnalysis() {
    let companyIds: any = '';

    if (this.auth.showPEVCTabs) {
      let tempCount = 1;
      this.pevcFirmTableData.value.forEach((el: any) => {
        this.financialMarketData
          .getCompanySecurityId(el.factset_pevc_firm_entity_id)
          .subscribe((res: any) => {
            tempCount++;
            this.formateSectorData5.push({
              id: res[0]?.company_id,
            });
            if (this.pevcFirmTableData?.value?.length == tempCount) {
              this.formateSectorData5.forEach((element: any) => {
                if (element.id != null) {
                  companyIds += element.id + '&';
                }
              });
              localStorage.setItem('globalMatrixList', JSON.stringify([]));
              this.globalMatrixList.push({
                name: 'stock',
                type: 'companyChartCustom',
                company: true,
              });
              localStorage.setItem(
                'globalMatrixList',
                JSON.stringify(this.globalMatrixList)
              );
              const url = this.router.serializeUrl(
                this.router.createUrlTree(
                  ['financialmarketdata/interactive-analysis'],
                  {
                    queryParams: {
                      currency: this.currency,
                      filter2: 'stock',
                      comparableList: companyIds,
                      periodcity: 'yearly',
                      companyName: this.comapny_name,
                      tabFrom: 'Company',
                    },
                  }
                )
              );
              if (this.tabInstance != undefined) {
                this.tabInstance.close();
                this.tabInstance = window.open(url, '_blank');
              } else {
                this.tabInstance = window.open(url, '_blank');
              }
            }
          });
      });
    } else {
      this.formateSectorData5.forEach((element: any) => {
        if (element.id != null) {
          companyIds += element.id + '&';
        }
      });
      this.globalMatrixList.push({
        name: 'stock',
        type: 'companyChartCustom',
        company: true,
      });
      localStorage.setItem(
        'globalMatrixList',
        JSON.stringify(this.globalMatrixList)
      );
      const url = this.router.serializeUrl(
        this.router.createUrlTree(
          ['financialmarketdata/interactive-analysis'],
          {
            queryParams: {
              currency: this.currency,
              filter2: 'stock',
              comparableList: companyIds,
              periodcity: 'yearly',
              industry: this.company_info.ff_industry,
              companyName: this.comapny_name,
              tabFrom: 'Company',
            },
          }
        )
      );
      if (this.tabInstance != undefined) {
        this.tabInstance.close();
        this.tabInstance = window.open(url, '_blank');
      } else {
        this.tabInstance = window.open(url, '_blank');
      }
    }
  }

  handlePEVCClick() {
    this.auth.showPEVCCompanyModal = true;
  }

  handlePublicCompany(e: any) {
    // this.auth.hidePublicCompany = e;
  }

  handlePublicCompanyClick() {
    this.auth.checkPEVC = false;

    this.loaderService.display(true);
    this.financialMarketData.getCountryIp().subscribe((res: any) => {
      this.company_url = res.countryCode;
      this.getRouteInfo();
    });
  }

  handlePrivateCompanyClick() {
    this.loaderService.display(true);
    this.financialMarketData.getCountryIp().subscribe((res: any) => {
      this.company_url = res.countryCode;
      this.getRouteInfo();
    });

    this.auth.openPopupModalcompanySearch = true;
    this.isPrivateCompanyActive = true;
  }

  handleListedSelection(e: any) {
    this.auth.hidePublicCompany = e;
    this.auth.showPEVCTabs = true;

    this.loaderService.display(true);
    this.financialMarketData.getCountryIp().subscribe((res: any) => {
      this.company_url = res.countryCode;
      this.getRouteInfo();
    });
  }

  handleCheckPEVC(e: any) {
    // this.auth.checkPEVC = e;
  }

  handlePublicCLick() {
    // this.auth.showPEVCTabs = false;
    // this.loaderService.display(true);
    // this.financialMarketData.getCountryIp().subscribe((res: any) => {
    //   this.company_url = res.countryCode;
    //   this.getRouteInfo();
    // });

    this.auth.openPopupModalcompanySearchPublic = true;
  }

  getRouteInfo() {
    this.route.queryParams.subscribe((params: Params) => {
      this.company_id = params['comp_id'];
      this.comapny_name = params['company_name'];
      this.currency = params['currency'];
      this.security_id = params['security_id'];
      this.entity_id = params['entity_id'];
      this.tab_name = params['tabName'];
    });
    if (
      this.company_id == undefined &&
      this.comapny_name == undefined &&
      this.currency == undefined &&
      this.security_id == undefined &&
      this.tab_name == undefined
    ) {
      this.show_advance = false;
      this.getDefaultCompany();
      // this.getDebtProfile();
      // this.getmanagementData();
      this.util.setDateHandler('1Y');
      this.getCurreny();
    }
    if (
      this.company_id != undefined &&
      this.comapny_name != undefined &&
      this.tab_name == undefined
    ) {
      this.show_advance = true;
      this.getAdvanceData();
    }
    if (
      this.company_id != undefined &&
      this.comapny_name != undefined &&
      this.currency != undefined &&
      this.tab_name == 'company'
    ) {
      // this.show_advance = true;
      // this.security_id = this.companies_data.filter(
      //   (data: any) => data.companyId == this.company_id
      // )[0].securityId;
      // this.setdataValuesroute();
      this.getCurreny();
      this.getCompaniesRoute();
    }
    if (!this.show_advance) {
    } else {
      // this.getAdvanceData();
    }
    if (this.user_management_expolre_id) {
      // this.userExploreExpried();
    }
  }

  userExploreExpried() {
    let body = {};
    this.auth.getExploreData(body).subscribe(
      (res) => {
        if (res && res.token) {
          localStorage.setItem('access_token', res.token);
        }
        setTimeout(() => {
          this.auth.expriedPopup = true;
        }, 1800000);
      },
      (err) => {
        // this.router.navigate(['/login'])
        // localStorage.clear();
        // console.log('error', err.error);
      }
    );
  }

  isAllowToExcel() {
    this.financialMarketData
      .isAllowToExcelDownload(
        this.set_period_management,
        this.company_id,
        this.auth.userId
      )
      .subscribe(
        (res: any) => {
          if (res.data) {
            this.mngGuidExcelDownload();
          }
        },
        (err: any) => {
          console.log(err);

          if (err.status === 402) {
            this.auth.freeTrialAlert = true;
          }
        }
      );
  }

  setdataValuesroute() {
    this.count_res = 0;
    this.total_count_res = 23;
    this.loaderService.display(true);
    this.isbenchmarkLoading = true;
    this.getCompanyInfo(this.company_id, this.currency);
    // this.getBetaInfo(this.company_id, this.currency);
    this.getStockExchData(this.company_id);
    this.getFinancialData(this.company_id, this.currency);
    this.getSegmentData(
      this.company_id,
      this.comapny_name,
      this.selectedcurrecny
    );
    this.getDebtProfile(this.currency, this.entity_id);
    this.getDebtcompositionData(this.currency, this.entity_id);
    this.getMaturityData(this.currency, this.entity_id);
    this.getOwnershipData(this.security_id);
    this.getEstimateChartData(this.company_id);
    this.gettotalRecomChartData(this.company_id);
    this.getOwnershipdetaildata(this.security_id);
    this.getpromoroownershipData(this.security_id);
    this.getinstitueownershipData(this.security_id);
    this.getEstimateData(this.company_id);
    this.getEventsData(this.entity_id);
    this.getCompanyFileData(this.company_id, this.entity_id, '');
    this.getbenchmarktableData(this.entity_id, this.currency);
    this.getmanagementData(this.comapny_name, this.entity_id);

    // this.getRelativePriceData(this.company_id, this.currency);
    this.getCompanyIndexes(this.company_id);
    this.getStockChartData(this.company_id, this.currency);
    this.getinsiderTransaction(this.company_id, this.security_id);
    // this.getmanagementGuidancePerformance(this.company_id);
  }

  gotoTop(id: any) {
    // var $container: any = $('div'),
    //   $scrollTo: any = $(`#${id}`);

    // $container.scrollTop(
    //   $scrollTo.offset().top - $container.offset().top + $container.scrollTop()
    // );

    // // Or you can animate the scrolling:
    // $container.animate({
    //   scrollTop:
    //     $scrollTo.offset().top -
    //     $container.offset().top +
    //     $container.scrollTop(),
    // });

    document
      .getElementById('summary_tab')
      ?.scrollIntoView({ behavior: 'smooth' });
  }
  privateCompany_tab: any = false;
  privateCompanyTableData: any = [];
  isPrivateCompanyActive: any = false;
  isPrivateForiegnCompanyActive: any = false;
  company_country: any;
  getAdvanceData() {
    // if (
    //   Object.keys((this.activatedRoute.queryParams as any)?.value).length != 0
    // ) {
    this.getCurreny();
    this.route.queryParamMap.subscribe((params: any) => {
      let params_tabname = params.params.entity_type;
      this.company_country = params.params.companyCountry;
      this.company_id = params.params.comp_id;
      this.comapny_name = params.params.company_name;
      this.currency = params.params.currency;
      this.security_id = params.params.security_id;
      this.entity_id = params.params.entity_id;
      if (params_tabname === 'Private') {
        this.isPrivateCompanyActive = true;
        if (this.company_country == 'IND') {
          this.loaderService.display(true);
          this.count_res = 0;
          this.total_count_res = 6;
          this.period_finance = 'yearly';
          this.getIndianPrivateCompanyInfo(this.company_id, this.currency);
        } else {
          this.isPrivateForiegnCompanyActive = true;
          this.count_res = 0;
          this.total_count_res = 8;
          this.loaderService.display(true);
          // this.privateCompany_tab = true;
          this.getPrivateCompanyInfo(
            this.company_id,
            this.currency,
            this.comapny_name
          );
        }
      } else if (params_tabname === 'public') {
        this.isPrivateCompanyActive = false;
        this.show_advance = false;
        this.getCompaniesRoute();
      }

      // else {
      //   this.count_res = 0;
      //   this.total_count_res = 1;
      //   this.loaderService.display(true);
      //   this.getCompanyInfo(this.company_id, this.currency);
      //   this.getFinancialData(this.company_id, this.currency);
      //   this.getbenchmarktableData(this.entity_id, this.currency);
      // }
    });
    // }
  }

  currency_data: any = [];
  currecny_list: any = [];
  getCurreny() {
    this.currecny_list = [];
    this.financialMarketData.getCurrencies().subscribe((res) => {
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
  privateCompanyPeriodicity: any = [
    {
      id: 'yearly',
      title: 'Yearly',
    },
  ];
  getFinancialPeriodicity(id: any) {
    this.financialMarketData
      .getPeriodicityFinancial(id)
      .subscribe((res: any) => {
        var arr: any = [];
        res.forEach((ele: any) => {
          if (ele == 'Yearly') {
            arr.push({
              id: 'yearly',
              title: 'Yearly',
            });
          }
          if (ele == 'Half-Yearly') {
            arr.push({
              id: 'semiann',
              title: 'Half-Yearly',
            });
          }
          if (ele == 'Quarterly') {
            arr.push({
              id: 'quarterly',
              title: 'Quarterly',
            });
          }
        });
        this.periodicity_list = arr;
      });
  }

  getBenchmarkPeriodicity(id: any) {
    this.financialMarketData
      .getBenchmarkPeriodicity(id)
      .subscribe((res: any) => {
        var arr = [
          {
            id: 'YEARLY',
            title: 'Yearly',
          },
        ];
        if (res[0]?.periodType == 'Quarterly') {
          arr.push({
            id: 'quarterly',
            title: 'Quarterly',
          });
        }
        if (res[0]?.periodType == 'Semi-Annual') {
          arr.push({
            id: 'SEMIANNUALLY',
            title: 'Half-Yearly',
          });
        }
        this.benchmarkPeriodcirty_list = arr;
      });
  }

  company_list: any = [];
  companies_data: any = [];
  tempCompaniesList: any = [];
  benchmarklist: any = [];
  company_list1: any = [];
  periodicity_list: any = [];
  benchmarkPeriodcirty_list: any = [];
  getCompanies() {
    this.company_list = [];
    this.company_list1 = [];
    this.companies_data = [];
    this.financialMarketData.getCompanies().subscribe((res) => {
      this.companies_data = res;
      let categoryFormattedData: any = [];
      // this.company_list = res;
      var benchmarkList: any = [];
      this.company_list = res;
      ++this.count_res;
      this.util.checkCountValue(this.total_count_res, this.count_res);
      res?.forEach((element: any) => {
        categoryFormattedData.push({
          id: element.id,
          text: `${element.name} (${element.exchangeName})`,
        });
        benchmarkList.push({
          id: element.factSetEntityId,
          text: `${element.name} (${element.exchangeName})`,
        });
        this.company_list = categoryFormattedData;
        this.tempCompaniesList = categoryFormattedData;
        this.benchmarklist = benchmarkList;
        this.company_list1 = benchmarkList;

        setTimeout(() => {
          $('#companyDropdownMNA').select2('open');
          // $('#companyDropdownMNA').select2('close');
        }, 100);
      });
    });
  }

  getCompanies1() {
    this.company_list = [];
    this.company_list1 = [];
    this.companies_data = [];
    this.financialMarketData.getCompanies().subscribe((res) => {
      this.companies_data = res;
      let categoryFormattedData: any = [];
      // this.company_list = res;
      ++this.count_res;
      this.util.checkCountValue(this.total_count_res, this.count_res);
      res?.forEach((element: any) => {
        categoryFormattedData.push({
          id: element.factSetEntityId,
          text: `${element.name} (${element.exchangeName})`,
        });
        this.company_list1 = categoryFormattedData;

        this.tempCompaniesList = categoryFormattedData;

        setTimeout(() => {
          $('#companyDropdownMNAbenchmark').select2('open');
        }, 100);
      });
    });
  }
  privateCompaniesData: any;
  getPrivateCompanies(searchTerm?: any) {
    let privateCompaniesLocal: any = [];

    this.previousAPI = this.financialMarketData
      .getPrivateCompanies(searchTerm ?? '')
      .subscribe((res: any) => {
        this.privateCompaniesData = res;
        res.forEach((el: any) => {
          privateCompaniesLocal.push({
            id: el.id,
            text: `${el.name} (Private)`,
          });
        });

        if (res.length === 0) {
          setTimeout(() => {
            document
              .getElementById('select2-companyDropdownMNA-results')
              ?.classList.add('noDataApply');
          }, 1500);
        }

        this.company_list = privateCompaniesLocal;

        setTimeout(() => {
          $('#companyDropdownMNA').select2('open');
          (document.querySelector('.select2-search__field') as any).value =
            this.search_key_values ?? '';
        }, 100);
      });
  }

  getPrivateBenchmarkCompanies(searchTerm?: any) {
    let privateCompaniesLocal: any = [];

    this.previousAPI = this.financialMarketData
      .getPrivateBenchmarkCompany(searchTerm ?? '')
      .subscribe(
        (res: any) => {
          res.forEach((el: any) => {
            let companyNameSuffix: any = '';
            if (el.entityType === 'private') {
              companyNameSuffix = '(Private)';
            } else {
              companyNameSuffix = `(${el.exchangeCode})`;
            }
            privateCompaniesLocal.push({
              id: el.factSetEntityId ?? el.id,
              text: `${el.name} ${companyNameSuffix}`,
            });
          });

          if (res.length === 0) {
            setTimeout(() => {
              document
                .getElementById('select2-companyDropdownMNAbenchmark-results')
                ?.classList.add('noDataApply');
            }, 1500);
          }

          this.company_list1 = privateCompaniesLocal;

          setTimeout(() => {
            $('#companyDropdownMNAbenchmark').select2('open');
            (document.querySelector('.select2-search__field') as any).value =
              this.search_key_values_benchmark ?? '';
          }, 100);
        },
        (err) => {
          console.log('error', err.message);
        }
      );
  }

  handleMNACompanyClick() {
    if (!this.isPrivateCompanyActive) {
      this.getCompanies();
      this.company_list = this.tempCompaniesList;
    } else {
      this.search_key_values = '';
      this.getPrivateCompanies();
    }
  }

  handleMNACompanyBenchmarkClick() {
    if (!this.isPrivateCompanyActive) {
      this.getCompanies1();
      this.company_list1 = this.tempCompaniesList;
    } else {
      this.search_key_values_benchmark = '';
      this.getPrivateBenchmarkCompanies();
    }
  }

  getCompanySearchDataHandler(searchTerm: any) {
    let transactionsComapnyFormattedData: any = [];
    this.companies_data = [];
    this.previousAPI = this.financialMarketData
      .getTransactionsCompanySearchDataBenchmark(searchTerm)
      .subscribe(
        (res) => {
          this.companies_data = res;
          res?.forEach((element: any) => {
            transactionsComapnyFormattedData.push({
              id: element.id,
              text:
                element.name +
                ' (' +
                element.exchangeName +
                // ': ' +
                // element.companyTicker +
                ')',
            });
          });

          if (res.length == 0) {
            setTimeout(() => {
              document
                .getElementById('select2-companyDropdownMNA-results')
                ?.classList.add('noDataApply');
            }, 1500);
          }

          this.company_list = transactionsComapnyFormattedData;
          // // this.loaderService.display(true);
          // setTimeout(() => {
          //   // this.loaderService.display(false);
          // }, 1000);

          setTimeout(() => {
            $('#companyDropdownMNA').select2('open');
            (document.querySelector('.select2-search__field') as any).value =
              this.search_key_values;
          }, 100);
        },
        (err) => {
          console.log('error', err.message);
        }
      );
  }

  getCompanySearchDataHandlerBenchmark(searchTerm: any) {
    // let transactionsComapnyFormattedData: any = [];
    let benchmarkComany: any = [];
    // this.companies_data = [];
    this.previousAPI = this.financialMarketData
      .getTransactionsCompanySearchDataBenchmark(searchTerm)
      .subscribe(
        (res: any) => {
          // this.companies_data = res;
          res?.forEach((element: any) => {
            // transactionsComapnyFormattedData.push({
            //   id: element.id,
            //   text:
            //     element.name +
            //     ' (' +
            //     element.exchangeCode +
            //     ': ' +
            //     element.companyTicker +
            //     ')',
            // });
            benchmarkComany.push({
              id: element.factSetEntityId,
              text:
                element.name +
                ' (' +
                element.exchangeName +
                // ': ' +
                // element.companyTicker +
                ')',
            });
          });

          this.company_list1 = benchmarkComany;

          // // this.loaderService.display(true);
          // setTimeout(() => {
          //   // this.loaderService.display(false);
          // }, 1000);

          if (res.length == 0) {
            setTimeout(() => {
              document
                .getElementById('select2-companyDropdownMNAbenchmark-results')
                ?.classList.add('noDataApply');
            }, 1500);
          }

          setTimeout(() => {
            $('#companyDropdownMNAbenchmark').select2('open');
            (document.querySelector('.select2-search__field') as any).value =
              this.search_key_values_benchmark;
          }, 100);
        },
        (err) => {
          console.log('error', err.message);
        }
      );
  }
  tabInstance: any;
  redirectToInteractive(filterParams: any, content: any) {
    let prevGlobalMatrixList = [];
    prevGlobalMatrixList = JSON.parse(
      localStorage.getItem('globalMatrixList') as any
    );
    if (prevGlobalMatrixList == null) prevGlobalMatrixList = [];

    prevGlobalMatrixList.push({
      name: filterParams,
      type: 'companyChartCustom',
      company: true,
    });
    localStorage.setItem(
      'globalMatrixList',
      JSON.stringify(prevGlobalMatrixList)
    );

    const url = this.router.serializeUrl(
      this.router.createUrlTree(['financialmarketdata/interactive-analysis'], {
        queryParams: {
          currency: this.currency,
          filter2: filterParams,
          comparableList: this.company_id,
          periodcity: this.period_data,
          companyName: this.comapny_name,
          industry: content.ff_industry,
          tabFrom: 'Company',
        },
      })
    );
    if (this.util.tabInstance != undefined) {
      this.util.tabInstance.close();
      this.util.tabInstance = window.open(url, '_blank');
    } else {
      this.util.tabInstance = window.open(url, '_blank');
    }
  }

  getCompaniesRoute() {
    this.company_list = [];
    this.companies_data = [];
    this.financialMarketData
      .getCompaniesRedirection(this.company_id)
      .subscribe((res) => {
        this.companies_data = res;
        console.log('companies_data', this.companies_data);
        let categoryFormattedData: any = [];
        this.security_id = this.companies_data[0].securityId;
        this.entity_id = this.companies_data[0].factSetEntityId;
        this.getFinancialPeriodicity(this.company_id);
        this.getBenchmarkPeriodicity(this.company_id);
        this.getanalystTableData(this.company_id);
        this.setdataValuesroute();
        // this.company_list = res;
        // res?.forEach((element: any) => {
        //   categoryFormattedData.push({
        //     id: element.id,
        //     text: element.properName,
        //   });
        //   this.company_list = categoryFormattedData;
        // });
      });
  }

  selectedCompany: any = '';
  selectedStock: any = '';
  selectedcurrecny: any = '';
  selectedcomp_data: any = [];
  oncompanyChanged(data: any) {
    this.selectedcomp_data = [];
    this.dropdownfilling = [];
    if (this.company_list && this.selectedCompany !== data) {
      this.selectedCompany = data;
      if (!this.isPrivateCompanyActive) {
        this.companies_data.map((ele: any, i: any) => {
          if (data == ele.id) {
            this.selectedcomp_data.push({
              id: ele.id,
              entity_id: ele.factSetEntityId,
              company_name: ele.properName,
              currency: ele.reportingCurrency,
              security_id: ele.securityId,
            });
            this.company_id = ele.id;
          }
        });
        this.getanalystTableData(data);
        this.setdataValues(this.selectedcomp_data);
      } else {
        // this.getAdvanceData();
        // const url = this.router.serializeUrl(
        //   this.router.createUrlTree(['financialmarketdata/company'], {
        //     queryParams: {
        //       comp_id: this.selectedCompany,
        //     },
        //   })
        // );

        const selectedPrivateCompany = this.privateCompaniesData.filter(
          (ele: any) => {
            return ele.id == data;
          }
        );

        if (selectedPrivateCompany[0]?.countryCode == 'IND') {
          const url = this.router.serializeUrl(
            this.router.createUrlTree(['/financialmarketdata/company'], {
              relativeTo: this.activatedRoute,
              queryParams: {
                comp_id: selectedPrivateCompany[0]?.id,
                company_name: selectedPrivateCompany[0]?.name,
                currency: selectedPrivateCompany[0]?.reportingCurrency ?? 'USD',
                security_id: this.security_id,
                entity_id: selectedPrivateCompany[0]?.id,
                companyCountry: selectedPrivateCompany[0]?.countryCode,
                entity_type: 'Private',
              },
              queryParamsHandling: 'merge',
            })
          );
          window.open(url, '_self');
        } else {
          const url = this.router.serializeUrl(
            this.router.createUrlTree(['/financialmarketdata/company'], {
              relativeTo: this.activatedRoute,
              queryParams: {
                comp_id: selectedPrivateCompany[0]?.id,
                company_name: selectedPrivateCompany[0]?.name,
                currency: selectedPrivateCompany[0]?.reportingCurrency ?? 'USD',
                security_id: this.security_id,
                entity_id: selectedPrivateCompany[0]?.id,
                companyCountry: selectedPrivateCompany[0]?.countryCode,
                entity_type: 'Private',
              },
              queryParamsHandling: 'merge',
            })
          );
          window.open(url, '_self');
        }
      }
    }
  }

  remove_table_length: any;
  enable_edit: boolean = false;
  enableEdit() {
    this.selectedCompany1 = '';
    this.enable_edit = !this.enable_edit;
  }
  showReset: any = false;
  clickOnReset(type?: any) {
    this.enable_edit = false;

    if (!type) {
      this.total_count_res = 3;
      this.count_res = 0;
      this.loaderService.display(true);
      this.showReset = false;
      const id = localStorage.getItem('id');
      this.isbenchmarkLoading = true;
      this.financialMarketData
        .restBenchmarkData(id, this.entity_id ?? this.company_id)
        .subscribe((res: any) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);
          if (this.isPrivateCompanyActive) {
            this.getbenchmarkPrivatetableData(this.company_id, this.currency);
          } else {
            this.getbenchmarktableData(this.entity_id, this.currency);
          }
        });
      this.selectedCompany1 = '';
    }
  }
  selectedCompany1: any = '';
  tempResDisplay: boolean = false;
  flagLength: any = 1;
  oncompanyChanged1(data: any) {
    this.tempResDisplay = false;

    if (this.company_list && this.selectedCompany1 !== data) {
      this.selectedCompany1 = data;

      if (this.formateSectorData5.length > 7) {
        this.tempResDisplay = true;
        this.auth.companyBenchmarkModal = true;
        this.search_key_values_benchmark = '';
        setTimeout(() => {
          this.selectedCompany1 = null;
        }, 1000);
      } else {
        if (!this.addedCompanies.includes(data)) {
          this.isbenchmarkLoading = true;
          this.total_count_res = 2;
          this.count_res = 0;
          this.loaderService.display(true);
          this.storeRemovedOrAddedComapanies(data, 'ADDED');

          // this.entityID = this.companies_data.filter(
          //   (data: any) => data.id == this.selectedCompany1
          // )[0].factSetEntityId;
          // this.companies_data.map((data: any) => {
          //   if (this.selectedCompany1 == data.id) {
          //   }
          // });
          this.addedCompanies.push(data);
          this.removedCompanies = this.removedCompanies.filter(
            (el: any) => el !== data
          );

          this.financialMarketData
            .AddandRemoveBenchMarktableData(
              this.entity_id,
              this.period_data,
              this.currency,
              this.addedCompanies.toString(),
              this.removedCompanies.toString(),
              this.isPrivateCompanyActive
            )
            .subscribe((res) => {
              ++this.count_res;
              this.tempResDisplay = true;
              this.util.checkCountValue(this.total_count_res, this.count_res);
              this.selectedCompany1 = '';
              this.benchmark_data = [];
              this.periods5 = [];
              this.itemName5 = [];
              this.sectorOject5 = {};
              this.formateSectorData5 = [];
              this.isbenchmarkLoading = false;
              this.benchmark_data = res;
              for (var i = 0; i < this.benchmark_data.length; i++) {
                if (!this.periods5.includes(this.benchmark_data[i].shortName)) {
                  if (this.benchmark_data[i].shortName != 'Closing Price') {
                    this.periods5.push({
                      name: this.benchmark_data[i].shortName,
                      unit: this.benchmark_data[i].unit,
                    });
                  }
                }

                var result = this.periods5.reduce((unique: any, o: any) => {
                  if (
                    !unique.some(
                      (obj: any) => obj.name === o.name && obj.unit === o.unit
                    )
                  ) {
                    unique.push(o);
                  }
                  return unique;
                }, []);
                this.bechmark_header = result;

                if (
                  !this.itemName5.includes(this.benchmark_data[i].shortName)
                ) {
                  if (this.benchmark_data[i].shortName != 'Closing Price') {
                    this.itemName5.push({
                      name: this.benchmark_data[i].shortName,
                      companyName: this.benchmark_data[i].companyName,
                      data: this.benchmark_data[i].data,
                    });
                  }
                }
              }
              // this.periods.sort((a: any, b: any) => +new Date(a) - +new Date(b));
              // this.data_estimate = analystRecommedationBasic;
              this.itemName5.map((val1: any, index1: any) => {
                this.benchmark_data.map((val2: any, index2: any) => {
                  if (val1.name == val2.shortName && val1.data == val2.data) {
                    var index = this.formateSectorData5.findIndex(
                      (data: any) => data[val1['name']] == val2.shortName
                    );
                    if (index > -1) {
                    } else {
                      this.sectorOject5 = {};
                    }
                    const newKey = val1['name'];
                    this.sectorOject5[newKey] = val1.data;
                    this.sectorOject5 = {
                      ...this.sectorOject5,
                      flag: val2.dataFlag,
                      description: val2.companyName,
                      id: val2.companyId,
                      infoVal: val2.periodType + ' ' + val2.date,
                      entityId: val2.entityId,
                    };
                    this.formateSectorData5 = [
                      ...this.formateSectorData5,
                      this.sectorOject5,
                    ];
                    this.formateSectorData5 = this.formateSectorData5.reduce(
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
            });
        }
        this.enable_edit = false;
      }
    }
  }
  benchMarkPrivateCompanyError: any = false;
  onBenchmarkPrivateCompanyChange(data: any) {
    this.tempResDisplay = false;
    if (this.company_list && this.selectedCompany1 !== data) {
      this.selectedCompany1 = data;

      if (this.formateSectorData5.length > 7) {
        this.tempResDisplay = true;
        this.auth.companyBenchmarkModal = true;
        this.search_key_values_benchmark = '';
        setTimeout(() => {
          this.selectedCompany1 = null;
        }, 1000);
      } else {
        // this.entityID = this.companies_data.filter(
        //   (data: any) => data.id == this.selectedCompany1
        // )[0].factSetEntityId;
        // this.companies_data.map((data: any) => {
        //   if (this.selectedCompany1 == data.id) {
        //   }
        // });
        if (!this.addedCompanies.includes(data)) {
          this.isbenchmarkLoading = true;
          this.total_count_res = 2;
          this.count_res = 0;
          this.loaderService.display(true);
          this.storeRemovedOrAddedComapanies(data, 'ADDED');

          this.addedCompanies.push(data);
          this.removedCompanies = this.removedCompanies.filter(
            (el: any) => el !== data
          );
          this.financialMarketData
            .AddandRemovePrivateBenchMarktableData(
              this.entity_id ?? this.company_id,
              this.period_data,
              this.currency,
              this.addedCompanies.toString(),
              this.removedCompanies.toString()
            )
            .subscribe(
              (res) => {
                ++this.count_res;
                this.tempResDisplay = true;
                this.util.checkCountValue(this.total_count_res, this.count_res);
                this.selectedCompany1 = '';
                this.benchmark_data = [];
                this.periods5 = [];
                this.itemName5 = [];
                this.sectorOject5 = {};
                this.formateSectorData5 = [];
                this.isbenchmarkLoading = false;
                this.benchmark_data = res;
                for (var i = 0; i < this.benchmark_data.length; i++) {
                  if (
                    !this.periods5.includes(this.benchmark_data[i].shortName)
                  ) {
                    if (this.benchmark_data[i].shortName != 'Closing Price') {
                      this.periods5.push({
                        name: this.benchmark_data[i].shortName,
                        unit: this.benchmark_data[i].unit,
                      });
                    }
                  }

                  var result = this.periods5.reduce((unique: any, o: any) => {
                    if (
                      !unique.some(
                        (obj: any) => obj.name === o.name && obj.unit === o.unit
                      )
                    ) {
                      unique.push(o);
                    }
                    return unique;
                  }, []);
                  this.bechmark_header = result;

                  if (
                    !this.itemName5.includes(this.benchmark_data[i].shortName)
                  ) {
                    if (this.benchmark_data[i].shortName != 'Closing Price') {
                      this.itemName5.push({
                        name: this.benchmark_data[i].shortName,
                        companyName: this.benchmark_data[i].companyName,
                        data: this.benchmark_data[i].data,
                      });
                    }
                  }
                }
                // this.periods.sort((a: any, b: any) => +new Date(a) - +new Date(b));
                // this.data_estimate = analystRecommedationBasic;
                this.itemName5.map((val1: any, index1: any) => {
                  this.benchmark_data.map((val2: any, index2: any) => {
                    if (val1.name == val2.shortName && val1.data == val2.data) {
                      var index = this.formateSectorData5.findIndex(
                        (data: any) => data[val1['name']] == val2.shortName
                      );
                      if (index > -1) {
                      } else {
                        this.sectorOject5 = {};
                      }
                      const newKey = val1['name'];
                      this.sectorOject5[newKey] = val1.data;
                      this.sectorOject5 = {
                        ...this.sectorOject5,
                        flag: val2.dataFlag,
                        description: val2.companyName,
                        id: val2.companyId,
                        infoVal: val2.periodType + ' ' + val2.date,
                        entityId: val2.entityId,
                      };
                      this.formateSectorData5 = [
                        ...this.formateSectorData5,
                        this.sectorOject5,
                      ];
                      this.formateSectorData5 = this.formateSectorData5.reduce(
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
              },
              (err) => {
                console.log(err);
              }
            );
        }
        this.enable_edit = false;
      }
    }
  }

  handleOpenNewWindow(e: any) {
    window.open(
      `/financialmarketdata/financialtab?comp_id=${this.companydata.id}&currency=${this.companydata.currency}&period=${this.companydata.period}&cname=${this.company_info.properName}&exchange=${this.company_info.exchangeCode}&cticker=${this.company_info.companyTicker}&inName=${this.company_info.ticsIndustryName}&country=${this.company_info.countryName}&sectorCode=${this.company_info.ticsSectorCode}&indsutryCode=${this.company_info.ticsIndustryCode}&countryId=${this.company_info.countryId}&countryCode=${this.company_info.countryCode}&industry=${this.company_info.ff_industry}`
    );
  }

  handleOpenNewWindowPrivateComp(e: any) {
    window.open(
      `/financialmarketdata/financialtab?comp_id=${
        this.company_info.cin ?? this.company_info.id
      }&currency=${this.selectedcurrecny}&period=${'yearly'}&cname=${
        this.company_info.name
      }&exchange=${this.company_info.exchangeCode}&cticker=${
        this.company_info.companyTicker
      }&inName=${this.company_info.industryName}&country=${
        this.company_info.domicileCountryName
      }&companyType=Private`
    );
  }
  redirectToCompany(e: any) {
    let filteredData = this.benchmark_data.filter(
      (data: any) => data.companyId == e.id
    );

    if (e.id === e.entityId) {
      if (e.id) {
        const url = this.router.serializeUrl(
          this.router.createUrlTree(['financialmarketdata/company'], {
            queryParams: {
              comp_id: filteredData[0].companyId,
              company_name: filteredData[0].companyName,
              currency: filteredData[0].currency,
              entity_id: filteredData[0].entity_id,
              companyCountry: this.company_country,
              entity_type: 'Private',
            },
          })
        );
        window.open(url, '_blank');
      }
    } else {
      const url = this.router.serializeUrl(
        this.router.createUrlTree(['financialmarketdata/company'], {
          queryParams: {
            comp_id: filteredData[0].companyId,
            company_name: filteredData[0].companyName,
            currency: '',
            entity_id: e.entityId,
            tabName: 'company',
          },
        })
      );
      window.open(url, '_blank');
    }
  }

  removedCompanies: any = [];
  addedCompanies: any = [];
  handlecompanyCode(e: any) {
    var company = e;
    this.total_count_res = 2;
    this.showReset = true;
    this.isbenchmarkLoading = true;
    this.count_res = 0;
    this.loaderService.display(true);
    this.storeRemovedOrAddedComapanies(e.entityId, 'REMOVED');

    this.addedCompanies = this.addedCompanies.filter(
      (el: any) => el !== e.entityId
    );
    this.removedCompanies.push(e.entityId);
    // this.entityID = this.benchmark_data.filter(
    //   (data: any) => data.companyId == company
    // )[0].entityId;
    this.financialMarketData
      .AddandRemoveBenchMarktableData(
        this.entity_id,
        this.period_data,
        this.currency,
        this.addedCompanies.toString(),
        this.removedCompanies.toString(),
        this.isPrivateCompanyActive
      )
      .subscribe((res) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);

        this.benchmark_data = [];
        this.periods5 = [];
        this.itemName5 = [];
        this.sectorOject5 = {};
        this.formateSectorData5 = [];

        this.benchmark_data = res;
        for (var i = 0; i < this.benchmark_data.length; i++) {
          if (!this.periods5.includes(this.benchmark_data[i].shortName)) {
            if (this.benchmark_data[i].shortName != 'Closing Price') {
              this.periods5.push({
                name: this.benchmark_data[i].shortName,
                unit: this.benchmark_data[i].unit,
              });
            }
          }

          var result = this.periods5.reduce((unique: any, o: any) => {
            if (
              !unique.some(
                (obj: any) => obj.name === o.name && obj.unit === o.unit
              )
            ) {
              unique.push(o);
            }
            return unique;
          }, []);
          this.bechmark_header = result;

          if (!this.itemName5.includes(this.benchmark_data[i].shortName)) {
            if (this.benchmark_data[i].shortName != 'Closing Price') {
              this.itemName5.push({
                name: this.benchmark_data[i].shortName,
                companyName: this.benchmark_data[i].companyName,
                data: this.benchmark_data[i].data,
              });
            }
          }
        }
        // this.periods.sort((a: any, b: any) => +new Date(a) - +new Date(b));
        // this.data_estimate = analystRecommedationBasic;
        this.itemName5.map((val1: any, index1: any) => {
          this.benchmark_data.map((val2: any, index2: any) => {
            if (val1.name == val2.shortName && val1.data == val2.data) {
              var index = this.formateSectorData5.findIndex(
                (data: any) => data[val1['name']] == val2.shortName
              );
              if (index > -1) {
              } else {
                this.sectorOject5 = {};
              }
              const newKey = val1['name'];
              this.sectorOject5[newKey] = val1.data;
              this.sectorOject5 = {
                ...this.sectorOject5,
                flag: val2.dataFlag,
                description: val2.companyName,
                id: val2.companyId,
                infoVal: val2.periodType + ' ' + val2.date,
                entityId: val2.entityId,
              };
              this.formateSectorData5 = [
                ...this.formateSectorData5,
                this.sectorOject5,
              ];
              this.formateSectorData5 = this.formateSectorData5.reduce(
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
      });
    // this.enable_edit = false;
    this.isbenchmarkLoading = false;
  }

  handlePrivatecompanyCode(e: any) {
    var company = e;
    this.total_count_res = 2;
    this.showReset = true;
    this.isbenchmarkLoading = true;
    this.count_res = 0;
    this.loaderService.display(true);
    this.storeRemovedOrAddedComapanies(e.entityId, 'REMOVED');

    this.addedCompanies = this.addedCompanies.filter(
      (el: any) => el !== e.entityId
    );
    this.removedCompanies.push(e.entityId);
    // this.entityID = this.benchmark_data.filter(
    //   (data: any) => data.companyId == company
    // )[0].entityId;
    this.financialMarketData
      .AddandRemovePrivateBenchMarktableData(
        this.entity_id ?? this.company_id,
        this.period_data,
        this.currency,
        this.addedCompanies.toString(),
        this.removedCompanies.toString()
      )
      .subscribe((res) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);

        this.benchmark_data = [];
        this.periods5 = [];
        this.itemName5 = [];
        this.sectorOject5 = {};
        this.formateSectorData5 = [];

        this.benchmark_data = res;
        for (var i = 0; i < this.benchmark_data.length; i++) {
          if (!this.periods5.includes(this.benchmark_data[i].shortName)) {
            if (this.benchmark_data[i].shortName != 'Closing Price') {
              this.periods5.push({
                name: this.benchmark_data[i].shortName,
                unit: this.benchmark_data[i].unit,
              });
            }
          }

          var result = this.periods5.reduce((unique: any, o: any) => {
            if (
              !unique.some(
                (obj: any) => obj.name === o.name && obj.unit === o.unit
              )
            ) {
              unique.push(o);
            }
            return unique;
          }, []);
          this.bechmark_header = result;

          if (!this.itemName5.includes(this.benchmark_data[i].shortName)) {
            if (this.benchmark_data[i].shortName != 'Closing Price') {
              this.itemName5.push({
                name: this.benchmark_data[i].shortName,
                companyName: this.benchmark_data[i].companyName,
                data: this.benchmark_data[i].data,
              });
            }
          }
        }
        // this.periods.sort((a: any, b: any) => +new Date(a) - +new Date(b));
        // this.data_estimate = analystRecommedationBasic;
        this.itemName5.map((val1: any, index1: any) => {
          this.benchmark_data.map((val2: any, index2: any) => {
            if (val1.name == val2.shortName && val1.data == val2.data) {
              var index = this.formateSectorData5.findIndex(
                (data: any) => data[val1['name']] == val2.shortName
              );
              if (index > -1) {
              } else {
                this.sectorOject5 = {};
              }
              const newKey = val1['name'];
              this.sectorOject5[newKey] = val1.data;
              this.sectorOject5 = {
                ...this.sectorOject5,
                flag: val2.dataFlag,
                description: val2.companyName,
                id: val2.companyId,
                infoVal: val2.periodType + ' ' + val2.date,
                entityId: val2.entityId,
              };
              this.formateSectorData5 = [
                ...this.formateSectorData5,
                this.sectorOject5,
              ];
              this.formateSectorData5 = this.formateSectorData5.reduce(
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
      });
    // this.enable_edit = false;
    this.isbenchmarkLoading = false;
  }

  storeRemovedOrAddedComapanies(benchMarkCompId: any, status: any) {
    const id = localStorage.getItem('id');
    var body = {
      userId: id,
      companyId: this.company_info.entityId ?? this.company_id,
      benchmarkCompany: benchMarkCompId,
      status: status,
    };
    this.financialMarketData
      .getstoredBenchmarkForCompany(body)
      .subscribe((res) => {
        ++this.count_res;
        //
        this.util.checkCountValue(this.total_count_res, this.count_res);
        console.info(res);
      });
  }

  pevcCurrency: any = 'USD';
  oncurrencyChanged(data: any) {
    if (this.currecny_list && this.selectedcurrecny !== data) {
      if (this.auth.showPEVCTabs) {
        this.loaderService.display(true);
        this.total_count_res = 12;
        this.count_res = 0;
        this.selectedcurrecny = data;
        this.currency = data;
        this.isbenchmarkLoading = true;
        this.getCompanyInfo(this.company_id, this.currency);
        this.getFinancialData(this.company_id, this.currency);
        this.getbenchmarktableData(this.entity_id, this.currency);
        this.getCompanyIndexes(this.company_id);
        this.getStockChartData(this.company_id, this.currency);
        this.getSegmentData(
          this.company_id,
          this.comapny_name,
          this.selectedcurrecny
        );
        this.pevcCurrency = data;
        this.getNumberOfAssetsUnderMng(this.pevcEntityId);
        this.getAvgFundSize(this.pevcEntityId);
        this.getPEVCBenchmarkAnalysis(this.pevcEntityId);
        this.pevcFirmTableData.title[2].label = `AUM (${this.pevcCurrency}  M)`;
        this.pevcFirmTableData.title[3].label = `Average Fund Size (${this.pevcCurrency}  M)`;
        this.directInvestmentsTableData.title[7].label = `Total Investment (${this.pevcCurrency} Million)`;
        this.directInvestmentsTableData.title[8].label = `Total Participated Round Funding Amount (${this.pevcCurrency} Million)`;
        this.getPEVCDirectInvestments(this.pevcEntityId, '1');
        this.directInvestmentsChildTableData.title[7].label = `Investment in Round (${this.pevcCurrency} Million)`;
        this.directInvestmentsChildTableData.title[8].label = `Round Funding Amount (${this.pevcCurrency} Million)`;
        this.getPEVCFundsInvestments(this.pevcEntityId, '1');
        this.fundOfFundsInvestmetns.title[2].label = `Amount Invested (${this.pevcCurrency} Million)`;
        this.fundOfFundsInvestmetns.title[6].label = `Amount Raised (${this.pevcCurrency} Million)`;
        this.getPEVCFirmStructure(this.pevcEntityId, '1');
        this.firmStructureTableData.title[4].label = `Amount Raised (${this.pevcCurrency} Million)`;
      } else {
        this.selectedcurrecny = data;
        this.currency = data;
        this.isbenchmarkLoading = true;

        if (!this.isPrivateCompanyActive) {
          this.loaderService.display(true);
          this.total_count_res = 6;
          this.count_res = 0;

          this.getCompanyInfo(this.company_id, this.currency);
          this.getFinancialData(this.company_id, this.currency);
          this.getbenchmarktableData(this.entity_id, this.currency);
          this.getCompanyIndexes(this.company_id);
          this.getStockChartData(this.company_id, this.currency);
          this.getSegmentData(
            this.company_id,
            this.comapny_name,
            this.selectedcurrecny
          );
        } else {
          if (this.company_country === 'IND') {
            this.count_res = 0;
            this.total_count_res = 3;
            this.loaderService.display(true);

            // this.getIndianPrivateCompanyInfo(this.company_id, this.currency);
            this.getbenchmarkPrivatetableData(this.company_id, this.currency);
            this.getPrivateComapnyFinancialData(this.company_id, this.currency);
          } else {
            this.count_res = 0;
            this.total_count_res = 3;
            this.loaderService.display(true);

            this.getFinancialData(this.company_id, this.currency);
            this.getbenchmarktableData(this.company_id, this.currency);
          }
        }
      }
    }
    this.defaultIncomeStatement = [];
    this.defaultBalanceSheet = [];
    this.defaultCashFlow = [];
    this.defaultRatio = [];
  }

  selectedexch_data: any = [];
  onstcokChanged(data: any) {
    this.selectedcomp_data = [];
    if (this.stock_list && this.selectedStock !== data) {
      this.selectedStock = data;
      this.stock_list.map((ele: any, i: any) => {
        if (data == ele.id) {
          this.selectedcomp_data.push({
            id: ele.id,
            entity_id: ele.factSetEntityId,
            company_name: ele.name,
            currency: ele.reportingCurrency,
            security_id: ele.securityId,
          });
        }
      });
      this.setdataValues(this.selectedcomp_data, 'stock_change');
    }
  }

  selected_beta: any = [];
  valueChangedyearly(data: any) {
    this.selected_beta = [];
    if (this.beta_info && this.selectedYearly !== data) {
      this.selectedYearly = data;
    }
    this.beta_info.map((ele: any, i: any) => {
      if (data == i) {
        this.selected_beta.push({
          data: ele,
        });
      }
    });
    this.beta_value = this.selected_beta[0].data;
  }

  valueChangedperiod(data: any) {
    if (this.selectYearperiod && this.selectedperiod !== data) {
      this.loaderService.display(true);
      this.total_count_res = 1;
      this.count_res = 0;
      this.selectedperiod = data;
      this.getBetaInfo(
        this.company_id,
        this.currency,
        this.selectedindex,
        this.selectedperiod
      );
      // this.setdataValues(this.selectedcomp_data);
    }
  }

  setdataValues(data: any, type?: any) {
    this.count_res = 0;
    this.total_count_res = 24;
    this.loaderService.display(true);
    this.entity_id = data[0]?.entity_id;
    this.company_id = data[0]?.id;
    this.comapny_name = data[0]?.company_name;
    this.currency = data[0]?.currency;
    this.security_id = data[0]?.security_id;
    this.defaultIncomeStatement = [];
    this.defaultBalanceSheet = [];
    this.defaultCashFlow = [];
    this.defaultRatio = [];
    this.isbenchmarkLoading = true;

    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/financialmarketdata/company'], {
        relativeTo: this.activatedRoute,
        queryParams: {
          comp_id: this.company_id,
          company_name: this.comapny_name,
          currency: this.currency,
          security_id: this.security_id,
          entity_id: this.entity_id,
          tabName: 'company',
        },
        queryParamsHandling: 'merge',
      })
    );
    window.open(url, '_self');
    am4core.disposeAllCharts();
    this.getCompanyInfo(this.company_id, this.currency, type);
    this.getCompanyIndexes(this.company_id);
    this.getStockExchData(this.company_id);
    this.getFinancialData(this.company_id, this.currency);
    this.getSegmentData(
      this.company_id,
      this.comapny_name,
      this.selectedcurrecny
    );
    this.getDebtProfile(this.currency, this.entity_id);
    this.getDebtcompositionData(this.currency, this.entity_id);
    this.getMaturityData(this.currency, this.entity_id);
    this.getOwnershipData(this.security_id);
    this.getEstimateChartData(this.company_id);
    this.gettotalRecomChartData(this.company_id);
    this.getOwnershipdetaildata(this.security_id);
    this.getpromoroownershipData(this.security_id);
    this.getinstitueownershipData(this.security_id);
    this.getEstimateData(this.company_id);
    this.getEventsData(this.entity_id);
    this.getCompanyFileData(this.company_id, this.entity_id, '');
    this.getbenchmarktableData(this.entity_id, this.currency);
    this.getStockChartData(this.company_id, this.currency);
    this.getmanagementData(this.comapny_name, this.entity_id);
    this.getinsiderTransaction(this.company_id, this.security_id);
  }

  default_data: any = [];
  entity_id: any = '';
  company_id: any = '';
  comapny_name: any = '';
  currency: any = '';
  security_id: any = '';
  count_res: any = 0;
  total_count_res: any = '';
  index_value: any = '';
  getDefaultCompany() {
    this.count_res = 0;
    this.total_count_res = 25;
    this.loaderService.display(true);
    this.financialMarketData
      .getDefaultComapny(this.company_url)
      .subscribe((res) => {
        ++this.count_res;
        this.default_data = res;
        this.entity_id = this.default_data.factSetEntityId;
        this.company_id = this.default_data.id;
        this.comapny_name = this.default_data.properName;
        this.currency = this.default_data.reportingCurrency;
        this.security_id = this.default_data.securityId;
        this.isbenchmarkLoading = true;
        this.util.checkCountValue(this.total_count_res, this.count_res);
        this.getFinancialPeriodicity(this.company_id);
        this.getBenchmarkPeriodicity(this.company_id);
        this.getCompanyIndexes(this.company_id);
        this.getCompanyInfo(this.company_id, this.currency);
        // this.getBetaInfo(this.company_id, this.currency);
        this.getStockExchData(this.company_id);
        this.getFinancialData(this.company_id, this.currency);
        this.getSegmentData(
          this.company_id,
          this.comapny_name,
          this.selectedcurrecny
        );
        this.getDebtcompositionData(this.currency, this.entity_id);
        this.getDebtProfile(this.currency, this.entity_id);
        this.getMaturityData(this.currency, this.entity_id);

        this.getOwnershipData(this.security_id);
        this.getEstimateChartData(this.company_id);
        this.gettotalRecomChartData(this.company_id);
        this.getOwnershipdetaildata(this.security_id);
        this.getpromoroownershipData(this.security_id);
        this.getinstitueownershipData(this.security_id);
        this.getEstimateData(this.company_id);
        this.getanalystTableData(this.company_id);
        this.getEventsData(this.entity_id);
        this.getCompanyFileData(this.company_id, this.entity_id, '');
        this.getbenchmarktableData(this.entity_id, this.currency);
        this.getBenchmarkCompanies(this.company_id);
        // this.getRelativePriceData(this.company_id, this.currency);
        this.getStockChartData(this.company_id, this.currency);
        this.getinsiderTransaction(this.company_id, this.security_id);
        this.getmanagementData(this.comapny_name, this.entity_id);
        // this.getmanagementGuidancePerformance(this.company_id);
      });
  }

  relative_data_name: any = '';
  selectYearindex: any = [];
  index_data_relative: any = [];
  getCompanyIndexes(id: any) {
    this.financialMarketData.getBetaList(id).subscribe((res) => {
      this.index_data_relative = res;
      let categoryFormattedData: any = [];
      // this.company_list = res;
      res?.forEach((element: any) => {
        categoryFormattedData.push({
          id: element.id,
          text: element.name,
        });
        this.selectYearindex = categoryFormattedData;
      });
      this.selectedindex = res[0]?.id;
      this.relative_data_name = res[0]?.name;
      this.getRelativePriceData(
        this.company_id,
        this.currency,
        this.selectedindex
      );
      // this.selectedYearly = undefined;
      this.getBetaInfo(
        this.company_id,
        this.currency,
        this.selectedindex,
        this.selectedperiod
      );
    });
  }

  mangementGuidanceTitles = [
    {
      label: 'High',
      key: 'entityProperName',
      shorting: false,
    },
    {
      label: 'Low',
      key: 'effective_date',
      shorting: false,
    },
    {
      label: 'Actual',
      key: 'buySell',
      shorting: false,
      align: 'left',
    },
    {
      label: 'Deviation',
      key: 'buySell',
      shorting: false,
      align: 'left',
    },
  ];
  managementGuidanceData: any = {
    title: this.getClone(this.mangementGuidanceTitles),
    value: [],
  };
  set_period_management: any = 'yearly';
  // getmanagementGuidancePerformance(id: any) {
  //   this.financialMarketData
  //     .getmanagementGuidancePerformance(this.set_period_management, id)
  //     .subscribe(
  //       (res) => {
  //         this.managementGuidanceData.value = res;
  //       },
  //       (error) => {
  //         console.error(error);
  //       }
  //     );
  // }
  insiderTitles: any = [
    {
      label: 'Shareholder',
      key: 'entityProperName',
      shorting: false,
    },
    {
      label: 'Date',
      key: 'effective_date',
      shorting: false,
    },
    {
      label: 'Buy/Sell',
      key: 'buySell',
      shorting: false,
      align: 'left',
    },
    {
      label: 'No. of Shares',
      key: 'tranShares',
      shorting: false,
      align: 'right',
    },
    {
      label: 'Value(USD)',
      key: 'tranValue',
      shorting: false,
      align: 'right',
    },
    {
      label: 'Market',
      key: 'market',
      shorting: false,
      align: 'left',
    },
    {
      label: 'Shares Owned',
      key: 'sharesOwned',
      shorting: false,
      align: 'right',
    },
    {
      label: '% Holding',
      key: 'percentHolding',
      shorting: false,
      align: 'right',
      formattedNum: true,
    },
  ];
  insiderData: any = {
    title: this.getClone(this.insiderTitles),
    value: [],
  };
  insiderDataDefault: any = {
    title: this.getClone(this.insiderTitles),
    value: [],
  };
  getinsiderTransaction(id1: any, id2: any) {
    this.insiderData.value = [];
    this.financialMarketData
      .getinsiderTransaction(id1, id2, this.currency)
      .subscribe(
        (res) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);
          this.insiderData.value = res;
          this.insiderDataDefault.value = res.splice(0, 6);
        },
        (error) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);
          console.error(error);
        }
      );
  }

  getClone(obj: any) {
    let _obj: any;
    _obj = JSON.parse(JSON.stringify(obj));
    return _obj;
  }

  getBenchmarkCompanies(id: any) {
    this.financialMarketData.getbenchmarkcompany(id).subscribe((res) => {});
  }

  selectedYearly: any = 0;
  selectYearData: any = [
    {
      id: 0,
      text: '1 Yr',
    },
    {
      id: 1,
      text: '2 Yr',
    },
    {
      id: 2,
      text: '3 Yr',
    },
    {
      id: 3,
      text: '4 Yr',
    },
    {
      id: 4,
      text: '5 Yr',
    },
  ];

  selectedperiod: any = 'Daily';
  selectYearperiod: any = [
    {
      id: 'Daily',
      text: 'Daily',
    },
    {
      id: 'Weekly',
      text: 'Weekly',
    },
  ];

  selectedindex: any;

  valueChangedindex(data: any) {
    if (this.selectYearindex && this.selectedindex !== data) {
      this.loaderService.display(true);
      this.count_res = 0;
      this.total_count_res = 2;

      this.selectedindex = data;
      // this.relative_data = this.selectYearindex.filter;
      this.relative_data_name = this.index_data_relative.filter(
        (data1: any) => data1.id == this.selectedindex
      )[0].name;
      this.getRelativePriceData(
        this.company_id,
        this.currency,
        this.selectedindex
      );
      this.getBetaInfo(
        this.company_id,
        this.currency,
        this.selectedindex,
        this.selectedperiod
      );
    }
  }

  beta_info: any = [];
  country_val: any = '';
  getBetaInfo(id: any, currency: any, index: any, period: any) {
    this.beta_info = [];
    this.financialMarketData.getbetainfo(id, currency, index, period).subscribe(
      (res) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);
        this.beta_info = res['data'];
        // this.selectedYearly = undefined;
        this.valueChangedyearly(this.selectedYearly);
      },
      (err) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);
      }
    );
  }

  stock_data: any = [];
  stock_list: any = [];
  beta_value: any = '';
  getStockExchData(id: any) {
    this.stock_list = [];
    this.financialMarketData.getExchangeData(id).subscribe(
      (res) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);
        this.stock_list = res;
        let categoryFormattedData: any = [];
        // this.company_list = res;

        res?.forEach((element: any) => {
          categoryFormattedData.push({
            id: element.id,
            text: element.exchangeName,
          });
          this.stock_data = categoryFormattedData;

          // this.beta_value = this.stock_data[0].data;
        });
      },
      (err) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);
      }
    );
  }

  date_type: any;
  dateChange(type: any) {
    this.date_type = type;
    // this.getAllBondsDataHandler(this.date_type);
    let endDate =
      this.stock_history_data[this.stock_history_data.length - 1]?.date;
    this.util.endDate = new Date(endDate);
    if (type) {
      this.util.setDateHandler(type);

      let dates1W: any = this.stock_history_data.filter((el: any) => {
        return new Date(el.date) > this.util.startDate ? el : '';
      });

      this.stock_chartData = [];
      dates1W.forEach((el: any) => {
        this.stock_chartData.push({
          Date: el.date,
          Open: el.open?.toFixed(2),
          High: el.high,
          Low: el.low,
          // Close: el.close.toFixed(0),
          Close: this.util.standardFormat(Number(el.close), 2, ''),
          Volume: el.volume,
        });
      });

      this.stockChart();
    }
  }

  stockChart() {
    am4core.useTheme(am4themes_animated);
    let chart = am4core.create('chartdiv5', am4charts.XYChart);
    // $(document).ready(function () {
    //   $('g[aria-labelledby]').hide();
    // });
    am4core.options.commercialLicense = true;
    chart.leftAxesContainer.layout = 'vertical';
    chart.data = this.stock_chartData;

    chart.events.on('beforedatavalidated', function (ev: any) {
      // check if there's data
      if (ev.target.data.length === 0) {
        let indicator = chart?.chartContainer?.createChild(am4core.Container);
        let indicatorLabel = indicator.createChild(am4core.Label);
        indicatorLabel.text = 'No Data Available';
        indicator.isMeasured = false;
        indicator.x = 310;
        indicator.y = 100;
        indicatorLabel.fontSize = 12;
        indicatorLabel.fill = am4core.color('#fff');
        chart.leftAxesContainer.layout = 'horizontal';
        let dateAxis: any = chart.xAxes.push(new am4charts.DateAxis());
        dateAxis.renderer.labels.template.fill = am4core.color('#ffc000');
        dateAxis.renderer.line.stroke = am4core.color('#ffc000');
        dateAxis.renderer.line.strokeWidth = 2;
        dateAxis.renderer.line.strokeOpacity = 1;
        let valueAxis: any = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.renderer.labels.template.fill = am4core.color('#ffc000');
        valueAxis.renderer.line.stroke = am4core.color('#ffc000');
        valueAxis.renderer.line.strokeWidth = 2;
        valueAxis.renderer.line.strokeOpacity = 1;
      }
    });

    chart.dateFormatter.dateFormat = 'dd-MMM-yyyy';
    chart.bottomAxesContainer.reverseOrder = true;
    // let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    let dateAxis: any = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.dateFormats.setKey('day', 'dd-MM-yy');
    dateAxis.dateFormats.setKey('month', 'MMM yyyy');
    dateAxis.dateFormats.setKey('week', 'dd-MM-yy');

    dateAxis.periodChangeDateFormats.setKey('day', 'dd-MM-yy');
    dateAxis.periodChangeDateFormats.setKey('month', 'MMM yyyy');
    dateAxis.periodChangeDateFormats.setKey('week', 'dd-MM-yy');
    dateAxis.baseInterval = {
      timeUnit: 'day',
      count: 1,
    };
    dateAxis.renderer.grid.template.location = 1;
    dateAxis.renderer.ticks.template.length = 8;
    dateAxis.renderer.ticks.template.strokeOpacity = 0.1;
    dateAxis.renderer.minWidth = 35;
    dateAxis.renderer.grid.template.disabled = true;
    dateAxis.renderer.ticks.template.disabled = false;
    dateAxis.renderer.ticks.template.strokeOpacity = 0.2;
    dateAxis.renderer.minLabelPosition = 0.01;
    dateAxis.renderer.maxLabelPosition = 0.99;
    dateAxis.keepSelection = true;
    // dateAxis.minHeight = 30;
    dateAxis.renderer.line.strokeWidth = 2;
    dateAxis.renderer.labels.template.fill = am4core.color('#ffc000');
    dateAxis.renderer.labels.template.fontSize = 12;
    dateAxis.tooltip.background.cornerRadius = 3;
    dateAxis.tooltip.label.fontSize = 9;
    dateAxis.tooltip.label.padding(5, 5, 5, 5);
    dateAxis.renderer.minGridDistance = 80;
    // dateAxis.groupData = true;
    // dateAxis.minZoomCount = 5;
    // dateAxis.renderer.line.strokeWidth = 2;
    // dateAxis.renderer.line.strokeOpacity = 1;

    var valueAxis: any = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.tooltip.disabled = true;
    valueAxis.zIndex = 1;
    valueAxis.renderer.baseGrid.disabled = true;
    // height of axis
    // valueAxis.height = am4core.percent(65);

    valueAxis.renderer.gridContainer.background.fill = am4core.color('#000000');
    valueAxis.renderer.gridContainer.background.fillOpacity = 0.05;
    // valueAxis.renderer.inside = true;
    // valueAxis.renderer.labels.template.verticalCenter = 'bottom';
    valueAxis.renderer.labels.template.padding(2, 2, 2, 2);
    valueAxis.renderer.labels.template.fill = am4core.color('#ffc000');
    valueAxis.renderer.labels.template.fontSize = 12;
    // valueAxis.fill.template.setAll;
    //valueAxis.renderer.maxLabelPosition = 0.95;
    // valueAxis.renderer.line.strokeWidth = 2;
    // valueAxis.renderer.line.strokeOpacity = 1;
    // valueAxis.renderer.fontSize = '0.8em';

    valueAxis.renderer.labels.template.adapter.add(
      'text',
      (label: any, target: any) => {
        if (target.dataItem) {
          // console.log(target.dataItem.value);
          return this.util.standardFormat(Number(target.dataItem.value), 2, '');
        }
      }
    );

    let series: any = chart.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = 'Date';
    series.dataFields.valueY = 'Close';
    // series.tooltipText = '{valueY.value}';
    series.yAxis = valueAxis;
    series.name = 'MSFT: Value';
    series.defaultState.transitionDuration = 0;
    series.tooltipText = 'Stock Price: [bold]{valueY}[/]';
    series.fillOpacity = 0.3;
    series.tooltip.getFillFromObject = false;
    series.tooltip.background.cornerRadius = 3;
    series.tooltip.label.fontSize = 9;
    series.tooltip.label.padding(5, 5, 5, 5);
    series.tooltip.pointerOrientation = 'vertical';
    series.tooltip.background.fill = am4core.color('#000000');
    let fillModifier = new am4core.LinearGradientModifier();
    fillModifier.opacities = [1, 0];
    fillModifier.offsets = [0, 0.6];
    fillModifier.gradient.rotation = 90;
    series.segments.template.fillModifier = fillModifier;

    let valueAxis2: any = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis2.tooltip.disabled = true;
    // height of axis
    valueAxis2.height = am4core.percent(60);
    valueAxis2.zIndex = 3;
    // this makes gap between panels
    valueAxis2.marginTop = 35;
    valueAxis2.renderer.baseGrid.disabled = true;
    // valueAxis2.renderer.inside = true;
    valueAxis2.renderer.labels.template.verticalCenter = 'bottom';
    valueAxis2.renderer.labels.template.padding(2, 2, 2, 2);
    //valueAxis.renderer.maxLabelPosition = 0.95;
    valueAxis2.renderer.fontSize = '10px';
    valueAxis2.renderer.labels.template.fill = am4core.color('#ffc000');
    valueAxis2.renderer.labels.template.fontSize = 12;

    valueAxis2.renderer.labels.template.adapter.add(
      'text',
      (label: any, target: any) => {
        if (target.dataItem) {
          if (Number(target.dataItem.value) > 1000) {
            return this.util.standardFormat(
              Number(target.dataItem.value),
              1,
              ''
            );
          }
          return this.util.standardFormat(Number(target.dataItem.value), 2, '');
        }
      }
    );

    valueAxis2.renderer.gridContainer.background.fill =
      am4core.color('#000000');
    valueAxis2.renderer.gridContainer.background.fillOpacity = 0.05;
    valueAxis2.renderer.minGridDistance = 15;

    let series2: any = chart.series.push(new am4charts.ColumnSeries());
    series2.dataFields.dateX = 'Date';
    series2.dataFields.valueY = 'Volume';
    series2.yAxis = valueAxis2;
    series2.defaultState.transitionDuration = 0;
    series2.tooltipText = 'Volume: [bold]{valueY}[/]';
    series2.fillOpacity = 0.3;
    series2.tooltip.getFillFromObject = false;
    series2.tooltip.background.cornerRadius = 3;
    series2.tooltip.label.fontSize = 9;
    series2.tooltip.label.padding(5, 5, 5, 5);
    series2.tooltip.pointerOrientation = 'vertical';
    series2.tooltip.background.fill = am4core.color('#000000');
    series2.name = 'MSFT: Volume';
    // volume should be summed
    // series2.groupFields.valueY = 'sum';
    series2.defaultState.transitionDuration = 0;

    series2.adapter.add('tooltipHTML', (html: any, target: any) => {
      let data;

      if (target.tooltipDataItem) {
        data = target.tooltipDataItem.values.valueY.value;

        if (target.dataItem.value > 1000) {
          data = this.util.standardFormat(data, 1, '');
        } else {
          data = this.util.standardFormat(data, 2, '');
        }

        let customHtml =
          '<span style="text-align: center">Volume : ' + data + '</span>';

        return customHtml;
      }
      return html;
    });

    chart.cursor = new am4charts.XYCursor();
    // Add range selector
    // const selector: any =
    //   new am4plugins_rangeSelector.DateAxisRangeSelector();
    // selector.container = document.getElementById('controls');
    // selector.axis = dateAxis;
    // let scrollbarX = new am4charts.XYChartScrollbar();
    // scrollbarX.series.push(series);
    // scrollbarX.marginBottom = 20;
    // scrollbarX.scrollbarChart.xAxes.getIndex(0).minHeight = undefined;
    // chart.scrollbarX = scrollbarX;
  }

  stock_history_data: any;
  stock_chartData: any = [];
  getStockChartData(id: any, currency: any) {
    this.stock_history_data = [];
    this.stock_chartData = [];
    this.financialMarketData.getStockChartData(id, currency).subscribe(
      (res) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);

        this.stock_history_data = res;
        for (var i = 0; i < res.length; i++) {
          this.stock_chartData.push({
            Date: res[i].date,
            Open: res[i].open?.toFixed(2),
            High: res[i].high,
            Low: res[i].low,
            Close: res[i].close,
            Volume: res[i].volume,
          });
        }
        this.dateChange('1Y');
        this.stockChart();
      },
      (err) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);
      }
    );
  }

  total_chartData: any = [];
  gettotalRecomChartData(id: any) {
    this.total_chartData = [];
    this.financialMarketData.gettotalrecomChartData(id).subscribe((res) => {
      ++this.count_res;
      this.util.checkCountValue(this.total_count_res, this.count_res);

      for (var i = 0; i < res.length; i++) {
        this.total_chartData.push({
          country: res[i].startDate,
          visits: res[i].total,
        });
      }
      // Themes end

      // Create chart instance
      let chart = am4core.create('chartdiv4', am4charts.XYChart);
      // $(document).ready(function () {
      //   $('g[aria-labelledby]').hide();
      // });
      am4core.options.commercialLicense = true;
      chart.data = [...this.total_chartData].reverse();

      var dateAxis: any = chart.xAxes.push(new am4charts.DateAxis());
      dateAxis.dateFormats.setKey('day', 'dd-MM-yy');
      dateAxis.dateFormats.setKey('month', 'MMM yyyy');
      dateAxis.dateFormats.setKey('week', 'dd MMM');

      dateAxis.periodChangeDateFormats.setKey('day', 'dd-MM-yy');
      dateAxis.periodChangeDateFormats.setKey('month', 'MMM yyyy');
      dateAxis.periodChangeDateFormats.setKey('week', 'dd MMM');
      dateAxis.renderer.labels.template.verticalCenter = 'middle';
      dateAxis.renderer.labels.template.horizontalCenter = 'left';
      dateAxis.renderer.labels.template.dx = -25;
      dateAxis.renderer.grid.template.location = 0;
      dateAxis.renderer.minGridDistance = 20;
      dateAxis.renderer.labels.template.fill = am4core.color('#ffc000');
      dateAxis.renderer.line.stroke = am4core.color('#ffc000');
      dateAxis.renderer.line.strokeWidth = 2;
      dateAxis.renderer.line.strokeOpacity = 1;
      dateAxis.renderer.labels.template.fontSize = 11;
      dateAxis.startLocation = 0;
      dateAxis.renderer.labels.template.rotation = 290;
      dateAxis.tooltip.background.cornerRadius = 3;
      dateAxis.tooltip.label.fontSize = 9;
      dateAxis.tooltip.label.padding(5, 5, 5, 5);

      let valueAxis: any = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.tooltip.disabled = true;
      // valueAxis.renderer.grid.template.stroke = am4core.color('#ffc000');
      valueAxis.renderer.labels.template.fill = am4core.color('#ffc000');
      valueAxis.renderer.labels.template.fontSize = 12;
      valueAxis.renderer.labels.template.fill = am4core.color('#ffc000');

      valueAxis.renderer.labels.template.adapter.add(
        'text',
        (label: any, target: any) => {
          if (target.dataItem) {
            if (Number(target.dataItem.value) > 1000) {
              return target.dataItem.value;
            }
            return target.dataItem.value;
          }
        }
      );

      valueAxis.renderer.line.stroke = am4core.color('#ffc000');
      valueAxis.renderer.line.strokeWidth = 2;
      valueAxis.renderer.line.strokeOpacity = 1;

      // Create series
      let series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueY = 'visits';
      series.dataFields.dateX = 'country';
      series.name = 'Total';
      series.columns.template.tooltipText = '{valueY}';
      // series.columns.template.fillOpacity = 0.8;
      // series.columns.template.width = am4core.percent(2);
      series.columns.template.fill = am4core.color('#4472c4');
      // series.smoothing = 'monotoneX';
      let columnTemplate = series.columns.template;
      columnTemplate.strokeWidth = 2;
      columnTemplate.strokeOpacity = 1;
      chart.legend = new am4charts.Legend();
      //  chart.legend.position = 'right';
      //  pieSeries.slices.template.propertyFields.fill = 'color';
      chart.legend.labels.template.fill = am4core.color('#ffc000');
      chart.legend.fontSize = 13;
      chart.cursor = new am4charts.XYCursor();
      am4core.unuseTheme(am4themes_microchart);
    });
  }

  estimate_chartData: any = [];
  real_chartdata: any = [];
  getEstimateChartData(id: any) {
    this.estimate_chartData = [];
    this.real_chartdata = [];
    this.financialMarketData.getAnalystChartData(id).subscribe((res) => {
      ++this.count_res;
      this.util.checkCountValue(this.total_count_res, this.count_res);

      this.estimate_chartData = res;
      for (var i = 0; i < this.estimate_chartData.length; i++) {
        this.real_chartdata.push({
          date: this.estimate_chartData[i].startDate,
          value: this.estimate_chartData[i].buy,
          value2: this.estimate_chartData[i].overWeight,
          value3: this.estimate_chartData[i].neutral,
          value4: this.estimate_chartData[i].underweight,
          value5: this.estimate_chartData[i].sell,
        });
      }
      am4core.useTheme(am4themes_animated);
      am4core.unuseTheme(am4themes_microchart);
      // Create chart instance
      var chart = am4core.create('chartdiv3', am4charts.XYChart);
      // $(document).ready(function () {
      //   $('g[aria-labelledby]').hide();
      // });
      am4core.options.commercialLicense = true;
      chart.data = [...this.real_chartdata].reverse();
      chart.legend = new am4charts.Legend();
      chart.legend.labels.template.fill = am4core.color('#ffc000');
      chart.legend.valueLabels.template.fill = am4core.color('#ffc000');

      chart.legend.itemContainers.template.clickable = false;
      chart.legend.itemContainers.template.focusable = false;
      chart.legend.itemContainers.template.cursorOverStyle =
        am4core.MouseCursorStyle.default;
      // Create axes
      var dateAxis: any = chart.xAxes.push(new am4charts.DateAxis());
      dateAxis.dateFormats.setKey('day', 'dd-MM-yy');
      dateAxis.dateFormats.setKey('month', 'MMM yyyy');
      dateAxis.dateFormats.setKey('week', 'dd MMM');

      dateAxis.periodChangeDateFormats.setKey('day', 'dd-MM-yy');
      dateAxis.periodChangeDateFormats.setKey('month', 'MMM yyyy');
      dateAxis.periodChangeDateFormats.setKey('week', 'dd MMM');
      dateAxis.renderer.labels.template.verticalCenter = 'middle';
      dateAxis.renderer.labels.template.horizontalCenter = 'left';
      dateAxis.renderer.labels.template.dx = -25;
      dateAxis.renderer.grid.template.location = 0;
      dateAxis.renderer.minGridDistance = 20;
      dateAxis.renderer.labels.template.fill = am4core.color('#ffc000');
      dateAxis.renderer.line.stroke = am4core.color('#ffc000');
      dateAxis.renderer.line.strokeWidth = 2;
      dateAxis.renderer.line.strokeOpacity = 1;
      dateAxis.renderer.labels.template.rotation = -45;
      dateAxis.renderer.labels.template.fontSize = 11;
      dateAxis.startLocation = 0;
      dateAxis.renderer.labels.template.rotation = 290;
      dateAxis.tooltip.background.cornerRadius = 3;
      dateAxis.tooltip.label.fontSize = 9;
      dateAxis.tooltip.label.padding(5, 5, 5, 5);

      var valueAxis: any = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.tooltip.disabled = true;
      valueAxis.renderer.baseGrid.disabled = true;
      valueAxis.renderer.labels.template.fill = am4core.color('#ffc000');
      valueAxis.renderer.labels.template.adapter.add(
        'text',
        (label: any, target: any) => {
          if (target.dataItem) {
            if (Number(target.dataItem.value) > 1000) {
              return target.dataItem.value;
            }
            return target.dataItem.value;
          }
        }
      );

      valueAxis.renderer.line.stroke = am4core.color('#ffc000');
      valueAxis.renderer.line.strokeWidth = 2;
      valueAxis.renderer.line.strokeOpacity = 1;

      // Create series
      function createSeries(field: any, name: any) {
        var series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.valueY = field;
        series.dataFields.dateX = 'date';
        series.name = name;
        series.tooltipText = '[b]{valueY}';
        series.strokeWidth = 2;

        series.smoothing = 'monotoneX';

        return series;
      }

      chart.colors.list = [
        am4core.color('#158d71'),
        am4core.color('grey'),
        am4core.color('orange'),
        am4core.color('#6794dc'),
        am4core.color('#c70b0b'),
      ];

      createSeries('value', 'Buy');
      createSeries('value2', 'Overweight');
      createSeries('value3', 'Neutral');
      createSeries('value4', 'Underweight');
      createSeries('value5', 'Sell');
      chart.cursor = new am4charts.XYCursor();
      am4core.unuseTheme(am4themes_microchart);
      // chart.legend = new am4charts.Legend();
      // chart.legend.labels.template.fill = am4core.color('#ffc000');
      // chart.legend.fontSize = 13;
      // chart.cursor = new am4charts.XYCursor();
    });
  }

  company_info: any = [];
  isTrue: any = true;
  free_float: any = '';
  getCompanyInfo(id: any, currency: any, type?: any) {
    this.company_info = [];
    this.financialMarketData.getCompanyinfo(id, currency).subscribe(
      (res) => {
        ++this.count_res;
        this.company_info = res;
        this.country_val = this.company_info.countryCode;
        this.entity_id = this.company_info.entityId;
        this.currency = this.company_info.currency;
        if (!type) this.selectedcurrecny = this.company_info.currency;
        this.selectedStock = this.company_info.companyId;
        // this.free_float =
        //   (this.company_info.shareFreeFloat /
        //     this.company_info.shareOutStanding) *
        //   100;
        this.util.checkCountValue(this.total_count_res, this.count_res);
      },
      (err) => {
        ++this.count_res;
      }
    );
  }
  privateCompanyDataArray: any = [];
  getPrivateCompanyInfo(id: any, currency: any, company: any, type?: any) {
    this.company_info = [];
    this.financialMarketData.getCompanyBasicInfo(id, currency).subscribe(
      (res) => {
        if (!res) {
          this.getCompanyInfo(id, currency);
          this.getFinancialData(id, currency);
          this.getbenchmarktableData(this.entity_id, this.currency);
        } else {
          this.privateCompany_tab = true;
          this.company_info = res;
          this.country_val = this.company_info.countryCode;
          this.entity_id = this.company_info.id;
          this.selectedcurrecny = res.reportingCurrency;
          this.currency = res.reportingCurrency;

          this.privateCompanyDataArray = [
            {
              title: 'Year Founded',
              value: res?.yearFounded ? parseInt(res?.yearFounded) : '-',
            },
            {
              title: 'Website',
              value: res.website ? res?.website : '-',
            },
            {
              title: 'Contact Number',
              value: res?.contactNo ? res?.contactNo : '-',
            },
            {
              title: 'Email',
              value: res?.email ? res.email : '-',
            },
            {
              title: 'Corporate Headquarters',
              value: res?.domicileCountryName ? res.domicileCountryName : '-',
            },
            {
              title: 'Number of Employees',
              value: res?.totalEmp ? res.totalEmp : '-',
            },
            {
              title: 'Crunchbase Rank',
              value: res?.crunchBaseRank ? res.crunchBaseRank : '-',
            },
          ];
          // if (!type) this.selectedcurrecny = this.company_info.currency;
          // this.selectedStock = this.company_info.companyId;
          // this.free_float =
          //   (this.company_info.shareFreeFloat /
          //     this.company_info.shareOutStanding) *
          //   100;
          this.getFinancialData(id, this.currency);
          this.getbenchmarktableData(id, this.currency);
          this.getmanagementData(company, id);
          this.getDebtProfile(this.currency, id);
          this.getDebtcompositionData(this.currency, id);
          this.getMaturityData(this.currency, id);
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);
        }
      },
      (err) => {
        ++this.count_res;
      }
    );
  }

  getIndianPrivateCompanyInfo(id: any, currency: any, type?: any) {
    this.company_info = [];
    this.financialMarketData.getIndianCompanyBasicInfo(id, currency).subscribe(
      (res) => {
        this.privateCompany_tab = true;
        this.company_info = res;
        this.country_val = this.company_info.countryCode;
        this.entity_id = this.company_info.entityId;
        this.privateCompanyDataArray = [
          {
            title: 'Date of Incorporation',
            value: res?.incorporationDate ? res?.incorporationDate : '-',
          },
          {
            title: 'Registration No',
            value: res.registrationNo ? res?.registrationNo : '-',
          },
          {
            title: 'Class of Company',
            value: res?.entityType ? res?.entityType : '-',
          },
          {
            title: 'Constitution Act',
            value: res?.constitutionAct ? res?.constitutionAct : '-',
          },
          {
            title: 'Website',
            value: res?.website ? res?.website : '-',
          },
          {
            title: 'Email',
            value: res?.email ? res.email : '-',
          },
          {
            title: 'Corporate Headquarters',
            value: res?.address ? res.address : '-',
          },
        ];
        this.selectedcurrecny = res.reportingCurrency;
        this.currency = res.reportingCurrency;

        this.getbenchmarkPrivatetableData(this.company_id, this.currency);
        this.getPrivateComapnyFinancialData(this.company_id, this.currency);
        this.getmanagementData(this.comapny_name, this.company_id);
        this.getDebtProfile(this.currency, this.company_id);

        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);
      },
      // },
      (err) => {
        ++this.count_res;
      }
    );
  }

  relative_price_data: any = [];
  periods6: any = [];
  itemName6: any = [];
  relative_data: any = {};
  relative_data2: any = {};
  final_relativeData: any = [];
  formateSectorData6: any = [];
  relative_title: any = [];
  getRelativePriceData(id: any, currency: any, index: any) {
    this.relative_data = {};
    this.relative_data2 = {};
    this.final_relativeData = [];
    this.financialMarketData
      .getRelativePriceData(id, currency, index)
      .subscribe(
        (res) => {
          this.final_relativeData = [];

          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);

          this.relative_price_data = res;
          var nameArray = this.relative_price_data.map(function (el: any) {
            return el.comPerChange;
          });
          var nameArray1 = this.relative_price_data.map(function (el: any) {
            return el.indexPerChange;
          });
          var nameArray2 = this.relative_price_data.map(function (el: any) {
            return el.duration;
          });
          this.relative_title = nameArray2;
          this.relative_data = {
            ...nameArray,
          };
          this.relative_data2 = {
            ...nameArray1,
          };
          this.final_relativeData.push(this.relative_data, this.relative_data2);
        },
        (err) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);
        }
      );
  }

  getSet1(e: any) {
    this.count_res = 0;
    this.total_count_res = 2;
    this.isbenchmarkLoading = true;
    this.loaderService.display(true);
    this.util.checkCountValue(this.total_count_res, this.count_res);
    this.period_data = e;
    this.getbenchmarktableData(this.entity_id, this.currency);
  }

  period_data: any = 'YEARLY';
  benchmark_data: any = [];
  itemName5: any = [];
  periods5: any = [];
  sectorOject5: any = {};
  formateSectorData5: any = [];
  bechmark_header: any = [];
  getbenchmarktableData(id: any, currency: any) {
    const _id = localStorage.getItem('id');
    this.financialMarketData
      .getBenchMarkData(_id, this.entity_id ?? id)
      .subscribe((res) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);
        this.addedCompanies = [];
        this.removedCompanies = [];
        res?.forEach((ele: any) => {
          if (ele?.status == 'ADDED') {
            this.addedCompanies.push(ele?.benchmarkCompany);
          } else {
            this.removedCompanies.push(ele?.benchmarkCompany);
          }
        });
        this.getbenchmarktableDataSecond(this.entity_id, currency);
        if (res?.length) {
          this.showReset = true;
        }
      });
  }

  getbenchmarkPrivatetableData(id: any, currency: any) {
    const _id = localStorage.getItem('id');
    this.financialMarketData
      .getBenchMarkData(_id, this.entity_id ?? id)
      .subscribe((res) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);
        this.addedCompanies = [];
        this.removedCompanies = [];
        res?.forEach((ele: any) => {
          if (ele?.status == 'ADDED') {
            this.addedCompanies.push(ele?.benchmarkCompany);
          } else {
            this.removedCompanies.push(ele?.benchmarkCompany);
          }
        });
        this.getPrivateCompanybenchmarktableDataSecond(
          this.entity_id ?? id,
          currency
        );
        if (res?.length) {
          this.showReset = true;
        }
      });
  }

  // handlecompanyCode(e: any) {
  //   this.removedCompanies = [];
  //   this.total_count_res = 3;
  //   this.count_res = 0;
  //   this.loaderService.display(true);
  //   this.showReset = true;
  //   this.storeRemovedOrAddedComapanies(e.entityId, 'REMOVED');
  //   this.removedCompanies.push(e.entityId);
  //   this.financialMarketData
  //     .getBenchMarkData('101', this.entity_id)
  //     .subscribe((res) => {
  //       ++this.count_res;
  //       this.util.checkCountValue(this.total_count_res, this.count_res);
  //       this.addedCompanies = [];
  //       res?.forEach((ele: any) => {
  //         if (ele?.status == 'ADDED') {
  //           this.addedCompanies.push(ele?.benchmarkCompany);
  //         } else {
  //           this.removedCompanies.push(ele?.benchmarkCompany);
  //         }
  //       });
  //       const index = this.addedCompanies.indexOf(e.entityId);
  //       this.addedCompanies.splice(index, 1);
  //       this.getRemovedBenchmarkData(e);
  //     });
  // }

  getbenchmarktableDataSecond(id: any, currency: any) {
    this.benchmark_data = [];
    this.periods5 = [];
    this.itemName5 = [];
    this.sectorOject5 = {};
    this.formateSectorData5 = [];
    this.financialMarketData
      .AddandRemoveBenchMarktableData(
        id,
        this.period_data,
        currency,
        this.addedCompanies.toString(),
        this.removedCompanies.toString(),
        this.isPrivateCompanyActive
      )
      .subscribe(
        (res) => {
          ++this.count_res;
          this.benchmark_data = res;
          for (var i = 0; i < this.benchmark_data.length; i++) {
            if (!this.periods5.includes(this.benchmark_data[i].shortName)) {
              if (this.benchmark_data[i].shortName != 'Closing Price') {
                this.periods5.push({
                  name: this.benchmark_data[i].shortName,
                  unit: this.benchmark_data[i].unit,
                });
              }
            }

            var result = this.periods5.reduce((unique: any, o: any) => {
              if (
                !unique.some(
                  (obj: any) => obj.name === o.name && obj.unit === o.unit
                )
              ) {
                unique.push(o);
              }
              return unique;
            }, []);
            this.bechmark_header = result;

            if (!this.itemName5.includes(this.benchmark_data[i].shortName)) {
              if (this.benchmark_data[i].shortName != 'Closing Price') {
                this.itemName5.push({
                  name: this.benchmark_data[i].shortName,
                  companyName: this.benchmark_data[i].companyName,
                  data: this.benchmark_data[i].data,
                });
              }
            }
          }
          // this.periods.sort((a: any, b: any) => +new Date(a) - +new Date(b));
          // this.data_estimate = analystRecommedationBasic;
          this.itemName5.map((val1: any, index1: any) => {
            this.benchmark_data.map((val2: any, index2: any) => {
              if (val1.name == val2.shortName && val1.data == val2.data) {
                var index = this.formateSectorData5.findIndex(
                  (data: any) => data[val1['name']] == val2.shortName
                );
                if (index > -1) {
                } else {
                  this.sectorOject5 = {};
                }
                const newKey = val1['name'];
                this.sectorOject5[newKey] = val1.data;

                this.sectorOject5 = {
                  ...this.sectorOject5,
                  flag: val2.dataFlag,
                  description: val2.companyName,
                  id: val2.companyId,
                  infoVal: val2.periodType + ' ' + val2.date,
                  entityId: val2.entityId,
                  filedName: val2.fieldName,
                };

                if (this.sectorOject5.flag) this.flagLength++;
                this.formateSectorData5 = [
                  ...this.formateSectorData5,
                  this.sectorOject5,
                ];

                this.formateSectorData5 = this.formateSectorData5.reduce(
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
          this.isbenchmarkLoading = false;
          this.util.checkCountValue(this.total_count_res, this.count_res);
          this.remove_table_length = this.formateSectorData5.length;
        },
        (err) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);
          this.isbenchmarkLoading = false;
          this.benchMarkPrivateCompanyError = true;
        }
      );
  }

  getPrivateCompanybenchmarktableDataSecond(id: any, currency: any) {
    this.benchmark_data = [];
    this.periods5 = [];
    this.itemName5 = [];
    this.sectorOject5 = {};
    this.formateSectorData5 = [];
    this.financialMarketData
      .AddandRemovePrivateBenchMarktableData(
        id,
        this.period_data,
        currency,
        this.addedCompanies.toString(),
        this.removedCompanies.toString()
      )
      .subscribe(
        (res) => {
          ++this.count_res;
          this.benchmark_data = res;
          for (var i = 0; i < this.benchmark_data?.length; i++) {
            if (!this.periods5.includes(this.benchmark_data[i].shortName)) {
              if (this.benchmark_data[i].shortName != 'Closing Price') {
                this.periods5.push({
                  name: this.benchmark_data[i].shortName,
                  unit: this.benchmark_data[i].unit,
                });
              }
            }

            var result = this.periods5.reduce((unique: any, o: any) => {
              if (
                !unique.some(
                  (obj: any) => obj.name === o.name && obj.unit === o.unit
                )
              ) {
                unique.push(o);
              }
              return unique;
            }, []);
            this.bechmark_header = result;

            if (!this.itemName5.includes(this.benchmark_data[i].shortName)) {
              if (this.benchmark_data[i].shortName != 'Closing Price') {
                this.itemName5.push({
                  name: this.benchmark_data[i].shortName,
                  companyName: this.benchmark_data[i].companyName,
                  data: this.benchmark_data[i].data,
                });
              }
            }
          }
          // this.periods.sort((a: any, b: any) => +new Date(a) - +new Date(b));
          // this.data_estimate = analystRecommedationBasic;
          this.itemName5.map((val1: any, index1: any) => {
            this.benchmark_data.map((val2: any, index2: any) => {
              if (val1.name == val2.shortName && val1.data == val2.data) {
                var index = this.formateSectorData5.findIndex(
                  (data: any) => data[val1['name']] == val2.shortName
                );
                if (index > -1) {
                } else {
                  this.sectorOject5 = {};
                }
                const newKey = val1['name'];
                this.sectorOject5[newKey] = val1.data;

                this.sectorOject5 = {
                  ...this.sectorOject5,
                  flag: val2.dataFlag,
                  description: val2.companyName,
                  id: val2.companyId,
                  infoVal: val2.periodType + ' ' + val2.date,
                  entityId: val2.entityId,
                  filedName: val2.fieldName,
                };

                if (this.sectorOject5.flag) this.flagLength++;
                this.formateSectorData5 = [
                  ...this.formateSectorData5,
                  this.sectorOject5,
                ];

                this.formateSectorData5 = this.formateSectorData5.reduce(
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
          this.isbenchmarkLoading = false;
          this.util.checkCountValue(this.total_count_res, this.count_res);
          this.remove_table_length = this.formateSectorData5.length;
        },
        (err) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);
          this.isbenchmarkLoading = false;
        }
      );
  }

  companyfile_title: any = [
    'Date of Filing',
    'Filing Type',
    'Document Details',
  ];
  companyfile_data: any = [];
  temfiledata: any = [];
  dropdownfilling: any = [];
  dropfilldata: any = [];
  getCompanyFileData(id1: any, id2: any, selection: any) {
    this.companyfile_data = [];
    this.financialMarketData.getCompanyFileData(id1, id2, selection).subscribe(
      (res) => {
        this.companyfile_data = res;

        for (let i of this.companyfile_data) {
          this.dropdownfilling.push(i.formType);
        }

        const sorted = this.companyfile_data.sort((a: any, b: any) => {
          var aDate: any = moment(
            `${a.storyDate},
          ${a.storyTime}`,
            'DD-MM-YYYY ,hh:mm A'
          ).format('MM-DD-YYYY HH:mm:ss');
          var bDate: any = moment(
            `${b.storyDate},
            ${b.storyTime}`,
            'DD-MM-YYYY ,hh:mm A'
          ).format('MM-DD-YYYY HH:mm:ss');
          var a_Date = new Date(aDate);
          var b_Date = new Date(bDate);
          return b_Date.getTime() - a_Date.getTime();
        });

        this.companyfile_data = sorted;

        this.dropdownfilling = [...new Set(this.dropdownfilling)];

        this.temfiledata = this.selectcompfileData.slice();
        for (let i = 0; i < this.dropdownfilling.length; i++) {
          this.temfiledata.push({
            id: this.dropdownfilling[i],
            text: this.dropdownfilling[i],
          });
        }

        this.dropfilldata = this.temfiledata.slice();
        this.temfiledata.length = 0;

        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);
      },
      (err) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);
      }
    );
  }

  compsel_data: any = 'All Filings';
  onValueChangcomp(e: any) {
    if (this.compsel_data !== e) {
      this.total_count_res = 1;
      this.count_res = 0;
      this.loaderService.display(true);
      this.compsel_data = e;
      if (e == 'All Filings') {
        this.getCompanyFileData(this.company_id, this.entity_id, '');
      } else {
        this.getCompanyFileData(
          this.company_id,
          this.entity_id,
          this.compsel_data
        );
      }
    }
  }

  mean_data: any = 'mean';
  onValueChanged(e: any) {
    this.mean_data = e;
  }

  events_data: any = [];
  getEventsData(id: any) {
    this.events_data = [];
    this.financialMarketData.getEventsData(id).subscribe(
      (res) => {
        this.events_data = res;

        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);
      },
      (err) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);
      }
    );
  }

  period_seg: any = [];
  segemented_data: any = [];
  ietmname_seg: any = [];
  sectorobject_seg: any = {};
  formateSectorData_seg: any = [];
  name_seg: any = [];
  getSegmentData(id: any, name: any, currency: any) {
    this.segemented_data = [];
    this.ietmname_seg = [];
    this.period_seg = [];
    this.financialMarketData.getSegmentData(id, name, currency).subscribe(
      (res) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);

        this.segemented_data = res;
        for (var i = 0; i < this.segemented_data.length; i++) {
          if (!this.period_seg.includes(this.segemented_data[i].date)) {
            this.period_seg.push(this.segemented_data[i].date);
          }

          if (!this.name_seg.includes(this.segemented_data[i].date)) {
            this.name_seg.push(this.segemented_data[i].date);
          }

          if (!this.ietmname_seg.includes(this.segemented_data[i].label)) {
            this.ietmname_seg.push({
              label: this.segemented_data[i].label,
              date: this.segemented_data[i].date,
              sales: this.segemented_data[i].sales,
              opinc: this.segemented_data[i].opinc,
              assets: this.segemented_data[i].assets,
              capex: this.segemented_data[i].capex,
              dep: this.segemented_data[i].dep,
            });
          }
        }

        this.ietmname_seg.filter((val1: any, index1: any) => {
          if (val1.label && val1.date) {
            val1['sales' + val1.date] = val1.sales;
            val1['opinc' + val1.date] = val1.opinc;
            val1['assets' + val1.date] = val1.assets;
            val1['capex' + val1.date] = val1.capex;
            val1['dep' + val1.date] = val1.dep;
          }
        });
        this.ietmname_seg = this.ietmname_seg.reduce(
          (acc: any, val: any, ind: any) => {
            const index = acc.findIndex((el: any) => el.label === val.label);
            if (index !== -1) {
              const key = Object.keys(val)[7];
              const key1 = Object.keys(val)[8];
              const key2 = Object.keys(val)[9];
              const key3 = Object.keys(val)[10];
              const key4 = Object.keys(val)[11];
              acc[index][key] = val[key];
              acc[index][key1] = val[key1];
              acc[index][key2] = val[key2];
              acc[index][key3] = val[key3];
              acc[index][key4] = val[key4];
            } else {
              acc.push(val);
            }
            return acc;
          },
          []
        );
      },
      (err) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);
      }
    );
  }

  debt_compo_data: any = [];
  chartDivpie: any = '';
  getDebtcompositionData(currency: any, id: any) {
    this.debt_compo_data = [];
    this.chartDivpie = '';
    this.financialMarketData.getDebtCompositionData(currency, id).subscribe(
      (res) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);
        am4core.options.commercialLicense = true;
        this.debt_compo_data = res;
        this.chartDivpie = am4core.create('chartdiv', am4charts.PieChart);
        // $(document).ready(function () {
        //   $('g[aria-labelledby]').hide();
        // });
        // chart.data =

        for (var i = 0; i < this.debt_compo_data.length; i++) {
          this.chartDivpie.data.push({
            country: this.debt_compo_data[i].instrumentType,
            litres: this.debt_compo_data[i].outstandingAmount,
          });
        }
        this.chartDivpie.numberFormatter.numberFormat = '#,###.##';

        this.chartDivpie.events.on('beforedatavalidated', (ev: any) => {
          // check if there's data
          if (ev.target.data.length === 0) {
            let indicator = this.chartDivpie.tooltipContainer.createChild(
              am4core.Container
            );
            let indicatorLabel = indicator.createChild(am4core.Label);
            indicatorLabel.text = 'No Data Available';
            indicatorLabel.isMeasured = false;
            indicatorLabel.x = 310;
            indicatorLabel.y = 112;
            indicatorLabel.fontSize = 13;
            indicatorLabel.fill = am4core.color('#fff');
          }
        });

        var pieSeries = this.chartDivpie.series.push(new am4charts.PieSeries());
        pieSeries.dataFields.value = 'litres';
        pieSeries.dataFields.category = 'country';
        pieSeries.slices.template.strokeWidth = 2;
        pieSeries.slices.template.strokeOpacity = 1;
        pieSeries.labels.template.fill = am4core.color('#ffc000');
        pieSeries.labels.template.fontSize = 12;
        pieSeries.slices.template.propertyFields.fill = 'color';

        // This creates initial animation
        pieSeries.ticks.template.disabled = false;
        pieSeries.ticks.template.stroke = am4core.color('#ffc000');
        pieSeries.ticks.template.strokeWidth = 2;
        pieSeries.ticks.template.fill = am4core.color('#ffc000');
        pieSeries.labels.template.text = '{value.percent}%';
        pieSeries.slices.template.tooltipText = `{country} : {value} ({value.percent}%)`;

        pieSeries.colors.list = [
          am4core.color('#4472c4'),
          am4core.color('#ed7d31'),
          am4core.color('#ffc000'),
          am4core.color('#5b9bd5'),
          am4core.color('#179172'),
          am4core.color('#ffc75f'),
          am4core.color('#ff9671'),
          am4core.color('#67b7dc'),
          am4core.color('#dc67ab'),
          am4core.color('#a367dc'),
          am4core.color('#8067dc'),
          am4core.color('#6771dc'),
          am4core.color('#6794dc'),
          am4core.color('#a5a5a5'),
        ];
        let slice = pieSeries.slices.template;

        slice.states.getKey('hover').properties.scale = 1;

        slice.states.getKey('active').properties.shiftRadius = 0;
      },
      (err) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);
      }
    );
  }

  debt_compo_data2: any = [];
  chartDivpie2: any = '';
  ownershipAsOnDate: any;
  getOwnershipData(id: any) {
    this.debt_compo_data2 = [];
    this.chartDivpie2 = '';
    this.financialMarketData.getOwnershipData(id).subscribe((res) => {
      ++this.count_res;
      this.util.checkCountValue(this.total_count_res, this.count_res);

      this.debt_compo_data2 = res;
      this.ownershipAsOnDate = res[0].asOnDate;
      this.ownership_title.push(
        this.datepipe.transform(this.ownershipAsOnDate, 'dd-MMM-yy')
      );
      this.promo_ownership_title.push(
        this.datepipe.transform(this.ownershipAsOnDate, 'dd-MMM-yy')
      );
      this.institue_ownership_title.push(
        this.datepipe.transform(this.ownershipAsOnDate, 'dd-MMM-yy')
      );
      this.chartDivpie2 = am4core.create('chartdiv2', am4charts.PieChart);
      // $(document).ready(function () {
      //   $('g[aria-labelledby]').hide();
      // });
      // chart.data =
      am4core.options.commercialLicense = true;
      for (var i = 0; i < this.debt_compo_data2.length; i++) {
        this.chartDivpie2.data.push({
          country: this.debt_compo_data2[i].companyId,
          litres: this.util.standardFormat(
            this.debt_compo_data2[i].total,
            2,
            ''
          ),
        });
      }

      this.chartDivpie2.numberFormatter.numberFormat = '#,###.##';

      // Add and configure Series
      var pieSeries = this.chartDivpie2.series.push(new am4charts.PieSeries());
      pieSeries.dataFields.value = 'litres';
      pieSeries.dataFields.category = 'country';
      // pieSeries.slices.template.stroke = am4core.color('#fff');
      pieSeries.slices.template.strokeWidth = 2;
      pieSeries.slices.template.strokeOpacity = 1;
      pieSeries.colors.list = [
        am4core.color('#4472c4'),
        am4core.color('#ed7d31'),
        am4core.color('#ffc000'),
        am4core.color('#5b9bd5'),
        am4core.color('#179172'),
        am4core.color('#ffc75f'),
        am4core.color('#ff9671'),
        am4core.color('#67b7dc'),
        am4core.color('#a5a5a5'),
      ];

      this.chartDivpie2.legend = new am4charts.Legend();
      this.chartDivpie2.legend.position = 'right';
      this.chartDivpie2.legend.valueLabels.template.disabled = true;
      this.chartDivpie2.legend.labels.template.fill = am4core.color('#ffc000');
      this.chartDivpie2.legend.fontSize = 11;
      this.chartDivpie2.legend.labels.template.text = '{country}';
      this.chartDivpie2.legend.itemContainers.template.clickable = false;
      this.chartDivpie2.legend.itemContainers.template.focusable = false;
      this.chartDivpie2.legend.itemContainers.template.cursorOverStyle =
        am4core.MouseCursorStyle.default;

      // This creates initial animation
      pieSeries.slices.template.tooltipText = '{country} : {value.percent}%';
      pieSeries.labels.template.fill = am4core.color('#ffc000');
      pieSeries.labels.template.fontSize = 10;
      pieSeries.slices.template.propertyFields.fill = 'color';
      pieSeries.labels.template.text = '{value.percent}%';
      pieSeries.labels.template.fill = am4core.color('#ffc000');
      pieSeries.labels.template.radius = am4core.percent(5);
      // This creates initial animation
      pieSeries.ticks.template.disabled = false;
      pieSeries.ticks.template.fill = am4core.color('#ffc000');
      pieSeries.ticks.template.stroke = am4core.color('#ffc000');
      pieSeries.ticks.template.strokeWidth = 2;

      let slice = pieSeries.slices.template;
      slice.states.getKey('hover').properties.scale = 1;
      slice.states.getKey('active').properties.shiftRadius = 0;

      am4core.unuseTheme(am4themes_microchart);
      // pieSeries.labels.template.text = '{value.percent}%';
    });
  }

  // {
  //       category: '2022',
  //       value1: 41000,
  //       value2: 10000,
  //       value3: 169000,
  //       value4: 111341,
  //     },
  // maturity_data: any = [];

  formattedTodaysDate: any = this.datepipe.transform(
    this.toDaysDate,
    'dd-MMM-yy'
  );
  ownership_title: any = ['Ownership Details'];
  event_title: any = ['Time & Date', 'Events & Transcripts'];

  ownership_details_data: any = [];
  getOwnershipdetaildata(id: any) {
    this.ownership_details_data = [];
    this.financialMarketData.getOwnershipDetailData(id).subscribe(
      (res) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);

        this.ownership_details_data = res;
      },
      (err) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);
      }
    );
  }

  promo_ownership_title: any = ['Promoters/Insiders Ownership Details'];

  promo_ownership_data: any = [];
  getpromoroownershipData(id: any) {
    this.promo_ownership_data = [];
    this.financialMarketData.getpromoteOwnershipDetailData(id).subscribe(
      (res) => {
        this.promo_ownership_data = res;

        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);
      },
      (err) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);
      }
    );
  }

  institue_ownership_title: any = ['Institutional Ownership Details'];
  institue_ownership_data: any = [];
  getinstitueownershipData(id: any) {
    this.institue_ownership_data = [];
    this.financialMarketData.getinstitueOwnershipDetailData(id).subscribe(
      (res) => {
        this.institue_ownership_data = res;

        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);
      },
      (err) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);
      }
    );
  }

  estimate_data: any = [];
  set_period: any = 'yearly';

  getEstimateData(id: any) {
    this.financialMarketData.getEstimateData(id, this.set_period).subscribe(
      (res) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);

        // this.estimate_data = [...new Set(res)];
        var result = res.reduce((unique: any, o: any) => {
          if (
            !unique.some(
              (obj: any) =>
                obj.startDate === o.startDate && obj.feItem === o.feItem
            )
          ) {
            unique.push(o);
          }
          return unique;
        }, []);
        this.getconsensusData(result);
      },
      (err) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);
      }
    );
  }

  itemName: any = [];
  itemDesc: any = [];
  itemUnit: any = [];
  itemCurrency: any = [];
  displayLevel = [];
  periods: any = [];
  counter = 0;
  urlParameter = '';
  analayst_arr: any = [];
  count: any = '';
  data_estimate: any = [];
  sectorOject: any = {};
  formateSectorData: any = [];
  defaultIndustrialItems: any = [
    'Sales',
    'EBITDA Adjusted',
    'Net Income Reported',
    'Capital Expenditure',
    'Free Cash Flow',
    'Earnings Per Share',
  ];
  defaultIndustrialItemsBanking: any = [
    'Interest Expense',
    'Consolidated Net Income',
    'Total Assets',
    'Cash Flow From Operations',
    'Book Value Per Share',
    'Reported Earnings Per Share',
  ];
  defaultIndustrialItemsInsurance: any = [
    'Total Revenues',
    'Gross Income',
    'Total Assets',
    'Total Debt ',
    'Free Cash Flow Per Share',
    'Reported Earnings Per Share',
  ];
  defaultIndustrialItemsMiscellaneous: any = [
    'Interest Expense',
    'Consolidated Net Income',
    'Total Assets',
    'Total Debt',
    'Free Cash Flow Per Share',
    'Reported Earnings Per Share',
  ];
  formateSectorDataDefualt: any = [];
  consensus: any = true;
  getconsensusData(analystRecommedationBasic: any) {
    this.formateSectorData = [];
    this.formateSectorDataDefualt = [];
    this.periods = [];
    this.itemName = [];
    for (var i = 0; i < analystRecommedationBasic.length; i++) {
      if (!this.periods.includes(analystRecommedationBasic[i].startDate)) {
        this.periods.push(analystRecommedationBasic[i].startDate);
      }

      if (!this.itemName.includes(analystRecommedationBasic[i].feItem)) {
        const key = 'name' + i;
        this.itemName.push({
          name: analystRecommedationBasic[i].feItem,
          mean: analystRecommedationBasic[i].feMean,
          date: analystRecommedationBasic[i].startDate,
          median: analystRecommedationBasic[i].feMedian,
          low: analystRecommedationBasic[i].feLow,
          high: analystRecommedationBasic[i].feHigh,
          stdDiv: analystRecommedationBasic[i].feStdDev,
        });
      }
    }

    this.periods.sort((a: any, b: any) => +new Date(a) - +new Date(b));
    this.data_estimate = analystRecommedationBasic;
    this.itemName.map((val1: any, index1: any) => {
      this.data_estimate.map((val2: any, index2: any) => {
        if (val1.name == val2.feItem && val1.date == val2.startDate) {
          var index = this.formateSectorData.findIndex(
            (data: any) =>
              data['mean-' + val1['date']] == val2.feMean &&
              data['median-' + val1['date']] == val2.feMedian &&
              data['low-' + val1['date']] == val2.feLow &&
              data['high-' + val1['date']] == val2.feHigh &&
              data['stdDiv-' + val1['date']] == val2.feStdDev
          );

          if (index > -1) {
          } else {
            this.sectorOject = {};
          }
          const newKey = val1['date'];
          this.sectorOject['mean-' + newKey] = val1.mean;
          this.sectorOject['median-' + newKey] = val1.median;
          this.sectorOject['low-' + newKey] = val1.low;
          this.sectorOject['high-' + newKey] = val1.high;
          this.sectorOject['stdDiv-' + newKey] = val1.stdDiv;
          this.sectorOject = {
            ...this.sectorOject,
            description:
              val2.unit != null
                ? val2.description +
                  ' (' +
                  val2.currency +
                  ' ' +
                  val2.unit +
                  ')'
                : val2.description + ' (' + val2.currency + ') ',
            descriptionCheck: val2.description,
          };
          this.formateSectorData = [
            ...this.formateSectorData,
            this.sectorOject,
          ];

          this.formateSectorData = this.formateSectorData.reduce(
            (acc: any, val: any, ind: any) => {
              const index = acc.findIndex(
                (el: any) => el.description === val.description
              );
              if (index !== -1) {
                const key = Object.keys(val)[0];
                const key1 = Object.keys(val)[1];
                const key2 = Object.keys(val)[2];
                const key3 = Object.keys(val)[3];
                const key4 = Object.keys(val)[4];
                acc[index][key] = val[key];
                acc[index][key1] = val[key1];
                acc[index][key2] = val[key2];
                acc[index][key3] = val[key3];
                acc[index][key4] = val[key4];
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

    if (this.company_info?.ticsIndustryName == 'Insurance Services') {
      this.defaultIndustrialItems = this.defaultIndustrialItemsInsurance;
    } else if (
      this.company_info?.ticsIndustryName == 'Miscellaneous Financial Services'
    ) {
      this.defaultIndustrialItems = this.defaultIndustrialItemsMiscellaneous;
    } else if (this.company_info?.ticsIndustryName == 'Banking Services') {
      this.defaultIndustrialItems = this.defaultIndustrialItemsBanking;
    }

    this.formateSectorData.forEach((elemet: any) => {
      if (this.defaultIndustrialItems.includes(elemet.descriptionCheck)) {
        this.formateSectorDataDefualt = [
          ...this.formateSectorDataDefualt,
          elemet,
        ];
      }
    });

    this.defaultIndustrialItems.forEach((element: any) => {
      let isThere: boolean = true;
      this.formateSectorDataDefualt.forEach((el: any) => {
        if (element == el.descriptionCheck) isThere = false;
      });
      if (isThere)
        this.formateSectorDataDefualt.push({
          description: element,
          descriptionCheck: element,
        });
    });

    this.formateSectorDataDefualt.sort((a: any, b: any) => {
      return (
        this.defaultIndustrialItems.indexOf(a.descriptionCheck) -
        this.defaultIndustrialItems.indexOf(b.descriptionCheck)
      );
    });
  }

  periods_analyst: any = [];
  item_name_Analyst: any = [];
  formateSectorData_analyst: any = [];
  sectorOject_analyst: any = {};
  show_loader: boolean = false;
  getanalystTableData(id: any) {
    this.sectorOject_analyst = {};
    this.periods_analyst = [];
    this.item_name_Analyst = [];
    this.show_loader = false;
    this.formateSectorData_analyst = [];
    this.financialMarketData
      .getmanagementGuidancePerformance(
        this.set_period_management,
        this.company_id
      )
      .subscribe(
        (res) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);
          var analystData = res;
          this.show_loader = true;
          for (var i = 0; i < analystData.length; i++) {
            if (!this.periods_analyst.includes(analystData[i].startDate)) {
              this.periods_analyst.push(analystData[i].startDate);
            }

            if (!this.item_name_Analyst.includes(analystData[i].feItem)) {
              this.item_name_Analyst.push({
                name: analystData[i].feItem,
                high: analystData[i].highValue,
                low: analystData[i].lowValue,
                actual: analystData[i].actualValue,
                date: analystData[i].startDate,
              });
            }
          }
          this.periods_analyst.sort(
            (a: any, b: any) => +new Date(a) - +new Date(b)
          );

          this.item_name_Analyst.map((val1: any, index1: any) => {
            analystData.map((val2: any, index2: any) => {
              if (val1.name == val2.feItem && val1.date == val2.startDate) {
                let dev: any;
                dev = this.deviationcalculate(
                  val2.actualValue,
                  val2.highValue,
                  val2.lowValue
                );
                var index = this.formateSectorData_analyst.findIndex(
                  (data: any) =>
                    data['high-' + val1['date']] == val2.highValue &&
                    data['low-' + val1['date']] == val2.lowValue &&
                    data['actual-' + val1['date']] == val2.actualValue &&
                    data['deviation-' + val1['date']] == dev
                );
                if (index > -1) {
                } else {
                  this.sectorOject_analyst = {};
                }
                const newKey = val1['date'];
                this.sectorOject_analyst['low-' + newKey] = val1.low;
                this.sectorOject_analyst['high-' + newKey] = val1.high;
                this.sectorOject_analyst['actual-' + newKey] = val1.actual;
                this.sectorOject_analyst['deviation-' + newKey] = dev;
                // this.sectorOject_analyst['actual-' + newKey] = val1.actual;
                let curUnit;
                if (val2.currency && val2.unit) {
                  curUnit = `(${val2.currency} ${val2.unit})`;
                } else if (val2.currency && !val2.unit) {
                  curUnit = `(${val2.currency})`;
                } else if (!val2.currency && val2.unit) {
                  curUnit = `(${val2.unit})`;
                }
                curUnit = curUnit ?? '';
                this.sectorOject_analyst = {
                  ...this.sectorOject_analyst,
                  description: val2.description + ' ' + curUnit,
                };
                this.formateSectorData_analyst = [
                  ...this.formateSectorData_analyst,
                  this.sectorOject_analyst,
                ];
                this.formateSectorData_analyst =
                  this.formateSectorData_analyst.reduce(
                    (acc: any, val: any, ind: any) => {
                      const index = acc.findIndex(
                        (el: any) => el.description === val.description
                      );
                      if (index !== -1) {
                        const key = Object.keys(val)[0];
                        const key1 = Object.keys(val)[1];
                        const key2 = Object.keys(val)[2];
                        const key3 = Object.keys(val)[3];
                        acc[index][key] = val[key];
                        acc[index][key1] = val[key1];
                        acc[index][key2] = val[key2];
                        acc[index][key3] = val[key3];
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
        },
        (err) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);
        }
      );
  }
  deviationcalculate(actualval: any, highval: any, lowval: any) {
    let dev: any;
    actualval = actualval ?? 0;
    if (actualval != '' && highval != '' && lowval != '') {
      if (actualval > highval && actualval > lowval) {
        if (highval == 0.0 || highval == 0) {
          dev = '';
          return dev;
        } else {
          dev = (actualval - highval) / highval;
          dev = dev * 100;
          return dev;
        }
      } else if (actualval < lowval) {
        if (lowval == 0.0 || highval == 0) {
          dev = '';
          return dev;
        } else {
          dev = (lowval - actualval) / lowval;
          dev = dev * 100;
          return dev;
        }
      } else if (actualval > lowval && actualval < highval) {
        dev = 'in-line';
        return dev;
      }
    } else {
      dev = '';
      return dev;
    }
  }

  workbook: ExcelProper.Workbook = new Excel.Workbook();
  blobType: string =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  mngGuidExcelDownload() {
    let headerData = this.periods_analyst;
    let tabledataValues = this.formateSectorData_analyst;

    this.workbook = new Excel.Workbook();

    let base64Image =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOYAAAAxCAYAAADOUdUsAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA49pVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ4IDc5LjE2NDAzNiwgMjAxOS8wOC8xMy0wMTowNjo1NyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOmMwNWZhOGI3LWUwMzUtMTM0My1hZWQ3LWViMTk4ZmYwNDYxNSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpEOUVGQzNDNTkyMDUxMUVCOERFN0IyQTE1QUNDNDBEMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpEOUVGQzNDNDkyMDUxMUVCOERFN0IyQTE1QUNDNDBEMSIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMSAoV2luZG93cykiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDplN2RjMTY1ZS0xOTMzLWY3NGUtOGY0ZS00ZGY1ODQ3MzdmODUiIHN0UmVmOmRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDpjMDVmYThiNy1lMDM1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';

    let imageId2 = this.workbook.addImage({
      base64: base64Image,
      extension: 'png',
    });
    let worksheet = this.workbook.addWorksheet(
      'Management Guidance Deviation',
      { views: [{ showGridLines: false }] }
    );
    worksheet.getColumn(1).border = {
      top: { style: 'thin', color: { argb: 'FFFFFF' } },
      bottom: { style: 'thin', color: { argb: 'FFFFFF' } },
    };
    worksheet.getRow(1).height = 40;
    worksheet.addImage(imageId2, 'B1:B1');

    let headingList: any = [];

    headerData.forEach((heading: any) => {
      headingList.push(
        { header: '', key: `high-${heading}`, width: 10 },
        {
          header: '',
          key: `low-${heading}`,
          width: 10,
        },
        {
          header: '',
          key: `actual-${heading}`,
          width: 10,
        },
        {
          header: '',
          key: `deviation-${heading}`,
          width: 10,
        }
      );
    });

    worksheet.columns = [
      { header: '', key: 'space', width: 5 },
      { header: '', key: 'description', width: 25 },

      ...headingList,
    ];

    let obj: any = {};
    let objHeader: any = {};
    let companyKey: any = {};
    var companyNameObj: any = {};
    headerData.forEach((heading: any, i: any) => {
      let newObj: any = {};
      let newObjHeader: any = {};
      const dates = heading.split('-');
      if (i == 0) {
        companyKey = `high-${heading}`;
        companyNameObj[companyKey] = this.comapny_name;
      }
      newObj[`high-${heading}`] = '';

      let date = new Date(heading);
      let shortMonth = date.toLocaleString('en-US', {
        month: 'short',
      });
      newObj[`low-${heading}`] = `${shortMonth}-${dates[0]}`;

      newObj[`actual-${heading}`] = '';
      newObj[`deviation-${heading}`] = '';
      objHeader[`high-${heading}`] = 'High';
      objHeader[`low-${heading}`] = 'Low';
      objHeader[`actual-${heading}`] = 'Actual';
      objHeader[`deviation-${heading}`] = 'Deviation';
      objHeader = { ...objHeader, ...newObjHeader };
      obj = { ...obj, ...newObj };
    });

    worksheet.addRow([]);
    worksheet.addRow([]);

    worksheet.addRow({
      space: '',
      description: 'Company',
      ...companyNameObj,
    });

    worksheet.addRow([]);

    let rowf = worksheet.addRow({
      space: '',
      description: 'Particulars',
      ...obj,
    });

    let rownest = worksheet.addRow({
      space: '',
      description: '',
      ...objHeader,
    });

    worksheet.getRow(6).eachCell({ includeEmpty: true }, function (cell) {
      worksheet.getCell(cell.address).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '203764' },
      };
      worksheet.getCell(cell.address).border = {
        top: { style: 'thin' },
        right: { style: 'thin' },
      };
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
    });

    rowf.font = { color: { argb: 'FFFFFF' } };
    rownest.font = { color: { argb: 'FFFFFF' } };
    rownest.alignment = {
      vertical: 'middle',
      horizontal: 'center',
      wrapText: true,
    };
    rowf.font = {
      name: 'Arial',
      size: 10,
      bold: true,
    };
    rownest.font = {
      name: 'Arial',
      size: 10,
      bold: true,
    };
    worksheet.getColumn(1).border = {
      top: { style: 'thin', color: { argb: 'FFFFFF' } },
      bottom: { style: 'thin', color: { argb: 'FFFFFF' } },
    };

    let clonedTabledataValues = tabledataValues.map((a: any) => ({ ...a }));

    clonedTabledataValues.forEach((data: any) => {
      for (const key in data) {
        if (data[key] === '' || data[key] === null) {
          data[key] = '-';
        } else if (key !== 'description' && data[key] !== 'in-line') {
          data[key] = this.util.standardFormat(data[key], 2, '');
        }
      }
    });

    clonedTabledataValues.map((da: any) => {
      let objnew: any = {};
      objnew['space'] = '';
      let dataRow = { ...objnew, ...da };
      worksheet.addRow(dataRow);
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

    worksheet.getColumn(2).alignment = {
      vertical: 'middle',
      horizontal: 'left',
    };
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
      size: 11,
    };
    worksheet.getCell('C4').font = {
      name: 'Arial',
      size: 10,
    };
    rowf.alignment = {
      vertical: 'middle',
      horizontal: 'center',
    };
    worksheet.getRow(6).font = {
      name: 'Arial',
      bold: true,
      size: 10,
      color: { argb: 'FFFFFF' },
    };
    worksheet.getRow(7).font = {
      name: 'Arial',
      bold: true,
      size: 10,
      color: { argb: 'FFFFFF' },
    };

    worksheet.properties.showGridLines = false;

    this.workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], { type: this.blobType });
      saveAs(blob, `${this.comapny_name} - Management Guidance Deviation.xlsx`);
    });
  }

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
  formateSectorData1Ref: any = [
    'Sales/Revenue',
    'Depreciation & Amortization',
    'Gross Income',
    'EBIT (Operating Income)',
    'Interest Expense',
    'Net Income',
  ];

  formatBankingSectorData1Ref: any = [
    'Interest Income',
    'Total Interest Expense',
    'Net Interest Income',
    'Non-Interest Income',
    'Operating Income',
    'Net Income',
  ];

  formatMiscellaneousSectorData1Ref: any = [
    'Sales/Revenue',
    'Interest Income',
    'Total Interest Expense',
    'Selling, General & Administrative Expense',
    'Operating Income',
    'Net Income',
  ];

  formatInsuranceServicesSectorData1Ref: any = [
    'Sales/Revenue',
    'Premiums Earned',
    'Losses, Claims & Reserves',
    'Operating Income Before Interest Expense',
    'Interest Expense',
    'Net Income',
  ];

  balanceSheetRef: any = [
    'Cash & Short Term Investments',
    'Total Current Assets',
    'Total Assets',
    'Total Current Liabilities',
    'Total Liabilities',
    'Total Equity',
  ];

  balanceSheetBankingRef: any = [
    'Total Cash & Due from Banks',
    'Net Loans',
    'Total Assets',
    'Total Deposits',
    'Total Liabilities',
    'Total Equity',
  ];

  balanceSheetMiscellaneousRef: any = [
    'Cash & Short Term Investments',
    'Total Investments',
    'Total Assets',
    'Total Debt',
    'Total Liabilities',
    'Total Equity',
  ];

  balanceSheetInsuranceRef: any = [
    'Total Investments',
    'Premium Balance Receivables',
    'Total Assets',
    'Insurance Policy Liabilities (Insurance)',
    'Total Liabilities',
    'Total Equity',
  ];

  cashFlowRef: any = [
    'Net Income (Incl. Non-Cash Adj.)',
    'Changes in Working Capital',
    'Net Operating Cash Flow',
    'Net Investing Cash Flow',
    'Net Financing Cash Flow',
    'Net Change in Cash',
  ];

  cashFlowBankingRef: any = [
    'Funds from Operations',
    'Changes in Working Capital',
    'Net Operating Cash Flow',
    'Net Investing Cash Flow',
    'Net Financing Cash Flow',
    'Net Change in Cash',
  ];

  cashFlowMiscellaneousRef: any = [
    'Funds from Operations',
    'Changes in Working Capital',
    'Net Operating Cash Flow',
    'Net Investing Cash Flow',
    'Net Financing Cash Flow',
    'Net Change in Cash',
  ];

  cashFlowInsuranceRef: any = [
    'Funds from Operations',
    'Changes in Working Capital',
    'Net Operating Cash Flow',
    'Net Investing Cash Flow',
    'Net Financing Cash Flow',
    'Net Change in Cash',
  ];

  ratioRef: any = [
    'EBITDA Margin',
    'PAT Margin',
    'Return on Equity',
    'Return on Capital Employed',
    'Gross Debt/EBITDA',
    'Earnings per Share',
  ];

  ratioBankingRef: any = [
    'Net Interest Margin',
    'Cost to Income',
    'Non Interest Income/Total Income',
    'Loans/Deposits',
    'Loan Provision/Total Assets',
    'Deposit Growth',
  ];

  ratioMiscellaneousRef: any = [
    'Cost to Income',
    'EBITDA Margin',
    'PBT Margin',
    'Gross Debt/EBITDA',
    'Earnings per Share',
    'Dividend Yield',
  ];

  ratioInsuranceRef: any = [
    'Loss Ratio',
    'Expense Ratio',
    'Combined Ratio',
    'Investment Yield',
    'Insurance Leverage',
    'Premium Growth',
  ];

  formateSectorData1: any = [];
  defaultIncomeStatement: any = [];
  defaultBalanceSheet: any = [];
  defaultCashFlow: any = [];
  defaultRatio: any = [];
  formateSectorData3: any = [];
  formateSectorData4: any = [];
  formateSectorData7: any = [];
  sectorOject3: any = {};
  sectorOject4: any = {};

  sectorOject1: any = {};
  formateSectorData2: any = [];
  sectorOject2: any = {};
  period_finance: any = 'yearly';
  companydata: any;
  showFinancialsPvt: any = true;
  fromFinDate: any;
  getFinancialData(id: any, currency: any) {
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
      .getFinancialData(
        id,
        currency,
        this.period_finance,
        this.isPrivateForiegnCompanyActive
      )
      .subscribe(
        (res: any) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);
          this.companydata = {
            id: id,
            currency: currency,
            period: this.period_finance,
          };
          this.finance_data = res.body;

          if (res.status === 204 && this.isPrivateCompanyActive) {
            this.showFinancialsPvt = false;
          }

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
          this.periods1.sort((a: any, b: any) => +new Date(b) - +new Date(a));
          // Calculate from date for financials
          this.fromFinDate = new Date(this.periods1[this.periods1.length - 1]);

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

          if (this.company_info?.ticsIndustryName == 'Banking Services') {
            this.formateSectorData1Ref = this.formatBankingSectorData1Ref;
            this.balanceSheetRef = this.balanceSheetBankingRef;
            this.cashFlowRef = this.cashFlowBankingRef;
            this.ratioRef = this.ratioBankingRef;
          } else if (
            this.company_info?.ticsIndustryName == 'Insurance Services'
          ) {
            this.formateSectorData1Ref =
              this.formatInsuranceServicesSectorData1Ref;
            this.balanceSheetRef = this.balanceSheetInsuranceRef;
            this.cashFlowRef = this.cashFlowInsuranceRef;
            this.ratioRef = this.ratioInsuranceRef;
          } else if (
            this.company_info?.ticsIndustryName ==
            'Miscellaneous Financial Services'
          ) {
            this.formateSectorData1Ref = this.formatMiscellaneousSectorData1Ref;
            this.balanceSheetRef = this.balanceSheetMiscellaneousRef;
            this.cashFlowRef = this.cashFlowMiscellaneousRef;
            this.ratioRef = this.ratioMiscellaneousRef;
          }

          this.defaultIncomeStatement = this.formateSectorData1.filter(
            (ele: any) => {
              return this.formateSectorData1Ref.includes(ele.description);
            }
          );

          this.defaultIncomeStatement.sort((a: any, b: any) => {
            return (
              this.formateSectorData1Ref.indexOf(a.description) -
              this.formateSectorData1Ref.indexOf(b.description)
            );
          });

          this.defaultBalanceSheet = this.formateSectorData2.filter(
            (ele: any) => {
              return this.balanceSheetRef.includes(ele.description);
            }
          );

          this.defaultBalanceSheet.sort((a: any, b: any) => {
            return (
              this.balanceSheetRef.indexOf(a.description) -
              this.balanceSheetRef.indexOf(b.description)
            );
          });

          this.defaultBalanceSheet = this.formateSectorData2.filter(
            (ele: any) => {
              return this.balanceSheetRef.includes(ele.description);
            }
          );

          this.defaultBalanceSheet.sort((a: any, b: any) => {
            return (
              this.balanceSheetRef.indexOf(a.description) -
              this.balanceSheetRef.indexOf(b.description)
            );
          });

          this.defaultCashFlow = this.formateSectorData3.filter((ele: any) => {
            return this.cashFlowRef.includes(ele.description);
          });

          this.defaultCashFlow.sort((a: any, b: any) => {
            return (
              this.cashFlowRef.indexOf(a.description) -
              this.cashFlowRef.indexOf(b.description)
            );
          });

          this.defaultRatio = this.formateSectorData7.filter((ele: any) => {
            return this.ratioRef.includes(ele.desc);
          });
          const ratioDataEPS = this.formateSectorData4.filter((ele: any) => {
            return this.ratioRef.includes(ele.desc);
          });

          for (let i = 0; i < this.formateSectorData4.length; i++) {
            if (
              i == this.formateSectorData4.length - 1 &&
              this.company_info?.ticsIndustryName ==
                'Miscellaneous Financial Services'
            ) {
              this.defaultRatio.push(this.formateSectorData4[i]);
            }
          }

          this.defaultRatio.sort((a: any, b: any) => {
            return (
              this.ratioRef.indexOf(a.desc) - this.ratioRef.indexOf(b.desc)
            );
          });
          this.defaultRatio.push(ratioDataEPS[0]);
          this.defaultRatio.map((ele: any) => {
            if (ele) {
              ele.description = `${ele?.shortName}  (${
                ele?.unit ? ele?.unit : ele?.currency
              })`;
            }
          });
        },
        (err) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);
        }
      );
  }

  getPrivateComapnyFinancialData(id: any, currency: any) {
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
      .getIndianPrivateFinancialData(id, currency, this.period_finance)
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
          this.periods1.sort((a: any, b: any) => +new Date(b) - +new Date(a));
          // Calculate from date for financials
          this.fromFinDate = new Date(this.periods1[this.periods1.length - 1]);

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

          if (this.company_info?.ticsIndustryName == 'Banking Services') {
            this.formateSectorData1Ref = this.formatBankingSectorData1Ref;
            this.balanceSheetRef = this.balanceSheetBankingRef;
            this.cashFlowRef = this.cashFlowBankingRef;
            this.ratioRef = this.ratioBankingRef;
          } else if (
            this.company_info?.ticsIndustryName == 'Insurance Services'
          ) {
            this.formateSectorData1Ref =
              this.formatInsuranceServicesSectorData1Ref;
            this.balanceSheetRef = this.balanceSheetInsuranceRef;
            this.cashFlowRef = this.cashFlowInsuranceRef;
            this.ratioRef = this.ratioInsuranceRef;
          } else if (
            this.company_info?.ticsIndustryName ==
            'Miscellaneous Financial Services'
          ) {
            this.formateSectorData1Ref = this.formatMiscellaneousSectorData1Ref;
            this.balanceSheetRef = this.balanceSheetMiscellaneousRef;
            this.cashFlowRef = this.cashFlowMiscellaneousRef;
            this.ratioRef = this.ratioMiscellaneousRef;
          }

          this.defaultIncomeStatement = this.formateSectorData1.filter(
            (ele: any) => {
              return this.formateSectorData1Ref.includes(ele.description);
            }
          );

          this.defaultIncomeStatement.sort((a: any, b: any) => {
            return (
              this.formateSectorData1Ref.indexOf(a.description) -
              this.formateSectorData1Ref.indexOf(b.description)
            );
          });

          this.defaultBalanceSheet = this.formateSectorData2.filter(
            (ele: any) => {
              return this.balanceSheetRef.includes(ele.description);
            }
          );

          this.defaultBalanceSheet.sort((a: any, b: any) => {
            return (
              this.balanceSheetRef.indexOf(a.description) -
              this.balanceSheetRef.indexOf(b.description)
            );
          });

          this.defaultBalanceSheet = this.formateSectorData2.filter(
            (ele: any) => {
              return this.balanceSheetRef.includes(ele.description);
            }
          );

          this.defaultBalanceSheet.sort((a: any, b: any) => {
            return (
              this.balanceSheetRef.indexOf(a.description) -
              this.balanceSheetRef.indexOf(b.description)
            );
          });

          this.defaultCashFlow = this.formateSectorData3.filter((ele: any) => {
            return this.cashFlowRef.includes(ele.description);
          });

          this.defaultCashFlow.sort((a: any, b: any) => {
            return (
              this.cashFlowRef.indexOf(a.description) -
              this.cashFlowRef.indexOf(b.description)
            );
          });

          this.defaultRatio = this.formateSectorData7.filter((ele: any) => {
            return this.ratioRef.includes(ele.desc);
          });
          const ratioDataEPS = this.formateSectorData4.filter((ele: any) => {
            return this.ratioRef.includes(ele.desc);
          });

          for (let i = 0; i < this.formateSectorData4.length; i++) {
            if (
              i == this.formateSectorData4.length - 1 &&
              this.company_info?.ticsIndustryName ==
                'Miscellaneous Financial Services'
            ) {
              this.defaultRatio.push(this.formateSectorData4[i]);
            }
          }

          this.defaultRatio.sort((a: any, b: any) => {
            return (
              this.ratioRef.indexOf(a.desc) - this.ratioRef.indexOf(b.desc)
            );
          });
          this.defaultRatio.push(ratioDataEPS[0]);

          this.defaultRatio.map((ele: any) => {
            if (ele) {
              ele.description = `${ele?.shortName}  (${
                ele?.unit ? ele?.unit : ele?.currency
              })`;
            }
          });
        },
        (err) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);
        }
      );
  }

  selectMeanData = [
    {
      id: 'mean',
      text: 'Mean',
    },
    {
      id: 'median',
      text: 'Median',
    },
    {
      id: 'high',
      text: 'High',
    },
    {
      id: 'low',
      text: 'Low',
    },
    {
      id: 'stdDiv',
      text: 'Standard Deviation',
    },
  ];

  selectcompfileData = [
    {
      id: 'All Filings',
      text: 'All Filings',
    },
    // {
    //   id: 'Annual',
    //   text: 'Annual',
    // },
    // {
    //   id: 'Quarterly',
    //   text: 'Quarterly',
    // },
    // {
    //   id: 'Interim',
    //   text: 'Interim',
    // },
    // {
    //   id: 'Pre Annual',
    //   text: 'Pre Annual',
    // },
    // {
    //   id: 'SC 13G',
    //   text: 'SC 13G',
    // },
  ];

  selectedmean: any;
  getSet(e: any) {
    this.count_res = 0;
    this.total_count_res = 1;
    this.loaderService.display(true);
    this.set_period = e;
    this.getEstimateData(this.company_id);
  }

  selectedQuarterly: any = false;
  getSet2(e: any) {
    this.defaultIncomeStatement = [];
    this.defaultBalanceSheet = [];
    this.defaultCashFlow = [];
    this.defaultRatio = [];
    if (e === 'yearly' || e === 'semiann') {
      this.selectedQuarterly = false;
    } else {
      this.selectedQuarterly = true;
    }
    this.period = e;
    this.count_res = 0;
    this.total_count_res = 1;
    this.loaderService.display(true);
    this.period_finance = e;
    this.getFinancialData(this.company_id, this.currency);
  }

  getSet3(e: any) {
    this.count_res = 0;
    this.total_count_res = 1;
    this.loaderService.display(true);
    this.set_period_management = e;
    this.getanalystTableData(this.company_id);
  }

  navigateToSection(section: string) {
    this.selectedParentSet = section;
    // window.location.hash = '';
    // window.location.hash = section;
    document
      .getElementById(`${section}`)
      ?.scrollIntoView({ behavior: 'smooth' });
  }

  tabToBeHighlighted: string = 'summary_tab';
  highlightTab(tab: string) {
    let element = document.querySelector('.newcompny-tabs') as HTMLElement;
    this.selectedParentSet = tab;
  }

  // scrollToSection(tab:string){
  //   const presentTab = document.getElementById(tab)
  //   presentTab?.scrollIntoView()
  // }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    let element = document.querySelector('.navbar') as HTMLElement;
    if (window?.pageYOffset > element?.clientHeight) {
      element?.classList.add('navbar-inverse');
    } else {
      element?.classList.remove('navbar-inverse');
    }
  }

  // lineGraph() {
  //   var chart = am4core.create('chartdiv', am4charts.PieChart);

  //   // Add data
  //   chart.data = [
  //     {
  //       country: 'Commercial Paper - Unsec.',
  //       litres: 545600,
  //       color: am4core.color('#4472c4'),
  //     },
  //     {
  //       country: 'Other Borrowings',
  //       litres: 34841,
  //       color: am4core.color('#ed7d31'),
  //     },
  //     {
  //       country: 'Other Borrowings - Sec',
  //       litres: 32756,
  //       color: am4core.color('#ffc000'),
  //     },
  //     {
  //       country: 'Other Borrowings - Unsec',
  //       litres: 103000,
  //       color: am4core.color('#5b9bd5'),
  //     },
  //     {
  //       country: 'Prev. Placement notes - Sec',
  //       litres: 78860,
  //       color: am4core.color('#179172'),
  //     },
  //     {
  //       country: 'Prev. Placement notes - Unsec',
  //       litres: 511050,
  //       color: am4core.color('#ffc75f'),
  //     },
  //     {
  //       country: 'Sec. 1st Lien TL',
  //       litres: 24200,
  //       color: am4core.color('#ff9671'),
  //     },
  //     {
  //       country: 'Senior Unsec.',
  //       litres: 416385,
  //       color: am4core.color('#67b7dc'),
  //     },
  //     {
  //       country: 'Unsec. TL',
  //       litres: 826771,
  //       color: am4core.color('#a367dc'),
  //     },
  //   ];

  //   // Add and configure Series
  //   var pieSeries = chart.series.push(new am4charts.PieSeries());
  //   pieSeries.dataFields.value = 'litres';
  //   pieSeries.dataFields.category = 'country';
  //   pieSeries.slices.template.strokeWidth = 2;
  //   pieSeries.slices.template.strokeOpacity = 1;
  //   pieSeries.labels.template.fill = am4core.color('#ffc000');
  //   pieSeries.labels.template.fontSize = 10;
  //   pieSeries.slices.template.propertyFields.fill = 'color';
  //   // This creates initial animation
  //   pieSeries.ticks.template.disabled = false;
  //   pieSeries.ticks.template.fill = am4core.color('#ffc000');
  //   pieSeries.labels.template.text = '{value.percent}%';

  //   // pieSeries.ticks.template.strokeWidth = 5;
  //   // pieSeries.ticks.template.strokeOpacity = 5;
  //   // pieSeries.hiddenState.properties.opacity = 1;
  // }

  maturity_chart: any = [];
  periods_mature: any = [];
  item_list: any = [];
  maturity_Data_chart: any = [];
  maturityChartDataExpanded: any = [];
  filterMaturityData: any = [];
  lastCategoryValue: any = '';
  getMaturityData(currency: any, id: any) {
    this.periods_mature = [];
    this.maturity_chart = [];
    this.item_list = [];
    this.maturity_Data_chart = [];
    this.financialMarketData.getMaturityData(currency, id).subscribe(
      (res) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);

        for (var i = 0; i < res.length; i++) {
          if (!this.periods_mature.includes(res[i].maturityYear)) {
            this.periods_mature.push(res[i].maturityYear);
          }
          if (!this.item_list.includes(res[i].instrumentType)) {
            this.item_list.push(res[i].instrumentType);
          }
        }

        // for (var i = 0; i < res.length; i++) {
        //   for (var j = 0; j < this.periods_mature.length; j++) {
        //     if (res[i].maturityYear == this.periods_mature[j]) {
        //       for (var k = 0; k < this.item_list.length; k++) {
        //         if (res[i].instrumentType == this.item_list[k]) {
        //           this.item_objList = {};
        //           this.item_objList['value' + (k + 1)] = res[i].outstandingAmount;
        //           this.maturity_chart.push({
        //             category: this.periods_mature[j],
        //             ...this.item_objList,
        //           });
        //         }
        //       }
        //     }
        //   }
        // }

        let item_array = [];
        for (var i = 0; i < res.length; i++) {
          let sho: any = {};
          sho[res[i].instrumentType.replace(/\s+/g, '').toLowerCase()] =
            Math.round(res[i].outstandingAmount);
          item_array.push({
            category: res[i].maturityYear,
            instrumentType: res[i].instrumentType,
            ...sho,
          });
        }
        this.maturityChartDataExpanded = res;
        let item_of_year: any = [];
        let finalObj: any = [];
        item_array.map((ele) => {
          item_of_year.push(ele.category);
        });
        const uniqueList = [...new Set(item_of_year)];

        uniqueList.map((list) => {
          finalObj.push({
            category: list,
          });
        });
        item_array.map((ele) => {
          const ItemYear = ele.category;
          finalObj.map((obj: any, index: any) => {
            if (obj.category === ItemYear) {
              finalObj[index] = Object.assign(ele, obj);
            }
          });
        });
        // let currentYear = (new Date()).getFullYear();

        // let finalResult: any = [];

        // for (currentYear; currentYear <= currentYear + 5; currentYear++) {

        //   finalObj.forEach((el: any) => {

        //     if (currentYear <= el.category) {

        //       finalResult.push(el);

        //     }

        //   });

        // }

        // this.maturity_chart = finalResult;

        let tempChartData: any = [];
        let finalChartData: any = [];
        this.maturity_Data_chart = finalObj;
        this.maturity_chart = finalObj;
        let currentYear = new Date().getFullYear();

        if (this.maturity_Data_chart.length) {
          this.maturity_Data_chart.sort((a: any, b: any) =>
            a.category > b.category ? 1 : b.category > a.category ? -1 : 0
          );
          this.maturity_Data_chart.map((val: any, ind: any) => {
            if (
              val &&
              val.category &&
              val.category.charAt(val.category.length - 1) == '+'
            ) {
              this.maturity_Data_chart[ind].category = val.category.slice(
                0,
                -1
              );
              this.maturity_Data_chart[ind][
                val.instrumentType.replace(/\s+/g, '').toLowerCase()
              ] = this.lastCategoryValue;
            }
          });

          this.maturity_Data_chart = this.maturity_Data_chart.filter(
            (el: any) => el.category !== null
          );
          let yearRange: any;
          if (this.maturity_Data_chart.length < 6) {
            yearRange =
              this.maturity_Data_chart[this.maturity_Data_chart.length - 1]
                .category - currentYear;
          }

          yearRange = yearRange ?? 5;

          let tempYear = currentYear;
          for (let i = tempYear; i < tempYear + yearRange + 1; i++) {
            let isThere = true;
            this.maturity_Data_chart.forEach((element: any) => {
              if (element.category == i) {
                isThere = false;
              }
            });
            if (isThere) {
              this.maturity_Data_chart.push({
                category: i.toString(),
                instrumentType: 'Senior Unsec.',
              });
            }
          }

          this.maturity_Data_chart.sort(function (a: any, b: any) {
            var keyA = new Date(a.category),
              keyB = new Date(b.category);
            // Compare the 2 dates
            if (keyA < keyB) return -1;
            if (keyA > keyB) return 1;
            return 0;
          });

          //converting category string to number
          this.maturity_Data_chart.forEach((element: any, index: any) => {
            element.category = element.category;
          });

          //pushing all data from the current year
          this.maturity_Data_chart.forEach((element: any) => {
            if (tempYear <= element.category) {
              tempChartData.push(element);
            }
          });

          //splitting the all data after the 10th array
          let afterTenthIndexValue: any = [];
          tempChartData.forEach((element: any, index: any) => {
            if (index > 5) {
              afterTenthIndexValue.push(element);
            } else {
              element.category = element.category.toString();
              finalChartData.push(element);
              if (index == 5) {
                element.category = element.category + '+';
              }
            }
          });
          // adding the all data to the last index of array
          let temp10th: any = {};
          afterTenthIndexValue.forEach((e: any) => {
            Object.entries(e).forEach(([keyOfEnd, valueOfEnd]: any) => {
              if (keyOfEnd != 'category') {
                if (temp10th[keyOfEnd]) {
                  temp10th[keyOfEnd] = temp10th[keyOfEnd] + valueOfEnd;
                } else {
                  temp10th[keyOfEnd] = valueOfEnd;
                }
              }
            });
          });
          if (finalChartData[5] !== undefined && temp10th !== undefined) {
            // Object.assign(finalChartData[5], temp10th);
            Object.entries(temp10th).forEach(([keyOfEnd, valueOfEnd]: any) => {
              if (keyOfEnd != 'category') {
                if (temp10th[keyOfEnd]) {
                  if (finalChartData[5][keyOfEnd]) {
                    finalChartData[5][keyOfEnd] =
                      temp10th[keyOfEnd] + finalChartData[5][keyOfEnd];
                  } else {
                    finalChartData[5][keyOfEnd] = temp10th[keyOfEnd];
                  }
                } else {
                  finalChartData[5][keyOfEnd] = valueOfEnd;
                }
              }
            });
          }
        }
        this.stackGraph(finalChartData);
      },
      (err) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);
      }
    );
  }
  stackGraph(chartData?: any) {
    if (this.filterMaturityData.length == 6) {
      if (
        this.filterMaturityData[5].category.charAt(
          this.filterMaturityData[5].category.length - 1
        ) == '+'
      ) {
        this.filterMaturityData[5].category =
          this.filterMaturityData[5].category;
      } else {
        this.filterMaturityData[5].category =
          this.filterMaturityData[5].category + '+';
      }
    }
    this.showExpandIcon = true;
    am4core.useTheme(am4themes_animated);
    am4core.unuseTheme(am4themes_microchart);
    am4core.useTheme(am4themes_dataviz);
    var chart = am4core.create('chartdiv1', am4charts.XYChart);
    // $(document).ready(function () {
    //   $('g[aria-labelledby]').hide();
    // });
    am4core.options.commercialLicense = true;
    chart.data = chartData;
    if (chartData.length == 0) {
      this.showExpandIcon = false;
      let label = chart.createChild(am4core.Label);
      label.text = 'No Data Available';
      label.fill = am4core.color('#FFFFFF');
      label.fontSize = 13;
      label.horizontalCenter = 'middle';
      // label.fontFamily = 'Lucida Sans Unicode';
      label.isMeasured = false;
      label.x = am4core.percent(50);
      label.y = am4core.percent(30);
    }

    chart.cursor = new am4charts.XYCursor();

    var categoryAxis: any = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = 'category';
    categoryAxis.renderer.grid.template.location = 0;

    categoryAxis.renderer.minGridDistance = 40;
    categoryAxis.renderer.grid.template.disabled = true;
    categoryAxis.renderer.fontSize = 11;
    categoryAxis.renderer.line.stroke = am4core.color('#ffc000');
    categoryAxis.renderer.labels.template.fill = am4core.color('#ffc000');
    categoryAxis.renderer.labels.template.fontSize = 11;

    categoryAxis.renderer.line.strokeWidth = 2;
    categoryAxis.renderer.line.strokeOpacity = 1;
    categoryAxis.tooltip.background.cornerRadius = 3;
    categoryAxis.tooltip.label.fontSize = 9;
    categoryAxis.tooltip.label.padding(5, 5, 5, 5);

    let valueAxis: any = chart.yAxes.push(new am4charts.ValueAxis());

    valueAxis.tooltip.disabled = true;
    valueAxis.calculateTotals = true;
    valueAxis.renderer.minWidth = 50;
    valueAxis.renderer.grid.template.disabled = true;
    valueAxis.renderer.fontSize = 11;
    valueAxis.min = 0;
    valueAxis.renderer.inside = false;
    valueAxis.renderer.labels.template.disabled = false;
    valueAxis.renderer.line.stroke = am4core.color('#ffc000');
    valueAxis.renderer.labels.template.fill = am4core.color('#ffc000');
    valueAxis.renderer.line.strokeWidth = 2;
    valueAxis.renderer.labels.template.fontSize = 11;
    valueAxis.renderer.line.strokeOpacity = 1;

    chart.colors.list = [
      am4core.color('#4472c4'),
      am4core.color('#ed7d31'),
      am4core.color('#ffc000'),
      am4core.color('#5b9bd5'),
      am4core.color('#ed7d31'),
      am4core.color('#ffc000'),
      am4core.color('#ff9671'),
      am4core.color('#67b7dc'),
      am4core.color('#5b9bd5'),
    ];
    chart.padding(30, 30, 10, 30);
    for (var g = 0; g < this.item_list.length; g++) {
      createSeries(
        this.item_list[g].replace(/\s+/g, '').toLowerCase(),
        this.item_list[g]
      );
    }

    function createSeries(field: any, name: any) {
      var series1: any = chart.series.push(new am4charts.ColumnSeries());
      series1.name = name;
      series1.dataFields.valueY = field;
      series1.dataFields.categoryX = 'category';
      series1.columns.template.width = am4core.percent(60);
      series1.tooltipText = '{name}: {valueY}';
      series1.dataItems.template.locations.categoryX = 0.5;
      series1.stacked = true;
      series1.tooltip.pointerOrientation = 'vertical';
    }

    // if (this.maturity_chart.length === 0) {
    //   // Create label for no data available
    //   let label = chart.createChild(am4core.Label);
    //   label.text = 'No Data Available';
    //   label.horizontalCenter = 'middle';
    //   label.fontSize = 11;
    //   label.fill = am4core.color('#FFFFFF');
    //   label.fontFamily = 'Lucida Sans Unicode';
    //   label.isMeasured = false;
    //   label.x = am4core.percent(50);
    //   label.y = am4core.percent(30);
    // }
  }

  MaturityDialog() {
    this.auth.openPopupModal = true;
  }

  lineGraph2() {
    var chart = am4core.create('chartdiv2', am4charts.PieChart);
    // $(document).ready(function () {
    //   $('g[aria-labelledby]').hide();
    // });
    // Add data
    am4core.options.commercialLicense = true;
    chart.data = [
      {
        country: 'Promoters/Insiders',
        litres: 5324,
        color: am4core.color('#4472C4'),
      },
      {
        country: 'Institutions',
        litres: 2895,
        color: am4core.color('#ed7d31'),
      },
      {
        country: 'Public & Others',
        litres: 1781,
        color: am4core.color('#ffc000'),
      },
    ];

    // Add and configure Series
    var pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = 'litres';
    pieSeries.dataFields.category = 'country';
    pieSeries.slices.template.strokeWidth = 2;
    pieSeries.slices.template.strokeOpacity = 1;
    chart.legend = new am4charts.Legend();
    chart.legend.position = 'right';
    pieSeries.slices.template.propertyFields.fill = 'color';
    chart.legend.labels.template.fill = am4core.color('#ffc000');
    chart.legend.fontSize = 11;
    chart.legend.useDefaultMarker = true;
    // var marker = chart.legend.markers.template.children.getIndex(0);
    // marker.cornerRadius(12, 12, 12, 12);
    pieSeries.labels.template.fill = am4core.color('#ffc000');
    pieSeries.labels.template.fontSize = 10;
    pieSeries.slices.template.propertyFields.fill = 'color';
    pieSeries.ticks.template.disabled = false;
    pieSeries.ticks.template.fill = am4core.color('#ffc000');
    pieSeries.ticks.template.stroke = am4core.color('#ffc000');
    pieSeries.ticks.template.strokeWidth = 2;
    pieSeries.labels.template.text = '{value.percent}%';
    pieSeries.legendSettings.labelText = '{country}';
  }

  recommendGraph() {
    // Themes end

    // Create chart instance
    let chart = am4core.create('chartdiv4', am4charts.XYChart);
    // $(document).ready(function () {
    //   $('g[aria-labelledby]').hide();
    // });
    // Add data
    am4core.options.commercialLicense = true;
    chart.data = [
      {
        country: 'Mar 2021',
        visits: 2025,
      },
      {
        country: 'Apr 2021',
        visits: 1882,
      },
      {
        country: 'May 2021',
        visits: 1809,
      },
      {
        country: 'Jun 2021',
        visits: 1322,
      },
      {
        country: 'Jul 2021',
        visits: 1122,
      },
      {
        country: 'Aug 2021',
        visits: 1114,
      },
      {
        country: 'Sep 2021',
        visits: 984,
      },
      {
        country: 'Oct 2021',
        visits: 711,
      },
    ];

    // Create axes

    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = 'country';
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;
    categoryAxis.renderer.labels.template.fill = am4core.color('#ffc000');
    categoryAxis.renderer.labels.template.fontSize = 12;
    categoryAxis.renderer.labels.template.fill = am4core.color('#ffc000');
    categoryAxis.renderer.line.stroke = am4core.color('#ffc000');
    categoryAxis.renderer.line.strokeWidth = 2;
    categoryAxis.renderer.line.strokeOpacity = 1;
    categoryAxis.renderer.labels.template.rotation = -45;

    // categoryAxis.renderer.labels.template.adapter.add(
    //   'dy',
    //   function (dy:any, target:any) {
    //     if (target.dataItem && target.dataItem.index & (2 == 2)) {
    //       return dy + 25;
    //     }
    //     return dy;
    //   }
    // );

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.grid.template.stroke = am4core.color('#ffc000');
    valueAxis.renderer.labels.template.fill = am4core.color('#ffc000');
    valueAxis.renderer.labels.template.fontSize = 12;
    valueAxis.renderer.labels.template.fill = am4core.color('#ffc000');
    valueAxis.renderer.line.stroke = am4core.color('#ffc000');
    valueAxis.renderer.line.strokeWidth = 2;
    valueAxis.renderer.line.strokeOpacity = 1;

    // Create series
    let series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = 'visits';
    series.dataFields.categoryX = 'country';
    series.name = 'Total';
    series.columns.template.tooltipText = '{valueY}';
    series.columns.template.fillOpacity = 0.8;
    series.columns.template.width = am4core.percent(2);
    series.columns.template.fill = am4core.color('#67b7dc');
    let columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 2;
    columnTemplate.strokeOpacity = 1;
    chart.legend = new am4charts.Legend();
    //  chart.legend.position = 'right';
    //  pieSeries.slices.template.propertyFields.fill = 'color';
    chart.legend.labels.template.fill = am4core.color('#ffc000');
    chart.legend.fontSize = 11;

    am4core.useTheme(am4themes_animated);
  }

  showDebtProfilePvt: any = true;
  getDebtProfile(curreny: any, id: any) {
    this.debt_data = [];
    this.financialMarketData
      .getDebtprofileData(curreny, id)
      .subscribe((res) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);

        this.debt_data = res;

        if (!res.length && this.isPrivateCompanyActive) {
          this.showDebtProfilePvt = false;
        }
      });
  }

  manage_data: any = [];
  showMngPvt: any = true;
  getmanagementData(company: any, id: any) {
    this.manage_data = [];
    this.financialMarketData.getmanagementData(company, id).subscribe(
      (res) => {
        if (!res.length && this.isPrivateCompanyActive) {
          this.showMngPvt = false;
        }

        let managementData: any = [];
        res?.forEach((el: any) => {
          managementData.push({
            management: el.management,
            instrumentType: el.instrumentType,
            experience: el.experience ? el.experience + ' yrs' : '-',
            appointed: el.appointed,
            otherCompanies: el.otherCompanies?.replaceAll('#:#', ','),
            personId: el.personId,
            address: el.address,
            biography: el.biography,
            email: el.email,
            fax: el.fax,
            inceptionDate: el.inceptionDate,
            phone: el.phone,
          });
        });

        managementData.forEach((el: any) => {
          if (el.otherCompanies?.length > 80) {
            el.otherCompanies = el.otherCompanies.substring(0, 80) + '...';
          }
        });

        this.manage_data = managementData;
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);
      },
      (err) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);
      }
    );
  }
  stockCompany: any;

  StockPrice() {
    this.loaderService.display(true);
    this.total_count_res = 1;
    this.count_res = 0;
    let obj = {
      startDate: '1984-11-05',
      endDate: this.company_info.sharePriceDate,
      equity: [
        {
          code: this.company_id,
          exchange: this.company_info.exchangeCode,
          type: 'company',
          dataType: 'beta',
          name: this.comapny_name,
          periodicity: this.selectedperiod,
          filterList: [this.selectedindex],
          currency: '',
        },
        {
          code: this.company_id,
          exchange: this.company_info.exchangeCode,
          type: 'company',
          dataType: 'stockPrice',
          name: this.comapny_name,
          periodicity: this.selectedperiod,
          filterList: ['CLOSE'],
          currency: '',
        },
      ],
      economy: [],
    };

    this.financialMarketData.downloadstockExcel(obj).subscribe(
      (res: any) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);
        const blob = new Blob([res.body], {
          type: 'application/vnd.ms.excel',
        });
        const file = new File(
          [blob],
          '' + `StockPrice ${this.comapny_name}.xlsx`,
          {
            type: 'application/vnd.ms.excel',
          }
        );
        saveAs(file);
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
  }
  segmentExcell() {
    this.loaderService.display(true);
    this.total_count_res = 1;
    this.count_res = 0;
    this.financialMarketData
      .downloadstocksegment(this.company_id, this.comapny_name, this.currency)
      .subscribe(
        (res: any) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);
          const blob = new Blob([res.body], {
            type: 'application/vnd.ms.excel',
          });
          const file = new File(
            [blob],
            '' +
              `${this.comapny_name}_Segment Information_${new Date()
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
  }
  financialExcell() {
    this.auth.closeInsidePopup = true;
  }
  onFinancialExcelDownload(e: any) {
    if (this.isPrivateCompanyActive) {
      this.loaderService.display(true);
      this.total_count_res = 1;
      this.count_res = 0;
      let obj: any = {};

      if (this.company_info.countryCode === 'IND') {
        obj = {
          startDate: e.startDate
            ? this.datepipe.transform(e.startDate, 'yyyy-MM-dd')
            : '2015-09-30',
          endDate: e.endDate
            ? this.datepipe.transform(e.endDate, 'yyyy-MM-dd')
            : '2022-03-10',
          equity: [
            {
              code: this.company_info.cin,
              exchange: 'FACTSET',
              type: 'company',
              dataType: 'PNL',
              name: this.company_info.name,
              periodicity: 'yearly',
              filterList: [],
              currency: this.selectedcurrecny,
              entityType: 'Private',
            },
            {
              code: this.company_info.cin,
              exchange: 'FACTSET',
              type: 'company',
              dataType: 'balanceSheet',
              name: this.company_info.name,
              periodicity: 'yearly',
              filterList: [],
              currency: this.selectedcurrecny,
              entityType: 'Private',
            },
            {
              code: this.company_info.cin,
              exchange: 'FACTSET',
              type: 'company',
              dataType: 'cashFlow',
              name: this.company_info.name,
              periodicity: 'yearly',
              filterList: [],
              currency: this.selectedcurrecny,
              entityType: 'Private',
            },
            {
              code: this.company_info.cin,
              exchange: 'FACTSET',
              type: 'company',
              dataType: 'FR',
              name: this.company_info.name,
              periodicity: 'yearly',
              filterList: [],
              currency: this.selectedcurrecny,
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
              code: this.company_info.id,
              exchange: 'FACTSET',
              type: 'company',
              dataType: 'FR',
              name: this.company_info.name,
              periodicity: 'yearly',
              filterList: [],
              currency: this.selectedcurrecny,
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
                `${this.comapny_name}_Financials(${this.period})_${new Date()
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
          this.auth.closeInsidePopup = false;
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
      let obj: any;

      if (this.selectedQuarterly) {
        obj = {
          startDate: e.startDate
            ? this.datepipe.transform(e.startDate, 'yyyy-MM-dd')
            : '2015-09-30',
          endDate: e.endDate
            ? this.datepipe.transform(e.endDate, 'yyyy-MM-dd')
            : '2022-03-10',
          equity: [
            {
              code: this.company_id,
              exchange: 'FACTSET',
              type: 'company',
              dataType: 'PNL',
              name: this.comapny_name,
              periodicity: 'quarterly',
              filterList: [],
              currency: this.currency,
              entityType: '',
            },
            {
              code: this.company_id,
              exchange: 'FACTSET',
              type: 'company',
              dataType: 'balanceSheet',
              name: this.comapny_name,
              periodicity: 'quarterly',
              filterList: [],
              currency: this.currency,
            },
            {
              code: this.company_id,
              exchange: 'FACTSET',
              type: 'company',
              dataType: 'cashFlow',
              name: this.comapny_name,
              periodicity: 'quarterly',
              filterList: [],
              currency: this.currency,
            },
            {
              code: this.company_id,
              exchange: 'FACTSET',
              type: 'company',
              dataType: 'FR',
              name: this.comapny_name,
              periodicity: 'quarterly',
              filterList: [],
              currency: this.currency,
            },
            {
              code: this.company_id,
              exchange: 'FACTSET',
              type: 'company',
              dataType: 'VR',
              name: this.comapny_name,
              periodicity: 'quarterly',
              filterList: [],
              currency: this.currency,
            },
          ],
          economy: [],
        };
      } else if (this.period === 'semiann') {
        obj = {
          startDate: e.startDate
            ? this.datepipe.transform(e.startDate, 'yyyy-MM-dd')
            : '2019-09-30',
          endDate: e.endDate
            ? this.datepipe.transform(e.endDate, 'yyyy-MM-dd')
            : '2022-03-10',
          equity: [
            {
              code: this.company_id,
              exchange: 'FACTSET',
              type: 'company',
              dataType: 'PNL',
              name: this.comapny_name,
              periodicity: 'semiann',
              filterList: [],
              currency: this.currency,
              entityType: '',
            },
            {
              code: this.company_id,
              exchange: 'FACTSET',
              type: 'company',
              dataType: 'balanceSheet',
              name: this.comapny_name,
              periodicity: 'semiann',
              filterList: [],
              currency: this.currency,
            },
            {
              code: this.company_id,
              exchange: 'FACTSET',
              type: 'company',
              dataType: 'cashFlow',
              name: this.comapny_name,
              periodicity: 'semiann',
              filterList: [],
              currency: this.currency,
            },
            {
              code: this.company_id,
              exchange: 'FACTSET',
              type: 'company',
              dataType: 'FR',
              name: this.comapny_name,
              periodicity: 'semiann',
              filterList: [],
              currency: this.currency,
            },
            {
              code: this.company_id,
              exchange: 'FACTSET',
              type: 'company',
              dataType: 'VR',
              name: this.comapny_name,
              periodicity: 'semiann',
              filterList: [],
              currency: this.currency,
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
              code: this.company_id,
              exchange: 'FACTSET',
              type: 'company',
              dataType: 'PNL',
              name: this.comapny_name,
              periodicity: 'yearly',
              filterList: [],
              currency: this.currency,
              entityType: '',
            },
            {
              code: this.company_id,
              exchange: 'FACTSET',
              type: 'company',
              dataType: 'balanceSheet',
              name: this.comapny_name,
              periodicity: 'yearly',
              filterList: [],
              currency: this.currency,
            },
            {
              code: this.company_id,
              exchange: 'FACTSET',
              type: 'company',
              dataType: 'cashFlow',
              name: this.comapny_name,
              periodicity: 'yearly',
              filterList: [],
              currency: this.currency,
            },
            {
              code: this.company_id,
              exchange: 'FACTSET',
              type: 'company',
              dataType: 'FR',
              name: this.comapny_name,
              periodicity: 'yearly',
              filterList: [],
              currency: this.currency,
            },
            {
              code: this.company_id,
              exchange: 'FACTSET',
              type: 'company',
              dataType: 'VR',
              name: this.comapny_name,
              periodicity: 'yearly',
              filterList: [],
              currency: this.currency,
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
                `${this.comapny_name}_Financials(${this.period})_${new Date()
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
          this.auth.closeInsidePopup = false;
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

  downloadDebt() {
    this.loaderService.display(true);
    this.total_count_res = 1;
    this.count_res = 0;
    this.financialMarketData
      .downloaddebtexcell(this.entity_id, this.comapny_name, this.currency)
      .subscribe(
        (res: any) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);
          const blob = new Blob([res.body], {
            type: 'application/vnd.ms.excel',
          });
          const file = new File(
            [blob],
            '' + `debtdata${this.comapny_name}.xls`,
            {
              type: 'application/vnd.ms.excel',
            }
          );
          saveAs(file);
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
  }
  Managementexcell() {
    this.loaderService.display(true);
    this.total_count_res = 1;
    this.count_res = 0;
    this.financialMarketData
      .downloadmanagementexcell(this.entity_id, this.comapny_name)
      .subscribe(
        (res: any) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);
          const blob = new Blob([res.body], {
            type: 'application/vnd.ms.excel',
          });
          const file = new File(
            [blob],
            '' + `Management & Key Employees ${this.comapny_name}.xls`,
            {
              type: 'application/vnd.ms.excel',
            }
          );
          saveAs(file);
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
  }
  Analysexcell() {
    this.loaderService.display(true);
    this.total_count_res = 1;
    this.count_res = 0;
    this.financialMarketData
      .downloadanalystexcell(this.company_id, this.comapny_name)
      .subscribe(
        (res: any) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);
          const blob = new Blob([res.body], {
            type: 'application/vnd.ms.excel',
          });
          const file = new File(
            [blob],
            '' + `Analyst Recommendations ${this.comapny_name}.xls`,
            {
              type: 'application/vnd.ms.excel',
            }
          );
          saveAs(file);
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
  }
  EstimatesExcell() {
    this.loaderService.display(true);
    this.total_count_res = 1;
    this.count_res = 0;
    this.financialMarketData
      .downloadEstimatesExcell(this.company_id, this.comapny_name)
      .subscribe(
        (res: any) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);
          const blob = new Blob([res.body], {
            type: 'application/vnd.ms.excel',
          });
          const file = new File(
            [blob],
            '' + `Estimates - Consensus ${this.comapny_name}.xls`,
            {
              type: 'application/vnd.ms.excel',
            }
          );
          saveAs(file);
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
  }
  Events_Transcripts() {
    this.loaderService.display(true);
    this.total_count_res = 1;
    this.count_res = 0;
    this.financialMarketData
      .downloadEventsExcell(
        this.company_id,
        this.entity_id,
        this.security_id,
        this.comapny_name,
        this.currency
      )
      .subscribe(
        (res: any) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);
          const blob = new Blob([res.body], {
            type: 'application/vnd.ms.excel',
          });
          const file = new File(
            [blob],
            '' +
              `${this.comapny_name}_InsiderTransaction_${new Date()
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
  }
  Ownership() {
    this.loaderService.display(true);
    this.total_count_res = 1;
    this.count_res = 0;
    this.financialMarketData
      .downloadOwnershipExcell(this.security_id, this.comapny_name)
      .subscribe(
        (res: any) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);
          const blob = new Blob([res.body], {
            type: 'application/vnd.ms.excel',
          });
          const file = new File(
            [blob],
            '' + `Ownership${this.comapny_name}.xls`,
            {
              type: 'application/vnd.ms.excel',
            }
          );
          saveAs(file);
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
  }
  downloadInsiderTransaction() {
    this.loaderService.display(true);
    this.total_count_res = 1;
    this.count_res = 0;
    this.financialMarketData
      .downloadinsiderTransactionExcel(
        this.company_id,
        this.comapny_name,
        this.security_id,
        this.entity_id,
        this.currency
      )
      .subscribe(
        (res: any) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);
          const blob = new Blob([res.body], {
            type: 'application/vnd.ms.excel',
          });
          const file = new File(
            [blob],
            '' + `Ownership${this.comapny_name}.xls`,
            {
              type: 'application/vnd.ms.excel',
            }
          );
          saveAs(file);
        },
        (err) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);
          if (err.status === 402) {
            this.auth.freeTrialAlert = true;
          }
          console.error('err', err.message);
        }
      );
  }
  pdfDataOutput: any;
  downloadProfile() {
    // this.responseRecived = true
    this.loaderService.display(true);
    this.total_count_res = 1;
    this.count_res = 0;
    this.financialMarketData
      .downloadcompanyProfile(this.company_id, this.currency)
      .subscribe(
        (res: any) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);
          //   const blob = new Blob([res.body], {
          //     type: 'application/pdf',
          //   });
          //   const file = new File(
          //     [blob],
          //     '' + `Company Profile ${this.comapny_name}`,
          //     {
          //       type: 'application/pdf',
          //     }
          //   );
          //  this.pdfDataOutput = file

          var file = new File(
            [res.body],
            `Company Profile ${this.comapny_name}`,
            { type: 'application/pdf' }
          );
          this.pdfDataOutput = file;
          if (this.pdfDataOutput) {
            this.auth.expandopenPopupPdfViewer = true;
          }

          // saveAs(file);
        },
        (err) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);
          console.error('err', err.message);

          if (err.status === 402) {
            this.auth.freeTrialAlert = true;
          }
        }
      );
  }
  redirectToEconomy() {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/financialmarketdata/economy'], {
        relativeTo: this.route,
        queryParams: { countryCode: this.company_info.countryCode },
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

  eventModalData: any;
  onEventTransscriptDataClicked(data: any) {
    this.eventModalData = data;
    this.auth.openEarningsModal = true;
  }

  // PEVC Phase 2
  pevcEntityId: any;
  pevcName: any;
  handleSelectedPEVCListedCompanyEntityId(e: any) {
    this.pevcCurrency = 'USD';
    this.selectedcurrecny = this.pevcCurrency;
    this.pevcEntityId = e.factset_pevc_firm_entity_id;
    this.pevcName = e.entity_proper_name;

    this.pevcFirmTableData.title[2].label = `AUM (${this.pevcCurrency}  M)`;
    this.pevcFirmTableData.title[3].label = `Average Fund Size (${this.pevcCurrency}  M)`;
    this.directInvestmentsTableData.title[7].label = `Total Investment (${this.pevcCurrency} Million)`;
    this.directInvestmentsTableData.title[8].label = `Total Participated Round Funding Amount (${this.pevcCurrency} Million)`;
    this.directInvestmentsChildTableData.title[7].label = `Investment in Round (${this.pevcCurrency} Million)`;
    this.directInvestmentsChildTableData.title[8].label = `Round Funding Amount (${this.pevcCurrency} Million)`;
    this.fundOfFundsInvestmetns.title[2].label = `Amount Invested (${this.pevcCurrency} Million)`;
    this.fundOfFundsInvestmetns.title[6].label = `Amount Raised (${this.pevcCurrency} Million)`;
    this.firmStructureTableData.title[4].label = `Amount Raised (${this.pevcCurrency} Million)`;

    this.count_res = 0;
    this.total_count_res = 37;
    // this.total_count_res = 40;
    this.util.loaderService.display(true);

    this.getPEVCCompanies();
    this.getNumberOfActiveFunds(this.pevcEntityId);
    this.getNumberOfFundsUnderMng(this.pevcEntityId);
    this.getNumberOfAssetsUnderMng(this.pevcEntityId);
    this.getAvgFundSize(this.pevcEntityId);
    this.getpevcTotalInvestments(this.pevcEntityId);
    this.getPEVCBenchmarkAnalysis(this.pevcEntityId);
    this.getPEVCFundsInvestments(this.pevcEntityId, '1');
    this.getPEVCFirmStructure(this.pevcEntityId, '1');
    this.getPEVCDirectInvestments(this.pevcEntityId, '1');
    this.getPEVCmanagement(this.pevcEntityId, this.pevcName);
    this.getContactPEVC(this.pevcEntityId);
    this.getWebsitePEVC(this.pevcEntityId);
    this.getAddressPEVC(this.pevcEntityId);
    this.getCompanySecurityId(this.pevcEntityId);
  }

  handlepevcListedSelectedFromFund(e: any) {
    this.getCurreny();
    this.handleSelectedPEVCListedCompanyEntityId(e);
  }

  notListedSelectedEntityId: any;
  handleselectedPEVCNotListedCompanyEntityId(e: any) {
    this.notListedSelectedEntityId = e;
  }
  fundCompanySelectedEntityId: any;
  handleselectedPEVCFundCompanyEntityId(e: any) {
    this.fundCompanySelectedEntityId = e;
  }
  fundCompanySelectedEntityIdFirm: any;
  handleselectedPEVCFundCompanyEntityIdFirm(e: any) {
    this.fundCompanySelectedEntityIdFirm = e;
  }
  notListedSelectedName: any;
  handleselectedPEVCNotListedName(e: any) {
    this.notListedSelectedName = e;
  }
  fundSelectedName: any;
  handleselectedPEVCFundName(e: any) {
    this.fundSelectedName = e;
  }
  fundBenchmarkFund: any;
  handleFundBenchmarkFund(e: any) {
    this.auth.showNotListedPage = false;
    this.auth.hidePublicCompany = true;
    this.auth.showFundPage = true;
    this.fundBenchmarkFund = e;
  }
  selectedPEVCCompany: any;
  pevcCompanyData: any = [];
  getPEVCCompanies() {
    let pevcCompaniesLocalData: any = [];

    this.financialMarketData.getPEVCCompanies().subscribe(
      (res: any) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);

        res?.forEach((element: any) => {
          pevcCompaniesLocalData.push({
            id: element.factset_pevc_firm_entity_id,
            text: element.entity_proper_name,
          });
        });

        pevcCompaniesLocalData.sort((a: any, b: any) =>
          a.text.localeCompare(b.text)
        );

        this.pevcCompanyData = pevcCompaniesLocalData;
      },
      (err) => {
        console.log('error', err.message);
      }
    );
  }

  oncompanyChangedPEVC(data: any) {
    if (this.pevcCompanyData && this.selectedPEVCCompany !== data) {
      this.selectedPEVCCompany = data;
      this.pevcCurrency = 'USD';
      this.selectedcurrecny = this.pevcCurrency;
      this.pevcEntityId = this.selectedPEVCCompany;

      this.pevcFirmTableData.title[2].label = `AUM (${this.pevcCurrency}  M)`;
      this.pevcFirmTableData.title[3].label = `Average Fund Size (${this.pevcCurrency}  M)`;
      this.directInvestmentsTableData.title[7].label = `Total Investment (${this.pevcCurrency} Million)`;
      this.directInvestmentsTableData.title[8].label = `Total Participated Round Funding Amount (${this.pevcCurrency} Million)`;
      this.directInvestmentsChildTableData.title[7].label = `Investment in Round (${this.pevcCurrency} Million)`;
      this.directInvestmentsChildTableData.title[8].label = `Round Funding Amount (${this.pevcCurrency} Million)`;
      this.fundOfFundsInvestmetns.title[2].label = `Amount Invested (${this.pevcCurrency} Million)`;
      this.fundOfFundsInvestmetns.title[6].label = `Amount Raised (${this.pevcCurrency} Million)`;
      this.firmStructureTableData.title[4].label = `Amount Raised (${this.pevcCurrency} Million)`;

      this.count_res = 0;
      this.total_count_res = 35;
      // this.total_count_res = 38;
      this.util.loaderService.display(true);

      this.getCompanySecurityId(this.pevcEntityId);

      this.getNumberOfActiveFunds(this.pevcEntityId);
      this.getNumberOfFundsUnderMng(this.pevcEntityId);
      this.getNumberOfAssetsUnderMng(this.pevcEntityId);
      this.getAvgFundSize(this.pevcEntityId);
      this.getpevcTotalInvestments(this.pevcEntityId);
      this.getPEVCBenchmarkAnalysis(this.pevcEntityId);
      this.getPEVCFundsInvestments(this.pevcEntityId, '1');
      this.getPEVCFirmStructure(this.pevcEntityId, '1');
      this.getPEVCDirectInvestments(this.pevcEntityId, '1');
      this.getContactPEVC(this.pevcEntityId);
      this.getWebsitePEVC(this.pevcEntityId);
      this.getAddressPEVC(this.pevcEntityId);
    }
  }
  companyIdPevc: any;
  securityidPevc: any;
  getCompanySecurityId(entityId: any) {
    this.financialMarketData
      .getCompanySecurityId(entityId)
      .subscribe((res: any) => {
        this.company_id = res[0]?.company_id;
        this.security_id = res[0]?.security_id;
        this.currency = this.pevcCurrency;
        this.entity_id = this.pevcEntityId;
        this.comapny_name = res[0]?.proper_name;
        this.isbenchmarkLoading = true;
        this.getCompanyInfo(this.company_id, this.currency);
        this.getCompanyIndexes(this.company_id);
        this.getStockExchData(this.company_id);
        this.getFinancialData(this.company_id, this.currency);
        this.getSegmentData(
          this.company_id,
          this.comapny_name,
          this.selectedcurrecny
        );
        this.getDebtProfile(this.currency, this.entity_id);
        this.getDebtcompositionData(this.currency, this.entity_id);
        this.getMaturityData(this.currency, this.entity_id);
        this.getOwnershipData(this.security_id);
        this.getEstimateChartData(this.company_id);
        this.gettotalRecomChartData(this.company_id);
        this.getOwnershipdetaildata(this.security_id);
        this.getpromoroownershipData(this.security_id);
        this.getinstitueownershipData(this.security_id);
        this.getEstimateData(this.company_id);
        this.getEventsData(this.entity_id);
        this.getCompanyFileData(this.company_id, this.entity_id, '');
        this.getbenchmarktableData(this.entity_id, this.currency);
        this.getStockChartData(this.company_id, this.currency);
        this.getmanagementData(this.comapny_name, this.entity_id);
        this.getinsiderTransaction(this.company_id, this.security_id);
      });
  }

  pevcNotListedParticipatingFundsListed: any;
  handlepevcNotListedParticipatingFunds(e: any) {
    this.pevcNotListedParticipatingFundsListed = e;
    this.auth.hidePublicCompany = true;
    this.auth.showFundPage = true;
  }

  handlepevcNotListedParticipatingFundsRedirect(e: any) {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['financialmarketdata/company'], {
        queryParams: {
          factset_fund_entity_id: e.factset_fund_entity_id,
          factset_pevc_firm_entity_id: e.factset_pevc_firm_entity_id,
          participating_funds: e.multiple
            ? e.participating_funds_multiple
            : e.participating_funds,
          tab_name: 'listed-direct-fund',
        },
      })
    );
    window.open(url, '_blank');
  }

  handlefundSelected(e: any) {
    this.pevcNotListedParticipatingFundsListed = e;
    this.auth.hidePublicCompany = true;
    this.auth.showFundPage = true;
  }

  handlefundSelectedRedirect(e: any) {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['financialmarketdata/company'], {
        queryParams: {
          factset_fund_entity_id: e.factset_fund_entity_id,
          factset_pevc_firm_entity_id: e.factset_pevc_firm_entity_id,
          participating_funds: e?.fund_name,
          tab_name: 'listed-fundsoffunds-fund',
        },
      })
    );
    window.open(url, '_blank');
  }

  handlefirmSelected(e: any) {
    this.auth.showNotListedPage = true;
    this.auth.hidePublicCompany = true;
    this.auth.showFundPage = false;

    this.notListedBenchmarkSelectedListed = e;
  }

  handlefirmSelectedRedirect(e: any) {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['financialmarketdata/company'], {
        queryParams: {
          factset_pevc_firm_entity_id: e.factset_pevc_firm_entity_id,
          Firm_name: e?.firm_name,
          tab_name: 'listed-fundsoffunds-firm',
        },
      })
    );
    window.open(url, '_blank');
  }

  handlefundSelectedFirmStructure(e: any) {
    this.pevcNotListedParticipatingFundsListed = e;
    this.auth.hidePublicCompany = true;
    this.auth.showFundPage = true;
  }
  handlefundSelectedFirmStructureRedirect(e: any) {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['financialmarketdata/company'], {
        queryParams: {
          factset_fund_entity_id: e.factset_fund_entity_id,
          factset_pevc_firm_entity_id: e.factset_pevc_firm_entity_id,
          participating_funds: e?.fund_name,
          tab_name: 'listed-firm-structure-fund',
        },
      })
    );
    window.open(url, '_blank');
  }
  notListedBenchmarkSelectedListed: any;
  handlefirmSelectedBenchmark(e: any) {
    this.auth.showNotListedPage = true;
    this.auth.hidePublicCompany = true;
    this.auth.showFundPage = false;

    this.notListedBenchmarkSelectedListed = e;
  }

  handlefirmSelectedBenchmarkRedirect(e: any) {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['financialmarketdata/company'], {
        queryParams: {
          factset_pevc_firm_entity_id: e.factset_pevc_firm_entity_id,
          Firm_name: e.Firm_name,
          tab_name: 'listed-benchmark-firm',
        },
      })
    );
    window.open(url, '_blank');
  }

  handleinvestorNameSelected(e: any) {
    if (e.entityType !== 'Individual' && e.entityType !== 'Public Company') {
      const url = this.router.serializeUrl(
        this.router.createUrlTree(['financialmarketdata/company'], {
          queryParams: {
            factset_pevc_firm_entity_id: e.factsetInvestorEntityId,
            Firm_name: e.entityProperName,
            tab_name: 'investor-name-fund',
          },
        })
      );
      window.open(url, '_blank');
    }
  }

  handlefundNameSelected(e: any) {
    this.financialMarketData
      .getPEVCFundIds(e.fundName)
      .subscribe((res: any) => {
        if (
          e.entityType !== 'Individual' &&
          e.entityType !== 'Public Company'
        ) {
          const url = this.router.serializeUrl(
            this.router.createUrlTree(['financialmarketdata/company'], {
              queryParams: {
                factset_pevc_firm_entity_id: res[0].factset_pevc_firm_entity_id,
                contolling_firm: res[0].entity_proper_name,
                factset_fund_entity_id: res[0].factset_fund_entity_id,
                tab_name: 'fund-benchmark-fund',
              },
            })
          );

          window.open(url, '_blank');
        }
      });
  }

  pevcNoActiveFunds: any;
  getNumberOfActiveFunds(entityId: any) {
    this.financialMarketData
      .getNumberOfActiveFunds(entityId)
      .subscribe((res: any) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);

        this.pevcNoActiveFunds = res[0]?.Number_of_Active_Funds;
      });
  }

  pevcNoFundsUnderMng: any;
  getNumberOfFundsUnderMng(entityId: any) {
    this.financialMarketData
      .getNumberOfFundsUnderMng(entityId)
      .subscribe((res: any) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);

        this.pevcNoFundsUnderMng = res[0]?.Number_of_funds_under_management;
      });
  }

  pevcNoAssetsUnderMng: any;
  getNumberOfAssetsUnderMng(entityId: any) {
    this.financialMarketData
      .getNumberOfAssetsUnderMng(entityId, this.pevcCurrency)
      .subscribe((res: any) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);

        this.pevcNoAssetsUnderMng = res[0]?.Assets_under_management;
      });
  }

  pevcAvgFundSize: any;
  getAvgFundSize(entityId: any) {
    this.financialMarketData
      .getAvgFundSize(entityId, this.pevcCurrency)
      .subscribe((res: any) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);

        this.pevcAvgFundSize = res[0]?.Average_fund_size;
      });
  }

  pevcTotalInvestments: any;
  getpevcTotalInvestments(entityId: any) {
    this.financialMarketData
      .getpevcTotalInvestments(entityId)
      .subscribe((res: any) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);

        this.pevcTotalInvestments = res[0]?.number_of_investment;
      });
  }

  getPEVCBenchmarkAnalysis(entityId: any) {
    this.financialMarketData
      .getPEVCBenchmarkAnalysis(entityId, this.pevcCurrency)
      .subscribe(
        (res: any) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);

          this.pevcFirmTableData = {
            ...this.pevcFirmTableData,
            value: res,
          };
        },
        (err) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);
          console.log('err', err.message);
        }
      );
  }
  totalDataLengthFundsofFunds: any;
  getPEVCFundsInvestments(entityId: any, selectedPage: any) {
    this.financialMarketData
      .getPEVCFundsInvestments(entityId, selectedPage, this.selectedcurrecny)
      .subscribe((res: any) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);

        this.totalDataLengthFundsofFunds = res.pop().datacount;

        res.map((el: any) => {
          el.sector_focus = el?.sector_focus?.split(',')?.join(', ');
          el.country_focus = el?.country_focus?.split(',')?.join(', ');
        });

        this.fundOfFundsInvestmetns = {
          ...this.fundOfFundsInvestmetns,
          value: res,
        };
      });
  }

  onPageChangeFundsofFunds(e: any) {
    this.count_res = 0;
    this.total_count_res = 1;
    this.util.loaderService.display(true);
    this.getPEVCFundsInvestments(this.pevcEntityId, e);
  }

  totalDataLengthFirmStructure: any;
  getPEVCFirmStructure(entityId: any, selectedPage: any) {
    this.financialMarketData
      .getPEVCFirmStructure(entityId, selectedPage, this.selectedcurrecny)
      .subscribe((res: any) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);

        this.totalDataLengthFirmStructure = res.pop().datacount;

        res.map((el: any) => {
          el.sector_focus = el?.sector_focus?.split(',')?.join(', ');
          el.country_focus = el?.country_focus?.split(',')?.join(', ');
        });

        this.firmStructureTableData = {
          ...this.firmStructureTableData,
          value: res,
        };
      });
  }

  onPageChangeFirmStructure(e: any) {
    this.count_res = 0;
    this.total_count_res = 1;
    this.util.loaderService.display(true);

    this.getPEVCFirmStructure(this.pevcEntityId, e);
  }
  sortType: any = 'desc';
  sortCol: any;
  handlecusSortParam(value: any) {
    this.sortCol = value;
    if (this.sortType === 'desc') {
      this.sortType = 'asc';
    } else if (this.sortType === 'asc') {
      this.sortType = 'desc';
    }
    this.count_res = 0;
    this.total_count_res = 1;
    this.util.loaderService.display(true);
    this.getPEVCDirectInvestments(this.pevcEntityId, '1', value, this.sortType);
  }

  totalDataLength: any;
  multiplePartFunds: any = [];
  getPEVCDirectInvestments(
    entityId: any,
    pageSelected: any,
    colType: any = 'investment_date',
    sortType: any = 'desc'
  ) {
    let multipleFunds: any = [];
    this.financialMarketData
      .getPEVCDirectInvestments(
        entityId,
        this.pevcCurrency,
        pageSelected,
        colType,
        sortType
      )
      .subscribe((res: any) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);

        this.totalDataLength = res.pop().datacount;

        // res.map((el: any) => {
        //   el.participating_funds_custom = el.participating_funds;
        // });

        // res = res.filter((value: any, index: any, self: any) => {
        //   multipleFunds.push(value.participating_funds);

        //   return (
        //     index ===
        //     self.findIndex(
        //       (t: any) => t.pevc_security_id === value.pevc_security_id
        //     )
        //   );
        // });

        // if (multipleFunds.length > 1) {
        //   res[0].participating_funds = 'Multiple';
        //   this.multiplePartFunds = multipleFunds;
        // }

        res.map((el: any) => {
          if (el.participating_funds.split(',').length > 1) {
            this.multiplePartFunds.push({
              id: el.factset_fund_entity_id.split(','),
              fund: el.participating_funds.split(','),
              name: el.entity_name,
            });
            el.participating_funds = 'Multiple';
          }

          el.valuation_fx =
            el?.valuation?.replaceAll(',', '') * (el?.pct_held / 100);
          if (el.valuation_fx) {
            el.valuation_fx = parseFloat(el.valuation_fx).toFixed(2);
            el.valuation_fx = this.util.standardFormat(el.valuation_fx, 2, '');
          }
        });

        this.directInvestmentsTableData = {
          ...this.directInvestmentsTableData,
          value: res,
        };
      });
  }

  onPageChange(e: any) {
    this.count_res = 0;
    this.total_count_res = 1;
    this.util.loaderService.display(true);

    this.getPEVCDirectInvestments(
      this.pevcEntityId,
      e,
      this.sortCol,
      this.sortType
    );
  }

  getPEVCmanagement(entityId: any, name?: any) {
    this.financialMarketData
      .getFundMng(entityId, name, '1')
      .subscribe((res: any) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);

        let managementData: any = [];
        res.forEach((el: any) => {
          managementData.push({
            management: el.management,
            instrumentType: el.instrumentType,
            experience: el.experience ? el.experience + ' yrs' : '-',
            appointed: el.appointed,
            otherCompanies: el.otherCompanies?.replaceAll('#:#', ','),
            personId: el.personId,
          });
        });
        this.manage_data = managementData;
      });
  }
  multiplePartFundsChild: any = [];
  getPEVCDirectInvestmentsChild(entityId: any, portco_entity_id: any) {
    let multipleFunds: any = [];
    this.financialMarketData
      .getPEVCDirectInvestmentsChild(
        entityId,
        portco_entity_id,
        this.pevcCurrency
      )
      .subscribe((res: any) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);

        // res.map((el: any) => {
        //   el.participating_funds_custom = el.participating_funds;
        // });

        // res = res.filter((value: any, index: any, self: any) => {
        //   multipleFunds.push(value.participating_funds);

        //   return (
        //     index ===
        //     self.findIndex(
        //       (t: any) => t.pevc_security_id === value.pevc_security_id
        //     )
        //   );
        // });

        // if (multipleFunds.length > 1) {
        //   res[0].participating_funds = 'Multiple';
        //   this.multiplePartFundsChild = multipleFunds;
        // }

        res.map((el: any) => {
          if (el.participating_funds.split(',').length > 1) {
            this.multiplePartFundsChild.push({
              id: el.factset_fund_entity_id.split(','),
              fund: el.participating_funds.split(','),
              name: el.description,
            });
            el.participating_funds = 'Multiple';
          }
        });

        this.directInvestmentsChildTableData = {
          ...this.directInvestmentsChildTableData,
          value: res,
        };
      });
  }
  portcoEntityId: any;
  handleInvestmentsPEVCChildData(e: any) {
    this.portcoEntityId = e.factset_portco_entity_id;
    this.count_res = 0;
    this.total_count_res = 1;
    this.util.loaderService.display(true);

    this.getPEVCDirectInvestmentsChild(
      this.pevcEntityId,
      e.factset_portco_entity_id
    );
  }

  fundingRoundHeaderData: any;
  fundingRoundData: any;
  excelEntityId: any;
  excelRound: any;
  excelFinanceType: any;

  handlePevcInvestmentsRoundSelected(e: any) {
    this.count_res = 0;
    this.total_count_res = 1;
    this.util.loaderService.display(true);

    let financeType = e.latest_investment_round.split('-')[0];
    let round = e.latest_investment_round.split('-')[1];

    this.excelEntityId = e.factset_portco_entity_id;
    this.excelRound = round;
    this.excelFinanceType = financeType;

    let currentDate = new Date();

    let timestamp = currentDate.setDate(currentDate.getDate() - 1);
    let endDate = new Date(timestamp).toISOString().slice(0, 10);

    let fromDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() - 363
    )
      .toISOString()
      .slice(0, 10);

    this.financialMarketData
      .getTransactionsFundingRoundData(
        round,
        endDate,
        fromDate,
        e.factset_portco_entity_id,
        financeType,
        this.pevcCurrency
      )
      .subscribe((res: any) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);

        this.fundingRoundHeaderData = res.pevcInvestmentHeaderDTO;
        this.fundingRoundData = res.pevcFundingInvestmentDTOs;

        this.fundingRoundData.map((el: any) => {
          el.terminationDate = this.datepipe.transform(
            el.terminationDate,
            'dd-MM-yyyy'
          );
        });
      });
  }

  handlepevcInvestmentsRoundSelectedChild(e: any) {
    this.count_res = 0;
    this.total_count_res = 1;
    this.util.loaderService.display(true);

    let financeType = e.financing_type;
    let round = e.category;

    this.excelEntityId = e.factset_portco_entity_id;
    this.excelRound = round;
    this.excelFinanceType = financeType;

    let currentDate = new Date();

    let timestamp = currentDate.setDate(currentDate.getDate() - 1);
    let endDate = new Date(timestamp).toISOString().slice(0, 10);

    let fromDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() - 363
    )
      .toISOString()
      .slice(0, 10);

    this.financialMarketData
      .getTransactionsFundingRoundData(
        round,
        endDate,
        fromDate,
        e.factset_portco_entity_id,
        financeType,
        this.pevcCurrency
      )
      .subscribe((res: any) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);

        this.fundingRoundHeaderData = res.pevcInvestmentHeaderDTO;
        this.fundingRoundData = res.pevcFundingInvestmentDTOs;

        this.fundingRoundData.map((el: any) => {
          el.terminationDate = this.datepipe.transform(
            el.terminationDate,
            'dd-MM-yyyy'
          );
        });
      });
  }

  handleDirectInvestmentExcel() {
    this.count_res = 0;
    this.total_count_res = 1;
    this.util.loaderService.display(true);
    this.financialMarketData
      .getDirectInvestmentFirmExcelData(
        this.entity_id,
        this.pevcCurrency,
        this.company_info.properName,
        this.yearFounded ?? '-',
        this.pevcNoAssetsUnderMng ?? '-',
        this.pevcTotalInvestments ?? '-',
        this.pevcAvgFundSize ?? '-',
        this.pevcNoFundsUnderMng ?? '-',
        this.pevcNoActiveFunds ?? '-'
      )
      .subscribe(
        (res: any) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);
          const blob = new Blob([res.body], {
            type: 'application/vnd.ms.excel',
          });
          const file = new File([blob], '' + 'Direct Investments.xls', {
            type: 'application/vnd.ms.excel',
          });
          saveAs(file);
        },
        (err) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);
          console.log('err', err.message);
        }
      );
  }

  ManagementexcellPEVC() {
    this.count_res = 0;
    this.total_count_res = 1;
    this.util.loaderService.display(true);

    this.financialMarketData
      .getMngExcelData(this.comapny_name, this.entity_id)
      .subscribe(
        (res: any) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);

          const blob = new Blob([res.body], {
            type: 'application/vnd.ms.excel',
          });
          const file = new File([blob], '' + 'Management.xls', {
            type: 'application/vnd.ms.excel',
          });
          saveAs(file);
        },
        (err) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);
          console.log('err', err.message);
        }
      );
  }

  handleFirmStructureExcel() {
    this.count_res = 0;
    this.total_count_res = 1;
    this.util.loaderService.display(true);
    this.financialMarketData
      .getFirmStructureExcelData(
        this.entity_id,
        this.pevcCurrency,
        this.company_info.properName ?? '-',
        this.yearFounded ?? '-',
        this.pevcNoAssetsUnderMng ?? '-',
        this.pevcTotalInvestments ?? '-',
        this.pevcAvgFundSize ?? '-',
        this.pevcNoFundsUnderMng ?? '-',
        this.pevcNoActiveFunds ?? '-'
      )
      .subscribe(
        (res: any) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);
          const blob = new Blob([res.body], {
            type: 'application/vnd.ms.excel',
          });
          const file = new File([blob], '' + 'Firm Structure.xls', {
            type: 'application/vnd.ms.excel',
          });
          saveAs(file);
        },
        (err) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);
          console.log('err', err.message);
        }
      );
  }

  handleFundsExcel() {
    this.count_res = 0;
    this.total_count_res = 1;
    this.util.loaderService.display(true);
    this.financialMarketData
      .getFundsofFundsExcelData(
        this.entity_id,
        this.pevcCurrency,
        this.company_info.properName ?? '-',
        this.yearFounded ?? '-',
        this.pevcNoAssetsUnderMng ?? '-',
        this.pevcTotalInvestments ?? '-',
        this.pevcAvgFundSize ?? '-',
        this.pevcNoFundsUnderMng ?? '-',
        this.pevcNoActiveFunds ?? '-'
      )
      .subscribe(
        (res: any) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);
          const blob = new Blob([res.body], {
            type: 'application/vnd.ms.excel',
          });
          const file = new File([blob], '' + 'Fund of Funds.xls', {
            type: 'application/vnd.ms.excel',
          });
          saveAs(file);
        },
        (err) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);
          console.log('err', err.message);
        }
      );
  }

  handlepevcDetModal(e: any) {
    this.count_res = 0;
    this.total_count_res = 1;
    this.util.loaderService.display(true);

    let currentDate = new Date();

    let timestamp = currentDate.setDate(currentDate.getDate() - 1);
    let endDate = new Date(timestamp).toISOString().slice(0, 10);

    let fromDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() - 363
    )
      .toISOString()
      .slice(0, 10);

    this.financialMarketData
      .getFundingRoundExcelDownloadData(
        this.excelEntityId,
        this.excelRound,
        fromDate,
        endDate,
        this.excelFinanceType,
        this.pevcCurrency
      )
      .subscribe(
        (res: any) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);
          const blob = new Blob([res.body], {
            type: 'application/vnd.ms.excel',
          });
          const file = new File(
            [blob],
            '' + `${e[0]?.securityName}_Round_Details.xls`,
            {
              type: 'application/vnd.ms.excel',
            }
          );
          saveAs(file);
        },
        (err) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);
          console.log('error', err.message);
        }
      );
  }
  contactPEVC: any;
  getContactPEVC(entityId: any) {
    this.financialMarketData.getContactPEVC(entityId).subscribe((res: any) => {
      ++this.count_res;
      this.util.checkCountValue(this.total_count_res, this.count_res);
      this.contactPEVC = res[0]?.contact;
    });
  }
  websitePEVC: any;
  yearFounded: any;
  getWebsitePEVC(entityId: any) {
    this.financialMarketData.getWebsitePEVC(entityId).subscribe((res: any) => {
      ++this.count_res;
      this.util.checkCountValue(this.total_count_res, this.count_res);
      this.websitePEVC = res[0]?.web_site;
      this.yearFounded = res[0]?.year_founded;
    });
  }
  addressPEVC: any;
  phonePEVC: any;
  getAddressPEVC(entityId: any) {
    this.financialMarketData.getAddressPEVC(entityId).subscribe((res: any) => {
      ++this.count_res;
      this.util.checkCountValue(this.total_count_res, this.count_res);
      this.addressPEVC = `${
        res[0]?.location_street1 ? res[0]?.location_street1 : ''
      } ${res[0]?.location_street2 ? res[0]?.location_street2 : ''} ${
        res[0]?.location_street3 ? res[0]?.location_street3 : ''
      } ${res[0]?.location_city ? res[0]?.location_city : ''} ${
        res[0]?.city_state_zip ? res[0]?.city_state_zip : ''
      } ${res[0]?.iso_country ? res[0]?.iso_country : ''}`;
      this.phonePEVC = res[0]?.tele_full;
    });
  }
}

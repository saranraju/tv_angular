import { Component, DoCheck, HostListener, OnInit } from '@angular/core';
import {
  Router,
  Event,
  NavigationStart,
  NavigationEnd,
  NavigationError,
  ActivatedRoute,
  Params,
} from '@angular/router';
import { ceil, debounce, filter } from 'lodash';
import { FinancialMarketDataService } from 'src/app/services/financialmarketdata.service';
// @ts-ignore
import * as introJs from 'intro.js/intro.js'; // importing introjs library
import { IntroJsonService } from 'src/app/services/intro-json.service';
import { UrlJsonService } from 'src/app/services/url-json.service';
import { LoaderServiceService } from '../components/loader-service.service';
import { UtilService } from 'src/app/services/util.service';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, DoCheck {
  introJS = introJs(); // assigning it to variable
  url: any;
  intro: any = this.intro_Service;
  urlData: any = this.urlData_Serivce;
  constructor(
    private financialMarketData: FinancialMarketDataService,
    private route: Router,
    private intro_Service: IntroJsonService,
    private urlData_Serivce: UrlJsonService,
    public loaderService: LoaderServiceService,
    private router: ActivatedRoute,
    public util: UtilService,
    public auth: AuthService
  ) {
    setTimeout(() => {});

    this.route.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.url = event.url;

        if (
          event.url == '/financialmarketdata/bonds' ||
          event.url == '/financialmarketdata/transactions' ||
          event.url == '/financialmarketdata/cds'
        ) {
          this.closeButton = true;
        } else {
          this.closeButton = false;
        }

        this.searchTerm = '';
        if (this.periousSearchApi) {
          this.periousSearchApi?.unsubscribe();
          this.isloading = false;
        }
      }
    });

    this.loaderService.tutorialStatus.subscribe((val: boolean) => {
      if (val) {
        this.urlData.urlData.forEach((element: any) => {
          if (this.url == element.url) {
            let check = this.checkIntroCompleted(element.json);
            if (!check) {
              this.introJS.setOptions({
                steps: this.intro[element.json],
                showBullets: true,
                showButtons: true,
                exitOnOverlayClick: false,
                keyboardNavigation: true,
                scrollToElement: true,
              });

              this.onNavigationEndSetIntroTrue(element.json);
              setTimeout(() => {
                this.introJS.start().onbeforechange(() => {
                  let count: any = 0;
                  if (this.introJS._currentStep >= 10 && count === 0) {
                    $('#company_content').attr(
                      'style',
                      'position:relative !important;'
                    );
                    let dataTe = document.getElementById(
                      'company_content'
                    ) as any;
                    let body = document.querySelector('body') as any;
                    let adminSectionEle = document.querySelector(
                      '.adminSection'
                    ) as any;
                    let topBtn = document.getElementById(
                      'scrolltotop-btn'
                    ) as any;
                    dataTe.classList.remove('company_content');
                    dataTe.classList.add('company_content_two');
                    body.classList.add('body-scroll');
                    adminSectionEle?.classList.remove('adminSection');
                    adminSectionEle?.classList.add('adminSectionTutorial');
                    topBtn?.classList.remove('hide');
                    topBtn?.classList.add('show');
                    ++count;
                  }

                  this.introJS.onbeforeexit(() => {
                    if (this.url === '/financialmarketdata/company') {
                      let dataTe = document.getElementById(
                        'company_content'
                      ) as any;
                      let adminSectionEle = document.querySelector(
                        '.adminSectionTutorial'
                      ) as any;
                      let topBtn = document.getElementById(
                        'scrolltotop-btn'
                      ) as any;
                      let body = document.querySelector('body') as any;
                      dataTe.classList.add('company_content');
                      dataTe.classList.remove('company_content_two');
                      adminSectionEle?.classList.add('adminSection');
                      adminSectionEle?.classList.remove('adminSectionTutorial');
                      body.classList.remove('body-scroll');
                      $('#company_content').attr(
                        'style',
                        'position:fixed !important;'
                      );

                      topBtn?.classList.add('hide');
                      topBtn?.classList.remove('show');
                    }
                  });
                });
              }, 500);
            }
          }
        });
      }
    });
  }
  showSideBar: boolean = false;
  subMenuCollapse: boolean = false;
  userAccountShow: boolean = false;
  showBubble: boolean = false;
  showBubbleFMD: boolean = false;
  closeButton = false;
  isOpen = false;
  company_list: any = [];
  country_list: any = [];
  industry_list: any = [];
  indicator_list: any = [];
  commodity_list: any = [];
  isloading = false;
  prevSideBar: any = false;
  hideFinancialTabs: any = false;
  showFinancialTabs: any = true;
  showSearcOverlay: any = false;

  @HostListener('document:click', ['$event'])
  clickout() {
    if (this.prevSideBar !== this.userAccountShow) {
      if (this.userAccountShow) {
        this.userAccountShow = false;
      }
    }

    if (this.prevSideBar !== this.showSideBar) {
      if (this.showSideBar) {
        this.showSideBar = false;
      }
    }
    this.prevSideBar = !this.prevSideBar;
    if (this.showSearcOverlay && !this.searchFocused) {
      this.showSearcOverlay = false;
    }
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.showSideBar = false;
      this.userAccountShow = false;
    }
  }
  email: any;
  wFlag = false;
  hideNewsTab: any = false;
  ngOnInit(): void {
    this.email = localStorage.getItem('email');
    $(function () {
      var class_name: any = $('[data-toggle="tooltip"]');
      class_name.tooltip();
    });

    if (
      window.location.origin !== 'https://financialmarketdata.televisory.com' &&
      window.location.origin !== 'http://52.220.108.233'
    ) {
      this.wFlag = true;
    }

    if (
      window.location.origin !== 'https://financialmarketdata.televisory.com'
    ) {
      this.hideNewsTab = true;
    }
  }

  ngDoCheck() {
    let userId: any = localStorage.getItem('id');
    let exploreExpired: any = localStorage.getItem('exploreExpired');
    userId === '0'
      ? (this.auth.exploreUser = true)
      : (this.auth.exploreUser = false);
    if (exploreExpired == 'true') {
      this.auth.expriedPopup = true;
      // localStorage.clear();
    }

    if (this.route.url === '/financialmarketdata/my-account') {
      this.hideFinancialTabs = true;
    } else {
      this.hideFinancialTabs = false;
    }
    if (this.route.url.includes('/financialmarketdata/financialtab')) {
      (
        document.querySelector('#custom-company-active') as HTMLElement
      ).classList.add('active');
    } else if (this.route.url.includes('/financialmarketdata/company')) {
      (
        document.querySelector('#custom-company-active') as HTMLElement
      ).classList.add('active');
    } else if (this.route.url.includes('/financialmarketdata/bonds')) {
      (
        document.querySelector('#custom-bonds-active') as HTMLElement
      ).classList.add('active');
    } else if (this.route.url.includes('/financialmarketdata/transactions')) {
      (
        document.querySelector('#custom-transactions-active') as HTMLElement
      ).classList.add('active');
    } else if (this.route.url.includes('/financialmarketdata/commodity')) {
      (
        document.querySelector('#custom-commodity-active') as HTMLElement
      ).classList.add('active');
    }
    // else if (this.route.url.includes('/financialmarketdata/fixed-income')) {
    //   (
    //     document.querySelector('#custom-fixed-income-active') as HTMLElement
    //   ).classList.add('active');
    // }
    else if (
      this.route.url.includes('/financialmarketdata/interactive-analysis')
    ) {
      (
        document.querySelector(
          '#custom-interactive-analysis-active'
        ) as HTMLElement
      ).classList.add('active');
    } else {
      (
        document.querySelector('#custom-bonds-active') as HTMLElement
      ).classList.remove('active');
      (
        document.querySelector('#custom-company-active') as HTMLElement
      ).classList.remove('active');
      (
        document.querySelector(
          '#custom-interactive-analysis-active'
        ) as HTMLElement
      ).classList.remove('active');
      (
        document.querySelector('#custom-transactions-active') as HTMLElement
      ).classList.remove('active');
      (
        document.querySelector('#custom-commodity-active') as HTMLElement
      ).classList.remove('active');
      // (
      //   document.querySelector('#custom-fixed-income-active') as HTMLElement
      // ).classList.remove('active');
    }
  }

  total_count_res: any;
  count_res: any;
  handleLogoutClick() {
    this.loaderService.display(true);
    this.total_count_res = 1;
    this.count_res = 0;
    const email = localStorage.getItem('email');
    this.financialMarketData.logoutUser(email).subscribe(
      (res) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);
        let companyIntroJson = localStorage.getItem(
          'companyIntroJson'
        ) as string;
        let commodityIntroJson = localStorage.getItem(
          'commodityIntroJson'
        ) as string;
        let economyIntroJson = localStorage.getItem(
          'economyIntroJson'
        ) as string;
        let AnalysisIntroJson = localStorage.getItem(
          'AnalysisIntroJson'
        ) as string;
        let industryIntroJson = localStorage.getItem(
          'industryIntroJson'
        ) as string;
        let indutryMonitorJson = localStorage.getItem(
          'indutryMonitorJson'
        ) as string;
        let screenerIntroJson = localStorage.getItem(
          'screenerIntroJson'
        ) as string;
        let dataDownloadJson = localStorage.getItem(
          'dataDownloadJson'
        ) as string;

        localStorage.clear();

        localStorage.setItem('companyIntroJson', companyIntroJson);
        localStorage.setItem('commodityIntroJson', commodityIntroJson);
        localStorage.setItem('economyIntroJson', economyIntroJson);
        localStorage.setItem('AnalysisIntroJson', AnalysisIntroJson);
        localStorage.setItem('industryIntroJson', industryIntroJson);
        localStorage.setItem('indutryMonitorJson', indutryMonitorJson);
        localStorage.setItem('screenerIntroJson', screenerIntroJson);
        localStorage.setItem('dataDownloadJson', dataDownloadJson);

        var viewport = document.querySelector('meta[name="viewport"]' as any);

        if (viewport) {
          viewport.content = 'initial-scale=0.1';
          viewport.content = 'width=1200';
        }
        this.route.navigate(['/login']);
      },
      (err) => {
        console.log('err', err);
      }
    );
  }

  startTour() {
    this.urlData.urlData.forEach((element: any) => {
      if (this.url == element.url) {
        this.introJS.setOptions({
          steps: this.intro[element.json],
          showBullets: true,
          showButtons: true,
          exitOnOverlayClick: false,
          keyboardNavigation: true,
          scrollToElement: true,
        });
        this.introJS.start().onbeforechange(() => {
          let count: any = 0;
          if (this.introJS._currentStep >= 10 && count === 0) {
            $('#company_content').attr(
              'style',
              'position:relative !important;'
            );
            let dataTe = document.getElementById('company_content') as any;
            let body = document.querySelector('body') as any;
            let adminSectionEle = document.querySelector(
              '.adminSection'
            ) as any;
            let topBtn = document.getElementById('scrolltotop-btn') as any;
            dataTe.classList.remove('company_content');
            dataTe.classList.add('company_content_two');
            body.classList.add('body-scroll');
            adminSectionEle?.classList.remove('adminSection');
            adminSectionEle?.classList.add('adminSectionTutorial');
            topBtn?.classList.remove('hide');
            topBtn?.classList.add('show');
            ++count;
          }

          this.introJS.onbeforeexit(() => {
            if (this.url === '/financialmarketdata/company') {
              let dataTe = document.getElementById('company_content') as any;
              let adminSectionEle = document.querySelector(
                '.adminSectionTutorial'
              ) as any;
              let topBtn = document.getElementById('scrolltotop-btn') as any;
              let body = document.querySelector('body') as any;
              dataTe.classList.add('company_content');
              dataTe.classList.remove('company_content_two');
              adminSectionEle?.classList.add('adminSection');
              adminSectionEle?.classList.remove('adminSectionTutorial');
              body.classList.remove('body-scroll');
              $('#company_content').attr('style', 'position:fixed !important;');

              topBtn?.classList.add('hide');
              topBtn?.classList.remove('show');
            }
          });
        });
      }
    });
  }

  navigateCompany() {
    window.location.href = '/financialmarketdata/company';
  }
  navigate() {
    window.location.href = '/financialmarketdata/fixed-income';
  }
  navigateNews() {
    window.location.href = '/financialmarketdata/news';
  }
  navigateCommodity() {
    window.location.href = '/financialmarketdata/commodity';
  }

  timeOut: any;
  searchTerm: any = '';
  searchFunction(e: any) {
    let that = this;
    var data = e;
    this.searchTerm = e.target.value;
    clearTimeout(that.timeOut);

    that.timeOut = setTimeout(function () {
      that.onSearch(data);
    }, 1000);
  }

  periousSearchApi: any;
  onSearch(e: any) {
    var search = e.target.value.replace(/[&\/\\#, +()$~%.'":*?<>{}]/g, ' ');
    if (this.periousSearchApi) {
      this.periousSearchApi?.unsubscribe();
    }
    this.isloading = true;
    this.periousSearchApi = this.financialMarketData
      .globalSearchData(search)
      .subscribe(
        (res) => {
          this.showSearcOverlay = true;
          this.company_list = res?.company;
          this.country_list = res?.country;
          this.industry_list = res?.industry;
          this.indicator_list = res?.indicator;
          this.commodity_list = res?.commodity;
          this.isloading = false;
        },
        (err) => {
          this.showSearcOverlay = false;
          this.isloading = false;

          console.error(err.message);
        }
      );
  }
  onClickClose() {
    this.closeButton = !this.closeButton;
  }

  onNavigationEndSetIntroTrue(key: any) {
    setTimeout(() => {
      localStorage.setItem(key, 'true');
    }, 5000);
  }
  searchFocused: any;
  onClickInput() {
    this.searchFocused = true;
    if (this.showSearcOverlay === false && this.searchTerm) {
      setTimeout(() => {
        this.showSearcOverlay = true;
      }, 300);
    }
  }

  onFocusOut() {
    this.searchFocused = false;
  }

  checkIntroCompleted(key: any) {
    let data = JSON.parse(localStorage.getItem(key) as string);
    return data;
  }

  onClickedIndustry() {
    window.location.replace('/financialmarketdata/industry');
  }

  interactiveRefresh() {
    window.location.href = '/financialmarketdata/interactive-analysis';
  }

  handleMenuClick() {
    this.showSideBar = !this.showSideBar;
  }

  handleServicesCollapse() {
    this.subMenuCollapse = !this.subMenuCollapse;
  }

  handleUserIconClick() {
    this.userAccountShow = !this.userAccountShow;
  }

  handleLogoClick() {
    window.location.href = '/financialmarketdata/company';
  }

  searchedClickedHandler(type: any, data: any) {
    if (type === 'company') {
      if (data.entityType == 'private') {
        const url = this.route.serializeUrl(
          this.route.createUrlTree(['/financialmarketdata/company'], {
            relativeTo: this.router,
            queryParams: {
              comp_id: data.id,
              company_name: data.properName,
              currency: '',
              security_id: data.securityId,
              entity_id: data.factSetEntityId,
              companyCountry: data.domicileCountryCode,
              entity_type: 'Private',
              tabName: undefined,
            },
            queryParamsHandling: 'merge',
          })
        );
        window.open(url, '_self');
      } else {
        const url = this.route.serializeUrl(
          this.route.createUrlTree(['/financialmarketdata/company'], {
            relativeTo: this.router,
            queryParams: {
              comp_id: data.id,
              entity_id: data.factSetEntityId,
              company_name: data.properName,
              currency: '',
              security_id: data.securityId,
              tabName: 'company',
            },
            queryParamsHandling: 'merge',
          })
        );
        window.open(url, '_self');
      }
    } else if (type === 'country') {
      const url = this.route.serializeUrl(
        this.route.createUrlTree(['/financialmarketdata/economy'], {
          relativeTo: this.router,
          queryParams: {
            countryCode: data.countryIsoCode3,
          },
          queryParamsHandling: 'merge',
        })
      );
      window.open(url, '_self');
    } else if (type === 'industry') {
      let currency;
      this.financialMarketData
        .getCurrencyBasedCountryCode(data.domicileCountryCode)
        .subscribe(
          (res: any) => {
            currency = res?.currencyCode;
            const url = this.route.serializeUrl(
              this.route.createUrlTree(['/financialmarketdata/industry'], {
                relativeTo: this.router,
                queryParams: {
                  sector_id: data.ticsSectorCode,
                  sector_industry_id: data.ticsIndustryCode,
                  currency: currency,
                  countryId: data.countryId,
                  country: data.countryName,
                },
                queryParamsHandling: 'merge',
              })
            );
            window.open(url, '_self');
          },
          (err) => {
            const url = this.route.serializeUrl(
              this.route.createUrlTree(['/financialmarketdata/industry'], {
                relativeTo: this.router,
                queryParams: {
                  sector_id: data.ticsSectorCode,
                  sector_industry_id: data.ticsIndustryCode,
                  currency: 'USD',
                  countryId: data.countryId,
                  country: data.countryName,
                },
                queryParamsHandling: 'merge',
              })
            );
            window.open(url, '_self');
          }
        );

      console.log('industry', data);
    } else if (type === 'economyin') {
      const url = this.route.serializeUrl(
        this.route.createUrlTree(['/financialmarketdata/economy'], {
          relativeTo: this.router,
          queryParams: {
            countryCode: data.countryIsoCode3,
            category: data.category,
            period: data.periodType,
          },
          queryParamsHandling: 'merge',
        })
      );
      window.open(url, '_self');
    } else if (type === 'commodity') {
      const url = this.route.serializeUrl(
        this.route.createUrlTree(['/financialmarketdata/commodity'], {
          relativeTo: this.router,
          queryParams: {
            symbol: data.symbol,
            tabSection: 'Dashboard',
          },
          queryParamsHandling: 'merge',
        })
      );
      window.open(url, '_self');
    }
  }
}

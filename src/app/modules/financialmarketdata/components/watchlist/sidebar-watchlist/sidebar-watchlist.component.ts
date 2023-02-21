import { any } from '@amcharts/amcharts4/.internal/core/utils/Array';
import { Component, OnInit } from '@angular/core';
import { FinancialMarketDataService } from 'src/app/services/financialmarketdata.service';
import { UtilService } from 'src/app/services/util.service';
import { WatchlistServiceService } from '../watchlist-service.service';
@Component({
  selector: 'app-sidebar-watchlist',
  templateUrl: './sidebar-watchlist.component.html',
  styleUrls: ['./sidebar-watchlist.component.scss'],
})
export class SidebarWatchlistComponent implements OnInit {
  nowatchlist: boolean = true;
  showSideBar: boolean = false;
  subMenuCollapse: boolean = false;
  showBubble: boolean = false;
  showBubbleFMD: boolean = false;
  showbar: boolean = true;
  companyflag: boolean = false;
  newPortfolio: boolean = false;
  fixed_incomeflag: boolean = false;
  derivativesflag: boolean = false;
  commodityflag: boolean = false;
  economyflag: boolean = false;
  selectedParentSet = 'company_tab';
  displayStyle = 'none';
  watchlistName: any = '';
  isVisiblecompany: boolean = true;
  isVisiblefixedincome: boolean = false;
  isVisiblederivatives: boolean = false;
  isVisiblecommodity: boolean = false;
  isVisibleeconomy: boolean = false;
  CompanyName: any = [];
  selectCompanyData: any = [];
  securityName: any = [];
  options: any;
  selectedCompanydata: any = [];
  selectedCompany: any = [];
  showcontainer: any = false;
  previousAPI: any = null;
  selectedcdsSearchTerm: any;
  public companydata: any = [
    {
      id: 'S3Q61X-R',
      exchangeCode: 'TKS',
      exchangeName: 'Tokyo Stock Exchange',
      securityId: 'JHXZG3-S',
      factSetEntityId: '0JTNJ3-E',
      rowNo: 106168,
      name: '& Factory, Inc.',
      properName: 'and factory, inc.',
      securityType: 'SHARE',
      security_code: null,
      status: null,
      ff_industry: 'Industrial',
      description:
        '& Factory, Inc. engages in the development of smartphone application and internet of things. It offers mobile applications and operates smart hostel and &ANDHOTEL. The company was founded by Takamasa Ohara on September 16, 2014 and is headquartered in Tokyo, Japan.',
      companyTicker: '7035',
      countryName: 'Japan',
      countryCode: 'JPN',
      countryId: 112,
      ticsIndustryCode: 'T3308',
      ticsIndustryName: 'Information Technology Services',
      ticsSectorCode: 'T3300',
      ticsSectorName: 'Technology Services',
      entityType: 'PUB',
      is_Active: 0,
      reportingCurrency: 'JPY',
      stockPrice: null,
      domicileFlag: 0,
      customLableCheck: true,
      commodity: 'Crude Oil (USD/Bbl)',
    },
    {
      id: 'MZDHNX-R',
      exchangeCode: 'TKS',
      exchangeName: 'Tokyo Stock Exchange',
      securityId: 'J3JW80-S',
      factSetEntityId: '08ZVB2-E',
      rowNo: 75114,
      name: '&Do Holdings Co., Ltd.',
      properName: '&Do Holdings Co.Ltd.',
      securityType: 'SHARE',
      security_code: null,
      status: null,
      ff_industry: 'Other Financial',
      description:
        '&Do Holdings Co., Ltd. is engaged in the real estate business. It operates through the following segments: Franchise, Real Estate, Housing Distribution and Others. The Franchise segment involves in the real estate sales brokerage business. The Real Estate segment sells and leases land, second-hand detached houses, buildings, and condominiums. The Housing Distribution segment deals with real estate brokerage, new construction contracts, and renovation construction services. The Others segment handles manpower recruitment, trainings, and house mortgage services. The company was founded by Masahiro Ando in April 1991 and is headquartered in Kyoto, Japan.',
      companyTicker: '3457',
      countryName: 'Japan',
      countryCode: 'JPN',
      countryId: 112,
      ticsIndustryCode: 'T4880',
      ticsIndustryName: 'Real Estate Finance & Holding',
      ticsSectorCode: 'T4800',
      ticsSectorName: 'Finance',
      entityType: 'PUB',
      is_Active: 0,
      reportingCurrency: 'JPY',
      stockPrice: null,
      domicileFlag: 0,
      customLableCheck: true,
      commodity: 'Brent (USD/Bbl)',
    },
    {
      id: 'J0B04N-R',
      exchangeCode: 'TAE',
      exchangeName: 'Tel Aviv Stock Exchange',
      securityId: 'C6P3W8-S',
      factSetEntityId: '065JNC-E',
      rowNo: 45253,
      name: '(I.Z.) Queenco Ltd.',
      properName: '(I.Z.) Queenco Ltd.',
      securityType: 'SHARE',
      security_code: null,
      status: null,
      ff_industry: 'Industrial',
      description:
        '(I.Z.) Queenco Ltd. engages in the management and operation of hotels and casinos. It operates through Rhodes and Cambodia segments. The Rhodes segment engages in the operation of a hotel and a casino in Rhodes island in Greece. The Cambodia segment engages in the operation of a hotel and a casino in Sihanoukville, Cambodia. The company was founded on November 29, 1992 and is headquartered in Bnei Braq, Israel.',
      companyTicker: 'QNCO',
      countryName: 'Israel',
      countryCode: 'ISR',
      countryId: 108,
      ticsIndustryCode: 'T3440',
      ticsIndustryName: 'Hotels/Resorts/Cruiselines',
      ticsSectorCode: 'T3400',
      ticsSectorName: 'Consumer Services',
      entityType: 'PUB',
      is_Active: 0,
      reportingCurrency: 'ILS',
      stockPrice: null,
      domicileFlag: 0,
      customLableCheck: true,
      commodity: 'Natural gas (USD/MMBtu )',
    },
    {
      id: 'BRZXV5-R',
      exchangeCode: 'TSX',
      exchangeName: 'TSX Venture Exchange',
      securityId: 'BRZWS4-S',
      factSetEntityId: '003LTX-E',
      rowNo: 5860,
      name: '01 Communique Laboratory, Inc.',
      properName: '01 Communique Laboratory Inc.',
      securityType: 'SHARE',
      security_code: null,
      status: null,
      ff_industry: 'Industrial',
      description:
        "01 Communique Laboratory, Inc. develops and markets remote access solutions. It focuses on post-quantum cybersecurity with the development of its IronCAP technology. The firm's solutions consist of IronCAP, IronCAP X, I'm InTouch, and I'm OnCall product lines, which provide users with the ability to conduct online meetings. The company was founded on October 7, 1992 and is headquartered in Toronto, Canada.",
      companyTicker: 'ONE',
      countryName: 'Canada',
      countryCode: 'CAN',
      countryId: 37,
      ticsIndustryCode: 'T3310',
      ticsIndustryName: 'Packaged Software',
      ticsSectorCode: 'T3300',
      ticsSectorName: 'Technology Services',
      entityType: 'PUB',
      is_Active: 0,
      reportingCurrency: 'CAD',
      stockPrice: null,
      domicileFlag: 0,
      customLableCheck: true,
      commodity: 'Gasoline (USD/Gal)',
    },
    {
      id: 'QFW5L7-R',
      exchangeCode: 'OTC',
      exchangeName: 'US OTC',
      securityId: 'BRZWS4-S',
      factSetEntityId: '003LTX-E',
      rowNo: 93520,
      name: '01 Communique Laboratory, Inc.',
      properName: '01 Communique Laboratory Inc.',
      securityType: 'SHARE',
      security_code: null,
      status: null,
      ff_industry: 'Industrial',
      description:
        "01 Communique Laboratory, Inc. develops and markets remote access solutions. It focuses on post-quantum cybersecurity with the development of its IronCAP technology. The firm's solutions consist of IronCAP, IronCAP X, I'm InTouch, and I'm OnCall product lines, which provide users with the ability to conduct online meetings. The company was founded on October 7, 1992 and is headquartered in Toronto, Canada.",
      companyTicker: 'OONEF',
      countryName: 'Canada',
      countryCode: 'CAN',
      countryId: 37,
      ticsIndustryCode: 'T3310',
      ticsIndustryName: 'Packaged Software',
      ticsSectorCode: 'T3300',
      ticsSectorName: 'Technology Services',
      entityType: 'PUB',
      is_Active: 0,
      reportingCurrency: 'USD',
      stockPrice: null,
      domicileFlag: 0,
      customLableCheck: true,
      commodity: 'Heating oil (USD/Gal)',
    },
    {
      id: 'Q2V235-R',
      exchangeCode: 'OTC',
      exchangeName: 'US OTC',
      securityId: 'C4BQTB-S',
      factSetEntityId: '0031FR-E',
      rowNo: 90877,
      name: '0187279 B.C. Ltd.',
      properName: '0187279 B.C. Ltd.',
      securityType: 'SHARE',
      security_code: null,
      status: null,
      ff_industry: 'Industrial',
      description:
        '0187279 B.C. Ltd. engages in exploration of mineral properties. It owns interest in the Dime Creek gold and platinum property. The company was founded by John George Robertson on February 27, 1979 and is headquartered in Richmond, Canada.',
      companyTicker: 'LNXGF',
      countryName: 'Canada',
      countryCode: 'CAN',
      countryId: 37,
      ticsIndustryCode: 'T1120',
      ticsIndustryName: 'Precious Metals',
      ticsSectorCode: 'T1100',
      ticsSectorName: 'Non-Energy Minerals',
      entityType: 'PUB',
      is_Active: 0,
      reportingCurrency: 'USD',
      stockPrice: null,
      domicileFlag: 0,
      customLableCheck: true,
      commodity: 'Ethanol (USD/Gal)',
    },
    {
      id: 'C7MPD4-R',
      exchangeCode: 'WAR',
      exchangeName: 'Warsaw Stock Exchange',
      securityId: 'DMY5V1-S',
      factSetEntityId: '095366-E',
      rowNo: 9407,
      name: '01Cyberaton Proenergy SA',
      properName: '1 Cyberaton Proenergy S.A.',
      securityType: 'SHARE',
      security_code: null,
      status: null,
      ff_industry: 'Industrial',
      description:
        '01Cyberaton Proenergy SA engages in the production of solar power installations. Its offer includes design, implementation, and servicing of photovoltaic powerplants. The company was founded on October 16, 2007 and is headquartered in Warsaw, Poland.',
      companyTicker: '01C',
      countryName: 'Poland',
      countryCode: 'POL',
      countryId: 175,
      ticsIndustryCode: 'T3205',
      ticsIndustryName: 'Miscellaneous Commercial Services',
      ticsSectorCode: 'T3200',
      ticsSectorName: 'Commercial Services',
      entityType: 'PUB',
      is_Active: 0,
      reportingCurrency: 'PLN',
      stockPrice: null,
      domicileFlag: 0,
      customLableCheck: true,
      commodity: 'Naphtha (USD/T)',
    },
    {
      id: 'C2CKNF-R',
      exchangeCode: 'ROCO',
      exchangeName: 'Taipei Exchange',
      securityId: 'NWTTP4-S',
      factSetEntityId: '0DYC6G-E',
      rowNo: 8220,
      name: '1 Production Film Co.',
      properName: '1 Production Film Co.',
      securityType: 'SHARE',
      security_code: null,
      status: null,
      ff_industry: 'Industrial',
      description:
        '1 Production Film Co. engages in the production of video works and artist brokerage. It specializes in film production and performing arts activities. Its business scope includes general advertising service, film production, film distribution, radio program production, television program production, radio and television Program distribution, broadcasting and television advertising, video tape, arts and cultural services and performing arts activity. The company was founded on August 9, 2007 and is headquartered in Taipei, Taiwan.',
      companyTicker: '8458',
      countryName: 'Taiwan',
      countryCode: 'TWN',
      countryId: 45,
      ticsIndustryCode: 'T3430',
      ticsIndustryName: 'Movies/Entertainment',
      ticsSectorCode: 'T3400',
      ticsSectorName: 'Consumer Services',
      entityType: 'PUB',
      is_Active: 0,
      reportingCurrency: 'TWD',
      stockPrice: null,
      domicileFlag: 0,
      customLableCheck: true,
      commodity: 'Propane (USD/Gal)',
    },
    {
      id: 'MLJPP7-R',
      exchangeCode: 'ETR',
      exchangeName: 'XETRA',
      securityId: 'BRW5PN-S',
      factSetEntityId: '0HXTVP-E',
      rowNo: 72194,
      name: '1&1 AG',
      properName: '1&1 AG',
      securityType: 'SHARE',
      security_code: null,
      status: null,
      ff_industry: 'Industrial',
      description:
        '1&1 AG provides telecommunication services. Its services include postpaid and prepaid, as well as landline and DSL products and related applications such as home networking, online storage, telephony, video on demand, and other. The firm operates through the following brands: 1&1, yourfone, smartmobil.de, maXXim, simply, helloMobil, McSIM, Phonex, sim.de, eteleon, discoTEL, discoPLUS, discoSURF, DeutschlandSIM, winSIM, PremiumSIM, M2M-Mobil, and GTCom. It operates through the following segments: Access, 5G, and Miscellaneous. The Access segment consists of wireless access and landline products, including the related applications such as home networks, online storage, telephony, video on demand or IPTV. The 5G segment consists of expenses and income relating to the preparation and conduct of the 5G frequency auction. The Miscellaneous segment comprises essentially all the activities related to the offering of custom software solutions and of maintenance and support services. The company was founded in 1997 and is headquartered in Maintal, Germany.',
      companyTicker: '1U1',
      countryName: 'Germany',
      countryCode: 'DEU',
      countryId: 84,
      ticsIndustryCode: 'T4910',
      ticsIndustryName: 'Specialty Telecommunications',
      ticsSectorCode: 'T4900',
      ticsSectorName: 'Communications',
      entityType: 'PUB',
      is_Active: 0,
      reportingCurrency: 'EUR',
      stockPrice: null,
      domicileFlag: 0,
      customLableCheck: true,
      commodity: 'Uranium (USD/Lbs)',
    },
    {
      id: 'N5PVRR-R',
      exchangeCode: 'LON',
      exchangeName: 'London Stock Exchange',
      securityId: 'BRW5PN-S',
      factSetEntityId: '0HXTVP-E',
      rowNo: 76586,
      name: '1&1 AG',
      properName: '1&1 AG',
      securityType: 'SHARE',
      security_code: null,
      status: null,
      ff_industry: 'Industrial',
      description:
        '1&1 AG provides telecommunication services. Its services include postpaid and prepaid, as well as landline and DSL products and related applications such as home networking, online storage, telephony, video on demand, and other. The firm operates through the following brands: 1&1, yourfone, smartmobil.de, maXXim, simply, helloMobil, McSIM, Phonex, sim.de, eteleon, discoTEL, discoPLUS, discoSURF, DeutschlandSIM, winSIM, PremiumSIM, M2M-Mobil, and GTCom. It operates through the following segments: Access, 5G, and Miscellaneous. The Access segment consists of wireless access and landline products, including the related applications such as home networks, online storage, telephony, video on demand or IPTV. The 5G segment consists of expenses and income relating to the preparation and conduct of the 5G frequency auction. The Miscellaneous segment comprises essentially all the activities related to the offering of custom software solutions and of maintenance and support services. The company was founded in 1997 and is headquartered in Maintal, Germany.',
      companyTicker: '0E6Y',
      countryName: 'Germany',
      countryCode: 'DEU',
      countryId: 84,
      ticsIndustryCode: 'T4910',
      ticsIndustryName: 'Specialty Telecommunications',
      ticsSectorCode: 'T4900',
      ticsSectorName: 'Communications',
      entityType: 'PUB',
      is_Active: 0,
      reportingCurrency: 'EUR',
      stockPrice: null,
      domicileFlag: 0,
      customLableCheck: true,
      commodity: 'Soybeans (USd/Bu)',
    },
  ];
  constructor(
    private util: UtilService,
    private service: WatchlistServiceService,
    private financial_service: FinancialMarketDataService
  ) {}

  ngOnInit(): void {
    this.service.$sidebarrequest.subscribe((res: any) => {
      if (res == true) {
        this.handleMenuClick();
      }
    });
    for (var i of this.companydata) {
      // this.CompanyName.push(i.name);
      this.securityName.push(i.derivative);
    }
    this.options = {
      width: '100%',
    };
    this.companyDropdownData();

    //ForSearchingCompaniesInDropdown
    $(document).on('select2:open', (e) => {
      if (e.target.id === 'companySearch') {
        const selectSearchInput = document.querySelector(
          '.select2-search__field'
        );

        let timeout: any = null;

        selectSearchInput?.addEventListener('input', (e: any) => {
          clearTimeout(timeout);

          if (this.previousAPI !== null) {
            this.previousAPI.unsubscribe();
          }

          this.selectedcdsSearchTerm = e.target.value;
          if (this.selectedcdsSearchTerm !== '') {
            timeout = setTimeout(() => {
              this.util.loaderService.display(true);
              var formattedData: any = [];
              this.previousAPI = this.financial_service
                .getCompanyDropdownDataOnSearch(this.selectedcdsSearchTerm)
                .subscribe((res) => {
                  res.forEach((element: any) => {
                    formattedData.push({
                      id: element.company_id,
                      text: element.company_name,
                    });
                  });
                  this.CompanyName = formattedData;
                  this.util.loaderService.display(false);
                  setTimeout(() => {
                    $('#companySearch').select2('open');
                    (
                      document.querySelector('.select2-search__field') as any
                    ).value = this.selectedcdsSearchTerm;
                  }, 100);
                });
            }, 1000);
          }
        });
      } else if (e.target.id === 'companyDropdownPEVC') {
        // const selectSearchInput = document.querySelector(
        //   '.select2-search__field'
        // );
        // let timeout: any = null;
        // selectSearchInput?.addEventListener('input', (e: any) => {
        //   clearTimeout(timeout);
        //   if (this.previousAPI !== null) {
        //     this.previousAPI.unsubscribe();
        //   }
        //   this.selectedcdsSearchTerm = e.target.value;
        //   timeout = setTimeout(() => {
        //     // this.util.loaderService.display(true);
        //     this.getTransactionsDetCompanySearchDataHandler(e.target.value);
        //   }, 1000);
        // });
      }
    });
  }
  selectedCompaniesWatchlist: any = [];
  onCompanySelect(data: any) {
    let company: any;
    if (data) {
      for (let i = 0; i <= this.CompanyName.length; i++) {
        if (data == this.CompanyName[i]?.id) {
          company = this.CompanyName[i]?.text;
          if (this.selectedCompanydata == company) return;
          this.selectedCompanydata = company;
          for (let i = 0; i < this.selectedCompany.length; i++) {
            if (company == this.selectedCompany[i]) {
              return;
            }
          }
          this.selectedCompany.push(company);
          this.selectedCompaniesWatchlist.push({ data_entity_id: company });
          this.showcontainer = true;
        }
      }
    }
  }
  createwatchlist() {
    this.nowatchlist = false;
    this.showbar = true;
  }
  removeCompanyData(data: any, watchlistType?: any) {
    let entityId = data;
    let userId = '18';
    for (let i = 0; i < this.selectedCompany.length; i++) {
      if (data == this.selectedCompany[i]) {
        this.selectedCompany.splice(i, 1);
        this.selectedCompaniesWatchlist.splice(i, 1);
      }
    }
    if (this.selectedCompany.length < 1) {
      this.showcontainer = false;
    }
    this.financial_service
      .removeCompanyFromDropdown(
        userId,
        this.watchlistName,
        watchlistType,
        entityId
      )
      .subscribe((res: any) => {});
  }

  handleMenuClick() {
    this.showSideBar = !this.showSideBar;
  }
  handleServicesCollapse() {
    this.subMenuCollapse = !this.subMenuCollapse;
  }
  createnew_watchlist() {
    if (this.selectedParentSet == 'company_tab') {
      this.refreshflag();
      this.isVisiblecompany = true;
      this.companyflag = true;
      this.newPortfolio = false;
    } else if (this.selectedParentSet == 'income_tab') {
      this.refreshflag();

      this.isVisiblefixedincome = true;
      this.fixed_incomeflag = true;
    } else if (this.selectedParentSet == 'derivatives_tab') {
      this.refreshflag();
      this.isVisiblederivatives = true;
      this.derivativesflag = true;
    } else if (this.selectedParentSet == 'commodity_tab') {
      this.refreshflag();
      this.isVisiblecommodity = true;
      this.commodityflag = true;
    } else if (this.selectedParentSet == 'economy_tab') {
      this.refreshflag();
      this.isVisibleeconomy = true;
      this.economyflag = true;
    }
  }
  createnew_portfolio() {
    this.companyflag = false;
    this.newPortfolio = true;
  }
  openPopup(event?: any) {
    this.displayStyle = 'block';
    this.service.openmodel(event);
  }
  closePopup() {
    this.displayStyle = 'none';
  }
  refreshflag() {
    this.companyflag = false;
    this.fixed_incomeflag = false;
    this.derivativesflag = false;
    this.commodityflag = false;
    this.economyflag = false;
    this.isVisiblecompany = false;
    this.isVisiblefixedincome = false;
    this.isVisiblederivatives = false;
    this.isVisiblecommodity = false;
    this.isVisibleeconomy = false;
  }

  navigateToSection(section: string) {
    //this.refreshflag();
    this.selectedParentSet = section;
    if (this.selectedParentSet == 'company_tab') {
      this.refreshflag();
      this.isVisiblecompany = true;
    } else if (this.selectedParentSet == 'income_tab') {
      this.refreshflag();
      this.isVisiblefixedincome = true;
    } else if (this.selectedParentSet == 'derivatives_tab') {
      this.refreshflag();
      this.isVisiblederivatives = true;
    } else if (this.selectedParentSet == 'commodity_tab') {
      this.refreshflag();
      this.isVisiblecommodity = true;
    } else if (this.selectedParentSet == 'economy_tab') {
      this.refreshflag();
      this.isVisibleeconomy = true;
    }

    document
      .getElementById(`${section}`)
      ?.scrollIntoView({ behavior: 'smooth' });
  }

  tabToBeHighlighted: string = 'company_tab';
  highlightTab(tab: string) {
    this.selectedParentSet = tab;
  }
  watchlistNameChange(e: any) {
    console.log(e.data);
    this.watchlistName = e.target.value;
  }
  savebuttonclick(event: any) {
    this.service.opensidebar();
    let divId = event;
    this.service.showtabledata(divId);
    let body = {
      user_id: '18',
      watchlist_name: this.watchlistName,
      watchlist_type: event,
      watchlistdataList: this.selectedCompaniesWatchlist,
    };
    this.financial_service.createWatchlist(body).subscribe((res: any) => {});
    this.financial_service
      .getWatchlistNames(body.user_id, event)
      .subscribe((res: any) => {
        this.service.getWatchlistNames(res);
      });
    this.tableDataWatchlist('18', this.watchlistName, event);
  }
  tableDataWatchlist(user_id: any, watchlistName: any, watchlist_type: any) {
    this.financial_service
      .getWatchlistTableData(user_id, watchlistName, watchlist_type)
      .subscribe((res: any) => {
        console.log(res);
      });
  }
  deletewatchlist() {
    this.service.deletewatchlist();
  }
  companyDropdownData() {
    var formattedData: any = [];
    this.financial_service.getCompanyDropdownData().subscribe((res: any) => {
      res.forEach((element: any) => {
        formattedData.push({
          id: element.company_id,
          text: element.company_name,
        });
      });
      this.CompanyName = formattedData;
    });
  }
  onCompanyDropdownClick() {
    this.companyDropdownData();
  }
}

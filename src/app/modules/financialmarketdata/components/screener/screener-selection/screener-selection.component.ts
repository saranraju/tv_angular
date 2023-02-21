import { Component, OnInit } from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FinancialMarketDataService } from 'src/app/services/financialmarketdata.service';

@Component({
  selector: 'app-screener-selection',
  templateUrl: './screener-selection.component.html',
  styleUrls: ['./screener-selection.component.scss'],
})
export class ScreenerSelectionComponent implements OnInit {
  tabactive: any = 1;
  headerTabs: any = [
    {
      id: 1,
      instrument_type: 'Company',
    },
    {
      id: 2,
      instrument_type: 'Fixed Income',
    },
    {
      id: 3,
      instrument_type: 'CDS',
    },
    {
      id: 4,
      instrument_type: 'Transactions',
    },
    {
      id: 5,
      instrument_type: 'Company Management',
    },
    {
      id: 6,
      instrument_type: 'News',
    },
  ];
  selectOptions: any = {
    multiple: true,
  };
  selectCountryData: any = [];
  regionSelected: any = false;
  selectRegionData: any = [];
  selectedCountryValue: any = 'All';
  selectIndustryData: any = [];
  selectSectorData: any = [];
  selectedSector: any;
  selectCurrencyData: any = [];
  addCriteriaData: any = [];
  addCriteriaChildData: any = [
    // {
    //   id: 1,
    //   subCriteria: 'Sales/Revenue',
    //   selected: false,
    //   type: 'slider',
    // },
    // {
    //   id: 3,
    //   subCriteria: 'Advisor',
    //   selected: false,
    //   type: 'dropdown',
    // },
    // {
    //   id: 4,
    //   subCriteria: 'Net Income',
    //   selected: false,
    //   type: 'slider',
    // },
    // {
    //   id: 5,
    //   subCriteria: 'Designation',
    //   selected: false,
    //   type: 'dropdown',
    // },
    // {
    //   id: 6,
    //   subCriteria: 'Date Range',
    //   selected: false,
    //   type: 'date',
    // },
  ];
  showChildList: any = false;
  index: any = 0;
  selectedPlus_icon: boolean = false;
  showCheckIcon: any = false;
  subChildIndex: any;
  minValue: any = 0;
  maxValue: any = 1000;
  options: Options = {
    floor: 0,
    ceil: 200,
    showTicks: true,
  };
  minValueSelected: any = 0;
  maxValueSelected: any = 200;
  showExecuteUI: any = false;
  hideFilterCriteria: any = false;
  resultsPerPageData: any = [
    {
      id: 1,
      text: '10',
    },
    {
      id: 2,
      text: '25',
    },
    {
      id: 3,
      text: '50',
    },
    {
      id: 4,
      text: '100',
    },
  ];
  screenResultsTableData: any = {
    title: [
      {
        label: 'Company Name',
        key: 'companyName',
        color: '#ffc000',
        sorting: true,
      },
      {
        label: 'Country',
        key: 'country',
        align: 'center',
        sorting: true,
      },
      {
        label: 'Industry',
        key: 'industry',
        align: 'center',
        sorting: true,
      },
      {
        label: 'Year Ending',
        key: 'yearEnding',
        align: 'center',
        sorting: true,
      },
      {
        label: 'Sales/Revenue (USD/Million)',
        key: 'sales',
        align: 'center',
        sorting: true,
      },
    ],
    value: [
      {
        companyName: 'ABC Ltd.',
        country: 'USA',
        industry: 'XYZ PQR',
        yearEnding: 'Dec-2021',
        sales: 'XXX,XXX,XXX,XXX',
      },
      {
        companyName: 'ABC Ltd.',
        country: 'India',
        industry: 'XYZ PQR',
        yearEnding: 'Dec-2021',
        sales: 'XXX,XXX,XXX,XXX',
      },
      {
        companyName: 'ABC Ltd.',
        country: 'China',
        industry: 'XYZ PQR',
        yearEnding: 'Dec-2021',
        sales: 'XXX,XXX,XXX,XXX',
      },
      {
        companyName: 'ABC Ltd.',
        country: 'USA',
        industry: 'XYZ PQR',
        yearEnding: 'Dec-2021',
        sales: 'XXX,XXX,XXX,XXX',
      },
      {
        companyName: 'ABC Ltd.',
        country: 'USA',
        industry: 'XYZ PQR',
        yearEnding: 'Dec-2021',
        sales: 'XXX,XXX,XXX,XXX',
      },
      {
        companyName: 'ABC Ltd.',
        country: 'USA',
        industry: 'XYZ PQR',
        yearEnding: 'Dec-2021',
        sales: 'XXX,XXX,XXX,XXX',
      },
      {
        companyName: 'ABC Ltd.',
        country: 'USA',
        industry: 'XYZ PQR',
        yearEnding: 'Dec-2021',
        sales: 'XXX,XXX,XXX,XXX',
      },
      {
        companyName: 'ABC Ltd.',
        country: 'India',
        industry: 'XYZ PQR',
        yearEnding: 'Dec-2021',
        sales: 'XXX,XXX,XXX,XXX',
      },
      {
        companyName: 'ABC Ltd.',
        country: 'China',
        industry: 'XYZ PQR',
        yearEnding: 'Dec-2021',
        sales: 'XXX,XXX,XXX,XXX',
      },
      {
        companyName: 'ABC Ltd.',
        country: 'USA',
        industry: 'XYZ PQR',
        yearEnding: 'Dec-2021',
        sales: 'XXX,XXX,XXX,XXX',
      },
      {
        companyName: 'ABC Ltd.',
        country: 'USA',
        industry: 'XYZ PQR',
        yearEnding: 'Dec-2021',
        sales: 'XXX,XXX,XXX,XXX',
      },
      {
        companyName: 'ABC Ltd.',
        country: 'USA',
        industry: 'XYZ PQR',
        yearEnding: 'Dec-2021',
        sales: 'XXX,XXX,XXX,XXX',
      },
    ],
  };
  currentPageSelected: any = 1;
  itemsPerPage: any = 25;
  selectedResultsValue: any = 2;
  savedScreen: any = [
    {
      id: 1,
      screenName: 'ABC',
    },
    {
      id: 2,
      screenName: '123',
    },
    {
      id: 3,
      screenName: '456',
    },
    {
      id: 4,
      screenName: '789',
    },
    {
      id: 5,
      screenName: 'XYZ',
    },
  ];
  screenName: any = 'Results';
  deleteScreenName: any;
  editCriteriaTitle: any;
  selectedCountry: any;
  selectedIndustry: any;
  selectedCurrency: any;
  selectedRegion: any;
  Object = Object;
  isFieldSelected: any = {};
  clickedMetric: any;
  pageChanged: any;
  disableCurrencyDropdown: any = false;
  selectedAdvisor: any;
  selectAdvisorData: any = [
    {
      id: 1,
      text: 'Advisor 1',
    },
    {
      id: 2,
      text: 'Advisor 2',
    },
    {
      id: 3,
      text: 'Advisor 3',
    },
    {
      id: 4,
      text: 'Advisor 4',
    },
  ];
  subMetricTabSelected: any;

  constructor(
    public auth: AuthService,
    private financialMarketData: FinancialMarketDataService
  ) {}

  ngOnInit(): void {
    $(document).on('select2:open', () => {
      const inputs: any = document.querySelectorAll(
        '.select2-search__field[aria-controls]'
      );
      const mostRecentlyOpenedInput = inputs[inputs.length - 1];
      mostRecentlyOpenedInput.focus();
    });

    this.selectedCurrency = 'USD';

    this.getScreenerCountryHandler();
    this.getScreenerIndustryHandler();
    this.getScreenerCurrencyHandler();
    this.getScreenerRegionHandler();
    this.getScreenerSectorHandler();
    this.getScreenerMetricsHandler(1);
  }

  onChangeHeaderTab(e: any) {
    this.showExecuteUI = false;
    this.selectedCountry = '';
    this.selectedRegion = '';
    this.selectedIndustry = '';
    this.selectedSector = '';
    this.selectedCurrency = 'USD';
    this.showCheckIcon = false;
    this.showChildList = false;
    this.selectedPlus_icon = false;
    this.isFieldSelected = {};

    this.tabactive = e;
    if (e === 3) {
      this.regionSelected = true;
    } else {
      this.regionSelected = false;
    }

    if (e === 3 || e === 5 || e === 6) {
      this.subMetricTabSelected = true;
    } else {
      this.subMetricTabSelected = false;
    }

    this.getScreenerMetricsHandler(this.tabactive);
  }

  handleExpandIconClick(i: any) {
    if (this.selectedPlus_icon && this.index === i) {
      this.selectedPlus_icon = false;
      this.showChildList = false;
      this.showCheckIcon = false;
    } else {
      this.showChildList = !this.showChildList;

      if (i === this.index) {
        if (this.selectedPlus_icon == false) {
          this.showChildList = true;
          this.selectedPlus_icon = true;
        } else {
          this.showChildList = false;
          this.selectedPlus_icon = false;
        }
      } else {
        this.index = i;
        this.selectedPlus_icon = true;
        this.showChildList = true;
        this.showCheckIcon = false;
      }
    }
  }

  handleChildListItemClick(i: any, data: any, screenerSubCriteria: any) {
    // if (this.showCheckIcon && this.subChildIndex === i) {
    //   this.showCheckIcon = false;
    // } else {
    //   if (i === this.subChildIndex) {
    //     if (this.showCheckIcon == false) {
    //       this.editCriteriaTitle = data.subCriteria;
    //       this.showCheckIcon = true;
    //     } else {
    //       this.showCheckIcon = false;
    //     }
    //   } else {
    //     this.editCriteriaTitle = data.subCriteria;
    //     this.subChildIndex = i;
    //     this.showCheckIcon = true;
    //   }
    // }
    this.clickedMetric = data.subCriteriaName;

    screenerSubCriteria.map((el: any) => {
      if (el.subCriteriaName === this.clickedMetric) {
        el.criteriaSelected = true;
      }
    });

    if (data.type === 'slider') {
      this.isFieldSelected[this.clickedMetric] = {
        min: 0,
        max: 200,
        key: data.id,
        label: data.subCriteriaName,
        options: {},
        metricType: data.type,
      };
    } else {
      this.isFieldSelected[this.clickedMetric] = {
        key: data.id,
        label: data.subCriteriaName,
        metricType: data.type,
      };
    }
  }

  handleChildListItemClickSubMetric(i: any, data: any) {
    this.clickedMetric = data.criteriaName;

    this.addCriteriaData.forEach((el: any) => {
      if (el.criteriaName === this.clickedMetric) {
        el.criteriaSelected = true;
      }
    });

    if (data.type === 'slider') {
      this.isFieldSelected[this.clickedMetric] = {
        min: 0,
        max: 200,
        key: data.id,
        label: data.criteriaName,
        options: {},
        metricType: data.type,
      };
    } else {
      this.isFieldSelected[this.clickedMetric] = {
        key: data.id,
        label: data.criteriaName,
        metricType: data.type,
      };
    }
  }

  removeMatric(data: any) {
    if (this.subMetricTabSelected) {
      this.addCriteriaData.forEach((criteria: any) => {
        if (criteria.criteriaName === data) {
          criteria.criteriaSelected = false;
        }
      });
    } else {
      this.addCriteriaData.forEach((criteria: any) => {
        criteria.screenerSubCriteria.forEach((subCriteria: any) => {
          if (subCriteria.subCriteriaName === data) {
            subCriteria.criteriaSelected = false;
          }
        });
      });
    }

    delete this.isFieldSelected[data];
  }

  getValueData(e: any) {
    this.minValueSelected = e;
  }

  getHighValueData(e: any) {
    this.maxValueSelected = e;
  }

  handleExecuteBtnClick() {
    this.showExecuteUI = true;
  }

  handleHideFilterBtnClick() {
    this.hideFilterCriteria = true;
  }

  handleEditCriteriaBtnClick() {
    this.hideFilterCriteria = false;
  }

  handleResultsPerPageChanged(data: any) {
    if (this.resultsPerPageData && this.selectedResultsValue !== data) {
      this.selectedResultsValue = data;

      this.pageChanged = true;
      this.itemsPerPage =
        this.resultsPerPageData[this.selectedResultsValue - 1].text;
    }
  }

  handleSaveBtnClick() {
    this.auth.showSavedScreensModal = true;
  }

  handleSelectedSavedScreen(e: any) {
    this.screenName = e;
  }

  handelselectedSavedScreenInput(e: any) {
    if (e) {
      this.savedScreen.push({
        id: this.screenName,
        screenName: this.screenName,
      });
    }
  }

  handleSavedScreenSelected(e: any) {
    this.hideFilterCriteria = true;
    this.showExecuteUI = true;
    this.screenName = e;
  }

  handleDownloadIconClick() {
    this.auth.showSavedScreensModal2 = true;
  }

  handleSavedScreenDeleteText(e: any) {
    this.deleteScreenName = e.screenName;
  }

  handleConfirmDeletion(e: any) {
    if (e) {
      this.savedScreen = this.savedScreen.filter((el: any) => {
        return el.screenName !== this.deleteScreenName;
      });
    }
  }

  handleRefreshIconClick() {
    this.showExecuteUI = false;
    this.selectedCountry = '';
    this.selectedRegion = '';
    this.selectedIndustry = '';
    this.selectedSector = '';
    this.selectedCurrency = 'USD';
    this.showCheckIcon = false;
    this.showChildList = false;
    this.selectedPlus_icon = false;
    this.isFieldSelected = {};
    this.addCriteriaData.forEach((criteria: any) => {
      criteria.screenerSubCriteria.forEach((subCriteria: any) => {
        subCriteria.criteriaSelected = false;
      });
    });
  }

  handleFormulaBuilderClick() {
    this.auth.showFormulaBuilderModal = true;
  }

  onValueChangedDropdowns(type: any, value: any) {
    if (type === 'country') {
      this.selectedCountry = value;
    } else if (type === 'region') {
      this.selectedRegion = value;
    } else if (type === 'industry') {
      this.selectedIndustry = value;
    } else if (type === 'sector') {
      this.selectedSector = value;
    } else if (type === 'currency') {
      this.selectedCurrency = value;
    }
  }

  getScreenerCountryHandler() {
    this.financialMarketData.getScreenerCountry().subscribe((res: any) => {
      let countryLocalData: any = [];

      res.forEach((el: any) => {
        countryLocalData.push({
          id: el.country_name,
          text: el.country_name,
        });
      });

      this.selectCountryData = countryLocalData;
    });
  }

  getScreenerIndustryHandler() {
    this.financialMarketData.getScreenerIndustry().subscribe((res: any) => {
      let industryLocalData: any = [];

      res.forEach((el: any) => {
        industryLocalData.push({
          id: el.industry_name,
          text: el.industry_name,
        });
      });

      industryLocalData.sort((a: any, b: any) => a.text.localeCompare(b.text));

      this.selectIndustryData = industryLocalData;
    });
  }

  getScreenerCurrencyHandler() {
    this.financialMarketData.getScreenerCurrency().subscribe((res: any) => {
      let currencyLocalData: any = [];

      res.forEach((el: any) => {
        currencyLocalData.push({
          id: el.iso_code_2,
          text: `${el.currency_name} (${el.iso_code_2})`,
        });
      });

      currencyLocalData.sort((a: any, b: any) => a.text.localeCompare(b.text));

      this.selectCurrencyData = currencyLocalData;
    });
  }

  getScreenerRegionHandler() {
    this.financialMarketData.getScreenerRegion().subscribe((res: any) => {
      let regionLocalData: any = [];

      res.forEach((el: any) => {
        regionLocalData.push({
          id: el.region_name,
          text: el.region_name,
        });
      });

      this.selectRegionData = regionLocalData;
    });
  }

  getScreenerSectorHandler() {
    this.financialMarketData.getScreenerSector().subscribe((res: any) => {
      let sectorLocalData: any = [];

      res.forEach((el: any) => {
        sectorLocalData.push({
          id: el.sector_name,
          text: el.sector_name,
        });
      });

      sectorLocalData.sort((a: any, b: any) => a.text.localeCompare(b.text));

      this.selectSectorData = sectorLocalData;
    });
  }

  getScreenerMetricsHandler(tabId: any) {
    this.financialMarketData.getScreenerMetrics(tabId).subscribe((res: any) => {
      this.addCriteriaData = res.screenerCriteria;

      if (this.subMetricTabSelected) {
        this.addCriteriaData.forEach((criteria: any) => {
          criteria.criteriaSelected = false;
        });
      } else {
        this.addCriteriaData.forEach((criteria: any) => {
          criteria.screenerSubCriteria.forEach((subCriteria: any) => {
            subCriteria.criteriaSelected = false;
          });
        });
      }
    });
  }
}

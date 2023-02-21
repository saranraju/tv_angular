import {
  Component,
  HostListener,
  Input,
  Output,
  OnInit,
  EventEmitter,
  OnChanges,
} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FinancialMarketDataService } from 'src/app/services/financialmarketdata.service';
import { UtilService } from 'src/app/services/util.service';
import { LoaderServiceService } from '../../loader-service.service';
import { saveAs } from 'file-saver';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-pevc-fund',
  templateUrl: './pevc-fund.component.html',
  styleUrls: ['./pevc-fund.component.scss'],
})
export class PevcFundComponent implements OnInit, OnChanges {
  constructor(
    public router: Router,
    public auth: AuthService,
    public util: UtilService,
    public datepipe: DatePipe,
    public loaderService: LoaderServiceService,
    private financialMarketData: FinancialMarketDataService
  ) {}

  benchmarkTableData: any = {
    title: [
      {
        label: 'Fund Name',
        key: 'Fund_name',
        color: '#ffc000',
        textDecoration: 'underline',
        cursor: 'pointer',
      },
      {
        label: 'Controlling Firm',
        key: 'contolling_firm',
        align: 'center',
        textDecoration: 'underline',
        cursor: 'pointer',
      },
      {
        label: 'Amount Raised (USD M)',
        key: 'AUM',
        align: 'center',
      },
      {
        label: 'Number of Investments',
        key: 'Number of Investments',
        align: 'center',
      },
    ],
    value: [],
  };

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
        customSort: 'entity_proper_name',
      },
      {
        label: 'Industry',
        key: 'tics_industry_name',
        // sorting: true,
        headerCursor: 'pointer',
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
        label: 'Total Round Funding Amount (USD Million)',
        key: 'valuation_fx',
        align: 'center',
        // sorting: true,
        // width: '13rem',
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
        label: 'Description',
        key: 'description',
        color: '#ffc000',
        textDecoration: 'underline',
        align: 'left',
        sorting: true,
        cursor: 'pointer',
        // width: '8.8rem',
      },
      {
        label: 'Round Name',
        key: 'roundName',
        // width: '8.8rem',
      },
      {
        label: 'Issue Type',
        key: 'issue_type',
        align: 'left',
        sorting: true,
        // width: '8.8rem',
      },
      {
        label: 'Financing Type',
        key: 'financing_type',
        align: 'left',
        sorting: true,
        // width: '8.8rem',
      },
      {
        label: 'Round Date',
        key: 'round_date',
        align: 'center',
        sorting: true,
        // width: '8.8rem',
      },
      {
        label: 'Investment Currency',
        key: 'investment_currency',
        align: 'center',
        sorting: true,
        // width: '8.5rem',
      },
      {
        label: 'Fund Investment in Round (USD Million)',
        key: 'valuation',
        align: 'center',
        sorting: true,
        // width: '9.8rem',
      },
      {
        label: 'Round Funding Amount (USD Million)',
        key: 'valuation_fx',
        align: 'center',
        sorting: true,
        // width: '12rem',
      },
      {
        label: 'Exit Date',
        key: 'exit_date',
        align: 'center',
        sorting: true,
        // width: '10rem',
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
  limitedPartnersTableData: any = {
    title: [
      {
        label: 'Investor Name',
        key: 'investor_name',
        sorting: true,
        headerCursor: 'pointer',
      },
      {
        label: 'Investor Type',
        key: 'investor_type',
        align: 'center',
        sorting: true,
        headerCursor: 'pointer',
      },
      {
        label: 'Country',
        key: 'country',
        sorting: true,
        align: 'center',
        headerCursor: 'pointer',
      },
      {
        label: 'Latest Investment Date',
        key: 'latest_investment_date',
        sorting: true,
        align: 'center',
        headerCursor: 'pointer',
      },
      {
        label: 'Investment Amount (USD Million)',
        key: 'investment_amount',
        align: 'center',
        sorting: true,
        headerCursor: 'pointer',
      },
      {
        label: 'Status',
        key: 'status',
        align: 'center',
        sorting: true,
        headerCursor: 'pointer',
      },
    ],
    value: [],
  };
  managementTableData: any = {
    title: [
      {
        label: 'Management Name',
        key: 'management',
        color: '#ffc000',
        textDecoration: 'underline',
        sorting: true,
        headerCursor: 'pointer',
        cursor: 'pointer',
      },
      {
        label: 'Designation',
        key: 'instrumentType',
        align: 'center',
        sorting: true,
        headerCursor: 'pointer',
      },

      {
        label: 'Experience',
        key: 'experience',
        align: 'center',
        sorting: true,
        headerCursor: 'pointer',
      },
      {
        label: 'Appointed',
        key: 'appointed',
        align: 'center',
        sorting: true,
        headerCursor: 'pointer',
      },
      {
        label: 'Related Companies',
        key: 'otherCompanies',
        align: 'center',
        sorting: true,
        headerCursor: 'pointer',
      },
    ],
    value: [],
  };
  selectCompanyPEVCData: any = [];

  // Not Listed
  benchmarkTableDataNotListed: any = {
    title: [
      {
        label: 'Firm Name',
        key: 'Firm_name',
        color: '#ffc000',
        textDecoration: 'underline',
        cursor: 'pointer',
      },
      {
        label: 'Active Funds',
        key: 'Active_Funds',
        align: 'center',
      },
      {
        label: 'AUM (USD M)',
        key: 'amount_raised',
        align: 'center',
      },
      {
        label: 'Average Fund Size (USD M)',
        key: 'Average_Fund_size',
        align: 'center',
      },
    ],
    value: [],
  };
  directInvestmentsTableDataNotListed: any = {
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
        width: '13rem',
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
  directInvestmentsChildTableDataNotListed: any = {
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
        width: '13rem',
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
      },
      {
        label: 'Fund Name',
        key: 'fund_name',
        color: '#ffc000',
        textDecoration: 'underline',
        sorting: true,
        cursor: 'pointer',
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
        width: '14rem',
      },
      {
        label: 'Sector Focus',
        key: 'sector_focus',
        align: 'center',
        sorting: true,
        width: '17rem',
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
        width: '16rem',
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
        width: '18rem',
        headerCursor: 'pointer',
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
  selectedPEVCCompany: any = '';

  selectedParentSet = 'summary_tab';
  @Input() notListedSelectedEntityId: any;
  @Input() fundCompanySelectedEntityId: any;
  @Output() hidePublicCompany: any = new EventEmitter();
  @Output() showListedPageOutput: any = new EventEmitter();
  @Output() checkPEVC: any = new EventEmitter();
  @Output() publicCompanyClick: any = new EventEmitter();
  @Output() privateCompanyClick: any = new EventEmitter();
  @Input() notListedSelectedName: any;
  @Input() fundSelectedName: any;
  @Input() pevcNotListedParticipatingFundsListed: any;
  @Input() fundCompanySelectedEntityIdFirm: any;
  @Input() notListedBenchmarkSelectedListed: any;
  @Input() fundBenchmarkFund: any;

  hideFocusSection: any = false;
  previousAPI: any = null;
  selectedNameDer: any;

  ngOnInit(): void {
    $(document).on('select2:open', (e) => {
      if (e.target.id === 'companyDropdownMNA1') {
        const inputs: any = document.querySelectorAll(
          '.select2-search__field[aria-controls]'
        );
        const mostRecentlyOpenedInput = inputs[inputs.length - 1];
        mostRecentlyOpenedInput.focus();

        const selectSearchInput = document.querySelector(
          '.select2-search__field'
        );

        let timeout: any = null;

        selectSearchInput?.addEventListener('input', (e: any) => {
          clearTimeout(timeout);

          if (this.previousAPI !== null) {
            this.previousAPI.unsubscribe();
          }

          this.selectedNameDer = e.target.value;

          timeout = setTimeout(() => {
            this.count_res = 0;
            this.total_count_res = 1;
            this.util.loaderService.display(true);

            this.getFundsSearchCompanies(e.target.value);
          }, 1000);
        });
      } else if (e.target.id === 'companyDropdownNotListed') {
        const inputs: any = document.querySelectorAll(
          '.select2-search__field[aria-controls]'
        );
        const mostRecentlyOpenedInput = inputs[inputs.length - 1];
        mostRecentlyOpenedInput.focus();
      }
    });

    this.count_res = 0;
    this.total_count_res = 12;
    this.util.loaderService.display(true);
    this.getCurreny();
    this.getStatusFund();
    this.getNotListedCompanies();
    // this.getFundCompanies();
  }

  ngOnChanges(): void {
    if (this.auth.showNotListedPage && this.notListedSelectedEntityId) {
      this.selectedCurrencyData = 'USD';
      this.benchmarkTableDataNotListed.title[2].label = `AUM (${this.selectedCurrencyData} M)`;
      this.benchmarkTableDataNotListed.title[3].label = `Average Fund Size (${this.selectedCurrencyData} M)`;
      this.directInvestmentsTableDataNotListed.title[7].label = `Total Investment (${this.selectedCurrencyData} Million)`;
      this.directInvestmentsTableDataNotListed.title[8].label = `Total Participated Round Funding Amount (${this.selectedCurrencyData} Million)`;
      this.directInvestmentsChildTableDataNotListed.title[7].label = `Investment in Round (${this.selectedCurrencyData} Million)`;
      this.directInvestmentsChildTableDataNotListed.title[8].label = `Round Funding Amount (${this.selectedCurrencyData} Million)`;
      this.fundOfFundsInvestmetns.title[2].label = `Amount Invested (${this.selectedCurrencyData} Million)`;
      this.fundOfFundsInvestmetns.title[6].label = `Amount Raised (${this.selectedCurrencyData} Million)`;
      this.firmStructureTableData.title[4].label = `Amount Raised (${this.selectedCurrencyData} Million)`;
      let e = this.notListedSelectedEntityId;

      this.notListedSelectedName = this.notListedSelectedName;

      this.getNumberOfActiveFunds(e);
      this.getNumberOfFundsUnderMng(e);
      this.getNumberOfAssetsUnderMng(e);
      this.getAvgFundSize(e);
      this.getpevcTotalInvestments(e);
      this.getPEVCNotListedBenchmark(e);
      this.getPEVCNotListedDirectInvestments(e, '1');
      this.getPEVCNotListedFundsInvestments(e, '1');
      this.getPEVCNotListedFirmStructure(e, '1');
      this.getFundMng(e, this.notListedSelectedName);
      this.getContactPEVC(this.notListedSelectedEntityId);
      this.getWebsitePEVC(this.notListedSelectedEntityId);
      this.getAddressPEVC(this.notListedSelectedEntityId);
      this.getNotListedMetadata(this.notListedSelectedEntityId);
    }

    if (this.auth.showNotListedPage && this.notListedBenchmarkSelectedListed) {
      this.selectedCurrencyData = 'USD';
      this.benchmarkTableDataNotListed.title[2].label = `AUM (${this.selectedCurrencyData} M)`;
      this.benchmarkTableDataNotListed.title[3].label = `Average Fund Size (${this.selectedCurrencyData} M)`;
      this.directInvestmentsTableDataNotListed.title[7].label = `Total Investment (${this.selectedCurrencyData} Million)`;
      this.directInvestmentsTableDataNotListed.title[8].label = `Total Participated Round Funding Amount (${this.selectedCurrencyData} Million)`;
      this.directInvestmentsChildTableDataNotListed.title[7].label = `Investment in Round (${this.selectedCurrencyData} Million)`;
      this.directInvestmentsChildTableDataNotListed.title[8].label = `Round Funding Amount (${this.selectedCurrencyData} Million)`;
      this.fundOfFundsInvestmetns.title[2].label = `Amount Invested (${this.selectedCurrencyData} Million)`;
      this.fundOfFundsInvestmetns.title[6].label = `Amount Raised (${this.selectedCurrencyData} Million)`;
      this.firmStructureTableData.title[4].label = `Amount Raised (${this.selectedCurrencyData} Million)`;
      let e = this.notListedBenchmarkSelectedListed.factset_pevc_firm_entity_id;
      this.notListedSelectedEntityId = e;
      this.notListedSelectedName =
        this.notListedBenchmarkSelectedListed.Firm_name.replaceAll('#', '%23');

      this.notListedSelectedName = this.notListedSelectedName;

      this.getNumberOfActiveFunds(e);
      this.getNumberOfFundsUnderMng(e);
      this.getNumberOfAssetsUnderMng(e);
      this.getAvgFundSize(e);
      this.getpevcTotalInvestments(e);
      this.getPEVCNotListedBenchmark(e);
      this.getPEVCNotListedDirectInvestments(e, '1');
      this.getPEVCNotListedFundsInvestments(e, '1');
      this.getPEVCNotListedFirmStructure(e, '1');
      this.getFundMng(e, this.notListedSelectedName);
      this.getContactPEVC(e);
      this.getWebsitePEVC(e);
      this.getAddressPEVC(e);
      this.getNotListedMetadata(e);
    }

    if (
      this.auth.showFundPage &&
      this.fundCompanySelectedEntityId &&
      this.fundCompanySelectedEntityIdFirm
    ) {
      this.fundSelectedName = this.fundSelectedName.replaceAll('#', '%23');

      let e = this.fundCompanySelectedEntityId;
      let eFirm = this.fundCompanySelectedEntityIdFirm;
      this.selectedCurrencyData = 'USD';
      this.getPEVCFundSummary(e);
      this.getPEVCFundBenchmark(e, 'USD');
      this.getPEVCFundCountryFocus(e);
      this.getPEVCFundSectorFocus(e);
      this.getPEVCFundDirectInvestments(e, '1');
      this.getLimitedPartnersFund(e, 1);
      this.getFundMng(eFirm, this.fundSelectedName);
      this.getInstrumentUsed(e);
      this.getInstrumentType(e);
      this.getContactPEVC(e);
      this.getWebsitePEVC(eFirm);
      this.getAddressPEVC(e);
      this.getFundMetadata(e, e);
    }

    if (this.pevcNotListedParticipatingFundsListed) {
      this.selectedCurrencyData = 'USD';
      this.benchmarkTableDataNotListed.title[2].label = `AUM (${this.selectedCurrencyData} M)`;
      this.benchmarkTableDataNotListed.title[3].label = `Average Fund Size (${this.selectedCurrencyData} M)`;
      this.directInvestmentsTableDataNotListed.title[7].label = `Total Investment (${this.selectedCurrencyData} Million)`;
      this.directInvestmentsTableDataNotListed.title[8].label = `Total Participated Round Funding Amount (${this.selectedCurrencyData} Million)`;
      this.directInvestmentsChildTableDataNotListed.title[7].label = `Investment in Round (${this.selectedCurrencyData} Million)`;
      this.directInvestmentsChildTableDataNotListed.title[8].label = `Round Funding Amount (${this.selectedCurrencyData} Million)`;
      this.fundOfFundsInvestmetns.title[2].label = `Amount Invested (${this.selectedCurrencyData} Million)`;
      this.fundOfFundsInvestmetns.title[6].label = `Amount Raised (${this.selectedCurrencyData} Million)`;
      this.firmStructureTableData.title[4].label = `Amount Raised (${this.selectedCurrencyData} Million)`;
      this.fundCompanySelectedEntityId =
        this.pevcNotListedParticipatingFundsListed.factset_fund_entity_id;
      let e = this.pevcNotListedParticipatingFundsListed.factset_fund_entity_id;
      this.fundCompanySelectedEntityIdFirm =
        this.pevcNotListedParticipatingFundsListed.factset_pevc_firm_entity_id;
      this.fundSelectedName =
        this.pevcNotListedParticipatingFundsListed.participating_funds;
      this.getPEVCFundSummary(e);
      this.getPEVCFundBenchmark(e, 'USD');
      this.getPEVCFundCountryFocus(e);
      this.getPEVCFundSectorFocus(e);
      this.getPEVCFundDirectInvestments(this.fundCompanySelectedEntityId, '1');
      this.getLimitedPartnersFund(e, 1);
      this.getFundMng(this.fundCompanySelectedEntityId, this.fundSelectedName);
      this.getInstrumentUsed(e);
      this.getInstrumentType(e);
      this.getFundMetadata(
        this.fundCompanySelectedEntityId,
        this.fundCompanySelectedEntityId
      );
    }

    if (this.auth.showFundPage && this.fundBenchmarkFund) {
      this.selectedCurrencyData = 'USD';
      this.directInvestmentsTableData.title[6].label = `Total Investment (${this.selectedCurrencyData} Million)`;
      this.directInvestmentsTableData.title[7].label = `Total Participated Round Funding Amount (${this.selectedCurrencyData} Million)`;
      this.directInvestmentsChildTableData.title[6].label = `Investment in Round (${this.selectedCurrencyData} Million)`;
      this.directInvestmentsChildTableData.title[7].label = `Round Funding Amount (${this.selectedCurrencyData} Million)`;
      this.limitedPartnersTableData.title[4].label = `Investment Amount (${this.selectedCurrencyData} Million)`;
      this.benchmarkTableData.title[2].label = `Amount Raised (${this.selectedCurrencyData} M)`;
      this.fundCompanySelectedEntityId =
        this.fundBenchmarkFund.factset_fund_entity_id;
      this.fundCompanySelectedEntityIdFirm =
        this.fundBenchmarkFund.factset_pevc_firm_entity_id;
      let eFirm = this.fundBenchmarkFund.factset_pevc_firm_entity_id;
      let e = this.fundBenchmarkFund.factset_fund_entity_id;
      this.fundSelectedName =
        this.fundBenchmarkFund?.contolling_firm.replaceAll('#', '%23');

      this.count_res = 0;
      this.total_count_res = 10;
      this.util.loaderService.display(true);
      this.getPEVCFundSummary(e);
      this.getPEVCFundBenchmark(e, 'USD');
      this.getPEVCFundCountryFocus(e);
      this.getPEVCFundSectorFocus(e);
      this.getPEVCFundDirectInvestments(e, '1');
      this.getLimitedPartnersFund(e, 1);
      this.getFundMng(e, this.fundSelectedName);
      this.getInstrumentUsed(e);
      this.getInstrumentType(e);
      this.getContactPEVC(e);
      this.getWebsitePEVC(eFirm);
      this.getAddressPEVC(e);
      this.getFundMetadata(
        this.fundCompanySelectedEntityId,
        this.fundCompanySelectedEntityId
      );
    }
  }

  tabToBeHighlighted: string = 'summary_tab';
  highlightTab(tab: string) {
    let element = document.querySelector('.newcompny-tabs') as HTMLElement;
    this.selectedParentSet = tab;
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    let element = document.querySelector('.navbar') as HTMLElement;
    if (window.pageYOffset > element.clientHeight) {
      element.classList.add('navbar-inverse');
    } else {
      element.classList.remove('navbar-inverse');
    }
  }

  navigateToSection(section: string) {
    this.selectedParentSet = section;
    // window.location.hash = '';
    // window.location.hash = section;
    document
      .getElementById(`${section}`)
      ?.scrollIntoView({ behavior: 'smooth' });
  }

  handlePublicCompanyClick() {
    this.auth.hidePublicCompany = false;
    this.publicCompanyClick.emit(true);
  }

  handlePrivateCompanyClick() {
    this.auth.hidePublicCompany = false;
    this.privateCompanyClick.emit(true);
  }

  handlePEVCCompanyClick() {
    this.auth.showPEVCCompanyModalFund = true;
    // this.auth.hidePublicCompany = false;
    // this.auth.showNotListedPage = false;
    // this.auth.showFundPage = false;
    this.auth.checkPEVC = true;
  }

  @Output() pevcListedSelectedFromFund = new EventEmitter<any>();
  handleSelectedPEVCListedCompanyEntityId(e: any) {
    this.pevcListedSelectedFromFund.emit(e);
  }

  handleselectedPEVCNotListedCompanyEntityId(e: any) {
    this.count_res = 0;
    this.total_count_res = 10;
    this.util.loaderService.display(true);
    this.selectedCurrencyData = 'USD';
    this.benchmarkTableDataNotListed.title[2].label = `AUM (${this.selectedCurrencyData} M)`;
    this.benchmarkTableDataNotListed.title[3].label = `Average Fund Size (${this.selectedCurrencyData} M)`;
    this.directInvestmentsTableDataNotListed.title[7].label = `Total Investment (${this.selectedCurrencyData} Million)`;
    this.directInvestmentsTableDataNotListed.title[8].label = `Total Participated Round Funding Amount (${this.selectedCurrencyData} Million)`;
    this.directInvestmentsChildTableDataNotListed.title[7].label = `Investment in Round (${this.selectedCurrencyData} Million)`;
    this.directInvestmentsChildTableDataNotListed.title[8].label = `Round Funding Amount (${this.selectedCurrencyData} Million)`;
    this.fundOfFundsInvestmetns.title[2].label = `Amount Invested (${this.selectedCurrencyData} Million)`;
    this.fundOfFundsInvestmetns.title[6].label = `Amount Raised (${this.selectedCurrencyData} Million)`;
    this.firmStructureTableData.title[4].label = `Amount Raised (${this.selectedCurrencyData} Million)`;
    this.notListedSelectedEntityId = e.factset_pevc_firm_entity_id;
    this.notListedSelectedName = e.entity_proper_name.replaceAll('#', '%23');
    this.getNumberOfActiveFunds(this.notListedSelectedEntityId);
    this.getNumberOfFundsUnderMng(this.notListedSelectedEntityId);
    this.getNumberOfAssetsUnderMng(this.notListedSelectedEntityId);
    this.getAvgFundSize(this.notListedSelectedEntityId);
    this.getpevcTotalInvestments(this.notListedSelectedEntityId);
    this.getPEVCNotListedBenchmark(this.notListedSelectedEntityId);
    this.getPEVCNotListedDirectInvestments(this.notListedSelectedEntityId, '1');
    this.getPEVCNotListedFundsInvestments(this.notListedSelectedEntityId, '1');
    this.getPEVCNotListedFirmStructure(this.notListedSelectedEntityId, '1');
    this.getFundMng(this.notListedSelectedEntityId, this.notListedSelectedName);
    this.getContactPEVC(this.notListedSelectedEntityId);
    this.getWebsitePEVC(this.notListedSelectedEntityId);
    this.getAddressPEVC(this.notListedSelectedEntityId);
    this.getNotListedMetadata(this.notListedSelectedEntityId);
  }

  handleselectedPEVCFundCompanyEntityId(e: any) {
    this.selectedCurrencyData = 'USD';
    this.directInvestmentsTableData.title[6].label = `Total Investment (${this.selectedCurrencyData} Million)`;
    this.directInvestmentsTableData.title[7].label = `Total Participated Round Funding Amount (${this.selectedCurrencyData} Million)`;
    this.directInvestmentsChildTableData.title[6].label = `Investment in Round (${this.selectedCurrencyData} Million)`;
    this.directInvestmentsChildTableData.title[7].label = `Round Funding Amount (${this.selectedCurrencyData} Million)`;
    this.limitedPartnersTableData.title[4].label = `Investment Amount (${this.selectedCurrencyData} Million)`;
    this.benchmarkTableData.title[2].label = `Amount Raised (${this.selectedCurrencyData} M)`;
    this.fundCompanySelectedEntityId = e.factset_fund_entity_id;
    this.fundCompanySelectedEntityIdFirm = e.factset_pevc_firm_entity_id;
    this.fundSelectedName = e.entity_proper_name.replaceAll('#', '%23');
    this.count_res = 0;
    this.total_count_res = 10;
    this.util.loaderService.display(true);
    this.getPEVCFundSummary(this.fundCompanySelectedEntityId);
    this.getPEVCFundBenchmark(this.fundCompanySelectedEntityId, 'USD');
    this.getPEVCFundCountryFocus(this.fundCompanySelectedEntityId);
    this.getPEVCFundSectorFocus(this.fundCompanySelectedEntityId);
    this.getPEVCFundDirectInvestments(this.fundCompanySelectedEntityId, '1');
    this.getLimitedPartnersFund(this.fundCompanySelectedEntityId, 1);
    this.getFundMng(this.fundCompanySelectedEntityId, this.fundSelectedName);
    this.getInstrumentUsed(this.fundCompanySelectedEntityId);
    this.getInstrumentType(this.fundCompanySelectedEntityId);
    this.getContactPEVC(this.fundCompanySelectedEntityId);
    this.getWebsitePEVC(this.fundCompanySelectedEntityIdFirm);
    this.getAddressPEVC(this.fundCompanySelectedEntityId);
    this.getFundMetadata(
      this.fundCompanySelectedEntityId,
      this.fundCompanySelectedEntityId
    );
  }

  handleCurrencyValueChanged(data: any) {
    if (this.selectCurrencyData && this.selectedCurrencyData !== data) {
      this.selectedCurrencyData = data;
      if (this.auth.showNotListedPage) {
        this.count_res = 0;
        this.total_count_res = 6;
        this.util.loaderService.display(true);
        this.getNumberOfAssetsUnderMng(this.notListedSelectedEntityId);
        this.getAvgFundSize(this.notListedSelectedEntityId);
        this.getPEVCFundBenchmark(
          this.notListedSelectedEntityId,
          this.selectedCurrencyData
        );
        this.benchmarkTableDataNotListed.title[2].label = `AUM (${this.selectedCurrencyData} M)`;
        this.benchmarkTableDataNotListed.title[3].label = `Average Fund Size (${this.selectedCurrencyData} M)`;
        this.directInvestmentsTableDataNotListed.title[7].label = `Total Investment (${this.selectedCurrencyData} Million)`;
        this.directInvestmentsTableDataNotListed.title[8].label = `Total Participated Round Funding Amount (${this.selectedCurrencyData} Million)`;
        this.getPEVCNotListedDirectInvestments(
          this.notListedSelectedEntityId,
          '1'
        );
        this.directInvestmentsChildTableDataNotListed.title[7].label = `Investment in Round (${this.selectedCurrencyData} Million)`;
        this.directInvestmentsChildTableDataNotListed.title[8].label = `Round Funding Amount (${this.selectedCurrencyData} Million)`;
        this.getPEVCNotListedFundsInvestments(
          this.notListedSelectedEntityId,
          '1'
        );
        this.getPEVCNotListedFirmStructure(this.notListedSelectedEntityId, '1');
        this.fundOfFundsInvestmetns.title[2].label = `Amount Invested (${this.selectedCurrencyData} Million)`;
        this.fundOfFundsInvestmetns.title[6].label = `Amount Raised (${this.selectedCurrencyData} Million)`;
        this.firmStructureTableData.title[4].label = `Amount Raised (${this.selectedCurrencyData} Million)`;
      } else if (this.auth.showFundPage) {
        this.count_res = 0;
        this.total_count_res = 2;
        this.util.loaderService.display(true);
        this.benchmarkTableData.title[2].label = `Amount Raised (${this.selectedCurrencyData} M)`;
        this.getPEVCFundBenchmark(
          this.fundCompanySelectedEntityId,
          this.selectedCurrencyData
        );
        this.directInvestmentsTableData.title[6].label = `Total Investment (${this.selectedCurrencyData} Million)`;
        this.directInvestmentsTableData.title[7].label = `Total Participated Round Funding Amount (${this.selectedCurrencyData} Million)`;
        this.getPEVCFundDirectInvestments(
          this.fundCompanySelectedEntityId,
          '1'
        );
        this.directInvestmentsChildTableData.title[6].label = `Investment in Round (${this.selectedCurrencyData} Million)`;
        this.directInvestmentsChildTableData.title[7].label = `Round Funding Amount (${this.selectedCurrencyData} Million)`;
        this.getLimitedPartnersFund(this.fundCompanySelectedEntityId, 1);
        this.limitedPartnersTableData.title[4].label = `Investment Amount (${this.selectedCurrencyData} Million)`;
      }
    }
  }

  handlepevcNotListedParticipatingFunds(data: any) {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['financialmarketdata/company'], {
        queryParams: {
          factset_fund_entity_id: data.factset_fund_entity_id,
          factset_pevc_firm_entity_id: data.factset_pevc_firm_entity_id,
          contolling_firm: data.multiple
            ? data.participating_funds_multiple
            : data.participating_funds,
          tab_name: 'not-listed-direct-fund',
        },
      })
    );

    window.open(url, '_blank');
    // this.auth.showFundPage = true;
    // this.auth.showNotListedPage = false;

    // this.selectedCurrencyData = 'USD';
    // this.directInvestmentsTableData.title[6].label = `Total Investment (${this.selectedCurrencyData} Million)`;
    // this.directInvestmentsTableData.title[7].label = `Total Participated Round Funding Amount (${this.selectedCurrencyData} Million)`;
    // this.directInvestmentsChildTableData.title[6].label = `Investment in Round (${this.selectedCurrencyData} Million)`;
    // this.directInvestmentsChildTableData.title[7].label = `Round Funding Amount (${this.selectedCurrencyData} Million)`;
    // this.fundCompanySelectedEntityId = data.factset_fund_entity_id;
    // this.fundCompanySelectedEntityIdFirm = data.factset_pevc_firm_entity_id;
    // let e = data.factset_fund_entity_id;
    // let eFirm = data.factset_pevc_firm_entity_id;
    // this.fundSelectedName = data.participating_funds_custom;
    // this.count_res = 0;
    // this.total_count_res = 10;
    // this.util.loaderService.display(true);
    // this.getPEVCFundSummary(e);
    // this.getPEVCFundBenchmark(e, 'USD');
    // this.getPEVCFundCountryFocus(e);
    // this.getPEVCFundSectorFocus(e);
    // this.getPEVCFundDirectInvestments(eFirm, '1');
    // this.getLimitedPartnersFund(e);
    // this.getFundMng(eFirm, this.fundSelectedName);
    // this.getInstrumentUsed(e);
    // this.getInstrumentType(e);
    // this.getContactPEVC(e);
    // this.getWebsitePEVC(eFirm);
    // this.getAddressPEVC(e);
  }

  handleFundSelected(data: any) {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['financialmarketdata/company'], {
        queryParams: {
          factset_fund_entity_id: data.factset_fund_entity_id,
          factset_pevc_firm_entity_id: data.factset_pevc_firm_entity_id,
          contolling_firm: data?.fund_name,
          tab_name: 'not-listed-fundsoffunds-fund',
        },
      })
    );

    window.open(url, '_blank');
    // this.auth.showFundPage = true;
    // this.auth.showNotListedPage = false;

    // this.selectedCurrencyData = 'USD';
    // this.directInvestmentsTableData.title[6].label = `Total Investment (${this.selectedCurrencyData} Million)`;
    // this.directInvestmentsTableData.title[7].label = `Total Participated Round Funding Amount (${this.selectedCurrencyData} Million)`;
    // this.directInvestmentsChildTableData.title[6].label = `Investment in Round (${this.selectedCurrencyData} Million)`;
    // this.directInvestmentsChildTableData.title[7].label = `Round Funding Amount (${this.selectedCurrencyData} Million)`;
    // this.fundCompanySelectedEntityId = data?.factset_fund_entity_id;
    // this.fundCompanySelectedEntityIdFirm = data?.factset_pevc_firm_entity_id;
    // let eFirm = data?.factset_pevc_firm_entity_id;
    // let e = data?.factset_fund_entity_id;
    // this.fundSelectedName = data.fund_name;
    // this.count_res = 0;
    // this.total_count_res = 10;
    // this.util.loaderService.display(true);
    // this.getPEVCFundSummary(e);
    // this.getPEVCFundBenchmark(e, 'USD');
    // this.getPEVCFundCountryFocus(e);
    // this.getPEVCFundSectorFocus(e);
    // this.getPEVCFundDirectInvestments(eFirm, '1');
    // this.getLimitedPartnersFund(e);
    // this.getFundMng(eFirm, this.fundSelectedName);
    // this.getInstrumentUsed(e);
    // this.getInstrumentType(e);
    // this.getContactPEVC(e);
    // this.getWebsitePEVC(eFirm);
    // this.getAddressPEVC(e);
    // this.getFundMetadata(
    //   this.fundCompanySelectedEntityId,
    //   this.fundCompanySelectedEntityId
    // );
  }

  handlefirmSelected(data: any) {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['financialmarketdata/company'], {
        queryParams: {
          factset_pevc_firm_entity_id: data.factset_pevc_firm_entity_id,
          Firm_name: data.firm_name,
          tab_name: 'not-listed-fundsoffunds-firm',
        },
      })
    );

    window.open(url, '_blank');
    // this.selectedCurrencyData = 'USD';
    // this.benchmarkTableDataNotListed.title[2].label = `AUM (${this.selectedCurrencyData} M)`;
    // this.benchmarkTableDataNotListed.title[3].label = `Average Fund Size (${this.selectedCurrencyData} M)`;
    // this.directInvestmentsTableDataNotListed.title[7].label = `Total Investment (${this.selectedCurrencyData} Million)`;
    // this.directInvestmentsTableDataNotListed.title[8].label = `Total Participated Round Funding Amount (${this.selectedCurrencyData} Million)`;
    // this.directInvestmentsChildTableDataNotListed.title[7].label = `Investment in Round (${this.selectedCurrencyData} Million)`;
    // this.directInvestmentsChildTableDataNotListed.title[8].label = `Round Funding Amount (${this.selectedCurrencyData} Million)`;
    // this.fundOfFundsInvestmetns.title[2].label = `Amount Invested (${this.selectedCurrencyData} Million)`;
    // this.fundOfFundsInvestmetns.title[6].label = `Amount Raised (${this.selectedCurrencyData} Million)`;
    // this.firmStructureTableData.title[4].label = `Amount Raised (${this.selectedCurrencyData} Million)`;
    // this.notListedSelectedEntityId = data.factset_pevc_firm_entity_id;
    // this.notListedSelectedName = data.entity_proper_name;
    // let e = this.notListedSelectedEntityId;
    // this.count_res = 0;
    // this.total_count_res = 10;
    // this.util.loaderService.display(true);
    // this.getNumberOfActiveFunds(e);
    // this.getNumberOfFundsUnderMng(e);
    // this.getNumberOfAssetsUnderMng(e);
    // this.getAvgFundSize(e);
    // this.getpevcTotalInvestments(e);
    // this.getPEVCNotListedBenchmark(e);
    // this.getPEVCNotListedDirectInvestments(e, '1');
    // this.getPEVCNotListedFundsInvestments(e, '1');
    // this.getPEVCNotListedFirmStructure(e, '1');
    // this.getFundMng(this.notListedSelectedEntityId, this.notListedSelectedName);
    // this.getContactPEVC(this.notListedSelectedEntityId);
    // this.getWebsitePEVC(this.notListedSelectedEntityId);
    // this.getAddressPEVC(this.notListedSelectedEntityId);
    // this.getNotListedMetadata(this.notListedSelectedEntityId);
  }

  valueChangedHandler(data: any) {
    if (this.selectCompanyPEVCData && this.selectedPEVCCompany !== data) {
      this.selectedPEVCCompany = data;
      this.notListedSelectedEntityId = this.selectedPEVCCompany;
      this.selectedCurrencyData = 'USD';
      this.benchmarkTableDataNotListed.title[2].label = `AUM (${this.selectedCurrencyData} M)`;
      this.benchmarkTableDataNotListed.title[3].label = `Average Fund Size (${this.selectedCurrencyData} M)`;
      this.directInvestmentsTableDataNotListed.title[7].label = `Total Investment (${this.selectedCurrencyData} Million)`;
      this.directInvestmentsTableDataNotListed.title[8].label = `Total Participated Round Funding Amount (${this.selectedCurrencyData} Million)`;
      this.directInvestmentsChildTableDataNotListed.title[7].label = `Investment in Round (${this.selectedCurrencyData} Million)`;
      this.directInvestmentsChildTableDataNotListed.title[8].label = `Round Funding Amount (${this.selectedCurrencyData} Million)`;
      this.fundOfFundsInvestmetns.title[2].label = `Amount Invested (${this.selectedCurrencyData} Million)`;
      this.fundOfFundsInvestmetns.title[6].label = `Amount Raised (${this.selectedCurrencyData} Million)`;
      this.firmStructureTableData.title[4].label = `Amount Raised (${this.selectedCurrencyData} Million)`;

      this.count_res = 0;
      this.total_count_res = 10;
      this.util.loaderService.display(true);
      this.getContactPEVC(this.notListedSelectedEntityId);
      this.getWebsitePEVC(this.notListedSelectedEntityId);
      this.getAddressPEVC(this.notListedSelectedEntityId);
      this.getNotListedMetadata(this.notListedSelectedEntityId);
      this.getNumberOfActiveFunds(this.notListedSelectedEntityId);
      this.getNumberOfFundsUnderMng(this.notListedSelectedEntityId);
      this.getNumberOfAssetsUnderMng(this.notListedSelectedEntityId);
      this.getAvgFundSize(this.notListedSelectedEntityId);
      this.getpevcTotalInvestments(this.notListedSelectedEntityId);
      this.getPEVCNotListedBenchmark(this.notListedSelectedEntityId);
      this.getPEVCNotListedDirectInvestments(
        this.notListedSelectedEntityId,
        '1'
      );
      this.getPEVCNotListedFundsInvestments(
        this.notListedSelectedEntityId,
        '1'
      );
      this.getPEVCNotListedFirmStructure(this.notListedSelectedEntityId, '1');

      this.selectCompanyPEVCData.map((el: any) => {
        if (el.id == this.selectedPEVCCompany) {
          this.notListedSelectedName = el.text;
        }
      });

      this.getFundMng(
        this.notListedSelectedEntityId,
        this.notListedSelectedName.replaceAll('#', '%23')
      );
    }
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

  handleCompanyClick() {
    this.count_res = 0;
    this.total_count_res = 1;
    this.util.loaderService.display(true);

    this.getFundCompanies();
  }

  getFundsSearchCompanies(searchTerm: any) {
    this.previousAPI = this.financialMarketData
      .getFundsSearchCompanies(searchTerm)
      .subscribe(
        (res: any) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);

          let fundsNameFormattedData: any = [];
          res?.forEach((element: any) => {
            fundsNameFormattedData.push({
              id: element.factset_entity_id,
              pevcId: element.factset_pevc_firm_entity_id,
              text: element.entity_proper_name,
            });
          });
          this.selectCompanyPEVCData1 = fundsNameFormattedData;

          setTimeout(() => {
            $('#companyDropdownMNA1').select2('open');
            (document.querySelector('.select2-search__field') as any).value =
              this.selectedNameDer;
          }, 100);
        },
        (err) => {
          console.log('error', err.message);
        }
      );
  }

  valueChangedHandler1(data: any) {
    if (this.selectCompanyPEVCData1 && this.selectedPEVCCompany1 !== data) {
      this.selectedPEVCCompany1 = data;
      this.fundCompanySelectedEntityId = this.selectedPEVCCompany1;
      this.selectedCurrencyData = 'USD';

      this.count_res = 0;
      this.total_count_res = 10;
      this.util.loaderService.display(true);

      this.directInvestmentsTableData.title[6].label = `Total Investment (${this.selectedCurrencyData} Million)`;
      this.directInvestmentsTableData.title[7].label = `Total Participated Round Funding Amount (${this.selectedCurrencyData} Million)`;
      this.directInvestmentsChildTableData.title[6].label = `Investment in Round (${this.selectedCurrencyData} Million)`;
      this.directInvestmentsChildTableData.title[7].label = `Round Funding Amount (${this.selectedCurrencyData} Million)`;
      this.limitedPartnersTableData.title[4].label = `Investment Amount (${this.selectedCurrencyData} Million)`;
      this.benchmarkTableData.title[2].label = `Amount Raised (${this.selectedCurrencyData} M)`;

      this.selectCompanyPEVCData1.map((el: any) => {
        if (el.id == this.selectedPEVCCompany1) {
          this.fundCompanySelectedEntityIdFirm = el.pevcId;
        }
      });
      this.getFundMetadata(
        this.fundCompanySelectedEntityId,
        this.fundCompanySelectedEntityId
      );
      this.getPEVCFundSummary(this.fundCompanySelectedEntityId);
      this.getPEVCFundBenchmark(this.fundCompanySelectedEntityId, 'USD');
      this.getPEVCFundCountryFocus(this.fundCompanySelectedEntityId);
      this.getPEVCFundSectorFocus(this.fundCompanySelectedEntityId);
      this.getPEVCFundDirectInvestments(this.fundCompanySelectedEntityId, '1');
      this.getLimitedPartnersFund(this.fundCompanySelectedEntityId, 1);
      this.selectCompanyPEVCData1.map((el: any) => {
        if (el.id == this.selectedPEVCCompany1) {
          this.fundSelectedName = el.text;
        }
      });
      // fundCompanySelectedEntityIdFirm
      this.getFundMng(
        this.fundCompanySelectedEntityId,
        this.fundSelectedName.replaceAll('#', '%23')
      );
      this.getInstrumentUsed(this.fundCompanySelectedEntityId);
      this.getInstrumentType(this.fundCompanySelectedEntityId);
      this.getContactPEVC(this.fundCompanySelectedEntityId);
      this.getWebsitePEVC(this.fundCompanySelectedEntityIdFirm);
      this.getAddressPEVC(this.fundCompanySelectedEntityId);
    }
  }

  getNotListedCompanies() {
    let pevcCompaniesLocalData: any = [];

    this.financialMarketData.getNotListedCompanies().subscribe(
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

        this.selectCompanyPEVCData = pevcCompaniesLocalData;
      },
      (err) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);
      }
    );
  }

  selectCurrencyData: any;
  selectedCurrencyData: any;
  getCurreny() {
    this.financialMarketData.getCurrencies().subscribe((res) => {
      let categoryFormattedData: any = [];
      res?.forEach((element: any) => {
        categoryFormattedData.push({
          id: element.isoCode,
          text: `${element.currencyName} (${element.isoCode})`,
        });
        this.selectCurrencyData = categoryFormattedData;
      });
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
      .getNumberOfAssetsUnderMng(entityId, this.selectedCurrencyData)
      .subscribe((res: any) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);

        this.pevcNoAssetsUnderMng = res[0]?.Assets_under_management;
      });
  }

  pevcAvgFundSize: any;
  getAvgFundSize(entityId: any) {
    this.financialMarketData
      .getAvgFundSize(entityId, this.selectedCurrencyData)
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

  getPEVCNotListedBenchmark(entityId: any) {
    this.financialMarketData.getPEVCNotListedBenchmark(entityId).subscribe(
      (res: any) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);
        this.benchmarkTableDataNotListed = {
          ...this.benchmarkTableDataNotListed,
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
  sortTypeFund: any = 'desc';
  sortCol: any;
  handlecusSortParamFund(value: any) {
    this.sortCol = value;
    if (this.sortTypeFund === 'desc') {
      this.sortTypeFund = 'asc';
    } else if (this.sortTypeFund === 'asc') {
      this.sortTypeFund = 'desc';
    }
    this.count_res = 0;
    this.total_count_res = 1;
    this.util.loaderService.display(true);
    this.getPEVCFundDirectInvestments(
      this.fundCompanySelectedEntityId,
      '1',
      value,
      this.sortTypeFund
    );
  }

  sortType: any = 'desc';
  sortColFirm: any;
  handlecusSortParam(value: any) {
    this.sortColFirm = value;
    if (this.sortType === 'desc') {
      this.sortType = 'asc';
    } else if (this.sortType === 'asc') {
      this.sortType = 'desc';
    }
    this.count_res = 0;
    this.total_count_res = 1;
    this.util.loaderService.display(true);
    this.getPEVCNotListedDirectInvestments(
      this.notListedSelectedEntityId,
      '1',
      value,
      this.sortType
    );
  }

  totalDataLength: any;
  multiplePartFunds: any = [];
  getPEVCNotListedDirectInvestments(
    entityId: any,
    selectedPage: any,
    colType: any = 'investment_date',
    sortType: any = 'desc'
  ) {
    let multipleFunds: any = [];
    this.financialMarketData
      .getPEVCNotListedDirectInvestments(
        entityId,
        this.selectedCurrencyData,
        selectedPage,
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

        this.directInvestmentsTableDataNotListed = {
          ...this.directInvestmentsTableDataNotListed,
          value: res,
        };
      });
  }
  count_res: any = 0;
  total_count_res: any = '';
  onPageChangeDirectNotListed(e: any) {
    this.count_res = 0;
    this.total_count_res = 1;
    this.util.loaderService.display(true);

    this.getPEVCNotListedDirectInvestments(
      this.notListedSelectedEntityId,
      e,
      this.sortColFirm,
      this.sortType
    );
  }
  multiplePartFundsChild: any = [];
  getPEVCDirectInvestmentsChildNotListed(entityId: any, portco_entity_id: any) {
    this.count_res = 0;
    this.total_count_res = 1;
    this.util.loaderService.display(true);
    let multipleFunds: any = [];
    this.financialMarketData
      .getPEVCDirectInvestmentsChildNotListed(
        entityId,
        portco_entity_id,
        this.selectedCurrencyData
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

        this.directInvestmentsChildTableDataNotListed = {
          ...this.directInvestmentsChildTableDataNotListed,
          value: res,
        };
      });
  }

  proctoEntityIdNotListed: any;
  handleInvestmentsPEVCChildData(e: any) {
    this.proctoEntityIdNotListed = e.factset_portco_entity_id;
    this.getPEVCDirectInvestmentsChildNotListed(
      this.notListedSelectedEntityId,
      e.factset_portco_entity_id
    );
  }

  handleInvestmentsPEVCFundChildData(e: any) {
    this.loaderService.display(true);
    this.total_count_res = 1;
    this.count_res = 0;

    this.getPEVCDirectInvestmentsChildFund(
      this.fundCompanySelectedEntityId,
      e.factset_portco_entity_id
    );
  }

  totalDataLengthfundsoffundsNotListed: any;
  getPEVCNotListedFundsInvestments(entityId: any, selectedPage: any) {
    this.financialMarketData
      .getPEVCNotListedFundsInvestments(
        entityId,
        selectedPage,
        this.selectedCurrencyData
      )
      .subscribe((res: any) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);

        this.totalDataLengthfundsoffundsNotListed = res.pop().datacount;

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

  onPageChangefundsoffundsNotListed(e: any) {
    this.count_res = 0;
    this.total_count_res = 1;
    this.util.loaderService.display(true);

    this.getPEVCNotListedFundsInvestments(this.notListedSelectedEntityId, e);
  }
  totalDataLengthFirmStructure: any;
  getPEVCNotListedFirmStructure(entityId: any, selectedPage: any) {
    this.financialMarketData
      .getPEVCNotListedFirmStructure(
        entityId,
        selectedPage,
        this.selectedCurrencyData
      )
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

  onPageChangeFirmStructureNotListed(e: any) {
    this.count_res = 0;
    this.total_count_res = 1;
    this.util.loaderService.display(true);

    this.getPEVCNotListedFirmStructure(this.notListedSelectedEntityId, e);
  }

  pevcFundSummary: any;
  getPEVCFundSummary(entityId: any) {
    // this.loaderService.display(true);
    // this.total_count_res = 1;
    // this.count_res = 0;

    this.financialMarketData
      .getPEVCFundSummary(entityId)
      .subscribe((res: any) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);

        this.pevcFundSummary = res[0];
      });
  }

  getPEVCFundBenchmark(entityId: any, currency: any) {
    this.financialMarketData.getPEVCFundBenchmark(entityId, currency).subscribe(
      (res: any) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);
        res.pop().datacount;
        this.benchmarkTableData = {
          ...this.benchmarkTableData,
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

  pevcFundCountryFocus: any;
  getPEVCFundCountryFocus(entityId: any) {
    this.financialMarketData
      .getPEVCFundCountryFocus(entityId)
      .subscribe((res: any) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);

        this.pevcFundCountryFocus = res;
      });
  }

  pevcFundSectorFocus: any;
  getPEVCFundSectorFocus(entityId: any) {
    this.financialMarketData
      .getPEVCFundSectorFocus(entityId)
      .subscribe((res: any) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);

        this.pevcFundSectorFocus = res;
      });
  }
  totalDataLengthFund: any;
  multiplePartFundsFund: any;
  directInvestmentsTableDataTemp: any;
  getPEVCFundDirectInvestments(
    entityId: any,
    selectedpage: any,
    colType: any = 'investment_date',
    sortType: any = 'desc'
  ) {
    let multipleFunds: any = [];
    this.financialMarketData
      .getPEVCFundDirectInvestments(
        entityId,
        this.selectedCurrencyData,
        selectedpage,
        colType,
        sortType
      )
      .subscribe((res: any) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);
        this.totalDataLengthFund = res.pop().datacount;
        // res.map((el: any) => {
        //   el.participating_funds_custom = el.participating_funds;
        // });

        // res = res.filter((value: any, index: any, self: any) => {
        //   // multipleFunds.push(value.participating_funds);

        //   return (
        //     index ===
        //     self.findIndex((t: any) => t.entity_name === value.entity_name)
        //   );
        // });

        // if (multipleFunds.length > 1) {
        //   res[0].participating_funds = 'Multiple';
        //   this.multiplePartFundsFund = multipleFunds;
        // }

        // res.map((el: any) => {
        //   el.valuation_fx = el.valuation * el.Number_of_Active_Funds;
        // });

        this.directInvestmentsTableDataTemp = res;

        this.directInvestmentsTableData = {
          ...this.directInvestmentsTableData,
          value: res,
        };
      });
  }

  onPageChangeDirectFund(e: any) {
    this.count_res = 0;
    this.total_count_res = 1;
    this.util.loaderService.display(true);

    this.getPEVCFundDirectInvestments(
      this.fundCompanySelectedEntityId,
      e,
      this.sortCol,
      this.sortTypeFund
    );
  }
  multiplePartFundsChildFund: any;
  getPEVCDirectInvestmentsChildFund(entityId: any, portco_entity_id: any) {
    let multipleFunds: any = [];
    this.financialMarketData
      .getPEVCDirectInvestmentsChildFund(
        entityId,
        portco_entity_id,
        this.selectedCurrencyData
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
        //   this.multiplePartFundsChildFund = multipleFunds;
        // }

        this.directInvestmentsChildTableData = {
          ...this.directInvestmentsChildTableData,
          value: res,
        };
      });
  }

  getLimitedPartnersFund(entityId: any, selectedPage: any) {
    this.financialMarketData
      .getLimitedPartnersFund(entityId, selectedPage)
      .subscribe((res: any) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);
        this.totalDataLengthLimitedPartners = res.pop().datacount;
        this.limitedPartnersTableData = {
          ...this.limitedPartnersTableData,
          value: res,
        };
      });
  }

  totalDataLengthLimitedPartners: any;
  onPageChangeDirectLimitedPartners(e: any) {
    this.count_res = 0;
    this.total_count_res = 1;
    this.util.loaderService.display(true);

    this.getLimitedPartnersFund(this.fundCompanySelectedEntityId, e);
  }

  manage_data: any;
  getFundMng(entityId: any, name: any) {
    this.financialMarketData
      .getFundMng(entityId, name, '1')
      .subscribe((res: any) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);

        // this.totalDataLengthMng = res.pop().datacount;

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
  totalDataLengthMng: any;
  onPageChangeMngNotListed(e: any) {
    // this.count_res = 0;
    // this.total_count_res = 1;
    // this.util.loaderService.display(true);
    // this.getFundMng(
    //   this.notListedSelectedEntityId,
    //   this.notListedSelectedName,
    //   e
    // );
  }

  // getCompanySecurityId(entityId: any) {
  //   this.financialMarketData
  //     .getCompanySecurityId(entityId)
  //     .subscribe((res: any) => {
  //       ++this.count_res;
  //       this.util.checkCountValue(this.total_count_res, this.count_res);
  //       this.getCompanyInfo(res[0]?.company_id, this.selectedCurrencyData);
  //     });
  // }
  // companyInfo: any;
  // getCompanyInfo(id: any, currency: any) {
  //   this.financialMarketData
  //     .getCompanyinfo(id, currency)
  //     .subscribe((res: any) => {
  //       this.companyInfo = res;
  //       console.log(res);
  //     });
  // }

  handlefirmSelectedBenchmark(e: any) {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['financialmarketdata/company'], {
        queryParams: {
          factset_pevc_firm_entity_id: e.factset_pevc_firm_entity_id,
          Firm_name: e.Firm_name,
          tab_name: 'not-listed-benchmark-firm',
        },
      })
    );

    window.open(url, '_blank');
    // this.selectedCurrencyData = 'USD';
    // this.benchmarkTableDataNotListed.title[2].label = `AUM (${this.selectedCurrencyData} M)`;
    // this.benchmarkTableDataNotListed.title[3].label = `Average Fund Size (${this.selectedCurrencyData} M)`;
    // this.directInvestmentsTableDataNotListed.title[7].label = `Total Investment (${this.selectedCurrencyData} Million)`;
    // this.directInvestmentsTableDataNotListed.title[8].label = `Total Participated Round Funding Amount (${this.selectedCurrencyData} Million)`;
    // this.directInvestmentsChildTableDataNotListed.title[7].label = `Investment in Round (${this.selectedCurrencyData} Million)`;
    // this.directInvestmentsChildTableDataNotListed.title[8].label = `Round Funding Amount (${this.selectedCurrencyData} Million)`;
    // this.fundOfFundsInvestmetns.title[2].label = `Amount Invested (${this.selectedCurrencyData} Million)`;
    // this.fundOfFundsInvestmetns.title[6].label = `Amount Raised (${this.selectedCurrencyData} Million)`;
    // this.firmStructureTableData.title[4].label = `Amount Raised (${this.selectedCurrencyData} Million)`;
    // this.notListedSelectedEntityId = e.factset_pevc_firm_entity_id;
    // this.notListedSelectedName = e.Firm_name;

    // this.count_res = 0;
    // this.total_count_res = 10;
    // this.util.loaderService.display(true);

    // this.getNumberOfActiveFunds(this.notListedSelectedEntityId);
    // this.getNumberOfFundsUnderMng(this.notListedSelectedEntityId);
    // this.getNumberOfAssetsUnderMng(this.notListedSelectedEntityId);
    // this.getAvgFundSize(this.notListedSelectedEntityId);
    // this.getpevcTotalInvestments(this.notListedSelectedEntityId);
    // this.getPEVCNotListedBenchmark(this.notListedSelectedEntityId);
    // this.getPEVCNotListedDirectInvestments(this.notListedSelectedEntityId, '1');
    // this.getPEVCNotListedFundsInvestments(this.notListedSelectedEntityId, '1');
    // this.getPEVCNotListedFirmStructure(this.notListedSelectedEntityId, '1');
    // this.getFundMng(this.notListedSelectedEntityId, this.notListedSelectedName);
    // this.getContactPEVC(this.notListedSelectedEntityId);
    // this.getWebsitePEVC(this.notListedSelectedEntityId);
    // this.getAddressPEVC(this.notListedSelectedEntityId);
    // this.getNotListedMetadata(this.notListedSelectedEntityId);
  }

  handlefirmSelectedBenchmarkFund(e: any) {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['financialmarketdata/company'], {
        queryParams: {
          factset_pevc_firm_entity_id: e.factset_pevc_firm_entity_id,
          Firm_name: e.contolling_firm,
          tab_name: 'fund-benchmark-firm',
        },
      })
    );

    window.open(url, '_blank');

    // this.auth.showNotListedPage = true;
    // this.auth.showFundPage = false;
    // this.selectedCurrencyData = 'USD';
    // this.benchmarkTableDataNotListed.title[2].label = `AUM (${this.selectedCurrencyData} M)`;
    // this.benchmarkTableDataNotListed.title[3].label = `Average Fund Size (${this.selectedCurrencyData} M)`;
    // this.directInvestmentsTableDataNotListed.title[7].label = `Total Investment (${this.selectedCurrencyData} Million)`;
    // this.directInvestmentsTableDataNotListed.title[8].label = `Total Participated Round Funding Amount (${this.selectedCurrencyData} Million)`;
    // this.directInvestmentsChildTableDataNotListed.title[7].label = `Investment in Round (${this.selectedCurrencyData} Million)`;
    // this.directInvestmentsChildTableDataNotListed.title[8].label = `Round Funding Amount (${this.selectedCurrencyData} Million)`;
    // this.fundOfFundsInvestmetns.title[2].label = `Amount Invested (${this.selectedCurrencyData} Million)`;
    // this.fundOfFundsInvestmetns.title[6].label = `Amount Raised (${this.selectedCurrencyData} Million)`;
    // this.firmStructureTableData.title[4].label = `Amount Raised (${this.selectedCurrencyData} Million)`;
    // this.notListedSelectedEntityId = e.factset_pevc_firm_entity_id;
    // this.notListedSelectedName = e.contolling_firm;

    // this.count_res = 0;
    // this.total_count_res = 10;
    // this.util.loaderService.display(true);

    // this.getNumberOfActiveFunds(this.notListedSelectedEntityId);
    // this.getNumberOfFundsUnderMng(this.notListedSelectedEntityId);
    // this.getNumberOfAssetsUnderMng(this.notListedSelectedEntityId);
    // this.getAvgFundSize(this.notListedSelectedEntityId);
    // this.getpevcTotalInvestments(this.notListedSelectedEntityId);
    // this.getPEVCNotListedBenchmark(this.notListedSelectedEntityId);
    // this.getPEVCNotListedDirectInvestments(this.notListedSelectedEntityId, '1');
    // this.getPEVCNotListedFundsInvestments(this.notListedSelectedEntityId, '1');
    // this.getPEVCNotListedFirmStructure(this.notListedSelectedEntityId, '1');
    // this.getFundMng(this.notListedSelectedEntityId, this.notListedSelectedName);
    // this.getContactPEVC(this.notListedSelectedEntityId);
    // this.getWebsitePEVC(this.notListedSelectedEntityId);
    // this.getAddressPEVC(this.notListedSelectedEntityId);
    // this.getNotListedMetadata(this.notListedSelectedEntityId);
  }

  handlefundSelectedBenchmark(data: any) {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['financialmarketdata/company'], {
        queryParams: {
          factset_fund_entity_id: data.factset_fund_entity_id,
          factset_pevc_firm_entity_id: data.factset_pevc_firm_entity_id,
          contolling_firm: data?.Fund_name,
          tab_name: 'fund-benchmark-fund',
        },
      })
    );

    window.open(url, '_blank');
    // this.selectedCurrencyData = 'USD';
    // this.directInvestmentsTableData.title[6].label = `Total Investment (${this.selectedCurrencyData} Million)`;
    // this.directInvestmentsTableData.title[7].label = `Total Participated Round Funding Amount (${this.selectedCurrencyData} Million)`;
    // this.directInvestmentsChildTableData.title[6].label = `Investment in Round (${this.selectedCurrencyData} Million)`;
    // this.directInvestmentsChildTableData.title[7].label = `Round Funding Amount (${this.selectedCurrencyData} Million)`;
    // this.fundCompanySelectedEntityId = data.factset_fund_entity_id;
    // this.fundCompanySelectedEntityIdFirm = data.factset_pevc_firm_entity_id;
    // let eFirm = data.factset_pevc_firm_entity_id;
    // let e = data.factset_fund_entity_id;
    // this.fundSelectedName = data?.contolling_firm;

    // this.count_res = 0;
    // this.total_count_res = 10;
    // this.util.loaderService.display(true);
    // this.getPEVCFundSummary(e);
    // this.getPEVCFundBenchmark(e, 'USD');
    // this.getPEVCFundCountryFocus(e);
    // this.getPEVCFundSectorFocus(e);
    // this.getPEVCFundDirectInvestments(eFirm, '1');
    // this.getLimitedPartnersFund(e);
    // this.getFundMng(eFirm, this.fundSelectedName);
    // this.getInstrumentUsed(e);
    // this.getInstrumentType(e);
    // this.getContactPEVC(e);
    // this.getWebsitePEVC(eFirm);
    // this.getAddressPEVC(e);
    // this.getFundMetadata(
    //   this.fundCompanySelectedEntityId,
    //   this.fundCompanySelectedEntityId
    // );
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

    let financeType = e.latest_investment_round?.split('-')[0];
    let round = e.latest_investment_round?.split('-')[1];

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
        this.selectedCurrencyData
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
        this.selectedCurrencyData
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
  tabInstance: any;

  benchMarkToInteractiveAnalysis() {
    let formateSectorData5: any = [];
    let companyIds: any = '';
    let tempCount = 1;
    this.benchmarkTableDataNotListed.value.forEach((el: any) => {
      this.financialMarketData
        .getCompanySecurityId(el.factset_pevc_firm_entity_id)
        .subscribe((res: any) => {
          tempCount++;
          formateSectorData5.push({
            id: res[0]?.company_id,
          });
          if (this.benchmarkTableDataNotListed?.value?.length == tempCount) {
            formateSectorData5.forEach((element: any) => {
              if (element.id != null) {
                companyIds += element.id + '&';
              }
            });
            const url = this.router.serializeUrl(
              this.router.createUrlTree(
                ['financialmarketdata/interactive-analysis'],
                {
                  queryParams: {
                    currency: this.selectedCurrencyData,
                    filter2: 'stock',
                    comparableList: companyIds,
                    periodcity: 'yearly',
                    companyName: this.notListedSelectedName,
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
  }

  directExcel() {
    if (this.auth.showNotListedPage) {
      this.count_res = 0;
      this.total_count_res = 1;
      this.util.loaderService.display(true);
      this.financialMarketData
        .getDirectInvestmentFirmExcelData(
          this.notListedSelectedEntityId,
          this.selectedCurrencyData,
          this.notListedSelectedName ?? '-',
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
            console.log('error', err.message);
          }
        );
    } else if (this.auth.showFundPage) {
      this.count_res = 0;
      this.total_count_res = 1;
      this.util.loaderService.display(true);
      this.financialMarketData
        .getDirectInvestmentExcelData(
          this.fundCompanySelectedEntityId,
          this.selectedCurrencyData,
          this.fundSelectedName ? this.fundSelectedName : '-',
          this.pevcFundSummary?.controlling_firm_name
            ? this.pevcFundSummary?.controlling_firm_name
            : '-',
          this.pevcFundSummary?.open_date
            ? this.pevcFundSummary?.open_date
            : '-',
          this.pevcFundSummary?.amt_sought
            ? this.pevcFundSummary?.amt_sought
            : '-',
          this.pevcFundSummary?.amt_raised
            ? this.pevcFundSummary?.amt_raised
            : '-',
          this.pevcFundSummary?.fund_type
            ? this.pevcFundSummary?.fund_type
            : '-',
          this.pevcFundSummary?.fund_status_desc
            ? this.pevcFundSummary?.fund_status_desc
            : '-',
          this.pevcFundSummary?.liquidation_date
            ? this.pevcFundSummary?.liquidation_date
            : '-'
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
            console.log('error', err.message);
          }
        );
    }
  }

  fundOfFundsExcel() {
    this.count_res = 0;
    this.total_count_res = 1;
    this.util.loaderService.display(true);
    this.financialMarketData
      .getFundsofFundsExcelData(
        this.notListedSelectedEntityId,
        this.selectedCurrencyData,
        this.notListedSelectedName ?? '-',
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
          const file = new File([blob], '' + 'Fund of Funds Investments.xls', {
            type: 'application/vnd.ms.excel',
          });
          saveAs(file);
        },
        (err) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);
          console.log('error', err.message);
        }
      );
  }

  limitedPartnersExcel() {
    this.count_res = 0;
    this.total_count_res = 1;
    this.util.loaderService.display(true);
    this.financialMarketData
      .getLimitedPartnersExcelData(
        this.fundCompanySelectedEntityId,
        this.selectedCurrencyData,
        this.fundSelectedName ? this.fundSelectedName : '-',
        this.pevcFundSummary?.controlling_firm_name
          ? this.pevcFundSummary?.controlling_firm_name
          : '-',
        this.pevcFundSummary?.open_date ? this.pevcFundSummary?.open_date : '-',
        this.pevcFundSummary?.amt_sought
          ? this.pevcFundSummary?.amt_sought
          : '-',
        this.pevcFundSummary?.amt_raised
          ? this.pevcFundSummary?.amt_raised
          : '-',
        this.pevcFundSummary?.fund_type ? this.pevcFundSummary?.fund_type : '-',
        this.pevcFundSummary?.fund_status_desc
          ? this.pevcFundSummary?.fund_status_desc
          : '-',
        this.pevcFundSummary?.liquidation_date
          ? this.pevcFundSummary?.liquidation_date
          : '-'
      )
      .subscribe(
        (res: any) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);

          const blob = new Blob([res.body], {
            type: 'application/vnd.ms.excel',
          });
          const file = new File([blob], '' + 'Limited Partners.xls', {
            type: 'application/vnd.ms.excel',
          });
          saveAs(file);
        },
        (err) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);
          console.log('error', err.message);
        }
      );
  }

  Managementexcell() {
    this.loaderService.display(true);
    this.total_count_res = 1;
    this.count_res = 0;
    this.financialMarketData
      .getMngExcelData(
        this.notListedSelectedName,
        this.notListedSelectedEntityId
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
            '' + `Management ${this.notListedSelectedName}.xls`,
            {
              type: 'application/vnd.ms.excel',
            }
          );
          saveAs(file);
        },
        (err) => {
          console.log('err', err.message);
        }
      );
  }

  ManagementexcellFund() {
    this.loaderService.display(true);
    this.total_count_res = 1;
    this.count_res = 0;
    this.financialMarketData
      .getMngExcelData(this.fundSelectedName, this.fundCompanySelectedEntityId)
      .subscribe(
        (res: any) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);
          const blob = new Blob([res.body], {
            type: 'application/vnd.ms.excel',
          });
          const file = new File(
            [blob],
            '' + `Management ${this.fundSelectedName}.xls`,
            {
              type: 'application/vnd.ms.excel',
            }
          );
          saveAs(file);
        },
        (err) => {
          ++this.count_res;
          this.util.checkCountValue(this.total_count_res, this.count_res);
          console.log('err', err.message);
        }
      );
  }

  firmStructure() {
    this.count_res = 0;
    this.total_count_res = 1;
    this.util.loaderService.display(true);
    this.financialMarketData
      .getFirmStructureExcelData(
        this.notListedSelectedEntityId,
        this.selectedCurrencyData,
        this.notListedSelectedName ?? '-',
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
  statusListData: any = [];
  selectedStatusListData: any;
  getStatusFund() {
    let pevcStatusLocalData: any = [];

    this.financialMarketData.getStatusFund().subscribe((res: any) => {
      ++this.count_res;
      this.util.checkCountValue(this.total_count_res, this.count_res);
      res?.forEach((el: any) => {
        pevcStatusLocalData.push({
          id: el.status,
          text: el.status,
        });
      });

      this.statusListData = pevcStatusLocalData;
    });
  }

  handleStatusValueChanged(data: any) {
    if (this.statusListData && this.selectedStatusListData !== data) {
      this.selectedStatusListData = data;
      if (this.selectedStatusListData === 'Divested') {
        this.directInvestmentsTableData.value =
          this.directInvestmentsTableDataTemp.filter((el: any) => {
            return el.status === 'Divested';
          });
      } else {
        this.directInvestmentsTableData.value =
          this.directInvestmentsTableDataTemp.filter((el: any) => {
            return el.status === 'Invested';
          });
      }
    }
  }

  selectCompanyPEVCData1: any = [];
  selectedPEVCCompany1: any;
  getFundCompanies() {
    let pevcCompaniesLocalData: any = [];

    this.financialMarketData.getFundCompanies().subscribe((res: any) => {
      ++this.count_res;
      this.util.checkCountValue(this.total_count_res, this.count_res);

      res?.forEach((element: any) => {
        pevcCompaniesLocalData.push({
          id: element.factset_entity_id,
          pevcId: element.factset_fund_entity_id,
          text: element.entity_proper_name,
        });
      });

      pevcCompaniesLocalData.sort((a: any, b: any) =>
        a.text.localeCompare(b.text)
      );

      this.selectCompanyPEVCData1 = pevcCompaniesLocalData;

      setTimeout(() => {
        $('#companyDropdownMNA1').select2('open');
      }, 100);
    });
  }
  instrumentUsed: any = [];
  getInstrumentUsed(entityId: any) {
    this.financialMarketData
      .getInstrumentUsed(entityId)
      .subscribe((res: any) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);
        this.instrumentUsed = res;
      });
  }
  instrumenttype: any = [];
  getInstrumentType(entityId: any) {
    this.financialMarketData
      .getInstrumentType(entityId)
      .subscribe((res: any) => {
        this.count_res = this.count_res + 2;
        this.util.checkCountValue(this.total_count_res, this.count_res);
        this.instrumenttype = res;
      });
  }
  tabInstance1: any = null;
  transactionRedirection(country: any) {
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

    let countryCode = country.iso_code;

    const url = this.router.serializeUrl(
      this.router.createUrlTree(['financialmarketdata/transactions'], {
        queryParams: {
          currency: this.selectedCurrencyData,
          startDate: fromDate,
          endDate: endDate,
          countryIsoCode: countryCode,
          tabActive: 'PEVC',
        },
      })
    );
    if (this.tabInstance1 != undefined) {
      this.tabInstance1.close();
      this.tabInstance1 = window.open(url, '_blank');
    } else {
      this.tabInstance1 = window.open(url, '_blank');
    }
  }
  tabInstance2: any = null;
  transactionRedirectionSector(sector: any) {
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
    // get geo location
    let countryCode = 'IND';

    const url = this.router.serializeUrl(
      this.router.createUrlTree(['financialmarketdata/transactions'], {
        queryParams: {
          currency: this.selectedCurrencyData,
          startDate: fromDate,
          endDate: endDate,
          countryIsoCode: countryCode,
          sectorCode: sector.sector_code,
          tabActive: 'PEVC',
        },
      })
    );
    if (this.tabInstance2 != undefined) {
      this.tabInstance2.close();
      this.tabInstance2 = window.open(url, '_blank');
    } else {
      this.tabInstance2 = window.open(url, '_blank');
    }
  }

  contactPEVC: any;
  getContactPEVC(entityId: any) {
    this.financialMarketData.getContactPEVC(entityId).subscribe((res: any) => {
      this.contactPEVC = res[0]?.contact;
    });
  }
  websitePEVC: any;
  yearFounded: any;
  getWebsitePEVC(entityId: any) {
    this.financialMarketData.getWebsitePEVC(entityId).subscribe((res: any) => {
      this.websitePEVC = res[0]?.web_site;
      this.yearFounded = res[0]?.year_founded;
    });
  }
  addressPEVC: any;
  phonePEVC: any;
  getAddressPEVC(entityId: any) {
    this.financialMarketData.getAddressPEVC(entityId).subscribe((res: any) => {
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
  companyInfo: any;
  companyInfoDesc: any;
  getFundMetadata(fundEntityId: any, entityId: any) {
    this.financialMarketData
      .getFundMetadata(fundEntityId, entityId)
      .subscribe((res: any) => {
        // this.companyInfo = res[0];
        res.map((el: any) => {
          this.companyInfo = '';
          if (el.entity_profile_type === 'PRO') {
            this.companyInfo = el;
          }

          if (el.entity_profile_type === 'PR2') {
            this.companyInfoDesc = el?.description;
          }
        });

        this.companyInfoDesc = `
          ${this.companyInfo?.description}`;
      });
  }

  getNotListedMetadata(entityId: any) {
    this.financialMarketData
      .getNotListedMetadata(entityId)
      .subscribe((res: any) => {
        // this.companyInfo = res[0];
        res.map((el: any) => {
          if (el.entity_profile_type === 'PRO') {
            this.companyInfo = el;
          }

          if (el.entity_profile_type === 'PR2') {
            this.companyInfoDesc = el?.description;
          }
        });

        this.companyInfoDesc = `
          ${this.companyInfo?.description} <br><br> ${
          this.companyInfoDesc ? this.companyInfoDesc : ''
        }`;
      });
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
        this.selectedCurrencyData
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
}

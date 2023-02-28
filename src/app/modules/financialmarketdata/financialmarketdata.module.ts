import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './financialmarketdata-routing.module';
import { FinancialMarketDataDashboardComponent } from './financialmarketdata-dashboard/financialmarketdata-dashboard.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { BondsComponent } from './components/bonds/bonds.component';
import { TableComponent } from '../../components/common/table/table.component';
import { CommodityComponent } from './components/commodity/commodity.component';
import { CommodityTableComponent } from './components/commodity/commodity-table/commodity-table.component';
import { NewsModalComponent } from '../../components/common/news-modal/news-modal.component';
import { NewsDialogPopupComponent } from '../../components/common/news-dialog-popup/news-dialog-popup.component';
import { NgSelect2Module } from 'ng-select2';
import { DatePipe } from '@angular/common';
import { IndustryComponent } from './components/industry/industry.component';
import { EconomyComponent } from './components/economy/economy/economy.component';
import { ExpandTableComponent } from '../../components/common/expand-table/expand-table.component';
import { CdsComponent } from './components/cds/cds.component';
import { DerivativesComponent } from './components/derivatives/derivatives.component';
import { DerivativesTableComponent } from './components/derivatives/derivatives-table/derivatives-table.component';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { CompanyComponent } from './components/company/company.component';
import { TableModalComponent } from './components/company/table-modal/table-modal.component';
import { EconomyCountryExchangeTableComponent } from './components/economy/economy-country-exchange-table/economy-country-exchange-table.component';
import { KeyInformationTableComponent } from './components/bonds/key-information-table/key-information-table.component';
import { ComparableSecuritiesTableComponent } from './components/bonds/comparable-securities-table/comparable-securities-table.component';
import { ComparableCdsComponent } from './components/cds/comparable-cds/comparable-cds.component';
import { TransactionsModalComponent } from './components/transactions/transactions-modal/transactions-modal.component';
import { AdvanceSearchModalComponent } from '../../components/common/advance-search-modal/advance-search-modal.component';
import { BondsAdvanceSearchTableComponent } from '../../components/common/advance-search-modal/bonds-advance-search-table/bonds-advance-search-table.component';
import { IndutryMonitorComponent } from './components/indutry-monitor/indutry-monitor.component';
import { ScreenerComponent } from './components/screener/screener.component';
import { ManagementModalComponent } from './components/company/management-modal/management-modal.component';
import { SectionScrollDirective } from './components/section-scroll.directive';
import { DataDownloadComponent } from './components/data-download/data-download.component';
import { InteractiveAnalysisComponent } from './components/interactive-analysis/interactive-analysis.component';
import {
  InteractiveTableComponent,
  KeysPipe,
} from './components/interactive-analysis/interactive-table/interactive-table.component';
import { DebtTableComponent } from './components/company/debt-table/debt-table.component';
import { DebtTableModalComponent } from './components/company/debt-table-modal/debt-table-modal.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { FinancialTableComponent } from './components/company/financial-table/financial-table.component';
import { ManageHistoryModalComponent } from './components/company/management-modal/manage-history-modal/manage-history-modal.component';
import { AlertModalComponent } from './components/data-download/alert-modal/alert-modal.component';
// import { MatDatepickerModule } from "@angular/material/datepicker";
// import { MatInputModule } from '@angular/material/input';
// import { MatFormFieldModule } from '@angular/material/form-field';
import { DatepickerModule } from 'ng2-datepicker';
import { OwnershipTableComponent } from './components/company/ownership-table/ownership-table.component';
import { OwnershipTableExpandComponent } from './components/company/ownership-table-expand/ownership-table-expand.component';
import { EstimateTableComponent } from './components/company/estimate-table/estimate-table.component';
import { EstimateModalComponent } from './components/company/estimate-modal/estimate-modal.component';
import { EventsTableComponent } from './components/company/events-table/events-table.component';
import { ComapnyFileTableComponent } from './components/company/comapny-file-table/comapny-file-table.component';
import { FinancialTableExpandComponent } from './components/company/financial-table-expand/financial-table-expand.component';
import { BenchmarkTableComponent } from './components/company/benchmark-table/benchmark-table.component';
import { RelativePriceTableComponent } from './components/company/relative-price-table/relative-price-table.component';
import { CompanyInfoModalComponent } from './components/company/company-info-modal/company-info-modal.component';
import { SegmentTableComponent } from './components/company/segment-table/segment-table.component';
import { SegmentTableModalComponent } from './components/company/segment-table-modal/segment-table-modal.component';
import { AdvancedSearchComponent } from './components/transactions/advanced-search/advanced-search.component';
import { TermsModalComponent } from './components/transactions/terms-modal/terms-modal.component';
import { ExpandTableTransactionsComponent } from './components/transactions/expand-table-transactions/expand-table-transactions.component';
import { RoundModalComponent } from './components/transactions/round-modal/round-modal.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { OverlayModule } from '@angular/cdk/overlay';

import { IndustryChartComponent } from './components/industry/industry-chart/industry-chart.component';
import { AdvanceSearchCompanyComponent } from './components/company/advance-search-company/advance-search-company.component';
import { CompanyAdvanceSearchTableComponent } from './components/company/company-advance-search-table/company-advance-search-table.component';
import { AlertmodelComponent } from './components/interactive-analysis/alertmodel/alertmodel.component';
import { ChartModelComponent } from './components/interactive-analysis/chart-model/chart-model.component';
import { ChartModalComponent } from './components/transactions/chart-modal/chart-modal.component';
import { ManagementGuideTableComponent } from './components/company/management-guide-table/management-guide-table.component';
import { ManagementGuideModalComponent } from './components/company/management-guide-modal/management-guide-modal.component';
import { MaturiyGraphModalComponent } from './components/company/maturiy-graph-modal/maturiy-graph-modal.component';
import { FileViewModalComponent } from './components/company/file-view-modal/file-view-modal.component';
import { ComparableSecuritiesNoSelectionModalComponent } from './components/bonds/comparable-securities-no-selection-modal/comparable-securities-no-selection-modal.component';
import { PdfViewerModalComponent } from './components/company/pdf-viewer-modal/pdf-viewer-modal.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  DateAdapter,
  MatNativeDateModule,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  NativeDateAdapter,
} from '@angular/material/core';
import { formatDate } from '@angular/common';
import { UserManagementComponent } from './user-management/user-management.component';
import { DemoRequestComponent } from './user-management/demo-request/demo-request.component';
import { SubscribeComponent } from './user-management/subscribe/subscribe.component';
import { FreeTrailComponent } from './user-management/free-trail/free-trail.component';
import { FormAlertModelComponent } from './user-management/form-alert-model/form-alert-model.component';
import { ExpiredAlertModalComponent } from './user-management/expired-alert-modal/expired-alert-modal.component';
import { TermsOfConditionComponent } from './user-management/terms-of-condition/terms-of-condition.component';
import { TermsOfAccessComponent } from './user-management/terms-of-access/terms-of-access.component';
import { FinancialAlertPopupComponent } from './components/company/financial-alert-popup/financial-alert-popup.component';
import { UserManagementHeaderComponent } from 'src/app/components/common/user-management-header/user-management-header.component';
import { OtherChartModalComponent } from './components/transactions/other-chart-modal/other-chart-modal.component';
import { EarningsCallModalComponent } from './components/company/earnings-call-modal/earnings-call-modal.component';
import { UnavailableExploreModalComponent } from 'src/app/components/common/unavailable-explore-modal/unavailable-explore-modal.component';
import { MyAccountComponent } from './components/my-account/my-account.component';
import { WatchlistComponent } from './components/watchlist/watchlist.component';
import { InsiderTransactionModalComponent } from './components/company/insider-transaction-modal/insider-transaction-modal.component';

class PickDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    return formatDate(date, 'yyyy-MM-dd', this.locale);
  }
}
import { FixedIncomeComponent } from './components/fixed-income/fixed-income.component';
import { FixedIncomeHeaderComponent } from './components/fixed-income/fixed-income-header/fixed-income-header.component';
import { TemplateModelComponent } from './components/fixed-income/template-model/template-model.component';
import { AddModifyColumnModelComponent } from './components/fixed-income/add-modify-column-model/add-modify-column-model.component';
import { IpoModalComponent } from './components/transactions/ipo-modal/ipo-modal.component';
import { IpoTableComponent } from '../../components/common/ipo-table/ipo-table.component';
import { IpoDetailComponent } from './components/transactions/ipo-detail/ipo-detail.component';
import { IpoNotesModalComponent } from './components/transactions/ipo-detail/ipo-notes-modal/ipo-notes-modal.component';
import { IpoAdvanceSearchComponent } from './components/transactions/ipo-advance-search/ipo-advance-search.component';
import { InstrumentCharModelComponent } from './components/fixed-income/instrument-char-model/instrument-char-model.component';
import { AddComparableModelComponent } from './components/fixed-income/add-comparable-model/add-comparable-model.component';
import { ForexComponent } from './components/forex/forex.component';
import { FixedIncomeTableComponent } from './components/fixed-income/fixed-income-table/fixed-income-table.component';
import { ThumbnailGraphComponent } from 'src/app/components/common/thumbnail-graph/thumbnail-graph.component';
import { FinancialtabComponent } from './components/company/financialtab/financialtab.component';
import { NewsComponent } from './components/news/news.component';
import { NewsCardListComponent } from './components/news/news-card-list/news-card-list.component';
import { NewsDetailsComponent } from './components/news/news-details/news-details.component';
import { CdsDashboardComponent } from './components/cds/cds-dashboard/cds-dashboard.component';
import { ExpandTableCdsDashboardComponent } from './components/cds/expand-table-cds-dashboard/expand-table-cds-dashboard.component';
import { FxMatrixModalComponent } from './components/forex/fx-matrix-modal/fx-matrix-modal.component';
import { InvestmentsExpandTableComponent } from './components/company/investments-expand-table/investments-expand-table.component';
import { ExchangeDashboardComponent } from './components/exchange-dashboard/exchange-dashboard.component';
import { ExchangeExpandableTableComponent } from './components/exchange-dashboard/exchange-expandable-table/exchange-expandable-table.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ExchangeTopModalComponent } from './components/exchange-dashboard/exchange-top-modal/exchange-top-modal.component';
import { FundsInvestmentTableComponent } from './components/company/funds-investment-table/funds-investment-table.component';
import { EntityDetailsModalComponent } from './components/company/entity-details-modal/entity-details-modal.component';
import { CountrySectorInstrumentComponent } from './components/company/country-sector-instrument/country-sector-instrument.component';
import { ExchangeDashboardDetailComponent } from './components/exchange-dashboard/exchange-dashboard-detail/exchange-dashboard-detail.component';
import { PevcFundComponent } from './components/company/pevc-fund/pevc-fund.component';
import { ScreenerSelectionComponent } from './components/screener/screener-selection/screener-selection.component';
import { SaveScreenModalComponent } from './components/screener/save-screen-modal/save-screen-modal.component';
import { SavedScreenModalComponent } from './components/screener/saved-screen-modal/saved-screen-modal.component';
import { ScreenDeletionModalComponent } from './components/screener/screen-deletion-modal/screen-deletion-modal.component';
import { FinPeriodModalComponent } from './components/company/fin-period-modal/fin-period-modal.component';
import { MsgModelComponent } from 'src/app/components/common/msg-model/msg-model.component';
import { SidebarWatchlistComponent } from './components/watchlist/sidebar-watchlist/sidebar-watchlist.component';
import { TableWatchlistComponent } from './components/watchlist/table-watchlist/table-watchlist.component';
import { NewsModelComponent } from './components/watchlist/news-model/news-model.component';
import { PortfolioAnalysisTableComponent } from './components/watchlist/portfolio-analysis-table/portfolio-analysis-table.component';
import { AddColumnModelComponent } from './components/watchlist/add-column-model/add-column-model.component';
import { ImportWatchlistModelComponent } from './components/watchlist/import-watchlist-model/import-watchlist-model.component';
import { TableModelWatchlistComponent } from './components/watchlist/table-model-watchlist/table-model-watchlist.component';
import { DeleteWatchlistComponent } from './components/watchlist/delete-watchlist/delete-watchlist.component';
import { FormulaBuilderModalComponent } from './components/screener/formula-builder-modal/formula-builder-modal.component';
import { CommodityPhaseTwoTableComponent } from './components/commodity/commodity-phase-two-table/commodity-phase-two-table.component';
import { TimeagoPipe } from './components/news/pipe/timeago.pipe';
import { PevcCompanyModalComponent } from './components/company/pevc-company-modal/pevc-company-modal.component';
import { FixedIncomeTableDragDropComponent } from './components/fixed-income/fixed-income-table-drag-drop/fixed-income-table-drag-drop.component';
import { PevcFundCompanyModalComponent } from './components/company/pevc-fund-company-modal/pevc-fund-company-modal.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ForexLiveTableComponent } from './components/forex/forex-live-table/forex-live-table.component';
import { ScreenerTableComponent } from './components/screener/screener-table/screener-table.component';
import { BothPortfolioComponent } from './components/watchlist/both-portfolio/both-portfolio.component';
import { WatchlistModelComponent } from './components/watchlist/watchlist-model/watchlist-model.component';
import { FreeTrialAlertComponent } from 'src/app/components/common/free-trial-alert/free-trial-alert.component';
import { ForexExpandTableModalComponent } from './components/forex/forex-expand-table-modal/forex-expand-table-modal.component';
import { ForexExpandChartModalComponent } from './components/forex/forex-expand-chart-modal/forex-expand-chart-modal.component';
import { ForexExpandCommodityChartModalComponent } from './components/forex/forex-expand-commodity-chart-modal/forex-expand-commodity-chart-modal.component';
import { MatrixDeletionModalComponent } from './components/forex/matrix-deletion-modal/matrix-deletion-modal.component';
@NgModule({
  declarations: [
    FinancialMarketDataDashboardComponent,
    HeaderComponent,
    FooterComponent,
    BondsComponent,
    TableComponent,
    CommodityComponent,
    CommodityTableComponent,
    NewsModalComponent,
    NewsDialogPopupComponent,
    IndustryComponent,
    EconomyComponent,
    ExpandTableComponent,
    CdsComponent,
    DerivativesComponent,
    DerivativesTableComponent,
    TransactionsComponent,
    CompanyComponent,
    TableModalComponent,
    EconomyCountryExchangeTableComponent,
    KeyInformationTableComponent,
    ComparableSecuritiesTableComponent,
    ComparableCdsComponent,
    TransactionsModalComponent,
    AdvanceSearchModalComponent,
    BondsAdvanceSearchTableComponent,
    IndutryMonitorComponent,
    ScreenerComponent,
    ManagementModalComponent,
    SectionScrollDirective,
    DataDownloadComponent,
    InteractiveAnalysisComponent,
    InteractiveTableComponent,
    DebtTableComponent,
    DebtTableModalComponent,
    FinancialTableComponent,
    ManageHistoryModalComponent,
    AlertModalComponent,
    OwnershipTableComponent,
    OwnershipTableExpandComponent,
    EstimateTableComponent,
    EstimateModalComponent,
    EventsTableComponent,
    ComapnyFileTableComponent,
    FinancialTableExpandComponent,
    BenchmarkTableComponent,
    RelativePriceTableComponent,
    CompanyInfoModalComponent,
    SegmentTableComponent,
    SegmentTableModalComponent,
    AdvancedSearchComponent,
    TermsModalComponent,
    ExpandTableTransactionsComponent,
    RoundModalComponent,
    IndustryChartComponent,
    AdvanceSearchCompanyComponent,
    CompanyAdvanceSearchTableComponent,
    KeysPipe,
    AlertmodelComponent,
    ChartModelComponent,
    ChartModalComponent,
    ManagementGuideTableComponent,
    ManagementGuideModalComponent,
    MaturiyGraphModalComponent,
    FileViewModalComponent,
    ComparableSecuritiesNoSelectionModalComponent,
    PdfViewerModalComponent,
    FixedIncomeComponent,
    FixedIncomeHeaderComponent,
    FixedIncomeTableComponent,
    TemplateModelComponent,
    AddModifyColumnModelComponent,
    IpoModalComponent,
    IpoTableComponent,
    IpoDetailComponent,
    IpoNotesModalComponent,
    IpoAdvanceSearchComponent,
    InstrumentCharModelComponent,
    AddComparableModelComponent,
    ThumbnailGraphComponent,
    ForexComponent,
    IpoModalComponent,
    IpoTableComponent,
    ThumbnailGraphComponent,
    FinancialtabComponent,
    NewsComponent,
    NewsCardListComponent,
    NewsDetailsComponent,
    CdsDashboardComponent,
    ExpandTableCdsDashboardComponent,
    FxMatrixModalComponent,
    InvestmentsExpandTableComponent,
    ExchangeDashboardComponent,
    ExchangeExpandableTableComponent,
    ExchangeTopModalComponent,
    FundsInvestmentTableComponent,
    EntityDetailsModalComponent,
    CountrySectorInstrumentComponent,
    ExchangeDashboardDetailComponent,
    PevcFundComponent,
    ScreenerSelectionComponent,
    SaveScreenModalComponent,
    SavedScreenModalComponent,
    ScreenDeletionModalComponent,
    FinPeriodModalComponent,
    MsgModelComponent,
    UserManagementComponent,
    DemoRequestComponent,
    SubscribeComponent,
    FreeTrailComponent,
    FormAlertModelComponent,
    ExpiredAlertModalComponent,
    TermsOfConditionComponent,
    TermsOfAccessComponent,
    FinancialAlertPopupComponent,
    UserManagementHeaderComponent,
    OtherChartModalComponent,
    EarningsCallModalComponent,
    UnavailableExploreModalComponent,
    MyAccountComponent,
    WatchlistComponent,
    SidebarWatchlistComponent,
    TableWatchlistComponent,
    NewsModelComponent,
    PortfolioAnalysisTableComponent,
    AddColumnModelComponent,
    ImportWatchlistModelComponent,
    TableModelWatchlistComponent,
    DeleteWatchlistComponent,
    FormulaBuilderModalComponent,
    CommodityPhaseTwoTableComponent,
    TimeagoPipe,
    FixedIncomeTableDragDropComponent,
    PevcCompanyModalComponent,
    PevcFundCompanyModalComponent,
    InsiderTransactionModalComponent,
    ForexLiveTableComponent,
    ScreenerTableComponent,
    BothPortfolioComponent,
    WatchlistModelComponent,
    FreeTrialAlertComponent,
    ForexExpandTableModalComponent,
    ForexExpandChartModalComponent,
    ForexExpandCommodityChartModalComponent,
    MatrixDeletionModalComponent,
  ],
  imports: [
    CommonModule,
    MatAutocompleteModule,
    AdminRoutingModule,
    NgSelect2Module,
    FormsModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    NgxPaginationModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    DatepickerModule,
    NgxSliderModule,
    OverlayModule,
    DragDropModule,
  ],
  exports: [UserManagementHeaderComponent],
  providers: [
    DatePipe,
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: DateAdapter, useClass: PickDateAdapter },
  ],
})
export class FinancialMarketDataModule {}

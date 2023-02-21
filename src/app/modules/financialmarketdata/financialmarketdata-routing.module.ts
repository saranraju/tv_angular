import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FinancialMarketDataDashboardComponent } from './financialmarketdata-dashboard/financialmarketdata-dashboard.component';
import { BondsComponent } from './components/bonds/bonds.component';
import { DerivativesComponent } from './components/derivatives/derivatives.component';
import { CommodityComponent } from './components/commodity/commodity.component';
import { IndustryComponent } from './components/industry/industry.component';
import { EconomyComponent } from './components/economy/economy/economy.component';
import { CdsComponent } from './components/cds/cds.component';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { CompanyComponent } from './components/company/company.component';
import { IndutryMonitorComponent } from './components/indutry-monitor/indutry-monitor.component';
import { ScreenerComponent } from './components/screener/screener.component';
import { DataDownloadComponent } from './components/data-download/data-download.component';
import { InteractiveAnalysisComponent } from './components/interactive-analysis/interactive-analysis.component';
import { FixedIncomeComponent } from './components/fixed-income/fixed-income.component';
import { ForexComponent } from './components/forex/forex.component';
import { FinancialtabComponent } from 'src/app/modules/financialmarketdata/components/company/financialtab/financialtab.component';
import { NewsComponent } from './components/news/news.component';
import { CdsDashboardComponent } from './components/cds/cds-dashboard/cds-dashboard.component';
import { ExchangeDashboardComponent } from './components/exchange-dashboard/exchange-dashboard.component';
import { PevcFundComponent } from './components/company/pevc-fund/pevc-fund.component';
import { ScreenerSelectionComponent } from './components/screener/screener-selection/screener-selection.component';
import { MyAccountComponent } from './components/my-account/my-account.component';
import { WatchlistComponent } from './components/watchlist/watchlist.component';

const routes: Routes = [
  {
    path: '',
    component: FinancialMarketDataDashboardComponent,
    children: [
      {
        path: '',
        redirectTo: 'company',
        pathMatch: 'full',
      },
      {
        path: 'bonds',
        component: BondsComponent,
      },
      {
        path: 'derivatives',
        component: DerivativesComponent,
      },
      {
        path: 'transactions',
        component: TransactionsComponent,
      },
      {
        path: 'commodity',
        component: CommodityComponent,
      },
      {
        path: 'industry',
        component: IndustryComponent,
      },
      {
        path: 'economy',
        component: EconomyComponent,
      },
      {
        path: 'cds',
        component: CdsComponent,
      },

      {
        path:
          window.location.origin !==
            'https://financialmarketdata.televisory.com' &&
          window.location.origin !== 'http://52.220.108.233'
            ? 'watchlist'
            : '',
        component: WatchlistComponent,
      },
      {
        path: 'company',
        component: CompanyComponent,
      },
      {
        path: 'company/:id',
        component: CompanyComponent,
      },
      {
        path: 'industry-monitor',
        component: IndutryMonitorComponent,
      },
      {
        path: 'interactive-analysis',
        component: InteractiveAnalysisComponent,
      },
      {
        path: 'screener',
        component: ScreenerComponent,
      },
      {
        path:
          window.location.origin !==
            'https://financialmarketdata.televisory.com' &&
          window.location.origin !== 'http://52.220.108.233'
            ? 'screener-2'
            : '',
        component: ScreenerSelectionComponent,
      },
      {
        path: 'data-download',
        component: DataDownloadComponent,
      },
      {
        path:
          window.location.origin !==
          'https://financialmarketdata.televisory.com'
            ? 'fixed-income'
            : '',
        component: FixedIncomeComponent,
      },
      {
        path: 'financialtab',
        component: FinancialtabComponent,
      },
      {
        path:
          window.location.origin !==
          'https://financialmarketdata.televisory.com'
            ? 'forex'
            : '',
        component: ForexComponent,
      },
      {
        path:
          window.location.origin !==
            'https://financialmarketdata.televisory.com'
            ? 'news'
            : '',
        component: NewsComponent,
      },
      {
        path: 'exchange-dashboard',
        component: ExchangeDashboardComponent,
      },
      {
        path: 'cds-dashboard',
        component: CdsDashboardComponent,
      },
      {
        path: 'my-account',
        component: MyAccountComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}

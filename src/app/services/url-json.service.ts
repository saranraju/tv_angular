import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UrlJsonService {
  id: any;
  urlData: any = [
    {
      url: '/financialmarketdata/company',
      json: 'companyIntroJson',
    },
    {
      url: '/financialmarketdata/commodity',
      json: 'commodityIntroJson',
    },
    {
      url: '/financialmarketdata/economy',
      json: 'economyIntroJson',
    },
    {
      url: '/financialmarketdata/interactive-analysis',
      json: 'AnalysisIntroJson',
    },
    {
      url: '/financialmarketdata/industry',
      json: 'industryIntroJson',
    },
    {
      url: '/financialmarketdata/industry-monitor',
      json: 'indutryMonitorJson',
    },
    {
      url: '/financialmarketdata/screener',
      json: 'screenerIntroJson',
    },
    {
      url: '/financialmarketdata/data-download',
      json: 'dataDownloadJson',
    },
  ];
}

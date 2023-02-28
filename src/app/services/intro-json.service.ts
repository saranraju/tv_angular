import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class IntroJsonService {
  id: any;
  companyIntroJson: any = [
    {
      element: '#companyStep1',
      intro: '<p>Select Company by Name</p>',
      position: 'bottom',
    },
    {
      element: '#companyStep2',
      intro: '<p>Select Section to Navigate</p>',
      position: 'bottom',
    },
    {
      element: '#companyStep3',
      intro: '<p>Click to View Industry/Country Data</p>',
      position: 'bottom',
    },
    {
      element: '#companyStep4',
      intro: '<p>Click to Select Stock Exchange</p>',
      position: 'bottom',
    },
    {
      element: '#companyStep5',
      intro: '<p>Click to Change Currency</p>',
      position: 'bottom',
    },
    {
      element: '#companyStep6',
      intro: '<p>Change Metrics for Beta Calculation</p>',
      position: 'bottom',
    },
    {
      element: '#companyStep7',
      intro: '<p>Click to Download Company Profile</p>',
      position: 'bottom',
    },
    {
      element: '#companyStep8',
      intro: '<p>Select Periodicity for Stock Chart</p>',
      position: 'bottom',
    },
    {
      element: '#companyStep9',
      intro: '<p>Download Historical of Stock Price Data</p>',
      position: 'bottom',
    },
    {
      element: '#companyStep10',
      intro: '<p>Click to Compare Benchmark Companies Data</p>',
      position: 'bottom',
    },
    {
      element: '#companyStep11',
      intro: '<p>Select Financial Reporting</p>',
      position: 'bottom',
    },
    {
      element: '#companyStep12',
      intro: '<p>Click to Maximize Table/Section</p>',
      position: 'bottom',
    },
    {
      element: '#companyStep13',
      intro: '<p>Click to Download Table/Section in Excel</p>',
      position: 'bottom',
    },
    {
      element: '#companyStep14',
      intro: '<p>Select Metric for Chart View</p>',
      position: 'bottom',
    },
    {
      element: '#companyStep15',
      intro: '<p>Select Name to View Full Profile</p>',
      position: 'bottom',
    },
    {
      element: '#companyStep16',
      intro:
        '<p>Click to Change Estimates Consensus Data by Summary Statistics</p>',
      position: 'bottom',
    },
    {
      element: '#companyStep17',
      intro: '<p>Select Document Type</p>',
      position: 'bottom',
    },
    {
      element: '#scrolltotop-btn',
      intro: '<p>Click to Go to Top</p>',
      position: 'bottom',
    },
  ];
  commodityIntroJson: any = [
    {
      element: '#commodityStep1',
      intro: '<p>Click to Select Commodity for Chart View</p>',
      position: 'bottom',
    },
    {
      element: '#commodityStep2',
      intro: '<p>Click to Change Chart Periodicity</p>',
      position: 'bottom',
    },
    {
      element: '#commodityStep3',
      intro: '<p>Click Any Commodity for Interactive Analysis</p>',
      position: 'bottom',
    },
  ];
  economyIntroJson: any = [
    {
      element: '#economyStep1',
      intro: '<p>Select Country to View Economic Data</p>',
      position: 'bottom',
    },
    {
      element: '#economyStep2',
      intro: '<p>Select Metric to View Chart</p>',
      position: 'bottom',
    },
    {
      element: '#economyStep3',
      intro: '<p>Search Currency for FX Rate</p>',
      position: 'bottom',
    },
  ];
  industryIntroJson: any = [
    {
      element: '#industryStep1',
      intro: '<p>Select Country</p>',
      position: 'bottom',
    },
    {
      element: '#industryStep2',
      intro: '<p>Select Period</p>',
      position: 'bottom',
    },
    {
      element: '#industryStep3',
      intro: '<p>Click Sector to See Industries</p>',
      position: 'bottom',
    },
  ];
  indutryMonitorJson: any = [
    {
      element: '#industryMonitorStep1',
      intro: '<p>Select Sector</p>',
      position: 'bottom',
    },
  ];
  screenerIntroJson: any = [
    {
      element: '#screenerStep1',
      intro: '<p>Select Sector to Filter Industries</p>',
      position: 'bottom',
    },
    {
      element: '#screenerStep2',
      intro: '<p>Select Industry to View Company List</p>',
      position: 'bottom',
    },
  ];
  dataDownloadJson: any = [
    {
      element: '#dataDownloadStep1',
      intro: '<p>Select Company Selection</p>',
      position: 'bottom',
    },
  ];
  AnalysisIntroJson: any = [
    {
      element: '#analysisStep1',
      intro: '<p>Select Companies for Comparison</p>',
      position: 'bottom',
    },
    {
      element: '#analysisStep2',
      intro: '<p>Select Metric for Comparison</p>',
      position: 'bottom',
    },
    {
      element: '#analysisStep3',
      intro: '<p>Select Start Date</p>',
      position: 'bottom',
    },
    {
      element: '#analysisStep4',
      intro: '<p>Select End Date</p>',
      position: 'bottom',
    },
    {
      element: '#analysisStep5',
      intro: '<p>Select Comparison Periodicity</p>',
      position: 'bottom',
    },
  ];
  constructor() {}
}

import { Component, OnInit } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-cds-dashboard',
  templateUrl: './cds-dashboard.component.html',
  styleUrls: ['./cds-dashboard.component.scss'],
})
export class CdsDashboardComponent implements OnInit {
  cds_dashboard_table_data = {
    title: [
      {
        label: 'CDS Name',
        key: 'cdsName',
        align: 'left',
        width: '11rem',
        plusIcon: true,
        color: '#ffc000',
        pointer: true,
      },
      {
        label: 'Region',
        key: 'region',
        align: 'center',
      },
      {
        label: 'Sector',
        key: 'sector',
        align: 'center',
      },
      {
        label: 'Currency',
        key: 'currency',
        align: 'center',
      },
      {
        label: 'Seniority',
        key: 'seniority',
        align: 'center',
      },
      {
        label: 'Restructuring Type',
        key: 'restructuringType',
        align: 'center',
      },
      {
        label: 'Tenor',
        key: 'tenor',
        align: 'center',
      },
      {
        label: 'Par Spread Mid',
        key: 'parSpreadMid',
        align: 'center',
      },
      {
        label: 'Quote Spread Mid',
        key: 'quoteSpreadMid',
        align: 'center',
      },
      {
        label: 'Upfront Mid',
        key: 'upfrontMid',
        align: 'center',
      },
      {
        label: 'Percent of Par Mid',
        key: 'percentParMid',
        align: 'center',
      },
      {
        label: 'Hazard Rate',
        key: 'hazardRate',
        align: 'center',
      },
      {
        label: 'Cumulative Probability of Default',
        key: 'cumlativeDefault',
        align: 'center',
      },
    ],
    value: [
      {
        cdsName: 'ABC Ltd | 0.25Y | EUR | MMR | Senior',
        region: 'Western Europe',
        sector: 'Industrials',
        currency: 'EUR',
        seniority: 'SENIOR',
        restructuringType: 'MMR',
        tenor: '0.25Y',
        parSpreadMid: 'XX.XX',
        quoteSpreadMid: 'XX.XX',
        upfrontMid: 'XX.XX',
        percentParMid: 'XX.XX',
        hazardRate: 'XX.XX',
        cumlativeDefault: 'XX.XX',
      },
      {
        cdsName: 'ABC Ltd | 0.25Y | EUR | MMR | Senior',
        region: 'Western Europe',
        sector: 'Industrials',
        currency: 'EUR',
        seniority: 'SENIOR',
        restructuringType: 'MMR',
        tenor: '0.25Y',
        parSpreadMid: 'XX.XX',
        quoteSpreadMid: 'XX.XX',
        upfrontMid: 'XX.XX',
        percentParMid: 'XX.XX',
        hazardRate: 'XX.XX',
        cumlativeDefault: 'XX.XX',
      },
      {
        cdsName: 'ABC Ltd | 0.25Y | EUR | MMR | Senior',
        region: 'Western Europe',
        sector: 'Industrials',
        currency: 'EUR',
        seniority: 'SENIOR',
        restructuringType: 'MMR',
        tenor: '0.25Y',
        parSpreadMid: 'XX.XX',
        quoteSpreadMid: 'XX.XX',
        upfrontMid: 'XX.XX',
        percentParMid: 'XX.XX',
        hazardRate: 'XX.XX',
        cumlativeDefault: 'XX.XX',
      },
      {
        cdsName: 'ABC Ltd | 0.25Y | EUR | MMR | Senior',
        region: 'Western Europe',
        sector: 'Industrials',
        currency: 'EUR',
        seniority: 'SENIOR',
        restructuringType: 'MMR',
        tenor: '0.25Y',
        parSpreadMid: 'XX.XX',
        quoteSpreadMid: 'XX.XX',
        upfrontMid: 'XX.XX',
        percentParMid: 'XX.XX',
        hazardRate: 'XX.XX',
        cumlativeDefault: 'XX.XX',
      },
      {
        cdsName: 'ABC Ltd | 0.25Y | EUR | MMR | Senior',
        region: 'Western Europe',
        sector: 'Industrials',
        currency: 'EUR',
        seniority: 'SENIOR',
        restructuringType: 'MMR',
        tenor: '0.25Y',
        parSpreadMid: 'XX.XX',
        quoteSpreadMid: 'XX.XX',
        upfrontMid: 'XX.XX',
        percentParMid: 'XX.XX',
        hazardRate: 'XX.XX',
        cumlativeDefault: 'XX.XX',
      },
      {
        cdsName: 'ABC Ltd | 0.25Y | EUR | MMR | Senior',
        region: 'Western Europe',
        sector: 'Industrials',
        currency: 'EUR',
        seniority: 'SENIOR',
        restructuringType: 'MMR',
        tenor: '0.25Y',
        parSpreadMid: 'XX.XX',
        quoteSpreadMid: 'XX.XX',
        upfrontMid: 'XX.XX',
        percentParMid: 'XX.XX',
        hazardRate: 'XX.XX',
        cumlativeDefault: 'XX.XX',
      },
      {
        cdsName: 'ABC Ltd | 0.25Y | EUR | MMR | Senior',
        region: 'Western Europe',
        sector: 'Industrials',
        currency: 'EUR',
        seniority: 'SENIOR',
        restructuringType: 'MMR',
        tenor: '0.25Y',
        parSpreadMid: 'XX.XX',
        quoteSpreadMid: 'XX.XX',
        upfrontMid: 'XX.XX',
        percentParMid: 'XX.XX',
        hazardRate: 'XX.XX',
        cumlativeDefault: 'XX.XX',
      },
      {
        cdsName: 'ABC Ltd | 0.25Y | EUR | MMR | Senior',
        region: 'Western Europe',
        sector: 'Industrials',
        currency: 'EUR',
        seniority: 'SENIOR',
        restructuringType: 'MMR',
        tenor: '0.25Y',
        parSpreadMid: 'XX.XX',
        quoteSpreadMid: 'XX.XX',
        upfrontMid: 'XX.XX',
        percentParMid: 'XX.XX',
        hazardRate: 'XX.XX',
        cumlativeDefault: 'XX.XX',
      },
      {
        cdsName: 'ABC Ltd | 0.25Y | EUR | MMR | Senior',
        region: 'Western Europe',
        sector: 'Industrials',
        currency: 'EUR',
        seniority: 'SENIOR',
        restructuringType: 'MMR',
        tenor: '0.25Y',
        parSpreadMid: 'XX.XX',
        quoteSpreadMid: 'XX.XX',
        upfrontMid: 'XX.XX',
        percentParMid: 'XX.XX',
        hazardRate: 'XX.XX',
        cumlativeDefault: 'XX.XX',
      },
      {
        cdsName: 'ABC Ltd | 0.25Y | EUR | MMR | Senior',
        region: 'Western Europe',
        sector: 'Industrials',
        currency: 'EUR',
        seniority: 'SENIOR',
        restructuringType: 'MMR',
        tenor: '0.25Y',
        parSpreadMid: 'XX.XX',
        quoteSpreadMid: 'XX.XX',
        upfrontMid: 'XX.XX',
        percentParMid: 'XX.XX',
        hazardRate: 'XX.XX',
        cumlativeDefault: 'XX.XX',
      },
      {
        cdsName: 'ABC Ltd | 0.25Y | EUR | MMR | Senior',
        region: 'Western Europe',
        sector: 'Industrials',
        currency: 'EUR',
        seniority: 'SENIOR',
        restructuringType: 'MMR',
        tenor: '0.25Y',
        parSpreadMid: 'XX.XX',
        quoteSpreadMid: 'XX.XX',
        upfrontMid: 'XX.XX',
        percentParMid: 'XX.XX',
        hazardRate: 'XX.XX',
        cumlativeDefault: 'XX.XX',
      },
      {
        cdsName: 'ABC Ltd | 0.25Y | EUR | MMR | Senior',
        region: 'Western Europe',
        sector: 'Industrials',
        currency: 'EUR',
        seniority: 'SENIOR',
        restructuringType: 'MMR',
        tenor: '0.25Y',
        parSpreadMid: 'XX.XX',
        quoteSpreadMid: 'XX.XX',
        upfrontMid: 'XX.XX',
        percentParMid: 'XX.XX',
        hazardRate: 'XX.XX',
        cumlativeDefault: 'XX.XX',
      },
      {
        cdsName: 'ABC Ltd | 0.25Y | EUR | MMR | Senior',
        region: 'Western Europe',
        sector: 'Industrials',
        currency: 'EUR',
        seniority: 'SENIOR',
        restructuringType: 'MMR',
        tenor: '0.25Y',
        parSpreadMid: 'XX.XX',
        quoteSpreadMid: 'XX.XX',
        upfrontMid: 'XX.XX',
        percentParMid: 'XX.XX',
        hazardRate: 'XX.XX',
        cumlativeDefault: 'XX.XX',
      },
      {
        cdsName: 'ABC Ltd | 0.25Y | EUR | MMR | Senior',
        region: 'Western Europe',
        sector: 'Industrials',
        currency: 'EUR',
        seniority: 'SENIOR',
        restructuringType: 'MMR',
        tenor: '0.25Y',
        parSpreadMid: 'XX.XX',
        quoteSpreadMid: 'XX.XX',
        upfrontMid: 'XX.XX',
        percentParMid: 'XX.XX',
        hazardRate: 'XX.XX',
        cumlativeDefault: 'XX.XX',
      },
    ],
  };

  clicked: any = false;
  buttonTwo: any = 1;
  hideCdsDashboard: any = false;

  buttonTypes = [
    {
      id: 1,
      title: 'DASHBOARD',
    },
    {
      id: 2,
      title: 'ADVANCED SEARCH',
    },
  ];

  constructor(public util: UtilService) {}

  ngOnInit(): void {
    this.util.setDateHandler('1Y');
  }

  switchTabs(e: any) {
    this.buttonTwo = e;
  }

  hideCdsDashboardHandler(e: any) {
    this.hideCdsDashboard = e;
  }

  cdsCompanyDataHandler(data: any) {
    console.log(data);
  }

  dateChange(type: any) {
    this.util.setDateHandler(type);
  }
}

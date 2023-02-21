import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
})
export class UserManagementComponent implements OnInit {
  sectionProductTab: any = 'realTimeData';
  sectionTab: any = '';
  section_list = [
    {
      img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoAQMAAAC2MCouAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAAAxJREFUeNpjYBhZAAAA8AABOGlaUQAAAABJRU5ErkJggg==',
      header: 'Listed+Private Companies',
      tooltip:
        'All global listed companies and 4 million+ private companies with detailed coverage of fundamentals, financial and valuation ratios, shareholding structure, debt profile, segment information, analyst recommendations and estimates along with entity structure and events and filings.',
      sub_header: 'Fundamentals, Debt Profile, Ownership, Estimates ++',
      imgPresent: false,
      pos: '0px',
    },
    {
      img: 'assets/img/Fixed-Income.png',
      header: 'Fixed Income',
      tooltip:
        'The database provides pricing and analytics like Yields, Spreads, Duration and Convexities for Bonds, CDS and Treasury Bills. Screener and quick comparison of similar instruments available.',
      sub_header: 'Bonds, Treasuries, Credit Default Swaps',
      imgPresent: true,
    },
    {
      img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoAQMAAAC2MCouAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAAAxJREFUeNpjYBhZAAAA8AABOGlaUQAAAABJRU5ErkJggg==',
      header: 'Derivatives',
      tooltip: `Pricing and analytics on Options, Futures, ETF's, Currency contracts etc. Quick access to settlement price, contract size, strike price, volumes, open interest and bid and ask prices amongst others.`,
      sub_header: `'ETF's, Futures and Options'`,
      pos: '-222px',
      imgPresent: false,
    },
    {
      img: 'assets/img/Transactions.png',
      header: 'Transactions',
      tooltip:
        'Up to Date M&A, PE/VC and IPO details. Evaluate investment opportunities and perform precedent transactions analysis.',
      sub_header: 'M&A, PE/VC & IPO',
      imgPresent: true,
    },
    {
      img: 'assets/img/Forex-Commodities.png',
      header: 'Forex & Commodities',
      tooltip:
        'Pricing history, News and Estimates for ~60 commodities including indices. Comprehensive list of currencies for forex analysis.',
      sub_header: 'Price, News and Estimates',
      imgPresent: true,
    },
    {
      img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoAQMAAAC2MCouAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAAAxJREFUeNpjYBhZAAAA8AABOGlaUQAAAABJRU5ErkJggg==',
      header: 'Economies',
      tooltip:
        '100+ Economic Indicators, Estimates and news for 200+ countries. Also, access industry related parameters at the economic/regional level.',
      sub_header: '100 Economic Indicators for 200+Countries',
      pos: '-32px',
      imgPresent: false,
    },
    {
      img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoAQMAAAC2MCouAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAAAxJREFUeNpjYBhZAAAA8AABOGlaUQAAAABJRU5ErkJggg==',
      header: 'Industries',
      tooltip:
        'Quarterly and Annual insights on 120 industries across 150 geographies on economic, financial and valuation parameters.',
      sub_header: 'Reports and Analytics on 120+ Industries',
      pos: '-320px',
      imgPresent: false,
    },
    {
      img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoAQMAAAC2MCouAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAAAxJREFUeNpjYBhZAAAA8AABOGlaUQAAAABJRU5ErkJggg==',
      header: 'Emerging Data Sets',
      tooltip: `288 ESG metrics covered; evaluate any default or breach committed by companies through KYC data; get bankruptcy status, reclassification, liquidation details etc. through Televisory's Bankruptcy coverage.`,
      sub_header: 'ESG, KYC and Bankruptcy',
      pos: '-511px',
      imgPresent: false,
    },
    {
      img: 'assets/img/Global-Financial-News.png',
      header: 'Global Financial News',
      tooltip:
        'Identify new trends and generate ideas to stay ahead of the market with real time news.',
      sub_header: '',
      imgPresent: true,
    },
  ];
  section_product_list = [
    {
      img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoAQMAAAC2MCouAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAAAxJREFUeNpjYBhZAAAA8AABOGlaUQAAAABJRU5ErkJggg==',
      header: 'Operational',
      tootip: `Our database covers industry specific KPIs to monitor and benchmark a company's data with regional & global peers.`,
      sub_header: 'Data',
      pos: '-287px',
    },
    {
      img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoAQMAAAC2MCouAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAAAxJREFUeNpjYBhZAAAA8AABOGlaUQAAAABJRU5ErkJggg==',
      header: '10,000+',
      tootip:
        'We have a team of industry experts that continuously add & update the operational & financial data of regional & global leaders to benchmark with.',
      sub_header: 'Companies',
      pos: '-32px',
    },
    {
      img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoAQMAAAC2MCouAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAAAxJREFUeNpjYBhZAAAA8AABOGlaUQAAAABJRU5ErkJggg==',
      header: 'Interactive',
      tootip: `Interactive Charting enables users to visualize the comparison of company's KPIs with its peers.`,
      sub_header: `Charting`,
      pos: '-352px',
    },
    {
      img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoAQMAAAC2MCouAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAAAxJREFUeNpjYBhZAAAA8AABOGlaUQAAAABJRU5ErkJggg==',
      header: 'Fundamental',
      tootip: `Extensive coverage of standardized financial data along with the extensive list of financial ratios to provide users the ease to compare.`,
      sub_header: 'Data',
      pos: '-256px',
    },
    {
      img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoAQMAAAC2MCouAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAAAxJREFUeNpjYBhZAAAA8AABOGlaUQAAAABJRU5ErkJggg==',
      header: '275+ Distinct',
      tootip: `The database covers all global sectors spanning over 275+ distinct industry types.`,
      sub_header: 'Industries',
      pos: '-320px',
    },
    {
      img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoAQMAAAC2MCouAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAAAxJREFUeNpjYBhZAAAA8AABOGlaUQAAAABJRU5ErkJggg==',
      header: 'Data',
      tootip: `We provide easy access of 1 million+ operational & fundamental data points.`,
      sub_header: 'Download',
      pos: '-97px',
    },
  ];
  section_creditWork_list = [
    {
      img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoAQMAAAC2MCouAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAAAxJREFUeNpjYBhZAAAA8AABOGlaUQAAAABJRU5ErkJggg==',
      header: 'Real Time ',
      tooltip: `Real Time Data Analysis allows a user to compare companies within an industry across geographies on various parameters over multiple periods. This platform gives user the flexibility to visualize and download data of several companies or an entire peer group. Broadly data on two business segments can be found namely Operational Metrics & Financial Metrics.`,
      sub_header: ' Data Analytics',
      pos: '-480px',
    },
    {
      img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoAQMAAAC2MCouAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAAAxJREFUeNpjYBhZAAAA8AABOGlaUQAAAABJRU5ErkJggg==',
      header: 'What-If ',
      tooltip: `What-If Scenario helps analyze the impact on important financial metrics and Leverage Ratios by applying sensitivities on industry specific operational KPIs. It helps in finding effects of changes in operational KPIs on Revenue & EBITDA under different scenarios created by the user.`,
      sub_header: ' Scenario',
      pos: '-543px',
    },
    {
      img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoAQMAAAC2MCouAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAAAxJREFUeNpjYBhZAAAA8AABOGlaUQAAAABJRU5ErkJggg==',
      header: 'Debt ',
      tooltip: `Debt Sizing helps in finding the sustainable debt for a company given the attributes of its debt. Debt Tenor ranging from 1 to 25 years can be selected.`,
      sub_header: `Sizing`,
      pos: '-160px',
    },
    {
      img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoAQMAAAC2MCouAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAAAxJREFUeNpjYBhZAAAA8AABOGlaUQAAAABJRU5ErkJggg==',
      header: 'Covenant ',
      tooltip: `Covenant Sensitivity helps in finding the required changes in important operational metrics by choosing desired level of DSCR and Gross Debt/EBITDA. A user may set any desired level of DSCR and Debt/EBITDA depending upon his/her preference and generate expected result.`,
      sub_header: ' Sensitivity',
      pos: '-64px',
    },
    {
      img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoAQMAAAC2MCouAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAAAxJREFUeNpjYBhZAAAA8AABOGlaUQAAAABJRU5ErkJggg==',
      header: 'Portfolio  ',
      tooltip: `Portfolio Console helps lenders/investors to keep a track of all their borrowers/investees that have utilized Televisory benchmarking services all online without a need of a separate terminal. This platform helps in keeping track of sensitivity tests, debt sizing, projection, obligor grading and early warning signs on the financier's dashboard for their borrowers/investees.`,
      sub_header: '  console',
      pos: '-416px',
    },
    {
      img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoAQMAAAC2MCouAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAAAxJREFUeNpjYBhZAAAA8AABOGlaUQAAAABJRU5ErkJggg==',
      header: 'Early Warning ',
      tooltip: `data-original-title="Early warning Signs brings foresight to recognize deteriorating characteristics in a company. Pre-select key operational & financial parameters and assign relevant trigger threshold. Triggers may include declining sales, reducing operating cashflow, mounting debts etc."`,
      sub_header: ' Signs',
      pos: '-192px',
    },
    {
      img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoAQMAAAC2MCouAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAAAxJREFUeNpjYBhZAAAA8AABOGlaUQAAAABJRU5ErkJggg==',
      header: 'Obligor ',
      tooltip: `Obligor Grading enables users to quantify credit risk associated with a borrower by assigning grades arrived on after comprehensive credit analysis of the borrower. It enables users to rate borrowers on a 1 to 5 grading scale (1 being the best) developed by Televisory.`,
      sub_header: 'Grading',
      pos: '-384px',
    },
    {
      img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoAQMAAAC2MCouAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAAAxJREFUeNpjYBhZAAAA8AABOGlaUQAAAABJRU5ErkJggg==',
      header: 'Projections',
      tooltip: `Projection module enables users to forecast company financials using machine driven industry insights coupled with user fed assumptions.`,
      sub_header: '',
      pos: '-448px',
    },
    {
      img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoAQMAAAC2MCouAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAAAxJREFUeNpjYBhZAAAA8AABOGlaUQAAAABJRU5ErkJggg==',
      header: 'Financial Market Data',
      tooltip: `Financial Market Data provides Financial and Equity Database bringing together the company and economy data requirement at one-stop destination.`,
      sub_header: '',
      pos: '0px',
    },
  ];
  section_bench_list = [
    {
      img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoAQMAAAC2MCouAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAAAxJREFUeNpjYBhZAAAA8AABOGlaUQAAAABJRU5ErkJggg==',
      header: 'Operational',
      tooltip: `Our database covers industry specific KPIs to monitor and benchmark the user's data with regional & global peers.`,
      sub_header: 'Data',
      pos: '-287px',
    },
    {
      img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoAQMAAAC2MCouAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAAAxJREFUeNpjYBhZAAAA8AABOGlaUQAAAABJRU5ErkJggg==',
      header: '10,000+',
      tooltip: `We have a team of industry experts that continuously add & update the operational & financial data of regional & global leaders to benchmark with.`,
      sub_header: 'Companies',
      pos: '-32px',
    },
    {
      img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoAQMAAAC2MCouAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAAAxJREFUeNpjYBhZAAAA8AABOGlaUQAAAABJRU5ErkJggg==',
      header: 'Interactive',
      tooltip: `Interactive Charting enables users to visualize the comparison of company's KPIs with its peers.`,
      sub_header: `Charting`,
      pos: '-352px',
    },
    {
      img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoAQMAAAC2MCouAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAAAxJREFUeNpjYBhZAAAA8AABOGlaUQAAAABJRU5ErkJggg==',
      header: 'Fundamental',
      tooltip: `Extensive coverage of standardized financial data along with the extensive list of financial ratios to provide users the ease to compare.`,
      sub_header: 'Data',
      pos: '-256px',
    },
    {
      img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoAQMAAAC2MCouAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAAAxJREFUeNpjYBhZAAAA8AABOGlaUQAAAABJRU5ErkJggg==',
      header: '275+ Distinct',
      tooltip: `The database covers all global sectors spanning over 275+ distinct industry types.`,
      sub_header: 'Industries',
      pos: '-320px',
    },
    {
      img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoAQMAAAC2MCouAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAAAxJREFUeNpjYBhZAAAA8AABOGlaUQAAAABJRU5ErkJggg==',
      header: 'Data',
      tooltip: `We provide easy access of 1 million+ operational & fundamental data points.`,
      sub_header: 'Download',
      pos: '-97px',
    },
  ];
  section_customize_list = [
    {
      img: 'https://www.televisory.com/TelevisoryV3-theme/images/third-customizedreport.png',
      header: 'Graphite Electrode',
      sub_header: ' Industry',
    },
    {
      img: 'https://www.televisory.com/TelevisoryV3-theme/images/first-customizedreport.png',
      header: 'Global Paper and Board',
      sub_header: ' Packaging Industry',
    },
    {
      img: 'https://www.televisory.com/TelevisoryV3-theme/images/second-customizedreport.png',
      header: 'Global Plastic ',
      sub_header: `PackagingIndustry`,
    },
    {
      img: 'https://www.televisory.com/TelevisoryV3-theme/images/fourth-customizedreport.png',
      header: 'Global Iron Ore Pellets',
      sub_header: ' Industry',
    },
    {
      img: 'https://www.televisory.com/TelevisoryV3-theme/images/fifth-customizedreport.png',
      header: 'Biosimilar Development',
      sub_header: ' Industry',
    },
  ];
  constructor(public router: Router, public auth: AuthService) {}

  ngOnInit(): void {}

  productSection(section: string, type?: any) {
    this.sectionProductTab = section;
    this.sectionTab = section;
    if (type) {
      document
        .getElementById(`${section}`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
  exploreClick() {
    if (localStorage.getItem('exploreExpired') === 'true') {
      this.auth.closeInsidePopup = true;
    } else {
      const url = this.router.serializeUrl(
        this.router.createUrlTree(['/financialmarketdata/company'], {
          queryParams: {
            explore: true,
          },
        })
      );
      window.open(url, '_blank');
      localStorage.setItem('access_token', 'dummytoken');
      if (!localStorage.getItem('exploreUserTime')) {
        localStorage.setItem('exploreUserTime', new Date().toString());
      }
    }
  }
  navigateToSection(section: string) {
    this.sectionTab = section;
    document
      .getElementById(`${section}`)
      ?.scrollIntoView({ behavior: 'smooth' });
  }

  clickCount: any = 0;
  handleGetSamples() {
    let baseURl = window.location.origin;
    if (this.clickCount == 0) {
      this.clickCount++;

      const a: any = document.createElement('a');
      let url =
        baseURl +
        `/assets/img/samplereport_BIOSIMILAR DEVELOPMENT INDUSTRY.pdf`;
      a.href = url;
      a.download = url.split('/').pop();
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else if (this.clickCount == 1) {
      this.clickCount++;
      const a: any = document.createElement('a');
      let url =
        baseURl +
        `/assets/img/samplereport_GLOBAL GRAPHITE ELECTRODE INDUSTRY  Structural Changes Driving Growth till 2020.pdf`;
      a.href = url;
      a.download = url.split('/').pop();
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else if (this.clickCount == 2) {
      this.clickCount = 0;
      const a: any = document.createElement('a');
      let url =
        baseURl +
        `/assets/img/samplereport_GLOBAL IRON ORE PELLETS INDUSTRY Outlook 2030.pdf`;
      a.href = url;
      a.download = url.split('/').pop();
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }
}

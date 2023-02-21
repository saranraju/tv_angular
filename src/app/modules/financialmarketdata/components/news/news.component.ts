import { Component, DoCheck, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FinancialMarketDataService } from 'src/app/services/financialmarketdata.service';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { environment } from 'src/environments/environment';
import { UtilService } from 'src/app/services/util.service';
@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss'],
})
export class NewsComponent implements OnInit, DoCheck {
  companyNewsListData: any = [];
  economyNewsListData: any = [];
  industryNewsListData: any = [];
  commodityNewsListData: any = [];
  forexNewsListData: any = [];
  generalNewsListData: any = [];
  newsBaseURL: any = environment.phase_two_base_url + '/news';

  companyNewsDetailsTableData: any = {
    title: [
      {
        label: 'News Article',
        key: 'newsItem',
        headerAlign: 'center',
        width: '35rem',
      },
      {
        label: 'News Category',
        key: 'newsCategory',
        align: 'left',
      },
    ],
    value: [],
  };
  economyNewsDetailsTableData: any = {
    title: [
      {
        label: 'News Article',
        key: 'newsItem',
        headerAlign: 'center',
        width: '48rem',
      },
      {
        label: 'News Category',
        key: 'newsCategory',
        align: 'left',
      },
    ],
    value: [],
  };
  industryNewsDetailsTableData: any = {
    title: [
      // {
      //   label: 'Industry',
      //   key: 'industry',
      //   color: '#05a0ea',
      //   width: '12rem',
      // },
      {
        label: 'News Article',
        key: 'newsItem',
        headerAlign: 'center',
        width: '38rem',
      },
      {
        label: 'News Category',
        key: 'newsCategory',
        align: 'left',
      },
    ],
    value: [],
  };
  commodityNewsDetailsTableData: any = {
    title: [
      // {
      //   label: 'Commodity Name',
      //   key: 'commodityName',
      //   width: '10rem',
      //   color: '#05a0ea',
      // },
      // {
      //   label: 'Commodity Group',
      //   key: 'commodityGroup',
      //   align: 'center',
      // },
      {
        label: 'News Article',
        key: 'newsItem',
        headerAlign: 'center',
        width: '36rem',
      },
      {
        label: 'News Category',
        key: 'newsCategory',
        align: 'left',
      },
    ],
    value: [],
  };
  forexNewsDetailsTableData: any = {
    title: [
      // {
      //   label: 'Currency',
      //   key: 'currency',
      //   color: '#05a0ea',
      //   width: '17rem',
      // },
      {
        label: 'News Article',
        key: 'newsItem',
        headerAlign: 'center',
      },
      {
        label: 'News Category',
        key: 'newsCategory',
        align: 'left',
      },
    ],
    value: [],
  };
  generalNewsDetailsTableData: any = {
    title: [
      {
        label: 'News Article',
        key: 'newsItem',
        headerAlign: 'center',
        width: '38rem',
      },

      {
        label: 'News Category',
        key: 'newsCategory',
        align: 'left',
      },
    ],
    value: [],
  };
  latestNews: any = [];
  relatedNews: any = [];
  newsInfo: any;
  hideNewsList: any = false;
  showCompanyNews: any = false;
  showEconomyNews: any = false;
  showIndustryNews: any = false;
  showCommodityNews: any = false;
  showForexNews: any = false;
  showGeneralNews: any = false;
  showNewsItemDetails: any = false;
  IndustryListLength: any = 0;
  CompanyListLength: any = 0;
  ComodityListLength: any = 0;
  EconomyListLength: any = 0;
  ForexListLength: any = 0;
  generalListLength: any = 0;
  latestNewsListLength: any = 0;
  relatedNewsListLength: any = 0;
  newsId: any;
  selectCountryData: any = [];
  selectedCountryData: any;
  industryListDropdown: any = [];
  commodityListDropdown: any = [];

  constructor(
    private financialMarketData: FinancialMarketDataService,
    private route: ActivatedRoute,
    public router: Router,
    public util: UtilService
  ) {}

  ngOnInit(): void {
    this.getRouteInfo();
    this.getNewsCategory();
    this.getCountrySelectData();
    this.getNewsIndustryDropDown();
    this.getNewsCommodityDropDown();
  }
  ngOnDestroy() {
    this.ws.disconnect();
  }

  ngDoCheck() {
    if (!window.location.search) {
      this.showEconomyNews = false;
      this.showCommodityNews = false;
      this.showCompanyNews = false;
      this.showForexNews = false;
      this.showIndustryNews = false;
      this.showGeneralNews = false;
    }
  }

  getRouteInfo() {
    this.route.queryParams.subscribe((params: Params) => {
      this.hideNewsList = params['hideNewsList'];
      this.showNewsItemDetails = params['showNewsItem'];
      this.newsId = params['id'];
      this.selectedCountryData = params['country'];
      var type = params['type'];
      if (this.hideNewsList == 'true') {
        this.hideNewsList = true;
        this.latestNewsLoading = true;
        this.handleNewsListType(type);
        // this.getLatesNewsData();
      } else if (this.showNewsItemDetails == 'true' && this.newsId) {
        this.showNewsItemDetails = true;
        this.hideNewsList = true;
        this.count_res = 0;
        this.total_count_res = 1;
        this.util.loaderService.display(true);
        this.handleNewsDetails(this.newsId);
        // this.getLatesNewsData();
        // this.getRelatedNewsData();
        this.relatedNewsSocket(this.newsId);
      } else {
        if (!this.selectedCountryData) {
          this.socketConnection();
        }
      }
      // this.showCompanyNews = params['hideNewsList'];
    });
  }

  getCountrySelectData() {
    let x: any = [];

    this.financialMarketData.getNewsCountry().subscribe((res: any) => {
      this.selectCountryData = res.map((element: any) => {
        return {
          id: element.id,
          text: element.category,
        };
      });
    });
  }
  selectNewsCategoryData: any = [];
  getNewsCategory() {
    this.financialMarketData.getNewsCategory().subscribe((res: any) => {
      this.selectNewsCategoryData = res.map((el: any) => {
        return {
          id: el.id,
          text: el.category,
        };
      });
    });
  }

  getNewsIndustryDropDown() {
    this.financialMarketData.getNewsIndustryDropDown().subscribe((res: any) => {
      this.industryListDropdown = res.map((el: any) => {
        return {
          id: el.id,
          text: el.category,
        };
      });
    });
  }

  getNewsCommodityDropDown() {
    this.financialMarketData
      .getNewsCommodityDropDown()
      .subscribe((res: any) => {
        this.commodityListDropdown = res.map((el: any) => {
          return {
            id: el.id,
            text: el.category,
          };
        });
      });
  }

  onNewsCountryChange(event: any) {
    if (this.selectCountryData && this.selectedCountryData !== event) {
      this.selectedCountryData = event;
      var category;
      this.companyNewsLoading = true;
      this.economyNewsLoading = true;
      this.industryNewsLoading = true;
      this.commodityNewsLoading = true;
      this.forexNewsLoading = true;
      this.generalNewsLoading = true;
      this.onNewsDetailsCompanyChange(event, category);
      this.onNewsDetailsEconomyChange(event, category);
      this.onNewsDetailsIndustryChange(event, category);
      this.onNewsDetailsCommodityChange(event, category);
      this.onNewsDetailsForexChange(event, category);
      this.onNewsDetailsGeneralChange(event, category);
    }
  }

  getNewsIndustry(res: any) {
    // this.financialMarketData.getNewsIndustry(0).subscribe(
    //   (res: any) => {
    //     // console.log('getNewsIndustry', res);
    this.industryNewsListData = [];
    this.industryNewsDetailsTableData.value = [];
    res.content.forEach((ele: any) => {
      this.industryNewsListData.push({
        news: ele.newsHeadline,
        source: ele.metaData,
        time: ele.newsDateTimeStory,
        id: ele.newsId,
      });
      var arrayData: any = {};
      var arry = ele.newsMetacode;
      var result = this.joinObj(arry);
      (arrayData.newsArticle = ele.newsHeadline),
        (arrayData.time = ele.newsDateTimeStory),
        // (arrayData.source = 'MT Newswires'),
        this.industryNewsDetailsTableData.value.push({
          newsItem: arrayData,
          // industry: ele.newsVendorSequence,
          newsCategory: result,
          id: ele.newsId,
        });
    });
    this.IndustryListLength = res.totalElements;
    // },
    // (err: any) => {
    //   console.error('error', err.message);
    // }
    // );
  }

  getNewsCommodity(res: any) {
    // this.financialMarketData.getNewsCommodity(0).subscribe(
    //   (res: any) => {
    // console.log('getNewsCommodity', res);
    this.commodityNewsListData = [];
    this.commodityNewsDetailsTableData.value = [];
    res.content.forEach((ele: any) => {
      this.commodityNewsListData.push({
        news: ele.newsHeadline,
        source: ele.metaData,
        time: ele.newsDateTimeStory,
        id: ele.newsId,
      });
      var arrayData: any = {};

      var arry = ele.newsMetacode;
      var result = this.joinObj(arry);

      (arrayData.newsArticle = ele.newsHeadline),
        (arrayData.time = ele.newsDateTimeStory),
        // (arrayData.source = 'MT Newswires'),
        this.commodityNewsDetailsTableData.value.push({
          // commodityName: 'Gold',
          // commodityGroup: 'Precious Metals',
          newsCategory: result,
          newsItem: arrayData,
          id: ele.newsId,
        });
    });
    this.ComodityListLength = res.totalElements;
    //   },
    //   (err: any) => {
    //     console.error('error', err.message);
    //   }
    // );
  }
  getNewsUIEconomy(res: any) {
    this.economyNewsListData = [];
    this.economyNewsDetailsTableData.value = [];
    // this.financialMarketData.getNewsUIEconomy(0).subscribe(
    //   (res: any) => {
    //     // console.log('getNewsuiecono', res);
    res.content.forEach((ele: any) => {
      this.economyNewsListData.push({
        news: ele.newsHeadline,
        source: ele.metaData,
        time: ele.newsDateTimeStory,
        id: ele.newsId,
      });
      var arrayData: any = {};

      var arry = ele.newsMetacode;
      var result = this.joinObj(arry);

      (arrayData.newsArticle = ele.newsHeadline),
        (arrayData.time = ele.newsDateTimeStory),
        // (arrayData.source = 'MT Newswires'),
        this.economyNewsDetailsTableData.value.push({
          newsItem: arrayData,
          newsCategory: result,
          id: ele.newsId,
        });
    });
    this.EconomyListLength = res.totalElements;
    //   },
    //   (err: any) => {
    //     console.error('error', err.message);
    //   }
    // );
  }

  getNewsUIcompany(res: any) {
    this.companyNewsListData = [];
    this.companyNewsDetailsTableData.value = [];
    // this.financialMarketData.getNewsUIcompany(0).subscribe(
    //   (res: any) => {
    // console.log('getNewsCompany', res);
    res.content.forEach((ele: any) => {
      this.companyNewsListData.push({
        news: ele.newsHeadline,
        source: ele.metaData,
        time: ele.newsDateTimeStory,
        id: ele.newsId,
      });
      var arrayData: any = {};

      var arry = ele.newsMetacode;
      var result = this.joinObj(arry);
      (arrayData.newsArticle = ele.newsHeadline),
        (arrayData.time = ele.newsDateTimeStory),
        // (arrayData.source = 'MT Newswires'),
        this.companyNewsDetailsTableData.value.push({
          newsItem: arrayData,
          newsCategory: result,
          id: ele.newsId,
        });
    });

    this.CompanyListLength = res.totalElements;
    // },
    // (err: any) => {
    //   console.error('error', err.message);
    // }
    // );
  }
  joinObj(a: any) {
    var out = [];
    for (var i = 0; i < a.length; i++) {
      if (a[i].newsWireMetaCode !== null) out.push(a[i].newsWireMetaCode);
    }
    return out.join(', ');
  }

  getNewsUIForex(res: any) {
    // this.financialMarketData.getNewsUIForex(0).subscribe(
    //   (res: any) => {
    // console.log('getNewsCountry', res);
    this.forexNewsListData = [];
    this.forexNewsDetailsTableData.value = [];
    res.content.forEach((ele: any) => {
      this.forexNewsListData.push({
        news: ele.newsHeadline,
        source: ele.metaData,
        time: ele.newsDateTimeStory,
        id: ele.newsId,
      });
      var arrayData: any = {};
      var arry = ele.newsMetacode;
      var result = this.joinObj(arry);

      (arrayData.newsArticle = ele.newsHeadline),
        // (arrayData.source = 'MT Newswires'),
        (arrayData.time = ele.newsDateTimeStory),
        this.forexNewsDetailsTableData.value.push({
          // currency: 'USD/INR',
          newsItem: arrayData,
          id: ele.newsId,
          newsCategory: result,
        });
    });
    this.ForexListLength = res.totalElements;
    //   },
    //   (err: any) => {
    //     console.error('error', err.message);
    //   }
    // );
  }

  getNewsUIGeneral(res: any) {
    // this.financialMarketData.getNewsUIGeneral(0).subscribe(
    //   (res: any) => {
    // console.log('getNewsGenral', res);
    this.generalNewsListData = [];
    this.generalNewsDetailsTableData.value = [];
    res.content.forEach((ele: any) => {
      this.generalNewsListData.push({
        news: ele.newsHeadline,
        source: ele.metaData,
        time: ele.newsDateTimeStory,
        id: ele.newsId,
      });
      var arrayData: any = {};
      var arry = ele.newsMetacode;
      var result = this.joinObj(arry);

      (arrayData.newsArticle = ele.newsHeadline),
        (arrayData.source = 'MT Newswires'),
        (arrayData.time = ele.newsDateTimeStory),
        this.generalNewsDetailsTableData.value.push({
          // category: 'Company',
          newsItem: arrayData,
          newsCategory: result,
          id: ele.newsId,
        });
    });
    this.generalListLength = res.totalElements;
    //   },
    //   (err: any) => {
    //     console.error('error', err.message);
    //   }
    // );
  }
  tabIndustryInstance: any;
  handleExpandListClickType(type: any) {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/financialmarketdata/news'], {
        relativeTo: this.route,
        queryParams: {
          hideNewsList: true,
          type: type,
          country: this.selectedCountryData,
        },
        queryParamsHandling: 'merge',
      })
    );
    if (this.tabIndustryInstance != undefined) {
      this.tabIndustryInstance.close();
      this.tabIndustryInstance = window.open(url, '_blank');
    } else {
      this.tabIndustryInstance = window.open(url, '_blank');
    }
  }

  handleNewsListType(type: any) {
    // this.relatedNewsSocket(this.newsId);
    switch (type) {
      case 'Company News':
        this.showCompanyNews = true;

        // this.getSelectedNewsData('INDU.MN', type);
        break;
      case 'Economy News':
        this.showEconomyNews = true;
        // this.getSelectedNewsData('INDU.MN', type);

        break;
      case 'Industry News':
        this.showIndustryNews = true;
        // this.getSelectedNewsData('INDU.MN', type);

        break;
      case 'Commodity News':
        this.showCommodityNews = true;
        // this.getSelectedNewsData('INDU.MN', type);

        break;
      case 'Forex News':
        this.showForexNews = true;
        // this.getSelectedNewsData('INDU.MN', type);

        break;
      case 'General News':
        this.showGeneralNews = true;
        // this.getSelectedNewsData('INDU.MN', type);
        break;

      default:
        break;
    }
  }

  handleNewsItemClick(e: any) {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/financialmarketdata/news'], {
        // relativeTo: this.route,
        queryParams: { showNewsItem: true, id: e },
        // queryParamsHandling: 'merge',
      })
    );
    if (this.tabIndustryInstance != undefined) {
      this.tabIndustryInstance.close();
      this.tabIndustryInstance = window.open(url, '_blank');
    } else {
      this.tabIndustryInstance = window.open(url, '_blank');
    }
  }
  count_res: any = 0;
  total_count_res: any = 0;
  handleNewsDetails(id: any) {
    this.financialMarketData.getNewsDataBasedOnId(id).subscribe(
      (res: any) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);
        this.newsInfo = res[0];
      },
      (err) => {
        console.error(err);
      }
    );
  }
  getLatesNewsData(res: any) {
    this.latestNews = [];
    // this.financialMarketData
    //   .getLatestOrRelatedNews('latestnews')
    //   .subscribe((res: any) => {
    res.content.forEach((element: any) => {
      this.latestNews.push({
        news: element.newsHeadline,
        id: element.newsId,
        time: element.newsDateTimeStory,
      });
    });

    this.latestNewsListLength = res.totalElements;

    // });
  }
  getRelatedNewsDataAppend(res: any) {
    this.relatedNews = [];
    res.content.forEach((element: any) => {
      this.relatedNews.push({
        news: element.newsHeadline,
        id: element.newsId,
        time: element.newsDateTimeStory,
      });
    });
    this.relatedNewsListLength = res.totalElements;
  }

  greetings: string[] = [];
  showConversation: boolean = false;
  ws: any;
  name: any;
  disabled: any;
  newWebSocketRes: any;
  generaSubID: any;

  generalPageNumber: number = 1;
  forexPageNumber: number = 1;
  companyPageNumber: number = 1;
  industryPageNumber: number = 1;
  economyPageNumber: number = 1;
  commodityPageNumber: number = 1;
  relatedNewsPage: number = 1;
  latestNewsPage: number = 1;

  generalNewsId: any = null;
  companyNewsId: any = null;
  economyNewsId: any = null;
  industryNewsId: any = null;
  forexNewsId: any = null;
  commodityNewsId: any = null;
  latestNewsId: any = null;
  relatedNewsId: any = null;

  // Mainpage table datas
  tableDataEnergy: any = [];
  tableDataMetal: any = [];

  // After clicking the title
  detailTableData: any = [];
  detailData: any = [];

  companyNewsLoading: any = false;
  economyNewsLoading: any = false;
  industryNewsLoading: any = false;
  commodityNewsLoading: any = false;
  forexNewsLoading: any = false;
  generalNewsLoading: any = false;
  latestNewsLoading: any = false;
  relatedNewsLoading: any = false;

  socketConnection() {
    this.companyNewsLoading = true;
    this.economyNewsLoading = true;
    this.industryNewsLoading = true;
    this.commodityNewsLoading = true;
    this.forexNewsLoading = true;
    this.generalNewsLoading = true;
    this.relatedNewsLoading = true;
    this.latestNewsLoading = true;
    // var metalUrl = `/commodity/latest-news/${page_number}`;
    // var metalSendUrl = `/app/connect-latest/${page_number}`;
    let socket = new SockJS(`${this.newsBaseURL}/news-socket`);
    this.ws = Stomp.over(socket);
    let that = this;
    this.ws.connect(
      {},
      function (frame: any) {
        that.ws.subscribe('/errors', function (message: any) {
          console.log('Error ' + message.body);
        });
        // latestnews;
        that.ws.subscribe('/news/latest-news/0', function (message: any) {
          // that.showGreeting(message.body);
          that.getLatestNewsData(message);
          that.latestNewsLoading = false;
        });
        that.ws.send('/app/connect-latest/0', {}, {});
        //general
        that.ws.subscribe(`/news/general-news/0`, function (message: any) {
          that.getGeneralNews(message);
          that.generalNewsLoading = false;
        });
        that.ws.send(`/app/connect-general/0`, {}, {});
        // forex
        that.ws.subscribe('/news/forex-news/0', function (message: any) {
          that.getForexNews(message);
          that.forexNewsLoading = false;
        });
        that.ws.send('/app/connect-forex/0', {}, {});
        // company
        that.ws.subscribe('/news/company-news/0', function (message: any) {
          that.getCompanyNews(message);
          that.companyNewsLoading = false;
        });
        that.ws.send('/app/connect-company/0', {}, {});
        // industry
        that.ws.subscribe('/news/industry-news/0', function (message: any) {
          that.getIndustryData(message);
          that.industryNewsLoading = false;
        });
        that.ws.send('/app/connect-industry/0', {}, {});
        // econommy
        that.ws.subscribe('/news/economy-news/0', function (message: any) {
          that.getEconomyData(message);
          that.economyNewsLoading = false;
        });
        that.ws.send('/app/connect-economy/0', {}, {});
        // commodity
        that.ws.subscribe('/news/commodity-news/0', function (message: any) {
          that.getCommodityNews(message);
          that.commodityNewsLoading = false;
        });
        that.ws.send('/app/connect-commodity/0', {}, {});
      },
      function (error: any) {
        console.log('STOMP error ' + error);
      }
    );
    // console.log('this.pagenumber', this.pagenumber);
  }

  relatedNewsSocket(id: any) {
    this.relatedNewsLoading = true;
    this.latestNewsLoading = true;
    // var metalUrl = `/commodity/latest-news/${page_number}`;
    // var metalSendUrl = `/app/connect-latest/${page_number}`;
    let socket = new SockJS(`${this.newsBaseURL}/news-socket`);
    this.ws = Stomp.over(socket);
    let that = this;
    this.ws.connect(
      {},
      function (frame: any) {
        that.ws.subscribe('/errors', function (message: any) {
          console.log('Error ' + message.body);
        });
        //relatednews
        that.ws.subscribe(
          `/news/connect-related-news/0/newsId/${id}`,
          function (message: any) {
            // that.showGreeting(message.body);
            that.getRelatedNewsData(message);
            that.relatedNewsLoading = false;
          }
        );
        that.ws.send(`/app/connect-related-news/0/newsId/${id}`, {}, {});
        // latestnews;
        that.ws.subscribe('/news/latest-news/0', function (message: any) {
          // that.showGreeting(message.body);
          that.getLatestNewsData(message);
          that.latestNewsLoading = false;
        });
        that.ws.send('/app/connect-latest/0', {}, {});
        // relatednews;
        // if (id !== undefined) {
        //   that.ws.subscribe(
        //     `/news/connect-related-news/0/newsId/${id}`,
        //     function (message: any) {
        //       // that.showGreeting(message.body);
        //       that.getRelatedNewsData(message);
        //       that.relatedNewsLoading = false;
        //     }
        //   );
        //   that.ws.send(`/app/connect-related-news/0/newsId/${id}`, {}, {});
        // }
      },
      function (error: any) {
        console.log('STOMP error ' + error);
      }
    );
  }

  getGeneralNews(message: any) {
    this.showConversation = true;
    const DataRes = JSON.parse(message?.body);
    const generalNewsID = message?.headers?.subscription;
    this.generalNewsId = generalNewsID;
    this.getNewsUIGeneral(DataRes);
  }

  getCompanyNews(message: any) {
    // this.tableDataMetal = [];
    this.showConversation = true;
    const DataRes = JSON.parse(message?.body);
    const companyNewsId = message?.headers?.subscription;
    this.companyNewsId = companyNewsId;
    this.getNewsUIcompany(DataRes);
  }
  getEconomyData(message: any) {
    this.showConversation = true;
    const DataRes = JSON.parse(message?.body);
    const economyNewsId = message?.headers?.subscription;
    this.economyNewsId = economyNewsId;
    this.getNewsUIEconomy(DataRes);
  }
  getIndustryData(message: any) {
    this.showConversation = true;
    const DataRes = JSON.parse(message?.body);
    const industryNewsId = message?.headers?.subscription;
    this.industryNewsId = industryNewsId;
    this.getNewsIndustry(DataRes);
  }

  getForexNews(message: any) {
    this.showConversation = true;
    const DataRes = JSON.parse(message?.body);
    const forexNewsId = message?.headers?.subscription;
    this.forexNewsId = forexNewsId;
    this.getNewsUIForex(DataRes);
  }

  getCommodityNews(message: any) {
    this.showConversation = true;
    const DataRes = JSON.parse(message?.body);
    const commodityNewsId = message?.headers?.subscription;
    this.commodityNewsId = commodityNewsId;
    this.getNewsCommodity(DataRes);
  }

  getLatestNewsData(message: any) {
    this.showConversation = true;
    const DataRes = JSON.parse(message?.body);
    const generalNewsID = message?.headers?.subscription;
    this.latestNewsId = generalNewsID;
    this.getLatesNewsData(DataRes);
  }
  getRelatedNewsData(message: any) {
    this.showConversation = true;
    const DataRes = JSON.parse(message?.body);
    const generalNewsID = message?.headers?.subscription;
    this.relatedNewsId = generalNewsID;
    this.getRelatedNewsDataAppend(DataRes);
  }

  setConnected(connected: any) {
    this.disabled = connected;
    this.showConversation = connected;
    this.greetings = [];
  }

  onPageChanged(e: any) {
    var type = e.list;
    var pageNum = e.page;

    switch (type) {
      case 'Company News':
        // this.companyPageNumber = pageNum;
        this.onCompanyPageChange(pageNum);
        this.companyNewsLoading = true;
        break;
      case 'Economy News':
        // this.economyPageNumber = pageNum;
        this.onEconomyPageChange(pageNum);
        this.economyNewsLoading = true;
        break;
      case 'Industry News':
        // this.industryPageNumber = pageNum;
        this.onIndustryPageChange(pageNum);
        this.industryNewsLoading = true;
        break;
      case 'Commodity News':
        // this.commodityNewsListData = pageNum;
        this.onCommodityPageChange(pageNum);
        this.commodityNewsLoading = true;
        break;
      case 'Forex News':
        // this.forexPageNumber = pageNum;
        this.onForexPageChange(pageNum);
        this.forexNewsLoading = true;
        break;
      case 'General News':
        // this.generalPageNumber = pageNum;
        this.onGeneralNewsPageChange(pageNum);
        this.generalNewsLoading = true;
        break;

      default:
        break;
    }
  }

  onGeneralNewsPageChange(page: any) {
    if (this.generalNewsId != null) this.ws.unsubscribe(this.generalNewsId);
    this.generalPageNumber = page;
    let tempPage: number = page - 1;

    const generalURL = `/news/general-news/${tempPage}`;
    let generalSendURl = `/app/connect-general/${tempPage}`;
    let that = this;
    that.ws.subscribe(generalURL, function (message: any) {
      that.getGeneralNews(message);
      that.generalNewsLoading = false;
    });

    that.ws.send(generalSendURl, {}, {});
  }
  onForexPageChange(page: any) {
    if (this.forexNewsId != null) this.ws.unsubscribe(this.forexNewsId);
    this.forexPageNumber = page;
    let tempPage: number = page - 1;
    const generalURL = `/news/forex-news/${tempPage}`;
    let generalSendURl = `/app/connect-forex/${tempPage}`;
    let that = this;
    that.ws.subscribe(generalURL, function (message: any) {
      that.getForexNews(message);
      that.forexNewsLoading = false;
    });

    that.ws.send(generalSendURl, {}, {});
  }
  onCommodityPageChange(page: any) {
    if (this.commodityNewsId != null) this.ws.unsubscribe(this.commodityNewsId);
    this.commodityPageNumber = page;
    let tempPage: number = page - 1;
    const generalURL = `/news/commodity-news/${tempPage}`;
    let generalSendURl = `/app/connect-commodity/${tempPage}`;
    let that = this;
    that.ws.subscribe(generalURL, function (message: any) {
      that.getCommodityNews(message);
      that.commodityNewsLoading = false;
    });

    that.ws.send(generalSendURl, {}, {});
  }

  onIndustryPageChange(page: any) {
    if (this.industryNewsId != null) this.ws.unsubscribe(this.industryNewsId);
    this.industryPageNumber = page;
    let tempPage: number = page - 1;
    const generalURL = `/news/industry-news/${tempPage}`;
    let generalSendURl = `/app/connect-industry/${tempPage}`;
    let that = this;
    that.ws.subscribe(generalURL, function (message: any) {
      that.getIndustryData(message);
      that.industryNewsLoading = false;
    });

    that.ws.send(generalSendURl, {}, {});
  }
  onEconomyPageChange(page: any) {
    if (this.economyNewsId != null) this.ws.unsubscribe(this.economyNewsId);
    this.economyPageNumber = page;
    let tempPage: number = page - 1;
    const generalURL = `/news/economy-news/${tempPage}`;
    let generalSendURl = `/app/connect-economy/${tempPage}`;
    let that = this;
    that.ws.subscribe(generalURL, function (message: any) {
      that.getEconomyData(message);
      that.economyNewsLoading = false;
    });

    that.ws.send(generalSendURl, {}, {});
  }
  onCompanyPageChange(page: any) {
    if (this.companyNewsId != null) this.ws.unsubscribe(this.companyNewsId);
    this.companyPageNumber = page;
    let tempPage: number = page - 1;
    const generalURL = `/news/company-news/${tempPage}`;
    let generalSendURl = `/app/connect-company/${tempPage}`;
    let that = this;
    that.ws.subscribe(generalURL, function (message: any) {
      that.getCompanyNews(message);
      that.companyNewsLoading = false;
    });

    that.ws.send(generalSendURl, {}, {});
  }

  //<<------- News Expanding Functions ----->>

  onNewsDetailsCompanyChange(country: any, category: any) {
    var page = this.companyPageNumber - 1;
    if (this.companyNewsId != null) this.ws.unsubscribe(this.companyNewsId);
    const generalURL = `/news/company-news/${page}${
      country ? `/countryId/${country}` : ''
    }${category ? `/categoryId/${category}` : ''}`;
    let generalSendURl = `/app/connect-company/${page}${
      country ? `/countryId/${country}` : ''
    }${category ? `/categoryId/${category}` : ''}`;
    let that = this;
    that.ws.subscribe(generalURL, function (message: any) {
      that.getCompanyNews(message);
      that.companyNewsLoading = false;
    });

    that.ws.send(generalSendURl, {}, {});
  }

  onNewsDetailsEconomyChange(country: any, category: any) {
    var page = this.economyPageNumber - 1;
    if (this.economyNewsId != null) this.ws.unsubscribe(this.economyNewsId);
    const generalURL = `/news/economy-news/${page}${
      country ? `/countryId/${country}` : ''
    }${category ? `/categoryId/${category}` : ''}`;
    let generalSendURl = `/app/connect-economy/${page}${
      country ? `/countryId/${country}` : ''
    }${category ? `/categoryId/${category}` : ''}`;
    let that = this;
    that.ws.subscribe(generalURL, function (message: any) {
      that.getEconomyData(message);
      that.economyNewsLoading = false;
    });

    that.ws.send(generalSendURl, {}, {});
  }

  onNewsDetailsIndustryChange(country: any, category: any) {
    var page = this.industryPageNumber - 1;
    if (this.industryNewsId != null) this.ws.unsubscribe(this.industryNewsId);
    const generalURL = `/news/industry-news/${page}${
      country ? `/countryId/${country}` : ''
    }${category ? `/categoryId/${category}` : ''}`;
    let generalSendURl = `/app/connect-industry/${page}${
      country ? `/countryId/${country}` : ''
    }${category ? `/categoryId/${category}` : ''}`;
    let that = this;
    that.ws.subscribe(generalURL, function (message: any) {
      that.getIndustryData(message);
      that.industryNewsLoading = false;
    });

    that.ws.send(generalSendURl, {}, {});
  }

  onNewsDetailsCommodityChange(country: any, category: any) {
    var page = this.commodityPageNumber - 1;
    if (this.commodityNewsId != null) this.ws.unsubscribe(this.commodityNewsId);
    const generalURL = `/news/commodity-news/${page}${
      country ? `/countryId/${country}` : ''
    }${category ? `/categoryId/${category}` : ''}`;
    let generalSendURl = `/app/connect-commodity/${page}${
      country ? `/countryId/${country}` : ''
    }${category ? `/categoryId/${category}` : ''}`;
    let that = this;
    that.ws.subscribe(generalURL, function (message: any) {
      that.getCommodityNews(message);
      that.commodityNewsLoading = false;
    });

    that.ws.send(generalSendURl, {}, {});
  }

  onNewsDetailsForexChange(country: any, category: any) {
    var page = this.forexPageNumber - 1;
    if (this.forexNewsId != null) this.ws.unsubscribe(this.forexNewsId);
    const generalURL = `/news/forex-news/${page}${
      country ? `/countryId/${country}` : ''
    }${category ? `/categoryId/${category}` : ''}`;
    let generalSendURl = `/app/connect-forex/${page}${
      country ? `/countryId/${country}` : ''
    }${category ? `/categoryId/${category}` : ''}`;
    let that = this;
    that.ws.subscribe(generalURL, function (message: any) {
      that.getForexNews(message);
      that.forexNewsLoading = false;
    });

    that.ws.send(generalSendURl, {}, {});
  }

  onNewsDetailsGeneralChange(country: any, category: any) {
    var page = this.generalPageNumber - 1;
    if (this.generalNewsId != null) this.ws.unsubscribe(this.generalNewsId);
    const generalURL = `/news/general-news/${page}${
      country ? `/countryId/${country}` : ''
    }${category ? `/categoryId/${category}` : ''}`;
    let generalSendURl = `/app/connect-general/${page}${
      country ? `/countryId/${country}` : ''
    }${category ? `/categoryId/${category}` : ''}`;
    let that = this;
    that.ws.subscribe(generalURL, function (message: any) {
      that.getGeneralNews(message);
      that.generalNewsLoading = false;
    });

    that.ws.send(generalSendURl, {}, {});
  }

  onLatestNewsPageChange(country: any, category: any) {
    var page = this.latestNewsPage - 1;
    if (this.latestNewsId != null) this.ws.unsubscribe(this.latestNewsId);
    const latestNewURL = `/news/latest-news/${page}`;
    // ${
    //   country ? `/countryId/${country}` : ''
    // }${category ? `/categoryId/${category}` : ''}`;
    let generalSendURl = `/app/connect-latest/${page}`;
    // ${
    //   country ? `/countryId/${country}` : ''
    // }${category ? `/categoryId/${category}` : ''}`;
    let that = this;
    that.ws.subscribe(latestNewURL, function (message: any) {
      that.getLatestNewsData(message);
      that.latestNewsLoading = false;
    });

    that.ws.send(generalSendURl, {}, {});
  }

  onRelatedNewsPageChange(country: any, category: any) {
    var page = this.relatedNewsPage - 1;
    if (this.relatedNewsId != null) this.ws.unsubscribe(this.relatedNewsId);
    const relatedNewsUrl = `/news/connect-related-news/${page}/newsId/${this.newsId}`;
    // ${
    //   country ? `/countryId/${country}` : ''
    // }${category ? `/categoryId/${category}` : ''}`;
    let generalSendURl = `/app/connect-related-news/${page}/newsId/${this.newsId}`;
    // ${
    //   country ? `/countryId/${country}` : ''
    // }${category ? `/categoryId/${category}` : ''}`;
    let that = this;
    that.ws.subscribe(relatedNewsUrl, function (message: any) {
      that.getRelatedNewsData(message);
      that.relatedNewsLoading = false;
    });

    that.ws.send(generalSendURl, {}, {});
  }

  handlecountrySelectedDetail(e: any) {
    console.log(e);
  }

  onChangeNewsDetails(e: any) {
    var type = e.list;
    var pageNum = e.page;
    var country = e.country;
    var category = e.category;
    switch (type) {
      case 'Company News':
        if (!this.companyNewsId) {
          this.socketConnectionForNewsDetails(e);
        } else {
          this.companyPageNumber = pageNum;
          this.onNewsDetailsCompanyChange(country, category);
          this.onLatestNewsPageChange(country, category);
          this.companyNewsLoading = true;
        }
        break;
      case 'Economy News':
        if (!this.economyNewsId) {
          this.socketConnectionForNewsDetails(e);
        } else {
          this.economyPageNumber = pageNum;
          this.onNewsDetailsEconomyChange(country, category);
          this.onLatestNewsPageChange(country, category);
          this.economyNewsLoading = true;
        }
        break;
      case 'Industry News':
        if (!this.industryNewsId) {
          this.socketConnectionForNewsDetails(e);
        } else {
          this.industryPageNumber = pageNum;
          this.onNewsDetailsIndustryChange(country, category);
          this.onLatestNewsPageChange(country, category);
          this.industryNewsLoading = true;
        }

        break;
      case 'Commodity News':
        if (!this.commodityNewsId) {
          this.socketConnectionForNewsDetails(e);
        } else {
          this.commodityPageNumber = pageNum;
          this.onNewsDetailsCommodityChange(country, category);
          this.commodityNewsLoading = true;
        }

        break;
      case 'Forex News':
        if (!this.forexNewsId) {
          this.socketConnectionForNewsDetails(e);
        } else {
          this.forexPageNumber = pageNum;
          this.onNewsDetailsForexChange(country, category);
          this.onLatestNewsPageChange(country, category);
          this.forexNewsLoading = true;
        }

        break;
      case 'General News':
        if (!this.generalNewsId) {
          this.socketConnectionForNewsDetails(e);
        } else {
          this.generalPageNumber = pageNum;
          this.onNewsDetailsGeneralChange(country, category);
          this.onLatestNewsPageChange(country, category);
          this.generalNewsLoading = true;
        }

        break;
      case 'Latest News':
        if (!this.latestNewsId) {
          this.socketConnectionForNewsDetails(e);
        } else {
          this.latestNewsPage = pageNum;
          this.onLatestNewsPageChange(country, category);
          this.latestNewsLoading = true;
        }

        break;

      case 'Related News':
        if (!this.relatedNewsId) {
          this.socketConnectionForNewsDetails(e);
        } else {
          this.relatedNewsPage = pageNum;
          this.onRelatedNewsPageChange(country, category);
          this.relatedNewsLoading = true;
        }

        break;

      default:
        break;
    }
  }

  socketConnectionForNewsDetails(e: any) {
    this.companyNewsId = true;
    this.economyNewsId = true;
    this.industryNewsId = true;
    this.commodityNewsId = true;
    this.forexNewsId = true;
    this.generalNewsId = true;
    this.latestNewsId = true;
    this.relatedNewsId = true;
    let socket = new SockJS(`${this.newsBaseURL}/news-socket`);
    this.ws = Stomp.over(socket);
    let that = this;
    this.ws.connect(
      {},
      function (frame: any) {
        that.ws.subscribe('/errors', function (message: any) {
          console.log('Error ' + message.body);
        });
        that.onChangeNewsDetails(e);
      },
      function (error: any) {
        console.log('STOMP error ' + error);
      }
    );
    // console.log('this.pagenumber', this.pagenumber);
  }

  handleNewsDetailsPageChange(e: any) {
    this.onPageChanged(e);
  }
  handleCountryReset() {
    this.onNewsCountryChange(null);
  }
}

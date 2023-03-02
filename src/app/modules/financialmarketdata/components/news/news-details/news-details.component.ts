import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-news-details',
  templateUrl: './news-details.component.html',
  styleUrls: ['./news-details.component.scss'],
})
export class NewsDetailsComponent implements OnInit {
  @Input() newsType: any;
  @Input() newsDetailsTableData: any;
  @Input() mh: any;
  @Input() latestNews: any;
  @Input() selectCountryData: any;
  @Input() selectNewsCategoryData: any;
  @Input() industryListDropdown: any;
  @Input() tableLength: any;
  @Input() commodityListDropdown: any;
  @Input() news_details_loading: any;
  @Input() latest_news_loading: any;
  @Input() selectedCountry: any;
  @Input() latestNewsTotalLength: any;

  @Output() countrySelectedDetail = new EventEmitter<any>();
  @Output() onNewsClickedEmit = new EventEmitter<any>();
  @Output() onLatestNewsPageChanged = new EventEmitter<any>();

  selectedCountryData: any;
  selectedNewsCategoryData: any;
  phase_two_news_base_url: any = environment.phase_two_news_base_url;
  currentPageSelected: any = 1;
  selectedIndustry: any;
  selectedCommodity: any;

  public labels: any = {
    previousLabel: '◄',
    nextLabel: '►',
  };
  ws: any;

  constructor(public util: UtilService) {}

  ngOnInit(): void {
    this.selectedCountryData = this.selectedCountry;
    if (this.selectCountryData) {
      this.onSelectedData();
    }
  }

  onNewsCountryChange(type: any, event: any) {
    if (type === 'country') {
      if (this.selectCountryData && this.selectedCountryData !== event) {
        this.selectedCountryData = event;
        this.currentPageSelected = 1;
        this.onSelectedData();
      }
    } else if (type === 'category') {
      if (
        this.selectNewsCategoryData &&
        this.selectedNewsCategoryData !== event
      ) {
        this.selectedNewsCategoryData = event;
        this.currentPageSelected = 1;
        this.onSelectedData();
      }
    }
  }

  onSelectedData() {
    var obj: any = {};
    obj.page = this.currentPageSelected;
    obj.category = this.selectedNewsCategoryData;
    obj.country = this.selectedCountryData;
    obj.list = this.newsType;
    this.countrySelectedDetail.emit(obj);
  }
  onPageChange(event: any) {
    this.currentPageSelected = event;
    this.onSelectedData();
  }
  onNewsClicked(event: any) {
    this.onNewsClickedEmit.emit(event.id ? event : '');
  }
  onLatestNewsPageChange(e: any) {
    // var latest: any = {};
    // latest.page = e;
    // // obj.category = this.selectedNewsCategoryData;
    // // obj.country = this.selectedCountryData;
    // latest.list = 'Latest News';
    this.countrySelectedDetail.emit(e);
  }
}

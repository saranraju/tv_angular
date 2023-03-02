import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-news-card-list',
  templateUrl: './news-card-list.component.html',
  styleUrls: ['./news-card-list.component.scss'],
})
export class NewsCardListComponent implements OnInit {
  @Input() listTitle: any;
  @Input() newsListData: any;
  @Input() tableLength: any;
  @Input() hideContent: any;
  @Input() itemsPerPage: any;
  @Input() loading: any;
  @Input() type: any;
  @Input() paginationLabelSize: any;

  @Output() hideNewsList = new EventEmitter<any>();
  @Output() hideNewsDetails = new EventEmitter<any>();
  @Output() newsListType = new EventEmitter<any>();
  @Output() pageChanged = new EventEmitter<any>();

  public labels: any = {
    previousLabel: '◄',
    nextLabel: '►',
  };
  currentPageSelected: any;

  constructor() {}

  ngOnInit(): void {}

  handleExpandListClick(e: any) {
    this.hideNewsList.emit(true);
    this.newsListType.emit(
      e.target.parentElement.previousSibling.childNodes[0].innerText
    );
  }

  handleNewsItemClick(data: any) {
    this.hideNewsDetails.emit(data.id);
  }

  onPageChange(event: any) {
    this.currentPageSelected = event;
    const obj: any = {};

    obj.page = event;
    obj.list = this.listTitle;
    this.pageChanged.emit(obj);
  }
}

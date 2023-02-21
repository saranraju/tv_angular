import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WatchlistServiceService {
  $ispopUp = new EventEmitter();
  $newspopUp = new EventEmitter();
  $closenews = new EventEmitter();
  $sidebarrequest = new EventEmitter();
  $addcolunm = new EventEmitter();
  $showtablemodel = new EventEmitter();
  $showtabledata = new EventEmitter();
  $deletewatchlist = new EventEmitter();
  $watchlistNames = new EventEmitter();
  $showbothportfolio = new EventEmitter();
  addcolunmvalue: any = false;
  popupValue: any = false;
  closenewspopup: any = false;
  sidebarrequest: any = false;
  newspopup: any = false;
  istablemodel: any = false;
  constructor() {}

  openmodel(event: any) {
    // this.popupValue = true;
    this.$ispopUp.emit(event);
  }

  opennewsmodel() {
    this.newspopup = true;
    this.$newspopUp.emit(this.newspopup);
  }
  closenewsmodel() {
    this.closenewspopup = true;
    this.$closenews.emit(this.closenewspopup);
  }
  opensidebar() {
    this.sidebarrequest = true;
    this.$sidebarrequest.emit(this.sidebarrequest);
  }
  addcolunmmodel() {
    this.addcolunmvalue = true;
    this.$addcolunm.emit(this.addcolunmvalue);
  }
  tablemodel() {
    this.istablemodel = true;
    this.$showtablemodel.emit(this.istablemodel);
  }
  showtabledata(event: any) {
    var divId = event;
    this.$showtabledata.emit(divId);
  }
  deletewatchlist() {
    let isdelete = true;
    this.$deletewatchlist.emit(isdelete);
  }
  getWatchlistNames(event: any) {
    this.$watchlistNames.emit(event);
  }
  showPortfolio() {
    let show = true;
    this.$showbothportfolio.emit(show);
  }
}

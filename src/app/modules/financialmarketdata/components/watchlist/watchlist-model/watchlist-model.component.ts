import { Component, OnInit, ViewChild } from '@angular/core';
import { WatchlistServiceService } from '../watchlist-service.service';

@Component({
  selector: 'app-watchlist-model',
  templateUrl: './watchlist-model.component.html',
  styleUrls: ['./watchlist-model.component.scss'],
})
export class WatchlistModelComponent implements OnInit {
  displayStyle: any = 'none';
  buttonactive: any = 1;
  constructor(private watchlis_service: WatchlistServiceService) {}

  ngOnInit(): void {
    this.watchlis_service.$ispopUp.subscribe((res) => {
      if (res == 'import_watchlist') {
        this.openModel();
      }
    });
  }
  openModel() {
    this.displayStyle = 'block';
  }
  closePopup() {
    this.displayStyle = 'none';
  }
  buttons = [
    {
      id: 1,
      title: 'Company',
    },
    {
      id: 2,
      title: 'Fixed Income',
    },
  ];
  onButtonClick(e: any) {
    this.buttonactive = e;
  }
  watchlistArray = [
    {
      id: 1,
      title: 'Watchlist 1',
    },
    {
      id: 2,
      title: 'Watchlist 2',
    },
    {
      id: 3,
      title: 'Watchlist 3',
    },
  ];
  indexValue: any = [];
  onChecked(event: any, i: any) {
    if (event.target.checked == true) {
      for (let m = 0; m <= this.indexValue.length - 1; m++) {
        if (i != this.indexValue[m]) {
          this.indexValue.push(i);
        }
      }
      // if (i != this.indexValue[i]) {
      //   this.indexValue.push(i);
      // }
    } else {
      for (let n = 0; n <= this.indexValue[n]; n++) {
        if (i == this.indexValue[n]) {
          this.indexValue.splice(n, 1);
          console.log('after splice', this.indexValue);
        }
      }
    }
    console.log(this.indexValue);
  }
  @ViewChild('watchlistCheckBox') watchlistCheckBox: any;
  onSubmit(event: any) {
    this.watchlis_service.showPortfolio();
    for (let i = 0; i <= event.length; i++) {
      let tabName = event[i].title;
    }
  }
}

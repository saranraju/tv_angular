import { Component, OnInit } from '@angular/core';
import { WatchlistServiceService } from '../watchlist-service.service';

@Component({
  selector: 'app-delete-watchlist',
  templateUrl: './delete-watchlist.component.html',
  styleUrls: ['./delete-watchlist.component.scss']
})
export class DeleteWatchlistComponent implements OnInit {
  displayStyle: any="none";
  watchlist:any='';
  constructor(private service: WatchlistServiceService) { }

  ngOnInit(): void {
    this.service.$deletewatchlist.subscribe((res)=>
    {
      if(res==true)
      {
        this.displayStyle='block'
      }
    })
  }
  closePopup()
  {
    this.displayStyle='none'
  }
}

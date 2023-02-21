import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-country-sector-instrument',
  templateUrl: './country-sector-instrument.component.html',
  styleUrls: ['./country-sector-instrument.component.scss']
})
export class CountrySectorInstrumentComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  transactionRedirect() {
    this.router.navigateByUrl("financialmarketdata/transactions")
  }

}

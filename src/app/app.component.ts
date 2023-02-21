import { Component } from '@angular/core';
import { LoaderServiceService } from './modules/financialmarketdata/components/loader-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Televisory';
  showLoader: boolean = false;
  constructor(private loaderService: LoaderServiceService) {}

  ngOnInit() {
    this.loaderService.status.subscribe((val: boolean) => {
      this.showLoader = val;
    });
  }
}

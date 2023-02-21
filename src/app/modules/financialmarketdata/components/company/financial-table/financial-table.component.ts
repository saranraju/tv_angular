import { Component, Input, OnInit } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-financial-table',
  templateUrl: './financial-table.component.html',
  styleUrls: ['./financial-table.component.scss'],
})
export class FinancialTableComponent implements OnInit {
  @Input() table_data: any;
  @Input() header_data: any;
  @Input() type: any;
  @Input() currency: any;
  @Input() company_id: any;
  @Input() period: any;
  @Input() comapny_name: any;
  @Input() idName: any;
  @Input() isPrivateCompanyActive: any;
  @Input() industry: any;
  tabInstance: any;

  constructor(public util: UtilService, private router: Router) {}

  item: any;
  ngOnInit(): void {
    this.header_data.reverse();
  }

  redirectToInteractive(content: any) {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['financialmarketdata/interactive-analysis'], {
        queryParams: {
          currency: this.currency,
          filter2: content.fieldName,
          comparableList: this.company_id,
          periodcity: this.period,
          companyName: this.comapny_name,
          industry: this.industry,
          tabFrom: 'Company',
        },
      })
    );
    if (this.util.tabInstance != undefined) {
      this.util.tabInstance.close();
      this.util.tabInstance = window.open(url, '_blank');
    } else {
      this.util.tabInstance = window.open(url, '_blank');
    }
  }
}

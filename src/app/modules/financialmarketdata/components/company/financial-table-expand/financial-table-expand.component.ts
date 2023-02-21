import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-financial-table-expand',
  templateUrl: './financial-table-expand.component.html',
  styleUrls: ['./financial-table-expand.component.scss'],
})
export class FinancialTableExpandComponent implements OnInit {
  @Input() table_data: any;
  @Input() header_data: any;
  @Input() type: any;
  @Input() currency: any;
  @Input() financial_ratio_data: any;
  @Input() company_id: any;
  @Input() period: any;
  @Input() comapny_name: any;
  constructor(
    public auth: AuthService,
    public util: UtilService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  tableDialogClose() {
    this.auth.expandopenPopupfinance1 = false;
    this.auth.expandopenPopupfinance2 = false;
    this.auth.expandopenPopupfinance3 = false;
    this.auth.expandopenPopupfinance4 = false;
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

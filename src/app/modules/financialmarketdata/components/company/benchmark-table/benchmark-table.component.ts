import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-benchmark-table',
  templateUrl: './benchmark-table.component.html',
  styleUrls: ['./benchmark-table.component.scss'],
})
export class BenchmarkTableComponent implements OnInit, OnChanges {
  @Input() table_data: any;
  @Input() tempResDisplay: any = true;
  @Input() header_data: any;
  @Input() showadvance: any;
  @Input() enable_edit: any;
  @Input() currency: any;
  @Input() date: any;
  @Input() companyId: any;
  @Input() globalEntityId: any;
  @Input() isLoding: any;
  @Input() privateCompany_tab: any;
  @Input() isPrivateCompanyActive: any;
  @Input() company_country: any;
  @Input() benchMarkPrivateCompanyError: any;

  @Output() companyCode = new EventEmitter<any>();
  @Output() redirectToCompany = new EventEmitter<any>();

  companyDelisted: any = false;
  companyDelistedMsg: any = '';
  constructor(public util: UtilService) {}

  ngOnInit(): void {}

  ngOnChanges(): void {
    let sharePriceDate: any = new Date(this.date);
    let currentDate: any = new Date();
    let dateDiff: any =
      (currentDate.getFullYear() - sharePriceDate.getFullYear()) * 12;

    dateDiff > 24
      ? (this.companyDelisted = true)
      : (this.companyDelisted = false);

    this.companyDelistedMsg =
      'Company Delisted in ' +
      sharePriceDate.toLocaleString('default', { month: 'long' }) +
      ' ' +
      sharePriceDate.getFullYear();
  }

  sendcompanyData(e: any) {
    this.companyCode.emit(e);
  }

  redirect(e: any) {
    this.redirectToCompany.emit(e);
  }
}

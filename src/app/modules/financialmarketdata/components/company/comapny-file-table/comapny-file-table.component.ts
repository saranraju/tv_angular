import {
  Component,
  DoCheck,
  Input,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FinancialMarketDataService } from 'src/app/services/financialmarketdata.service';
import { UtilService } from 'src/app/services/util.service';
import { LoaderServiceService } from '../../loader-service.service';
import { saveAs } from 'file-saver';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AuthService } from 'src/app/services/auth/auth.service';
declare let $: any;

@Component({
  selector: 'app-comapny-file-table',
  templateUrl: './comapny-file-table.component.html',
  styleUrls: ['./comapny-file-table.component.scss'],
})
export class ComapnyFileTableComponent implements OnInit {
  @Input() table_data: any;
  @Input() header_data: any;
  @Input() mh: any;
  htmlSrc: SafeHtml = '';
  html: string = '';
  constructor(
    private loaderService: LoaderServiceService,
    private financialMarketData: FinancialMarketDataService,
    public util: UtilService,
    private domSanitizer: DomSanitizer,
    public auth: AuthService
  ) {}

  ngOnInit(): void {}

  total_count_res: any = 0;
  count_res: any = 0;
  view_pdf: any;
  data_heading: any = '';
  downloadProfile(key: any, detail: any, content: any) {
    this.loaderService.display(true);
    console.log(this.total_count_res, this.count_res);
    this.count_res = 0;
    this.total_count_res = 1;
    this.financialMarketData.getCompanyFileDownload(key).subscribe(
      (res: any) => {
        ++this.count_res;
        this.util.checkCountValue(this.total_count_res, this.count_res);
        this.data_heading = detail;
        if (res.body.type == 'application/pdf') {
          var file = new Blob([res.body], { type: 'application/pdf' });
          // saveAs(file);
          this.view_pdf = file;
          if (this.view_pdf) {
            this.auth.expandViewPdf = true;
          }
        } else {
          this.view_pdf = res.body;
          if (this.view_pdf) {
            this.auth.expandViewPdf = true;
          }
        }
      },
      (err) => {
        console.log('err', err.message);
      }
    );
  }
}

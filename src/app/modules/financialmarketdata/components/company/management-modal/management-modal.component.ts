import {
  Component,
  OnInit,
  Input,
  HostListener,
  OnChanges,
} from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FinancialMarketDataService } from 'src/app/services/financialmarketdata.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-manage-table',
  templateUrl: './management-modal.component.html',
  styleUrls: ['./management-modal.component.scss'],
})
export class ManagementModalComponent implements OnInit, OnChanges {
  @Input() table_data: any;
  @Input() mh: any;
  @Input() companyName: any;
  iconIndex: any = 0;
  shortDown: boolean = false;
  shortUp: boolean = false;
  constructor(
    public util: UtilService,
    private financialMarketData: FinancialMarketDataService,
    public auth: AuthService
  ) {}

  manage_info_data = {
    title: [
      {
        label: 'Management',
        key: 'income_state',
        width: '190px',
      },
      {
        label: 'Designation',
        key: 'twntyone',
        align: 'left',
        width: '355px',
      },
      {
        label: 'Exp.',
        key: 'twnty',
        align: 'left',
        width: '70px',
      },
      {
        label: 'Appointed',
        key: 'twntynineteen',
        align: 'left',
        width: '120px',
      },
      {
        label: 'Other Related Companies',
        key: 'twntyeighteen',
        align: 'left',
        width: '385px',
      },
    ],
  };
  ngOnInit(): void {
    // var keyVal = this.table_data.title[0].key;
    // this.table_data.value.sort(function (a: any, b: any) {
    //   var nameA = a[keyVal].toLowerCase(),
    //     nameB = b[keyVal].toLowerCase();
    //   if (nameA < nameB)
    //     //sort string ascending
    //     return -1;
    //   if (nameA > nameB) return 1;
    //   return 0; //default return value (no sorting)
    // });
  }
  showNoData: any = true;
  ngOnChanges(): void {
    if (this.table_data?.length === 0) {
      this.showNoData = true;
    } else {
      this.showNoData = false;
    }
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.auth.managehistoryModal = false;
    }
  }

  count_res: any = 0;
  total_count_res: any = '';
  employment_history: any = [];
  content_data: any = [];
  getpersoninfo(id: any, content: any) {
    this.count_res = 0;
    this.total_count_res = 3;
    this.util.loaderService.display(true);
    this.util.checkCountValue(this.total_count_res, this.count_res);
    this.content_data = content;
    this.financialMarketData.getEmploymentHistory(id).subscribe((res) => {
      ++this.count_res;
      this.auth.managehistoryModal = true;
      this.employment_history = res;
      this.getHoldingInfo(id);
      this.getDirectorInfo(id);
    });
  }

  holding_data: any = '';
  getHoldingInfo(id: any) {
    this.financialMarketData.getHoldingInfo(id).subscribe((res) => {
      ++this.count_res;
      this.util.checkCountValue(this.total_count_res, this.count_res);
      this.holding_data = res;
    });
  }

  directorship_data: any = '';
  getDirectorInfo(id: any) {
    this.financialMarketData.getDirectorInfo(id).subscribe((res) => {
      ++this.count_res;
      this.util.checkCountValue(this.total_count_res, this.count_res);
      this.directorship_data = res;
    });
  }
}

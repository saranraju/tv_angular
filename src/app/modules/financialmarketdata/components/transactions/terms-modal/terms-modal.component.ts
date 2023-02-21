import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-terms-modal',
  templateUrl: './terms-modal.component.html',
  styleUrls: ['./terms-modal.component.scss'],
})
export class TermsModalComponent implements OnInit {
  @Input() terms_synopsis_table: any;
  @Input() dealItem: any;
  @Input() dealTerms: any;
  @Input() selectedCurrency: any;
  @Input() showRevenueLTM: any;
  @Input() showEbitdaLTM: any;
  @Input() showPriceShare: any;
  @Input() showStockPriceShare: any;
  @Input() showOneDayPrem: any;
  @Input() showEVREV: any;
  @Input() showEVEBITDA: any;

  @Output() termsSynopsisExcelClick = new EventEmitter<any>();

  constructor(public auth: AuthService, public util: UtilService) {}

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.auth.openTermsModal = false;
    }
  }

  ngOnInit(): void {}

  transactionsTermsModalClose() {
    this.auth.openTermsModal = false;
  }

  handleTermsSynopsisExcelClick(ev: any) {
    this.termsSynopsisExcelClick.emit(ev);
  }
}

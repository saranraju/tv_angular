import {
  Component,
  OnInit,
  Input,
  OnChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-entity-details-modal',
  templateUrl: './entity-details-modal.component.html',
  styleUrls: ['./entity-details-modal.component.scss'],
})
export class EntityDetailsModalComponent implements OnInit, OnChanges {
  @Input() entityDetailsTableData: any;
  @Input() fundingRoundHeaderData: any;
  @Input() fundingRoundData: any;

  constructor(public auth: AuthService, public util: UtilService) {}

  ngOnInit(): void {}

  ngOnChanges(): void {
    if (this.fundingRoundData) {
      this.entityDetailsTableData.value = this.fundingRoundData;
    }
  }

  entityDetailsModalClick() {
    this.auth.openEntityDetailsModal = false;
  }

  @Output() pevcDetModal = new EventEmitter();
  handleDetPEVCModal(e: any) {
    this.pevcDetModal.emit(this.fundingRoundData);
  }
  @Output() investorNameSelected = new EventEmitter();
  handleinvestorNameSelected(e: any) {
    this.investorNameSelected.emit(e);
  }
  @Output() fundNameSelected = new EventEmitter();
  handlefundNameSelected(e: any) {
    this.fundNameSelected.emit(e);
  }
}

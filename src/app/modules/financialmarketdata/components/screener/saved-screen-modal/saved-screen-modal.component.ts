import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-saved-screen-modal',
  templateUrl: './saved-screen-modal.component.html',
  styleUrls: ['./saved-screen-modal.component.scss'],
})
export class SavedScreenModalComponent implements OnInit {
  @Input() savedScreen: any;
  @Output() savedScreenText = new EventEmitter<any>();
  @Output() savedScreenDeleteText = new EventEmitter<any>();
  @Output() confirmDeletion = new EventEmitter<any>();

  showCheckIcon: any = false;
  savedIndex: any = 0;
  selectedSavedScreenLocal: any;

  constructor(public auth: AuthService) {}

  ngOnInit(): void {}

  handleSavedScreenModalClick() {
    this.auth.showSavedScreensModal2 = false;
  }

  handleDeleteIconClick(data: any) {
    this.savedScreenDeleteText.emit(data);
    this.auth.showScreenDeletionModal = true;
  }

  handleSavedScreenItemClick(data: any, e: any) {
    if (e.target.classList[1] === 'saved-screen-list-item') {
      this.auth.showSavedScreensModal2 = false;
      this.savedScreenText.emit(data.screenName);
    }
  }

  handleConfirmDeletion(e: any) {
    this.confirmDeletion.emit(e);
  }
}

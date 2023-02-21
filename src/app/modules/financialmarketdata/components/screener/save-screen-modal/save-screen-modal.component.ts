import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-save-screen-modal',
  templateUrl: './save-screen-modal.component.html',
  styleUrls: ['./save-screen-modal.component.scss'],
})
export class SaveScreenModalComponent implements OnInit {
  @Input() savedScreen: any;
  @Output() selectedSavedScreen = new EventEmitter<any>();
  @Output() selectedSavedScreenInput = new EventEmitter<any>();

  savedIndex: any = 0;
  showCheckIcon: any = false;
  selectedSavedScreenLocal: any;
  selectedSavedScreenInputLocal: any = false;

  constructor(public auth: AuthService) {}

  ngOnInit(): void {}

  handleSavedScreensClick(i: any, content: any) {
    if (this.showCheckIcon && this.savedIndex === i) {
      this.showCheckIcon = false;
    } else {
      if (i === this.savedIndex) {
        if (this.showCheckIcon == false) {
          this.selectedSavedScreenLocal = content.screenName;
          this.showCheckIcon = true;
        } else {
          this.showCheckIcon = false;
        }
      } else {
        this.selectedSavedScreenLocal = content.screenName;
        this.savedIndex = i;
        this.showCheckIcon = true;
      }
    }
  }

  handleCancelBtnClick() {
    this.auth.showSavedScreensModal = false;
  }

  handleSaveBtnClick() {
    this.auth.showSavedScreensModal = false;
    this.selectedSavedScreen.emit(this.selectedSavedScreenLocal);
    this.selectedSavedScreenInput.emit(this.selectedSavedScreenInputLocal);
  }

  handleScreenNameInputChange(e: any) {
    this.selectedSavedScreenInputLocal = true;
    this.selectedSavedScreenLocal = e.target.value;
  }
}

import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-screen-deletion-modal',
  templateUrl: './screen-deletion-modal.component.html',
  styleUrls: ['./screen-deletion-modal.component.scss'],
})
export class ScreenDeletionModalComponent implements OnInit {
  @Output() confirmDeletion = new EventEmitter<any>();

  constructor(public auth: AuthService) {}

  ngOnInit(): void {}

  handleCancelBtnClick() {
    this.auth.showScreenDeletionModal = false;
  }

  handleDeleteBtnClick() {
    this.auth.showScreenDeletionModal = false;
    this.confirmDeletion.emit(true);
  }
}

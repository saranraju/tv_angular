import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-unavailable-explore-modal',
  templateUrl: './unavailable-explore-modal.component.html',
  styleUrls: ['./unavailable-explore-modal.component.scss'],
})
export class UnavailableExploreModalComponent implements OnInit {
  constructor(public auth: AuthService) {}

  ngOnInit(): void {}

  handleUnavailableExploreModalClick() {
    this.auth.openUnavailableExploreModal = false;
  }
}

import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-form-alert-model',
  templateUrl: './form-alert-model.component.html',
  styleUrls: ['./form-alert-model.component.scss'],
})
export class FormAlertModelComponent implements OnInit {
  @Input() alertmsg: any;
  @Input() type: any;

  constructor(public auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    console.log('type', this.type);
  }

  onCloseModal() {
    this.auth.closeInsidePopup = false;
    if (this.type === 'demoRequest') {
      this.router.navigate(['/login']);
    }
  }
}

import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-msg-model',
  templateUrl: './msg-model.component.html',
  styleUrls: ['./msg-model.component.scss'],
})
export class MsgModelComponent implements OnInit {
  @Input() alertmsg: any;

  constructor(public auth: AuthService) {}

  ngOnInit(): void {}
}

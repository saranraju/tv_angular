import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-instrument-char-model',
  templateUrl: './instrument-char-model.component.html',
  styleUrls: ['./instrument-char-model.component.scss'],
})
export class InstrumentCharModelComponent implements OnInit {
  @Input() modelInstrumentData: any;

  constructor(public auth: AuthService) {}

  ngOnInit(): void {}
}

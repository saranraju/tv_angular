import { Component, OnInit, Input } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-comparable-cds',
  templateUrl: './comparable-cds.component.html',
  styleUrls: ['./comparable-cds.component.scss'],
})
export class ComparableCdsComponent implements OnInit {
  @Input() table_data: any;
  @Input() mh: any;
  constructor(public util: UtilService) {}

  ngOnInit(): void {}
}

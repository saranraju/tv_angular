import { Component, Input, OnInit } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-segment-table',
  templateUrl: './segment-table.component.html',
  styleUrls: ['./segment-table.component.scss'],
})
export class SegmentTableComponent implements OnInit {
  @Input() table_data: any;
  @Input() header_data: any;
  @Input() currency: any;
  constructor(public util: UtilService) {}

  ngOnInit(): void {}
}

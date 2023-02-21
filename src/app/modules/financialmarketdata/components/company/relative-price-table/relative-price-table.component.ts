import { Component, Input, OnInit } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-relative-price-table',
  templateUrl: './relative-price-table.component.html',
  styleUrls: ['./relative-price-table.component.scss'],
})
export class RelativePriceTableComponent implements OnInit {
  @Input() table_data: any;
  @Input() header_data: any;
  constructor(public util: UtilService) {}

  ngOnInit(): void {}
}

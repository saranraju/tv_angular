import { Component, Input, OnInit } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-derivatives-table',
  templateUrl: './derivatives-table.component.html',
  styleUrls: ['./derivatives-table.component.scss'],
})
export class DerivativesTableComponent implements OnInit {
  @Input() tableData: any;
  @Input() showSettlementPrice: any;
  @Input() derivativesCurrency: any;

  constructor(public util: UtilService) {}

  ngOnInit(): void {}
}

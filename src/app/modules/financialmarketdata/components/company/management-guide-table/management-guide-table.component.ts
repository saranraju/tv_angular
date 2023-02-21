import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-management-guide-table',
  templateUrl: './management-guide-table.component.html',
  styleUrls: ['./management-guide-table.component.scss'],
})
export class ManagementGuideTableComponent implements OnInit, OnChanges {
  @Input() table_data: any;
  @Input() header_data: any;
  @Input() table: any;

  constructor(public util: UtilService) {}

  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges): void {
    this.header_data.reverse();
    this.table_data.sort((a: any, b: any) =>
      a.description.localeCompare(b.description)
    );
  }
}

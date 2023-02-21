import {
  Component,
  Input,
  OnChanges,
  OnInit,
  Pipe,
  PipeTransform,
} from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UtilService } from 'src/app/services/util.service';

@Pipe({ name: 'keys' })
export class KeysPipe implements PipeTransform {
  transform(value?: any, args?: string[]): any {
    let keys = ['Date'];
    let temp = [];
    for (let key in value) {
      if (key != 'Date') temp.push(key);
    }
    temp.sort();
    return [...keys, ...temp];
  }
}

@Component({
  selector: 'app-interactive-table',
  templateUrl: './interactive-table.component.html',
  styleUrls: ['./interactive-table.component.scss'],
})
export class InteractiveTableComponent implements OnInit, OnChanges {
  @Input() table_data: any;
  headerTitleCount: any = 0;
  iconIndex: any = 0;
  shortDown: boolean = false;
  shortUp: boolean = false;

  constructor(public util: UtilService, public auth: AuthService) {}

  ngOnInit(): void {}

  ngOnChanges(): void {}

  sortByKey(key: any, i: any) {
    this.table_data.forEach((element: any) => {
      this.iconIndex = i;
      this.shortDown = !this.shortDown;
      return element.sort((a: any, b: any) => {
        var x = a[key];
        var y = b[key];
        if (this.shortDown == false) {
          return x < y ? 1 : x > y ? -1 : 0;
        } else {
          return x < y ? -1 : x > y ? 1 : 0;
        }
      });
    });
  }
}

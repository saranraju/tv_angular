import {
  Component,
  DoCheck,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
@Component({
  selector: 'app-fx-matrix-modal',
  templateUrl: './fx-matrix-modal.component.html',
  styleUrls: ['./fx-matrix-modal.component.scss'],
})
export class FxMatrixModalComponent implements OnInit, DoCheck {
  constructor(public auth: AuthService) {}

  @Input() currency_data: any;
  @Output() onSelectedCurrencyData = new EventEmitter<any>();

  selected_currencies: any = [];

  ngOnInit(): void {}
  fxmatrixDialogClose() {
    this.auth.expandopendfxmatrix = false;
  }
  disableSaveBtn: any = false;
  ngDoCheck(): void {
    if (this.selected_currencies.length < 2) {
      this.disableSaveBtn = true;
    } else {
      this.disableSaveBtn = false;
    }
  }

  customMatrixName: any = '';
  onCurrencySelected(e: any, i: any) {
    if (this.selected_currencies.length < 7) {
      var index = this.selected_currencies.findIndex(
        (ele2: any) => ele2.key == e.key
      );
      if (index > -1) {
        this.selected_currencies.splice(index, 1);
        this.currency_data[i].selected = false;
      } else {
        this.selected_currencies.push(e);
        // this.allMetrices[data];
        this.currency_data[i].selected = true;
      }
    }
  }

  removeFromList(data: any, i: any) {
    var index = this.currency_data.findIndex(
      (ele2: any) => ele2.key == data.key
    );
    if (index > -1) {
      var index2 = this.selected_currencies.findIndex(
        (ele2: any) => ele2.key == data.key
      );
      this.selected_currencies.splice(index2, 1);
      this.currency_data[index].selected = false;
    }
  }

  onSelectedCurrency() {
    var obj: any = {};

    var currencyArray: any = [];
    this.selected_currencies.forEach((ele: any) => {
      currencyArray.push(ele.label);
    });
    obj.name = this.customMatrixName;
    obj.currencies = currencyArray;

    this.onSelectedCurrencyData.emit(obj);

    this.currency_data.map((el: any) => {
      el.selected = false;
    });
  }
}

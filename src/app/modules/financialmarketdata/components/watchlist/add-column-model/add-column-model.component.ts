import { Component, OnInit } from '@angular/core';
import { WatchlistServiceService } from '../watchlist-service.service';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  FormControl,
  Validators,
} from '@angular/forms';
@Component({
  selector: 'app-add-column-model',
  templateUrl: './add-column-model.component.html',
  styleUrls: ['./add-column-model.component.scss'],
})
export class AddColumnModelComponent implements OnInit {
  public displayStyle: any = 'none';
  public DataValue: any;
  public optionvalue: any;
  public orderForm: any;
  public items: any;
  Column_Name: any = 'Add column';
  coulmnValue: any = '';
  constructor(
    private service: WatchlistServiceService,
    private formbuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.service.$addcolunm.subscribe((res: any) => {
      if (res == true) {
        this.openmodel();
      }
    });
    this.optionvalue = {
      width: '300',
    };
    this.orderForm = new FormGroup({
      items: new FormArray([]),
    });
    this.DataValue = [
      {
        id: 1,
        text: 'Revenue',
      },
      {
        id: 2,
        text: 'FCF',
      },
      {
        id: 3,
        text: 'Current Maturity',
      },
      {
        id: 4,
        text: 'Debt/EBITDA',
      },
      {
        id: 5,
        text: 'Financial Viablity Period',
      },
    ];
  }

  openmodel() {
    this.displayStyle = 'block';
  }
  closePopup() {
    this.displayStyle = 'none';
    // this.service.closenewsmodel();
  }
  createItem(): FormGroup {
    return this.formbuilder.group({
      column_name: ['Selct Column'],
    });
  }
  close(index: any) {
    if (index >= 0) {
      this.items = this.orderForm.get('items') as FormArray;
      this.items.removeAt(index);
    }
  }
  addItem(): void {
    this.items = this.orderForm.get('items') as FormArray;
    this.items.push(this.createItem());
  }
  onvaluechange(id: any) {
    // this.coulmnValue=event;
    // if(id>=0){
    //   this.DataValue.splice(id,1);
    //   console.log(this.DataValue,"afterSplice")
    // }
  }
  onSubmit() {
    let body: any = [];
    this.orderForm.value.items.forEach((element: any) => {
      body.push({
        column_Id: element.column_name,
      });
    });
    console.log(body);
    this.displayStyle = 'none';
  }
}

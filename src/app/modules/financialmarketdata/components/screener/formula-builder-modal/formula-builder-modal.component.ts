import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FormControl } from '@angular/forms';
import {from, Observable} from 'rxjs';
import { map, startWith, filter, pluck } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-formula-builder-modal',
  templateUrl: './formula-builder-modal.component.html',
  styleUrls: ['./formula-builder-modal.component.scss'],
})
export class FormulaBuilderModalComponent implements OnInit {
  data: any = [];
  exp: any;
  formulaname: any;
  selectFormulaUnitData: any = [
    {
      id: 'Percentage',
      text: 'Percentage',
    },
    {
      id: 'Currency',
      text: 'Currency',
    },
    {
      id: 'Currency Millions',
      text: 'Currency Millions',
    },
    {
      id: 'X',
      text: 'X',
    },
  ];
  selectedFormulaUnit: any = '';
  constructor(public auth: AuthService,
    private http: HttpClient) {}

  hiddenCtrl = new FormControl();
  myControl = new FormControl();
  private fieldList: SuggestionDetails = { Name: Action.Field, Value: ['Market Capitalization', 'Market Capitalization/Sales', 'EBITA Margin', 'EBIT Margin','EBITA', 'EBIT', 'Net Income Margin', '+', '-', '*', '**', '/', '(', ')'], Valid: ['string'] };
  private operatorList: SuggestionDetails = { Name: Action.Operator, Value: ['+', '-', '*', '/', '(', ')'], Valid: ['string'] };
  private operator: string[] = this.operatorList.Value;

  private get field(): string[] {
    return this.fieldList.Value;
  }

  
  

  

  private searchList: SelectedOption[] = [];
  private get selectionList(): SelectionDict[] {
    return [
      { Name: Action.Field, Value: this.field, NextSelection: Action.Field}
    ];
  }

  filteredOptions!: Observable<string[]>;

  private defaultSelection: string = Action.Field;
  private currentEvent!: string;
  private response: ApiResponse[] = [];


  ngOnInit(): void {

    this.fieldList
    this.getSearchObject();
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );

  }

  handleCancelBtnClick() {
    this.auth.showFormulaBuilderModal = false;
  }

  handleSaveBtnClick() {
    this.auth.showFormulaBuilderModal = false;
  }

  getSearchObject(): void {
    // HTTP response
    var response = from([
      {
        "Result": {
          "DisplayName": "Market Capitalization",
          "SearchType": "Field",
          "AutoCompleteValues": [
            ""
          ]
        }
      },
      {
        "Result": {
          "DisplayName": "Market Capitalization/Sales",
          "SearchType": "Field",
          "AutoCompleteValues": [
            ""
          ]
        }
      },
      {
        "Result": {
          "DisplayName": "EBITA Margin",
          "SearchType": "Field",
          "AutoCompleteValues": [
            ""
          ]
        }
      },
      {
        "Result": {
          "DisplayName": "EBIT Margin",
          "SearchType": "Field",
          "AutoCompleteValues": [
            ""
          ]
        }
      },
      {
        "Result": {
          "DisplayName": "EBITA",
          "SearchType": "Field",
          "AutoCompleteValues": [
            ""
          ]
        }
      },
      {
        "Result": {
          "DisplayName": "EBIT",
          "SearchType": "Field",
          "AutoCompleteValues": [
            ""
          ]
        }
      },
      
      {
        "Result": {
          "DisplayName": "Net Income Margin",
          "SearchType": "Field",
          "AutoCompleteValues": [
            ""
          ]
        }
      },
      {
        "Result": {
          "DisplayName": "+",
          "SearchType": "Field",
          "AutoCompleteValues": [
            ""
          ]
        }
      },
      {
        "Result": {
          "DisplayName": "-",
          "SearchType": "Field",
          "AutoCompleteValues": [
            ""
          ]
        }
      },
      {
        "Result": {
          "DisplayName": "*",
          "SearchType": "Field",
          "AutoCompleteValues": [
            ""
          ]
        }
      },
      {
        "Result": {
          "DisplayName": "/",
          "SearchType": "Field",
          "AutoCompleteValues": [
            ""
          ]
        }
      },
      {
        "Result": {
          "DisplayName": "**",
          "SearchType": "Field",
          "AutoCompleteValues": [
            ""
          ]
        }
      },
      {
        "Result": {
          "DisplayName": "(",
          "SearchType": "Field",
          "AutoCompleteValues": [
            ""
          ]
        }
      },
      {
        "Result": {
          "DisplayName": ")",
          "SearchType": "Field",
          "AutoCompleteValues": [
            ""
          ]
        }
      }
    ]);

    response.subscribe(val => {
      this.response.push(val.Result);
      this.fieldList.Value = this.response.filter(r => r.SearchType == Action.Field).map<string>(r => r.DisplayName.toString());
      this.myControl.setValue(''); // trigger the autocomplete to populate new values
    })
    
  }

  _filter(value: string): string[] {
    let optionListToBePopulated: string[] = this.getOptionList();
    var searchText = this.getSearchText(value);
    return optionListToBePopulated.filter(option => option.toLowerCase().indexOf(searchText.toLowerCase().trim()) != -1);
  }
  
  onSubmit(name: any){
    console.log(name);
    if(name != ''){
      this.formulaname = name;
    for(var i of this.searchList){
this.data.push(i.Value)
    }
this.exp = this.data.join(' ');
if(this.exp != ''){
console.log(this.exp);
this.handleCancelBtnClick()
}
}
  }

  displayFn(value: string): string {
    if (!!value)
    
      this.searchList.push(new SelectedOption(value, this.currentEvent, this.getNextEvent(this.currentEvent)));
    return this.searchList.length > 0 ? this.searchList.map(s => s.Value).join(' ') : '';
  }

  private getOptionList(): string[] {
    if (this.searchList == null || this.searchList == undefined || this.searchList.length === 0) {
      this.currentEvent = this.defaultSelection;
      return this.field;
    }

    let lastElement: SelectedOption = <SelectedOption>this.searchList.slice(-1).pop();
    let currentList = this.selectionList.find(s => s.Name.toLowerCase() === lastElement.Next.toLowerCase());
    this.currentEvent = currentList ? currentList.Name : this.defaultSelection;
    return currentList ? this.getValues(currentList) : this.field;
  }

  private getValues(currentList: SelectionDict): string[] {
    if (this.currentEvent.toLowerCase() != 'value') return currentList.Value;
    var selectedField = this.getlastField();
    var selectedValue = selectedField ? selectedField.Value : ''
    var filteredResponse = this.response.find(r => r.DisplayName === selectedValue);
    return filteredResponse ? filteredResponse.AutoCompleteValues : [];
  }

  private getSearchText(value: string): string {
    var oldText = this.searchList.map(s => s.Value).join(' ');
    this.handleBackspace(value);
    return value.trim().replace(oldText, '');
  }
  
  private handleBackspace(searchValue: string): void {
    var oldText = this.searchList.map(s => s.Value).join(' ');
    var previousListName = this.searchList.length != 0 ? this.searchList[this.searchList.length - 1].PopulatedFrom : '';
    var prevList = this.selectionList.find(s => s.Name.toLowerCase() === previousListName.toLowerCase());
    var prevListValue = prevList ? prevList.Value : [];


    if (previousListName == Action.Value) {
      var lastField = this.getlastField();
      var lastFieldValue = lastField ? lastField.Value : '';
      var filteredResponse = this.response.find(r => r.DisplayName === lastFieldValue);
      prevListValue = filteredResponse ? filteredResponse.AutoCompleteValues : [];
    }

    if ((prevListValue ? prevListValue.indexOf(searchValue) === -1 : false) && oldText.trim().length > searchValue.trim().length)
      this.searchList.pop();
  }

  private getNextEvent(currentEvent: string): string {
    var currentList = this.selectionList.find(s => s.Name.toLowerCase() === currentEvent.toLowerCase());
    return currentList ? currentList.NextSelection : this.defaultSelection;
  }

  private getlastField(): SelectedOption | undefined {
    if (this.searchList.length === 0) return undefined;
    let i: number = this.searchList.length - 1;
    for (i; i >= 0; i--) {
      if (this.searchList[i].PopulatedFrom == Action.Field)
        return this.searchList[i];
    }
    return undefined;
  }
}

class SelectedOption {
  public Value: string;
  public PopulatedFrom: string;
  public Next: string;

  constructor(value: string, populatedFrom: string, next: string) {
    this.Value = value;
    this.PopulatedFrom = populatedFrom;
    this.Next = next;
  }
}

class SelectionDict {
  public Name!: string;
  public Value!: string[];
  public NextSelection!: string;
}

enum Action {
  Field = 'Field',
  Operator = 'Operator',
  Value = 'Value',
  Expression = 'Expression'
}
class SuggestionDetails {
  public Name!: string;
  public Valid!: string[];
  public Value!: string[];
}
class ApiResponse {
  public DisplayName!: string;
  public SearchType!: string;
  public AutoCompleteValues!: string[];
}

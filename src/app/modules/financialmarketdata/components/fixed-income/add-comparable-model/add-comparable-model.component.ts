import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FinancialMarketDataService } from 'src/app/services/financialmarketdata.service';

@Component({
  selector: 'app-add-comparable-model',
  templateUrl: './add-comparable-model.component.html',
  styleUrls: ['./add-comparable-model.component.scss'],
})
export class AddComparableModelComponent implements OnInit {
  instrumentLists: any = [];
  selectedinstrument: any = '';
  selectedLists: any = [];

  constructor(
    public auth: AuthService,
    private financialService: FinancialMarketDataService
  ) {}

  ngOnInit(): void {
    this.getComparableList();
    (document.querySelector('.selected-options') as any).style.display =
      'block';
    (document.querySelector('.list-of-options') as any).style.display = 'none';
  }

  nodeFilter(event: any) {
    let nodes = Array.from(event.srcElement.nextElementSibling.children);
    let value = event.target.value;
    nodes.forEach((element: any) => {
      if (element.innerText.toLowerCase().includes(value)) {
        element.style.display = 'block';
      } else {
        element.style.display = 'none';
        if (element.nextElementSibling != null) {
        }
      }
    });
  }

  disbleSelectedOption() {
    (document.querySelector('.selected-options') as any).style.display = 'none';
    (document.querySelector('.list-of-options') as any).style.display = 'block';
  }

  getComparableList() {
    let templateName: any = [];
    this.financialService.getComparableList().subscribe((res: any) => {
      res.forEach((element: any) => {
        templateName.push({
          id: element.id,
          text: element.instrument_name,
        });
        this.instrumentLists = templateName;
      });
    });
  }

  comparableClick(value: any) {
    (document.querySelector('.selected-options') as any).style.display =
      'block';
    (document.querySelector('.list-of-options') as any).style.display = 'none';

    if (!this.selectedLists.includes(value)) this.selectedLists.push(value);
  }

  removeComparableClick(value: any) {
    let index = this.selectedLists.indexOf(value);
    this.selectedLists.splice(index, 1);
  }
}

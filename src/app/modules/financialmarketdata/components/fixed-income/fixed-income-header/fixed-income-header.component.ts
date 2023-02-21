import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-fixed-income-header',
  templateUrl: './fixed-income-header.component.html',
  styleUrls: ['./fixed-income-header.component.scss']
})
export class FixedIncomeHeaderComponent implements OnInit {
  @Input() buttons: any;
  @Input() tablePagiantion: any;

  buttonactive:any = 1;
  pageActive:any =1;
  
  constructor(public auth: AuthService) {}

  ngOnInit(): void {}

  headerButtonFucntion(e:any){
  this.buttonactive = e
  }

  onPaginationClicked(e:any){
    this.pageActive = e
  }
}



import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { getYear } from 'date-fns';
import locale from 'date-fns/locale/en-US';
import { DatepickerOptions } from 'ng2-datepicker';

@Component({
  selector: 'app-fin-period-modal',
  templateUrl: './fin-period-modal.component.html',
  styleUrls: ['./fin-period-modal.component.scss'],
})
export class FinPeriodModalComponent implements OnInit {
  @Output() public sectionChange = new EventEmitter();
  @Input() period: any;
  @Input() fromFinDate: any;

  constructor(public fb: FormBuilder, public auth: AuthService) {}
  periodForm: FormGroup | any;
  // yearlyfromPeriod: any = new Date('2015-06-30');
  // querterlyfromPeriod: any = new Date('2020-06-30');
  toPeriod: any = new Date();
  minDate: any;

  options: DatepickerOptions = {
    placeholder: '', // placeholder in case date model is null | undefined, example: 'Please pick a date'
    format: 'yyyy-MM-dd', // date format to display in input
    formatTitle: 'yyyy-MM-dd',
    formatDays: 'EEEEE',
    firstCalendarDay: 0, // 0 - Sunday, 1 - Monday
    locale: locale, // date-fns locale
    position: 'bottom',
    inputClass: '', // custom input CSS class to be applied
    calendarClass: 'datepicker-default', // custom datepicker calendar CSS class to be applied
    scrollBarColor: '#dfe3e9', // in case you customize you theme, here you define scroll bar color
    // keyboardEvents: true // enable keyboard events
  };

  ngOnInit(): void {
    this.periodForm = this.fb.group({
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
    });

    this.minDate = new Date('01-01-1960');
    let timestamp3 = this.minDate.setDate(this.minDate.getDate() + 1);
    this.minDate = new Date(timestamp3).toISOString().slice(0, 10);
  }

  onDownloadClicked(valid: any, value: any) {
    if (valid) {
      this.sectionChange.emit(value);
    }
  }

  startDatetoggle(e: any) {
    e.stopPropagation();
    let elem: any = document.getElementById('startDateRef');
    elem.children[0]?.children[0].click();
  }

  endDatetoggle(e: any) {
    e.stopPropagation();
    let elem: any = document.getElementById('endDateRef');
    elem.children[0]?.children[0].click();
  }
}

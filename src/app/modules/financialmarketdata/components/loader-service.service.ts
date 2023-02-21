import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
//   {
//   providedIn: 'root',
// }
export class LoaderServiceService {
  // constructor() {}
  public status: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public tutorialStatus: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  display(value: boolean) {
    this.status.next(value);
  }

  showTutorial(value: boolean) {
    this.tutorialStatus.next(value);
  }
}

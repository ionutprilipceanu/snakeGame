import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',

  styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent {
  // @Input() receivedData: string;

  name: string;
  storedNames: any = [];
  constructor() {
    this.storedNames = Object.keys(sessionStorage)
      .filter((key) => key.startsWith('name-'))
      .map((key) => sessionStorage.getItem(key));
  }

  saveName() {
    if (this.name) {
      const key = `name-${new Date().getTime()}`;
      sessionStorage.setItem(key, this.name);
      this.storedNames.push(this.name);
      this.name = '';
    }
  }

  clearSessionStorage() {
    sessionStorage.clear();
    window.location.reload();
  }
}

import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable()
export class UiService {

  constructor(private snackBar: MatSnackBar) {}

  showSnackbar(message, action, duration): void {
    this.snackBar.open(message, action, {
      duration: duration
    });
  }
}

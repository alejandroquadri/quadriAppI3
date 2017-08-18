import { Injectable} from '@angular/core';
import { Platform } from 'ionic-angular';

@Injectable()
export class SplitShowProvider {

	show = true;

	constructor(
		private platform: Platform
	) {}

	showChange() {
		this.show = !this.show;
	}

	shouldShow(){
    let width;
    if (this.platform.width() > 1200) {
      width = true;
    } else {
      width = false;
    }
    return width && this.show;
  }

  showMenuToggle() {
  	let width;
    if (this.platform.width() > 1200) {
      width = true;
    } else {
      width = false;
    }
    return !width
  }

}

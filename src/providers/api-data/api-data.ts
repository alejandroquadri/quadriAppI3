import { Injectable } from '@angular/core';

import { AngularFireDatabase} from 'angularfire2/database';
import * as firebase from 'firebase/app';

@Injectable()
export class ApiDataProvider {

  constructor(
  	public db: AngularFireDatabase
	) {}

	getObject(path:string) {
		return this.db.object(path);
	}

	setObject(path: string, form: any): firebase.Promise<void> {
		return this.db.object(`${path}`).set(form);
	}

	updateObject(path: string, form: any): firebase.Promise<void> {
		return this.db.object(`${path}`).update(form);
	}

	deleteObject(path: string): firebase.Promise<void> {
		return this.db.object(`${path}`).remove();
	}

	getList(path:string) {
		return this.db.list(path);
	}

	push(path: string, form: any): firebase.Promise<void> {
		return this.db.list(`${path}`).push(form);
	}

	updateList(path: string, key:string, form: any): firebase.Promise<void> {
		return this.db.list(`${path}`).update(key, form);
	}

	removeItemList(path: string, key?: string): firebase.Promise<void> {
		if (key) {
			return this.db.list(`${path}`).remove(key);
		} else {
			return this.db.list(`${path}`).remove();			
		}
	}
	
}

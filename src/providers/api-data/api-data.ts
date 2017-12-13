import { Injectable } from '@angular/core';

import { AngularFireDatabase} from 'angularfire2/database';
import * as firebase from 'firebase';

@Injectable()
export class ApiDataProvider {

  constructor(
  	public db: AngularFireDatabase
	) {}

	getObject(path:string) {
		return this.db.object(path).valueChanges();
	}

	setObject(path: string, form: any): Promise<void> {
		return this.db.object(`${path}`).set(form);
	}

	updateObject(path: string, form: any): Promise<void> {
		return this.db.object(`${path}`).update(form);
	}

	deleteObject(path: string): Promise<void> {
		return this.db.object(`${path}`).remove();
	}

	getList(path:string) {
		return this.db.list(path).valueChanges();
	}

	getListMeta(path:string, events?) {
		return this.db.list(path).snapshotChanges(events);
	}

	push(path: string, form: any): firebase.database.ThenableReference {
		return this.db.list(`${path}`).push(form);
	}

	updateList(path: string, key:string, form: any): Promise<void> {
		return this.db.list(`${path}`).update(key, form);
	}

	removeItemList(path: string, key?: string): Promise<void> {
		if (key) {
			return this.db.list(`${path}`).remove(key);
		} else {
			return this.db.list(`${path}`).remove();			
		}
	}

	getNewKey(): string {
		return firebase.database().ref().push().key;
	}

	timestamp(): Object {
		return firebase.database.ServerValue.TIMESTAMP;
	}

  fanUpdate(fanObject: any): Promise <any> {
  	return firebase.database().ref().update(fanObject);
  }

  fanOutObject (updateForm: any, paths: Array<string>, key: boolean) {
    const fanObject = {}
    const updateFormKeys = Object.keys(updateForm);
    if (key) {
    	const newKey = this.getNewKey();
    	paths.forEach( path => {
	      updateFormKeys.forEach( updateKey => {
	        fanObject[`${path}/${newKey}/${updateKey}`] = updateForm[updateKey]
	      })
	    })
    } else {
    	paths.forEach( path => {
	      updateFormKeys.forEach( updateKey => {
	        fanObject[`${path}/${updateKey}`] = updateForm[updateKey]
	      })
	    })
    }
    return fanObject;
  }
	
}

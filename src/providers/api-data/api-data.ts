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

	getNewKey(path?: string): string {
		if (path) {
			return firebase.database().ref().child(path).push().key;
		} else {
			return firebase.database().ref().push().key;
		}
	}

	timestamp(): Object {
		return firebase.database.ServerValue.TIMESTAMP;
	}

  fanUpdate(fanObject: any): Promise <any> {
  	return firebase.database().ref().update(fanObject);
  }

	  // esta funcion sirve para armar un objeto el cual pueda ser usado por 
  	// fanUpdate() para actualizar de forma masiva multiples direcciones en firebase.
  	// updateForm es el objeto a actualizar. 
  	// paths es un array de strings con cada una de las direcciones donde se va a actualizar 
  	// key es un boolean, true para guardar en una lista, false para guardarlo como objeto
  	// la funcion maneja bien subojetos de hasta 1 subnivel
  fanOutObject (updateForm: any, paths: Array<string>, key: boolean) {
    const fanObject = {}
    const updateFormKeys = Object.keys(updateForm);
    if (key) {
    	const newKey = this.getNewKey();
    	paths.forEach( path => {
    		if (typeof updateForm === 'string') {
    			fanObject[`${path}/${newKey}`] = updateForm;
    		} else {
    			updateFormKeys.forEach( updateKey => {
		      	if (typeof updateForm[updateKey] === 'object') {
		      		const subObjKeys = Object.keys(updateForm[updateKey]);
		      		subObjKeys.forEach( subObjKey => {
		      			fanObject[`${path}/${newKey}/${updateKey}/${subObjKey}`] = updateForm[updateKey][subObjKey];
		      		})
		      	} else {
		      		fanObject[`${path}/${newKey}/${updateKey}`] = updateForm[updateKey];
		      	}
		        
		      })
    		}
	    })
    } else {
    	paths.forEach( path => {
    		if (typeof updateForm === 'string') {
    			fanObject[`${path}`] = updateForm;
    		} else {
    			updateFormKeys.forEach( updateKey => {
		      	if(typeof updateForm[updateKey] === 'object') {
		      		const subObjKeys = Object.keys(updateForm[updateKey]);
		      		subObjKeys.forEach( subObjKey => {
		      			fanObject[`${path}/${updateKey}/${subObjKey}`] = updateForm[updateKey][subObjKey];
		      		})
		      	} else {
		      		fanObject[`${path}/${updateKey}`] = updateForm[updateKey]
		      	}
		      })
    		}
	    })
    }
    return fanObject;
  }
	
}

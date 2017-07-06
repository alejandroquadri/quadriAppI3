import { Injectable } from '@angular/core';

import { AngularFireDatabase} from 'angularfire2/database';
import * as firebase from 'firebase';

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

	updateFan(form, paths: Array<any>): firebase.Promise<any> {
		// este metodo usa el firebase JS SDK
		// form es el objeto con la propiedad que quiero actrualizar
		// paths es un array con los paths donde esta el objeto que quiero actualizar
		// si fuera una lista el path deberia contener el id del del objeto en dicha lista
		// abajo el ejemplo de lo como actualizaba el profile en la dietApp
		// const paths = [
    //   `userProfile/${this.authData.fireAuth.uid}`,
    //   `coachPatients/${this.current.coach}/${this.authData.fireAuth.uid}`
    // ] ;
    const root = firebase.database().ref();
    const updates = this.fanOutObject(form, paths )
    return root.update(updates);
  }

  private fanOutObject (updateForm: any, paths: Array<string>) {
    const fanObject = {}
    const updateFormKeys = Object.keys(updateForm);
    paths.forEach( path => {
      updateFormKeys.forEach( updateKey => {
        fanObject[`${path}/${updateKey}`] = updateForm[updateKey]
      })
    })
    console.log(fanObject);
    return fanObject;
  }
	
}

import { Component} from '@angular/core';
import { IonicPage, ToastController} from 'ionic-angular';
import { AuthDataProvider } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-prod-metrics',
  templateUrl: 'prod-metrics.html',
})
export class ProdMetricsPage {

  constructor(
    private authData: AuthDataProvider,
    public toastCtrl: ToastController
  ) {}

  ngOnInit() {
		// listen to the service worker promise in index.html to see if there has been a new update.
		// condition: the service-worker.js needs to have some kind of change - e.g. increment CACHE_VERSION.
		window['isUpdateAvailable']
			.then(isAvailable => {
				if (isAvailable) {
          console.log('available');
					const toast = this.toastCtrl.create({
						message: 'Nueva version Disponible! Recargar para ver cambios',
						position: 'bottom',
						showCloseButton: true
					});
					toast.present();
				}
			});
	}

  permission(area: string) {
    return this.authData.checkRestriction(area);
  }

}

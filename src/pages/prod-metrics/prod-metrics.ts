import { Component} from '@angular/core';
import { IonicPage, ToastController} from 'ionic-angular';
import { AuthDataProvider } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-prod-metrics',
  templateUrl: 'prod-metrics.html',
})
export class ProdMetricsPage {
	
	acProdChart = true;
	prodChart = true;
	stockchart = true;
	acSalesChart = true;
	size = 3;

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
						message: 'Nueva version disponible! Recargar para instalar nueva version',
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
	
	expandView (chart: string) {
		this.size = 2;
		switch (chart) {
			case 'acProd':
					this.acProdChart = true;
					this.prodChart = false;
					this.stockchart = false;
					this.acSalesChart = false;
			break;
			
			case 'acSales':
				this.acProdChart = false;
				this.prodChart = false;
				this.stockchart = false;
				this.acSalesChart = true;
			break;

			case 'prod':
				this.acProdChart = false;
				this.prodChart = true;
				this.stockchart = false;
				this.acSalesChart = false;
				break;

			case 'stock':
				this.acProdChart = false;
				this.prodChart = false;
				this.stockchart = true;
				this.acSalesChart = false;
			break;
		
			default:
				break;
		}
	}

	contractView() {
		this.size = 3;
		this.acProdChart = true;
		this.prodChart = true;
		this.stockchart = true;
		this.acSalesChart = true;
	}

}

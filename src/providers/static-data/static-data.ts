import { Injectable } from '@angular/core';

@Injectable()
export class StaticDataProvider {

	items = [
		'',
    'Disco de corte',
    'Disco de desbaste',
    'Arandela plana',
    'Arandela Schnoor',
    'Tuerca',
    'Tornillo cabeza Allen',
    'Tornillo cabeza frezada',
    'Tornillo cabeza hexagonal',
    'Gusano',
    'Abrazadera',
    'Varilla Roscada',
    'Tela Esmaril',
    'WD 40',
    'Penetrit',
    'Acople Rapido',
    'Valvula',
    'Reten / O-ring / Guarnición / Guardapolvo',
    'Aro seeger',
    'Contactor',
    'Otro',
    'Chapa',
    'Hierro',
    'Aceite',
    'Limite de carrera',
    'Motor',
    'Sello',
    'Herramienta',
    'Cadenas',
    'Correas',
    'Rodamiento',
    'Repuestos Electricos',
    'Relé',
    'Neumática (conectores, tubos, etc)',
    'Hidráulica',
    'Filtros aire/aceite',
    'Repuestos broncería (llaves esféricas, teflón, caños )',
    'Corona',
    'Piñon',
    'Tornería',
    'Manguera',
    'Silastic cartucho',
    'Cable eléctrico',
    'Cable de acero',
    'Prensa cable',
    'Lámpara',
    'Pintura',
    'Pinceles',
    'Cinta aisladora'
  ];

    maquinas = [
    	'',
      '995',
      '650',
      'Autoelevadores',
      'Breton',
      'Lineal',
      'Taller',
      'Centrifuga',
      'Biseladora',
      'Elba',
      'Desbañadora',
      'Cortadora',
      'Otro',
      'Cargador',
      'Granalladora',
      'Cintas'
    ];

    unidades = [
	    '',
      'litros',
      'ml',
      'unidad',
      'm2',
      'juego',
      'kg'
    ];

    tipoStatus = ['Pendiente','Encargado','Completo','Suspendido'];

    color = [
      'Blanco',
      'Botichino',
      'Brechiato',
      'Gris Perla',
      'Verde Alpe',
      'Sierra Chica'
    ]

    dim = [
      '40x40',
      '60x40',
      '50x50',
      '10x40',
      '10x40',
      '10x50',
      '10x60'
    ]

    drawing = [
      'liso',
      'loseta',
      '64 panes',
      '64 tapones',
      'tresbolillo',
      'adoquin curvo'
    ]

  constructor() {
    console.log('Hello StaticDataProvider Provider');
  }



}

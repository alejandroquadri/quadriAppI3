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
    'Biseladora zocalos',
    'Elba',
    'Desbañadora',
    'Cortadora',
    'Otro',
    'Cargador',
    'Granalladora',
    'Cintas',
    'Moldes',
  ];

  maquinasProd = [
    '',
    '995',
    '650',
    'Breton',
    'Lineal',
    'Biseladora',
    'Desbañadora',
    'Cortadora',
    'Granalladora',
    'Llenado moldes',
    'Desmolde',
    'Pasado tablas',
    'Biseladora zocalos',
    'Pastinas'
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
    'Sierra Chica',
    'Ocre',
    'Cemento'
  ];

  colorProductos = {
    mosaicos : [
      'Blanco',
      'Botichino',
      'Brechiato',
      'Gris Perla',
      'Verde Alpe',
      'Sierra Chica',
      'Ocre',
      'Cemento'
    ],
    pastinas : [
      'Gris',
      'Marfil',
      'Napoleon',
      'Blanco',
      'Rojo',
      'Negro'
    ]
  };

  dim = [
    '40x40',
    '60x40',
    '50x50',
    '10x40',
    '10x50'
  ];

  dimProductos = {
    mosaicos: [
      '40x40',
      '60x40',
      '50x50',
      '10x40',
      '10x50'
    ],
    pastinas: [
      'bolsa 20kg'
    ]
  };

  equivalences = {
    '40x40': {conv:0.16, unit:'m2', convMl: 0.4},
    '60x40': {conv:0.24, unit:'m2', convMl: 0.6},
    '50x50': {conv:0.25, unit:'m2', convMl: 0.5},
    '10x40': {conv:0.4, unit:'ml'},
    '10x50': {conv:0.5, unit:'ml'}
  }

  drawing = [
    'liso',
    'loseta',
    '64 panes',
    '64 tapones',
    'tresbolillo',
    'adoquin curvo',
    'pileta',
    'rusticato'
  ];

  premioProd = {
    factorM2: 12,
    factorMl: 2.4
  }

  prodNominal = {
    '650': {
      turno: 11,
      paradas: 0,
      almuerzo: 0,
      vel: {
        '40x40': 12.3,
        '60x40': 14,
        '50x50': 14
      },
      q_placas: 1,
      u_vel: 'seg x placa'
    },
    '995': {
      turno: 8,
      paradas: 0,
      almuerzo: 0,
      vel: {
        '40x40': 12.3,
        '60x40': 14,
        '50x50': 14
      },
      q_placas: 2,
      u_vel: 'seg x placa'
    },
    'Breton': {
      turno: 8,
      paradas: 0,
      almuerzo: 30,
      vel: {
        '40x40': 2.4,
        '60x40': 2.4,
        '50x50': 2.4
      },
      q_placas: 1,
      u_vel: 'ml/min'
    }
  }

  nominalCalc(mach, dim, takt, turno: number, almuerzo: number, paradas: number) {
    if( takt !== 0) {
      let prodTime = (turno * 60 - almuerzo - paradas) * 60;
      let eq = this.equivalences[dim].conv
      if (mach === 'Breton') {
        takt = 60 / (takt / this.equivalences[dim].convMl);
      }
      let prod = prodTime / takt;
      return prod * eq;
    }
  }

}

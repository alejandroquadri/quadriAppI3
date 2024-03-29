// /**
//  * Check out https://googlechrome.github.io/sw-toolbox/ for
//  * more info on how to use sw-toolbox to custom configure your service worker.
//  */


// 'use strict';
// importScripts('./build/sw-toolbox.js');

// self.toolbox.options.cache = {
//   name: 'ionic-cache'
// };

// // pre-cache our key assets
// self.toolbox.precache(
//   [
//     './build/main.js',
//     './build/main.css',
//     './build/polyfills.js',
//     'index.html',
//     'manifest.json'
//   ]
// );

// // dynamically cache any other local assets
// // self.toolbox.router.any('/*', self.toolbox.cacheFirst);
// self.toolbox.router.any('/*', self.toolbox.networkFirst);

// // for any other requests go to the network, cache,
// // and then only use that cached resource if your user goes offline
// self.toolbox.router.default = self.toolbox.networkFirst;

/**
 * Check out https://googlechrome.github.io/sw-toolbox/docs/master/index.html for
 * more info on how to use sw-toolbox to custom configure your service worker.
 */

'use strict';
importScripts('./build/sw-toolbox.js');

self.toolbox.options.cache = {
	name: 'quadri-cache'
};

// const CACHE_VERSION = 20;

// dynamically cache any other local assets
self.toolbox.router.get('/(.*)', self.toolbox.cacheFirst, {
	origin: /fonts\.googleapis\.com$/
});
self.toolbox.router.get('assets/*', self.toolbox.cacheFirst);
self.toolbox.router.get('build/*', self.toolbox.fastest);
self.toolbox.router.get('/', self.toolbox.fastest);
self.toolbox.router.get('manifest.json', self.toolbox.fastest);
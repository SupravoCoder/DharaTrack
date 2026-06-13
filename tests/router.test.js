import { initRouter, navigateTo } from '../js/router.js';

export const routerTests = {
  name: 'Router Tests',
  tests: [
    {
      name: 'navigateTo should update location hash',
      fn: () => {
        navigateTo('/test-route');
        if (window.location.hash !== '#/test-route') throw new Error(`Hash mismatch: ${window.location.hash}`);
      }
    }
  ]
};

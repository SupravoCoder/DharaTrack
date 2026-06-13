import { $, createElement, clearChildren, setHTML } from '../js/utils/dom.js';

export const domTests = {
  name: 'DOM Utility Tests',
  tests: [
    {
      name: 'createElement should create an element with attributes and children',
      fn: () => {
        const el = createElement('div', { id: 'test-id', className: 'test-class' }, 'Hello');
        if (el.tagName !== 'DIV') throw new Error('Wrong tag');
        if (el.id !== 'test-id') throw new Error('Wrong id');
        if (el.className !== 'test-class') throw new Error('Wrong class');
        if (el.textContent !== 'Hello') throw new Error('Wrong text');
      }
    },
    {
      name: 'clearChildren should remove all child nodes',
      fn: () => {
        const el = document.createElement('div');
        el.appendChild(document.createElement('span'));
        clearChildren(el);
        if (el.childNodes.length !== 0) throw new Error('Children not cleared');
      }
    },
    {
      name: 'setHTML should sanitize output if DOMPurify is available',
      fn: () => {
        const el = document.createElement('div');
        // If DOMPurify is missing, it will just use innerHTML directly, which is the fallback.
        setHTML(el, '<b>Bold</b><script>alert(1)</script>');
        if (window.DOMPurify) {
          if (el.innerHTML.includes('<script>')) throw new Error('DOMPurify failed to sanitize script tag');
        } else {
          // If no DOMPurify, it should at least set the HTML
          if (!el.innerHTML.includes('Bold')) throw new Error('setHTML fallback failed');
        }
      }
    }
  ]
};

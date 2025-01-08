import { Node, mergeAttributes } from '@tiptap/core';
import { MathJax } from 'mathjax-react';

export const MathNode = Node.create({
  name: 'math',
  group: 'inline',
  atom: true,
  inline: true,

  addAttributes() {
    return {
      formula: {
        default: '',
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'math-inline',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['math-inline', mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ({ node }) => {
      const dom = document.createElement('span');
      dom.style.display = 'inline-block';
      dom.style.verticalAlign = 'middle';

      const formula = node.attrs.formula;
      if (formula) {
        const mathJax = document.createElement('span');
        mathJax.innerHTML = `\\(${formula}\\)`;
        dom.appendChild(mathJax);
        // Trigger MathJax rendering
        // @ts-ignore
        if (window.MathJax) {
          // @ts-ignore
          window.MathJax.typeset([mathJax]);
        }
      }

      return {
        dom,
        update: (node) => {
          if (node.attrs.formula !== formula) {
            dom.innerHTML = `\\(${node.attrs.formula}\\)`;
            // @ts-ignore
            if (window.MathJax) {
              // @ts-ignore
              window.MathJax.typeset([dom]);
            }
          }
          return true;
        },
      };
    };
  },
});

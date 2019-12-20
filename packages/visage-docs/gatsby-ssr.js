import { renderStylesToString } from 'emotion-server';
import React from 'react';
import { renderToString } from 'react-dom/server';

export { wrapRootElement } from './src';

export function replaceRenderer({ bodyComponent, replaceBodyHTMLString }) {
  const bodyHTML = renderStylesToString(renderToString(bodyComponent));

  replaceBodyHTMLString(bodyHTML);
}

export function onRenderBody({ setHeadComponents }) {
  const offsetY = 0;
  const script = `
    document.addEventListener("DOMContentLoaded", function(event) {
      var hash = window.decodeURI(location.hash.replace('#', ''))
      if (hash !== '') {
        var element = document.getElementById(hash)
        if (element) {
          var offset = element.offsetTop
          // Wait for the browser to finish rendering before scrolling.
          setTimeout((function() {
            window.scrollTo(0, offset - ${offsetY})
          }), 0)
        }
      }
    })
  `;

  return setHeadComponents([
    <script
      key="gatsby-remark-autolink-headers-script"
      dangerouslySetInnerHTML={{ __html: script }}
    />,
  ]);
}

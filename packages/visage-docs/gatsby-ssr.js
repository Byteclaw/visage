import { renderStylesToString } from 'emotion-server';
import { renderToString } from 'react-dom/server';

export { wrapRootElement } from './src';

export function replaceRenderer({ bodyComponent, replaceBodyHTMLString }) {
  const bodyHTML = renderStylesToString(renderToString(bodyComponent));

  replaceBodyHTMLString(bodyHTML);
}

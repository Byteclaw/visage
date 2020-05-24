// import ReactDOM from 'react-dom';

export { wrapRootElement, wrapPageElement } from './src';

let offsetY = 0;

const getTargetOffset = hash => {
  const id = window.decodeURI(hash.replace(`#`, ``));
  if (id !== ``) {
    const element = document.getElementById(id);
    if (element) {
      return element.offsetTop - offsetY;
    }
  }
  return null;
};

export const onInitialClientRender = (_, pluginOptions) => {
  if (pluginOptions.offsetY) {
    offsetY = pluginOptions.offsetY;
  }

  requestAnimationFrame(() => {
    const offset = getTargetOffset(window.location.hash);
    if (offset !== null) {
      window.scrollTo(0, offset);
    }
  });
};

export const shouldUpdateScroll = ({ routerProps: { location } }) => {
  const offset = getTargetOffset(location.hash);
  return offset !== null ? [0, offset] : true;
};

/* export const replaceHydrateFunction = () => {
  return (element, container, callback) => {
    // replace hydrate with render because hydrate does not pick up
    // dark theme settings and causes weird render where Sidebar is white
    // but the rest of page is dark
    // see https://reactjs.org/docs/react-dom.html#hydrate
    ReactDOM.render(element, container, callback);
  };
}; */

import { ComponentType } from 'react';

declare module '*.svg' {
  const ReactComponent: ComponentType<JSX.IntrinsicElements['svg']>;

  export { ReactComponent };
}

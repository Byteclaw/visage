import { ReactNode, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';

interface IProps {
  children: ReactNode;
  containerId: string;
  removeOnUnmount: boolean;
}

export function Portal(props: IProps) {
  const { containerId, children, removeOnUnmount } = props;

  const portalContainer: null | HTMLDivElement = useMemo(() => {
    if (typeof document !== 'undefined') {
      let el = document.getElementById(props.containerId);

      if (el != null) {
        return el as HTMLDivElement;
      }

      el = document.createElement('div');

      el.id = containerId;

      document.body.appendChild(el);

      return el as HTMLDivElement;
    }

    return null;
  }, [true]);

  useEffect(
    () => () => {
      if (removeOnUnmount && portalContainer) {
        document.body.removeChild(portalContainer);
      }
    },
    [],
  );

  if (portalContainer == null) {
    return null;
  }

  return createPortal(children, portalContainer);
}

Portal.defaultProps = {
  containerId: 'portal-root',
  removeOnUnmount: true,
};

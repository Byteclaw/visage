import React, {
  ReactNode,
  useEffect,
  MouseEvent as IMouseEvent,
  useMemo,
  useContext,
} from 'react';
import { VisageComponent } from '@byteclaw/visage-core';
import { StyleProps } from '../createNPointTheme';
import { Fixed } from './Fixed';
import { LayerManager, LayerManagerContext } from './LayerManager';
import { Overlay } from './Overlay';
import { Portal } from './Portal';

const transforms = {
  bottom: 'translateY(100%)',
  left: 'translateX(-100%)',
  right: 'translateX(100%)',
  top: 'translateY(-100%)',
};

interface DrawerBaseProps {
  children: ReactNode;
  onClick?: (e: MouseEvent) => void;
  open: boolean;
  side: keyof (typeof transforms);
}

const getSide = ({
  side: toSide,
}: {
  side: keyof (typeof transforms);
}): {
  bottom: null | number;
  left: null | number;
  right: null | number;
  top: null | number;
} => {
  if (!transforms[toSide]) {
    return {
      bottom: 0,
      left: 0,
      right: null,
      top: 0,
    };
  }
  const top = /^(top|left|right)$/.test(toSide) ? 0 : null;
  const bottom = /^(bottom|left|right)$/.test(toSide) ? 0 : null;
  const left = /^(left|top|bottom)$/.test(toSide) ? 0 : null;
  const right = /^(right|top|bottom)$/.test(toSide) ? 0 : null;

  return {
    bottom,
    left,
    right,
    top,
  };
};

const transform = ({
  open,
  side: toSide,
}: {
  open: boolean;
  side: keyof (typeof transforms);
}) => ({
  transform: open ? null : transforms[toSide] || transforms.left,
});

interface DrawerProps extends DrawerBaseProps {
  containerId: string;
  onClose?: (e: Event) => void;
  overlayContainerId: string;
  overlayed: boolean;
  overlayProps?: object;
}

export const Drawer: VisageComponent<
  DrawerProps,
  StyleProps
> = function Drawer({
  containerId = 'drawer-root',
  onClick,
  onClose,
  open = false,
  overlayContainerId = 'drawer-overlay-root',
  overlayProps = false,
  overlayed = false,
  side = 'left',
  styles,
  zIndex: BASE_DRAWER_ZINDEX,
  ...rest
}: any) {
  const zIndex = useContext(LayerManagerContext);

  const allOverlayProps = {
    zIndex: Number(BASE_DRAWER_ZINDEX) - 1,
    ...(overlayProps || {}),
  };

  function handleDocumentClick(e: MouseEvent) {
    if (onClose) {
      onClose(e);
    }
  }

  function handleEscKey(e: KeyboardEvent) {
    if (onClose && e.keyCode === 27) {
      onClose(e);
    }
  }

  function handleClickPropagation(e: IMouseEvent<Element, MouseEvent>) {
    return e.stopPropagation();
  }

  useEffect(() => {
    if (onClose != null) {
      document.addEventListener('keyup', handleEscKey);
      document.addEventListener('click', handleDocumentClick);
    }

    return () => {
      document.removeEventListener('keyup', handleEscKey);
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []);

  const memoizedTransform = useMemo(
    () => ({ ...transform({ open, side }), ...getSide({ side }) }),
    [open, side],
  );

  return (
    <Portal containerId={containerId}>
      <LayerManager>
        <Fixed
          onClick={handleClickPropagation}
          styles={{
            height: ['100%'],
            width: ['100%', '75%', '50%'],
            ...memoizedTransform,
            zIndex: zIndex + 2,
            ...styles,
          }}
          {...rest}
        />
        {overlayed ? (
          <Overlay
            {...allOverlayProps}
            containerId={overlayContainerId}
            styles={{ zIndex: zIndex + 1 }}
          />
        ) : null}
      </LayerManager>
    </Portal>
  );
};

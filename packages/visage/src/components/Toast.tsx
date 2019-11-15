import { useEventEmitter } from '@byteclaw/use-event-emitter';
import React, {
  cloneElement,
  useEffect,
  useReducer,
  ReactElement,
  useRef,
} from 'react';
import { createComponent } from '../core';
import { variant } from '../variants';
import { CloseButton } from './CloseButton';
import { EmotionStyleSheet } from '../types';

type ToastEventEmitterEvents = 'MOUNT' | 'UNMOUNT';

interface State {
  index: number;
  toasts: { toast: ReactElement; key: number }[];
}

const defaultState: State = {
  index: -1,
  toasts: [],
};

function toastsReducer(
  state: State,
  action: { type: ToastEventEmitterEvents; toast: ReactElement },
): State {
  switch (action.type) {
    case 'MOUNT': {
      const index = state.index + 1;

      return {
        index,
        toasts: [...state.toasts, { key: index, toast: action.toast }],
      };
    }
    case 'UNMOUNT': {
      return {
        ...state,
        toasts: state.toasts.filter(t => t.toast !== action.toast),
      };
    }
    default:
      return state;
  }
}

export const ToastManager = createComponent(
  (props: JSX.IntrinsicElements['div']) => {
    const [toasts, dispatch] = useReducer(toastsReducer, defaultState);
    const toastEventEmitter = useEventEmitter<ToastEventEmitterEvents>();

    useEffect(() => {
      const unbindMount = toastEventEmitter.on('MOUNT', (toast: ReactElement) =>
        dispatch({ type: 'MOUNT', toast }),
      );
      const unbindUnmount = toastEventEmitter.on(
        'UNMOUNT',
        (toast: ReactElement) => dispatch({ type: 'UNMOUNT', toast }),
      );

      return () => {
        unbindMount();
        unbindUnmount();
      };
    }, []);

    return (
      <div aria-live="polite" data-toastmanager {...props}>
        {toasts.toasts.map((toast, index) =>
          cloneElement(toast.toast, {
            key: toast.key,
            style: { transform: `translateY(-${(index + 1) * 80}px)` },
          }),
        )}
      </div>
    );
  },
  {
    displayName: 'ToastManager',
    defaultStyles: {
      justifyContent: 'center',
      display: 'flex',
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 600,
    },
  },
);

const toastVariants: {
  [key: string]: EmotionStyleSheet;
} = {
  danger: {
    backgroundColor: 'danger',
    color: 'dangerText',
  },
  info: {
    backgroundColor: 'info',
    color: 'infoText',
  },
  primary: {
    backgroundColor: 'primary',
    color: 'primaryText',
  },
  success: {
    backgroundColor: 'success',
    color: 'successText',
  },
  warning: {
    backgroundColor: 'warning',
    color: 'warningText',
  },
  default: {
    backgroundColor: 'neutral',
    color: 'neutralText',
  },
};

export const Toast = createComponent(
  ({
    children,
    duration = 5000,
    onDismiss,
    ...restProps
  }: {
    duration?: number;
    onDismiss?: () => void;
  } & JSX.IntrinsicElements['div']) => {
    const onDismissRef = useRef<null | undefined | (() => void)>(null);
    const expirationTimeout = useRef<number | null>(null);
    const toastEventEmitter = useEventEmitter<ToastEventEmitterEvents>();

    // override onDismiss every time, we don't want to update toast after initial render
    onDismissRef.current = onDismiss;

    useEffect(() => {
      const dismiss = () => {
        // eslint-disable-next-line no-unused-expressions
        onDismissRef.current && onDismissRef.current();
      };
      const time = Date.now();
      const onMouseOver = () => {
        window.clearTimeout(expirationTimeout.current!);
      };
      const onMouseOut = () => {
        // resume timeout
        const remainingTime = duration - (Date.now() - time);

        if (remainingTime > 0) {
          expirationTimeout.current = window.setTimeout(dismiss, remainingTime);
        } else {
          dismiss();
        }
      };
      const toast = (
        <div
          {...restProps}
          onFocus={onMouseOver}
          onMouseOver={onMouseOver}
          onMouseOut={onMouseOut}
          onBlur={onMouseOut}
        >
          {children}
          <CloseButton styles={{ ml: 'auto' }} onClick={dismiss} />
        </div>
      );

      toastEventEmitter.emit('MOUNT', toast);

      expirationTimeout.current = window.setTimeout(dismiss, duration);

      return () => {
        clearTimeout(expirationTimeout.current!);
        toastEventEmitter.emit('UNMOUNT', toast);
      };
    }, []);

    return null;
  },
  {
    displayName: 'Toast',
    defaultStyles: props => ({
      alignItems: 'center',
      boxShadow:
        '0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 15px 0px rgba(0,0,0,0.12)',
      display: 'inline-flex',
      lineHeight: 0,
      position: 'absolute',
      transition: 'transform .4s ease, opacity .4s ease',
      willChange: 'transform, opacity',
      fontSize: 0,
      minWidth: '240px',
      pl: 2,
      pr: 1,
      py: 1,
      ...(toastVariants[props.variant || 'default'] || toastVariants.default),
    }),
    variants: [
      variant('variant', true, [
        'danger',
        'info',
        'primary',
        'success',
        'default',
      ] as const),
    ],
  },
);

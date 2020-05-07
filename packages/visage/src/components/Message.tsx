import React, {
  KeyboardEvent,
  MouseEvent,
  useCallback,
  MouseEventHandler,
  ReactElement,
  forwardRef,
  Ref,
} from 'react';
import {
  ExtractVisageComponentProps,
  VisageComponent,
  markAsVisageComponent,
} from '@byteclaw/visage-core';
import { createComponent } from '../core';
import {
  booleanVariant,
  booleanVariantStyles,
  variant,
  variantStyles,
} from '../variants';
import { CloseButton } from './CloseButton';
import { createControlFocusShadow, createSurfaceFocusShadow } from './shared';

const MessageBase = createComponent('div', {
  displayName: 'Message',
  styles: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 0,
    p: 1,
    outline: 'none',
    position: 'relative',
    '&:focus': {
      zIndex: 1,
    },
    ...variantStyles('status', {
      danger: booleanVariantStyles('inverted', {
        on: {
          color: 'danger',
          '&:focus': {
            boxShadow: createSurfaceFocusShadow('danger'),
          },
        },
        off: {
          backgroundColor: 'danger',
          color: 'dangerText',
          '&:focus': {
            boxShadow: createControlFocusShadow('danger'),
          },
        },
      }),
      info: booleanVariantStyles('inverted', {
        on: {
          color: 'info',
          '&:focus': {
            boxShadow: createSurfaceFocusShadow('info'),
          },
        },
        off: {
          backgroundColor: 'info',
          color: 'infoText',
          '&:focus': {
            boxShadow: createControlFocusShadow('info'),
          },
        },
      }),
      success: booleanVariantStyles('inverted', {
        on: {
          color: 'success',
          '&:focus': {
            boxShadow: createSurfaceFocusShadow('success'),
          },
        },
        off: {
          backgroundColor: 'success',
          color: 'successText',
          '&:focus': {
            boxShadow: createControlFocusShadow('success'),
          },
        },
      }),
      warning: booleanVariantStyles('inverted', {
        on: {
          color: 'warning',
          '&:focus': {
            boxShadow: createSurfaceFocusShadow('warning'),
          },
        },
        off: {
          backgroundColor: 'warning',
          color: 'warningText',
          '&:focus': {
            boxShadow: createControlFocusShadow('warning'),
          },
        },
      }),
      default: booleanVariantStyles('inverted', {
        on: {
          color: 'shadesText',
          '&:focus': {
            boxShadow: createSurfaceFocusShadow(),
          },
        },
        off: {
          backgroundColor: 'neutral',
          color: 'neutralText',
          '&:focus': {
            boxShadow: createControlFocusShadow('neutral'),
          },
        },
      }),
    }),
  },
  variants: [
    variant('status', true, [
      'danger',
      'info',
      'success',
      'warning',
      'default',
    ] as const),
    booleanVariant('inverted', true),
  ],
});

const MessageDismissButton = createComponent(CloseButton, {
  displayName: 'MessageDismissButton',
  styles: {
    ml: 1,
    p: 0.5,
  },
});

const defaultMessageDismissButton = (props: {
  onClick: MouseEventHandler<any>;
}) => <MessageDismissButton {...props} />;

interface MessageProps extends ExtractVisageComponentProps<typeof MessageBase> {
  /**
   * Makes message dismissable
   *
   * Called when user click on dismiss element
   */
  onDismiss?: (e: KeyboardEvent<any> | MouseEvent<any>) => void;
  /**
   * Render function that can be used to render custom dismiss button
   */
  renderDismiss?: (props: { onClick: MouseEventHandler<any> }) => ReactElement;
}

export const Message: VisageComponent<MessageProps> = markAsVisageComponent(
  forwardRef(
    (
      {
        children,
        onDismiss,
        renderDismiss = defaultMessageDismissButton,
        status,
        ...restProps
      }: MessageProps,
      ref: Ref<any>,
    ) => {
      const onDismissClick = useCallback(
        (e: MouseEvent<any>) => {
          if (onDismiss) {
            onDismiss(e);
          }
        },
        [onDismiss],
      );

      return (
        <MessageBase
          aria-live="polite"
          role={
            status === 'danger' || status === 'warning' ? 'alert' : 'status'
          }
          status={status}
          tabIndex={0}
          ref={ref}
          {...restProps}
        >
          {children}
          {onDismiss ? renderDismiss({ onClick: onDismissClick }) : null}
        </MessageBase>
      );
    },
  ),
) as any;

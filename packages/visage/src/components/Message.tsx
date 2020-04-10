import React, {
  KeyboardEvent,
  MouseEvent,
  useCallback,
  MouseEventHandler,
  ReactElement,
} from 'react';
import { ExtractVisageComponentProps } from '@byteclaw/visage-core';
import { createComponent } from '../core';
import { variant } from '../variants';
import { CloseButton } from './CloseButton';

const variantStyles = {
  danger: {
    backgroundColor: 'danger',
    color: 'dangerText',
  },
  info: {
    backgroundColor: 'info',
    color: 'infoText',
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

const MessageBase = createComponent('div', {
  displayName: 'Message',
  styles: props => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 0,
    p: 1,
    ...(variantStyles[props.variant || 'default'] || variantStyles.default),
  }),
  variants: [
    variant('variant', true, [
      'danger',
      'info',
      'success',
      'warning',
      'default',
    ] as const),
  ],
});

const ChipDeleteButton = createComponent(CloseButton, {
  displayName: 'ChipDeleteButton',
  styles: {
    ml: 1,
    p: 0.5,
  },
});

const defaultChipDeleteRenderer = (props: {
  onClick: MouseEventHandler<any>;
}) => <ChipDeleteButton {...props} />;

interface MessageProps extends ExtractVisageComponentProps<typeof MessageBase> {
  /**
   * Makes message dismissable
   *
   * Called when user click on delete element
   */
  onDelete?: (e: KeyboardEvent<any> | MouseEvent<any>) => void;
  renderDeleter?: (props: { onClick: MouseEventHandler<any> }) => ReactElement;
}

export function Message({
  children,
  onDelete,
  renderDeleter = defaultChipDeleteRenderer,
  ...restProps
}: MessageProps) {
  const onDeleteClick = useCallback(
    (e: MouseEvent<any>) => {
      if (onDelete) {
        onDelete(e);
      }
    },
    [onDelete],
  );

  return (
    <MessageBase {...restProps}>
      {children}
      {onDelete ? renderDeleter({ onClick: onDeleteClick }) : null}
    </MessageBase>
  );
}

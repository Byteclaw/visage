import { VisageComponent, markAsVisageComponent } from '@byteclaw/visage-core';
import React, {
  KeyboardEvent,
  MouseEvent,
  useCallback,
  ReactNode,
  ReactElement,
  MouseEventHandler,
} from 'react';
import { createComponent } from '../core';
import { CloseButton } from './CloseButton';
import { StyleProps } from '../types';

const ChipBase = createComponent('div', {
  displayName: 'Chip',
  defaultStyles: {
    border: 1,
    borderColor: 'primary',
    borderStyle: 'solid',
    display: 'inline-flex',
    p: 1,
    position: 'relative',
    outline: '2px solid transparent',
    outlineOffset: '-2px',
    '&[data-clickable="true"]': {
      cursor: 'pointer',
    },
    '&:focus, &[aria-selected="true"]': {
      outlineColor: 'blue',
    },
  },
});

const defaultChipDeleteRenderer = (props: {
  onClick: MouseEventHandler<any>;
}) => <CloseButton styles={{ ml: 1, p: 0.5 }} {...props} />;

interface ChipProps {
  children: ReactNode;
  /**
   * Called when clicked or chip is focused and Space/Enter is pressed on chip and chip is not readOnly
   */
  onClick?: (e: KeyboardEvent<any> | MouseEvent<any>) => void;
  /**
   * Makes chip deletable
   *
   * Called when user click on delete element or presses Backspace / Delete
   */
  onDelete?: (e: KeyboardEvent<any> | MouseEvent<any>) => void;
  renderDeleter?: (props: { onClick: MouseEventHandler<any> }) => ReactElement;
}

export const Chip: VisageComponent<ChipProps, StyleProps> = function Chip({
  children,
  onClick,
  onDelete,
  renderDeleter = defaultChipDeleteRenderer,
  ...restProps
}: ChipProps) {
  const onChipClick = useCallback(
    (e: MouseEvent<any>) => {
      if (onClick) {
        onClick(e);
      }
    },
    [onClick],
  );
  const onDeleteClick = useCallback(
    (e: MouseEvent<any>) => {
      // stop propagation of event to ChipBase, because we don't want to invoke onclick
      e.stopPropagation();

      if (onDelete) {
        onDelete(e);
      }
    },
    [onDelete],
  );
  const onDeleteKeyDown = useCallback(
    (e: KeyboardEvent<any>) => {
      switch (e.key) {
        case 'Backspace':
        case 'Delete':
          if (onDelete) {
            e.preventDefault();
            onDelete(e);
          }
          break;
        case 'Enter':
        case ' ':
          if (onClick) {
            e.preventDefault();
            onClick(e);
          }
      }
    },
    [onDelete],
  );

  return (
    <ChipBase
      role={onClick ? 'button' : undefined}
      data-clickable={onClick != null}
      onClick={onChipClick}
      onKeyDown={onDeleteKeyDown}
      tabIndex={onClick ? 0 : undefined}
      {...restProps}
    >
      {children}
      {onDelete ? renderDeleter({ onClick: onDeleteClick }) : null}
    </ChipBase>
  );
};

markAsVisageComponent(Chip);

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
import { createSurfaceFocusShadow } from './shared';
import { EmotionStyleSheet } from '../types';
import { booleanVariant, variant } from '../variants';

const variantStyles: { [key: string]: EmotionStyleSheet } = {
  danger: {
    backgroundColor: 'danger',
    color: 'dangerText',
  },
  primary: {
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

const outlinedVariantStyles: { [key: string]: EmotionStyleSheet } = {
  success: {
    backgroundColor: 'transparent',
    borderColor: 'success',
    borderStyle: 'solid',
    borderWidth: 1,
    color: 'success',
  },
  danger: {
    backgroundColor: 'transparent',
    borderColor: 'danger',
    borderStyle: 'solid',
    borderWidth: 1,
    color: 'danger',
  },
  warning: {
    backgroundColor: 'transparent',
    borderColor: 'warning',
    borderStyle: 'solid',
    borderWidth: 1,
    color: 'warning',
  },
  primary: {
    backgroundColor: 'transparent',
    borderColor: 'primary',
    borderStyle: 'solid',
    borderWidth: 1,
    color: 'primary',
  },
  default: {
    backgroundColor: 'transparent',
    borderColor: 'lightAccent',
    borderStyle: 'solid',
    borderWidth: 1,
    color: 'lightShadesText',
  },
};

const ChipBase = createComponent('div', {
  displayName: 'Chip',
  styles: props => ({
    borderRadius: '16px',
    display: 'inline-flex',
    fontFamily: 'heading',
    fontSize: -1,
    position: 'relative',
    outline: 'none',
    '&[data-clickable="true"]': {
      cursor: 'pointer',
    },
    '&:focus, &[aria-selected="true"]': {
      boxShadow: createSurfaceFocusShadow(),
    },
    transition: 'all 150ms',
    ...(props.outlined
      ? outlinedVariantStyles[props.variant || 'default'] ||
        outlinedVariantStyles.default
      : variantStyles[props.variant || 'default'] || variantStyles.default),
  }),
  variants: [
    booleanVariant('outlined', true),
    variant('variant', true, [
      'danger',
      'primary',
      'success',
      'warning',
      'default',
    ] as const),
  ],
});

const ChipLabel = createComponent('span', {
  displayName: 'ChipLabel',
  styles: props => ({
    alignSelf: 'center',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    px: 1.5,
    py: 0.5,
    lineHeight: '1.2rem',
    ...(props.small
      ? {
          px: 1,
        }
      : {}),
  }),
  variants: [booleanVariant('small', false)],
});

const ChipDeleteButton = createComponent(CloseButton, {
  displayName: 'ChipDeleteButton',
  styles: {
    mr: 1,
    ml: -0.5,
    my: 0.5,
    p: 0.5,
  },
});

const defaultChipDeleteRenderer = (props: {
  onClick: MouseEventHandler<any>;
}) => <ChipDeleteButton {...props} />;

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
  small?: boolean;
}

export const Chip: VisageComponent<ChipProps> = React.memo(
  React.forwardRef(
    (
      {
        children,
        onClick,
        onDelete,
        renderDeleter = defaultChipDeleteRenderer,
        small,
        ...restProps
      }: ChipProps,
      ref: any,
    ) => {
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
          ref={ref}
        >
          <ChipLabel small={small}>{children}</ChipLabel>
          {onDelete ? renderDeleter({ onClick: onDeleteClick }) : null}
        </ChipBase>
      );
    },
  ),
);

markAsVisageComponent(Chip);

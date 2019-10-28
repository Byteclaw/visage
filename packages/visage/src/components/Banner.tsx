import {
  ExtractVisageComponentProps,
  markAsVisageComponent,
  VisageComponent,
} from '@byteclaw/visage-core';
import React, { ReactNode, MouseEvent } from 'react';
import { createComponent } from '../core';
import { booleanVariant, variant } from '../variants';
import { StyleProps } from '../createNPointTheme';
import { Box } from './Box';
import { CloseButton } from './CloseButton';
import { Flex } from './Flex';
import { Heading } from './Heading';
import { SvgIcon } from './SvgIcon';
import {
  DangerIcon,
  InfoIcon,
  NeutralMessageIcon,
  SuccessIcon,
  WarningIcon,
} from '../assets';
import { EmotionStyleSheet } from '../types';

const statusIcons = {
  default: NeutralMessageIcon,
  critical: DangerIcon,
  info: InfoIcon,
  success: SuccessIcon,
  warning: WarningIcon,
};

const variantStyles: { [key: string]: EmotionStyleSheet } = {
  critical: {
    borderColor: 'danger.1',
    backgroundColor: 'danger.-5',
    color: 'dangerText.-5',
    '&:focus': {
      borderColor: 'danger.2',
    },
  },
  info: {
    borderColor: 'info.1',
    backgroundColor: 'info.-5',
    color: 'infoText.-5',
    '&:focus': {
      borderColor: 'info.2',
    },
  },
  success: {
    borderColor: 'success.1',
    backgroundColor: 'success.-5',
    color: 'successText.-5',
    '&:focus': {
      borderColor: 'success.2',
    },
  },
  warning: {
    borderColor: 'warning.1',
    backgroundColor: 'warning.-5',
    color: 'warningText.-5',
    '&:focus': {
      borderColor: 'warning.2',
    },
  },
  default: {
    borderColor: 'neutral.1',
    backgroundColor: 'neutral.-5',
    color: 'neutralText.-5',
    '&:focus': {
      borderColor: 'neutral.2',
    },
  },
};

const BannerBase = createComponent(Flex, {
  displayName: 'Banner',
  defaultStyles: props => ({
    borderColor: 'transparent',
    borderStyle: 'solid',
    borderWidth: 1,
    outline: 'none',
    p: 2,
    my: 1,
    ...(props.flat
      ? {
          off: {
            boxShadow:
              '0 0 0 1px rgba(63,63,68,.05), 0 1px 3px 0 rgba(63,63,68,.15)',
          },
        }
      : {}),
    ...(variantStyles[props.status || 'default'] || variantStyles.default),
  }),
  variants: [
    booleanVariant('flat', true),
    variant('status', true, [
      'critical',
      'info',
      'success',
      'warning',
      'default',
    ] as const),
  ],
});

const ribbonVariantStyles: { [key: string]: EmotionStyleSheet } = {
  critical: {
    color: 'danger.2',
  },
  info: {
    color: 'info.2',
  },
  success: {
    color: 'success.2',
  },
  warning: {
    color: 'warning.2',
  },
  default: {
    color: 'neutral.2',
  },
};

const BannerRibbon = createComponent('div', {
  displayName: 'BannerRibbon',
  defaultStyles: props => ({
    fontSize: 1,
    mr: 2,
    ...(ribbonVariantStyles[props.status || 'default'] ||
      ribbonVariantStyles.default),
  }),
  variants: [
    variant('status', true, [
      'critical',
      'info',
      'success',
      'warning',
      'default',
    ] as const),
  ],
});

export const Banner: VisageComponent<
  ExtractVisageComponentProps<typeof BannerBase> & {
    children: ReactNode;
    dismissLabel?: string;
    icon?: ReactNode;
    onDismiss?: (event: MouseEvent<HTMLButtonElement>) => void;
    title?: ReactNode;
  },
  StyleProps
> = ({
  children,
  dismissLabel = 'Dismiss notification',
  icon,
  status = 'default',
  onDismiss,
  title,
  ...restProps
}: any) => {
  return (
    <BannerBase
      aria-live="polite"
      role={status === 'critical' || status === 'warning' ? 'alert' : 'status'}
      tabIndex={0}
      status={status}
      {...restProps}
    >
      <BannerRibbon aria-hidden status={status}>
        {icon != null ? (
          icon
        ) : (
          <SvgIcon
            aria-hidden
            icon={
              statusIcons[(status as any) as keyof (typeof statusIcons)] ||
              statusIcons.default
            }
          />
        )}
      </BannerRibbon>
      <Box styles={{ width: '100%' }}>
        {title != null ? (
          <Heading
            as="h5"
            level={5}
            styles={{
              fontSize: 1,
              fontWeight: 500,
              lineHeight: 1,
              mt: 0,
              mb: 1,
              pt: 0,
            }}
          >
            {title}
          </Heading>
        ) : null}
        {children}
      </Box>
      {onDismiss ? (
        <Box styles={{ mr: -1, mt: -1 }}>
          <CloseButton aria-label={dismissLabel} onClick={onDismiss} />
        </Box>
      ) : null}
    </BannerBase>
  );
};

markAsVisageComponent(Banner);

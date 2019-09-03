import {
  ExtractVisageComponentProps,
  markAsVisageComponent,
  VisageComponent,
} from '@byteclaw/visage-core';
import React, { ReactNode, MouseEvent } from 'react';
import { createBooleanVariant, createComponent, createVariant } from '../core';
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

const statusIcons = {
  default: NeutralMessageIcon,
  critical: DangerIcon,
  info: InfoIcon,
  success: SuccessIcon,
  warning: WarningIcon,
};

const flatVariant = createBooleanVariant('flat', {
  onStyles: {},
  offStyles: {
    boxShadow: '0 0 0 1px rgba(63,63,68,.05), 0 1px 3px 0 rgba(63,63,68,.15)',
  },
});
const BannerBase = createVariant(
  flatVariant(
    createComponent(Flex, {
      displayName: 'Banner',
      defaultStyles: {
        borderColor: 'transparent',
        borderStyle: 'solid',
        borderWidth: 2,
        outline: 'none',
        p: 2,
        my: 1,
      },
    }),
  ),
  'status',
  {
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
  },
);

const BannerRibbon = createVariant(
  createComponent('div', {
    displayName: 'BannerRibbon',
    defaultStyles: {
      fontSize: 1,
      mr: 2,
    },
  }),
  'status',
  {
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
  },
);

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
            focusable={false}
          />
        )}
      </BannerRibbon>
      <Box styles={{ width: '100%' }}>
        {title != null ? (
          <Heading
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
        <Box>
          <CloseButton aria-label={dismissLabel} onClick={onDismiss} />
        </Box>
      ) : null}
    </BannerBase>
  );
};

markAsVisageComponent(Banner);

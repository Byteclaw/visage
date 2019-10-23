import {
  ExtractVisageComponentProps,
  markAsVisageComponent,
} from '@byteclaw/visage-core';
import React, { ReactNode, Children, Fragment } from 'react';
import { createComponent } from '../core';
import { Divider } from './Divider';

export const DescriptionListBase = createComponent('dl', {
  displayName: 'DescriptionList',
  defaultStyles: {
    display: ['block', 'flex'],
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    m: 0,
    p: 0,
  },
});

export const Description = createComponent('dd', {
  displayName: 'DescriptionListItemDescription',
  defaultStyles: {
    display: 'block',
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: '51%',
    pt: [0, 2],
    pb: 2,
    m: 0,
  },
});

export const Term = createComponent('dt', {
  displayName: 'DescriptionListItemTerm',
  defaultStyles: {
    display: 'block',
    fontWeight: 'bolder',
    flexGrow: 0,
    flexShrink: 1,
    flexBasis: '25%',
    pt: 2,
    pb: [1, 2],
    pr: [0, 2],
    m: 0,
  },
});

export interface DescriptionListItemProps {
  description: ReactNode;
  prefix?: ReactNode;
  suffix?: ReactNode;
  term: ReactNode;
}

export interface DescriptionListProps {
  children: ReactNode;
}

export function DescriptionListItem({
  description,
  prefix,
  suffix,
  term,
}: DescriptionListItemProps) {
  return (
    <Fragment>
      {prefix}
      <Term>{term}</Term>
      <Description>{description}</Description>
      {suffix}
    </Fragment>
  );
}

export const DescriptionList: typeof DescriptionListBase = function DescriptionList({
  children,
  ...restProps
}: ExtractVisageComponentProps<typeof DescriptionListBase>) {
  return (
    <DescriptionListBase {...restProps}>
      {Children.map(children, (item, i) => {
        return (
          // eslint-disable-next-line react/no-array-index-key
          <Fragment key={i}>
            {item}
            {i + 1 < Children.count(children) && <Divider />}
          </Fragment>
        );
      })}
    </DescriptionListBase>
  );
};

markAsVisageComponent(DescriptionList);

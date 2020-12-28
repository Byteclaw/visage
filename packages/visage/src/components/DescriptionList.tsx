import {
  ExtractVisageComponentProps,
  markAsVisageComponent,
} from '@byteclaw/visage-core';
import React, { ReactNode, Children, Fragment } from 'react';
import { createComponent } from '../core';
import { Divider } from './Divider';

const DescriptionListBase = createComponent('dl', {
  displayName: 'DescriptionList',
  styles: {
    display: ['block', 'flex'],
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    m: 0,
    p: 0,
  },
});

export const DescriptionListItemDescription = createComponent('dd', {
  displayName: 'DescriptionListItemDescription',
  styles: {
    display: 'block',
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: '51%',
    pt: [0, 2],
    pb: 2,
    m: 0,
  },
});

export const DescriptionListItemTerm = createComponent('dt', {
  displayName: 'DescriptionListItemTerm',
  styles: {
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
}: DescriptionListItemProps): React.ReactElement {
  return (
    <>
      {prefix}
      <DescriptionListItemTerm>{term}</DescriptionListItemTerm>
      <DescriptionListItemDescription>
        {description}
      </DescriptionListItemDescription>
      {suffix}
    </>
  );
}

export const DescriptionList = markAsVisageComponent(function DescriptionList({
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
            {i + 1 < Children.count(children) ? <Divider /> : null}
          </Fragment>
        );
      })}
    </DescriptionListBase>
  );
});

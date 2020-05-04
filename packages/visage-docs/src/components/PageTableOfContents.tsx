import {
  createComponent,
  Heading,
  Link,
  List,
  ListItem,
  ListItemLink,
  SvgIcon,
} from '@byteclaw/visage';
import React from 'react';
import { GitHub } from 'react-feather';
import { slugify } from '../utils';

const Aside = createComponent('aside', {
  displayName: 'PageTableOfContents',
  styles: {
    position: 'sticky',
    ml: 3,
    top: 0,
  },
});

interface PageTableOfContentsProps {
  githubEditLink: string;
  headings: { depth: number; value: string }[];
  title: string;
}

export function PageTableOfContents({
  githubEditLink,
  headings,
  title,
}: PageTableOfContentsProps) {
  return (
    <Aside>
      <Heading level={4}>{title}</Heading>
      <List>
        {headings
          .filter(h => h.depth === 2)
          .map((h, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <ListItem key={i}>
              <ListItemLink href={`#${slugify(h.value)}`}>
                {h.value}
              </ListItemLink>
            </ListItem>
          ))}
      </List>

      <Link href={githubEditLink} rel="noopener noreferrer" target="_blank">
        <SvgIcon icon={GitHub} /> Edit on GitHub
      </Link>
    </Aside>
  );
}

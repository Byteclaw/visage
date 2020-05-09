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
    minWidth: 200,
    maxWidth: 250,
    width: '100%',
    ml: 4,
    top: 0,
  },
});

interface PageTableOfContentsProps {
  githubEditLink: string;
  headings: { depth: number; value: string }[];
}

export function PageTableOfContents({
  githubEditLink,
  headings,
}: PageTableOfContentsProps) {
  const mainHeading = headings.find(h => h.depth === 1);

  return (
    <Aside>
      {mainHeading ? (
        <Heading level={4}>
          <Link
            href={`#${slugify(mainHeading.value)}`}
            styles={{ color: 'inherit' }}
          >
            {mainHeading.value}
          </Link>
        </Heading>
      ) : null}
      <List styles={{ mb: 4 }}>
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

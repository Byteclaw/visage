import { AutocompleteInput, SvgIcon } from '@byteclaw/visage';
import algoliasearch from 'algoliasearch/lite';
import { navigate } from 'gatsby';
import React, { useMemo } from 'react';
// @ts-ignore
import { InstantSearch, connectAutoComplete } from 'react-instantsearch-dom';
// @ts-ignore
import { ReactComponent as AlgoliaLogo } from '../assets/algolia.svg';

const SearchInput = connectAutoComplete(({ refine, hits: searchHits }: any) => {
  const hits = useMemo(() => {
    return searchHits.map(
      (hit: {
        objectID: string;
        description: string | null;
        excerpt: string;
        title: string;
        pathname: string;
      }) => ({
        text: hit.title,
        pathname: hit.pathname,
      }),
    );
  }, [searchHits]);

  return (
    <AutocompleteInput<{ text: string; pathname: string }>
      onInputValueChange={refine}
      onStateChange={(_, next, dispatch) => {
        if (
          next.invokedBy.type === 'SetCurrentFocusedOption' ||
          next.invokedBy.type === 'SetValueByIndex'
        ) {
          dispatch({ type: 'Reset' });

          if (next.value) {
            navigate(next.value.pathname);
          }
        }
      }}
      optionToString={hit => hit.text}
      options={hits}
      placeholder="Search Visage docs"
      suffix={
        <a href="https://www.algolia.com/">
          <SvgIcon icon={AlgoliaLogo} />
        </a>
      }
      baseProps={{
        styles: { mr: 'auto', mb: 0, minWidth: ['50%', '50%', '30em'] },
      }}
      type="search"
    />
  );
});

const searchClient = algoliasearch(
  process.env.GATSBY_ALGOLIA_APP_ID!,
  process.env.GATSBY_ALGOLIA_SEARCH_KEY!,
);

export function Search() {
  return (
    <InstantSearch searchClient={searchClient} indexName="Pages">
      <SearchInput />
    </InstantSearch>
  );
}

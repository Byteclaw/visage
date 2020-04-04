import React, { Fragment, useMemo } from 'react';
import { createComponent } from '../core';
import { TextSkeleton } from './Text';

interface SkeletonSentenceProps {
  /** Mask of words of different lengths, e.g. [6,2,7] */
  mask?: number[];
}

const defaultMask = [6, 2, 7];

export const SkeletonSentence = createComponent(
  ({
    mask = defaultMask,
    ...restProps
  }: SkeletonSentenceProps & JSX.IntrinsicElements['div']) => {
    const words = useMemo(() => {
      return ([] as number[]).concat(
        ...mask.map((letters, i) =>
          i < mask.length ? [letters, 0] : [letters],
        ),
      );
    }, [mask]);

    return (
      <div {...restProps}>
        {words.map((letters, i) =>
          letters === 0 ? (
            // eslint-disable-next-line react/no-array-index-key
            <Fragment key={i}> </Fragment>
          ) : (
            // eslint-disable-next-line react/no-array-index-key
            <TextSkeleton key={i} letters={letters} />
          ),
        )}
      </div>
    );
  },
);

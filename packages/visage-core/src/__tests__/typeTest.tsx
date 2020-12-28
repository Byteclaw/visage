/* eslint-disable @typescript-eslint/no-unused-expressions, @typescript-eslint/no-unused-vars, max-classes-per-file, react/prefer-stateless-function, no-unused-expressions */

/**
 * This file contains all possible combinations of visage usage
 */
import React from 'react';
import { createComponent } from '../createComponent';
import { VisageComponent } from '../types';
import { StyleSheet } from '../styleSheet';

declare function FC(p: { test: boolean }): JSX.Element;

declare class CC extends React.Component<{ test: boolean }> {}

const A = createComponent('div', {
  styles(p) {
    return {
      c: p.variant,
    };
  },
  variants: [{ variant: 'default' } as { variant?: 'default' | 'primary' }],
});

const BA = createComponent(A, {
  defaultProps: {
    role: 'button',
  },
  styles(p) {
    return {
      c: p.variant,
      d: p.abwab ? 'true' : 'false',
    };
  },
  variants: [
    { variant: 'default' } as { variant?: 'default' | 'primary' | 'secondary' },
    { abwab: true } as { abwab: boolean },
  ],
});

const VFC = createComponent(FC, {
  defaultProps: {},
  styles(p) {
    return { c: p.test ? 'true' : 'false' };
  },
  variants: [{ abwabFc: true } as { abwabFc: boolean }],
});

const VCC = createComponent(CC, {
  defaultProps: {},
  styles(p) {
    return { c: p.test ? 'true' : 'false' };
  },
  variants: [{ abwabCc: true } as { abwabCc: boolean }],
});

// ok
<A />;
// ok
<A variant="default" />;
// @ts-expect-error - invalid variant
<A variant="nonexistent" />;
// ok
<A as="img" src="ok" />;
// @ts-expect-error - invalid src
<A as="img" src={10} />;

// ok
<BA abwab />;
// @ts-expect-error - missing abwab
<BA />;
// ok
<BA abwab variant="secondary" />;
// @ts-expect-error - invalid variant
<BA abwab variant="nonexistent" />;
// ok
<BA as="img" abwab src="ok" />;
// @ts-expect-error - invalid src
<BA as="img" abwab src={10} />;

// @ts-expect-error - missing abwab
<BA as={A} />;
// ok
<BA as={A} abwab />;
// ok
<BA as={A} abwab />;

// @ts-expect-erroror - abwab missing
<A as={BA} />;
// ok
<A as={BA} abwab />;

// @ts-expect-error - abwabFc and test missing
<VFC />;
// @ts-expect-error - test missing
<VFC abwabFc />;
// ok
<VFC abwabFc test />;
// @ts-expect-error - abwabFc and test missing
<VFC as={A} />;
// @ts-expect-error - test missing
<VFC as={A} abwabFc />;
// ok
<VFC as={A} abwabFc test />;
// ok
<VFC as={A} abwabFc test variant="primary" />;
// @ts-expect-error - invalid variant
<VFC as={A} abwabFc test variant="nonexisting" />;

// @ts-expect-error - abwabCC and test missing
<VCC />;
// @ts-expect-error - test missing
<VCC abwabCc />;
// ok
<VCC abwabCc test />;
// @ts-expect-error - abwabCc and test is missing
<VCC as={A} />;
// @ts-expect-error - test is missing
<VCC as={A} abwabCc />;
// ok
<VCC as={A} abwabCc test />;
// ok
<VCC as={A} abwabCc test variant="primary" />;
// @ts-expect-error - invalid variant
<VCC as={A} abwabCc test variant="nonexisting" />;

// @ts-expect-error - test missing
<A as={FC} />;
// ok
<A as={FC} test />;
// ok
<A as={FC} test variant="primary" />;
// @ts-expect-error - invalid variant
<A as={FC} test variant="nonexisting" />;

// @ts-expect-error - test missing
<A as={CC} />;
// ok
<A as={CC} test />;
// ok
<A as={CC} test variant="primary" />;
// @ts-expect-error - invalid variant
<A as={CC} test variant="nonexisting" />;

// assignments

// ok
const AssignFC: VisageComponent<{ test: boolean }> = () => null;

// ok
<AssignFC test />;
// @ts-expect-error - missing test
<AssignFC />;

// ok - this one should be ok but isn't :(
const AssignClass: VisageComponent<{
  test: boolean;
}> = class extends React.Component<{ test: boolean }> {
  render() {
    return null;
  }
};

// ok
<AssignClass test />;
// @ts-expect-error - missing test
<AssignClass />;

// ok
const AssignForwardedRef: VisageComponent<{
  test: boolean;
}> = React.forwardRef(() => null);

// ok
<AssignForwardedRef test />;
// @ts-expect-error - missing test
<AssignForwardedRef />;

// ok
const AssignMemo: VisageComponent<{ test: boolean }> = React.memo(() => null);

// ok
<AssignMemo test />;
// @ts-expect-error - missing test
<AssignMemo />;

// ok
const AssignComplexMemoAndForward: VisageComponent<
  {
    test: boolean;
  } & JSX.IntrinsicElements['div']
> = React.memo(
  React.forwardRef(
    (
      props: JSX.IntrinsicElements['h1'] & { test: boolean },
      ref: React.Ref<HTMLHeadingElement>,
    ) => null,
  ),
);

<AssignComplexMemoAndForward test />;
// @ts-expect-error - missing test
<AssignComplexMemoAndForward />;

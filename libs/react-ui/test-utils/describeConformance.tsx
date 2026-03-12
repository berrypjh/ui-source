import * as React from 'react';
import { describe, it, expect } from 'vitest';
import type { RenderResult } from '@testing-library/react';

type Awaitable<T> = T | Promise<T>;

type ElementProps = Record<string, unknown>;

type TestRender = <P extends object>(node: React.ReactElement<P>) => Awaitable<RenderResult>;

type RefInstanceConstructor = abstract new (...args: never[]) => object;

type PolymorphicPropName = 'component' | 'as';

type ConformanceElement<P extends object = ElementProps> = React.ReactElement<P>;

export type ConformanceTestKey =
  | 'mergeClassName'
  | 'propsSpread'
  | 'refForwarding'
  | 'rootClass'
  | 'polymorphicProp';

export interface ConformanceOptions {
  render: TestRender;
  classes?: {
    root?: string;
  };
  refInstanceof?: RefInstanceConstructor;
  polymorphicPropName?: PolymorphicPropName;
  testPolymorphicPropWith?: React.ElementType;
  only?: ConformanceTestKey[];
  skip?: ConformanceTestKey[];
}

type ConformanceTestFn = (
  element: ConformanceElement,
  getOptions: () => ConformanceOptions,
) => void;

export const randomStringValue = (): string => `s${Math.random().toString(36).slice(2)}`;

const getRootElement = (container: HTMLElement): HTMLElement => {
  const root = container.firstElementChild;

  if (!(root instanceof HTMLElement)) {
    throw new Error('Root element was not rendered.');
  }

  return root;
};

const testClassName: ConformanceTestFn = (element, getOptions) => {
  it('applies className to the root element', async () => {
    const { render } = getOptions();

    const className = randomStringValue();
    const testId = randomStringValue();

    const result = await render(
      React.cloneElement(element, {
        className,
        'data-testid': testId,
      }),
    );

    expect(result.getByTestId(testId)).toHaveClass(className);
  });
};

const testPropsSpread: ConformanceTestFn = (element, getOptions) => {
  it('spreads extra props to the root element', async () => {
    const { render } = getOptions();

    const testId = randomStringValue();
    const propName = 'data-test-props-spread' as const;
    const propValue = randomStringValue();

    const result = await render(
      React.cloneElement(element, {
        'data-testid': testId,
        [propName]: propValue,
      }),
    );

    expect(result.getByTestId(testId)).toHaveAttribute(propName, propValue);
  });
};

const testRefForwarding: ConformanceTestFn = (element, getOptions) => {
  it('forwards ref to the expected instance', async () => {
    const { render, refInstanceof } = getOptions();

    if (!refInstanceof) {
      throw new Error('missing "refInstanceof" in conformance options');
    }

    const ref = React.createRef<unknown>();

    await render(React.cloneElement(element, { ref }));

    expect(ref.current).toBeInstanceOf(refInstanceof);
  });
};

const testRootClass: ConformanceTestFn = (element, getOptions) => {
  it('keeps the built-in root class on the root element', async () => {
    const { render, classes } = getOptions();

    if (!classes?.root) {
      throw new Error('missing "classes.root" in conformance options');
    }

    const customClassName = randomStringValue();

    const result = await render(
      React.cloneElement(element, {
        className: customClassName,
      }),
    );

    const root = getRootElement(result.container);

    expect(root).toHaveClass(classes.root);
    expect(root).toHaveClass(customClassName);
  });
};

const testPolymorphicProp: ConformanceTestFn = (element, getOptions) => {
  describe('polymorphic prop', () => {
    it('renders a different root element when configured', async () => {
      const { render, polymorphicPropName, testPolymorphicPropWith = 'em' } = getOptions();

      if (!polymorphicPropName) {
        throw new Error('missing "polymorphicPropName" in conformance options');
      }

      const testId = randomStringValue();

      const result = await render(
        React.cloneElement(element, {
          [polymorphicPropName]: testPolymorphicPropWith,
          'data-testid': testId,
        }),
      );

      const node = result.getByTestId(testId);

      if (typeof testPolymorphicPropWith === 'string') {
        expect(node.tagName.toLowerCase()).toBe(testPolymorphicPropWith);
        return;
      }

      expect(node).toBeTruthy();
    });
  });
};

const fullSuite: Record<ConformanceTestKey, ConformanceTestFn> = {
  mergeClassName: testClassName,
  propsSpread: testPropsSpread,
  refForwarding: testRefForwarding,
  rootClass: testRootClass,
  polymorphicProp: testPolymorphicProp,
};

const describeConformance = (
  minimalElement: ConformanceElement,
  getOptions: () => ConformanceOptions,
): void => {
  describe('component API', () => {
    const { only, skip = [] } = getOptions();

    const enabledTests = only ?? (Object.keys(fullSuite) as ConformanceTestKey[]);

    enabledTests
      .filter((key) => !skip.includes(key))
      .forEach((key) => {
        const testFn = fullSuite[key];
        testFn(minimalElement, getOptions);
      });
  });
};

export default describeConformance;

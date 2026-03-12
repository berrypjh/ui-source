import * as React from 'react';
import { describe, it, expect } from 'vitest';
import type { RenderResult } from '@testing-library/react';

import { randomStringValue } from './randomStringValue';

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

const getRootElement = (container: HTMLElement): HTMLElement => {
  const root = container.firstElementChild;

  if (!(root instanceof HTMLElement)) {
    throw new Error('Root element가 렌더링되지 않았습니다.');
  }

  return root;
};

const testClassName: ConformanceTestFn = (element, getOptions) => {
  it('className이 root element에 적용되어야 한다', async () => {
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
  it('추가 props가 root element에 전달되어야 한다', async () => {
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
  it('ref가 기대한 인스턴스로 전달되어야 한다', async () => {
    const { render, refInstanceof } = getOptions();

    if (!refInstanceof) {
      throw new Error('conformance 옵션에 "refInstanceof"가 없습니다.');
    }

    const ref = React.createRef<unknown>();

    await render(React.cloneElement(element, { ref }));

    expect(ref.current).toBeInstanceOf(refInstanceof);
  });
};

const testRootClass: ConformanceTestFn = (element, getOptions) => {
  it('기본 root 클래스가 root element에 유지되어야 한다', async () => {
    const { render, classes } = getOptions();

    if (!classes?.root) {
      throw new Error('conformance 옵션에 "classes.root"가 없습니다.');
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
    it('설정된 경우 다른 root element로 렌더링되어야 한다', async () => {
      const { render, polymorphicPropName, testPolymorphicPropWith = 'em' } = getOptions();

      if (!polymorphicPropName) {
        throw new Error('conformance 옵션에 "polymorphicPropName"이 없습니다.');
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

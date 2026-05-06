import * as React from 'react';

import { baseDescribeConformance, type ConformanceOptions } from '../test-utils';

export type { ConformanceOptions };

const describeConformance = (
  minimalElement: React.ReactElement<Record<string, unknown>>,
  getOptions: () => ConformanceOptions,
): void => {
  baseDescribeConformance(minimalElement, getOptions);
};

export default describeConformance;

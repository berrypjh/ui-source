import { cx } from '@berrypjh/ui-core';

import { skipLinkClasses } from './SkipLink.constants';
import type { SkipLinkProps } from './SkipLink.types';

export const SkipLink = ({ targetId, className, children, ref, ...rest }: SkipLinkProps) => (
  <a {...rest} ref={ref} href={`#${targetId}`} className={cx(skipLinkClasses.root, className)}>
    {children}
  </a>
);

SkipLink.displayName = 'SkipLink';

import type { ReactNode } from 'react';
import { cx } from '@berrypjh/ui-core';

import { iconButtonClasses } from './IconButton.constants';
import type { IconButtonAutoAnchorProps, IconButtonRenderableProps } from './IconButton.types';

export const isAutoAnchorProps = (
  props: IconButtonRenderableProps,
): props is IconButtonAutoAnchorProps => {
  return props.component == null && 'href' in props && props.href != null;
};

export const getIconButtonClassNames = ({
  className,
  color,
  size,
  edge,
  disabled,
  loading,
}: Pick<
  IconButtonRenderableProps,
  'className' | 'color' | 'size' | 'edge' | 'disabled' | 'loading'
>) =>
  cx(
    iconButtonClasses.root,
    (disabled || loading === true) && iconButtonClasses.disabled,
    loading === true && iconButtonClasses.loading,
    edge === 'start' && iconButtonClasses.edgeStart,
    edge === 'end' && iconButtonClasses.edgeEnd,
    color === 'primary' && iconButtonClasses.colorPrimary,
    color === 'secondary' && iconButtonClasses.colorSecondary,
    size === 'sm' && iconButtonClasses.sizeSm,
    size === 'md' && iconButtonClasses.sizeMd,
    size === 'lg' && iconButtonClasses.sizeLg,
    className,
  );

export const getLoadingIndicator = ({
  loading,
  loadingId,
  loadingIndicator,
}: {
  loading: boolean | null;
  loadingId: string;
  loadingIndicator?: ReactNode;
}) => {
  return (
    <span
      className={iconButtonClasses.loadingIndicator}
      role="progressbar"
      aria-labelledby={loading === true ? loadingId : undefined}
    >
      {loadingIndicator ?? <span className={iconButtonClasses.spinner} aria-hidden="true" />}
    </span>
  );
};

export const getLoadingWrapper = ({
  loading,
  loadingId,
  loadingIndicator,
}: {
  loading: boolean | null;
  loadingId: string;
  loadingIndicator?: ReactNode;
}) => {
  if (typeof loading !== 'boolean') {
    return null;
  }

  return (
    <span className={iconButtonClasses.loadingWrapper}>
      {loading
        ? getLoadingIndicator({
            loading,
            loadingId,
            loadingIndicator,
          })
        : null}
    </span>
  );
};

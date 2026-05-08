'use client';

import { useId } from 'react';

import type { ElementType } from 'react';

import { ButtonBase } from '../button-base';

import type {
  IconButtonAutoAnchorProps,
  IconButtonProps,
  IconButtonRenderableProps,
} from './IconButton.types';
import { getIconButtonClassNames, getLoadingWrapper, isAutoAnchorProps } from './IconButton.utils';

export const IconButton = (props: IconButtonRenderableProps) => {
  const generatedId = useId();

  const {
    className,
    children,
    color = 'primary',
    size = 'md',
    edge = false,
    loading = null,
    loadingIndicator,
    disabled = false,
    id,
  } = props;

  const loadingId = id ?? generatedId;

  const classNames = getIconButtonClassNames({
    className,
    color,
    size,
    edge,
    disabled,
    loading,
  });

  const loadingWrapper = getLoadingWrapper({
    loading,
    loadingId,
    loadingIndicator,
  });

  if (isAutoAnchorProps(props)) {
    const {
      className: _className,
      children: _children,
      color: _color,
      size: _size,
      edge: _edge,
      loading: _loading,
      loadingIndicator: _loadingIndicator,
      disabled: _disabled,
      ...rest
    }: IconButtonAutoAnchorProps = props;

    return (
      <ButtonBase
        {...rest}
        id={loading === true ? loadingId : id}
        className={classNames}
        disabled={disabled || loading === true}
        variant="text"
        size={size}
        color={color}
      >
        {loadingWrapper}
        {children}
      </ButtonBase>
    );
  }

  const {
    component,
    className: _className,
    children: _children,
    color: _color,
    size: _size,
    edge: _edge,
    loading: _loading,
    loadingIndicator: _loadingIndicator,
    disabled: _disabled,
    ...rest
  }: IconButtonProps<ElementType> = props;

  return (
    <ButtonBase
      {...rest}
      {...(component != null ? { component } : {})}
      id={loading === true ? loadingId : id}
      className={classNames}
      disabled={disabled || loading === true}
      variant="text"
      size={size}
      color={color}
    >
      {loadingWrapper}
      {children}
    </ButtonBase>
  );
};

IconButton.displayName = 'IconButton';

'use client';

import type { ElementType } from 'react';
import { useId } from 'react';

import { ButtonBase } from '../button-base';
import type { ButtonAutoAnchorProps, ButtonProps, ButtonRenderableProps } from './Button.types';
import {
  getButtonClassNames,
  getContent,
  getEndIcon,
  getLoader,
  getStartIcon,
  isAutoAnchorProps,
} from './Button.utils';
import './button.scss';

export const Button = (props: ButtonRenderableProps) => {
  const labelId = useId();

  const {
    className,
    children,
    startIcon,
    endIcon,
    loading = false,
    loadingIndicator,
    loadingPosition = 'center',
    disabled = false,
  } = props;

  const classNames = getButtonClassNames({
    className,
    loading,
    loadingPosition,
  });

  const startAdornment = getStartIcon({
    startIcon,
    loading,
    loadingPosition,
  });

  const endAdornment = getEndIcon({
    endIcon,
    loading,
    loadingPosition,
  });

  const loader = getLoader({
    loading,
    children,
    labelId,
    loadingIndicator,
  });

  const content = getContent({
    children,
    labelId,
  });

  if (isAutoAnchorProps(props)) {
    const {
      className: _className,
      children: _children,
      startIcon: _startIcon,
      endIcon: _endIcon,
      loading: _loading,
      loadingIndicator: _loadingIndicator,
      loadingPosition: _loadingPosition,
      disabled: _disabled,
      ...rest
    }: ButtonAutoAnchorProps = props;

    return (
      <ButtonBase {...rest} className={classNames} disabled={disabled || loading}>
        {startAdornment}
        {loadingPosition !== 'end' ? loader : null}
        {content}
        {loadingPosition === 'end' ? loader : null}
        {endAdornment}
      </ButtonBase>
    );
  }

  const {
    component,
    className: _className,
    children: _children,
    startIcon: _startIcon,
    endIcon: _endIcon,
    loading: _loading,
    loadingIndicator: _loadingIndicator,
    loadingPosition: _loadingPosition,
    disabled: _disabled,
    ...rest
  }: ButtonProps<ElementType> = props;

  return (
    <ButtonBase
      {...rest}
      {...(component != null ? { component } : {})}
      className={classNames}
      disabled={disabled || loading}
    >
      {startAdornment}
      {loadingPosition !== 'end' ? loader : null}
      {content}
      {loadingPosition === 'end' ? loader : null}
      {endAdornment}
    </ButtonBase>
  );
};

Button.displayName = 'Button';

'use client';

import type { ElementType } from 'react';

import { ButtonBase } from '../button-base';

import type { FabAutoAnchorProps, FabProps, FabRenderableProps } from './Fab.types';
import { getFabClassNames, getFabContent, isAutoAnchorProps } from './Fab.utils';

import './fab.scss';

export const Fab = (props: FabRenderableProps) => {
  const {
    className,
    children,
    color = 'primary',
    size = 'lg',
    shape = 'circular',
    icon,
    disabled = false,
  } = props;

  const classNames = getFabClassNames({
    className,
    color,
    size,
    shape,
  });

  const content = getFabContent({
    children,
    icon,
  });

  if (isAutoAnchorProps(props)) {
    const {
      className: _className,
      children: _children,
      color: _color,
      size: _size,
      shape: _shape,
      icon: _icon,
      disabled: _disabled,
      ...rest
    }: FabAutoAnchorProps = props;

    return (
      <ButtonBase
        {...rest}
        className={classNames}
        disabled={disabled}
        variant="contained"
        size={size}
        color={color}
      >
        {content}
      </ButtonBase>
    );
  }

  const {
    component,
    className: _className,
    children: _children,
    color: _color,
    size: _size,
    shape: _shape,
    icon: _icon,
    disabled: _disabled,
    ...rest
  }: FabProps<ElementType> = props;

  return (
    <ButtonBase
      {...rest}
      {...(component != null ? { component } : {})}
      className={classNames}
      disabled={disabled}
      variant="contained"
      size={size}
      color={color}
    >
      {content}
    </ButtonBase>
  );
};

Fab.displayName = 'Fab';

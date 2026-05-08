'use client';

import type { ElementType } from 'react';

import { ButtonBase } from '../button-base';

import { bubbleButtonClasses } from './BubbleButton.constants';
import type {
  BubbleButtonAutoAnchorProps,
  BubbleButtonProps,
  BubbleButtonRenderableProps,
} from './BubbleButton.types';
import {
  getBubbleButtonContent,
  getBubbleButtonRootClassNames,
  getBubbleButtonWrapperStyle,
  isAutoAnchorProps,
} from './BubbleButton.utils';

export const BubbleButton = (props: BubbleButtonRenderableProps) => {
  const { className, style, icon, label, size = 'md', delay = 0, disabled = false } = props;

  const wrapperStyle = getBubbleButtonWrapperStyle({
    delay,
  });

  const rootClassNames = getBubbleButtonRootClassNames({
    className,
    size,
  });

  const content = getBubbleButtonContent({
    icon,
    label,
  });

  if (isAutoAnchorProps(props)) {
    const {
      className: _className,
      style: _style,
      icon: _icon,
      label: _label,
      size: _size,
      delay: _delay,
      disabled: _disabled,
      ...rest
    }: BubbleButtonAutoAnchorProps = props;

    return (
      <span
        className={bubbleButtonClasses.wrapper}
        style={wrapperStyle}
        data-disabled={disabled ? 'true' : undefined}
      >
        <ButtonBase
          {...rest}
          className={rootClassNames}
          style={style}
          disabled={disabled}
          size={size}
          variant="text"
        >
          {content}
        </ButtonBase>
      </span>
    );
  }

  const {
    component,
    className: _className,
    style: _style,
    icon: _icon,
    label: _label,
    size: _size,
    delay: _delay,
    disabled: _disabled,
    ...rest
  }: BubbleButtonProps<ElementType> = props;

  return (
    <span
      className={bubbleButtonClasses.wrapper}
      style={wrapperStyle}
      data-disabled={disabled ? 'true' : undefined}
    >
      <ButtonBase
        {...rest}
        {...(component != null ? { component } : {})}
        className={rootClassNames}
        style={style}
        disabled={disabled}
        size={size}
        variant="text"
      >
        {content}
      </ButtonBase>
    </span>
  );
};

BubbleButton.displayName = 'BubbleButton';

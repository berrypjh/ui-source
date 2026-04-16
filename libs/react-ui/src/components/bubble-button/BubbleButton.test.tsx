import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { spy } from 'sinon';

import { BubbleButton } from './BubbleButton';
import { bubbleButtonClasses } from './BubbleButton.constants';
import { createRenderer, describeConformance } from '../../../test';

describe('<BubbleButton />', () => {
  const { render } = createRenderer();

  describeConformance(<BubbleButton label="hello" />, () => ({
    render,
    classes: bubbleButtonClasses,
    refInstanceof: HTMLButtonElement,
    polymorphicPropName: 'component',
    testPolymorphicPropWith: 'a',
    getRootElement: (container) => {
      const root = container.querySelector(`.${bubbleButtonClasses.root}`);

      if (!(root instanceof HTMLElement)) {
        throw new Error('BubbleButton root element를 찾을 수 없습니다.');
      }

      return root;
    },
  }));

  describe('root', () => {
    it('label을 렌더링한다', () => {
      render(<BubbleButton label="Topics" />);

      const button = screen.getByRole('button', { name: 'Topics' });
      const label = button.querySelector(`.${bubbleButtonClasses.label}`);

      expect(button).toHaveClass(bubbleButtonClasses.root);
      expect(label).toBeInTheDocument();
      expect(label).toHaveTextContent('Topics');
    });

    it('icon을 렌더링한다', () => {
      render(<BubbleButton label="Topics" icon={<span data-testid="icon">★</span>} />);

      const button = screen.getByRole('button', { name: 'Topics' });
      const iconSlot = button.querySelector(`.${bubbleButtonClasses.icon}`);

      expect(iconSlot).toBeInTheDocument();
      expect(screen.getByTestId('icon')).toBeInTheDocument();
    });

    it('장식 레이어들을 렌더링한다', () => {
      render(<BubbleButton label="Topics" />);

      const button = screen.getByRole('button', { name: 'Topics' });

      expect(button.querySelector(`.${bubbleButtonClasses.glow}`)).toBeInTheDocument();
      expect(button.querySelector(`.${bubbleButtonClasses.surface}`)).toBeInTheDocument();
      expect(button.querySelector(`.${bubbleButtonClasses.border}`)).toBeInTheDocument();
      expect(button.querySelector(`.${bubbleButtonClasses.highlight}`)).toBeInTheDocument();
      expect(button.querySelector(`.${bubbleButtonClasses.ring}`)).toBeInTheDocument();
      expect(button.querySelector(`.${bubbleButtonClasses.content}`)).toBeInTheDocument();
    });

    it('기본적으로 medium size class를 적용한다', () => {
      render(<BubbleButton label="Topics" />);

      expect(screen.getByRole('button', { name: 'Topics' })).toHaveClass(
        bubbleButtonClasses.sizeMd,
      );
    });

    it('size에 따라 대응하는 class를 적용한다', () => {
      const { rerender } = render(<BubbleButton label="Small" size="sm" />);

      expect(screen.getByRole('button', { name: 'Small' })).toHaveClass(bubbleButtonClasses.sizeSm);

      rerender(<BubbleButton label="Large" size="lg" />);

      expect(screen.getByRole('button', { name: 'Large' })).toHaveClass(bubbleButtonClasses.sizeLg);
    });

    it('href가 제공되면 link로 렌더링한다', () => {
      render(<BubbleButton label="Docs" href="/docs" />);

      expect(screen.getByRole('link', { name: 'Docs' })).toHaveAttribute('href', '/docs');
    });

    it('button host에서는 기본적으로 menu 접근성 속성을 렌더링하지 않는다', () => {
      render(<BubbleButton label="Topics" />);

      const button = screen.getByRole('button', { name: 'Topics' });

      expect(button).not.toHaveAttribute('aria-haspopup');
      expect(button).not.toHaveAttribute('aria-expanded');
      expect(button).not.toHaveAttribute('aria-controls');
    });
  });

  describe('events', () => {
    it('onClick을 호출한다', async () => {
      const onClick = spy();
      const { user } = render(<BubbleButton label="Topics" onClick={onClick} />);

      await user.click(screen.getByRole('button', { name: 'Topics' }));

      expect(onClick.callCount).toBe(1);
    });
  });

  describe('prop: disabled', () => {
    it('native button이면 disabled를 전달한다', () => {
      render(<BubbleButton label="Topics" disabled />);

      expect(screen.getByRole('button', { name: 'Topics' })).toBeDisabled();
    });

    it('link host이면 aria-disabled를 적용한다', () => {
      render(<BubbleButton label="Docs" href="/docs" disabled />);

      const link = screen.getByRole('link', { name: 'Docs' });

      expect(link).toHaveAttribute('aria-disabled', 'true');
      expect(link).toHaveAttribute('tabindex', '-1');
    });
  });
});

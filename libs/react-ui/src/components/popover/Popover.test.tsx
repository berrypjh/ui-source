import { useRef } from 'react';

import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { createRenderer } from '../../../test';

import { Popover } from './Popover';
import { popoverClasses } from './Popover.constants';
import { PopoverPanel } from './PopoverPanel';
import { PopoverTrigger } from './PopoverTrigger';

describe('<Popover />', () => {
  const { render } = createRenderer();

  describe('trigger', () => {
    it('자식 element에 aria-haspopup="dialog"가 기본으로 주입되어야 한다', () => {
      render(
        <Popover>
          <PopoverTrigger>
            <button type="button">Open</button>
          </PopoverTrigger>
          <PopoverPanel>Content</PopoverPanel>
        </Popover>,
      );

      const trigger = screen.getByRole('button', { name: 'Open' });

      expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
      expect(trigger).not.toHaveAttribute('aria-controls');
    });

    it('자식이 단일 element가 아니면 throw해야 한다', () => {
      const originalError = console.error;
      console.error = vi.fn();
      expect(() =>
        render(
          <Popover>
            <PopoverTrigger>{'text' as unknown as React.ReactElement}</PopoverTrigger>
          </Popover>,
        ),
      ).toThrow(/single React element child/);
      console.error = originalError;
    });

    it('컨슈머의 ref와 트리거 ref가 함께 채워져야 한다', () => {
      const consumerRef = { current: null as HTMLButtonElement | null };
      const Harness = () => (
        <Popover>
          <PopoverTrigger>
            <button ref={consumerRef as unknown as React.Ref<HTMLButtonElement>} type="button">
              Open
            </button>
          </PopoverTrigger>
        </Popover>
      );

      render(<Harness />);

      expect(consumerRef.current).toBeInstanceOf(HTMLButtonElement);
    });
  });

  describe('open state', () => {
    it('uncontrolled: defaultOpen이면 panel을 즉시 렌더링해야 한다', () => {
      render(
        <Popover defaultOpen>
          <PopoverTrigger>
            <button type="button">Open</button>
          </PopoverTrigger>
          <PopoverPanel>Content</PopoverPanel>
        </Popover>,
      );

      expect(screen.getByRole('dialog')).toHaveClass(popoverClasses.panel);
      expect(screen.getByRole('button', { name: 'Open' })).toHaveAttribute('aria-expanded', 'true');
    });

    it('uncontrolled: 트리거 클릭으로 토글되어야 한다', async () => {
      const { user } = render(
        <Popover>
          <PopoverTrigger>
            <button type="button">Open</button>
          </PopoverTrigger>
          <PopoverPanel>Content</PopoverPanel>
        </Popover>,
      );

      const trigger = screen.getByRole('button', { name: 'Open' });

      await user.click(trigger);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(trigger).toHaveAttribute('aria-expanded', 'true');

      await user.click(trigger);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('controlled: open prop으로 열림 상태를 강제해야 한다', () => {
      const { setProps } = render(
        <Popover open={false}>
          <PopoverTrigger>
            <button type="button">Open</button>
          </PopoverTrigger>
          <PopoverPanel>Content</PopoverPanel>
        </Popover>,
      );

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

      setProps({ open: true });

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('controlled: 클릭 시 onOpenChange가 호출되어야 한다', async () => {
      const onOpenChange = vi.fn();
      const { user } = render(
        <Popover open={false} onOpenChange={onOpenChange}>
          <PopoverTrigger>
            <button type="button">Open</button>
          </PopoverTrigger>
          <PopoverPanel>Content</PopoverPanel>
        </Popover>,
      );

      await user.click(screen.getByRole('button', { name: 'Open' }));

      expect(onOpenChange).toHaveBeenCalledWith(true);
    });
  });

  describe('panel', () => {
    it('open=false면 렌더링되지 않아야 한다', () => {
      render(
        <Popover>
          <PopoverTrigger>
            <button type="button">Open</button>
          </PopoverTrigger>
          <PopoverPanel>Content</PopoverPanel>
        </Popover>,
      );

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('asDialog=false면 role="dialog"를 적용하지 않아야 한다', () => {
      render(
        <Popover defaultOpen>
          <PopoverTrigger>
            <button type="button">Open</button>
          </PopoverTrigger>
          <PopoverPanel asDialog={false} data-testid="panel">
            Content
          </PopoverPanel>
        </Popover>,
      );

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      expect(screen.getByTestId('panel')).toHaveClass(popoverClasses.panel);
    });

    it('panel 바깥 클릭 시 닫혀야 한다', async () => {
      const { user } = render(
        <Popover defaultOpen>
          <PopoverTrigger>
            <button type="button">Open</button>
          </PopoverTrigger>
          <PopoverPanel>Content</PopoverPanel>
          <button type="button">Outside</button>
        </Popover>,
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: 'Outside' }));

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('Escape 키로 닫혀야 한다', async () => {
      const { user } = render(
        <Popover defaultOpen>
          <PopoverTrigger>
            <button type="button">Open</button>
          </PopoverTrigger>
          <PopoverPanel>Content</PopoverPanel>
        </Popover>,
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();

      await user.keyboard('{Escape}');

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('panel 내부 클릭으로는 닫히지 않아야 한다', async () => {
      const { user } = render(
        <Popover defaultOpen>
          <PopoverTrigger>
            <button type="button">Open</button>
          </PopoverTrigger>
          <PopoverPanel>
            <button type="button">Inside</button>
          </PopoverPanel>
        </Popover>,
      );

      await user.click(screen.getByRole('button', { name: 'Inside' }));

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('className을 root에 병합해야 한다', () => {
      render(
        <Popover defaultOpen>
          <PopoverTrigger>
            <button type="button">Open</button>
          </PopoverTrigger>
          <PopoverPanel className="custom-panel">Content</PopoverPanel>
        </Popover>,
      );

      const panel = screen.getByRole('dialog');

      expect(panel).toHaveClass(popoverClasses.panel);
      expect(panel).toHaveClass('custom-panel');
    });
  });

  describe('context guard', () => {
    it('Popover 바깥의 PopoverTrigger는 throw해야 한다', () => {
      const originalError = console.error;
      console.error = vi.fn();
      const Standalone = () => {
        useRef(null);
        return (
          <PopoverTrigger>
            <button type="button">Open</button>
          </PopoverTrigger>
        );
      };
      expect(() => render(<Standalone />)).toThrow(/within <Popover>/);
      console.error = originalError;
    });
  });
});

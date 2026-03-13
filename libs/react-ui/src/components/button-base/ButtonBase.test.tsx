import { act, fireEvent, screen } from '@testing-library/react';
import { beforeAll, describe, expect, it } from 'vitest';
import { spy } from 'sinon';

import { ButtonBase, buttonBaseClasses } from './ButtonBase';
import { createRenderer, describeConformance } from '../../../test';

describe('<ButtonBase />', () => {
  const { render } = createRenderer();

  let canFireDragEvents = true;

  const supportsTouch = () => typeof window.TouchEvent !== 'undefined';

  beforeAll(() => {
    try {
      const EventConstructor = window.DragEvent ?? window.Event;
      new EventConstructor('dragend');
    } catch {
      canFireDragEvents = false;
    }
  });

  describeConformance(<ButtonBase>hello</ButtonBase>, () => ({
    render,
    classes: buttonBaseClasses,
    refInstanceof: HTMLButtonElement,
    polymorphicPropName: 'component',
    testPolymorphicPropWith: 'a',
  }));

  describe('root node', () => {
    it('기본 type은 button이다', () => {
      const { setProps } = render(<ButtonBase>hello</ButtonBase>);
      expect(screen.getByText('hello')).toHaveAttribute('type', 'button');

      setProps({ type: undefined });
      expect(screen.getByText('hello')).toHaveAttribute('type', 'button');
    });

    it('button의 type을 변경할 수 있다', () => {
      render(<ButtonBase type="submit">Hello</ButtonBase>);
      expect(screen.getByText('Hello')).toHaveAttribute('type', 'submit');
    });

    it('type이 "button"이면 role="button"을 적용하지 않는다', () => {
      render(<ButtonBase type="button">Hello</ButtonBase>);
      expect(screen.getByText('Hello')).not.toHaveAttribute('role');
    });

    it('href가 제공되면 버튼을 자동으로 anchor 요소로 변경한다', () => {
      const { container } = render(<ButtonBase href="https://google.com">Hello</ButtonBase>);
      const button = container.firstChild;

      expect(button).toHaveProperty('nodeName', 'A');
      expect(button).not.toHaveAttribute('role');
      expect(button).not.toHaveAttribute('type');
      expect(button).toHaveAttribute('href', 'https://google.com');
    });

    it('href 없이 anchor를 사용하면 role="button"을 적용한다', () => {
      render(<ButtonBase component="a">Hello</ButtonBase>);
      const button = screen.getByRole('button');

      expect(button).toHaveProperty('nodeName', 'A');
      expect(button).not.toHaveAttribute('type');
    });

    it('props를 다시 주입할 수 있다', () => {
      const { setProps } = render(<ButtonBase disabled={false}>hello</ButtonBase>);

      setProps({ disabled: true });

      expect(screen.getByRole('button')).toBeDisabled();
    });
  });

  describe('event callbacks', () => {
    it('이벤트 콜백들을 정상적으로 호출한다', async () => {
      const onClick = spy();
      const onBlur = spy();
      const onFocus = spy();
      const onKeyUp = spy();
      const onKeyDown = spy();
      const onMouseDown = spy();
      const onMouseLeave = spy();
      const onMouseUp = spy();
      const onContextMenu = spy();
      const onDragEnd = spy();
      const onTouchStart = spy();
      const onTouchEnd = spy();

      const { user } = render(
        <ButtonBase
          onClick={onClick}
          onBlur={onBlur}
          onFocus={onFocus}
          onKeyUp={onKeyUp}
          onKeyDown={onKeyDown}
          onMouseDown={onMouseDown}
          onMouseLeave={onMouseLeave}
          onMouseUp={onMouseUp}
          onContextMenu={onContextMenu}
          onDragEnd={onDragEnd}
          onTouchEnd={onTouchEnd}
          onTouchStart={onTouchStart}
        >
          Hello
        </ButtonBase>,
      );

      const button = screen.getByRole('button', { name: 'Hello' });

      // touch 이벤트를 지원하는 환경에서만 실행
      if (supportsTouch()) {
        fireEvent.touchStart(button, {
          touches: [{ identifier: 0, target: button, clientX: 0, clientY: 0 }],
        });
        expect(onTouchStart.callCount).toBe(1);

        fireEvent.touchEnd(button, {
          changedTouches: [{ identifier: 0, target: button, clientX: 0, clientY: 0 }],
        });
        expect(onTouchEnd.callCount).toBe(1);
      }

      // drag 이벤트를 생성할 수 있는 환경에서만 실행
      if (canFireDragEvents) {
        fireEvent.dragEnd(button);
        expect(onDragEnd.callCount).toBe(1);
      }

      fireEvent.mouseDown(button);
      expect(onMouseDown.callCount).toBe(1);

      fireEvent.mouseUp(button);
      expect(onMouseUp.callCount).toBe(1);

      fireEvent.contextMenu(button);
      expect(onContextMenu.callCount).toBe(1);

      await user.click(button);
      expect(onClick.callCount).toBe(1);

      await act(async () => {
        button.focus();
      });
      expect(onFocus.callCount).toBe(1);

      fireEvent.keyDown(button, { key: 'Enter' });
      expect(onKeyDown.callCount).toBe(1);

      fireEvent.keyUp(button, { key: 'Enter' });
      expect(onKeyUp.callCount).toBe(1);

      await act(async () => {
        button.blur();
      });
      expect(onBlur.callCount).toBe(1);

      fireEvent.mouseLeave(button);
      expect(onMouseLeave.callCount).toBe(1);
    });

    it('non-native button에서 Enter 키를 누르면 click 이벤트가 전파된다', async () => {
      const parentClickSpy = spy();
      const buttonClickSpy = spy();

      const { user } = render(
        <div onClick={parentClickSpy}>
          <ButtonBase onClick={buttonClickSpy} component="div">
            Hello
          </ButtonBase>
        </div>,
      );

      await user.tab();
      await user.keyboard('{Enter}');

      expect(buttonClickSpy.callCount).toBe(1);
      expect(parentClickSpy.callCount).toBe(1);
    });

    it('non-native button에서 Space 키를 떼면 click 이벤트가 전파된다', async () => {
      const parentClickSpy = spy();
      const buttonClickSpy = spy();

      const { user } = render(
        <div onClick={parentClickSpy}>
          <ButtonBase onClick={buttonClickSpy} component="div">
            Hello
          </ButtonBase>
        </div>,
      );

      // 탭으로 버튼에 포커스 이동
      await user.tab();
      await user.keyboard(' ');

      expect(buttonClickSpy.callCount).toBe(1);
      expect(parentClickSpy.callCount).toBe(1);
    });
  });
});

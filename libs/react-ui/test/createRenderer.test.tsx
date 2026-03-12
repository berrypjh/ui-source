import * as React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { createRenderer } from './createRenderer';

describe('createRenderer', () => {
  it('render로 컴포넌트를 그릴 수 있다', () => {
    const { render } = createRenderer();

    render(<button type="button">hello</button>);

    const button = screen.getByRole('button', { name: 'hello' });
    expect(button.tagName).toBe('BUTTON');
    expect(button.getAttribute('type')).toBe('button');
  });

  it('setProps로 props를 갱신할 수 있다', () => {
    const { render } = createRenderer();

    const Component = ({ disabled = false }: { disabled?: boolean }) => {
      return (
        <button type="button" disabled={disabled}>
          hello
        </button>
      );
    };

    const { setProps } = render(<Component disabled={false} />);

    expect((screen.getByRole('button') as HTMLButtonElement).disabled).toBe(false);

    setProps({ disabled: true });

    expect((screen.getByRole('button') as HTMLButtonElement).disabled).toBe(true);
  });

  it('user 이벤트를 사용할 수 있다', async () => {
    const { render } = createRenderer();
    const onClick = vi.fn();

    const { user } = render(
      <button type="button" onClick={onClick}>
        hello
      </button>,
    );

    await user.click(screen.getByRole('button', { name: 'hello' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('wrapper를 적용할 수 있다', () => {
    const Context = React.createContext('default');

    const Wrapper = ({ children }: { children?: React.ReactNode }) => {
      return <Context.Provider value="wrapped">{children}</Context.Provider>;
    };

    const Component = () => {
      return <div>{React.useContext(Context)}</div>;
    };

    const { render } = createRenderer({ wrapper: Wrapper });

    render(<Component />);

    expect(screen.getByText('wrapped')).not.toBeNull();
  });
});

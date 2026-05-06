import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { createRenderer, describeConformance } from '../../../test';

import { Button } from './Button';
import { buttonClasses } from './Button.constants';

describe('<Button />', () => {
  const { render } = createRenderer();

  describeConformance(<Button>hello</Button>, () => ({
    render,
    classes: buttonClasses,
    refInstanceof: HTMLButtonElement,
    polymorphicPropName: 'component',
    testPolymorphicPropWith: 'a',
  }));

  describe('root', () => {
    it('children을 label 슬롯 내부에 렌더링해야 한다', () => {
      render(<Button>Hello</Button>);

      const button = screen.getByRole('button', { name: 'Hello' });
      const label = button.querySelector(`.${buttonClasses.label}`);

      expect(button).toHaveClass(buttonClasses.root);
      expect(label).toBeInTheDocument();
      expect(label).toHaveTextContent('Hello');
    });

    it('href가 제공되면 링크로 렌더링해야 한다', () => {
      render(<Button href="/docs">Docs</Button>);

      expect(screen.getByRole('link', { name: 'Docs' })).toHaveAttribute('href', '/docs');
    });
  });

  describe('icons', () => {
    it('startIcon을 렌더링해야 한다', () => {
      render(<Button startIcon={<span>start icon</span>}>Hello</Button>);

      const button = screen.getByRole('button', { name: 'Hello' });
      const startIcon = button.querySelector(`.${buttonClasses.startIcon}`);

      expect(startIcon).toBeInTheDocument();
      expect(startIcon).toHaveTextContent('start icon');
    });

    it('endIcon을 렌더링해야 한다', () => {
      render(<Button endIcon={<span>end icon</span>}>Hello</Button>);

      const button = screen.getByRole('button', { name: 'Hello' });
      const endIcon = button.querySelector(`.${buttonClasses.endIcon}`);

      expect(endIcon).toBeInTheDocument();
      expect(endIcon).toHaveTextContent('end icon');
    });

    it('startIcon은 label 앞에, endIcon은 label 뒤에 렌더링되어야 한다', () => {
      render(
        <Button startIcon={<span>start</span>} endIcon={<span>end</span>}>
          Hello
        </Button>,
      );

      const button = screen.getByRole('button', { name: 'Hello' });
      const elements = Array.from(button.children) as HTMLElement[];

      expect(elements[0]).toHaveClass(buttonClasses.startIcon);
      expect(elements[1]).toHaveClass(buttonClasses.label);
      expect(elements[2]).toHaveClass(buttonClasses.endIcon);
    });
  });

  describe('loading', () => {
    it('기본적으로 progressbar를 렌더링하지 않아야 한다', () => {
      render(<Button>Save</Button>);

      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    it('loading 상태일 때 기본 spinner를 렌더링해야 한다', () => {
      render(<Button loading>Save</Button>);

      const button = screen.getByRole('button', { name: 'Save' });
      const progressbar = within(button).getByRole('progressbar');
      const spinner = button.querySelector(`.${buttonClasses.spinner}`);

      expect(button).toHaveClass(buttonClasses.loading);
      expect(progressbar).toBeInTheDocument();
      expect(spinner).toBeInTheDocument();
    });

    it('커스텀 loading indicator를 렌더링해야 한다', () => {
      render(
        <Button loading loadingIndicator={<span>loading…</span>}>
          Save
        </Button>,
      );

      const button = screen.getByRole('button', { name: 'Save' });
      const progressbar = within(button).getByRole('progressbar');

      expect(progressbar).toHaveTextContent('loading…');
    });

    it('progressbar의 이름은 버튼 label로 연결되어야 한다', () => {
      render(<Button loading>Submit</Button>);

      const button = screen.getByRole('button', { name: 'Submit' });
      const progressbar = within(button).getByRole('progressbar', { name: 'Submit' });

      expect(button).toBeInTheDocument();
      expect(progressbar).toBeInTheDocument();
    });

    it('loading 상태일 때 네이티브 button은 비활성화되어야 한다', () => {
      render(<Button loading>Submit</Button>);

      expect(screen.getByRole('button', { name: 'Submit' })).toBeDisabled();
    });

    it('loading 상태일 때 링크에는 aria-disabled가 설정되어야 한다', () => {
      render(
        <Button href="/docs" loading>
          Docs
        </Button>,
      );

      expect(screen.getByRole('link', { name: 'Docs' })).toHaveAttribute('aria-disabled', 'true');
    });

    it('기본(center) loading에서는 loader가 label 앞에 렌더링되어야 한다', () => {
      render(<Button loading>Save</Button>);

      const button = screen.getByRole('button', { name: 'Save' });
      const elements = Array.from(button.children) as HTMLElement[];

      expect(button).toHaveClass(buttonClasses.loadingPositionCenter);
      expect(elements[0]).toHaveClass(buttonClasses.loadingWrapper);
      expect(elements[1]).toHaveClass(buttonClasses.label);
    });

    it('loadingPosition="start"이면 start placeholder와 loader를 렌더링해야 한다', () => {
      render(
        <Button loading loadingPosition="start">
          Save
        </Button>,
      );

      const button = screen.getByRole('button', { name: 'Save' });
      const elements = Array.from(button.children) as HTMLElement[];
      const startIcon = button.querySelector(`.${buttonClasses.startIcon}`);
      const placeholder = button.querySelector(`.${buttonClasses.loadingIconPlaceholder}`);

      expect(button).toHaveClass(buttonClasses.loadingPositionStart);
      expect(elements[0]).toHaveClass(buttonClasses.startIcon);
      expect(elements[1]).toHaveClass(buttonClasses.loadingWrapper);
      expect(elements[2]).toHaveClass(buttonClasses.label);
      expect(startIcon).toBeInTheDocument();
      expect(placeholder).toBeInTheDocument();
    });

    it('loadingPosition="end"이면 end placeholder와 loader를 렌더링해야 한다', () => {
      render(
        <Button loading loadingPosition="end">
          Save
        </Button>,
      );

      const button = screen.getByRole('button', { name: 'Save' });
      const elements = Array.from(button.children) as HTMLElement[];
      const endIcon = button.querySelector(`.${buttonClasses.endIcon}`);
      const placeholder = button.querySelector(`.${buttonClasses.loadingIconPlaceholder}`);

      expect(button).toHaveClass(buttonClasses.loadingPositionEnd);
      expect(elements[0]).toHaveClass(buttonClasses.label);
      expect(elements[1]).toHaveClass(buttonClasses.loadingWrapper);
      expect(elements[2]).toHaveClass(buttonClasses.endIcon);
      expect(endIcon).toBeInTheDocument();
      expect(placeholder).toBeInTheDocument();
    });

    it('loading 위치와 같은 아이콘 슬롯이 제공되면 해당 슬롯을 유지해야 한다', () => {
      render(
        <Button loading loadingPosition="start" startIcon={<span>icon</span>}>
          Save
        </Button>,
      );

      const button = screen.getByRole('button', { name: 'Save' });
      const startIcon = button.querySelector(`.${buttonClasses.startIcon}`);

      expect(startIcon).toBeInTheDocument();
      expect(startIcon).toHaveTextContent('icon');
      expect(within(button).getByRole('progressbar')).toBeInTheDocument();
    });
  });
});

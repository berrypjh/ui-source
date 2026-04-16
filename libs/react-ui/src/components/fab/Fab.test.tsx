import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';

import { Fab } from './Fab';
import { fabClasses } from './Fab.constants';
import { createRenderer, describeConformance } from '../../../test';

describe('<Fab />', () => {
  const { render } = createRenderer();

  describeConformance(<Fab aria-label="add" icon={<span aria-hidden="true">+</span>} />, () => ({
    render,
    classes: fabClasses,
    refInstanceof: HTMLButtonElement,
    polymorphicPropName: 'component',
    testPolymorphicPropWith: 'a',
  }));

  describe('root', () => {
    it('기본적으로 button으로 렌더링되어야 한다', () => {
      render(<Fab aria-label="add" icon={<span aria-hidden="true">+</span>} />);

      expect(screen.getByRole('button', { name: 'add' })).toHaveClass(fabClasses.root);
    });

    it('href가 제공되면 링크로 렌더링되어야 한다', () => {
      render(<Fab href="/create" aria-label="create" icon={<span aria-hidden="true">+</span>} />);

      expect(screen.getByRole('link', { name: 'create' })).toHaveAttribute('href', '/create');
    });

    it('icon 콘텐츠를 렌더링해야 한다', () => {
      render(<Fab aria-label="add" icon={<span data-testid="fab-icon">+</span>} />);

      const button = screen.getByRole('button', { name: 'add' });
      const icon = button.querySelector(`.${fabClasses.icon}`);

      expect(icon).toBeInTheDocument();
      expect(screen.getByTestId('fab-icon')).toBeInTheDocument();
    });

    it('label 콘텐츠를 렌더링해야 한다', () => {
      render(
        <Fab shape="extended" icon={<span aria-hidden="true">+</span>}>
          Create
        </Fab>,
      );

      const button = screen.getByRole('button', { name: 'Create' });
      const label = button.querySelector(`.${fabClasses.label}`);

      expect(label).toBeInTheDocument();
      expect(label).toHaveTextContent('Create');
    });
  });

  describe('prop: shape', () => {
    it('기본적으로 circular shape를 사용해야 한다', () => {
      render(<Fab aria-label="add" icon={<span aria-hidden="true">+</span>} />);

      expect(screen.getByRole('button', { name: 'add' })).toHaveClass(fabClasses.circular);
    });

    it('extended class를 적용해야 한다', () => {
      render(
        <Fab shape="extended" icon={<span aria-hidden="true">+</span>}>
          Create
        </Fab>,
      );

      expect(screen.getByRole('button', { name: 'Create' })).toHaveClass(fabClasses.extended);
    });
  });

  describe('prop: size', () => {
    it('sm size class를 적용해야 한다', () => {
      render(<Fab size="sm" aria-label="small" icon={<span aria-hidden="true">+</span>} />);

      expect(screen.getByRole('button', { name: 'small' })).toHaveClass(fabClasses.sizeSm);
    });

    it('md size class를 적용해야 한다', () => {
      render(<Fab size="md" aria-label="medium" icon={<span aria-hidden="true">+</span>} />);

      expect(screen.getByRole('button', { name: 'medium' })).toHaveClass(fabClasses.sizeMd);
    });

    it('기본적으로 lg size class를 적용해야 한다', () => {
      render(<Fab aria-label="large" icon={<span aria-hidden="true">+</span>} />);

      expect(screen.getByRole('button', { name: 'large' })).toHaveClass(fabClasses.sizeLg);
    });
  });

  describe('prop: color', () => {
    it('기본적으로 primary color class를 적용해야 한다', () => {
      render(<Fab aria-label="primary-default" icon={<span aria-hidden="true">+</span>} />);

      expect(screen.getByRole('button', { name: 'primary-default' })).toHaveClass(
        fabClasses.colorPrimary,
      );
    });

    it('primary/secondary color class를 적용해야 한다', () => {
      const view = render(
        <Fab color="primary" aria-label="primary" icon={<span aria-hidden="true">+</span>} />,
      );

      expect(screen.getByRole('button', { name: 'primary' })).toHaveClass(fabClasses.colorPrimary);

      view.setProps({
        color: 'secondary',
        'aria-label': 'secondary',
        icon: <span aria-hidden="true">+</span>,
      });

      expect(screen.getByRole('button', { name: 'secondary' })).toHaveClass(
        fabClasses.colorSecondary,
      );
    });
  });

  describe('prop: disabled', () => {
    it('네이티브 button을 비활성화해야 한다', () => {
      render(<Fab disabled aria-label="disabled" icon={<span aria-hidden="true">+</span>} />);

      expect(screen.getByRole('button', { name: 'disabled' })).toBeDisabled();
    });

    it('링크 host에는 aria-disabled를 설정해야 한다', () => {
      render(
        <Fab
          href="/create"
          disabled
          aria-label="create"
          icon={<span aria-hidden="true">+</span>}
        />,
      );

      const link = screen.getByRole('link', { name: 'create' });

      expect(link).toHaveAttribute('aria-disabled', 'true');
      expect(link).toHaveAttribute('tabindex', '-1');
    });
  });
});

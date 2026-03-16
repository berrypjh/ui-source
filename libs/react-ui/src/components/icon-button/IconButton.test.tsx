import { describe, expect, it } from 'vitest';
import { screen, within } from '@testing-library/react';

import { IconButton, iconButtonClasses } from './IconButton';
import { createRenderer, describeConformance } from '../../../test';

describe('<IconButton />', () => {
  const { render } = createRenderer();

  describeConformance(
    <IconButton aria-label="bookmark">
      <span aria-hidden="true">★</span>
    </IconButton>,
    () => ({
      render,
      classes: iconButtonClasses,
      refInstanceof: HTMLButtonElement,
      polymorphicPropName: 'component',
      testPolymorphicPropWith: 'a',
    }),
  );

  describe('root', () => {
    it('children을 렌더링해야 한다', () => {
      render(
        <IconButton aria-label="bookmark">
          <span data-testid="icon">★</span>
        </IconButton>,
      );

      const button = screen.getByRole('button', { name: 'bookmark' });

      expect(button).toHaveClass(iconButtonClasses.root);
      expect(screen.getByTestId('icon')).toBeInTheDocument();
    });

    it('href가 제공되면 링크로 렌더링해야 한다', () => {
      render(
        <IconButton href="/docs" aria-label="docs">
          <span aria-hidden="true">D</span>
        </IconButton>,
      );

      expect(screen.getByRole('link', { name: 'docs' })).toHaveAttribute('href', '/docs');
    });
  });

  describe('prop: size', () => {
    it('sm size class를 적용해야 한다', () => {
      render(
        <IconButton size="sm" aria-label="small">
          <span aria-hidden="true">S</span>
        </IconButton>,
      );

      expect(screen.getByRole('button', { name: 'small' })).toHaveClass(iconButtonClasses.sizeSm);
    });

    it('기본적으로 md size class를 적용해야 한다', () => {
      render(
        <IconButton aria-label="medium">
          <span aria-hidden="true">M</span>
        </IconButton>,
      );

      expect(screen.getByRole('button', { name: 'medium' })).toHaveClass(iconButtonClasses.sizeMd);
    });

    it('lg size class를 적용해야 한다', () => {
      render(
        <IconButton size="lg" aria-label="large">
          <span aria-hidden="true">L</span>
        </IconButton>,
      );

      expect(screen.getByRole('button', { name: 'large' })).toHaveClass(iconButtonClasses.sizeLg);
    });
  });

  describe('prop: edge', () => {
    it('edge="start" class를 적용해야 한다', () => {
      render(
        <IconButton edge="start" aria-label="back">
          <span aria-hidden="true">←</span>
        </IconButton>,
      );

      expect(screen.getByRole('button', { name: 'back' })).toHaveClass(iconButtonClasses.edgeStart);
    });

    it('edge="end" class를 적용해야 한다', () => {
      render(
        <IconButton edge="end" aria-label="next">
          <span aria-hidden="true">→</span>
        </IconButton>,
      );

      expect(screen.getByRole('button', { name: 'next' })).toHaveClass(iconButtonClasses.edgeEnd);
    });

    it('기본적으로 edge class를 적용하지 않아야 한다', () => {
      render(
        <IconButton aria-label="plain">
          <span aria-hidden="true">P</span>
        </IconButton>,
      );

      const button = screen.getByRole('button', { name: 'plain' });

      expect(button).not.toHaveClass(iconButtonClasses.edgeStart);
      expect(button).not.toHaveClass(iconButtonClasses.edgeEnd);
    });
  });

  describe('prop: color', () => {
    it('기본적으로 primary color class를 적용해야 한다', () => {
      render(
        <IconButton aria-label="primary-default">
          <span aria-hidden="true">P</span>
        </IconButton>,
      );

      expect(screen.getByRole('button', { name: 'primary-default' })).toHaveClass(
        iconButtonClasses.colorPrimary,
      );
    });

    it('primary/secondary color class를 적용해야 한다', () => {
      const view = render(
        <IconButton color="primary" aria-label="primary">
          <span aria-hidden="true">P</span>
        </IconButton>,
      );

      expect(screen.getByRole('button', { name: 'primary' })).toHaveClass(
        iconButtonClasses.colorPrimary,
      );

      view.setProps({
        color: 'secondary',
        'aria-label': 'secondary',
        children: <span aria-hidden="true">S</span>,
      });

      expect(screen.getByRole('button', { name: 'secondary' })).toHaveClass(
        iconButtonClasses.colorSecondary,
      );
    });
  });

  describe('prop: disabled', () => {
    it('네이티브 button을 비활성화해야 한다', () => {
      render(
        <IconButton disabled aria-label="disabled">
          <span aria-hidden="true">X</span>
        </IconButton>,
      );

      const button = screen.getByRole('button', { name: 'disabled' });

      expect(button).toBeDisabled();
      expect(button).toHaveClass(iconButtonClasses.disabled);
    });
  });

  describe('prop: loading', () => {
    it('기본적으로 loading wrapper를 렌더링하지 않아야 한다', () => {
      render(
        <IconButton aria-label="bookmark">
          <span aria-hidden="true">★</span>
        </IconButton>,
      );

      const button = screen.getByRole('button', { name: 'bookmark' });

      expect(button.querySelector(`.${iconButtonClasses.loadingWrapper}`)).toBeNull();
      expect(button).not.toBeDisabled();
    });

    it('loading이 false이면 비어 있는 loading wrapper를 렌더링해야 한다', () => {
      render(
        <IconButton loading={false} aria-label="bookmark">
          <span aria-hidden="true">★</span>
        </IconButton>,
      );

      const button = screen.getByRole('button', { name: 'bookmark' });
      const wrapper = button.querySelector(`.${iconButtonClasses.loadingWrapper}`);

      expect(wrapper).toBeInTheDocument();
      expect(within(wrapper as HTMLElement).queryByRole('progressbar')).not.toBeInTheDocument();
      expect(button).not.toBeDisabled();
      expect(button).not.toHaveAttribute('id');
    });

    it('loading 중에는 버튼을 비활성화해야 한다', () => {
      render(
        <IconButton loading aria-label="save">
          <span aria-hidden="true">⚙</span>
        </IconButton>,
      );

      const button = screen.getByRole('button', { name: 'save' });

      expect(button).toBeDisabled();
      expect(button).toHaveClass(iconButtonClasses.loading);
      expect(button).toHaveClass(iconButtonClasses.disabled);
    });

    it('버튼을 이름으로 참조하는 progressbar를 렌더링해야 한다', () => {
      render(
        <IconButton loading aria-label="save">
          <span aria-hidden="true">⚙</span>
        </IconButton>,
      );

      const button = screen.getByRole('button', { name: 'save' });
      const progressbar = within(button).getByRole('progressbar', { name: 'save' });

      expect(progressbar).toBeInTheDocument();
    });

    it('커스텀 loading indicator를 렌더링해야 한다', () => {
      render(
        <IconButton loading aria-label="save" loadingIndicator={<span>loading…</span>}>
          <span aria-hidden="true">⚙</span>
        </IconButton>,
      );

      const button = screen.getByRole('button', { name: 'save' });
      const progressbar = within(button).getByRole('progressbar', { name: 'save' });

      expect(progressbar).toHaveTextContent('loading…');
    });

    it('loading 중에도 제공된 id를 유지해야 한다', () => {
      render(
        <IconButton id="save-button" loading aria-label="save">
          <span aria-hidden="true">⚙</span>
        </IconButton>,
      );

      expect(screen.getByRole('button', { name: 'save' })).toHaveAttribute('id', 'save-button');
    });

    it('loading 중인 링크에는 aria-disabled를 설정해야 한다', () => {
      render(
        <IconButton href="/save" loading aria-label="save link">
          <span aria-hidden="true">⚙</span>
        </IconButton>,
      );

      const link = screen.getByRole('link', { name: 'save link' });

      expect(link).toHaveAttribute('aria-disabled', 'true');
      expect(link).toHaveAttribute('tabindex', '-1');
    });
  });
});

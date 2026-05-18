import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { createRenderer, describeConformance } from '../../../test';

import { SkipLink } from './SkipLink';
import { skipLinkClasses } from './SkipLink.constants';

describe('<SkipLink />', () => {
  const { render } = createRenderer();

  describeConformance(<SkipLink targetId="main">본문으로 건너뛰기</SkipLink>, () => ({
    render,
    classes: skipLinkClasses,
    refInstanceof: HTMLAnchorElement,
    skip: ['polymorphicProp'],
  }));

  describe('root', () => {
    it('a 요소로 children을 렌더링해야 한다', () => {
      render(<SkipLink targetId="main">본문으로 건너뛰기</SkipLink>);

      const link = screen.getByRole('link', { name: '본문으로 건너뛰기' });

      expect(link.tagName.toLowerCase()).toBe('a');
      expect(link).toHaveClass(skipLinkClasses.root);
    });

    it('targetId로 href를 구성해야 한다', () => {
      render(<SkipLink targetId="main-content">Skip</SkipLink>);

      expect(screen.getByRole('link', { name: 'Skip' })).toHaveAttribute('href', '#main-content');
    });

    it('추가 props가 root에 전달되어야 한다', () => {
      render(
        <SkipLink targetId="main" data-testid="skip" aria-label="본문 이동">
          Skip
        </SkipLink>,
      );

      const link = screen.getByTestId('skip');

      expect(link).toHaveAttribute('aria-label', '본문 이동');
    });
  });
});

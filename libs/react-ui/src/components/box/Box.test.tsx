import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { createRenderer, describeConformance } from '../../../test';

import { Box } from './Box';
import { boxClasses } from './Box.constants';

describe('<Box />', () => {
  const { render } = createRenderer();

  describeConformance(<Box>hello</Box>, () => ({
    render,
    classes: boxClasses,
    only: ['mergeClassName', 'propsSpread', 'rootClass'],
  }));

  describe('root', () => {
    it('children을 루트 요소 내부에 렌더링해야 한다', () => {
      render(<Box>Hello</Box>);

      const box = screen.getByText('Hello');

      expect(box).toHaveClass(boxClasses.root);
      expect(box).toHaveTextContent('Hello');
    });

    it('추가 className을 루트에 적용해야 한다', () => {
      render(<Box className="custom-box">Hello</Box>);

      expect(screen.getByText('Hello')).toHaveClass(boxClasses.root);
      expect(screen.getByText('Hello')).toHaveClass('custom-box');
    });

    it('기본적으로 div로 렌더링해야 한다', () => {
      const { container } = render(<Box>Hello</Box>);

      expect(container.firstChild).toHaveProperty('nodeName', 'DIV');
    });
  });

  describe('spacing', () => {
    it('숫자 p 값을 px 단위 padding으로 적용해야 한다', () => {
      render(<Box p={12}>Hello</Box>);

      expect(screen.getByText('Hello')).toHaveStyle({
        paddingTop: '12px',
        paddingRight: '12px',
        paddingBottom: '12px',
        paddingLeft: '12px',
      });
    });

    it('축약 padding보다 방향별 padding이 우선해야 한다', () => {
      render(
        <Box p={12} px={16} pt={20}>
          Hello
        </Box>,
      );

      expect(screen.getByText('Hello')).toHaveStyle({
        paddingTop: '20px',
        paddingRight: '16px',
        paddingBottom: '12px',
        paddingLeft: '16px',
      });
    });

    it('숫자 m 값을 px 단위 margin으로 적용해야 한다', () => {
      render(<Box m={8}>Hello</Box>);

      expect(screen.getByText('Hello')).toHaveStyle({
        marginTop: '8px',
        marginRight: '8px',
        marginBottom: '8px',
        marginLeft: '8px',
      });
    });

    it('축약 margin보다 방향별 margin이 우선해야 한다', () => {
      render(
        <Box m={8} my={10} ml={14}>
          Hello
        </Box>,
      );

      expect(screen.getByText('Hello')).toHaveStyle({
        marginTop: '10px',
        marginRight: '8px',
        marginBottom: '10px',
        marginLeft: '14px',
      });
    });
  });

  describe('visuals', () => {
    it('숫자 radius 값을 px 단위 border-radius로 적용해야 한다', () => {
      render(<Box radius={24}>Hello</Box>);

      expect(screen.getByText('Hello')).toHaveStyle({
        borderRadius: '24px',
      });
    });

    it('style prop이 계산된 스타일을 덮어쓸 수 있어야 한다', () => {
      render(
        <Box p={12} style={{ paddingTop: '40px', marginLeft: '24px' }}>
          Hello
        </Box>,
      );

      expect(screen.getByText('Hello')).toHaveStyle({
        paddingTop: '40px',
        paddingRight: '12px',
        paddingBottom: '12px',
        paddingLeft: '12px',
        marginLeft: '24px',
      });
    });
  });

  describe('html props', () => {
    it('일반 div props를 루트에 전달해야 한다', () => {
      render(
        <Box data-testid="box" title="box title">
          Hello
        </Box>,
      );

      const box = screen.getByTestId('box');

      expect(box).toHaveAttribute('title', 'box title');
      expect(box).toHaveTextContent('Hello');
    });
  });
});

import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { DesignSystemPage } from './DesignSystemPage';

/**
 * 데모 페이지 스모크 + 토큰 참조 무결성.
 *
 * jsdom 은 CSS 변수를 해석하지 않으므로 대비 수치는 확인할 수 없다 (그건 브라우저의 몫이고
 * design-tokens 의 contrast.test.ts 가 값 자체를 보장한다). 여기서는 렌더가 깨지지 않는지와,
 * 페이지가 참조하는 토큰이 실제로 존재하는지를 본다 — CSS 변수 오타는 조용히 실패하기 때문이다.
 */
const renderPage = () =>
  render(
    <MemoryRouter>
      <DesignSystemPage />
    </MemoryRouter>,
  );

describe('DesignSystemPage', () => {
  it('renders without throwing', () => {
    renderPage();
    expect(screen.getByTestId('design-system-page')).toBeTruthy();
  });

  it('groups sections under Overview / Components / Styles', () => {
    renderPage();
    for (const group of ['Overview', 'Components', 'Styles']) {
      expect(screen.getByText(group)).toBeTruthy();
    }
  });

  it('shows every token layer', () => {
    renderPage();
    for (const layer of ['Primitive', 'Semantic', 'Component']) {
      expect(screen.getByText(layer)).toBeTruthy();
    }
  });

  it('lists the accessibility checks with their thresholds', () => {
    renderPage();
    expect(screen.getByText('본문 텍스트')).toBeTruthy();
    expect(screen.getByText('필드 테두리')).toBeTruthy();
    // 비활성 요소는 WCAG 면제임을 표시한다 — 미달로 오해하지 않도록.
    expect(screen.getByText('비활성 요소 면제')).toBeTruthy();
  });

  it('shows all three button colour roles', () => {
    renderPage();
    for (const t of ['color.primaryBtn.*', 'color.secondaryBtn.*', 'color.errorBtn.*']) {
      expect(screen.getByText(t)).toBeTruthy();
    }
  });

  it('flags the error role as not yet exposed through ButtonColor', () => {
    renderPage();
    expect(screen.getByText(/ButtonColor 타입 미노출/)).toBeTruthy();
  });
});

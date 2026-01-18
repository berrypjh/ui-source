import { render } from '@testing-library/react';

import BerrypjhReactUi from './react-ui';

describe('BerrypjhReactUi', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<BerrypjhReactUi />);
    expect(baseElement).toBeTruthy();
  });
});

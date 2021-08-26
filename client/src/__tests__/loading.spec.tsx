/**
 * @jest-environment jsdom
 */

import * as React from 'react';
import { render } from '@testing-library/react';

import Loading from '../components/Loading';

describe('Component Loading()', () => {
  const component = render(<Loading />);
  it('should', () => {
    expect(component.asFragment());
  });
});

/**
 * @jest-environment jsdom
 */

import * as React from 'react';
import { render } from '@testing-library/react';
import HeadLanding from '../components/HeadLanding';

describe('Component HeadLanding()', () => {
  it("should find 'Red' text", () => {
    const { getByText } = render(<HeadLanding />);

    expect(getByText('Red')).toBeInTheDocument();
  });
});

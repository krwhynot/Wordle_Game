import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import Button from './Button';

expect.extend(toHaveNoViolations);

describe('Button Accessibility', () => {
  it('should not have any accessibility violations', async () => {
    const { container } = render(<Button variant="primary">Test Button</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should render with correct accessible name', () => {
    render(<Button variant="primary" aria-label="Accessible Button">Click Me</Button>);
    expect(screen.getByLabelText('Accessible Button')).toBeInTheDocument();
  });
});
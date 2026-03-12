import React from 'react';
import { render, screen } from '@testing-library/react';
import FloatingFeedback from '../components/FloatingFeedback';
import { vi } from 'vitest';

describe('FloatingFeedback', () => {
  it('renders with amount', () => {
    render(<FloatingFeedback amount={42} />);
    expect(screen.getByText('+$42')).toBeInTheDocument();
  });

  it('calls onFinish after duration', () => {
    vi.useFakeTimers();
    const onFinish = vi.fn();
    render(<FloatingFeedback amount={5} duration={1000} onFinish={onFinish} />);
    expect(onFinish).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1000);
    expect(onFinish).toHaveBeenCalled();
    vi.useRealTimers();
  });
});

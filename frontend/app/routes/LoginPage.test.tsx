import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LoginPage from './LoginPage';

// Rqeact-router-dom
vi.mock('react-router-dom', () => ({
  Link: ({ children, to }: any) => <a href={to}>{children}</a>,
}));

describe('LoginPage Test', () => {
  // checks if the LoginPage loads without crashing
  it('loads without crashing', () => {
    const { container } = render(<LoginPage />);
    expect(container).toBeTruthy();
  });

  // checks if the fields to input email and password displays
  it('displays email and password input fields', () => {
    render(<LoginPage />);
    expect(screen.getByLabelText(/email/i)).toBeTruthy();
    expect(screen.getByLabelText(/password/i)).toBeTruthy();
  });

  // checks if the fields to input email and password allows the user to type in it
  it('allows user to type in email and password', () => {
    render(<LoginPage />);
    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    const passwordInput = screen.getByLabelText(/password/i) as HTMLInputElement;
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });
});
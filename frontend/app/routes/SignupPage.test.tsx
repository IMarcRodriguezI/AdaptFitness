import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SignupPage from './SignupPage';

// React-router-dom
vi.mock('react-router-dom', () => ({
  Link: ({ children, to }: any) => <a href={to}>{children}</a>,
}));

describe('SignupPage Test', () => {
  // checks if the SignupPage loads without crashing
  it('loads without crashing', () => {
    const { container } = render(<SignupPage />);
    expect(container).toBeTruthy();
  });

  // checks if the fields to input information displays 
  // checks if the fields to input information displays
  it('displays all required input fields', () => {
    render(<SignupPage />);
    expect(screen.getByLabelText(/first name/i)).toBeTruthy();
    expect(screen.getByLabelText(/last name/i)).toBeTruthy();
    expect(screen.getByLabelText(/^email$/i)).toBeTruthy();
    expect(screen.getByLabelText(/^password$/i)).toBeTruthy();
    expect(screen.getByLabelText(/confirm password/i)).toBeTruthy();
  });

  // checks to see if the user can input their first name
  it('allows user to type in first name', () => {
    render(<SignupPage />);
    const firstNameInput = screen.getByLabelText(/first name/i) as HTMLInputElement;
    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    expect(firstNameInput.value).toBe('John');
  });
});
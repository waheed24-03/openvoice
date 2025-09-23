import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the OpenVoice header', () => {
  render(<App />);
  const titleElement = screen.getByText(/OpenVoice/i);
  expect(titleElement).toBeInTheDocument();
});
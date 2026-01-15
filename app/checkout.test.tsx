import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import CheckoutScreen from './checkout';
import { Alert } from 'react-native';

// -----------------------------
// Mocks
// -----------------------------

// Router mock
const pushMock = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

// Cart store mock
const clearCartMock = jest.fn();

jest.mock('../src/store/useCartStore', () => ({
  useCartStore: (selector: any) =>
    selector({
      cart: {
        1: { price: 100, quantity: 2 },
      },
      clearCart: clearCartMock,
    }),
}));

// Alert mock
jest.spyOn(Alert, 'alert');

// Stripe mocks
let cardChangeHandler: ((details: { complete: boolean }) => void) | undefined;
const mockConfirmPayment = jest.fn();

jest.mock('@stripe/stripe-react-native', () => {
  const React = require('react');
  const { View } = require('react-native');

  return {
    CardField: ({ onCardChange }: any) => {
      cardChangeHandler = onCardChange;
      return <View testID="CardField" />;
    },
    useStripe: () => ({
      confirmPayment: mockConfirmPayment,
    }),
  };
});

// Fetch mock
global.fetch = jest.fn();

// -----------------------------
// Tests
// -----------------------------

describe('CheckoutScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders total price correctly', () => {
    const { getByText } = render(<CheckoutScreen />);

    expect(getByText('Total: $200')).toBeTruthy();
  });

  it('selecting COD clears cart and navigates home', () => {
    const { getByText } = render(<CheckoutScreen />);

    fireEvent.press(getByText('Cash on Delivery'));
    fireEvent.press(getByText('Pay Now'));

    expect(clearCartMock).toHaveBeenCalled();
    expect(pushMock).toHaveBeenCalledWith('/');
  });

  it('shows error if card is incomplete', () => {
    const { getByText } = render(<CheckoutScreen />);

    fireEvent.press(getByText('Pay Now'));

    expect(Alert.alert).toHaveBeenCalledWith(
      'Error',
      'Please enter complete card details'
    );
  });

  it('processes card payment successfully', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ clientSecret: 'secret_123' }),
    });

    mockConfirmPayment.mockResolvedValueOnce({
      paymentIntent: { id: 'pi_123' },
    });

    const { getByText } = render(<CheckoutScreen />);

    // Simulate card completion
    act(() => {
      cardChangeHandler?.({ complete: true });
    });

    fireEvent.press(getByText('Pay Now'));

    await waitFor(() => {
      expect(mockConfirmPayment).toHaveBeenCalled();
      expect(clearCartMock).toHaveBeenCalled();
      expect(pushMock).toHaveBeenCalledWith('/');
    });
  });

  it('handles Stripe payment error', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ clientSecret: 'secret_123' }),
    });

    mockConfirmPayment.mockResolvedValueOnce({
      error: { message: 'Payment failed' },
    });

    const { getByText } = render(<CheckoutScreen />);

    act(() => {
      cardChangeHandler?.({ complete: true });
    });

    fireEvent.press(getByText('Pay Now'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Payment failed',
        'Payment failed'
      );
    });
  });
});

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import CartScreen from "../CartScreen";

/* ----------------------------------
   1️⃣ Mock functions (prefix = mock)
----------------------------------- */
const mockAddToCart = jest.fn();
const mockRemoveFromCart = jest.fn();
const mockClearCart = jest.fn();
const mockPush = jest.fn();

/* ----------------------------------
   2️⃣ Mock Zustand store
----------------------------------- */
jest.mock("../../store/useCartStore", () => ({
  useCartStore: jest.fn((selector) =>
    selector({
      cart: {
        1: {
          id: 1,
          name: "iPhone",
          price: 1000,
          quantity: 2,
          image: "https://example.com/image.png",
        },
      },
      addToCart: mockAddToCart,
      removeFromCart: mockRemoveFromCart,
      clearCart: mockClearCart,
    })
  ),
}));

/* ----------------------------------
   3️⃣ Mock expo-router
----------------------------------- */
jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe("CartScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders cart item and total price", () => {
    const { getByText } = render(<CartScreen />);

    expect(getByText("iPhone")).toBeTruthy();
    expect(getByText("Quantity: 2")).toBeTruthy();
    expect(getByText("$2000")).toBeTruthy();
    expect(getByText("Total: $2000")).toBeTruthy();
  });

  it("pressing + calls addToCart", () => {
    const { getAllByText } = render(<CartScreen />);

    fireEvent.press(getAllByText("+")[0]);

    expect(mockAddToCart).toHaveBeenCalledWith({
      id: 1,
      name: "iPhone",
      price: 1000,
      image: "https://example.com/image.png",
    });
  });

  it("pressing − calls removeFromCart with item id", () => {
    const { getAllByText } = render(<CartScreen />);

    fireEvent.press(getAllByText("−")[0]);

    expect(mockRemoveFromCart).toHaveBeenCalledWith(1);
  });

  it("pressing Clear Cart clears the cart", () => {
    const { getByText } = render(<CartScreen />);

    fireEvent.press(getByText("Clear Cart"));

    expect(mockClearCart).toHaveBeenCalled();
  });

  it("navigates to checkout when Go to Checkout is pressed", () => {
    const { getByText } = render(<CartScreen />);

    fireEvent.press(getByText("Go to Checkout"));

    expect(mockPush).toHaveBeenCalledWith("/checkout");
  });

  it("navigates back to home when Back to Home is pressed", () => {
    const { getByText } = render(<CartScreen />);

    fireEvent.press(getByText("Back to Home"));

    expect(mockPush).toHaveBeenCalledWith("/home");
  });
});

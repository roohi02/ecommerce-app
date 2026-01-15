import React from "react";
import { render, fireEvent } from "@testing-library/react-native";

import HomeScreen from "../HomeScreen";

// ✅ PREFIX WITH `mock`
const mockAddToCart = jest.fn();
const mockRemoveFromCart = jest.fn();

jest.mock("../../store/useCartStore", () => ({
  useCartStore: jest.fn((selector: (state: any) => any) =>
    selector({
      cart: {
        1: { quantity: 2 },
      },
      addToCart: mockAddToCart,
      removeFromCart: mockRemoveFromCart,
    })
  ),
}));

jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe("HomeScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("pressing + calls addToCart", () => {
    const { getAllByText } = render(<HomeScreen />);

    fireEvent.press(getAllByText("+")[0]);

    expect(mockAddToCart).toHaveBeenCalled();
  });

  it("pressing − calls removeFromCart", () => {
    const { getAllByText } = render(<HomeScreen />);

    fireEvent.press(getAllByText("−")[0]);

    expect(mockRemoveFromCart).toHaveBeenCalledWith(1);
  });
});

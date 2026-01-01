// app/checkout.tsx
import React, { useState } from "react";
import { View, Text, Button, TouchableOpacity, Alert } from "react-native";
import { useStripe, CardField } from "@stripe/stripe-react-native";
import { useCartStore } from "../src/store/useCartStore";
import { useRouter } from "expo-router";

const BACKEND_URL = "http://192.168.0.30:4242"; // your machine LAN IP

export default function CheckoutScreen() {
  const { confirmPayment } = useStripe();
  const router = useRouter();

  const cart = useCartStore((state) => state.cart);
  const clearCart = useCartStore((state) => state.clearCart);

  const [selectedMethod, setSelectedMethod] = useState<"card" | "cod">("card");
  const [cardComplete, setCardComplete] = useState(false);
  const [loading, setLoading] = useState(false);

  const cartItems = Object.entries(cart)
    .filter(([_, qty]) => qty > 0)
    .map(([id, qty]) => ({
      id: Number(id),
      price: cart[Number(id)].price,
      quantity: qty,
    }));

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePayment = async () => {
    if (selectedMethod === "cod") {
      Alert.alert("Success", "Order placed with Cash on Delivery");
      clearCart();
      router.push("/"); // Go back to home
      return;
    }

    if (!cardComplete) {
      Alert.alert("Error", "Please enter complete card details");
      return;
    }

    try {
      setLoading(true);

      // 1️⃣ Create PaymentIntent on backend
      const res = await fetch(`${BACKEND_URL}/create-payment-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cartItems }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("PaymentIntent error response:", text);
        throw new Error("Failed to create payment intent");
      }

      const { clientSecret } = await res.json();

      // 2️⃣ Confirm payment with Stripe
      const { paymentIntent, error } = await confirmPayment(clientSecret, {
        paymentMethodType: "Card",
        paymentMethodData: {
          billingDetails: {
            email: "test@example.com",
          },
        },
      });

      if (error) {
        Alert.alert("Payment failed", error.message);
      } else if (paymentIntent) {
        Alert.alert("Success", "Payment successful 🎉");
        clearCart();
        router.push("/"); // Navigate back to home screen
      }
    } catch (err: any) {
      console.error("Payment error:", err);
      Alert.alert("Payment error", err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 p-4 bg-white">
      <Text className="text-3xl font-bold mb-4">Checkout</Text>
      <Text className="text-xl mb-4">Total: ${totalPrice}</Text>

      {/* Payment method selection */}
      <View className="mb-6">
        <Text className="mb-2 font-semibold">Select Payment Method:</Text>
        {["card", "cod"].map((method) => (
          <TouchableOpacity
            key={method}
            onPress={() => setSelectedMethod(method as any)}
            className={`p-3 mb-2 rounded border ${
              selectedMethod === method
                ? "border-blue-500 bg-blue-100"
                : "border-gray-300"
            }`}
          >
            <Text className="text-lg">
              {method === "card" ? "Credit / Debit Card" : "Cash on Delivery"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Card input field */}
      {selectedMethod === "card" && (
        <CardField
          postalCodeEnabled
          placeholders={{ number: "4242 4242 4242 4242" }}
          onCardChange={(cardDetails) => setCardComplete(cardDetails.complete)}
          style={{ height: 50, marginBottom: 20 }}
        />
      )}

      <Button
        title={loading ? "Processing..." : "Pay Now"}
        onPress={handlePayment}
        disabled={loading}
      />
    </View>
  );
}

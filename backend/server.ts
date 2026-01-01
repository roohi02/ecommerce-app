// server.js or server.ts (if using plain JS)
const express = require("express");
const Stripe = require("stripe");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const stripe = new Stripe("");

app.post("/create-payment-intent", async (req, res) => {
  const { items } = req.body;

  try {
    let amount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Ensure minimum amount in cents
    if (amount < 0.5) amount = 0.5; // $0.50 minimum

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // convert to cents
      currency: "usd",
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error("Error creating PaymentIntent:", err);
    res.status(500).json({ error: "PaymentIntent creation failed" });
  }
});

app.listen(4242, () => console.log("Backend running on 4242"));

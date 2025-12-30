// server.js or server.ts (if using plain JS)
const express = require("express");
const Stripe = require("stripe");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const stripe = new Stripe("sk_test_51SfNx3KE1mis6wdMVLJ2ppqLgurE5PpN5csaeo3R4FWz5ZNQWO5qX1KBk9EMWef1hN0Ffrm8UN8MxT1YwviXD0gI00B22gtsx8");

app.post("/create-payment-intent", async (req, res) => {
  const { items } = req.body;

  const amount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100,
    currency: "usd",
  });

  res.json({ clientSecret: paymentIntent.client_secret });
});

app.listen(4242, () => console.log("Backend running on 4242"));

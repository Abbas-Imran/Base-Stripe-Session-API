const express = require("express");
const stripe = require("stripe")(
  "sk_test_51O2KsPEjS12OGlkDpyVRIFMav2Vm9rOBBR91SoyBw0fzaNiCL6fu1n7Sn914EHbxF5Hpmpifcx68UHDfjVOdgvKv00spbgOyOR"
);
const bodyParser = require("body-parser");

const app = express();
const port = 4000; // You can use any port number you prefer

app.use(bodyParser.json());

// API endpoint for creating a Stripe Checkout Session
app.post("/create-checkout-session", async (req, res) => {
  const { priceId, quantity, userId } = req.body;
  console.log({ priceId, quantity, userId });

  try {
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: quantity,
          },
        ],
        mode: 'payment',
        success_url: 'https://yourwebsite.com/success', // Replace with your success URL
        cancel_url: 'https://yourwebsite.com/cancel', // Replace with your cancel URL
        metadata: {
          userId: userId,
        },
      });
      
    console.log(session);
    res.json({ sessionId: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res
      .status(500)
      .json({
        error: "An error occurred while creating the checkout session.",
      });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

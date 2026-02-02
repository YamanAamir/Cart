// const Stripe = require("stripe");
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// const { PrismaClient } = require("@prisma/client");
// const prisma = new PrismaClient();

// const bodyParser = require("body-parser");


// app.post("/checkout/stripe-session", async (req, res) => {
//   try {
//     const { items } = req.body;

//     const line_items = items.map(item => ({
//       price_data: {
//         currency: "usd",
//         product_data: { name: item.name },
//         unit_amount: Math.round(item.price * 100),
//       },
//       quantity: item.qty,
//     }));

//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       mode: "payment",
//       line_items,
//       success_url: `${process.env.FRONTEND_URL}/checkout-success`,
//       cancel_url: `${process.env.FRONTEND_URL}/checkout`,
//     });

//     res.json({ url: session.url });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Stripe session failed" });
//   }
// });

// app.post(
//   "/stripe/webhook",
//   bodyParser.raw({ type: "application/json" }),
//   async (req, res) => {
//     const sig = req.headers["stripe-signature"];

//     let event;
//     try {
//       event = stripe.webhooks.constructEvent(
//         req.body,
//         sig,
//         process.env.STRIPE_WEBHOOK_SECRET
//       );
//     } catch (err) {
//       console.error("Webhook signature failed:", err.message);
//       return res.status(400).send(`Webhook Error`);
//     }

//     // ✅ PAYMENT CONFIRMED
//     if (event.type === "checkout.session.completed") {
//       const session = event.data.object;

//       const items = JSON.parse(session.metadata.items);

//       try {
//         // 🔒 TRANSACTION = SAFE
//         await prisma.$transaction(
//           items.map(item =>
//             prisma.product.update({
//               where: {
//                 id: item.id,
//                 stock: {
//                   gte: item.qty, // prevents negative stock
//                 },
//               },
//               data: {
//                 stock: {
//                   decrement: item.qty,
//                 },
//               },
//             })
//           )
//         );
//       } catch (error) {
//         console.error("Stock update failed:", error);
//         // Optional: alert admin / mark order as failed
//       }
//     }

//     res.json({ received: true });
//   }
// );
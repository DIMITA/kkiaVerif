import express from "express";
import dotenv from "dotenv";
import { kkiapay } from "@kkiapay-org/nodejs-sdk";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// Initialisation du SDK KKiaPay
const kkiapayLd = kkiapay({
    privatekey: process.env.privatekey,
    publickey: process.env.publickey,
    secretkey: process.env.secretkey
  });

app.get("/verifier-kkiapay", async (req, res) => {
  const { transactionId } = req.query;

  if (!transactionId) {
    return res.status(400).json({ message: "transactionId manquant" });
  }

  try {
    const transaction = await kkiapayLd.verifyTransaction(transactionId);
    const redirect = "https://lunevelours.com/kreturn";

    if (transaction.status === "SUCCESS") {
      // ✅ Paiement validé : tu peux créer la commande Shopify ici
      return res.redirect(redirect + "?status=success&tid=" + transactionId);
    } else {
        return res.redirect(redirect + "?status=failed");
    }
  } catch (err) {
    console.error("Erreur KKiaPay :", err.message || err);
    return res.status(500).send("❌ Erreur serveur.");
  }
});

app.listen(port, () => {
  console.log(`Serveur lancé sur http://localhost:${port}`);
});

// lib/initAdmin.ts

import User from "../models/User"


export const initAdminUser = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL!
    const adminPassword = process.env.ADMIN_PASSWORD!

    const existingAdmin = await User.findOne({ email: adminEmail })

    if (!existingAdmin) {
      await User.create({
        firstName: "Super",
        lastName: "Admin",
        email: adminEmail,
        password: adminPassword,
        role: "ADMIN",
        isActive: true,
      })
      console.log("✅ Admin par défaut créé :", adminEmail)
    } else {
      console.log("ℹ️ Admin existe déjà :", adminEmail)
    }
  } catch (err) {
    console.error("❌ Erreur lors de la création de l’admin :", err)
  }
}

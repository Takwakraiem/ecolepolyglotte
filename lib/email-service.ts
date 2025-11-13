import nodemailer from "nodemailer"

// Vérifier que les variables d'environnement sont définies
const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_SECURE,
  SMTP_USER,
  SMTP_PASSWORD,
} = process.env

if (!SMTP_USER || !SMTP_PASSWORD || !SMTP_HOST || !SMTP_PORT) {
  throw new Error("Les variables d'environnement SMTP ne sont pas correctement configurées")
}

// Configuration du transporteur Nodemailer
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  secure: SMTP_SECURE === "true" || Number(SMTP_PORT) === 465, // 465 = SSL
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASSWORD,
  },
})

export interface EmailOptions {
  to: string | string[]
  subject: string
  html: string
  text?: string
}

export async function sendEmail(options: EmailOptions) {
  try {
    const info = await transporter.sendMail({
      from: SMTP_USER,
      to: Array.isArray(options.to) ? options.to.join(",") : options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    })

    console.log("[Email] envoyé avec succès:", info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error: any) {
    console.error("[Email] Erreur lors de l'envoi:", error)
    return { success: false, error: error.message }
  }
}

export function generateTeacherAbsenceEmail(
  studentName: string,
  courseName: string,
  scheduleDate: string,
  scheduleTime: string
) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
        <h2 style="margin: 0;">Notification Importante</h2>
      </div>
      <div style="padding: 20px; background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;">
        <p>Bonjour <strong>${studentName}</strong>,</p>
        <p style="color: #d32f2f; font-weight: bold;">
          ⚠️ Le cours <strong>${courseName}</strong> prévu le <strong>${scheduleDate}</strong> à <strong>${scheduleTime}</strong> est annulé.
        </p>
        <p>Le professeur est absent et ne pourra pas assurer le cours. Nous nous excusons pour ce désagrément.</p>
        <div style="background-color: #e3f2fd; padding: 15px; border-left: 4px solid #2196f3; margin: 20px 0; border-radius: 4px;">
          <p style="margin: 0; color: #1565c0;">
            <strong>Prochaines étapes :</strong><br>
            Un email de rattrapage sera envoyé prochainement avec les modalités de remplacement du cours.
          </p>
        </div>
        <p>Si vous avez des questions, n'hésitez pas à nous contacter.</p>
        <p style="color: #666; font-size: 12px; margin-top: 30px;">
          Cordialement,<br>
          <strong>L'équipe Polyglotte formation</strong>
        </p>
      </div>
    </div>
  `
}
// Email pour prévenir d'une modification de cours
export function generateCourseChangeEmail(
  studentName: string,
  courseName: string,
  scheduleDate: string,
  scheduleTime: string
) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
        <h2 style="margin: 0;">Notification Importante</h2>
      </div>
      <div style="padding: 20px; background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;">
        <p>Bonjour <strong>${studentName}</strong>,</p>

        <p style="color: #1565c0; font-weight: bold;">
          ⚠️ Le cours <strong>${courseName}</strong> prévu le <strong>${scheduleDate}</strong> à <strong>${scheduleTime}</strong> a été modifié.
        </p>

        <p>Veuillez vérifier votre emploi du temps et noter les changements apportés au cours.</p>

        <div style="background-color: #e3f2fd; padding: 15px; border-left: 4px solid #2196f3; margin: 20px 0; border-radius: 4px;">
          <p style="margin: 0; color: #1565c0;">
            Pour toute question, contactez l'administration.
          </p>
        </div>

        <p style="color: #666; font-size: 12px; margin-top: 30px;">
          Cordialement,<br>
          <strong>L'équipe Polyglotte formation</strong>
        </p>
      </div>
    </div>
  `
}

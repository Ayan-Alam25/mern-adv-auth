import { mailtrapClient, sender } from "./mailtrap.config.js";
import { VERIFICATION_EMAIL_TEMPLATE,
  PASSWORD_RESET_REQUEST_TEMPLATE,
 } from "./emailTemplates.js";

export const sendVerificationEmail = async (email, verificationToken) => {
  try {
    if (!mailtrapClient || !sender) {
      throw new Error("Mailtrap client or sender not initialized");
    }

    const response = await mailtrapClient.send({
      from: sender,
      to: [{ email }],
      subject: "Verify your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken
      ),
      category: "Email Verification",
    });

    console.log("✅ Email sent:", response);
    return response;
  } catch (error) {
    console.error("❌ Mailtrap Error:", error.message);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

export const sendWelcomeEmail = async (email, name) => {
  const recipient = [{email}];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      template_uuid: "f3c64b76-55ac-462e-8e6b-219f9dfbd51d",
      template_variables:{
        company_info_name: "Auth Company",
        name: name,
      }
    });
  } catch (error) {
    console.error(`Error sending welcome email`, error);
    throw new Error(`Error sending welcome email: ${error}`)
  }
}

export const sendPasswordResetEmail = async (email, resetURL) => {
	const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Reset your password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
      category: "Password Reset",
    });
  } catch (error) {
    console.error(`Error sending password reset email`, error);

    throw new Error(`Error sending password reset email: ${error}`);
  }
}

export const sendResetSuccessEmail = async(email) => {

}
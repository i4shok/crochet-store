const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendResetCodeEmail = async (to, code) => {
  await transporter.sendMail({
    from: `"Knot & Bloom" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your Password Reset Code",
    html: `
      <div style="font-family: 'Nunito', Arial, sans-serif; max-width: 480px; margin: auto; padding: 36px; background: #FAF7F2; border-radius: 24px;">
        <p style="letter-spacing: 3px; text-transform: uppercase; font-weight: 700; color: #7A9E7E; font-size: 13px; margin-bottom: 6px;">
          🧶 Knot & Bloom
        </p>
        <h2 style="color: #40352C; margin: 0 0 14px;">Reset Your Password</h2>
        <p style="color: #666; font-size: 15px; line-height: 1.7;">
          We received a request to reset your password. Use the verification code below to continue. This code expires in 10 minutes.
        </p>
        <div style="text-align: center; margin: 32px 0;">
          <span style="display: inline-block; padding: 18px 36px; background: #7A9E7E; color: #ffffff; font-size: 30px; font-weight: 700; letter-spacing: 10px; border-radius: 16px;">
            ${code}
          </span>
        </div>
        <p style="color: #999; font-size: 13px; line-height: 1.6;">
          If you did not request a password reset, you can safely ignore this email.
        </p>
      </div>
    `,
  });
};

const sendContactNotificationEmail = async ({ name, email, category, message }) => {

  await transporter.sendMail({

    from: `"Knot & Bloom Website" <${process.env.EMAIL_USER}>`,

    to: process.env.EMAIL_USER,

    subject: `New ${category} Request from ${name}`,

    html: `
      <div style="font-family: 'Nunito', Arial, sans-serif; max-width: 480px; margin: auto; padding: 36px; background: #FAF7F2; border-radius: 24px;">
        <p style="letter-spacing: 3px; text-transform: uppercase; font-weight: 700; color: #7A9E7E; font-size: 13px; margin-bottom: 6px;">
          🧶 Knot & Bloom
        </p>
        <h2 style="color: #40352C; margin: 0 0 14px;">${category}</h2>
        <p style="color: #666; font-size: 15px; line-height: 1.7;">
          <strong>From:</strong> ${name} (${email})
        </p>
        <p style="color: #40352C; font-size: 15px; line-height: 1.7; background: #ffffff; padding: 18px; border-radius: 16px;">
          ${message}
        </p>
      </div>
    `,

  });

};

const sendOrderCancelledEmail = async (to, { orderId, reason }) => {
  await transporter.sendMail({
    from: `"Knot & Bloom" <${process.env.EMAIL_USER}>`,
    to,
    subject: `Your Order #${orderId} Has Been Cancelled`,
    html: `
      <div style="font-family: 'Nunito', Arial, sans-serif; max-width: 480px; margin: auto; padding: 36px; background: #FAF7F2; border-radius: 24px;">
        <p style="letter-spacing: 3px; text-transform: uppercase; font-weight: 700; color: #7A9E7E; font-size: 13px; margin-bottom: 6px;">
          🧶 Knot & Bloom
        </p>
        <h2 style="color: #40352C; margin: 0 0 14px;">Order Cancelled</h2>
        <p style="color: #666; font-size: 15px; line-height: 1.7;">
          Your order <strong>#${orderId}</strong> has been cancelled. Here's the reason our team provided:
        </p>
        <div style="margin: 24px 0; padding: 18px; background: #ffffff; border-radius: 16px; color: #40352C; font-size: 15px; line-height: 1.6;">
          ${reason}
        </div>
        <p style="color: #999; font-size: 13px; line-height: 1.6;">
          If you have any questions, feel free to reach out to us anytime.
        </p>
      </div>
    `,
  });
};

const sendContactReplyEmail = async (to, { name, originalMessage, reply }) => {
  await transporter.sendMail({
    from: `"Knot & Bloom" <${process.env.EMAIL_USER}>`,
    to,
    subject: `Re: Your message to Knot & Bloom`,
    html: `
      <div style="font-family: 'Nunito', Arial, sans-serif; max-width: 480px; margin: auto; padding: 36px; background: #FAF7F2; border-radius: 24px;">
        <p style="letter-spacing: 3px; text-transform: uppercase; font-weight: 700; color: #7A9E7E; font-size: 13px; margin-bottom: 6px;">
          🧶 Knot & Bloom
        </p>
        <h2 style="color: #40352C; margin: 0 0 14px;">Hi ${name},</h2>
        <p style="color: #666; font-size: 15px; line-height: 1.7;">
          Thanks for reaching out. Here's our reply to your message:
        </p>
        <div style="margin: 20px 0; padding: 18px; background: #ffffff; border-radius: 16px; color: #40352C; font-size: 15px; line-height: 1.6;">
          ${reply}
        </div>
        <p style="color: #999; font-size: 13px; line-height: 1.6; margin-top: 24px;">
          Your original message: "${originalMessage}"
        </p>
      </div>
    `,
  });
};

module.exports = {
  sendResetCodeEmail,
  sendContactNotificationEmail,
  sendOrderCancelledEmail,
  sendContactReplyEmail,
};
import dotenv from "dotenv";
dotenv.config();
import { transporter } from "./emailConfig.js";
import { emailTemplate } from "./emailTemplate.js";

const sendMail = (mailData) => {
	return new Promise((resolve, reject) => {
		transporter.sendMail(mailData, (err, info) => {
			if (err) {
				console.error(err);
				reject(err);
			} else {
				console.log(info);
				resolve(info);
			}
		});
	});
};

const sendMailWithRetry = async (mailData, retries = 3) => {
	for (let i = 0; i < retries; i++) {
		try {
			return await sendMail(mailData);
		} catch (error) {
			if (i === retries - 1) throw error;
			console.log(`Retrying sendMail... Attempt ${i + 1}`);
		}
	}
};

// Welcome mail
export async function welcomeMail(userEmail) {
	try {
		let bodyContent = `
      <td style="padding: 20px; line-height: 1.8;">
        <p>Welcome to Difitrades!</p>
        <p>
          We're thrilled to have you as part of our community. At Difitrades, we are
          dedicated to providing the best services and support to our customers.
        </p>
        <p>Best regards</p>
        <p>The Difitrades Team</p>
      </td>
    `;

		let mailOptions = {
			from: `Difitrades ${process.env.SMTP_USER}`,
			to: userEmail,
			subject: "Welcome to Difitrades!",
			html: emailTemplate(bodyContent),
		};

		const result = await sendMailWithRetry(mailOptions);
		return result;
	} catch (error) {
		return { error: error instanceof Error && error.message };
	}
}

export async function otpMail(userEmail, otp) {
	try {
		let bodyContent = `
      <td style="padding: 20px; line-height: 1.8;">
        <p>Dear User,</p>
        <p>Your verification code for Difitrades is:</p>
        <div style="background-color: #f5f5f5; padding: 15px; text-align: center; margin: 20px 0; border-radius: 5px;">
          <span style="font-size: 24px; font-weight: bold; color: #333; letter-spacing: 3px;">${otp}</span>
        </div>
        <p>
          Please enter this code in the verification form to continue. 
          <strong>This code expires in 5 minutes.</strong>
        </p>
        <p>If you didn't request this code, please ignore this email.</p>
        <p>Best regards,</p>
        <p>The Difitrades Team</p>
      </td>
    `;

		let mailOptions = {
			from: `Difitrades <${process.env.SMTP_USER}>`,
			to: userEmail,
			subject: "Difitrades Verification Code",
			html: emailTemplate(bodyContent),
		};

		const result = await sendMailWithRetry(mailOptions);
		return result;
	} catch (error) {
		console.error("OTP email error:", error);
		return { error: error instanceof Error ? error.message : String(error) };
	}
}
// Password reset mail
export async function passwordReset(userEmail) {
	try {
		let bodyContent = `
      <td style="padding: 20px; line-height: 1.8;">
        <p>
          A request was sent for password reset, if this wasn't you please
          contact our customer service. Click the reset link below to proceed
        </p>
        <a href="https://www.difitrades.com/reset-password/newPassword">
          Reset Password
        </a>
        <p>
          If you have questions or need assistance, reach out 
          to our support team at support@difitrades.com.
        </p>
        <p>Best regards</p>
        <p>The Difitrades Team</p>
      </td>
    `;

		let mailOptions = {
			from: `Difitrades ${process.env.SMTP_USER}`,
			to: userEmail,
			subject: "Password Reset!",
			html: emailTemplate(bodyContent),
		};

		const result = await sendMailWithRetry(mailOptions);
		return result;
	} catch (error) {
		return { error: error instanceof Error && error.message };
	}
}

// Alert Admin! mail
export async function alertAdmin(email, amount, date, type) {
	try {
		let bodyContent = `
      <td style="padding: 20px; line-height: 1.8;">
        <p>
            A ${type} request of $${amount} was initiated 
            by a user with this email: ${email}, date: ${date}
        </p>
      </td>
    `;

		let mailOptions = {
			from: `Difitrades ${process.env.SMTP_USER}`,
			to: process.env.SMTP_USER,
			subject: "Admin Alert!",
			html: emailTemplate(bodyContent),
		};

		const result = await sendMailWithRetry(mailOptions);
		return result;
	} catch (error) {
		return { error: error instanceof Error && error.message };
	}
}

// deposit mail
export async function depositMail(fullName, amount, date, email) {
	try {
		let bodyContent = `
      <td style="padding: 20px; line-height: 1.8;">
        <p>Dear ${fullName}</p>
        <p>
          Your deposit of <strong>${amount}</strong>, ${date}, was 
          successful! Your can now use your funds to trade on Difitrades.
        </p>
        <p>
          If you have questions or need assistance, reach out 
          to our support team at support@difitrades.com.
        </p>
        <p>Best regards</p>
        <p>The Difitrades Team</p>
      </td>
    `;

		let mailOptions = {
			from: `Difitrades ${process.env.SMTP_USER}`,
			to: email,
			subject: "Deposit!",
			html: emailTemplate(bodyContent),
		};

		const result = await sendMailWithRetry(mailOptions);
		return result;
	} catch (error) {
		return { error: error instanceof Error && error.message };
	}
}

// withdrawal mail
export async function withdrawalMail(fullName, amount, date, email) {
	try {
		let bodyContent = `
      <td style="padding: 20px; line-height: 1.8;">
        <p>Dear ${fullName}</p>
        <p>
          Your Withdrawal of <strong>${amount}</strong>, 
          ${date}, was successful! Thanks for choosing Difitrades!
        </p>
        <p>
          If you have questions or need assistance, reach out 
          to our support team at support@difitrades.com.
        </p>
        <p>Best regards</p>
        <p>The Difitrades Team</p>
      </td>
    `;

		let mailOptions = {
			from: `Difitrades ${process.env.SMTP_USER}`,
			to: email,
			subject: "Withdrawal!",
			html: emailTemplate(bodyContent),
		};

		const result = await sendMailWithRetry(mailOptions);
		return result;
	} catch (error) {
		return { error: error instanceof Error && error.message };
	}
}

// withdrawal mail
export async function multiMails(emails, subject, message) {
	try {
		let bodyContent = `
      <td style="padding: 20px; line-height: 1.8;">
        <p>
          ${message}
        </p>
        <p>
          If you have questions or need assistance, reach out 
          to our support team at support@difitrades.com.
        </p>
        <p>Best regards</p>
        <p>The Difitrades Team</p>
      </td>
    `;

		let mailOptions = {
			from: `Difitrades ${process.env.SMTP_USER}`,
			to: emails,
			subject: subject,
			html: emailTemplate(bodyContent),
		};

		const result = await sendMailWithRetry(mailOptions);
		return result;
	} catch (error) {
		return { error: error instanceof Error && error.message };
	}
}

// customer support mail
export async function sendContactUsMail({ name, email, subject, message }) {
	try {
		// Compose the email body content
		const bodyContent = `
      <td style="padding: 20px; line-height: 1.8;">
        <p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      </td>
    `;

		// Email options
		const mailOptions = {
			from: `Difitrades <${process.env.SMTP_USER}>`,
			to: process.env.SMTP_USER || "support@difitrades.com",
			subject: `New Contact Us Message: ${subject}`,
			html: emailTemplate(bodyContent),
		};

		// Send the email
		const result = await sendMailWithRetry(mailOptions);

		return result;
	} catch (error) {
		console.error("Error sending contact us mail:", error);
		return { error: error instanceof Error ? error.message : String(error) };
	}
}

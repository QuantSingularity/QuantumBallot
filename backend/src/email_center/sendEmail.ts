import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const createTransporter = () => {
  const port = parseInt(process.env.MAILER_PORT || "587", 10);
  return nodemailer.createTransport({
    service: process.env.MAILER_SERVICE,
    host: process.env.MAILER_HOST,
    port: port,
    secure: port === 465,
    auth: {
      user: process.env.MAILER_USER,
      pass: process.env.MAILER_PASS,
    },
  });
};

const sendEmail = async (
  to: string,
  textContent: string,
  htmlContent: string,
): Promise<void> => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"QuantumBallot Election Committee" <${process.env.MAILER_USER}>`,
    to: to,
    subject: "QuantumBallot Election Credentials",
    text: textContent || "Hello, this is a test ...",
    html: htmlContent || "<b>Hello world?</b>",
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;

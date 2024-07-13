import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "f808fd40404d3a",
        pass: "66aa47935687f2"
    }
});


export default async function sendVerifyEmail(email: any, token: any) {
    try {
        const info = await transporter.sendMail({
            from: '"Kallol Khatua" <api@example.com>',
            to: email,
            subject: "Verify your email",
            html: `<p><a href='${process.env.BASE_URL}/users/verifyemail?token=${token}'>Click here</a> to verify your email <br/> 
            or paste this link in your browser <a>${process.env.BASE_URL}/users/verifyemail?token=${token}</a>
            </p>`,
        });
        return;
    } catch (error) {
        console.log("error while sending email", error);
        throw new Error("error while sending email");
    }
}
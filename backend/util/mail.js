import nodemailer from 'nodemailer';
export const mail = async(reset_url,userMail) => {
    const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'mehakdeepk419@gmail.com',  // Change this to your email
                    pass: 'cyhoptuscjihhnhh'  // Use Google App Password
                } 
            });
    
            const resetUrl = reset_url;
            const mailOptions = {
                from: 'mehakdeepk419@gmail.com',
                to: userMail,
                subject: "Password Reset Request",
                html: `<p>You requested a password reset. Click <a href="${resetUrl}">here</a> to reset your password. This link expires in 1 hour.</p>`
            };
    
            await transporter.sendMail(mailOptions);
            console.log('Mail sent');
}
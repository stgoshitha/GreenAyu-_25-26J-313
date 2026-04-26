const sendEmail = require('../utils/sendEmail');

// @desc    Send contact email
// @route   POST /api/contact
// @access  Public
exports.sendContactEmail = async (req, res, next) => {
  const { name, email, message } = req.body;

  try {
    // Send email to support
    await sendEmail({
      email: process.env.EMAIL_USER,
      subject: `New Contact Inquiry from ${name}`,
      message: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #064e3b;">New Contact Inquiry</h2>
          <p><strong>From:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin-top: 20px;">
            <p style="margin: 0; font-weight: bold;">Message:</p>
            <p style="margin: 5px 0; white-space: pre-wrap;">${message}</p>
          </div>
        </div>
      `,
    });

    // Send confirmation email to user
    try {
        await sendEmail({
            email: email,
            subject: 'We Received Your Message - GreenAyu Agriculture',
            message: `
              <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #22c55e;">Message Received!</h2>
                <p>Hello ${name},</p>
                <p>Thank you for contacting GreenAyu Agriculture. This is a confirmation that we have received your message and our team will get back to you within 24 hours.</p>
                <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin-top: 20px; font-style: italic;">
                  "${message.length > 100 ? message.substring(0, 100) + '...' : message}"
                </div>
                <p style="margin-top: 30px;">Best regards,</p>
                <p style="font-weight: bold;">The GreenAyu Team</p>
              </div>
            `,
          });
    } catch (confErr) {
        console.error('Confirmation email failed:', confErr);
    }

    res.status(200).json({
      success: true,
      message: 'Message sent successfully',
    });
  } catch (err) {
    console.error('Contact email error:', err);
    res.status(500).json({
      success: false,
      message: 'Email could not be sent. Please try again later.',
    });
  }
};

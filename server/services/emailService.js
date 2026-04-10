const nodemailer = require('nodemailer');
const prisma = require('./prisma');

/**
 * @desc    SMTP Email Service (V2)
 * @purpose Dynamically loads configuration from the database and manages email delivery.
 */
class EmailService {
  constructor() {
    this.transporter = null;
  }

  /**
   * @desc    Load SMTP configuration from the database
   */
  async loadConfig() {
    try {
      const config = await prisma.smtpConfig.findFirst();
      if (!config) {
        throw new Error('SMTP Configuration not found in database.');
      }
      return config;
    } catch (err) {
      console.error('[EMAIL-CONFIG-LOAD-FAIL]:', err.message);
      return null;
    }
  }

  /**
   * @desc    Create/Update the nodemailer transporter
   */
  async getTransporter() {
    const config = await this.loadConfig();
    if (!config) return null;

    this.transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure, // true for 465, false for other ports
      auth: {
        user: config.user,
        pass: config.pass,
      },
      tls: {
        rejectUnauthorized: false // In enterprise, this should be configurable
      }
    });

    return this.transporter;
  }

  /**
   * @desc    Verify connection with current settings
   */
  async testConnection(config) {
    const testTransporter = nodemailer.createTransport({
      host: config.host,
      port: parseInt(config.port),
      secure: config.secure,
      auth: {
        user: config.user,
        pass: config.pass,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    try {
      await testTransporter.verify();
      return { success: true, message: 'SMTP connection verified successfully.' };
    } catch (err) {
      console.error('[SMTP-TEST-FAIL]:', err.message);
      return { success: false, error: err.message };
    }
  }

  /**
   * @desc    Send an email (Dynamic Routing)
   */
  async sendMail(options) {
    const transporter = await this.getTransporter();
    if (!transporter) {
      throw new Error('Email service not configured. Update SMTP settings.');
    }

    const config = await this.loadConfig();
    
    return await transporter.sendMail({
      from: config.from,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });
  }
}

module.exports = new EmailService();

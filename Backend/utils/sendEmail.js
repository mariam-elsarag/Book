const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const htmlToText = require("html-to-text");

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.full_name;
    this.from = `book <${process.env.EMAIL_FROM}>`; // Customize your sender email
    this.url = url;
  }

  createNewTransport() {
    if (process.env.NODE_ENV === "production") {
      return nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
    } else {
      return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
    }
  }

  async send(html, subject) {
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.convert(html),
    };

    // Send the email
    await this.createNewTransport().sendMail(mailOptions);
  }

  // Welcome email for new users
  async sendCreateUser() {
    await this.send("Welcome", "Welcome to the Book Club!");
  }

  // Forgot Password email
  async sendPasswordReset() {
    let template = fs.readFileSync(
      path.join(__dirname, `../Views/Email_templates/resetEmail.html`),
      "utf-8"
    );

    const replacements = {
      name: this.firstName,
      resetLink: this.url,
    };
    Object.keys(replacements).forEach((key) => {
      const value = replacements[key];
      template = template.replace(new RegExp(`{{${key}}}`, "g"), value);
    });

    await this.send(html, "Your Password Reset Token (valid for 10 minutes)");
  }
  async sendCreatePassword() {
    let template = fs.readFileSync(
      path.join(__dirname, `../Views/Email_templates/createNewUserEmail.html`),
      "utf-8"
    );

    const replacements = {
      name: this.firstName,
      resetLink: this.url,
    };
    Object.keys(replacements).forEach((key) => {
      const value = replacements[key];
      template = template.replace(new RegExp(`{{${key}}}`, "g"), value);
    });
    await this.send(
      template,
      "Your Password Create Token (valid for 1 time only)"
    );
  }
  async sendCreateNewUserFromAdmin() {}
};

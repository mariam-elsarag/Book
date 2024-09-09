// model
const User = require("../Models/User-model");
// utils
const CatchAsync = require("../utils/catchAsync");
const filterBodyFields = require("../utils/filterBodyFields");
const AppError = require("../utils/appError");
const sendEmail = require("../utils/sendEmail");

exports.createUser = CatchAsync(async (req, res, next) => {
  const errors = [];
  const filterBody = filterBodyFields(
    req.body,
    "first_name",
    "last_name",
    "email",
    "role"
  );

  if (!filterBody.first_name)
    errors.push({ first_name: "First name is required" });
  if (!filterBody.last_name)
    errors.push({ last_name: "Last name is required" });
  if (!filterBody.email) errors.push({ email: "Email is required" });
  if (errors.length > 0) {
    return next(new AppError(errors, 400));
  }

  // send email to user
  const user = await User.create(filterBody);
  // 1- generate token
  const resetToken = user.CreateResetToken(24 * 60);

  await user.save({ validateBeforeSave: false });
  const resetURL = `${process.env.FRONT_SERVER}/create-password/${resetToken}`;

  const html = `
  <h2>Create new password</h2>
  <p>
    Click on the following link to create your password: <a href="${resetURL}">Reset Password</a>.
  </p>
<p>Token will be expire after one day</p>
`;
  try {
    // Send the email
    await sendEmail({
      email: filterBody.email,
      subject: "Create new passowrd Reset",
      html,
    });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError(
        "There was an error while sending the email. Try again later.",
        500
      )
    );
  }

  res.status(201).json({
    message: "Reset password is send",
    resetToken,
  });
});

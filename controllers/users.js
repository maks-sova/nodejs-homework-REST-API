const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const gravatar = require("gravatar");
const fs = require("fs/promises");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const { SECRET_KEY, BASE_URL } = process.env;

const User = require("../models/user");

const {
  HttpError,
  registerSchema,
  sendEmail,
  emailSchema,
} = require("../helpers");

const userRegister = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { error } = registerSchema.validate(req.body);
    if (error) {
      throw HttpError(
        400,
        "Error validation: email or password is not correct"
      );
    }
    const userExist = await User.findOne({ email });
    if (userExist) {
      throw HttpError(409, "Email in use");
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);
    const verificationToken = uuidv4();

    const newUser = await User.create({
      ...req.body,
      password: hashPassword,
      avatarURL,
      verificationToken,
    });

    const verifyEmail = {
      to: email,
      subject: "Verify email",
      html: `<a
          target="_blank"
          href="${BASE_URL}/api/users/verify/${verificationToken}"
        >
          Click verify email
        </a>`,
    };

    sendEmail(verifyEmail);

    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
        avatarURL,
      },
    });
  } catch (error) {
    next(error);
  }
};

const userVerifyEmail = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken });
    if (!user) {
      res.status(404).json({
        message: "User not found",
      });
    }

    await User.findByIdAndUpdate(user._id, {
      verify: true,
      verificationToken: "",
    });

    res.status(200).json({
      message: "Verification successful",
    });
  } catch (error) {
    next(error);
  }
};

const userVerifyEmailRepetedly = async (req, res, next) => {
  try {
    const { email } = req.body;
    const { error } = emailSchema.validate(req.body);
    if (error) {
      throw HttpError(400, "missing required field email");
    }

    const userExist = await User.findOne({ email });
    if (!userExist) {
      throw HttpError(404, "User not found");
    }

    if (userExist.verify) {
      throw HttpError(404, "Verification has already been passed");
    }

    const verifyEmail = {
      to: email,
      subject: "Verify email",
      html: `<a
          target="_blank"
          href="${BASE_URL}/api/users/verify/${userExist.verificationToken}"
        >
          Click verify email
        </a>`,
    };

    sendEmail(verifyEmail);

    res.status(200).json({
      message: "Verification email sent",
    });
  } catch (error) {
    next(error);
  }
};


const userLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { error } = registerSchema.validate(req.body);
    if (error) {
      throw HttpError(
        400,
        "Error validation: email or password is not correct"
      );
    }

    const userExist = await User.findOne({ email });
    if (!userExist) {
      throw HttpError(401, "Email or password is wrong");
    }
     if (!userExist.verify) {
      throw HttpError(401, "Email is not verified");
    }

    const isPasswordRight = await bcrypt.compare(password, userExist.password);
    if (!isPasswordRight) {
      throw HttpError(401, "Email or password is wrong");
    }

    const token = jwt.sign({ id: userExist._id }, SECRET_KEY, {
      expiresIn: "23h",
    });
    await User.findByIdAndUpdate(userExist._id, { token });

    res.json({
      token,
      user: {
        email: userExist.email,
        subscription: userExist.subscription,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

const userCurrent = (req, res, next) => {
  const { email, subscription } = req.user;
  res.status(200).json({
    email,
    subscription,
  });
};

const userLogout = async (req, res, next) => {
  try {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: "" });
    res.status(204);
  } catch (error) {
    next(error);
  }
};

const userUpdateSubscription = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { subscription } = req.body;
    await User.findByIdAndUpdate(
      _id,
      { subscription },
      { runValidators: true }
    );
    res.status(200).json({
      subscription,
    });
  } catch (error) {
    next(error);
  }
};
const userUpdateAvatar = async (req, res, next) => {
 
  try {
    const { _id } = req.user;
    const newDirFile = path.join(__dirname, "../", "public", "avatars");
    const { path: oldPathFile, originalname } = req.file;

    const newPathFile = path.join(newDirFile, `${_id}_${originalname}`);
    await fs.rename(oldPathFile, newPathFile);

    const avatarURL = path.join("avatars", `${_id}_${originalname}`);

    await User.findByIdAndUpdate(_id, { avatarURL });
    res.status(200).json({
      avatarURL,
    });
  } catch (error) {
    next(error);
  }
};


module.exports = {
  userRegister,
  userLogin,
  userCurrent,
  userVerifyEmail,
  userVerifyEmailRepetedly,
  userLogout,
  userUpdateSubscription,
  userUpdateAvatar,
};
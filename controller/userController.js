import Users from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const getUsers = async (req, res) => {
  try {
    const users = await Users.findAll();
    res.json(users);
  } catch (error) {
    console.error(error);
  }
};

export const registerUser = async (req, res) => {
  const { name, email, password, repassword } = req.body;

  if (password !== repassword) {
    return res.status(400).json({
      msg: "Password dan Confirm tidak sama",
    });
  }

  const salt = await bcrypt.genSalt();
  const hashpw = await bcrypt.hash(password, salt);
  try {
    await Users.create({
      name: name,
      email: email,
      password: hashpw,
    });
    res.json({
      msg: "Register Berhasil",
    });
  } catch (error) {
    console.log(error);
  }
};

export const loginUser = async (req, res) => {
  try {
    const user = await Users.findAll({
      where: {
        email: req.body.email,
      },
    });
    const match = await bcrypt.compare(req.body.password, user[0].password);
    if (!match) {
      res.status(400).json({
        msg: "Wrong password",
      });
    }
    const userid = user[0].id;
    const name = user[0].name;
    const email = user[0].email;
    const accessToken = jwt.sign({ userid, name, email }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "20s",
    });
    const refreshToken = jwt.sign({ userid, name, email }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "1d",
    });
    await Users.update(
      { refresh_token: refreshToken },
      {
        where: {
          id: userid,
        },
      }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      // secure : true jika tidak local
    });

    res.json({ accessToken });
  } catch (error) {
    res.status(404).json({
      msg: "email tidak ditemukan",
    });
  }
};

export const Logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);
  const user = await Users.findAll({
    where: {
      refresh_token: refreshToken,
    },
  });
  if (!user[0]) return res.sendStatus(204);
  const userid = user[0].id;
  await Users.update(
    { refresh_token: null },
    {
      where: {
        id: userid,
      },
    }
  );

  res.clearCookie("refreshToken");
  return res.sendStatus(200);
};

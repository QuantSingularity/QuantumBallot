import type { NextFunction, Request, Response } from "express";
import Committee from "../../committee/committee";
import { PROVINCES_PORT } from "../../committee/data_types";
import emailTemplate from "../../email_center/emailTemplate";
import sendEmail from "../../email_center/sendEmail";

const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const router = express.Router();
const cookieParser = require("cookie-parser");

const verifyJWT = require("../../middleware/verifyJWT");
const verifyJWTWeb = require("../../middleware/verifyJWTWeb");
const credentials = require("../../middleware/credentials");

router.use(cookieParser());
router.use(credentials);

const committee = new Committee();

// Async handler to catch errors in async routes
const asyncHandler =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err: any) => {
      console.error(`API Error: ${err.message}`, err);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: process.env.NODE_ENV === "development" ? err.message : undefined,
      });
    });
  };

router.get("/", (_req: Request, res: Response) => {
  res.status(401).json({});
});

router.get("/registers", (_req: Request, res: Response) => {
  res.json({
    registers: committee.getCitizens(),
    note: "Request accepted ...",
  });
});

router.get(
  "/generate-identifiers",
  asyncHandler(async (_req: Request, res: Response) => {
    const ans = await committee.generateIdentifiers();
    res.json({ voters: ans, note: "Request accepted ..." });
  }),
);

router.post(
  "/add-candidate",
  asyncHandler(async (req: Request, res: Response) => {
    const data = req.body;
    if (!data.name || !data.party || !data.code)
      return res.status(400).json({ note: "Rejected." });

    const name = data.name;
    const code = parseInt(data.code, 10);
    const party = data.party;
    const acronym = data.acronym;
    const status = data.status;

    const ans = await committee.addCandidateCommittee(
      name,
      code,
      party,
      acronym,
      status,
    );
    if (ans !== null && ans !== undefined) {
      res.status(200).send({
        note: "Request accepted, candidate added.",
        candidates: ans,
      });
    } else {
      res.status(500).send({ note: "Rejected. Something went wrong ..." });
    }
  }),
);

router.post(
  "/add-user",
  asyncHandler(async (req: Request, res: Response) => {
    const data = req.body;
    if (!data.name || !data.username || !data.role || !data.password)
      return res.status(400).json({ note: "Rejected." });

    const ans = await committee.addUser(data);
    if (ans !== null && ans !== undefined) {
      res.status(201).send({
        note: "Request accepted, user added.",
        users: ans,
      });
    } else {
      res.status(409).send({ note: "Rejected. User already exists." });
    }
  }),
);

router.get(
  "/clear-candidates",
  asyncHandler(async (_req: Request, res: Response) => {
    const candidates = await committee.clearCandidates();
    res.json({ candidates, note: "Request accepted ..." });
  }),
);

router.get(
  "/candidates",
  asyncHandler(async (_req: Request, res: Response) => {
    const ans = await committee.getCandidates();
    if (ans !== null && ans !== undefined) {
      res.json({ candidates: ans, note: "Request accepted ..." });
    } else {
      res.status(500).send({ note: "Rejected. Something went wrong ..." });
    }
  }),
);

router.get(
  "/announcement",
  asyncHandler(async (_req: Request, res: Response) => {
    const ans = await committee.getAnnouncement();
    if (ans !== null && ans !== undefined) {
      res.json({ announcement: ans, note: "Request accepted ..." });
    } else {
      res.status(404).send({ note: "No announcement found." });
    }
  }),
);

router.post(
  "/deploy-announcement",
  asyncHandler(async (req: Request, res: Response) => {
    const data = req.body;
    if (
      !data.startTimeVoting ||
      !data.endTimeVoting ||
      !data.dateResults ||
      !data.numOfCandidates ||
      !data.numOfVoters
    )
      return res.status(400).json({ note: "Rejected." });

    const ans = await committee.deployAnnouncement(data);
    if (ans !== null && ans !== undefined) {
      res.status(201).send({
        note: "Request accepted, announcement deployed.",
      });
    } else {
      res.status(400).send({ note: "Rejected. Something went wrong ..." });
    }
  }),
);

router.get(
  "/users",
  asyncHandler(async (_req: Request, res: Response) => {
    const ans = await committee.getUsers();
    if (ans !== null && ans !== undefined) {
      res.json({ users: ans, note: "Request accepted ..." });
    } else {
      res.status(500).send({ note: "Rejected. Something went wrong ..." });
    }
  }),
);

router.get(
  "/voter-identifiers",
  asyncHandler(async (_req: Request, res: Response) => {
    const ans = await committee.getVotersGenerated();
    res.json({ registers: ans, note: "Request accepted ..." });
  }),
);

router.get(
  "/clear-registers",
  asyncHandler(async (_req: Request, res: Response) => {
    await committee.eraseCitzens();
    res.json({
      registers: committee.getCitizens(),
      note: "Request accepted ...",
    });
  }),
);

router.get(
  "/clear-users",
  asyncHandler(async (_req: Request, res: Response) => {
    await committee.eraseUsers();
    res.json({ users: committee.getUsers(), note: "Request accepted ..." });
  }),
);

router.post(
  "/delete-user",
  asyncHandler(async (req: Request, res: Response) => {
    const data = req.body;
    if (!data.username) return res.status(400).json({ note: "Rejected." });
    const username = data.username;
    const ans = await committee.eraseUser(username);
    if (ans !== null && ans !== undefined) {
      const users = await committee.getUsers();
      res.send({ users: users, note: "Request accepted ..." });
    } else {
      res.status(500).send({ note: "Rejected. Something went wrong ..." });
    }
  }),
);

router.post(
  "/delete-register",
  asyncHandler(async (req: Request, res: Response) => {
    const data = req.body;
    if (!data.electoralId) return res.status(400).json({ note: "Rejected." });
    const electoralId = data.electoralId;
    const ans = await committee.eraseRegister(electoralId);
    if (ans !== null && ans !== undefined) {
      const citizens = await committee.getCitizens();
      res
        .status(200)
        .send({ registers: citizens, note: "Request accepted ..." });
    } else {
      res.status(500).send({ note: "Rejected. Something went wrong ..." });
    }
  }),
);

router.post(
  "/register-voter",
  asyncHandler(async (req: Request, res: Response) => {
    const data = req.body;
    if (
      !data.electoralId ||
      !data.name ||
      !data.email ||
      !data.address ||
      !data.province ||
      !data.password
    )
      return res.status(400).json({ note: "Rejected." });

    try {
      if (await committee.addCitzen(data)) {
        res.status(201).send({
          note: "Request accepted, citizen registered.",
          message:
            "Please hold on there, you might get an e-mail with details on how to access your account, otherwise contact the voter committee.",
          registers: committee.getCitizens(),
        });
      } else {
        res
          .status(409)
          .send({ note: "Rejected. Citizen already exists or invalid data." });
      }
    } catch (e: any) {
      console.log(e);
      res.status(500).send({ note: "Rejected. Something went wrong ..." });
    }
  }),
);

router.post(
  "/update-citizen",
  asyncHandler(async (req: Request, res: Response) => {
    const data = req.body;
    if (
      !data.electoralId ||
      !data.name ||
      !data.email ||
      !data.address ||
      !data.province ||
      !data.status
    )
      return res.status(400).json({ note: "Rejected." });

    const ans = await committee.updateCitizen(data);
    if (ans !== null && ans !== undefined) {
      res.send({
        note: "Request accepted, citizen updated.",
        message: "Success!",
        registers: committee.getCitizens(),
      });
    } else {
      res.status(500).send({ note: "Rejected. Something went wrong ..." });
    }
  }),
);

router.post(
  "/update-user",
  asyncHandler(async (req: Request, res: Response) => {
    const data = req.body;
    if (!data.name || !data.username || !data.role)
      return res.status(400).json({ note: "Rejected." });

    const ans = await committee.updateUser(data);
    if (ans !== null && ans !== undefined) {
      res.send({
        note: "Request accepted, user updated.",
        message: "Success!",
        users: committee.getUsers(),
      });
    } else {
      res.status(500).send({ note: "Rejected. Something went wrong ..." });
    }
  }),
);

router.post(
  "/send-email",
  asyncHandler(async (req: Request, res: Response) => {
    const data = req.body;

    if (!data.email)
      return res.status(400).json({ note: "Rejected. Email is required." });

    try {
      const email = data.email;
      const citizen = committee
        .getCitizens()
        .find((x) => x.email.localeCompare(email) === 0);

      if (!citizen)
        return res.status(404).json({ note: "Rejected. Citizen not found." });

      const otp = citizen.otp;
      const textContent = `Your otp details: ${JSON.stringify(otp)}`;

      let textQRCode = "";
      let htmlContent = "";

      try {
        const qrCodeData = await committee.generateQRCode(otp.otpauth_url);
        if (qrCodeData) {
          textQRCode = qrCodeData;
          htmlContent = emailTemplate(otp, citizen.name, textQRCode);
        }
      } catch (_error: any) {}

      let emailSent = true;

      try {
        await sendEmail(email, textContent, htmlContent);
      } catch (_error: any) {
        emailSent = false;
      }

      if (emailSent) {
        res.status(200).json({ note: "Success" });
      } else {
        res.status(500).json({ note: "Rejected. Failed to send email." });
      }
    } catch (_error: any) {
      res.status(500).json({ note: "Rejected. Internal server error." });
    }
  }),
);

router.post(
  "/verify-otp",
  verifyJWT,
  asyncHandler(async (req: Request, res: Response) => {
    const data = req.body;

    if (!data.email || !data.token || !data.otpCode)
      return res
        .status(400)
        .json({ note: "Rejected. Required fields missing." });

    try {
      const email = data.email;
      const otpCode = data.otpCode;
      const citizen = committee
        .getCitizens()
        .find((x) => x.email.localeCompare(email) === 0);

      if (!citizen)
        return res.status(404).json({ note: "Rejected. Citizen not found." });

      const ans = committee.verifyOtp(citizen.otp.base32, otpCode);

      await new Promise<void>((resolve) => setTimeout(resolve, 1000));

      if (ans) {
        res.status(200).json({ note: "Verified" });
      } else {
        res.status(401).json({ note: "Failed." });
      }
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ note: "Rejected." });
    }
  }),
);

router.post(
  "/auth-mobile",
  asyncHandler(async (req: Request, res: Response) => {
    const data = req.body;
    const electoralId = data.electoralId;
    const password = data.password;

    if (!electoralId || !password)
      return res
        .status(400)
        .json({ message: "Electoral ID and password are required." });

    try {
      const ans = await committee.authMobile(electoralId, password);

      if (!ans) {
        return res.status(401).send({ note: "Rejected. Invalid credentials." });
      }

      const accessToken = jwt.sign(
        { electoralId: ans.electoralId },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "10m" },
      );

      const refreshToken = jwt.sign(
        { electoralId: ans.electoralId },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "5d" },
      );

      await committee.updateTokenCitzen(electoralId, refreshToken);

      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        sameSite: "none",
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000,
      });

      const province = ans.province as keyof typeof PROVINCES_PORT;

      return res.status(201).send({
        accessToken: accessToken,
        email: ans.email,
        port: PROVINCES_PORT[province] || null,
      });
    } catch (_error: any) {
      res.status(500).send({ note: "Internal server error" });
    }
  }),
);

router.post(
  "/auth-web",
  asyncHandler(async (req: Request, res: Response) => {
    const data = req.body;
    const username = data.username;
    const password = data.password;

    if (!username || !password)
      return res
        .status(400)
        .json({ message: "Username and password are required." });

    try {
      const ans = await committee.authWeb(username, password);

      if (!ans) {
        return res.status(401).send({ note: "Rejected. Invalid credentials." });
      }

      const accessToken = jwt.sign(
        { username: ans.username },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "60m" },
      );

      const refreshToken = jwt.sign(
        { username: ans.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "5d" },
      );

      await committee.updateTokenUser(username, refreshToken);

      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        sameSite: "Strict",
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000,
      });

      return res.status(201).send({
        accessToken: accessToken,
        refreshToken: refreshToken,
        username: username,
        name: ans.name,
        role: ans.role,
      });
    } catch (_error: any) {
      res.status(500).send({ note: "Internal server error" });
    }
  }),
);

router.get("/refresh-token", verifyJWT, (req: Request, res: Response) => {
  try {
    const cookieHeader = req.headers.cookie;
    if (!cookieHeader) return res.sendStatus(403);

    const cookieParts = cookieHeader.split("=");
    if (cookieParts.length < 2) return res.sendStatus(403);

    const cookies = { jwt: cookieParts.slice(1).join("=") };

    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;

    const foundUser = committee
      .getCitizens()
      .find((x) => x.refreshToken.localeCompare(refreshToken) === 0);
    if (!foundUser) return res.sendStatus(403);

    return jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err: any, decoded: any) => {
        if (err || foundUser.electoralId !== decoded.electoralId)
          return res.sendStatus(403);

        const accessToken = jwt.sign(
          { electoralId: decoded.electoralId },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "60m" },
        );

        return res.status(200).json({ accessToken });
      },
    );
  } catch (_error: any) {
    return res.sendStatus(500);
  }
});

router.get(
  "/refresh-token-web",
  asyncHandler(async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    if (!token) return res.sendStatus(401);

    try {
      const refreshToken = token;
      const foundUser = committee
        .getUsers()
        .find((x) => x.refreshToken === refreshToken);

      if (!foundUser) return res.sendStatus(403);

      return jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err: any, decoded: any) => {
          if (err || foundUser.username !== decoded.username) {
            return res.sendStatus(403);
          }

          const newAccessToken = jwt.sign(
            { username: decoded.username },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "600s" },
          );

          const newRefreshToken = jwt.sign(
            { username: decoded.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "1d" },
          );

          await committee.updateTokenUser(foundUser.username, newRefreshToken);

          res.cookie("jwt", newAccessToken, {
            httpOnly: true,
            sameSite: "Strict",
            secure: process.env.NODE_ENV === "production",
            maxAge: 24 * 60 * 60 * 1000,
          });
          return res.status(200).send({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
          });
        },
      );
    } catch (_error: any) {
      return res.sendStatus(500);
    }
  }),
);

router.get("/log-out", (req: Request, res: Response) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204);
  const refreshToken = cookies.jwt;

  const foundUser = committee
    .getCitizens()
    .find((x) => x.refreshToken === refreshToken);
  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });
    return res.sendStatus(204);
  }

  committee.updateTokenCitzen(foundUser.electoralId, "");

  res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });
  res.sendStatus(204);
});

router.get("/log-out-web", (req: Request, res: Response) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204);
  const refreshToken = cookies.jwt;

  const foundUser = committee
    .getUsers()
    .find((x) => x.refreshToken === refreshToken);
  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });
    return res.sendStatus(204);
  }

  committee.updateTokenUser(foundUser.username, "");

  res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });
  res.sendStatus(204);
});

module.exports = router;

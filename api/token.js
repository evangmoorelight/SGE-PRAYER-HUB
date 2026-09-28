const {
  RtcTokenBuilder,
  RtcRole
} = require("agora-access-token");

module.exports = function handler(req, res) {

  res.setHeader("Content-Type", "application/json");

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {

    const appId = process.env.AGORA_APP_ID;
    const appCertificate =
      process.env.AGORA_APP_CERTIFICATE;

    if (!appId || !appCertificate) {
      return res.status(500).json({
        error: "Agora environment variables are missing"
      });
    }

    const body = req.body || {};

    const channelName = body.channelName;
    const uid = Number(body.uid);

    if (!channelName) {
      return res.status(400).json({
        error: "Channel name is required"
      });
    }

    const userUid =
      Number.isFinite(uid) && uid > 0
        ? uid
        : Math.floor(Math.random() * 1000000000);

    const privilegeExpiredTs =
      Math.floor(Date.now() / 1000) + 3600;

    const token =
      RtcTokenBuilder.buildTokenWithUid(
        appId,
        appCertificate,
        channelName,
        userUid,
        RtcRole.PUBLISHER,
        privilegeExpiredTs
      );

    return res.status(200).json({
      token,
      appId,
      channelName,
      uid: userUid,
      expiresAt: privilegeExpiredTs
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      error: "Token generation failed",
      message: error.message
    });
  }
};

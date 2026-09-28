const { RtcTokenBuilder, RtcRole } = require("agora-token");

module.exports = async function handler(req, res) {
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
        error: "Agora App ID or App Certificate is missing"
      });
    }

    const { channelName, uid } = req.body || {};

    if (!channelName) {
      return res.status(400).json({
        error: "Channel name is required"
      });
    }

    const userUid =
      Number(uid) > 0
        ? Number(uid)
        : Math.floor(Math.random() * 2000000000);

    const tokenExpiration = 3600;
    const privilegeExpiration = 3600;

    const token =
      RtcTokenBuilder.buildTokenWithUid(
        appId,
        appCertificate,
        channelName,
        userUid,
        RtcRole.PUBLISHER,
        tokenExpiration,
        privilegeExpiration
      );

    return res.status(200).json({
      token: token,
      appId: appId,
      channelName: channelName,
      uid: userUid
    });

  } catch (error) {
    console.error("Agora token error:", error);

    return res.status(500).json({
      error: "Token generation failed",
      message: error.message
    });
  }
};

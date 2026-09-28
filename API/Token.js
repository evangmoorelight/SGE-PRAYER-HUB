const { RtcTokenBuilder, RtcRole } = require("agora-access-token");

module.exports = async (req, res) => {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const {
      channelName,
      uid
    } = req.body || {};

    if (!channelName) {
      return res.status(400).json({
        error: "Channel name is required"
      });
    }

    const appId = process.env.AGORA_APP_ID;
    const appCertificate = process.env.AGORA_APP_CERTIFICATE;

    if (!appId || !appCertificate) {
      return res.status(500).json({
        error: "Agora environment variables are not configured"
      });
    }

    const userId = Number(uid) || Math.floor(Math.random() * 1000000000);

    // Token expires in 1 hour
    const expirationTimeInSeconds = 3600;

    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs =
      currentTimestamp + expirationTimeInSeconds;

    const token = RtcTokenBuilder.buildTokenWithUid(
      appId,
      appCertificate,
      channelName,
      userId,
      RtcRole.PUBLISHER,
      privilegeExpiredTs
    );

    return res.status(200).json({
      token,
      appId,
      channelName,
      uid: userId,
      expiresAt: privilegeExpiredTs
    });

  } catch (error) {
    console.error("Token generation error:", error);

    return res.status(500).json({
      error: "Unable to generate Agora token"
    });
  }
};

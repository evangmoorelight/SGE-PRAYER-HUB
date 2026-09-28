const { RtcTokenBuilder, RtcRole } = require("agora-access-token");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const { channelName, uid } = req.body || {};

    if (!channelName) {
      return res.status(400).json({
        error: "Channel name is required."
      });
    }

    if (!uid) {
      return res.status(400).json({
        error: "UID is required."
      });
    }

    const appId = process.env.AGORA_APP_ID;
    const appCertificate =
      process.env.AGORA_APP_CERTIFICATE;

    if (!appId || !appCertificate) {
      return res.status(500).json({
        error:
          "Agora environment variables are missing in Vercel."
      });
    }

    const token = RtcTokenBuilder.buildTokenWithUid(
      appId,
      appCertificate,
      channelName,
      Number(uid),
      RtcRole.PUBLISHER,
      3600,
      3600
    );

    return res.status(200).json({
      token
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      error:
        error.message ||
        "Unable to generate Agora token."
    });
  }
};

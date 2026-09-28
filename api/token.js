const { RtcTokenBuilder, RtcRole } = require("agora-access-token");

module.exports = async (req, res) => {

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {

    const appId =
      process.env.AGORA_APP_ID;

    const appCertificate =
      process.env.AGORA_APP_CERTIFICATE;


    if (!appId || !appCertificate) {

      return res.status(500).json({
        error:
          "Agora environment variables are missing."
      });

    }


    const {
      channelName,
      uid
    } = req.body || {};


    if (!channelName) {

      return res.status(400).json({
        error:
          "channelName is required."
      });

    }


    const numericUid =
      Number(uid);


    if (
      !numericUid ||
      !Number.isInteger(numericUid)
    ) {

      return res.status(400).json({
        error:
          "A valid numeric UID is required."
      });

    }


    /*
      TOKEN VALID FOR 1 HOUR
    */

    const expirationInSeconds =
      60 * 60;


    const privilegeExpiredTs =
      Math.floor(
        Date.now() / 1000
      ) + expirationInSeconds;


    const token =
      RtcTokenBuilder.buildTokenWithUid(

        appId,

        appCertificate,

        channelName,

        numericUid,

        RtcRole.PUBLISHER,

        privilegeExpiredTs

      );


    return res.status(200).json({

      token,

      appId,

      channelName,

      uid: numericUid,

      expiresIn:
        expirationInSeconds

    });


  } catch (error) {

    console.error(
      "Token generation error:",
      error
    );


    return res.status(500).json({

      error:
        "Unable to generate Agora token."

    });

  }

};

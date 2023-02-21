/**
 * This is the code snippet for the POAP Status Report
 * Go to https://defender.openzeppelin.com/#/autotask, and edit the code snippet
 * to match the code below.
 *
 * Make sure to tweak the URL to match your ngrok URL
 */

const axios = require("axios");

exports.handler = async function (credentials, context) {
  const { notificationClient } = context;

  try {
    const { data } = await axios.get(
      "https://7b72-152-231-128-16.ngrok.io/statistics"
    );

    let subject = `${
      parseInt(data.availableClaimCodesCount) < 20
        ? "ACTION REQUIRED - "
        : "INFO - "
    }Aragon POAP Status Report`;

    let message =
      "gm, Aragon!<br/><br/>Here you can find the current status of claim codes:<br/><br/>";

    message += `<strong>Available Claim Codes:</strong> ${data.availableClaimCodesCount}<br/>`;
    message += `<strong>Assigned Claim Codes</strong>: ${data.assignedClaimCodesCount}<br/>`;
    message += `<strong>Minted Claim Codes</strong>: ${data.mintedClaimCodesCount}<br/>`;
    message += `<strong>Claim Codes expiring in less than ${data.expirationWarning.expiringInLessThanDays} days:</strong> ${data.expirationWarning.claimCodesCount}<br/>`;
    message += `<strong>Failed Syncs Attempts available to retry:</strong> ${data.pendingSyncs.length}<br/><br/>`;

    message += `Cheers,<br/>Aragon POAP Autotask`;

    try {
      notificationClient.send({
        channelAlias: "test-mailer",
        subject,
        message,
      });
    } catch (error) {
      console.error(error);
      notificationClient.send({
        channelAlias: "test-mailer",
        subject: "Error running mailer",
        message: JSON.stringify(error),
      });
    }
  } catch (error) {
    notificationClient.send({
      channelAlias: "test-mailer",
      subject: "Error calling endpoint",
      message: JSON.stringify(error),
    });
  }
};

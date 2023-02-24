/**
 * This is the code snippet for the POAP Status Report
 * Go to https://defender.openzeppelin.com/#/autotask, and edit the code snippet
 * to match the code below.
 *
 */

const axios = require("axios");

exports.handler = async function (credentials, context) {
  const { notificationClient } = context;

  try {
    // TODO: Replace with corresponding environment domain
    const { data } = await axios.get(
      "https://poap-claim-api-dev.aragon.org/statistics"
    );

    const limit = 200;
    const overLimit = parseInt(data.availableClaimCodesCount) < limit;

    let subject = `${
      overLimit ? "ACTION REQUIRED - " : "INFO - "
    }Aragon POAP Status Report`;

    const message = `
      <p>gm, Aragon!</p>
      <p>Here you can find the current status of claim codes:</p>
      <ul>
        <li><strong>Available Claim Codes:</strong> ${
          data.availableClaimCodesCount
        }</li>
        <li><strong>Assigned Claim Codes</strong>: ${
          data.assignedClaimCodesCount
        }</li>
        <li><strong>Minted Claim Codes</strong>: ${
          data.mintedClaimCodesCount
        }</li>
        <li><strong>Claim Codes expiring in less than ${
          data.expirationWarning.expiringInLessThanDays
        } days:</strong> ${data.expirationWarning.claimCodesCount}</li>
        <li><strong>Failed Syncs Attempts available to retry:</strong> ${
          data.pendingSyncs.length
        }</li>
      </ul>
      ${
        overLimit
          ? `<p style="color:red;">There are less than ${limit} claim codes available. Please, take action to replenish the claim codes via ImportPoapEvent and ReassignPendingClaimCodes GraphQL admin mutations.</p>
          <p>For more information, check the <strong><a href="https://docs.google.com/document/d/1LbvpPl1EsnWNhyptTK96c3OxTdmc0tU6zHcKCkRSAII/edit#heading=h.bcoxppg9brqn">Playbook DAO Registry POAP Claim Setup Guide</a>.</strong></p>`
          : ""
      }
      <p>Cheers,<br/>Aragon POAP Autotask</p>
    `;

    try {
      notificationClient.send({
        // TODO: Replace with your channel alias
        channelAlias: "test-mailer",
        subject,
        message,
      });
    } catch (error) {
      console.error(error);
      notificationClient.send({
        // TODO: Replace with your channel alias. Possibly a different one than the one above for errors
        channelAlias: "test-mailer",
        subject: "Error running mailer",
        message: JSON.stringify(error),
      });
    }
  } catch (error) {
    notificationClient.send({
      // TODO: Replace with your channel alias. Possibly a different one than the one above for errors
      channelAlias: "test-mailer",
      subject: "Error calling endpoint",
      message: JSON.stringify(error),
    });
  }
};

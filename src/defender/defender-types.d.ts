/*
{
  events: [
    {
      hash: '0x7a57d79c64d0833651269a73b7cd68516cf9522bb6556cfd0a004ac78932ce8a',
      transaction: [Object],
      blockHash: '0x049cca11e858f4c1f2c254e7386d7bd52ccfba298c95999203f088d3ba2ce1d3',
      blockNumber: '0x75a618',
      timestamp: 1664887212,
      matchReasons: [Array],
      matchedAddresses: [Array],
      sentinel: [Object],
      type: 'BLOCK',
      value: '0x0'
    }
  ]
}
*/
interface DefenderWebhookBody {
  events: DefenderWebhookEvent[];
}

interface DefenderWebhookEvent {
  matchReasons: DefenderWebhookMatchReason[];
  sentinel: DefenderWebhookSentinel;
}

/*
{
  type: 'event',
  signature: 'Transfer(address,address,uint256)',
  address: '0x1eb80ff824d2a2446832c35b494331fcdd80528b',
  args: [
    '0x45Cb7C163d74E2B72Db6Dd3568d7E64F7c0469E7',
    '0x5685f4d3d59Ef81beEac49f80B785290F9F2ec5c',
    '2'
  ],
  params: {
    from: '0x45Cb7C163d74E2B72Db6Dd3568d7E64F7c0469E7',
    to: '0x5685f4d3d59Ef81beEac49f80B785290F9F2ec5c',
    tokenId: '2'
  }
}
*/
interface DefenderWebhookMatchReason {
  type: string;
  signature: string;
  params: {
    [key: string]: string;
  };
}

interface DefenderWebhookSentinel {
  addresses: string[];
  network: string;
}

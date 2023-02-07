import { Injectable } from '@nestjs/common';
import { PoapClaimCodeService } from '../poap-claim-code/poap-claim-code.service';

@Injectable()
export class DefenderService {
  constructor(private readonly poapClaimCodeService: PoapClaimCodeService) {}

  async handleDAORegistration(body: DefenderWebhookBody) {
    await Promise.all(
      body.events.map(async (event) => {
        return await Promise.all(
          event.matchReasons.map(async (matchReason) => {
            if (
              matchReason.signature?.includes(
                'DAORegistered(address,address,string)',
              )
            ) {
              const { dao, creator } = matchReason.params;

              await this.poapClaimCodeService.assignClaimCodeToUser(
                creator,
                dao,
              );
            }
          }),
        );
      }),
    );
  }
}

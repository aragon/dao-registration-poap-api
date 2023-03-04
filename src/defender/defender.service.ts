import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { addressMatch } from '../common/address-utils';
import { PoapClaimCodeService } from '../poap-claim-code/poap-claim-code.service';
import { UserService } from '../user/user.service';

@Injectable()
export class DefenderService {
  constructor(
    private readonly poapClaimCodeService: PoapClaimCodeService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  async handleDAORegistration(body: DefenderWebhookBody) {
    await Promise.all(
      body.events.map(async (event) => {
        const validAddress = event.sentinel.addresses.find((address) =>
          addressMatch(
            address,
            this.configService.get<string>('DAO_REGISTRY_CONTRACT_ADDRESS', ''),
          ),
        );

        if (!validAddress) return Promise.resolve();

        return await Promise.all(
          event.matchReasons.map(async (matchReason) => {
            if (
              matchReason.signature?.includes(
                'DAORegistered(address,address,string)',
              )
            ) {
              const { dao, creator } = matchReason.params;

              const user = await this.userService.findOrCreateUserByAddress(
                creator,
              );

              await this.poapClaimCodeService.assignClaimCodeToUser(user, dao);
            }
          }),
        );
      }),
    );
  }
}

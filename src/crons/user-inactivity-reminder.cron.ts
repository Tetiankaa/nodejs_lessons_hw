import { CronJob } from "cron";

import { EEmailType } from "../enums/email-type.enum";
import { TimeHelper } from "../helpers/time.helper";
import { userRepository } from "../repositories/user.repository";
import { sendGridService } from "../services/send-grid.service";

const handler = async () => {
  try {
    // const users = await userRepository.getAll();
    // const promises = users.map(async (user) => {
    //   const tokenPair = await tokenRepository.findByParams({
    //     _userId: user._id,
    //   });
    //   if (!tokenPair || isTokenOld(tokenPair, 5, "days")) {
    //     await sendGridService.sendByEmailType(
    //       user.email,
    //       EEmailType.INACTIVE_USER,
    //       {
    //         name: user.name,
    //       },
    //     );
    //   }
    // });
    // await Promise.all(promises);

    const date = TimeHelper.substractByParams(1, "days");
    const result = await userRepository.findWithOutActivityAfter(date);
    await Promise.all(
      result.map(async (user) => {
        await sendGridService.sendByEmailType(
          user.email,
          EEmailType.INACTIVE_USER,
          {
            name: user.name,
          },
        );
      }),
    );
  } catch (e) {
    console.error("userInactivityReminder: ", e);
  }
};
// const isTokenOld = (
//   tokenPair: ITokenDB,
//   daysToSubstract: number,
//   unit: ManipulateType,
// ): boolean => {
//   const daysAgo = TimeHelper.substractByParams(daysToSubstract, unit);
//   return tokenPair.createdAt > daysAgo;
// };

export const userInactivityReminder = new CronJob("*/20 * * * * *", handler);

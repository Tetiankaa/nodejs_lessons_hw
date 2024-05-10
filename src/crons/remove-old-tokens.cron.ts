import { CronJob } from "cron";

import { TimeHelper } from "../helpers/time.helper";
import { tokenRepository } from "../repositories/token.repository";

const handler = async () => {
  try {
    await tokenRepository.deleteManyByParams({
      createdAt: { $lte: TimeHelper.substractByParams(3, "days") },
    });
  } catch (e) {
    console.error("removeOldTokens: ", e);
  }
};

export const removeOldTokens = new CronJob("0 0 4 * * *", handler);

import { removeOldTokens } from "./remove-old-tokens.cron";

export const runCronJobs = () => {
  removeOldTokens.start();
};

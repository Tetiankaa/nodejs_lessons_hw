import { removeOldTokens } from "./remove-old-tokens.cron";
import {userInactivityReminder} from "./user-inactivity-reminder.cron";

export const runCronJobs = () => {
  removeOldTokens.start();
  userInactivityReminder.start();
};

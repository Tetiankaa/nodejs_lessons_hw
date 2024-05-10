import {CronJob} from "cron";
import {userRepository} from "../repositories/user.repository";
import {tokenRepository} from "../repositories/token.repository";
import {sendGridService} from "../services/send-grid.service";
import {EEmailType} from "../enums/email-type.enum";
import {TimeHelper} from "../helpers/time.helper";
import {ITokenDB} from "../interfaces/token.interface";
import {ManipulateType} from "dayjs";

const handler = async () => {
    try {
    const users = await userRepository.getAll();
    const promises =  users.map(async user=>{
      const tokenPair =  await tokenRepository.findByParams({_userId: user._id});
      if (!tokenPair || isTokenOld(tokenPair,5,"days")) {
       await sendGridService.sendByEmailType(user.email,EEmailType.INACTIVE_USER,{
            name: user.name
        })
      }

    })
        await Promise.all(promises);
    }catch (e){
        console.error("userInactivityReminder: ", e);
    }
}
const isTokenOld = (tokenPair: ITokenDB, daysToSubstract: number, unit: ManipulateType): boolean =>{
    const daysAgo = TimeHelper.substractByParams(daysToSubstract, unit);
    return tokenPair.createdAt > daysAgo;
}

export const userInactivityReminder = new CronJob("0 30 4 * * *", handler);

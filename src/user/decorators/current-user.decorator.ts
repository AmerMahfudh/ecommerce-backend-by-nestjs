import { createParamDecorator,ExecutionContext } from "@nestjs/common";
import { CURRNET_USER_KEY } from "utilies/constant";
import { JWTPayloadType } from "utilies/types";



export const CurrentUser  = createParamDecorator(
    (data,context:ExecutionContext)=>{
        const request = context.switchToHttp().getRequest();
        const payload:JWTPayloadType = request[CURRNET_USER_KEY];
        return payload;
    }
);




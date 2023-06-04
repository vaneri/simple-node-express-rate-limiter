import { NextFunction, Request, Response } from "express";

class SessionHandler {

     public static  provideSession = (request: Request, response: Response, next: NextFunction) => {
        //adding extra logic here to map the user
        request.user = 'vaneri';
        next();
    }

}
export default SessionHandler;
interface UserPayload {
    uuid : string,
    firstname : string
}

declare namespace Express {
    export interface Request {
        user? : UserPayload
    }
}
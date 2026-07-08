import {AbstractRepo} from "../../abstract.repository";
import {IRequest} from "../../../common";
import {Request} from "./request.model";

export class RequestRepo extends AbstractRepo<IRequest>{
    constructor() {
        super(Request);
    }
}

// export const requestRepo = new RequestRepo()
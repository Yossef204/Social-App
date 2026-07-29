import { TokenDocument, TokenModel } from "./tokens.model.js";
import {AbstractRepo} from "../../abstract.repository";

class TokensRepository extends AbstractRepo<TokenDocument> {
    constructor() {
        super(TokenModel);
    }
}

export const tokenRepo = new TokensRepository();
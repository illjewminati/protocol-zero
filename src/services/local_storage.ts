import { JWT_TOKEN } from "../common/constants";
import { JwtPayload } from "../types/user";

const addPrefix = (key: string) => `pawn2323-shop34354-sdv89625672.${key}`;

const adBlockMessageShownKey = addPrefix('adBlockMessageShown');
const walletConnectedKey = addPrefix('walletConnected');
const jwtKey = addPrefix(JWT_TOKEN);


export class LocalStorage {
    private readonly _storage: Storage;

    constructor(storage: Storage = localStorage) {
        this._storage = storage;
    }

    public saveAdBlockMessageShown(adBlockMessageShown: boolean): void {
        this._storage.setItem(adBlockMessageShownKey, JSON.stringify(adBlockMessageShown));
    }

    public getAdBlockMessageShown(): boolean {
        return JSON.parse(this._storage.getItem(adBlockMessageShownKey) || 'false');
    }

    public saveWalletConnected(walletConnected: boolean): void {
        this._storage.setItem(walletConnectedKey, JSON.stringify(walletConnected));
    }

    public getWalletConnected(): boolean {
        return JSON.parse(this._storage.getItem(walletConnectedKey) || 'false');
    }

    public getJWT(): JwtPayload | null {
        const stringToken = this._storage.getItem(jwtKey);
        if(stringToken) {
            const payload = JSON.parse(stringToken) as JwtPayload;
            return payload;
        }
        return null
    }

    public saveJWT(payload: JwtPayload | null) {
        this._storage.setItem(jwtKey, JSON.stringify(payload));
    }
}

console.log("Data Type Objects (DTOs) for Elysia instance");

export class User {
    private _username: string = "";
    private _password: string = "";
    get password() {
        return this._password;
    }
    get username() {
        return this._username;
    }
}

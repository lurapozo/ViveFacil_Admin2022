import { Administrador } from "./administrador";

export interface AdminUserPass {
    token: string,
    active: boolean,
    admin: Administrador
}


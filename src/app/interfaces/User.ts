import { Group } from "./group";

export interface User {

    username: string;
    email: string;
    first_name: string;
    last_name: string;
    password: string;
    groups: Group[];
    is_superuser: boolean;


}
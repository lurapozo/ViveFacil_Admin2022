import { Mensaje } from './mensaje';

export interface Chats {
    estado: boolean;
    mensajes: Array<Mensaje>;
    proveedor: string;
}

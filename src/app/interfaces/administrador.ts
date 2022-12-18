
import { User_datos } from './user_datos';

export interface Administrador {

    id:string,
    user_datos: User_datos,
    estado:boolean

}

export interface fetchAllAdmi{
    page_size: number,
    total_objects: number,
    total_pages: number,
    current_page_number: number,
    next: string,
    previous: string,
    results: Administrador[],
    estado:boolean
}
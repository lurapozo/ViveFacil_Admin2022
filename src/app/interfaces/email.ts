export interface BodyEmail {
  password: string;
  email: string;
  tipo: 'Administrador' | 'Proveedor';
}

export interface BodyResponseEmail {
  success: boolean;
  mensaje: string;
}

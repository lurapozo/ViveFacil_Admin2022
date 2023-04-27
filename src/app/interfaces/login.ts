export interface BodyLogin {
  username: string;
  password: string;
  tipo: string;
}

export interface BodyLoginResponse {
  error?: string;
  token?: string;
  active: boolean;
}

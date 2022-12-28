/* eslint-disable @typescript-eslint/naming-convention */
import { Group } from './group';
export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  groups: Group[];
  is_superuser: boolean;
}

import { Encrypter } from '../abstractions/encrypter';
import * as bcrypt from 'bcrypt';

export class BcryptAdapter extends Encrypter {
  constructor(private readonly salt: number) {
    super();
  }
  async encrypt(value: string): Promise<string> {
    const hash = await bcrypt.hash(value, this.salt);
    return hash;
  }

  async compare(value: string, hash: string): Promise<boolean> {
    return bcrypt.compare(value, hash);
  }
}

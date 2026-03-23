import { Role } from '../../auth/enums/role.enum';

export class User {
  private _id?: number;
  private _email: string;
  private _password: string;
  private _isVerified: boolean;
  private _role: Role;
  private _refreshToken: string | null;
  private _refreshTokenExpiresAt: Date | null;
  private _createdAt: Date;

  constructor(props: { id?: number; email: string; password: string; isVerified?: boolean; role?: Role; refreshToken?: string | null; refreshTokenExpiresAt?: Date | null; createdAt?: Date; }) {
    this._id = props.id;
    this._email = props.email;
    this._password = props.password;
    this._isVerified = props.isVerified ?? false;
    this._role = props.role ?? Role.USER;
    this._refreshToken = props.refreshToken ?? null;
    this._refreshTokenExpiresAt = props.refreshTokenExpiresAt ?? null;
    this._createdAt = props.createdAt ?? new Date();
  }

  get id(): number | undefined { return this._id; }
  get email(): string { return this._email; }
  get password(): string { return this._password; }
  get isVerified(): boolean { return this._isVerified; }
  get role(): Role { return this._role; }
  get refreshToken(): string | null { return this._refreshToken; }
  get refreshTokenExpiresAt(): Date | null { return this._refreshTokenExpiresAt; }
  get createdAt(): Date { return this._createdAt; }

  public verify(): void {
    if (this._isVerified) throw new Error('User is already verified');
    this._isVerified = true;
  }
  public changePassword(newHashedPassword: string): void { this._password = newHashedPassword; }
  public setRefreshToken(hashedToken: string, expiresInMs: number): void {
    this._refreshToken = hashedToken;
    this._refreshTokenExpiresAt = new Date(Date.now() + expiresInMs);
  }
  public clearRefreshToken(): void {
    this._refreshToken = null;
    this._refreshTokenExpiresAt = null;
  }
}
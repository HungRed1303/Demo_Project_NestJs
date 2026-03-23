export const MAIL_SERVICE = Symbol('MAIL_SERVICE');

export interface IMailService {
  sendOtp(email: string, otp: string): Promise<void>;
}
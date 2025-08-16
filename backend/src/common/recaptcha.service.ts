import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class RecaptchaService {
  private readonly secretKey = process.env.RECAPTCHA_SECRET_KEY;
  private readonly verifyUrl = 'https://www.google.com/recaptcha/api/siteverify';

  async verifyRecaptcha(token: string): Promise<boolean> {
    if (!this.secretKey) {
      console.warn('reCAPTCHA secret key not configured');
      return true; // Allow in development if not configured
    }

    try {
      const response = await axios.post(this.verifyUrl, null, {
        params: {
          secret: this.secretKey,
          response: token,
        },
      });

      const { success, score } = response.data;
      
      // For reCAPTCHA v2, we only check success
      // For reCAPTCHA v3, you might want to check score as well
      return success === true;
    } catch (error) {
      console.error('reCAPTCHA verification error:', error);
      return false;
    }
  }
}
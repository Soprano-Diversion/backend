import dotenv from 'dotenv';

dotenv.config();

export const { ALLOWED_ORIGINS, PORT, JWT_SECRET, JWT_EXPIRES_IN, IMAGEKIT_PRIVATE_KEY, IMAGEKIT_PUBLIC_KEY, IMAGEKIT_URL_ENDPOINT, DATABASE_URL } =
  process.env;
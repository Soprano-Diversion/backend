import express from 'express';
import cors from 'cors';
import { ALLOWED_ORIGINS } from '../config';
import { createImage } from './image';
import { generateCodeFromModel } from '../helpers/model';

const app = express();

const cors_options = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void,
  ) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (ALLOWED_ORIGINS.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

app.use(cors(cors_options));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/', async (_, res) => {
  res.json({
    status: 'ok',
    message: 'Health check passed',
    code: 200,
  });
});

app.post('/upload-image', createImage);

// Testing generate
app.post('/generate', async (req, res) => {
  const { prompt, filepath, filename } = req.body;

  const response = await generateCodeFromModel({
    prompt,
    filepath,
    filename,
  });

  res.json(response);
})

export default app;

import app from './app.js';
import { connectDB } from './db/mongoose.js';

const port = Number(process.env.PORT ?? 4000);
const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  throw new Error('MONGODB_URI is not set');
}

await connectDB(mongoUri);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

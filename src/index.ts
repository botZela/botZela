import 'dotenv/config';

import { Client } from './Structures/Client';

export const client = new Client();

client.start().catch(console.error);

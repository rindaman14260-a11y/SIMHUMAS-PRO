import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '10mb' }));

// Initialize GoogleGenAI client (per gemini-api skill instructions)
let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

// 1. AI Assistant Humas: Smart Letter Drafting
app.post('/api/gemini/generate-letter', async (req, res) => {
  try {
    const { templateType, perihal, penerima, tujuan, poinPenting, tone = 'formal_islami' } = req.body;

    if (aiClient) {
      try {
        const systemPrompt = `Anda adalah Sekretaris & Spesialis Tata Naskah Kehumasan Sekolah Islam Profesional (SD Islam Imama Semarang).
Tugas Anda adalah menyusun isi paragraf surat dinas resmi sekolah dalam Bahasa Indonesia yang baku, santun, lugas, dan bernuansa Islami.
Hasilkan 3-4 paragraf isi surat (tanpa kop, tanpa nomor, tanpa tanggal, tanpa tanda tangan) yang terstruktur:
1. Paragraf pembuka berisi puji syukur kepada Allah SWT dan shalawat.
2. Paragraf inti yang menjelaskan maksud dan detail kegiatan/perihal secara teratur.
3. Rincian jadwal/waktu/tempat jika relevan.
4. Paragraf penutup yang santun dan mendoakan kebaikan.
Keluarkan jawaban berupa JSON dengan format:
{
  "regarding": "Perihal surat yang disempurnakan",
  "paragraphs": ["Paragraf 1...", "Paragraf 2...", "Paragraf 3...", "Paragraf 4..."]
}`;

        const userPrompt = `Buatkan draf surat untuk:
Jenis Template: ${templateType || 'Surat Undangan'}
Perihal: ${perihal}
Penerima: ${penerima}
Tujuan / Rincian: ${tujuan}
Poin Penting: ${poinPenting}
Gaya Bahasa: ${tone}`;

        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: userPrompt,
          config: {
            systemInstruction: systemPrompt,
            responseMimeType: 'application/json',
            temperature: 0.7
          }
        });

        const text = response.text || '';
        const parsed = JSON.parse(text);
        return res.json({ success: true, source: 'gemini', data: parsed });
      } catch (geminiError) {
        console.warn('Gemini API call failed, falling back:', geminiError);
      }
    }

    // Procedural Fallback
    return res.json({
      success: true,
      source: 'fallback',
      data: {
        regarding: perihal || 'Surat Kedinasan Resmi SD Islam Imama',
        paragraphs: [
          'Puji dan syukur senantiasa kita panjatkan ke hadirat Allah Subhanahu Wa Ta\'ala, Rabb semesta alam, yang telah melimpahkan rahmat dan hidayah-Nya. Shalawat dan salam semoga tercurah kepada Baginda Nabi Muhammad Shallallahu \'Alaihi Wasallam.',
          `Sehubungan dengan pelaksanaan ${perihal || 'program sekolah'}, bersama surat ini kami menginformasikan kepada ${penerima || 'Bapak/Ibu'} bahwa kegiatan akan diselenggarakan dengan tertib dan terencana.`,
          `Adapun pelaksanaan kegiatan tersebut dirancang guna meningkatkan mutu pendidikan, penguatan akhlak mulia peserta didik, serta koordinasi kehumasan yang berkelanjutan.`,
          'Demikian surat ini kami sampaikan. Atas perhatian, dukungan, dan kerja sama yang baik, kami haturkan terima kasih. Jazakumullahu khairan katsiran.'
        ]
      }
    });
  } catch (error) {
    console.error('Letter generation error:', error);
    res.status(500).json({ error: 'Gagal memproses draf surat.' });
  }
});

// 2. AI Assistant Humas: Content & Copywriting (Caption, Refinement, Minutes)
app.post('/api/gemini/assist-humas', async (req, res) => {
  try {
    const { action, inputText, tone = 'islami_ramah' } = req.body;

    if (aiClient) {
      try {
        const systemPrompt = `Anda adalah Asisten AI Humas SD Islam Imama Semarang.
Keahlian Anda meliputi:
- Menyempurnakan tata bahasa administrasi dinas yang formal dan sopan (action: 'improve_language').
- Membuat caption media sosial resmi sekolah: Instagram (menarik + emoji + hashtag), WhatsApp Broadcast (ramah + salam + poin penting), dan Facebook (action: 'generate_caption').
- Merangkum notula rapat/kunjungan tamu menjadi poin eksekutif yang ringkas dan padat (action: 'summarize_minutes').

Keluarkan output dalam format JSON:
{
  "result": "Teks hasil olahan",
  "instagramCaption": "Caption IG jika relevan",
  "whatsappBroadcast": "Format broadcast WA jika relevan",
  "facebookPost": "Postingan FB jika relevan"
}`;

        const userPrompt = `Aksi: ${action}\nTeks Input:\n${inputText}\nGaya: ${tone}`;

        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: userPrompt,
          config: {
            systemInstruction: systemPrompt,
            responseMimeType: 'application/json',
            temperature: 0.7
          }
        });

        const parsed = JSON.parse(response.text || '{}');
        return res.json({ success: true, source: 'gemini', data: parsed });
      } catch (geminiError) {
        console.warn('Gemini assist error:', geminiError);
      }
    }

    // Procedural Fallback
    let fallbackResult = inputText;
    if (action === 'generate_caption') {
      return res.json({
        success: true,
        source: 'fallback',
        data: {
          result: `✨ Kegiatan Sekolah SD Islam Imama: ${inputText}`,
          instagramCaption: `✨ Berita Humas SD Islam Imama ✨\n\n${inputText}\n\nMari bersama wujudkan generasi unggul, berakhlak mulia, dan berprestasi! 🌿💚\n\n#SDIslamImama #SekolahIslamSemarang #HumasImama #PendidikanKarakter`,
          whatsappBroadcast: `*Assalamu'alaikum Warahmatullahi Wabarakatuh*\n\nYth. Keluarga Besar & Sahabat SD Islam Imama,\n\nBerikut kami sampaikan informasi:\n${inputText}\n\nTerima kasih atas perhatian dan dukungannya.\n*Wassalamu'alaikum Wr. Wb.*`,
          facebookPost: `Kabar SD Islam Imama:\n\n${inputText}\n\nKunjungi website kami di https://www.sdislamimama.sch.id/`
        }
      });
    }

    return res.json({
      success: true,
      source: 'fallback',
      data: {
        result: `Dengan hormat, kami sampaikan bahwa sehubungan dengan ${inputText}, seluruh rangkaian kegiatan diharapkan dapat berlangsung secara tertib dan berkah. Terima kasih.`
      }
    });
  } catch (error) {
    console.error('Assist error:', error);
    res.status(500).json({ error: 'Gagal memproses permintaan asisten AI.' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'SIMHUMAS IMAMA PRO',
    geminiActive: !!process.env.GEMINI_API_KEY,
    school: 'SD Islam Imama Semarang'
  });
});

async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`SIMHUMAS IMAMA PRO Server running on port ${PORT} (isProd: ${isProd})`);
  });
}

startServer();

import fs from 'fs';
import TextToSpeechV1 from 'ibm-watson/text-to-speech/v1';
import { IamAuthenticator } from 'ibm-watson/auth';
import path from 'path';
import uuidv4 from 'uuid/v4';

class WatsonTextToSpeech {
  async index(text, voice = process.env.WATSON_API_VOICE_PT_TTS) {
    const textToSpeech = await this.textToSpeech();

    const params = {
      text,
      voice,
      accept: 'audio/wav',
    };

    const audioName = uuidv4();

    textToSpeech
      .synthesize(params)
      .then(response => {
        const audio = response.result;
        return textToSpeech.repairWavHeaderStream(audio);
      })
      .then(repairedFile => {
        fs.writeFileSync(`${audioName}.wav`, repairedFile);
      });

    return fs.createWriteStream(
      path.join(__dirname, '../../../', `${audioName}.wav`)
    ).path;
  }

  async textToSpeech() {
    const textToSpeech = new TextToSpeechV1({
      authenticator: new IamAuthenticator({
        apikey: process.env.WATSON_API_KEY_TTS,
      }),
      url: process.env.WATSON_API_URL_TTS,
    });

    return textToSpeech;
  }
}

export default new WatsonTextToSpeech();

import TextToSpeechV1 from 'ibm-watson/text-to-speech/v1';
import { IamAuthenticator } from 'ibm-watson/auth';
import AwsS3 from './AwsS3';

class WatsonTextToSpeech {
  async index(text = 'daniel', voice = process.env.WATSON_API_VOICE_PT_TTS) {
    const textToSpeech = await this.textToSpeech();

    const params = {
      text,
      voice,
      accept: 'audio/wav',
    };

    const response = await textToSpeech.synthesize(params);
    const audio = response.result;
    const repairedFile = await textToSpeech.repairWavHeaderStream(audio);
    const urlS3 = await AwsS3.uploadToS3(repairedFile);

    return urlS3.Location;
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

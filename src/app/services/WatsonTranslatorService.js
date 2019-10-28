/* eslint-disable dot-notation */
import LanguageTranslatorV3 from 'watson-developer-cloud/language-translator/v3';
import MessengerService from './MessengerService';
import WatsonTextToSpeech from './WatsonTextToSpeech';

class WatsonTranslatorService {
  async index(req) {
    const connectLanguageTranslator = await this.languageTranslator();
    const data = req;
    let valueReturn = 200;

    if (data && data.object === 'page') {
      data.entry.forEach(function(entry) {
        entry.messaging.forEach(function(event) {
          if (event.message && !event.message.attachments) {
            const identifyParams = {
              text: event.message.text,
            };

            let target;
            connectLanguageTranslator
              .identify(identifyParams)
              .then(identifiedLanguages => {
                const sourceLanguage =
                  identifiedLanguages.languages[0].language;
                if (sourceLanguage === 'pt') {
                  target = 'en';
                } else if (sourceLanguage === 'en') {
                  target = 'pt';
                } else {
                  target = 'invalid';
                }

                if (target !== 'invalid') {
                  const translateParams = {
                    text: event.message.text,
                    source: sourceLanguage,
                    target,
                  };

                  if (target === 'pt') {
                    target = process.env.WATSON_API_VOICE_PT_TTS;
                  } else {
                    target = process.env.WATSON_API_VOICE_EN_TTS;
                  }
                  connectLanguageTranslator
                    .translate(translateParams)
                    .then(async translationResult => {
                      MessengerService.treatMessage(
                        // eslint-disable-next-line prettier/prettier
                        event, translationResult['translations'][0]['translation'], translationResult['character_count'], translationResult['word_count']
                      );
                      const url = await WatsonTextToSpeech.index(
                        event.message.text,
                        target
                      );
                      MessengerService.treatMessageAudio(event, url);
                    })
                    .catch(err => {
                      return err;
                    });
                } else {
                  MessengerService.treatMessage(event);
                }
              })
              .catch(err => {
                return err;
              });
          } else {
            valueReturn = 503;
          }
        });
      });
    }
    return valueReturn;
  }

  async languageTranslator() {
    const languageTranslator = new LanguageTranslatorV3({
      version: new Date().toISOString().slice(0, 10),
      iam_apikey: process.env.WATSON_API_KEY_TRANSLATOR,
      url: process.env.WATSON_API_URL_TRANSLATOR,
    });

    return languageTranslator;
  }
}

export default new WatsonTranslatorService();

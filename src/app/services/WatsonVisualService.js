/* eslint-disable dot-notation */
import VisualRecognitionV3 from 'watson-developer-cloud/visual-recognition/v3';
import MessengerService from './MessengerService';

class WatsonVisualService {
  async index(req) {
    const connectVisualRecognition = await this.visualRecognition();
    const data = req;
    if (data && data.object === 'page') {
      data.entry.forEach(function(entry) {
        entry.messaging.forEach(function(event) {
          if (event.message.attachments) {
            if (event.message.attachments[0].type === 'image') {
              const imageURL = event.message.attachments[0].payload.url;
              const params = {
                url: imageURL,
              };
              connectVisualRecognition.classify(params, function(
                err,
                response
              ) {
                if (err) {
                  MessengerService.treatMessageImage(event);
                } else {
                  MessengerService.treatMessageImage(event, response);
                }
              });
            }
          } else {
            return 503;
          }
        });
      });
    }

    return 200;
  }

  async visualRecognition() {
    const visualRecognition = new VisualRecognitionV3({
      version: new Date().toISOString().slice(0, 10),
      iam_apikey: process.env.WATSON_API_KEY_VISUAL,
      url: process.env.WATSON_API_URL_VISUAL,
    });

    return visualRecognition;
  }
}

export default new WatsonVisualService();

import WatsonTranslatorService from '../services/WatsonTranslatorService';
import WatsonVisualService from '../services/WatsonVisualService';
import MessengerService from '../services/MessengerService';

class MessengerController {
  async index(req, res) {
    const result = await WatsonTranslatorService.index(req.body);
    if (result === 503) {
      await WatsonVisualService.index(req.body);
    }
    return res.sendStatus(200);
  }

  checkToken(req, res) {
    const token = MessengerService.checkToken(req.query);

    return token === 503 ? res.sendStatus(token) : res.send(token);
  }
}

export default new MessengerController();

/* eslint-disable prefer-template */
/* eslint-disable prettier/prettier */
import request from "request";

class MessengerService {
  checkToken(req) {
    if (
      req["hub.mode"] === "subscribe" &&
      req["hub.verify_token"] === process.env.VERIFY_TOKEN
    ) {
      return req["hub.challenge"];
    }

    return 503;
  }

  treatMessage(event, translate = null, quantityCharacters = 0, quantityWord = 0) {
    const senderID = event.sender.id;
    const messageText = event.message.text;

    if (messageText && translate) {
	    this.sendMessage(senderID, translate+" \n*Quantidade de caracteres da antiga frase:* "+quantityCharacters+" \n*Quantidade de palavras:* "+quantityWord);
    } else {
      this.sendMessage(senderID, "Atualmente só temos suporte ao Português e Ingles e não identificamos o que você digitou :(, tente novamente");
    }
  }

  treatMessageImage(event, recognition = null) {
    const senderID = event.sender.id;
    if (recognition) {
        this.sendMessage(senderID, "Classificado como "+recognition.images[0].classifiers[0].classes[0].class+", com o tipo hierárquico: "+recognition.images[0].classifiers[0].classes[0].type_hierarchy);
    } else {
        this.sendMessage(senderID, "Não identificamos o arquivo que você enviou");
    }
  }

  sendMessage(recipientID, messageText) {
    const messageData = {
      recipient: {
        id: recipientID
      },
      message: {
        text: messageText
      }
    };

    this.connectAPI(messageData);
  }

  connectAPI(messageData) {
    request(
      {
        uri: process.env.URI_BASE_FB,
        qs: { access_token: process.env.ACCESS_TOKEN },
        method: "POST",
        json: messageData
      },
      function(error, response) {
        if (!error && response.statusCode === 200) {
          return 200;
        }
        return 503;
      }
    );
  }
}

export default new MessengerService();

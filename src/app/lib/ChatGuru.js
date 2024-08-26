import config from "../../config/chatGuru"
import axios from "axios";
import messages from "../../public/messagesWhatsapp"
import {getClient} from "./PrismaClient";
export default {
    async sendMessage(
        number,
        name,
        text,
        user_id=config.user_id,
        key=config.key,
        account_id=config.account_id,
        phone_id=config.phone_id,
    ){
        console.log("Send Message To", number);
        return await axios.post(
            `https://s12.chatguru.app/api/v1?key=${key}&account_id=${account_id}&phone_id=${phone_id}&chat_number=${number}&action=chat_add&name=${name}&text=${text}&user_id=${user_id}`
        );
    },
    getRandomMessage() {
        const randomId = Math.floor(Math.random() * messages.length);
        return messages[randomId];
    },
    async sendVideoToClient(linkVideo, clientId) {
        let messageToSend = this.getRandomMessage().replace('[Inserir Link]', linkVideo);
        const client = await getClient(clientId);
        console.log(client);
        if(!client) {
            console.log(`Client not found ${clientId}`)
            return
        }
        this.sendMessage(client.phone, client.name, messageToSend)
            .then(res => {
                console.log(`Success: to send message`)
                this.sendMessage(client.phone, client.name,
                    "Só lembrando, que mantemos seu video por apenas 24h. Então lembre-se de efetuar o download!")
            })
            .catch(e => {
                console.log(e.message)
            })
    },


}
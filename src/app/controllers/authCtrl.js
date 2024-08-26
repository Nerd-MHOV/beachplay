import prisma from "../lib/PrismaClient";

export default {
    async verify(req, res){
        const {id, pass, cam} = req.query;
        const client = await prisma.client.findUnique({where: {id}});
        if(!client) return res.send("cliente não encontrado");
        if(client.pass === "-") {
            await prisma.client.update({where: {id}, data: {pass}})
            return res.send("senha criada");
        }
        if(client.pass !== pass) return res.send("Senha errada!")
        return res.status(200).send('connected')
    },

    async verifyId(req, res) {
        const {id, pass} = req.query;
        const client = await prisma.client.findUnique({ where: {id_number: id}});
        if(!client) return res.status(404).send("cliente não encontrado");
        if(client.pass !== pass) return res.status(404).send("Senha errada!")
        return res.status(200).send("connected");
    },

    async qr(req, res){
        const {qr} = req.query;
    
        console.log(qr);
        const client = await prisma.client.findUnique({
            where: {qr}
        })
        console.log(client);
        if(!client) return "-"
        return res.send(client.id)
    }
}
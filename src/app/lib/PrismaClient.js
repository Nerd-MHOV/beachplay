import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

// export const getClient = async (id) => {
//     console.log(id);
//     if(!id) return null
//     const qrcode = await prisma.qrcode.findUnique({
//         where: { qrcode: id }
//     })
//     if(!qrcode) {
//         const client = await prisma.clientes.findUnique({
//             where: {id: +id}
//         })
//         return client
//     } else {
//         const client = await prisma.clientes.findUnique({
//             where: {id_qrcode: qrcode.id}
//         })
//         return client
//     }

// }

export const getClient = async (id) => {
    const client = await prisma.client.findUnique({
        where: {
            id
        }
    })

    return client
}

export const getCam = async (id) => {
    return (await prisma.cams.findUnique({ where: {id: +id} }));
}

export default prisma;
import mongoose from "mongoose";

const storeSchema = new mongoose.Schema({
    store_name: {type: String, required: ["O nome da loja é obrigatório."]},
    cnpj: {type: String, required: ["O CNPJ da loja é obrigatório."]},
    address: {type: String, required: ["O endereço da loja é obrigatório."]},
    phone_number: {type: String, required: ["O número da loja é obrigatório."]},
    contact_email: {type: String, required: ["O e-mail da loja é obrigatório."]},
    status: {type: String, required: ["O status da loja é obrigatório."]},
});

export default mongoose.model("Store", storeSchema);

//  {
// "id": "7a6cc1282c5f6ec0235acd2bfa780145aa2a67fd",
// "store_name": "Bingo Heeler",
// "cnpj": "12.123.123.1234-12",
// "address": "Bandit Hemmer, 42",
// "phone_number": "48 9696 5858",
// "contact_email": "down@bingo.com",
// "status": "on"
// }
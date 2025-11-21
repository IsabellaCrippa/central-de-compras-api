import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema({
    supplier_name: {type: String, required: ["O nome do fornecedor é obrigatório."]},
    supplier_category: {type: String, required: ["A categoria do fornecedor é obrigatória."]},
    contact_email: {type: String, required: ["O e-mail de contato do fornecedor é obrigatório."]},
    phone_number: {type: String, required: ["O número do fornecedor é obrigatório."]},
    status: {type: String, required: ["O status do fornecedor é obrigatório."]},
});

export default mongoose.model("Supplier", supplierSchema);

//  {
// "id": "7a6cc1282c5f6ec0235acd2bfa780145aa2a67fd",
// "supplier_name": "Judite Heeler",
// "supplier_category": "Informatica, Segurança",
// "contact_email": "j.heeler@gmail",
// "phone_number": "48 9696 5858",
// "status": "on"
// }
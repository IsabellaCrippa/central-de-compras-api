import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {type: String, required: ["O nome do produto é obrigatório."]},
    description: {type: String, required: ["A descrição do produto é obrigatória."]},
    price: {type: Number, required: ["O preço do produto é obrigatório."]},
    stock_quantity: {type: Number, required: ["A quantia do produto no estoque é obrigatória."]},
    supplier_id: {type: String, required: ["O ID do fornecedor do produto é obrigatório."], ref: "Supplier"},
    status: {type: String, required: ["O status do produto é obrigatório."]},
});

export default mongoose.model("Product", productSchema);

//  {
// "id": "7a6cc1282c5f6ec0235acd2bfa780145aa2a67fd",
// "name": "Teclado e mouse",
// "description": "Kit teclado e mouse sem fio",
// "price": "200.00",
// "stock_quantity": "8",
// "supplier_id": "7a6cc1282c5f6ec0235acd2bfa780145aa2a67fd",
// "status": "on"
// }
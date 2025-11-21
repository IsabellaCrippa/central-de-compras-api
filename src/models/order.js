import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    store_id: {type: String, required: ["ID da loja é obrigatório."], ref: "Store"},
    item: {type: String, required:["Nome do item é obrigatório."]},
    total_amount: {type: String, required: ["O custo total é obrigatório ser informado."]},
    status: {type: String, required: ["O status do pedido é obrigatório."]},
    date: {type: Date, required: ["A data do pedido é obrigatória."]}
})

export default mongoose.model("Order", orderSchema);

// "id": "7a6cc1282c5f6ec0235acd2bfa780145aa2a67fd",
// "store_id": "7a6cc1282c5f6ec0235acd2bfa780145aa2a67fd",
// "item": "[(product_id, quantity, campaign_id, unit_price)... ]",
// "total_amount": "123.00",
// "status": "Pending",
// "date": "2023-08-15 16:00:00"
import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema({
    supplier_id: {type: String, required: ['O ID do fornecedor é obrigatório'], ref: "Supplier"},
    name: {type: String, required: ['O nome da campanha é obrigatório']},
    start_date: {type: Date, required: ['A data de início é obrigatória']},
    end_date: {type: Date, required: ['A data de término é obrigatória']},
    discount_percentage: {type: Number, required: ['A porcentagem de desconto é obrigatória']}
});

export default mongoose.model("Campaign", campaignSchema);
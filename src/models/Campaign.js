import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema({
    id: String,
    supplier_id: String,
    name: String,
    start_date: Date,
    end_date: Date,
    discount_percentage: Number
});

export default mongoose.model("Campaign", campaignSchema);
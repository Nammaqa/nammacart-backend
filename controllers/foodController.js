import foodModel from '../models/foodModel.js'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

//add food item

const addFood = async (req, res) => {

    if (!req.files || !req.files.image) {
        return res.json({ success: false, message: 'Image is required' })
    }

    const imageFile = req.files.image;
    const image_filename = `${Date.now()}_${imageFile.name}`;
    const uploadPath = path.join(__dirname, '..', 'uploads', image_filename);

    try {
        await imageFile.mv(uploadPath);
    } catch (err) {
        console.log(err);
        return res.json({ success: false, message: 'Image upload failed' });
    }

    const food = new foodModel({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        image: image_filename
    })

    try {
        await food.save();
        res.json({ success: true, message: 'Food Added' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message || 'Error' })
    }
}

// All food list

const listFood = async (req, res) => {
    try {
        const foods = await foodModel.find({});
        res.json({ success: true, data: foods })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: 'Error' })
    }
}

// remove food item

const removeFood = async (req, res) => {
    try {
        const food = await foodModel.findById(req.body.id);
        await foodModel.findByIdAndDelete(req.body.id)
        res.json({ success: true, message: 'Food Removed' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: 'Error' })
    }
}

export { addFood, listFood, removeFood }
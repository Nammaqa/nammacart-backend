import foodModel from '../models/foodModel.js'
import path from 'path'


// add food item
const addFood = async (req, res) => {
    try {
        if (!req.files || !req.files.image) {
            return res.json({
                success: false,
                message: 'Image is required'
            })
        }

        const imageFile = req.files.image

        // Convert image to Base64
        const base64Image = `data:${imageFile.mimetype};base64,${imageFile.data.toString('base64')}`

        const food = new foodModel({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            image: base64Image
        })

        await food.save()

        res.json({
            success: true,
            message: 'Food Added'
        })

    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: error.message || 'Error'
        })
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
        await foodModel.findByIdAndDelete(req.body.id)

        res.json({
            success: true,
            message: 'Food Removed'
        })
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: 'Error'
        })
    }
}


export { addFood, listFood, removeFood }
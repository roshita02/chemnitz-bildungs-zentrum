import School from "../models/school.model.js";

// Endpoint: /all
export async function all_schools(req,res){
    try {
        const schools = await School.find({});
        res.status(200).json({data: schools});
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

// Enpoint: /:id
export async function get_by_id(req,res){
    try {
        const school = await School.find({_id: req.params.id});
        res.status(200).json({data: school});
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export function error(req, res){
    res.send("Error");
}
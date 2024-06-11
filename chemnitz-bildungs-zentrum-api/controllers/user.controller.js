import User from '../models/user.model.js';
import Blacklist from '../models/blacklist.model.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import addressSchema from '../models/userAddressSchema.js';
dotenv.config();

export async function registerUser(req, res) {
    const { firstName, lastName, email, password, phoneNumber } = req.body;
    try {
        const newUser = new User({ firstName, lastName, email, password, phoneNumber });
        const savedUser = await newUser.save();
        res.status(201).json({ success: true, message: 'User registered successfully', data: savedUser });
    } catch (error) {
        if (error.code === 11000) {
            // Handle unique key violation error
            const field = Object.keys(error.keyPattern)[0];
            res.status(409).json({ success: false, message: `A user with that ${field} already exists.` });
        } else {
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    }
}

export async function authenticateUser(req,res) {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email }).populate('address').populate('favouriteFacility');
        if (!user) {
            return res.status(404).json({ success: false, message: 'Authentication failed. User with that email address does not exists.' })
        }
        user.comparePassword(password, async (err, isMatch) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Internal Server Error' });
            }
            if (isMatch) {
                const token = generateToken(user);
                let favFacilityResponse = user.favouriteFacility;
                if (user.favouriteFacility) {
                    const facility = await user.favouriteFacility.facility();
                    favFacilityResponse = {
                        ...user.favouriteFacility.toObject(),
                        address: facility.id ? facility.address() : '',
                        telephone: facility.id ? facility.telephone() : '',
                        email: facility.id ? facility.EMAIL : '',
                    }
                }
                res.status(200).json({
                    success: true,
                    message: 'Authentication successful',
                    data: {
                        _id: user.id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        address: user.address,
                        favouriteFacility: favFacilityResponse
                    },
                    token
                });
            } else {
                res.status(404).json({success: false, message: 'Authentication failed. Password incorrect.' });
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

export async function archiveUser(req, res) {
    const userId = req.user.id;
    try {
        const user = await User.find({_id: ObjectId(userId)});
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        user.isArchived = true;
        await user.save();

        res.status(200).json({ success: true, message: 'User archived successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

export async function updateUser(req,res) {
    const userId = req.user.id;
    const updateData = req.body;

    try {
        // Find the user by ID
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true, runValidators: true }
        ).populate('address');
        if (!updatedUser) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }
        res.status(200).json({success: true,  message: 'User updated successfully', data: updatedUser });
    } catch (error) {
        if (error.code === 11000) {
            // Handle unique key violation error
            const field = Object.keys(error.keyPattern)[0];
            res.status(409).json({ success: false, message: `A user with that ${field} already exists.` });
        } else {
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    }
}

export async function updateUserAddress(req, res) {
    const userId = req.user.id;
    const { lat, lon, street, houseNumber, zip } = req.body;

    try {
        if (!lat && !lon) {
            res.status(400).json({ success: false, message: 'Latitude and longitude field is required' });
        }

        if (!lat) {
            res.status(400).json({ success: false, message: 'Latitude field is required' });
        }

        if (!lon) {
            res.status(400).json({ success: false, message: 'Longitude field is required' });
        }

        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        if (req.user.id !== user.id) {
            return res.status(403).json({ success: false, message: 'Access Denied: You can only access your own data' });
        }

        // Update the address
        var address = user.address;
        if (address) {
            address.street = street ;
            address.lat = lat;
            address.lon = lon;
            await user.save();
        } else {
            // If user has no address, create a new one
            const newAddress = {
                street,
                lat,
                lon
            };
            user.address = newAddress;
            await user.save();
        }
        res.status(200).json({ success: true, message: 'Address updated successfully', data: user.address });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

// List all users
export async function listUsers(req, res) {
    try {
        const { isArchived } = req.query;
        let filter = { isArchived: false };

        if (isArchived === 'true') {
            filter.isArchived = true;
        }

        const users = await User.find(filter).populate('address');
        res.status(200).json({success: true, data: users});
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

// List one user by ID
export async function listUserById(req, res) {
    const userId  = req.user.id;
    try {
        const user = await User.findById(userId).populate('address');
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.status(200).json({success: true, data: user});
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

function generateToken(user) {
    return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

export async function logout(req, res) {
    try {
        const authHeader = req.header('Authorization'); 
        if (!authHeader) {
            return res.status(204).json({message: "Invalid"}); 
        }
        const checkIfBlacklisted = await Blacklist.findOne({ token: authHeader }); 
        if (checkIfBlacklisted && checkIfBlacklisted.token) {
            return res.status(204).json({success: false, message: "Invalid"}); 
        }
        const newBlacklist = new Blacklist({
        token: authHeader,
        });
        await newBlacklist.save();
        res.status(200).json({ success: true, message: 'User successfully signed out' });
    } catch (err) {
        res.status(500).json({success: false,
            message: 'Internal Server Error',
        });
    }
}

// Function to change user password
export async function changePassword(req,res) {
    try {
        const userId = req.user.id;
        const {currentPassword, newPassword} = req.body;
        // Find the user by ID
        const user = await User.findById(userId);
    
        user.comparePassword(currentPassword, async (err, isMatch) => {
            if (err) {
              return res.status(500).json({ success: false, message: 'Internal Server Error' });
            }
            if (isMatch) {
                try {
                    // Update the user's password
                    user.password = newPassword;
                    await user.save();
                    res.status(200).json({ success: true,message: 'User password updated successfully' });
                } catch (error) {
                    res.status(500).json({ success: false, message: 'Internal Server Error' });
                }
            } else {
              res.status(400).json({ success: false, message: 'Current password is incorrect' });
            }
        });
    } catch (error) {
        res.status(500).json({success: false, message: 'Error updating user password'});
    }
};

export async function deleteUser(req,res){
    console.log(req);
    try {
        const userId = req.user.id;
        await User.findByIdAndDelete(userId);
        res.status(200).json({ success: true, message: 'User deleted successfully' });
      } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
      }
}

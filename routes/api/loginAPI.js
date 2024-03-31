const {Router} = require('express')
const router = Router()
const loginDB = require('../../models/loginDB.js');
const bcrypt = require("bcrypt");

// Endpoint untuk proses login
router.post('/', async (req, res) => {
    
    console.log('login');
    const { email, password } = req.body;

    try {
        // Cari pengguna berdasarkan email
        const user = await loginDB.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Email atau password salah' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Email atau password salah' });
        }
        var response = res.status(200).json({ message: 'Email atau password salah'  , data : user});
        return response;
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



module.exports = router
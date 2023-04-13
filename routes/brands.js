const express = require('express');
const {
    getAllBrands,
    getBrand,
    createBrand,
    deleteBrand,
    updateBrand
} = require('../controllers/brandController');

const requireAuth = require('../middleware/requireAuth');


const router = express.Router();

// require auth for all routes
router.use(requireAuth);


// middleware
// router.use((req, res, next) => {
//     console.log(req.path, req.method)
//     next()
// })

// routes

// GET ALL BRANDS
router.get('/', getAllBrands);

// GET SPECIFIC BRAND
router.get('/:id', getBrand)

// POST A NEW BRAND
router.post('/', createBrand)

// UPDATE A BRAND
router.patch('/:id', updateBrand);

// DELETE A BRAND
router.delete('/:id', deleteBrand);

module.exports = router;
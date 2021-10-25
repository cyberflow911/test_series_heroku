const express = require('express');
const router = express.Router();
const categoryValidator = require('../Validators/AllCategoryValidator');
const {Category} = require('../models/Category');
const { raw } = require('body-parser');
const {subCategory} = require('../models/subCategory');
const upload = require('../middlewares/multer');




router.post('/createCategory', async(req, res)=>
{
    const {nameCategory, descriptionCategory} = req.body;
    const data = {nameCategory, descriptionCategory};

    const resultFromJoi =  categoryValidator('nameCategory descriptionCategory', data);

    if(!resultFromJoi)
    {
        res.status(200).json(
            {
                status: false,
                message: "Input is not Validated",
                NOTE: "nameCategory should have minimum characters : 3 and descriptionCategory should have minimum characters: 8"
            }
        )
    }
    else 
    {
        try {
            const category = await new Category(
                {
                    nameCategory: nameCategory,
                    descriptionCategory: descriptionCategory
                }
            )
            if(!category)
            {
                res.status(200).json(
                    {
                        status: false,
                        message: 'Category is not Created'
                    }
                )
            }
            else 
            {
                console.log(category);

                await category.save();

                res.status(200).json(
                    {
                        status: true,
                        message: "Category Created!!",
                        Category: category
                    }
                )
                
            }
            
        } catch (error) {
            
            console.log(error);
        }
    }

})
router.delete('/deleteCategory/:categoryID', async( req, res)=>
{
    try {
        const findCategory = await Category.findOne({_id: req.params.categoryID});
        if(!findCategory)
        {
            res.status(200).json(
                {
                    status: false,
                    message: "Category not found"
                }
            )
        }
        else 
        {
            try {
                const deleteCategory = await Category.findOneAndDelete({_id: req.params.categoryID});
                if(!deleteCategory)
                {
                    res.status(200).json(
                        {
                            status: false,
                            message: "Category is not deleted!!"
                        }
                    )
                }
                else{
                    res.status(200).json(
                        {
                            status: true,
                            message: "Category is deleted Successfully !!!"
                        }
                    )
                }
                
            } catch (error) {
                
                console.log(error);
            }
        }
        
    } catch (error) {
        
        console.log(error);
    }
})


router.delete('/deleteSubCategory/:subCategoryID', async(req, res)=>
{
    try {
        const findsum = await subCategory.findOne({_id: req.params.subCategoryID});
        if(!findsum)
        {
            res.status(200).json(
                {
                    status: false,
                    message: "Sub Category not found"
                }
            )
        }
        else 
        {
            try {
                const deleteSub = await subCategory.findOneAndDelete({_id: req.params.subCategoryID});
                if(!deleteSub)
                {
                    res.status(200).json(
                        {
                            status: false,
                            message: "sub Category Not deletd!!"
                        }
                    )
                }
                else 
                {
                    res.status(200).json(
                        {
                            status: true,
                            message: "Sub Category is deleted Successfully!!!"
                        }
                    )
                }
                
            } catch (error) {
                
                console.log(error);
            }

        }
        
    } catch (error) {
        
        console.lof(error);
    }
})

router.get('/getSubCategoryByCategoryID/:categoryID/:offset/:limit', async(req, res)=>
{
    const limit = parseInt(req.params.limit);
    const offset = (parseInt(req.params.offset)-1) * limit
    try {
        const subCategories = await subCategory.find({categoryID: req.params.categoryID}, {}, {
            sort:
            {
                'createdAt': -1
            }
        }).limit(limit).skip(offset);
        console.log(subCategories);
        if(!subCategories)

        {
            res.status(200).json(
                {
                    status: false,
                    message: "Sub Categories Not Found"
                }
            )
        }
        else 
        {
            res.status(200).json(
                {
                    status: false,
                    message: "Subcategories Found Are",
                    subcategories: subCategories

                }
            )
        }
        
        
    } catch (error) {
        
        console.log(error);
    }
})

router.get('/getAllCategories/:offset/:limit', async(req, res)=>

{
    const limit = parseInt(req.params.limit)
    const offset = (parseInt(req.params.offset)-1) * limit
    try {
        
        const categories = await Category.find({},{},{
            sort:
            {
                'createdAt': -1
            }
        }).limit(limit).skip(offset);
        if(!categories)
        {
            res.status(200).json(
                {
                    status: false,
                    message: "Categories not Found !!"
                }
            )
        }
        else 
        {
            res.status(200).json(
                {
                    status: true,
                    categories: categories
                }
            )

        }
    } catch (error) {
        
        console.log(error);
    }
})


router.post('/createSubCategory/:categoryID',upload.single('imageLogo'), async(req, res)=>
{
    console.log(req.file);
    const {nameSubCategory, descriptionSubCategory} = req.body;
    const data = {nameSubCategory, descriptionSubCategory};


    if(!req.file)
    {
        res.status(200).json(
            {
                status: false,
                message: "Logo Image Not Uploaded!!"
            }
        )
    }
    else
    {

        
    const resultFromJoi = categoryValidator('nameSubCategory descriptionSubCategory', data);

    if(!resultFromJoi)
    {
        res.status(200).json(
            {
                status: false,
                message: 'Invalid Credential Details',
                NOTE: "Category name should be atleast 3 characters long and description should be atleast 8 characters long"
            }
        )
    }
    else 
    
    {
        try {
            const categorymain = await Category.findOne({_id: req.params.categoryID});

            if(!categorymain)
            {
                res.status(200).json(
                    {
                        status: false,
                        message: "There is no Data Regrading to the Category ID Provided!!"
                    }
                )
            }
            else{

                try {
                    const category = await new subCategory(
                        {
                            nameSubCategory: nameSubCategory,
                            descriptionSubCategory: descriptionSubCategory,
                            categoryID: req.params.categoryID,
                            imageLogo: req.file.filename
                        }
                    )
        
                    if(!category)
                    {
                        res.status(200).json(
                            {
                                status: false,
                                messsage: "Category not Created!"
                            }
                        )
                    }
                    else 
                    {
                        console.log(category);
                        await category.save()
                        res.status(200).json(
                            {
                                status: true,
                                message: "Sub Category is Created!!",
                                subCategory: category
                            }
                        )
                    }
                    
                } catch (error) {
                    
                    console.log(error);
                }

            }
            
        } catch (error) {
            
            console.log(error);
        }
       
    }



    }


    
})





module.exports = router;
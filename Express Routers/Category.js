const express = require("express");
const router = express.Router();
const categoryValidator = require("../Validators/AllCategoryValidator");
const { Category } = require("../models/Category");
const { raw } = require("body-parser");
const { subCategory } = require("../models/subCategory");
const upload = require("../middlewares/multer");
const { Test } = require("../models/Test");
const { Tag } = require("../models/Tags");

router.post("/createCategory", async (req, res) => {
  const { nameCategory, descriptionCategory, tagIDs } = req.body;
  const data = { nameCategory, descriptionCategory, tags: tagIDs };

  // const resultFromJoi = categoryValidator(
  // 	"nameCategory descriptionCategory",
  // 	data
  // );

  if (!data) {
    res.status(200).json({
      status: false,
      message: "Input is not Validated",
      NOTE: "nameCategory should have minimum characters : 3 and descriptionCategory should have minimum characters: 8",
    });
  } else {
    try {
      const category = await new Category(data);
      if (!category) {
        res.status(200).json({
          status: false,
          message: "Category is not Created",
        });
      } else {
        await category.save();

        res.status(200).json({
          status: true,
          message: "Category Created!!",
          Category: category,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
});
router.delete("/deleteCategory/:categoryID", async (req, res) => {
  try {
    const findCategory = await Category.findOne({ _id: req.params.categoryID });
    if (!findCategory) {
      res.status(200).json({
        status: false,
        message: "Category not found",
      });
    } else {
      try {
        const deleteCategory = await Category.findOneAndDelete({
          _id: req.params.categoryID,
        });
        if (!deleteCategory) {
          res.status(200).json({
            status: false,
            message: "Category is not deleted!!",
          });
        } else {
          res.status(200).json({
            status: true,
            message: "Category is deleted Successfully !!!",
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
  } catch (error) {
    console.log(error);
  }
});

router.delete("/deleteSubCategory/:subCategoryID", async (req, res) => {
  try {
    const findsum = await subCategory.findOne({
      _id: req.params.subCategoryID,
    });
    if (!findsum) {
      res.status(200).json({
        status: false,
        message: "Sub Category not found",
      });
    } else {
      try {
        const deleteSub = await subCategory.findOneAndDelete({
          _id: req.params.subCategoryID,
        });
        if (!deleteSub) {
          res.status(200).json({
            status: false,
            message: "sub Category Not deletd!!",
          });
        } else {
          res.status(200).json({
            status: true,
            message: "Sub Category is deleted Successfully!!!",
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
  } catch (error) {
    console.lof(error);
  }
});

router.get(
  "/getSubCategoryByCategoryID/:categoryID/:offset/:limit",
  async (req, res) => {
    const limit = parseInt(req.params.limit);
    const offset = (parseInt(req.params.offset) - 1) * limit;
    try {
      const subCategories = await subCategory
        .find(
          { categoryID: req.params.categoryID },
          {},
          {
            sort: {
              createdAt: -1,
            },
          }
        )
        .limit(limit)
        .skip(offset);
      console.log(subCategories);
      if (!subCategories) {
        res.status(200).json({
          status: false,
          message: "Sub Categories Not Found",
        });
      } else {
        subCategories.forEach((element) => {});
        res.status(200).json({
          status: true,
          message: "Subcategories Found Are",
          subcategories: subCategories,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
);

router.get("/getAllCategories/:offset/:limit", async (req, res) => {
  const limit = parseInt(req.params.limit);
  const offset = (parseInt(req.params.offset) - 1) * limit;
  try {
    const categories = await Category.find(
      {},
      {},
      {
        sort: {
          createdAt: -1,
        },
      }
    )
      .limit(limit)
      .skip(offset)
      .populate({
        path: "subCategory",
        options: {
          limit: 1,
          sort: { created: -1 },
        },
      });
    if (!categories) {
      res.status(200).json({
        status: false,
        message: "Categories not Found !!",
      });
    } else {
      res.status(200).json({
        status: true,
        categories: categories,
      });
    }
  } catch (error) {
    console.log(error);
  }
});

//edit CAtegory

router.put("/editCategory/:categoryID", async (req, res) => {
  const { nameCategory, descriptionCategory } = req.body;
  try {
    const findCategory = await Category.findOne({ _id: req.params.categoryID });
    if (!findCategory) {
      res.status(404).json({
        status: false,
        message: "Category Not Found",
      });
    } else {
      const updateCategory = await Category.updateMany(
        { _id: req.params.categoryID },

        {
          nameCategory: nameCategory,
          descriptionCategory: descriptionCategory,
        }
      );

      const updatedCategory = await Category.findOne({
        _id: req.params.categoryID,
      });

      res.status(200).json({
        status: true,
        message: "Category is Updated!!",
        data: updatedCategory,
      });
    }
  } catch (error) {
    console.log(error);
  }
});

//edit sub Category
router.put(
  "/editSubCategory/:subCategoryID",
  upload.single("imageLogo"),
  async (req, res) => {
    const { nameSubCategory, descriptionSubCategory } = req.body;

    try {
      const findSub = await subCategory.findOne({
        _id: req.params.subCategoryID,
      });
      if (!findSub) {
        res.status(404).json({
          status: false,
          message: "Sub Category Not Found",
        });
      } else {
        if (!req.file) {
          const updateUser = await subCategory.updateMany(
            { _id: req.params.subCategoryID },
            {
              nameSubCategory: nameSubCategory,
              descriptionSubCategory: descriptionSubCategory,
            }
          );

          res.status(200).json({
            status: true,
            message: "Sub Category Is Edited Successfully",
          });
        } else {
          const updateSub = await subCategory.updateMany(
            { _id: req.params.subCategoryID },
            {
              nameSubCategory: nameSubCategory,
              descriptionSubCategory: descriptionSubCategory,
              imageLogo: req.file.path,
            }
          );
          const editSub = await subCategory.findOne({
            _id: req.params.subCategoryID,
          });
          res.status(200).json({
            status: true,
            message: "Sub Category Is Edited Successfully",
            date: editSub,
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
);

router.post(
  "/createSubCategory/:categoryID",
  upload.single("imageLogo"),
  async (req, res) => {
    console.log(req.file);
    const { nameSubCategory, descriptionSubCategory, price } = req.body;
    const data = { nameSubCategory, descriptionSubCategory };

    if (!req.file) {
      res.status(200).json({
        status: false,
        message: "Logo Image Not Uploaded!!",
      });
    } else {
      const resultFromJoi = categoryValidator(
        "nameSubCategory descriptionSubCategory",
        data
      );

      if (!resultFromJoi) {
        res.status(200).json({
          status: false,
          message: "Invalid Credential Details",
          NOTE: "Category name should be atleast 3 characters long and description should be atleast 8 characters long",
        });
      } else {
        try {
          const categorymain = await Category.findOne({
            _id: req.params.categoryID,
          });

          if (!categorymain) {
            res.status(200).json({
              status: false,
              message:
                "There is no Data Regrading to the Category ID Provided!!",
            });
          } else {
            try {
              const category = await new subCategory({
                nameSubCategory: nameSubCategory,
                descriptionSubCategory: descriptionSubCategory,
                categoryID: req.params.categoryID,
                imageLogo: req.file.path,
                price: price,
              });

              if (!category) {
                res.status(200).json({
                  status: false,
                  messsage: "Category not Created!",
                });
              } else {
                const categoryUpdate = await Category.updateOne(
                  { _id: req.params.categoryID },
                  {
                    $push: {
                      subCategory: category._id,
                    },
                  }
                );
                await category.save();

                res.status(200).json({
                  status: true,
                  message: "Sub Category is Created!!",
                  subCategory: category,
                });
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
  }
);

router.get("/getCategoryByTagId/:tagID", async (req, res) => {
  try {
    const categories = await Category.find({
      tags: { $all: [req.params.tagID] },
    });
    if (!categories) {
      res.status(200).json({
        status: false,
        message: "Categories not Found !!",
      });
    } else {
      res.status(200).json({
        status: true,
        categories: categories,
      });
    }
  } catch (error) {
    console.log(error);
  }
});

// update Category
router.patch("/updateCategory/:categoryID", async (req, res) => {
  // Checking if updates are valid
  const updates = Object.keys(req.body);
  const allowableUpdates = [
    "nameCategory",
    "subCategory",
    "descriptionCategory",
    "tags",
  ];
  const isValidUpdate = updates.every((update) =>
    allowableUpdates.includes(update)
  );
  if (!isValidUpdate) return res.status(400).json({ error: "Invalid Update." });

  // Update Category
  try {
    const category = await Category.findOneAndUpdate(
      { _id: req.params.categoryID },
      req.body,
      { runValidators: true, new: true }
    );

    res.status(500).json({
      status: true,
      message: "Edited Successfully",
      category: category,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      error: "Update Validator Failed",
    });
  }
});

module.exports = router;

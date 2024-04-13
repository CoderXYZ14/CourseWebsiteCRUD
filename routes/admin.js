const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const { Admin, Course } = require("../db");
const router = Router();

// Admin Routes
router.post("/signup", async (req, res) => {
  // Implement admin signup logic
  const username = req.body.username;
  const password = req.body.password;
  await Admin.create({
    username: username,
    password: password,
  });

  res.json({
    message: "Admoini created successfully",
  });
});

router.post("/courses", adminMiddleware, async (req, res) => {
  // Implement course creation logic
  const title = req.body.title;
  const description = req.body.description;
  const imageLink = req.body.imageLink;
  const price = req.body.price;
  const newCourse = await Course.create({
    title,
    description,
    imageLink,
    price,
  });
  //we want to send the course id as well
  //the unique id generated from mongo db compass

  res.json({
    message: "Cpurse created successfully",
    courseId: newCourse._id,
  });
});
//all authentication logic taken care by admin MiddleWare
router.get("/courses", adminMiddleware, async (req, res) => {
  // Implement fetching all courses logic
  const response = await Course.find({}); //send all courses
  res.json({
    courses: response,
  });
});

module.exports = router;

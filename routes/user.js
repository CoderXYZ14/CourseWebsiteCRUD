const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const { User, Course } = require("../db");

// User Routes
router.post("/signup", (req, res) => {
  // Implement user signup logic
  const username = req.body.username;
  const password = req.body.password;
  User.create({
    username,
    password,
  });
  res.json({ message: "User created successfully" });
});
//no user middleware as it is open to the word
router.get("/courses", async (req, res) => {
  // Implement listing all courses logic
  const response = await Course.find({}); //send all courses
  res.json({
    courses: response,
  });
});

//cant be send directly as we have desided to send reference of purchased course
//else would be direct Purchase.find()
router.post("/courses/:courseId", userMiddleware, async (req, res) => {
  // Implement course purchase logic
  const courseId = req.params.courseId;
  const username = req.headers.username;
  await User.updateOne(
    {
      username: username,
    },
    {
      $push: {
        purchasedCourses: courseId,
      },
    }
  );
  res.json({
    msg: "purchase complete",
  });
});

router.get("/purchasedCourses", userMiddleware, async (req, res) => {
  // Implement fetching purchased courses logic
  const user = await User.findOne({
    username: req.headers.username,
  });

  //console.log(user.purchasedCourses); //logs an array of purchased courses
  const courses = await Course.find({
    _id: {
      $in: user.purchasedCourses,
    },
  });
  res.json({
    courses: courses,
  });
});

module.exports = router;

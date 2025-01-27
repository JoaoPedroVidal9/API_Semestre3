const router = require("express").Router();

const userController = require("../controller/userController");
const classroomController = require("../controller/classroomController");
const scheduleController = require("../controller/scheduleController");

//User
router.post("/user/", userController.createUser);
router.post("/user/login", userController.postLogin);
router.get("/user/", userController.getAllUsers);
router.get("/user/:id", userController.getUserById);
router.put("/user/:id", userController.updateUser);
router.delete("/user/:id", userController.deleteUser);

//Classroom
router.post("/classroom/", classroomController.createClassroom);
router.get("/classroom/", classroomController.getAllClassrooms);
router.get("/classroom/:number", classroomController.getClassroomById);
router.put("/classroom/", classroomController.updateClassroom);
router.delete("/classroom/:number", classroomController.deleteClassroom);

//Schedule
router.post("/schedule/", scheduleController.createSchedule);
router.get("/schedule/", scheduleController.getAllSchedules);
router.get("/schedule/:id", scheduleController.getSchedulesByIdClassroom);
router.get(
  "/schedule/ranges/:id",
  scheduleController.getSchedulesByIdClassroomRanges
);
router.delete("/schedule/:id", scheduleController.deleteSchedule);

module.exports = router;

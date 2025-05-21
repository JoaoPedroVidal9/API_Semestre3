const router = require("express").Router();

const verifyJWT = require('../services/verifyJWT')

const userController = require("../controller/userController");
const classroomController = require("../controller/classroomController");
const scheduleController = require("../controller/scheduleController");

//User
router.post("/user/", userController.createUser);
router.post("/user/login", userController.postLogin);
router.get("/user/", verifyJWT, userController.getAllUsers);
router.get("/user/:id", verifyJWT, userController.getUserById);
router.put("/user/:id", verifyJWT, userController.updateUser);
router.delete("/user/:id", verifyJWT, userController.deleteUser); 

//Classroom
router.post("/classroom/", classroomController.createClassroom);
router.get("/classroom/", classroomController.getAllClassrooms);
router.get("/classroom/:number", classroomController.getClassroomById);
router.put("/classroom/", classroomController.updateClassroom);
router.delete("/classroom/:number", classroomController.deleteClassroom);

//Schedule
router.post("/schedule/",  scheduleController.createSchedule);
router.get("/schedule/", scheduleController.getAllSchedules);getSchedulesByIdUser
router.get("/schedule/user", scheduleController.getSchedulesByIdUser);
router.get("/schedule/:id", scheduleController.getSchedulesByIdClassroom);
router.post("/schedule/ranges/", scheduleController.getSchedulesByIdClassroomRanges);
router.post("/schedule/available/", scheduleController.getSchedulesByIdClassroomRangesAvailable )
router.delete("/schedule/:id", scheduleController.deleteSchedule);

module.exports = router;

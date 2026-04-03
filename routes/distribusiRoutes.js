const express = require("express");
const router = express.Router();

const distribusiController = require("../controllers/distribusiController");

router.get("/", distribusiController.getDistribusi);
router.post("/", distribusiController.createDistribusi);
router.put("/:id/status", distribusiController.updateStatus);

module.exports = router;
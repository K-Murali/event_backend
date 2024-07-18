const Event = require("../models/Eventschema");
const Book = require("../models/Bookings");

exports.add_event = async (req, res) => {
  try {
    const { name, description, eventtime, venue, photo } = req.body;

    const newevent = await Event.create({
      name,
      description,
      host: req.user.id,
      eventtime,
      venue,
      photo,
    });

    res.status(201).json({ status: "success", data: newevent });
  } catch (e) {
    res.status(500).json({ status: "fail", message: e.message });
  }
};
exports.edit_event = async (req, res) => {
  try {
    const { name, description, photo, venue, price, eventtime, reviewed } =
      req.body;
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.eventid,
      { name, description, photo, venue, price, eventtime, reviewed },
      { new: true }
    );
    res.status(200).json({
      status: "success",
      data: updatedEvent,
    });
  } catch (e) {
    res.status(500).json({ status: "fail", message: e.message });
  }
};
exports.delete_event = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.eventid);

    res.status(200).json({
      status: "success",
      message: "Event deleted successfully",
    });
  } catch (e) {
    res.status(500).json({ status: "fail", message: e.message });
  }
};
exports.getuser_events = async (req, res) => {
  try {
    const events = await Event.find({ host: req.user });
    res.status(200).json({ status: "success", data: events });
  } catch (e) {
    res.status(500).json({ status: "fail", message: e.message });
  }
};
exports.getall_events = async (req, res) => {
  try {
    const events = await Event.find({ reviewed: { $ne: false } });
    res.status(200).json({
      status: "success",
      data: events,
    });
  } catch (e) {
    res.status(500).json({ status: "fail", message: e.message });
  }
};
exports.get_eventbyid = async (req, res) => {
  try {
    await Event.findByIdAndUpdate(req.params.eventid, {
      $inc: { reached: 1 },
    });
    const event = await Event.findById(req.params.eventid).populate({
      path: "host",
      select: "name userphoto",
    });

    if (event) {
      let booked = await Book.find({ user: req.user._id });
      booked = booked.some((e) => e.event == req.params.eventid);
      res.status(200).json({
        status: "success",
        data: event,
        booked,
      });
    } else {
      res.status(200).json({
        status: "failed",
        data: " Not found int the database",
      });
    }
  } catch (e) {
    res.status(500).json({ status: "fail", message: e.message });
  }
};

exports.get_new_events = async (req, res) => {
  try {
    if (req.user.role == "admin") {
      const newevents = await Event.find({ reviewed: { $ne: true } });
      res.status(200).json({ status: "success", data: newevents });
    } else {
      return res.status(400).json({ status: "fail", message: "unorthorized" });
    }
  } catch (e) {
    res.status(500).json({ status: "fail", message: e.message });
  }
};

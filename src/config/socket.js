module.exports = (io) => {
  io.on("connection", (socket) => {
    socket.emit("hello", true);

    socket.on("sendMessUser", async () => {
      await io.emit("receiveMessAdmin", true);
    });

    // When a message "sendMessAdmin" is received, emit "receiveMessUser"
    socket.on("sendMessAdmin", async () => {
      await io.emit("receiveMessUser", true);
    });

    socket.on("checkOwner", async (req, res, data) => {
      if (!req.user) {
        return res.status(401).json({
          ok: false,
          errMessage: "Token không hợp lệ hoặc người dùng không xác thực.",
        });
      }

      const userId = req.user?.id || null;
      const user = await UserSchema.findOne({ _id: userId });
      const targetSocketId = data.socketId;
      const { inputValue } = req.body;
      const { username } = user;

      const newStatusOwner = inputValue === true;
      const dataTable = await TableSchema.findOneAndUpdate(
        { ip: data.ip, socketId: targetSocketId },
        { statusVery: newStatusOwner, username: username },
        { new: true }
      );
      await dataTable.save();
      if (dataTable) {
        await io.emit("adminMessageCheck", dataTable);
      }
    });

    socket.on("disconnect", (_) => {
      socket.disconnect();
    });
  });
};

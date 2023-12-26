const { createClientCode } = require("../controllers/codeRandom.controller");
const { createFashionCode } = require("../controllers/codeRandom.controller");
const { createProductCode } = require("../controllers/codeRandom.controller");
const countdownConfigSchema = require("../models/countdownConfig.model")

module.exports =  (io) => {
  let countdownInterval;
  const id = '658aef294dd9f01b18a3adc7'
  const startCountdown =async () => {
    const countdownConfig = await countdownConfigSchema.findOne({_id:id})

    if (!countdownInterval) {
      let timeLeft = countdownConfig.countdown * 60; // 4 minutes in seconds

      countdownInterval = setInterval(() => {
        io.emit('updateTime', timeLeft);

        if (timeLeft === 0) {
          clearInterval(countdownInterval);
          countdownInterval = null;
          io.emit('countdownFinished');
          createProductCode();
          createClientCode()
          createFashionCode()
          startCountdown()
        } else {
          timeLeft--;
        }
      }, 1000);
    }
  };
  io.on("connection", (socket) => {

    socket.emit("hello", true);

    socket.on("sendMessUser", async () => {
      await io.emit("receiveMessAdmin", true);
    });

    socket.on("sendMessAdmin", async () => {
      await io.emit("receiveMessUser", true);
    });

    socket.on("checkOwner", async (req, res, data) => {
      // ... (Phần mã kiểm tra owner)
      if (dataTable) {
        await io.emit("adminMessageCheck", dataTable);
      }
    });

    // Khi client kết nối, bắt đầu đếm ngược và gửi thời gian đến client
    startCountdown();

    socket.on("disconnect", (_) => {
      socket.disconnect();
    });
  });
};

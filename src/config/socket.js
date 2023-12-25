const {createClientCode} = require('../controllers/codeRandom.controller')
const {createFashionCode} = require('../controllers/codeRandom.controller')
const {createProductCode} = require('../controllers/codeRandom.controller')
module.exports = (io) => {
  let countdownDuration = 4 * 60 * 1000; // 4 phút trong mili giây
  let countdownTimer;

  const startCountdown = () => {
    countdownTimer = setInterval( async () => {
      countdownDuration -= 1000;
      io.emit("countdown", countdownDuration / 1000);

      if (countdownDuration <= 0) {
        clearInterval(countdownTimer);
        io.emit("countdownFinished", "Countdown has finished!");

        countdownDuration = 4 * 60 * 1000;
        createClientCode()
        createFashionCode()
        createProductCode()
        startCountdown();
      }
    }, 1000);
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
      clearInterval(countdownTimer);
      socket.disconnect();
    });
  });
};

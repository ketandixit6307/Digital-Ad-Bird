let io = null;

const initialize = (socketIoInstance) => {
  io = socketIoInstance;

  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

    socket.on('join', (userId) => {
      socket.join(`user:${userId}`);
      console.log(`Socket ${socket.id} joined room user:${userId}`);
    });

    socket.on('leave', (userId) => {
      socket.leave(`user:${userId}`);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected:', socket.id);
    });
  });
};

const emitToUser = (userId, event, data) => {
  if (!io) return;
  io.to(`user:${userId}`).emit(event, data);
};

const emitToAll = (event, data) => {
  if (!io) return;
  io.emit(event, data);
};

const getIO = () => io;

module.exports = { initialize, emitToUser, emitToAll, getIO };

const { Chess } = require("chess.js");

const sessions = new Map();

function createSession() {
  const id = Date.now().toString();
  sessions.set(id, new Chess());
  return id;
}

function getSession(id) {
  return sessions.get(id);
}

function updateSession(id, game) {
  sessions.set(id, game);
}

module.exports = { createSession, getSession, updateSession };

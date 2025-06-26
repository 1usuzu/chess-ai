// index.js

const { Chess } = require("chess.js");
const { findBestMove } = require("./ai"); // Gọi từ ai.js (trong thư mục cùng cấp)
const prompt = require("prompt-sync")();

// --- Chọn màu quân cờ ---
let playerColor = prompt("Bạn muốn chơi quân nào? (w = Trắng, b = Đen): ").trim().toLowerCase();
while (playerColor !== 'w' && playerColor !== 'b') {
    playerColor = prompt("Vui lòng nhập lại (w hoặc b): ").trim().toLowerCase();
}
const aiColor = playerColor === 'w' ? 'b' : 'w';

const game = new Chess();

// --- In bàn cờ ---
function printBoard() {
    console.log("\nBàn cờ hiện tại:");
    console.log(game.ascii());
    console.log("Lượt đi hiện tại:", game.turn() === 'w' ? "Trắng" : "Đen");
}

// --- Kiểm tra kết thúc ---
function checkGameOver() {
    if (game.isGameOver()) {
        if (game.isCheckmate()) {
            console.log("Chiếu hết!");
        } else if (game.isDraw()) {
            console.log("Ván đấu hòa!");
        } else {
            console.log("Ván đấu kết thúc!");
        }
        printBoard();
        process.exit(0);
    }
}

printBoard();

// --- VÒNG LẶP TRÒ CHƠI ---
while (true) {
    if (game.turn() === playerColor) {
        const moveInput = prompt("Nhập nước đi của bạn (ví dụ: e2e4): ").trim();
        const move = game.move(moveInput, { sloppy: true });

        if (!move) {
            console.log(" Nước đi không hợp lệ, thử lại.");
            continue;
        }

        console.log(`\n Bạn (${playerColor === 'w' ? 'Trắng' : 'Đen'}) đi: ${move.from} → ${move.to}`);
        printBoard();
        checkGameOver();
    } else {
        console.log("\n AI đang suy nghĩ...");
        const result = findBestMove(game.fen(), 3);

        console.log("\n Điểm đánh giá các nước đi của AI:");
        result.scores.forEach(({ move, score }) => {
            console.log(`- ${move}: ${score}`);
        });

        const move = game.move(result.bestMove, { sloppy: true });
        console.log(`\n AI (${aiColor === 'w' ? 'Trắng' : 'Đen'}) đi: ${move.from} → ${move.to}`);
        printBoard();
        checkGameOver();
    }
}

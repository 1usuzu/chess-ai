const { Chess } = require("chess.js");
const { findBestMove } = require("./ai");
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

// --- AI đi nước đầu nếu là trắng ---
function aiPlaysFirstMove() {
    console.log("AI (Trắng) đi trước...");

    const result = findBestMove(game.fen(), {
        maxDepth: 4,
        timeLimit: 2000,
        aiColor: 'w',
        returnScores: true
    });

    let moveObj = result.bestMove;
    if (typeof moveObj === 'string') {
        moveObj = { from: moveObj.slice(0, 2), to: moveObj.slice(2, 4) };
    }

    const move = game.move(moveObj, { sloppy: true });
    if (!move) {
        // console.log("AI không thể đi nước đầu tiên!");
        process.exit(1);
    }

    // console.log("\nĐiểm đánh giá các nước đi đầu của AI:");
    result.scores.forEach(({ move, score }) => {
        console.log(`- ${move}: ${score}`);
    });

    console.log(`\n🤖 AI (Trắng) đi: ${move.from} → ${move.to}`);
    printBoard();
    checkGameOver();
}

// --- In bàn cờ lần đầu
printBoard();

// Nếu AI là trắng → cho AI đi trước
if (aiColor === 'w') {
    aiPlaysFirstMove();
}

// --- VÒNG LẶP TRÒ CHƠI ---
while (true) {
    if (game.turn() === playerColor) {
        const moveInput = prompt("Nhập nước đi của bạn (ví dụ: e2e4): ").trim();
        const move = game.move(moveInput, { sloppy: true });

        if (!move) {
            console.log("Nước đi không hợp lệ, thử lại.");
            continue;
        }

        console.log(`\n👤 Bạn (${playerColor === 'w' ? 'Trắng' : 'Đen'}) đi: ${move.from} → ${move.to}`);
        printBoard();
        checkGameOver();
    } else {
        // console.log("\nAI đang suy nghĩ...");

        const result = findBestMove(game.fen(), {
            maxDepth: 4,
            timeLimit: 2000,
            aiColor: aiColor,
            returnScores: true
        });

        // console.log("\nĐiểm đánh giá các nước đi của AI:");
        result.scores.forEach(({ move, score }) => {
            console.log(`- ${move}: ${score}`);
        });

        let moveObj = result.bestMove;
        if (typeof moveObj === 'string') {
            moveObj = { from: moveObj.slice(0, 2), to: moveObj.slice(2, 4) };
        }

        const move = game.move(moveObj, { sloppy: true });
        if (!move) {
            // console.log("AI không tìm được nước đi hợp lệ!");
            process.exit(1);
        }

        console.log(`\nAI (${aiColor === 'w' ? 'Trắng' : 'Đen'}) đi: ${move.from} → ${move.to}`);
        printBoard();
        checkGameOver();
    }
}

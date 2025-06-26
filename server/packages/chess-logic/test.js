import { createChessGame, ChessUtils, FENParser } from './index.js';

console.log('🚀 Testing Chess Game Logic...\n');

// Test 1: Tạo game mới
console.log('1. Tạo game mới:');
const game = createChessGame();
console.log('✅ Game created successfully');
console.log('Current player:', game.currentPlayer);
console.log('Game status:', game.gameStatus);
console.log();

// Test 2: Thực hiện nước đi cơ bản
console.log('2. Thực hiện nước đi e2-e4:');
const move1 = ChessUtils.makeMove(game, 'e2', 'e4');
console.log('Move result:', move1 ? '✅ Success' : '❌ Failed');
console.log('Current player:', game.currentPlayer);
console.log();

// Test 3: Thực hiện nước đi phản hồi
console.log('3. Thực hiện nước đi e7-e5:');
const move2 = ChessUtils.makeMove(game, 'e7', 'e5');
console.log('Move result:', move2 ? '✅ Success' : '❌ Failed');
console.log('Current player:', game.currentPlayer);
console.log();

// Test 4: Lấy tất cả nước đi hợp lệ
console.log('4. Lấy tất cả nước đi hợp lệ cho trắng:');
const validMoves = ChessUtils.getAllValidMoves(game);
console.log(`Found ${validMoves.length} valid moves`);
console.log('First 5 moves:', validMoves.slice(0, 5));
console.log();

// Test 5: Test FEN parser
console.log('5. Test FEN Parser:');
const testFEN = 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1';
console.log('Test FEN:', testFEN);
console.log('Is valid FEN:', FENParser.isValidFEN(testFEN) ? '✅ Valid' : '❌ Invalid');

const gameState = FENParser.fenToGameState(testFEN);
console.log('Parsed game state:');
console.log('- Current player:', gameState.currentPlayer);
console.log('- Castling rights:', gameState.castlingRights);
console.log('- En passant target:', gameState.enPassantTarget);
console.log();

// Test 6: Test nước đi không hợp lệ
console.log('6. Test nước đi không hợp lệ:');
const invalidMove = ChessUtils.makeMove(game, 'e4', 'e6'); // Không thể nhảy qua quân
console.log('Invalid move result:', invalidMove ? '❌ Should fail' : '✅ Correctly rejected');
console.log();

// Test 7: Test algebraic notation conversion
console.log('7. Test algebraic notation conversion:');
const coords = ChessUtils.algebraicToCoords('e4');
console.log('e4 to coords:', coords);
const algebraic = ChessUtils.coordsToAlgebraic(4, 4);
console.log('[4,4] to algebraic:', algebraic);
console.log();

// Test 8: Hiển thị bàn cờ hiện tại
console.log('8. Bàn cờ hiện tại:');
console.log('  a b c d e f g h');
for (let row = 0; row < 8; row++) {
  let rowStr = `${8-row} `;
  for (let col = 0; col < 8; col++) {
    const piece = game.board[row][col];
    rowStr += (piece || '.') + ' ';
  }
  console.log(rowStr);
}
console.log();

console.log('🎉 All tests completed!');
import { createChessGame, ChessUtils, FENParser } from './index.js';

console.log('🔥 Advanced Chess Logic Tests\n');

// Test 1: Kiểm tra chiếu
console.log('1. Test Check Detection:');
const checkGame = createChessGame('rnbqkb1r/pppp1ppp/5n2/4p3/2B1P3/8/PPPP1PPP/RNBQK1NR w KQkq - 2 3');
console.log('King in check:', checkGame.isKingInCheck(false) ? '✅ Black king in check' : '❌ No check detected');
console.log();

// Test 2: Test nhập thành
console.log('2. Test Castling:');
const castlingGame = createChessGame('r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1');
console.log('Can castle kingside:', castlingGame.canCastle(true, 'kingside') ? '✅ Yes' : '❌ No');
console.log('Can castle queenside:', castlingGame.canCastle(true, 'queenside') ? '✅ Yes' : '❌ No');

const castleMove = ChessUtils.makeMove(castlingGame, 'e1', 'g1');
console.log('Castling move result:', castleMove ? '✅ Success' : '❌ Failed');
console.log();

// Test 3: Test en passant
console.log('3. Test En Passant:');
const enPassantGame = createChessGame('rnbqkbnr/ppp1p1pp/8/3pPp2/8/8/PPPP1PPP/RNBQKBNR w KQkq f6 0 3');
console.log('En passant target:', enPassantGame.enPassantTarget);
const enPassantMove = ChessUtils.makeMove(enPassantGame, 'e5', 'f6');
console.log('En passant move result:', enPassantMove ? '✅ Success' : '❌ Failed');
console.log();

// Test 4: Test checkmate
console.log('4. Test Checkmate:');
const checkmateGame = createChessGame('rnb1kbnr/pppp1ppp/8/4p3/6Pq/5P2/PPPPP2P/RNBQKBNR w KQkq - 1 3');
console.log('Game status:', checkmateGame.gameStatus);
console.log('Is checkmate:', checkmateGame.isCheckmate(true) ? '✅ White is checkmated' : '❌ Not checkmate');
console.log();

// Test 5: Test stalemate
console.log('5. Test Stalemate:');
const stalemateGame = createChessGame('8/8/8/8/8/8/8/k6K w - - 0 1');
console.log('Is stalemate:', stalemateGame.isStalemate(true) ? '✅ Stalemate detected' : '❌ Not stalemate');
console.log();

// Test 6: Test pawn promotion
console.log('6. Test Pawn Promotion Setup:');
const promotionGame = createChessGame('8/P7/8/8/8/8/8/8 w - - 0 1');
const promotionMoves = promotionGame.getValidMoves(1, 0);
console.log('Pawn can promote:', promotionMoves.length > 0 ? '✅ Yes' : '❌ No');
console.log('Promotion moves:', promotionMoves);
console.log();

// Test 7: Test game state evaluation
console.log('7. Test Game State:');
const normalGame = createChessGame();
console.log('Initial position evaluation:', normalGame.board ? '✅ Board initialized' : '❌ Board not initialized');
console.log('Move history length:', normalGame.moveHistory.length);
console.log();

// Test 8: Test FEN conversion
console.log('8. Test FEN Conversion:');
const testGame = createChessGame();
ChessUtils.makeMove(testGame, 'e2', 'e4');
ChessUtils.makeMove(testGame, 'e7', 'e5');
const currentFEN = FENParser.gameStateToFEN(testGame);
console.log('Generated FEN:', currentFEN);
console.log('FEN is valid:', FENParser.isValidFEN(currentFEN) ? '✅ Valid' : '❌ Invalid');
console.log();

console.log('🎯 Advanced tests completed!');
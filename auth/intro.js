// 認証:「誰であるか」を確認（ユーザ名 + passwd [+ 生体認証等]）
// ↓（あなたが誰なのかはわかったので、何が出来るか教えるね！）
// 認可:「何が出来るか」を確認（何を作成/閲覧/更新/削除していいのか等 e.g. 投稿者本人 -> 編集を許可）

// パスワードはそのまま保存しない！
//   - 多くの人がほかサービスでもユーザ名とパスワードを使い回している 
//     -> もし何らかの方法でDBが覗かれるとユーザは様々なサービスで不正にログインされてしまう
//   - ハッシュ化: パスワードをハッシュ関数（任意サイズの入力値を固定サイズの出力値に変換）にかけた結果をユーザ名とペアにしてDBに保存

// ログイン時:
//   ユーザ名とパスワードのペアが入力される。そのパスワードをハッシュ関数にかけた結果と、
//   DB内でユーザ名とペアで保存されているハッシュ化されたパスワードが一致すれば認証成功

// 暗号学的ハッシュ関数
// 1. 一方向性の関数であり、元に戻せない
// 2. 入力の小さな変化で出力が大きく変化する -> 出力から入力を予測することが不可能
// 3. 同じ入力には必ず同じ出力
// 4. 異なる入力から同じ出力が生成されることが、確率的にまず起こり得ない
// 5. 関数の実行が意図的に遅い -> 手数に任せた攻撃がしづらい

// - 前提知識
//   1. 実用に耐えうる優れたハッシュ関数の種類が少ない（多くのサービスがBCRYPTを使用）
//   2. 違う人が同じパスワードを使っていることも多い（e.g. qwerty）
// - DBのハッシュ値（とユーザ名）が盗まれた場合を想定する
//   1. BCRYPTがそのサービスでもハッシュ関数として採用されていることを決め打ち
//   2. よく使われるパスワード一覧を調べてBCRYPTでハッシュ化
//   => DBのハッシュ値のどれかと一致した場合、パスワード（ハッシュ化前）が判明
//   => ユーザ名とパスワードのペアが判っている => 不正ログイン
// ↓ 
// - SALT（ハッシュ化前のパスワードに加えるランダムな値）
//   1. よく使われるqwertyをBCRYPTでハッシュ化した結果"e2ih...6yh2"が得られていたとする（攻撃用の逆引辞書）
//   2. ユーザがパスワードをqwertyとして登録したとする
//   3. qwertyHOGEとしてソルトをかけたパスワードをBCRYPTでハッシュ化してDBに保存する（"gei4...9i0e"）
//   => DBのハッシュ値が盗まれても"e2ih...6yh2"と一致しない！（入力の小さな変化で出力が大きく変化する性質が寄与）
//   * ユーザログイン時も入力されたパスワードに、同じソルト（HOGE）をかけた上でハッシュ化する
//   * 実際にはBCRYPTが内部的に自動でソルトを生成し、かけてくれるので、開発者がソルトを管理する必要はない

// -- BCRYPT（パスワードハッシュ化関数の1つ）入門 --
// bcrypt: C++で書かれており高速であるがサーバサイドでしか使えない
// bcryptjs: JSで書かれておりnodejs（サーバサイド）でもブラウザ（クライアントサイド）でも使える
// => 今回はサーバサイドでしか使う予定がないので、bcryptを採用する
const bcrypt = require('bcrypt');

// saltRounds: どれだけ生成の難しいハッシュ値を生成するかの難易度
// -> 難易度が上がるほど生成にかかる時間が大きくなる -> 意図的に実行を遅く出来る
// -> 一般的には、250msくらいかかる処理がいいとされる -> saltRounds: 12 くらい
const hashPassword = async (pw) => {
    const salt = await bcrypt.genSalt(10); // saltRounds
    const hash = await bcrypt.hash(pw, salt);
    console.log(salt);
    console.log(hash);
};

// hashPassword('123456');
// => $2b$10$kXDbSxcP9F9kpiooGzZIl.
// => $2b$10$kXDbSxcP9F9kpiooGzZIl.6mcU8fUCd9BMxOkMOI.ZbiLr6MzdtWa
// ↕（生成毎に異なるsaltとhashが出力されるが、hashをみればsaltが何かわかるようになっている）
// => $2b$10$UnLmKLf6KMZzYD8Qh6h7Ge
// => $2b$10$UnLmKLf6KMZzYD8Qh6h7Ge2LTAi4fpsR2R3BNE1q2TZvM8LMAkFpm

// hash（ハッシュ値）: salt($2b$10$UnLmKLf6KMZzYD8Qh6h7Ge)+pwにsaltをかけた上でハッシュ化した値(2LTAi4fpsR2R3BNE1q2TZvM8LMAkFpm) -> DBに保存

const login = async (pw, hashedPw) => {
    const result = await bcrypt.compare(pw, hashedPw);
    if (result) {
        console.log('ログイン成功');
    } else {
        console.log('ログイン失敗');
    }
};

login('123456', '$2b$10$UnLmKLf6KMZzYD8Qh6h7Ge2LTAi4fpsR2R3BNE1q2TZvM8LMAkFpm'); // => ログイン成功
// 1. BCRYPTはhashedPwからsaltが何かわかる（$2b$10$UnLmKLf6KMZzYD8Qh6h7Ge）
// 2. '123456'にそのsaltをかけた上でハッシュ化する => '$2b$10$UnLmKLf6KMZzYD8Qh6h7Ge2LTAi4fpsR2R3BNE1q2TZvM8LMAkFpm'
// 3. 一致したので認証は成功
// ↓
// 検証
bcrypt.hash('123456', '$2b$10$UnLmKLf6KMZzYD8Qh6h7Ge').then(hash => {
    if (hash === '$2b$10$UnLmKLf6KMZzYD8Qh6h7Ge2LTAi4fpsR2R3BNE1q2TZvM8LMAkFpm') {
        console.log('検証成功');
    } else {
        console.log('検証失敗');
    }
}); // => 検証成功

// Tips: hashPassword関数をより簡潔に書ける（saltが内部的に生成、振りかけられている）
const hashPassword2 = async (pw) => {
    const hash = await bcrypt.hash(pw, 12);
    console.log(hash);
};
// hashPassword2('qwerty');
// => $2b$12$99Up4u3Cc9jObS4EmyYm5erOmN9bk7E1KimlpdmpLzuUjwc8QDa7q
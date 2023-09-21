// 以前のコード
const tweetForm = document.querySelector('#tweetForm');
const tweetsContainer = document.querySelector('#tweets');

tweetForm.addEventListener('submit', function (e) {
    e.preventDefault(); // defaultの動き（ページの遷移と更新）を止める

    // const usernameInput = document.querySelectorAll('input')[0];
    // const tweetInput = document.querySelectorAll('input')[1];
    const usernameInput = tweetForm.elements.username;
    const tweetInput = tweetForm.elements.tweet;

    addTweet(usernameInput.value, tweetInput.value);

    usernameInput.value = '';
    tweetInput.value = '';
});

const addTweet = (username, tweet) => {
    const newTweet = document.createElement('li');
    const bTag = document.createElement('b');
    bTag.append(username);
    newTweet.append(bTag, ` - ${tweet}`);
    tweetsContainer.append(newTweet);
};



// 新規のコード

// 元のliは削除出来るが、新しいliは削除出来ない！
// const lis = document.querySelectorAll('li');
// for (const li of lis) {
//     li.remove();
// }

// 親要素ulに子要素liの削除を移譲（Delegate）する！
tweetsContainer.addEventListener('click', function (e) {
    // console.log(e); // target: 実際にクリックしたul内の要素（ul / li / b ...）
    // e.target.remove(); // 消える箇所が細かいクリック操作依存になってしまう

    if (e.target.nodeName === 'LI') {
        // li部分をクリックしたとき 
        e.target.remove();
    } else if (e.target.nodeName === 'B') {
        // b部分をクリックしたとき
        e.target.parentElement.remove();
    }
    // e.target.nodeName === 'LI' && e.target.remove();

    // if (e.target.nodeName === 'LI' || e.target.nodeName === 'B') {
    //     e.target.closest('LI').remove();
    // }
});
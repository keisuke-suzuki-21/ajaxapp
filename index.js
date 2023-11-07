// メイン関数
function main(){
    const userId = getUserId();
    fetchUserInfo(userId)
        .then((userInfo) => createView(userInfo))
        .then((view) => displayView(view))
        .catch((error) => {
            console.error(error);
        });
}

// ユーザIDを受け取りfetch関数でGitHubにhttp通信のリクエストを送り、それをPromiseで受け取るまでの処理
function fetchUserInfo(userId){
    return fetch(`https://api.github.com/users/${encodeURIComponent(userId)}`)
        .then(response => {
            if(!response.ok){
                return Promise.reject(new Error(`${response.status}: ${response.statusText}`));
            }else{
                // fetchが元々promiseを返すのでここでは、jsonオブジェクトで解決されるPromiseが変える。
                return response.json();
            }
        }).catch(error => {
        console.log(error);
        });

}

function getUserId() {
    return document.getElementById("userId").value;
}

// 取得したuserInfoを元にhtml文字列の組み立てを行う関数
function createView(userInfo) {
    return escapeHTML`
    <h4>${userInfo.name} (@${userInfo.login})</h4>
    <img src="${userInfo.avatar_url}" alt="${userInfo.login}" height="100">
    <dl>
        <dt>Location</dt>
        <dd>${userInfo.location}</dd>
        <dt>Repositories</dt>
        <dd>${userInfo.public_repos}</dd>
    </dl>
    `;
}

// createViewで組み立てたhtmlをDOMに追加し表示する関数
function displayView(view){
    const result = document.getElementById("result");
    result.innerHTML = view;
}

// エスケープ関数
function escapeSpecialChars(str) {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function escapeHTML(strings, ...values) {
    return strings.reduce((result, str, i) => {
        const value = values[i - 1];
        if (typeof value === "string") {
            return result + escapeSpecialChars(value) + str;
        } else {
            return result + String(value) + str;
        }
    });
}
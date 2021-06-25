# Twitter practise

## create-react-app

```zsh
npx create-react-app . --template redux-typescript
```

## Install package

```zsh
yarn add @material-ui/core @material-ui/icons
yarn add firebase
```

## Firebase プロジェクト作成

- コンソールから、プロジェクトを作成する
- プロジェクト画面で、アプリの登録を行う(Firebase Hosting の設定チェックはここではしない)

## Firebase React との連携

- コンソールに戻り、設定->構成 のスクリプトを用いて、React と紐付けていく
  - `.gitignore` に `.env` を追加する
  - `.env` 作成
  ```
  REACT_APP_FIREBASE_APIKEY=""
  REACT_APP_FIREBASE_DOMAIN=""
  REACT_APP_FIREBASE_DATABASE="https://twitter-practise-erntorii.firebaseio.com"
  REACT_APP_FIREBASE_PROJECT_ID="twitter-practise-erntorii"
  REACT_APP_FIREBASE_STORAGE_BUCKET=""
  REACT_APP_FIREBASE_SENDER_ID=""
  REACT_APP_FIREBASE_APP_ID=""
  ```
  - 作成後は、環境変数で定義したものを反映させるため、ローカルサーバを再起動する
- firebase の各種設定を記述するために、[firebase.ts](./src/firebase.ts) を作成する。

## Redux Tool Kit を用いて、ユーザ情報をグローバルステート化する

- `counterSlice` だけ取り出しておき、counter ディレクトリを丸ごと削除するということをしておくと便利。

```zsh
mv src/features/counter/counterSlice.ts src/features/
rm -rf src/features/counter
// ファイル名の変更
mv src/features/counterSlice.ts src/features/userSlice.ts
```

- [userSlice.ts](./src/features/userSlice.ts) 作成
- [store.ts](./src/app/store.ts) に追加
- [App.tsx](./src/App.tsx) で不要な行を削除しておく

  ```tsx
  import React from "react";
  import "./App.css";

  function App() {
    return <div className="App"></div>;
  }

  export default App;
  ```

- `userSlice` が作成できているかの確認として、ここで Chrome の Redux DevTools を見ておくと良い。
  - 正しく表示されない？
    - DevTools の右上、`Autoselect instances` 部分のプルダウンを確認
    - ↑ は、他にも store を持つ React App がブラウザで開かれている場合に、そちらが優先して表示されている可能性がある。

## App コンポーネントで、`userSlice` の login/logout アクションを使用する

### Import

- firebase の認証機能を使いたいため、`auth` をインポート
- その他、Redux の必要な機能や定義した変数、関数をインポート

```tsx
import React, { useEffect } from "react";
import styles from "./App.module.css";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, login, logout } from "./features/userSlice";
import { auth } from "./firebase";
```

### `useSelector`, `useDispatch` の使用

```tsx
const App = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
```

### `useEffect` を用いて、認証のアクションを定義

- [App.tsx](./src/App.tsx)

## `Auth.tsx` で認証ページを作成する

### Material-UI のテンプレート利用

- [Material-UI](https://material-ui.com) -> 「GET STARTED」
- Material-UI の テンプレートから使いたいものを選び、ソースコードをまずは丸ごとコピーする。
- save して起動してあるローカルサーバを見にいくと、テンプレートが反映されている。
  - 関数をアロー関数表記に変更
  - 最下部に `export default Auth;` を追記

### `backgroundImage` 設定

- [Unsplash](https://unsplash.com/) のトップページから好きな画像を選び 画像アドレス をコピーして、  
  `backgroundImage` の url を置き換える。

### Google アカウント認証機能

- Auth コンポーネントに、以下を追加

```tsx
const signInGoogle = async () => {
  await auth.signInWithPopup(provider).catch((err) => alert(err.message));
};
```

- provider は、`firebase.ts` で作成した以下が渡されている

```tsx
// Google 認証機能に必要。
export const provider = new firebase.auth.GoogleAuthProvider();
```

- ビュー側では、Button コンポーネントの属性として、あらかじめ作成しておいた関数 `onClick={signInGoogle}` を呼ばれるようにする
- Button コンポーネントの `type` 属性は不要なため削除する

### Google アカウント認証機能を有効化する

- Firebase コンソールのサイドメニューにて -> `Authentication` -> タブバー `Sign-in method` 選択
- Google 項目にて、`有効にする` を選択 + プロジェクトのサポートメールに自身のメールアドレスを選択 -> 保存

### 実際に Google アカウントでログインしてみる

- ログイン後、Redux DevTools で、userSlice の各オブジェクトが更新されているか確認してみる
- サインアウトボタンは未設定のため、再度 Auth コンポーネント表示のためには、  
  Chrome 設定 -> プライバシーとセキュリティ -> 閲覧履歴データの削除 -> Cookie と他サイトのデータ -> データを削除  
  を行っておく

### 仮サインアウトボタンの作成

`Feed.tsx`

```tsx
import { auth } from "../firebase";
```

```
return(
  ...
      <button onClick={() => auth.signOut()}>Logout</button>
```

### Email + Password 認証機能

- email と password の state をそれぞれ定義する

```tsx
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
```

- テキストフィールドに上記が対応するように追加(パスワードも同様に)

```tsx
              value={email}
              onChange={(e) => setEmail(e.target.value)}
```

- login モード/register モードを判別する state を定義する

```tsx
const [isLogin, setIsLogin] = useState(true);
```

- login 用の関数の作成

```tsx
const signInEmail = async () => {
  await auth.signInWithEmailAndPassword(email, password);
};
```

- register 用の関数の作成

```tsx
const signUpEmail = async () => {
  await auth.createUserWithEmailAndPassword(email, password);
};
```

- login モード/register モードの切り替え

タイトル

```tsx
{
  isLogin ? "Login" : "Register";
}
```

切り替え機能

```tsx
<span onClick={() => setIsLogin(!isLogin)}>
  {isLogin ? "Create new account ?" : "Back to login"}
</span>
```

`<button>` タグに追加(`onClick` を設定するので、`type="submit"` は不要なため削除する)  
元の関数が、`async/await` が使われているため、実際に使う場面でも`async/await` を使う必要がある

```tsx
              onClick={
                isLogin
                  ? async () => {
                      try {
                        await signInEmail();
                      } catch (err) {
                        alert(err.message);
                      }
                    }
                  : async () => {
                      try {
                        await signUpEmail();
                      } catch (err) {
                        alert(err.message);
                      }
                    }
              }
```

- 記述後、Redux DevTools を用いてサインアップできるか試してみる

- Firebase コンソール -> Authentication -> Users にて、登録されたユーザーの一覧を参照できる

### Email + Password 認証機能を有効化する

- Firebase コンソールにて、Google アカウント認証機能の有効化と同じ流れで、  
  `メール/パスワード` を `有効にする` で保存(`メールリンク(パスワードなしでログイン)`は今回は特に有効にしない)

## `Auth.tsx` で、ユーザー情報の `photoUrl`, `displayName` が設定できるように機能追加する

### state 作成

```tsx
const [username, setUsername] = useState("");
const [avatarImage, setAvatarImage] = useState<File | Null>(null);
```

### Avatar 画像を登録/変更する ハンドラー作成

```tsx
const onChangeImageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files![0]) {
    setAvatarImage(e.target.files![0]);
    e.target.value = "";
  }
};
```

- `files![0]` の `!` は、typescript のコンパイル時に、オブジェクトが `null` または `undefined` ではないことを示すもの。
  - `!` がない場合、オブジェクトに null の可能性ができ、コンパイルが通らなくなってしまう。
  - onChange で渡しているハンドラーで、何らかのオブジェクトがすでに入っていると予想されるため。
- 最後の空文字で初期化する部分は、同じファイルを選択した際などに onChange が反応しない仕様となっており、  
  毎回反応するように仕様変更したいため行っている。

### Fire Storage へのファイルアップロードを設定する

- [Auth.tsx](./src/components/Auth.tsx)
  - signUpEmail の部分

### アップロードした displayName や photoURL を userSlice の方にも反映させる

- [userSlice](./src/features/userSlice.ts)
  - interface の作成
  - updateUserProfile の作成

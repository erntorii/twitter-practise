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

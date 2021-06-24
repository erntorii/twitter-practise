import React, { useEffect } from "react";
import styles from "./App.module.css";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, login, logout } from "./features/userSlice";
import { auth } from "./firebase";

const App = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    // `onAuthStateChanged` は、firebase のユーザーに対して何らかの変化があった場合に毎回呼び出される関数
    // ex. ログイン時、ログアウト時、ユーザー変更時など
    // この関数を実行することで、サブスクライブ(=購読)が始まり、ユーザー変化に関する監視を始める。
    // その返り値として、アンサブスクライブするための関数があるため、それを `unSub` 変数に渡しておく。

    // 引数には、変化後のユーザー情報が入るため、`authUser` で受け取るようにしておく。(変数名は何でもOK)
    const unSub = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        dispatch(
          login({
            uid: authUser.uid,
            photoUrl: authUser.photoURL,
            displayName: authUser.displayName,
          })
        );
      } else {
        dispatch(logout());
      }
    });

    // cleanup 関数を用いて、アンサブスクライブする処理を追加。
    return () => {
      unSub();
    };
  }, [dispatch]);

  return <div className="App"></div>;
};

export default App;

console.log("===== 1. 스코프 차이 =====");

if (true) {
    var a = "var 변수";
    let b = "let 변수";
    const c = "const 변수";
}
console.log("var a:", a); // 접근 가능
console.log("let b:", b); // ref 에러
console.log("const c:", c); // ref 에러
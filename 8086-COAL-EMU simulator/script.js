let instruct = document.querySelector(".inst-input");
let machCode = document.querySelector(".machine-code");
let simBut = document.querySelector(".simulator");
let ah = document.querySelector(".subreg--AH");
let al = document.querySelector(".subreg--AL");
let ax = document.querySelector(".regs--A");
let bh = document.querySelector(".subreg--BH");
let bl = document.querySelector(".subreg--BL");
let bx = document.querySelector(".regs--B");
let ch = document.querySelector(".subreg--CH");
let cl = document.querySelector(".subreg--CL");
let cx = document.querySelector(".regs--C");
let dh = document.querySelector(".subreg--DH");
let dl = document.querySelector(".subreg--DL");
let dx = document.querySelector(".regs--D");
let op = document.querySelector(".code");
let d = document.querySelector(".D");
let w = document.querySelector(".W");
let mod = document.querySelector(".Mod");
let reg = document.querySelector(".Reg");
let rm = document.querySelector(".r-m");
let pc = document.getElementById("pc");
let ir = document.getElementById("ip");
let controler = document.getElementById("alu");
let pctext = document.getElementById("pc-container");
let alutext = document.getElementById("alu-display");
let alu = document.getElementById("real-alu");
let cont = document.querySelector(".cont");
const hexToDecimal = (hex) => parseInt(hex, 16);
const decimalToHex = (dec) => dec.toString(16);
const next = document.querySelector(".next");
const isHexadecimal = (str) => /^[A-F0-9]+$/i.test(str);
const dataArr = [];
for (var i = 0; i < 16; i++) {
  dataArr.push(document.querySelector(`.data--${i}`));
}
const memArr = [];
for (var i = 0; i < 16; i++) {
  memArr.push(document.getElementById(`loc${i}`));
}
const regVar = {
  ah: ah,
  al: al,
  ax1: ah,
  ax2: al,
  bh: bh,
  bl: bl,
  bx1: bh,
  bx2: bl,
  ch: ch,
  cl: cl,
  cx1: ch,
  cx2: cl,
  dh: dh,
  dl: dl,
  dx1: dh,
  dx2: dl,
};

let reg16 = ["ax", "bx", "cx", "dx"];
let reg8 = ["ah", "bh", "ch", "dh", "al", "bl", "cl", "dl"];

const opcode = {
  mov: "0000",
  add: "0001",
  sub: "0010",
  inc: "0011",
  dec: "0100",
  mul: "0101",
  and: "0110",
  or: "0111",
  not: "1000",
  xor: "1001",
  lshift: "1010",
  rshift: "1011",
  ror: "1100",
  rol: "1101",
  neg: "1111",
  ax: "000",
  bx: "001",
  cx: "010",
  dx: "011",
  ax: "000",
  bx: "001",
  cx: "010",
  dx: "011",
  al: "000",
  bl: "001",
  cl: "010",
  dl: "011",
  ah: "100",
  bh: "101",
  ch: "110",
  dh: "111",
};
//  ////////////////////  Logical Instructions Code    //////////////////////////
function hex2bin(hex) {
  return parseInt(hex, 16).toString(2).substr(-8);
}
function andFun(oprnd1, oprnd2) {
  return oprnd1 & oprnd2;
}
function orFun(oprnd1, oprnd2) {
  return oprnd1 | oprnd2;
}
function xorFun(oprnd1, oprnd2) {
  return oprnd1 ^ oprnd2;
}
////////////////////////////////////////////////////////////////////////////
function refreshMem() {
  for (var i = 0; i < 16; i++) {
    memArr[i].classList.remove("active1");
    memArr[i].classList.remove("active2");
  }
}
function refreshReg() {
  ah.classList.remove("active1");
  bh.classList.remove("active1");
  ch.classList.remove("active1");
  dh.classList.remove("active1");
  al.classList.remove("active1");
  bl.classList.remove("active1");
  cl.classList.remove("active1");
  dl.classList.remove("active1");
  ah.classList.remove("active2");
  bh.classList.remove("active2");
  ch.classList.remove("active2");
  dh.classList.remove("active2");
  al.classList.remove("active2");
  bl.classList.remove("active2");
  cl.classList.remove("active2");
  dl.classList.remove("active2");
  pc.classList.remove("active1");
  pc.classList.remove("active2");
  ir.classList.remove("active1");
  ir.classList.remove("active2");
  controler.classList.remove("active1");
  controler.classList.remove("active2");
  alu.classList.remove("active1");
  alu.classList.remove("active2");
}
function negt(x, num) {
  for (var j = 0; j < x; j++) {
    if (num[j] === "0") {
      num = num.slice(0, j) + "1" + num.slice(j + 1, x);
    } else {
      num = num.slice(0, j) + "0" + num.slice(j + 1, x);
    }
  }
  return num;
}
function regMC(opr) {
  return opcode[`${opr}`];
}
function isReg(opr) {
  if (reg16.includes(opr) || reg8.includes(opr)) {
    return true;
  } else {
    return false;
  }
}
function reg8or16(opr) {
  if (reg16.includes(opr)) {
    return 2;
  } else if (reg8.includes(opr)) {
    return 1;
  }
}
function memLoc(opr) {
  if (opr[0] === "[" && opr[opr.length - 1] === "]") {
    var mem = opr.slice(1, opr.length - 1);
    if (mem.length === 2) {
      if (reg16.includes(mem) || reg8.includes(mem)) {
        return Number(hexToDecimal(regVar[`${mem}`].textContent));
      }
    } else if (mem.length === 1 && isHexadecimal(mem)) {
      mem = hexToDecimal(mem);
      return Number(mem);
    }
  }
}
function waitForPress() {
  return new Promise((resolve) => (waitForPressResolve = resolve));
}
function btnResolver() {
  if (waitForPressResolve) waitForPressResolve();
}
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function mode(arr1) {
  if (reg16.includes(arr1[1]) && reg16.includes(arr1[2])) {
    return "11";
  }
  if (
    reg16.includes(arr1[1]) &&
    arr1[2][0] === "[" &&
    arr1[2][arr1[2].length - 1] === "]"
  ) {
    if (arr1[2].includes("+")) {
      return "01";
    } else {
      return "00";
    }
  }
}
function opgen(arr) {
  //   if (arr[arr.length - 1] === " ") {
  //     arr.pop();
  //   }
  op.textContent = opcode[arr[0]];
  //   let opst = opcode[arr[0]];
  //   if (arr[1][0] === "[" && arr[1][arr[1].length - 1] === "]") {
  //     var mem = opr.slice(1, opr.length - 1);
  //     if (mem.length === 2) {
  //       if (
  //         reg16.includes(mem)
  //       ){

  //       }

  //     }
  // }
  if (arr.length === 3) {
    if (reg16.includes(arr[1])) {
      d.textContent = "1";
      w.textContent = "1";
      reg.textContent = opcode[arr[1]];
      mod.textContent = 00;
      if (reg16.includes(arr[2])) {
        rm.textContent = opcode[arr[2]];
      } else if (arr[2][0] === "[" && arr[2][arr.length - 1] === "]") {
        let x = memLoc(arr[2]);
        x = x.toString(2);
        rm.textContent = x;
      } else if (
        isHexadecimal(arr[2]) &&
        arr[2].length < 5 &&
        arr[2].length > 0
      ) {
        rm.textContent = hexToDecimal(arr[2]).toString(2);
      } else if (reg8.includes(arr[2])) {
        rm.textContent = opcode[arr[2]];
      }
    } else if (arr.length === 3) {
      if (reg8.includes(arr[1])) {
        d.textContent = "1";
        w.textContent = "0";
        reg.textContent = opcode[arr[1]];
        mod.textContent = mode(arr);
        if (reg8.includes(arr[2])) {
          rm.textContent = opcode[arr[2]];
        } else if (arr[2][0] === "[" && arr[2][arr.length - 1] === "]") {
          let x = memLoc(arr[2]);
          x = x.toString(2);
          rm.textContent = x;
          mod.textContent = 00;
        } else if (
          isHexadecimal(arr[2]) &&
          arr[2].length < 5 &&
          arr[2].length > 0
        ) {
          rm.textContent = hexToDecimal(arr[2]).toString(2);
        } else if (reg16.includes(arr[2])) {
          rm.textContent = opcode[arr[2]];
        }
      }
    } else if (arr.length === 3) {
      if (arr[1][0] === "[" && arr[1][arr.length - 1] === "]") {
        d.textContent = "0";
        let x = memLoc(arr[1]);
        x = x.toString(2);
        rm.textContent = x;
        mod.textContent = mode(arr);
        if (reg8.includes(arr[2])) {
          reg.textContent = opcode[arr[2]];
          w.textContent = "0";
          rm.textContent = opcode[arr[2]];
        } else if (
          isHexadecimal(arr[2]) &&
          arr[2].length < 5 &&
          arr[2].length > 0
        ) {
          w.textContent = "0";
          reg.textContent = hexToDecimal(arr[2]).toString(2);
        } else if (reg16.includes(arr[2])) {
          w.textContent = "0";
          rm.textContent = opcode[arr[2]];
          reg.textContent = opcode[arr[2]];
        }
      }
    }
    return (
      op.textContent +
      d.textContent +
      w.textContent +
      mod.textContent +
      reg.textContent +
      rm.textContent
    );
  }
}
async function doIt(Array) {
  next.addEventListener("click", btnResolver);

  for (let i = 0; i < Array.length; i++) {
    opgen(Array[i]);
    refreshReg();
    refreshMem();
    pc.classList.toggle("active1");
    pctext.textContent = i + 1;
    await sleep(3000);
    refreshReg();
    refreshMem();
    ir.classList.toggle("active1");
    await sleep(3000);
    refreshReg();
    refreshMem();
    controler.classList.toggle("active1");
    op.textContent = opcode[Array[i][0]];
    // cont.textContent = opgen(Array);
    // console.log(opgen(Array));
    // if (Array[i][0] !== "mov") {
    //   alu.classList.toggle("active1");
    // }
    switch (Array[i][0]) {
      case "mov":
        op.textContent = opcode[Array[i][0]];
        if (
          reg16.includes(Array[i][1]) &&
          reg16.includes(Array[i][2]) &&
          Array[i][1] !== Array[i][2]
        ) {
          //   reg.textContent = opcode[Array[i][1]];
          //   d.textContent = 1;
          //   w.textContent = 1;
          //   rm.textContent = opcode[Array[i][2]];
          //   mod.textContent = 11;
          //   await sleep(3000);
          //   refreshReg();
          //   refreshMem();
          op.textContent = opcode[Array[i][0]];
          regVar[Array[i][2] + "2"].classList.toggle("active2");
          regVar[Array[i][2] + "1"].classList.toggle("active2");
          await sleep(3000);
          refreshReg();
          refreshMem();
          regVar[Array[i][1] + "1"].classList.toggle("active1");
          regVar[Array[i][1] + "2"].classList.toggle("active1");
          regVar[Array[i][1] + "1"].textContent =
            regVar[Array[i][2] + "1"].textContent;
          regVar[Array[i][1] + "2"].textContent =
            regVar[Array[i][2] + "2"].textContent;
        } else if (
          reg8.includes(Array[i][1]) &&
          reg8.includes(Array[i][2]) &&
          Array[i][1] !== Array[i][2]
        ) {
          //   reg.textContent = opcode[Array[i][1]];
          //   d.textContent = 1;
          //   w.textContent = 0;
          //   rm.textContent = opcode[Array[i][2]];
          //   mod.textContent = 11;
          regVar[Array[i][2]].classList.toggle("active2");
          await sleep(3000);
          refreshReg();
          refreshMem();
          regVar[Array[i][1]].classList.toggle("active1");
          regVar[Array[i][1]].textContent = regVar[Array[i][2]].textContent;
        } else if (
          Array[i][1][0] === "[" &&
          Array[i][1][Array[i][1].length - 1] === "]" &&
          reg16.includes(Array[i][2])
        ) {
          //   reg.textContent = opcode[Array[i][2]];
          //   d.textContent = 0;
          //   w.textContent = 1;
          //   rm.textContent = opcode[Array[i][1]];
          //   mod.textContent = 00;
          regVar[Array[i][2] + "1"].classList.toggle("active2");
          regVar[Array[i][2] + "2"].classList.toggle("active2");
          await sleep(3000);
          refreshReg();
          refreshMem();
          memArr[memLoc(Array[i][1])].classList.toggle("active1");
          dataArr[memLoc(Array[i][1])].textContent =
            regVar[Array[i][2] + "1"].textContent +
            regVar[Array[i][2] + "2"].textContent;
        } else if (
          Array[i][2][0] === "[" &&
          Array[i][2][Array[i][2].length - 1] === "]" &&
          reg16.includes(Array[i][1])
        ) {
          //   reg.textContent = opcode[Array[i][1]];
          //   d.textContent = 1;
          //   w.textContent = 1;
          //   rm.textContent = opcode[Array[i][2]];
          //   mod.textContent = 00;
          memArr[memLoc(Array[i][2])].classList.toggle("active2");
          await sleep(3000);
          refreshReg();
          refreshMem();
          regVar[Array[i][1] + "1"].classList.toggle("active1");
          regVar[Array[i][1] + "2"].classList.toggle("active1");
          regVar[Array[i][1] + "1"].textContent = dataArr[
            memLoc(Array[i][2])
          ].textContent.slice(0, 2);
          regVar[Array[i][1] + "2"].textContent = dataArr[
            memLoc(Array[i][2])
          ].textContent.slice(2, 4);
        } else if (
          Array[i][1][0] === "[" &&
          Array[i][1][Array[i][1].length - 1] === "]" &&
          reg8.includes(Array[i][2])
        ) {
          //   reg.textContent = opcode[Array[i][2]];
          //   d.textContent = 0;
          //   w.textContent = 0;
          //   rm.textContent = opcode[Array[i][1]];
          //   mod.textContent = 00;
          regVar[Array[i][2]].classList.toggle("active2");
          await sleep(3000);
          refreshReg();
          refreshMem();
          memArr[memLoc(Array[i][1])].classList.toggle("active1");
          dataArr[memLoc(Array[i][1])].textContent =
            "00" + regVar[Array[i][2]].textContent;
        } else if (
          reg16.includes(Array[i][1]) &&
          isHexadecimal(Array[i][2]) &&
          Array[i][2].length < 5 &&
          Array[i][2].length > 0
        ) {
          //   reg.textContent = opcode[Array[i][1]];
          //   d.textContent = 1;
          //   w.textContent = 1;
          //   rm.textContent = hex2bin(Array[i][2]);
          //   mod.textContent = 00;
          regVar[Array[i][1] + "1"].classList.toggle("active2");
          regVar[Array[i][1] + "2"].classList.toggle("active2");
          await sleep(3000);
          refreshReg();
          refreshMem();
          Array[i][2] = Array[i][2].padStart(4, "0");
          regVar[Array[i][1] + "1"].classList.toggle("active1");
          regVar[Array[i][1] + "2"].classList.toggle("active1");
          regVar[Array[i][1] + "1"].textContent = Array[i][2].slice(0, 2);
          regVar[Array[i][1] + "2"].textContent = Array[i][2].slice(2, 4);
        } else if (
          reg8.includes(Array[i][1]) &&
          isHexadecimal(Array[i][2]) &&
          Array[i][2].length < 3 &&
          Array[i][2].length > 0
        ) {
          //   reg.textContent = opcode[Array[i][1]];
          //   d.textContent = 1;
          //   w.textContent = 0;
          //   rm.textContent = hex2bin(Array[i][2]);
          //   mod.textContent = 00;
          regVar[Array[i][1]].classList.toggle("active2");
          await sleep(3000);
          refreshReg();
          refreshMem();
          Array[i][2] = Array[i][2].padStart(2, "0");
          regVar[Array[i][1]].classList.toggle("active1");
          (regVar[Array[i][1]].textContent = Array[i][2]), toUpperCase();
        } else if (
          Array[i][1][0] === "[" &&
          Array[i][1][Array[i][1].length - 1] === "]" &&
          isHexadecimal(Array[i][2])
        ) {
          //   reg.textContent = opcode[Array[i][1]];
          //   d.textContent = 0;
          //   w.textContent = 0;
          //   rm.textContent = hex2bin(Array[i][2]);
          //   mod.textContent = 00;
          memArr[memLoc(Array[i][1])].classList.toggle("active2");
          await sleep(3000);
          refreshReg();
          refreshMem();
          memArr[memLoc(Array[i][1])].classList.toggle("active1");
          Array[i][2] = Array[i][2].padStart(4, "0");
          dataArr[memLoc(Array[i][1])].textContent = Array[i][2].toUpperCase();
        }
        break;

      case "add":
        op.textContent = opcode[Array[i][0]];
        op.textContent = opcode["and"];
        if (
          reg16.includes(Array[i][1]) &&
          reg16.includes(Array[i][2]) &&
          Array[i][1] !== Array[i][2]
        ) {
          regVar[Array[i][2] + "1"].classList.toggle("active2");
          regVar[Array[i][2] + "2"].classList.toggle("active2");
          regVar[Array[i][1] + "2"].classList.toggle("active2");
          regVar[Array[i][1] + "1"].classList.toggle("active2");
          await sleep(3000);
          refreshReg();
          refreshMem();
          alu.classList.toggle("active1");
          alutext.textContent =
            regVar[Array[i][1] + "1"].textContent +
            regVar[Array[i][1] + "2"].textContent +
            "+" +
            regVar[Array[i][2] + "1"].textContent +
            regVar[Array[i][2] + "2"].textContent;
          await sleep(3000);
          refreshReg();
          refreshMem();

          regVar[Array[i][1] + "2"].classList.toggle("active1");
          regVar[Array[i][1] + "1"].classList.toggle("active1");
          regVar[Array[i][1] + "1"].textContent = decimalToHex(
            Number(hexToDecimal(regVar[Array[i][1] + "1"].textContent)) +
              Number(hexToDecimal(regVar[Array[i][2] + "1"].textContent))
          ).toUpperCase();
          regVar[Array[i][1] + "2"].textContent = decimalToHex(
            Number(hexToDecimal(regVar[Array[i][1] + "2"].textContent)) +
              Number(hexToDecimal(regVar[Array[i][2] + "2"].textContent))
          ).toUpperCase();
        } else if (
          reg8.includes(Array[i][1]) &&
          reg8.includes(Array[i][2]) &&
          Array[i][1] !== Array[i][2]
        ) {
          regVar[Array[i][2]].classList.toggle("active2");
          regVar[Array[i][1]].classList.toggle("active2");
          await sleep(3000);
          refreshReg();
          refreshMem();
          alu.classList.toggle("active1");
          alutext.textContent =
            regVar[Array[i][1]].textContent +
            "+" +
            regVar[Array[i][2]].textContent;
          await sleep(3000);
          refreshReg();
          refreshMem();
          regVar[Array[i][1]].textContent = decimalToHex(
            Number(hexToDecimal(regVar[Array[i][1]].textContent)) +
              Number(hexToDecimal(regVar[Array[i][2]].textContent))
          ).toUpperCase();
          regVar[Array[i][1]].classList.toggle("active1");
        } else if (
          Array[i][1][0] === "[" &&
          Array[i][1][Array[i][1].length - 1] === "]" &&
          reg16.includes(Array[i][2])
        ) {
          regVar[Array[i][2] + "1"].classList.toggle("active2");
          regVar[Array[i][2] + "2"].classList.toggle("active2");
          memArr[memLoc(Array[i][1])].classList.toggle("active2");
          await sleep(3000);
          refreshReg();
          refreshMem();
          alu.classList.toggle("active1");
          alutext.textContent =
            dataArr[memLoc(Array[i][1])].textContent +
            "+" +
            regVar[Array[i][2] + "1"].textContent +
            regVar[Array[i][2] + "2"].textContent;
          await sleep(3000);
          refreshReg();
          refreshMem();

          memArr[memLoc(Array[i][1])].classList.toggle("active1");
          dataArr[memLoc(Array[i][1])].textContent = decimalToHex(
            Number(hexToDecimal(dataArr[memLoc(Array[i][1])].textContent)) +
              Number(
                hexToDecimal(
                  regVar[Array[i][2] + "1"].textContent +
                    regVar[Array[i][2] + "2"].textContent
                )
              )
          ).toUpperCase();
        } else if (
          Array[i][2][0] === "[" &&
          Array[i][2][Array[i][2].length - 1] === "]" &&
          reg16.includes(Array[i][1])
        ) {
          memArr[memLoc(Array[i][2])].classList.toggle("active2");
          regVar[Array[i][1] + "1"].classList.toggle("active2");
          regVar[Array[i][1] + "2"].classList.toggle("active2");
          await sleep(3000);
          refreshReg();
          refreshMem();
          alu.classList.toggle("active1");
          alutext.textContent =
            regVar[Array[i][1] + "1"].textContent +
            regVar[Array[i][1] + "2"].textContent +
            "+" +
            dataArr[memLoc(Array[i][2])].textContent;
          await sleep(3000);
          refreshReg();
          refreshMem();
          regVar[Array[i][1] + "1"].classList.toggle("active1");
          regVar[Array[i][1] + "2"].classList.toggle("active1");

          regVar[Array[i][1] + "1"].textContent = decimalToHex(
            Number(hexToDecimal(regVar[Array[i][1] + "1"].textContent)) +
              Number(
                hexToDecimal(
                  dataArr[memLoc(Array[i][2])].textContent.slice(0, 2)
                )
              )
          ).toUpperCase();
          regVar[Array[i][1] + "2"].textContent = decimalToHex(
            Number(hexToDecimal(regVar[Array[i][1] + "2"].textContent)) +
              Number(
                hexToDecimal(
                  dataArr[memLoc(Array[i][2])].textContent.slice(2, 4)
                )
              )
          ).toUpperCase();
        } else if (
          reg16.includes(Array[i][1]) &&
          isHexadecimal(Array[i][2]) &&
          Array[i][2].length < 5 &&
          Array[i][2].length > 0
        ) {
          regVar[Array[i][1] + "1"].classList.toggle("active2");
          regVar[Array[i][1] + "2"].classList.toggle("active2");
          await sleep(3000);
          refreshReg();
          refreshMem();
          alu.classList.toggle("active1");
          alutext.textContent =
            regVar[Array[i][1] + "1"].textContent +
            regVar[Array[i][1] + "2"].textContent +
            "+" +
            Array[i][2];
          await sleep(3000);
          refreshReg();
          refreshMem();
          Array[i][2] = Array[i][2].padStart(4, "0");
          regVar[Array[i][1] + "1"].classList.toggle("active1");
          regVar[Array[i][1] + "2"].classList.toggle("active1");
          regVar[Array[i][1] + "1"].textContent = decimalToHex(
            Number(hexToDecimal(regVar[Array[i][1] + "1"].textContent)) +
              Number(hexToDecimal(Array[i][2].slice(0, 2)))
          ).toUpperCase();
          regVar[Array[i][1] + "2"].textContent = decimalToHex(
            Number(hexToDecimal(regVar[Array[i][1] + "2"].textContent)) +
              Number(hexToDecimal(Array[i][2].slice(2, 4)))
          ).toUpperCase();
        } else if (
          Array[i][1][0] === "[" &&
          Array[i][1][Array[i][1].length - 1] === "]" &&
          isHexadecimal(Array[i][2])
        ) {
          memArr[memLoc(Array[i][1])].classList.toggle("active2");
          await sleep(3000);
          refreshReg();
          refreshMem();
          alu.classList.toggle("active1");
          alu.textContent =
            dataArr[memLoc(Array[i][1])].textContent + "+" + Array[i][2];
          await sleep(3000);
          refreshReg();
          refreshMem();
          Array[i][2] = Array[i][2].padStart(4, "0");
          memArr[memLoc(Array[i][1])].classList.toggle("active1");
          dataArr[memLoc(Array[i][1])].textContent = decimalToHex(
            Number(hexToDecimal(dataArr[memLoc(Array[i][1])].textContent)) +
              Number(hexToDecimal(Array[i][2]))
          ).toUpperCase();
        }
        break;

      case "sub":
        op.textContent = opcode[Array[i][0]];
        op.textContent = opcode["sub"];
        if (
          reg16.includes(Array[i][1]) &&
          reg16.includes(Array[i][2]) &&
          Array[i][1] !== Array[i][2]
        ) {
          regVar[Array[i][2] + "1"].classList.toggle("active2");
          regVar[Array[i][2] + "2"].classList.toggle("active2");
          regVar[Array[i][1] + "1"].classList.toggle("active2");
          regVar[Array[i][1] + "2"].classList.toggle("active2");
          await sleep(3000);
          refreshReg();
          refreshMem();
          alu.classList.toggle("active1");
          alutext.textContent =
            regVar[Array[i][1] + "1"].textContent +
            regVar[Array[i][1] + "2"].textContent +
            "-" +
            regVar[Array[i][2] + "1"].textContent +
            regVar[Array[i][2] + "2"].textContent;
          await sleep(3000);
          refreshReg();
          refreshMem();
          regVar[Array[i][1] + "1"].textContent = decimalToHex(
            Number(hexToDecimal(regVar[Array[i][1] + "1"].textContent)) -
              Number(hexToDecimal(regVar[Array[i][2] + "1"].textContent))
          ).toUpperCase();
          regVar[Array[i][1] + "2"].textContent = decimalToHex(
            Number(hexToDecimal(regVar[Array[i][1] + "2"].textContent)) -
              Number(hexToDecimal(regVar[Array[i][2] + "2"].textContent))
          ).toUpperCase();

          regVar[Array[i][1] + "1"].classList.toggle("active1");

          regVar[Array[i][1] + "2"].classList.toggle("active1");
        } else if (
          reg8.includes(Array[i][1]) &&
          reg8.includes(Array[i][2]) &&
          Array[i][1] !== Array[i][2]
        ) {
          regVar[Array[i][1]].classList.toggle("active2");
          regVar[Array[i][2]].classList.toggle("active2");
          await sleep(3000);
          refreshReg();
          refreshMem();
          alu.classList.toggle("active1");
          alutext.textContent =
            regVar[Array[i][1]].textContent +
            "-" +
            regVar[Array[i][2]].textContent;
          await sleep(3000);
          refreshReg();
          refreshMem();
          regVar[Array[i][1]].textContent = decimalToHex(
            Number(hexToDecimal(regVar[Array[i][1]].textContent)) -
              Number(hexToDecimal(regVar[Array[i][2]].textContent))
          ).toUpperCase();
          regVar[Array[i][1]].classList.toggle("active1");
          regVar[Array[i][2]].classList.toggle("active2");
        } else if (
          Array[i][1][0] === "[" &&
          Array[i][1][Array[i][1].length - 1] === "]" &&
          reg16.includes(Array[i][2])
        ) {
          regVar[Array[i][2] + "1"].classList.toggle("active2");
          regVar[Array[i][2] + "2"].classList.toggle("active2");
          memArr[memLoc(Array[i][1])].classList.toggle("active2");
          await sleep(3000);
          refreshReg();
          refreshMem();
          alu.classList.toggle("active1");
          alutext.textContent =
            dataArr[memLoc(Array[i][1])].textContent +
            "-" +
            regVar[Array[i][2] + "1"].textContent +
            regVar[Array[i][2] + "2"].textContent;
          await sleep(3000);
          refreshReg();
          refreshMem();

          memArr[memLoc(Array[i][1])].classList.toggle("active1");
          dataArr[memLoc(Array[i][1])].textContent = decimalToHex(
            Number(hexToDecimal(dataArr[memLoc(Array[i][1])].textContent)) -
              Number(
                hexToDecimal(
                  regVar[Array[i][2] + "1"].textContent +
                    regVar[Array[i][2] + "2"].textContent
                )
              )
          ).toUpperCase();
        } else if (
          Array[i][2][0] === "[" &&
          Array[i][2][Array[i][2].length - 1] === "]" &&
          reg16.includes(Array[i][1])
        ) {
          regVar[Array[i][1] + "1"].classList.toggle("active2");
          regVar[Array[i][1] + "2"].classList.toggle("active2");
          memArr[memLoc(Array[i][2])].classList.toggle("active2");
          await sleep(3000);
          refreshReg();
          refreshMem();
          alu.classList.toggle("active1");
          alutext.textContent =
            regVar[Array[i][1] + "1"].textContent +
            regVar[Array[i][1] + "2"].textContent +
            "-" +
            dataArr[memLoc(Array[i][2])].textContent;
          await sleep(3000);
          refreshReg();
          refreshMem();
          regVar[Array[i][1] + "1"].classList.toggle("active1");
          regVar[Array[i][1] + "2"].classList.toggle("active1");

          regVar[Array[i][1] + "1"].textContent = decimalToHex(
            Number(hexToDecimal(regVar[Array[i][1] + "1"].textContent)) -
              Number(
                hexToDecimal(
                  dataArr[memLoc(Array[i][2])].textContent.slice(0, 2)
                )
              )
          ).toUpperCase();
          regVar[Array[i][1] + "2"].textContent = decimalToHex(
            Number(hexToDecimal(regVar[Array[i][1] + "2"].textContent)) -
              Number(
                hexToDecimal(
                  dataArr[memLoc(Array[i][2])].textContent.slice(2, 4)
                )
              )
          ).toUpperCase();
        } else if (
          reg16.includes(Array[i][1]) &&
          isHexadecimal(Array[i][2]) &&
          Array[i][2].length < 5 &&
          Array[i][2].length > 0
        ) {
          regVar[Array[i][1] + "1"].classList.toggle("active2");
          regVar[Array[i][1] + "2"].classList.toggle("active2");
          await sleep(3000);
          refreshReg();
          refreshMem();
          alu.classList.toggle("active1");
          alutext.textContent =
            regVar[Array[i][1] + "1"].textContent +
            regVar[Array[i][1] + "2"].textContent +
            "-" +
            Array[i][2];
          await sleep(3000);
          refreshReg();
          refreshMem();
          Array[i][2] = Array[i][2].padStart(4, "0");
          regVar[Array[i][1] + "1"].classList.toggle("active1");
          regVar[Array[i][1] + "2"].classList.toggle("active1");
          regVar[Array[i][1] + "1"].textContent = decimalToHex(
            Number(hexToDecimal(regVar[Array[i][1] + "1"].textContent)) -
              Number(hexToDecimal(Array[i][2].slice(0, 2)))
          ).toUpperCase();
          regVar[Array[i][1] + "2"].textContent = decimalToHex(
            Number(hexToDecimal(regVar[Array[i][1] + "2"].textContent)) -
              Number(hexToDecimal(Array[i][2].slice(2, 4)))
          ).toUpperCase();
        } else if (
          Array[i][1][0] === "[" &&
          Array[i][1][Array[i][1].length - 1] === "]" &&
          isHexadecimal(Array[i][2])
        ) {
          memArr[memLoc(Array[i][1])].classList.toggle("active2");
          await sleep(3000);
          refreshReg();
          refreshMem();
          alu.classList.toggle("active1");
          alutext.textContent =
            dataArr[memLoc(Array[i][1])].textContent + "-" + Array[i][2];
          await sleep(3000);
          refreshReg();
          refreshMem();
          Array[i][2] = Array[i][2].padStart(4, "0");
          memArr[memLoc(Array[i][1])].classList.toggle("active1");
          dataArr[memLoc(Array[i][1])].textContent = decimalToHex(
            Number(hexToDecimal(dataArr[memLoc(Array[i][1])].textContent)) -
              Number(hexToDecimal(Array[i][2]))
          ).toUpperCase();
        }
        break;
      case "lshift":
        op.textContent = opcode[Array[i][0]];
        op.textContent = opcode["lshift"];
        if (
          reg16.includes(Array[i][1]) &&
          Array[i][2].length < 2 &&
          isHexadecimal(Array[i][2])
        ) {
          regVar[Array[i][1] + "1"].classList.toggle("active2");
          regVar[Array[i][1] + "2"].classList.toggle("active2");
          await sleep(3000);
          refreshReg();
          refreshMem();
          alu.classList.toggle("active1");
          alutext.textContent =
            regVar[Array[i][1] + "1"].textContent +
            regVar[Array[i][1] + "2"].textContent +
            "<<" +
            Array[i][2];
          await sleep(3000);
          refreshReg();
          refreshMem();
          var num =
            regVar[Array[i][1] + "1"].textContent +
            regVar[Array[i][1] + "2"].textContent;
          regVar[Array[i][1] + "1"].classList.toggle("active1");
          regVar[Array[i][1] + "2"].classList.toggle("active1");
          num = Number(hexToDecimal(num));
          num = num.toString(2);
          num = num.padStart(16, "0");
          for (var j = 0; j < Number(Array[i][2]); j++) {
            num = num.slice(1, 16);
            num = num + "0";
          }
          num = Number(parseInt(num, 2));
          num = num.toString(16);
          num = num.padStart(4, "0");
          regVar[Array[i][1] + "2"].textContent = num.slice(2, 4);
          regVar[Array[i][1] + "1"].textContent = num.slice(0, 2);
        } else if (reg8.includes(Array[i][1]) && Number(Array[i][2]) < 8) {
          regVar[Array[i][1]].classList.toggle("active2");
          await sleep(3000);
          refreshReg();
          refreshMem();
          alu.classList.toggle("active1");
          alutext.textContent =
            regVar[Array[i][1]].textContent + "<<" + Array[i][2];
          await sleep(3000);
          refreshReg();
          refreshMem();
          var num = regVar[Array[i][1]].textContent;
          regVar[Array[i][1]].classList.toggle("active1");
          num = Number(hexToDecimal(num));
          num = num.toString(2);
          num = num.padStart(8, "0");
          for (var j = 0; j < Number(Array[i][2]); j++) {
            num = num.slice(1, 8);
            num = num + "0";
          }
          num = Number(parseInt(num, 2));
          num = num.toString(16);
          num = num.padStart(2, "0");
          regVar[Array[i][1]].textContent = num;
        } else if (
          Array[i][1][0] === "[" &&
          Array[i][1][Array[i][1].length - 1] === "]" &&
          Array[i][1].length < 4 &&
          isHexadecimal(Array[i][1][1]) &&
          Array[i][2].length < 2 &&
          isHexadecimal(Array[i][2])
        ) {
          memArr[memLoc(Array[i][1])].classList.toggle("active2");
          await sleep(3000);
          refreshReg();
          refreshMem();
          alu.classList.toggle("active1");
          alutext.textContent =
            dataArr[memLoc(Array[i][1])].textContent + "<<" + Array[i][2];
          await sleep(3000);
          refreshReg();
          refreshMem();
          var num = dataArr[memLoc(Array[i][1])].textContent;
          memArr[memLoc(Array[i][1])].classList.toggle("active1");
          num = Number(hexToDecimal(num));
          num = num.toString(2);
          num = num.padStart(16, "0");
          for (var j = 0; j < Number(Array[i][2]); j++) {
            num = num.slice(1, 16);
            num = num + "0";
          }
          num = Number(parseInt(num, 2));
          num = num.toString(16);
          num = num.padStart(4, "0");
          dataArr[memLoc(Array[i][1])].textContent = num;
        }
        break;
      case "rshift":
        op.textContent = opcode[Array[i][0]];
        op.textContent = opcode["rshift"];
        if (
          reg16.includes(Array[i][1]) &&
          Array[i][2].length < 2 &&
          isHexadecimal(Array[i][2])
        ) {
          regVar[Array[i][1] + "1"].classList.toggle("active2");
          regVar[Array[i][1] + "2"].classList.toggle("active2");
          await sleep(3000);
          refreshReg();
          refreshMem();
          alu.classList.toggle("active1");
          alutext.textContent =
            regVar[Array[i][1] + "1"].textContent +
            regVar[Array[i][1] + "2"].textContent +
            ">>" +
            Array[i][2];
          await sleep(3000);
          refreshReg();
          refreshMem();
          var num =
            regVar[Array[i][1] + "1"].textContent +
            regVar[Array[i][1] + "2"].textContent;
          regVar[Array[i][1] + "1"].classList.toggle("active1");
          regVar[Array[i][1] + "2"].classList.toggle("active1");
          num = Number(hexToDecimal(num));
          num = num.toString(2);
          num = num.padStart(16, "0");
          for (var j = 0; j < Number(Array[i][2]); j++) {
            num = num.slice(0, 15);
            num = "0" + num;
          }
          num = Number(parseInt(num, 2));
          num = num.toString(16);
          num = num.padStart(4, "0");
          regVar[Array[i][1] + "2"].textContent = num.slice(2, 4);
          regVar[Array[i][1] + "1"].textContent = num.slice(0, 2);
        } else if (reg8.includes(Array[i][1]) && Number(Array[i][2]) < 8) {
          regVar[Array[i][1]].classList.toggle("active2");
          await sleep(3000);
          refreshReg();
          refreshMem();
          alu.classList.toggle("active1");
          alutext.textContent =
            regVar[Array[i][1]].textContent + ">>" + Array[i][2];
          await sleep(3000);
          refreshReg();
          refreshMem();
          var num = regVar[Array[i][1]].textContent;
          regVar[Array[i][1]].classList.toggle("active1");
          num = Number(hexToDecimal(num));
          num = num.toString(2);
          num = num.padStart(8, "0");
          for (var j = 0; j < Number(Array[i][2]); j++) {
            num = num.slice(0, 7);
            num = "0" + num;
          }
          num = Number(parseInt(num, 2));
          num = num.toString(16);
          num = num.padStart(2, "0");
          regVar[Array[i][1]].textContent = num;
        } else if (
          Array[i][1][0] === "[" &&
          Array[i][1][Array[i][1].length - 1] === "]" &&
          Array[i][1].length < 4 &&
          isHexadecimal(Array[i][1][1]) &&
          Array[i][2].length < 2 &&
          isHexadecimal(Array[i][2])
        ) {
          memArr[memLoc(Array[i][1])].classList.toggle("active2");
          await sleep(3000);
          refreshReg();
          refreshMem();
          alu.classList.toggle("active1");
          alutext.textContent =
            dataArr[memLoc(Array[i][1])].textContent + ">>" + Array[i][2];
          await sleep(3000);
          refreshReg();
          refreshMem();
          var num = dataArr[memLoc(Array[i][1])].textContent;
          memArr[memLoc(Array[i][1])].classList.toggle("active1");
          num = Number(hexToDecimal(num));
          num = num.toString(2);
          num = num.padStart(16, "0");
          for (var j = 0; j < Number(Array[i][2]); j++) {
            num = num.slice(0, 15);
            num = "0" + num;
          }
          num = Number(parseInt(num, 2));
          num = num.toString(16);
          num = num.padStart(4, "0");
          dataArr[memLoc(Array[i][1])].textContent = num;
        }
        break;
      case "ror":
        op.textContent = opcode[Array[i][0]];
        op.textContent = opcode["ror"];
        if (
          reg16.includes(Array[i][1]) &&
          Array[i][2].length < 2 &&
          isHexadecimal(Array[i][2])
        ) {
          regVar[Array[i][1] + "1"].classList.toggle("active2");
          regVar[Array[i][1] + "2"].classList.toggle("active2");
          await sleep(3000);
          refreshReg();
          refreshMem();
          alu.classList.toggle("active1");
          alutext.textContent =
            regVar[Array[i][1] + "1"].textContent +
            regVar[Array[i][1] + "2"].textContent +
            ">>" +
            Array[i][2];
          await sleep(3000);
          refreshReg();
          refreshMem();
          var num =
            regVar[Array[i][1] + "1"].textContent +
            regVar[Array[i][1] + "2"].textContent;
          regVar[Array[i][1] + "1"].classList.toggle("active1");
          regVar[Array[i][1] + "2"].classList.toggle("active1");
          num = Number(hexToDecimal(num));
          num = num.toString(2);
          num = num.padStart(16, "0");
          for (var j = 0; j < Number(Array[i][2]); j++) {
            num = num.slice(0, 15);
            num = num[num.length - 1] + num;
          }
          num = Number(parseInt(num, 2));
          num = num.toString(16);
          num = num.padStart(4, "0");
          regVar[Array[i][1] + "2"].textContent = num.slice(2, 4);
          regVar[Array[i][1] + "1"].textContent = num.slice(0, 2);
        } else if (reg8.includes(Array[i][1]) && Number(Array[i][2]) < 8) {
          regVar[Array[i][1]].classList.toggle("active2");
          await sleep(3000);
          refreshReg();
          refreshMem();
          alu.classList.toggle("active1");
          alutext.textContent =
            regVar[Array[i][1]].textContent + ">>" + Array[i][2];
          await sleep(3000);
          refreshReg();
          refreshMem();
          var num = regVar[Array[i][1]].textContent;
          regVar[Array[i][1]].classList.toggle("active1");
          num = Number(hexToDecimal(num));
          num = num.toString(2);
          num = num.padStart(8, "0");
          for (var j = 0; j < Number(Array[i][2]); j++) {
            num = num.slice(0, 7);
            num = num[num.length - 1] + num;
          }
          num = Number(parseInt(num, 2));
          num = num.toString(16);
          num = num.padStart(2, "0");
          regVar[Array[i][1]].textContent = num;
        } else if (
          Array[i][1][0] === "[" &&
          Array[i][1][Array[i][1].length - 1] === "]" &&
          Array[i][1].length < 4 &&
          isHexadecimal(Array[i][1][1]) &&
          Array[i][2].length < 2 &&
          isHexadecimal(Array[i][2])
        ) {
          memArr[memLoc(Array[i][1])].classList.toggle("active2");
          await sleep(3000);
          refreshReg();
          refreshMem();
          alu.classList.toggle("active1");
          alutext.textContent =
            dataArr[memLoc(Array[i][1])].textContent + ">>" + Array[i][2];
          await sleep(3000);
          refreshReg();
          refreshMem();
          var num = dataArr[memLoc(Array[i][1])].textContent;
          memArr[memLoc(Array[i][1])].classList.toggle("active1");
          num = Number(hexToDecimal(num));
          num = num.toString(2);
          num = num.padStart(16, "0");
          for (var j = 0; j < Number(Array[i][2]); j++) {
            num = num.slice(0, 15);
            num = num[num.length - 1] + num;
          }
          num = Number(parseInt(num, 2));
          num = num.toString(16);
          num = num.padStart(4, "0");
          dataArr[memLoc(Array[i][1])].textContent = num;
        }
        break;
      case "rol":
        op.textContent = opcode[Array[i][0]];
        op.textContent = opcode["rol"];
        if (
          reg16.includes(Array[i][1]) &&
          Array[i][2].length < 2 &&
          isHexadecimal(Array[i][2])
        ) {
          regVar[Array[i][1] + "1"].classList.toggle("active2");
          regVar[Array[i][1] + "2"].classList.toggle("active2");
          await sleep(3000);
          refreshReg();
          refreshMem();
          alu.classList.toggle("active1");
          alutext.textContent =
            regVar[Array[i][1] + "1"].textContent +
            regVar[Array[i][1] + "2"].textContent +
            "<<" +
            Array[i][2];
          await sleep(3000);
          refreshReg();
          refreshMem();
          var num =
            regVar[Array[i][1] + "1"].textContent +
            regVar[Array[i][1] + "2"].textContent;
          regVar[Array[i][1] + "1"].classList.toggle("active1");
          regVar[Array[i][1] + "2"].classList.toggle("active1");
          num = Number(hexToDecimal(num));
          num = num.toString(2);
          num = num.padStart(16, "0");
          for (var j = 0; j < Number(Array[i][2]); j++) {
            num = num.slice(1, 16);
            num = num + num[0];
          }
          num = Number(parseInt(num, 2));
          num = num.toString(16);
          num = num.padStart(4, "0");
          regVar[Array[i][1] + "2"].textContent = num.slice(2, 4);
          regVar[Array[i][1] + "1"].textContent = num.slice(0, 2);
        } else if (reg8.includes(Array[i][1]) && Number(Array[i][2]) < 8) {
          regVar[Array[i][1]].classList.toggle("active2");
          await sleep(3000);
          refreshReg();
          refreshMem();
          alu.classList.toggle("active1");
          alutext.textContent =
            regVar[Array[i][1]].textContent + "<<" + Array[i][2];
          await sleep(3000);
          refreshReg();
          refreshMem();
          var num = regVar[Array[i][1]].textContent;
          regVar[Array[i][1]].classList.toggle("active1");
          num = Number(hexToDecimal(num));
          num = num.toString(2);
          num = num.padStart(8, "0");
          for (var j = 0; j < Number(Array[i][2]); j++) {
            num = num.slice(1, 8);
            num = num + num[0];
          }
          num = Number(parseInt(num, 2));
          num = num.toString(16);
          num = num.padStart(2, "0");
          regVar[Array[i][1]].textContent = num;
        } else if (
          Array[i][1][0] === "[" &&
          Array[i][1][Array[i][1].length - 1] === "]" &&
          Array[i][1].length < 4 &&
          isHexadecimal(Array[i][1][1]) &&
          Array[i][2].length < 2 &&
          isHexadecimal(Array[i][2])
        ) {
          memArr[memLoc(Array[i][1])].classList.toggle("active2");
          await sleep(3000);
          refreshReg();
          refreshMem();
          alu.classList.toggle("active1");
          alutext.textContent =
            dataArr[memLoc(Array[i][1])].textContent + "<<" + Array[i][2];
          await sleep(3000);
          refreshReg();
          refreshMem();
          var num = dataArr[memLoc(Array[i][1])].textContent;
          memArr[memLoc(Array[i][1])].classList.toggle("active1");
          num = Number(hexToDecimal(num));
          num = num.toString(2);
          num = num.padStart(16, "0");
          for (var j = 0; j < Number(Array[i][2]); j++) {
            num = num.slice(1, 16);
            num = num + num[0];
          }
          num = Number(parseInt(num, 2));
          num = num.toString(16);
          num = num.padStart(4, "0");
          dataArr[memLoc(Array[i][1])].textContent = num;
        }
        break;
      case "not":
        op.textContent = opcode[Array[i][0]];
        op.textContent = opcode["not"];
        if (reg16.includes(Array[i][1])) {
          regVar[Array[i][1] + "1"].classList.toggle("active2");
          regVar[Array[i][1] + "2"].classList.toggle("active2");
          await sleep(3000);
          refreshReg();
          refreshMem();
          alu.classList.toggle("active1");
          alutext.textContent =
            "~" +
            regVar[Array[i][1] + "1"].textContent +
            regVar[Array[i][1] + "2"].textContent;
          await sleep(3000);
          refreshReg();
          refreshMem();
          var num =
            regVar[Array[i][1] + "1"].textContent +
            regVar[Array[i][1] + "2"].textContent;
          regVar[Array[i][1] + "1"].classList.toggle("active1");
          regVar[Array[i][1] + "2"].classList.toggle("active1");
          num = Number(hexToDecimal(num));
          num = num.toString(2);
          num = num.padStart(16, "0");
          num = negt(16, num);
          num = Number(parseInt(num, 2));
          num = num.toString(16);
          num = num.padStart(4, "0");
          regVar[Array[i][1] + "2"].textContent = num.slice(2, 4);
          regVar[Array[i][1] + "1"].textContent = num.slice(0, 2);
        } else if (reg8.includes(Array[i][1])) {
          regVar[Array[i][1]].classList.toggle("active2");
          await sleep(3000);
          refreshReg();
          refreshMem();
          alu.classList.toggle("active1");
          alutext.textContent = "~" + regVar[Array[i][1]].textContent;
          await sleep(3000);
          refreshReg();
          refreshMem();
          var num = regVar[Array[i][1]].textContent;
          regVar[Array[i][1]].classList.toggle("active1");
          num = Number(hexToDecimal(num));
          num = num.toString(2);
          num = num.padStart(8, "0");
          num = negt(8, num);
          num = Number(parseInt(num, 2));
          num = num.toString(16);
          num = num.padStart(2, "0");
          regVar[Array[i][1]].textContent = num;
        } else if (
          Array[i][1][0] === "[" &&
          Array[i][1][Array[i][1].length - 1] === "]" &&
          Array[i][1].length < 4 &&
          isHexadecimal(Array[i][1][1])
        ) {
          memArr[memLoc(Array[i][1])].classList.toggle("active2");
          await sleep(3000);
          refreshReg();
          refreshMem();
          alu.classList.toggle("active1");
          alutext.textContent = "~" + dataArr[memLoc(Array[i][1])].textContent;
          await sleep(3000);
          refreshReg();
          refreshMem();
          var num = dataArr[memLoc(Array[i][1])].textContent;
          memArr[memLoc(Array[i][1])].classList.toggle("active1");
          num = Number(hexToDecimal(num));
          num = num.toString(2);
          num = num.padStart(16, "0");
          num = negt(16, num);
          num = Number(parseInt(num, 2));
          num = num.toString(16);
          num = num.padStart(4, "0");
          dataArr[memLoc(Array[i][1])].textContent = num;
        }
        break;
      /////////////////////END NOT OPERATION/////////////////////////
      case "inc":
        op.textContent = opcode[Array[i][0]];
        op.textContent = opcode["inc"];
        if (reg16.includes(Array[i][1])) {
          regVar[Array[i][1] + "1"].classList.toggle("active2");
          regVar[Array[i][1] + "2"].classList.toggle("active2");
          await sleep(3000);
          refreshReg();
          refreshMem();
          alu.classList.toggle("active1");
          alutext.textContent =
            regVar[Array[i][1] + "1"].textContent +
            regVar[Array[i][1] + "2"].textContent +
            "+1";
          await sleep(3000);
          refreshReg();
          refreshMem();
          value_ob = Number(
            hexToDecimal(
              regVar[Array[i][1] + "1"].textContent +
                regVar[Array[i][1] + "2"].textContent
            )
          );
          value_ob = value_ob + 1;
          hexValue = value_ob.toString(16);
          if (hexValue.length > 4) {
          } else {
            hexValue = hexValue.padStart(4, "0");
            regVar[Array[i][1] + "1"].textContent = hexValue.slice(0, 2);
            regVar[Array[i][1] + "2"].textContent = hexValue.slice(2, 4);
            regVar[Array[i][1] + "1"].classList.toggle("active1");
            regVar[Array[i][1] + "2"].classList.toggle("active1");
          }
        } else if (reg8.includes(Array[i][1])) {
          regVar[Array[i][1]].classList.toggle("active2");
          await sleep(3000);
          refreshReg();
          refreshMem();
          alu.classList.toggle("active1");
          alutext.textContent = regVar[Array[i][1]].textContent + "+1";
          await sleep(3000);
          refreshReg();
          refreshMem();
          value_ob = Number(hexToDecimal(regVar[Array[i][1]].textContent));
          value_ob = value_ob + 1;

          hexValue = value_ob.toString(16);

          if (hexValue.length > 2) {
            console.log("Overflow");
          } else {
            hexValue = hexValue.padStart(2, "0");
            regVar[Array[i][1]].textContent = hexValue;
            regVar[Array[i][1]].classList.toggle("active1");
          }
        } else if (
          Array[i][1][0] === "[" &&
          Array[i][1][Array[i][1].length - 1] === "]"
        ) {
          memArr[memLoc(Array[i][1])].classList.toggle("active2");
          await sleep(3000);
          refreshReg();
          refreshMem();
          alu.classList.toggle("active1");
          alutext.textContent = dataArr[memLoc(Array[i][1])].textContent + "+1";
          await sleep(3000);
          refreshReg();
          refreshMem();
          value_ob =
            Number(hexToDecimal(dataArr[memLoc(Array[i][1])].textContent)) + 1;
          hexValue = value_ob.toString(16);
          if (hexValue.length > 4) {
            console.log("Overflow");
          } else {
            hexValue = hexValue.padStart(4, "0");
            dataArr[memLoc(Array[i][1])].textContent = hexValue;
            memArr[memLoc(Array[i][1])].classList.toggle("active1");
          }
        }
        break;
      case "dec":
        op.textContent = opcode[Array[i][0]];
        op.textContent = opcode["dec"];
        if (reg16.includes(Array[i][1])) {
          regVar[Array[i][1] + "1"].classList.toggle("active2");
          regVar[Array[i][1] + "2"].classList.toggle("active2");
          await sleep(3000);
          refreshReg();
          refreshMem();
          alu.classList.toggle("active1");
          alutext.textContent =
            regVar[Array[i][1] + "1"].textContent +
            regVar[Array[i][1] + "2"].textContent +
            "-1";
          await sleep(3000);
          refreshReg();
          refreshMem();
          value_ob = Number(
            hexToDecimal(
              regVar[Array[i][1] + "1"].textContent +
                regVar[Array[i][1] + "2"].textContent
            )
          );
          value_ob = value_ob - 1;
          if (value_ob < 0) {
            console.log("underflow");

            // ***LEFT SPACE FOR 15'S COMPLIMENT
          } else {
            hexValue = value_ob.toString(16);
            hexValue = hexValue.padStart(4, "0");
            regVar[Array[i][1] + "1"].textContent = hexValue.slice(0, 2);
            regVar[Array[i][1] + "2"].textContent = hexValue.slice(2, 4);
            regVar[Array[i][1] + "1"].classList.toggle("active1");
            regVar[Array[i][1] + "2"].classList.toggle("active1");
          }
        } else if (reg8.includes(Array[i][1])) {
          regVar[Array[i][1]].classList.toggle("active2");
          await sleep(3000);
          refreshReg();
          refreshMem();
          alu.classList.toggle("active1");
          alutext.textContent = regVar[Array[i][1]].textContent + "-1";
          await sleep(3000);
          refreshReg();
          refreshMem();
          value_ob = Number(hexToDecimal(regVar[Array[i][1]].textContent));
          value_ob = value_ob - 1;
          if (value_ob < 0) {
            console.log("Underflow");

            // ***LEFT SPACE FOR 15'S COMPLIMENT
          } else {
            hexValue = value_ob.toString(16);
            hexValue = hexValue.padStart(2, "0");
            regVar[Array[i][1]].textContent = hexValue;
            regVar[Array[i][1]].classList.toggle("active1");
          }
        } else if (
          Array[i][1][0] === "[" &&
          Array[i][1][Array[i][1].length - 1] === "]"
        ) {
          memArr[memLoc(Array[i][1])].classList.toggle("active2");
          await sleep(3000);
          refreshReg();
          refreshMem();
          alu.classList.toggle("active1");
          alutext.textContent = dataArr[memLoc(Array[i][1])].textContent + "-1";
          await sleep(3000);
          refreshReg();
          refreshMem();
          value_ob = Number(
            hexToDecimal(dataArr[memLoc(Array[i][1])].textContent)
          );
          value_ob = value_ob - 1;
          if (value_ob < 0) {
            console.log("Underflow");

            // ***LEFT SPACE FOR 15'S COMPLIMENT
          } else {
            hexValue = value_ob.toString(16);
            hexValue = hexValue.padStart(4, "0");
            dataArr[memLoc(Array[i][1])].textContent = hexValue;
            memArr[memLoc(Array[i][1])].classList.toggle("active1");
          }
        }

        break;
      case "and":
        op.textContent = opcode[Array[i][0]];
        op.textContent = opcode["and"];
        if (
          reg16.includes(Array[i][1]) &&
          reg16.includes(Array[i][2]) &&
          Array[i][1] !== Array[i][2]
        ) {
          regVar[Array[i][1] + "1"].classList.toggle("active2");
          regVar[Array[i][2] + "1"].classList.toggle("active2");
          regVar[Array[i][1] + "2"].classList.toggle("active2");
          regVar[Array[i][2] + "2"].classList.toggle("active2");
          await sleep(3000);
          refreshReg();
          refreshMem();
          alu.classList.toggle("active1");
          alutext.textContent =
            regVar[Array[i][1] + "1"].textContent +
            regVar[Array[i][1] + "2"].textContent +
            "&" +
            regVar[Array[i][2] + "1"].textContent +
            regVar[Array[i][2] + "2"].textContent;
          await sleep(3000);
          refreshReg();
          refreshMem();
          let ah1value = regVar[Array[i][1] + "1"].textContent;
          let al1value = regVar[Array[i][1] + "2"].textContent;
          let ah2value = regVar[Array[i][2] + "1"].textContent;
          let al2value = regVar[Array[i][2] + "2"].textContent;
          let first16 = hexToDecimal(ah1value + al1value);
          let second16 = hexToDecimal(ah2value + al2value);
          let result1 = andFun(first16, second16);
          result1 = decimalToHex(result1);
          result1 = result1.padStart(4, "0");
          regVar[Array[i][1] + "1"].textContent = result1.slice(0, 2);
          regVar[Array[i][1] + "2"].textContent = result1.slice(2, 4);
          regVar[Array[i][1] + "1"].classList.toggle("active1");
          regVar[Array[i][1] + "2"].classList.toggle("active1");
        } else if (
          reg8.includes(Array[i][1]) &&
          reg8.includes(Array[i][2]) &&
          Array[i][1] !== Array[i][2]
        ) {
          regVar[Array[i][1]].classList.toggle("active2");
          regVar[Array[i][2]].classList.toggle("active2");
          await sleep(3000);
          refreshReg();
          refreshMem();
          alu.classList.toggle("active1");
          alutext.textContent =
            regVar[Array[i][1]].textContent +
            "&" +
            regVar[Array[i][2]].textContent;
          await sleep(3000);
          refreshReg();
          refreshMem();
          let reg8_1 = regVar[Array[i][1]].textContent;
          let reg8_2 = regVar[Array[i][2]].textContent;
          reg8_1 = hexToDecimal(reg8_1);
          reg8_2 = hexToDecimal(reg8_2);
          let result = andFun(reg8_1, reg8_2);
          result = decimalToHex(result);
          result = result.padStart(2, "0");
          regVar[Array[i][1]].textContent = result;
          regVar[Array[i][1]].classList.toggle("active1");
        } else if (
          Array[i][1][0] === "[" &&
          Array[i][1][Array[i][1].length - 1] === "]" &&
          reg16.includes(Array[i][2])
        ) {
          regVar[Array[i][2] + "1"].classList.toggle("active2");
          regVar[Array[i][2] + "2"].classList.toggle("active2");
          memArr[memLoc(Array[i][1])].classList.toggle("active2");
          await sleep(3000);
          refreshReg();
          refreshMem();
          alu.classList.toggle("active1");
          alutext.textContent =
            dataArr[memLoc(Array[i][1])].textContent +
            "&" +
            regVar[Array[i][2] + "1"].textContent +
            regVar[Array[i][2] + "2"].textContent;
          await sleep(3000);
          refreshReg();
          refreshMem();
          let ah1value = regVar[Array[i][2] + "1"].textContent;
          let al1value = regVar[Array[i][2] + "2"].textContent;
          let memData = dataArr[memLoc(Array[i][1])].textContent;
          let first16 = hexToDecimal(ah1value + al1value);
          memData = hexToDecimal(memData);
          let result = andFun(first16, memData);

          result = decimalToHex(result);
          console.log(result);
          result = result.padStart(4, "0");
          memArr[memLoc(Array[i][1])].classList.toggle("active1");
          dataArr[memLoc(Array[i][1])].textContent = result;
        } else if (
          Array[i][2][0] === "[" &&
          Array[i][2][Array[i][2].length - 1] === "]" &&
          reg16.includes(Array[i][1])
        ) {
          memArr[memLoc(Array[i][2])].classList.toggle("active2");
          regVar[Array[i][1] + "1"].classList.toggle("active2");
          regVar[Array[i][1] + "2"].classList.toggle("active2");
          await sleep(3000);
          refreshReg();
          refreshMem();
          alu.classList.toggle("active1");
          alutext.textContent =
            regVar[Array[i][1] + "1"].textContent +
            regVar[Array[i][1] + "2"].textContent +
            "&" +
            dataArr[memLoc(Array[i][2])].textContent;
          await sleep(3000);
          refreshReg();
          refreshMem();
          let ah1value = regVar[Array[i][1] + "1"].textContent;
          let al1value = regVar[Array[i][1] + "2"].textContent;
          let memData = dataArr[memLoc(Array[i][2])].textContent;
          let first16 = hexToDecimal(ah1value + al1value);
          memData = hexToDecimal(memData);
          let result = andFun(first16, memData);
          result = decimalToHex(result);
          result = result.toUpperCase();
          result = result.padStart(4, "0");
          regVar[Array[i][1] + "1"].textContent = result.slice(0, 2);
          regVar[Array[i][1] + "2"].textContent = result.slice(2, 4);
          regVar[Array[i][1] + "1"].classList.toggle("active1");
          regVar[Array[i][1] + "2"].classList.toggle("active1");
        }
        break;
      case "or":
        op.textContent = opcode[Array[i][0]];
        op.textContent = opcode["or"];
        if (
          reg16.includes(Array[i][1]) &&
          reg16.includes(Array[i][2]) &&
          Array[i][1] !== Array[i][2]
        ) {
          regVar[Array[i][1] + "1"].classList.toggle("active2");
          regVar[Array[i][2] + "1"].classList.toggle("active2");
          regVar[Array[i][1] + "2"].classList.toggle("active2");
          regVar[Array[i][2] + "2"].classList.toggle("active2");
          await sleep(3000);
          refreshReg();
          refreshMem();
          alu.classList.toggle("active1");
          alutext.textContent =
            regVar[Array[i][1] + "1"].textContent +
            regVar[Array[i][1] + "2"].textContent +
            "|" +
            regVar[Array[i][2] + "1"].textContent +
            regVar[Array[i][2] + "2"].textContent;
          await sleep(3000);
          refreshReg();
          refreshMem();
          let ah1value = regVar[Array[i][1] + "1"].textContent;
          let al1value = regVar[Array[i][1] + "2"].textContent;
          let ah2value = regVar[Array[i][2] + "1"].textContent;
          let al2value = regVar[Array[i][2] + "2"].textContent;
          let first16 = hexToDecimal(ah1value + al1value);
          let second16 = hexToDecimal(ah2value + al2value);
          let result1 = orFun(first16, second16);
          result1 = decimalToHex(result1);
          result1 = result1.padStart(4, "0");
          regVar[Array[i][1] + "1"].textContent = result1.slice(0, 2);
          regVar[Array[i][1] + "2"].textContent = result1.slice(2, 4);
          regVar[Array[i][1] + "1"].classList.toggle("active1");
          regVar[Array[i][1] + "2"].classList.toggle("active1");
        } else if (
          reg8.includes(Array[i][1]) &&
          reg8.includes(Array[i][2]) &&
          Array[i][1] !== Array[i][2]
        ) {
          regVar[Array[i][1]].classList.toggle("active2");
          regVar[Array[i][2]].classList.toggle("active2");
          await sleep(3000);
          refreshReg();
          refreshMem();
          alu.classList.toggle("active1");
          alutext.textContent =
            regVar[Array[i][1]].textContent +
            "|" +
            regVar[Array[i][2]].textContent;
          await sleep(3000);
          refreshReg();
          refreshMem();
          let reg8_1 = regVar[Array[i][1]].textContent;
          let reg8_2 = regVar[Array[i][2]].textContent;
          reg8_1 = hexToDecimal(reg8_1);
          reg8_2 = hexToDecimal(reg8_2);
          let result = orFun(reg8_1, reg8_2);
          result = decimalToHex(result);
          result = result.padStart(2, "0");
          regVar[Array[i][1]].textContent = result;
          regVar[Array[i][1]].classList.toggle("active1");
        } else if (
          Array[i][1][0] === "[" &&
          Array[i][1][Array[i][1].length - 1] === "]" &&
          reg16.includes(Array[i][2])
        ) {
          regVar[Array[i][2] + "1"].classList.toggle("active2");
          regVar[Array[i][2] + "2"].classList.toggle("active2");
          memArr[memLoc(Array[i][1])].classList.toggle("active2");
          await sleep(3000);
          refreshReg();
          refreshMem();
          alu.classList.toggle("active1");
          alutext.textContent =
            dataArr[memLoc(Array[i][1])].textContent +
            "|" +
            regVar[Array[i][2] + "1"].textContent +
            regVar[Array[i][2] + "2"].textContent;
          await sleep(3000);
          refreshReg();
          refreshMem();
          let ah1value = regVar[Array[i][2] + "1"].textContent;
          let al1value = regVar[Array[i][2] + "2"].textContent;
          let memData = dataArr[memLoc(Array[i][1])].textContent;
          let first16 = hexToDecimal(ah1value + al1value);
          memData = hexToDecimal(memData);
          let result = orFun(first16, memData);
          result = decimalToHex(result);
          result = result.padStart(4, "0");
          memArr[memLoc(Array[i][1])].classList.toggle("active1");
          dataArr[memLoc(Array[i][1])].textContent = result;
        } else if (
          Array[i][2][0] === "[" &&
          Array[i][2][Array[i][2].length - 1] === "]" &&
          reg16.includes(Array[i][1])
        ) {
          memArr[memLoc(Array[i][2])].classList.toggle("active2");
          regVar[Array[i][1] + "1"].classList.toggle("active2");
          regVar[Array[i][1] + "2"].classList.toggle("active2");
          await sleep(3000);
          refreshReg();
          refreshMem();
          alu.classList.toggle("active1");
          alutext.textContent =
            regVar[Array[i][1] + "1"].textContent +
            regVar[Array[i][1] + "2"].textContent +
            "|" +
            dataArr[memLoc(Array[i][2])].textContent;
          await sleep(3000);
          refreshReg();
          refreshMem();
          let ah1value = regVar[Array[i][1] + "1"].textContent;
          let al1value = regVar[Array[i][1] + "2"].textContent;
          let memData = dataArr[memLoc(Array[i][2])].textContent;
          let first16 = hexToDecimal(ah1value + al1value);
          memData = hexToDecimal(memData);
          let result = orFun(first16, memData);
          result = decimalToHex(result);
          result = result.toUpperCase();
          result = result.padStart(4, "0");
          regVar[Array[i][1] + "1"].textContent = result.slice(0, 2);
          regVar[Array[i][1] + "2"].textContent = result.slice(2, 4);
          regVar[Array[i][1] + "1"].classList.toggle("active1");
          regVar[Array[i][1] + "2"].classList.toggle("active1");
        }
        break;
      case "xor":
        op.textContent = opcode[Array[i][0]];
        op.textContent = opcode["xor"];
        if (
          reg16.includes(Array[i][1]) &&
          reg16.includes(Array[i][2]) &&
          Array[i][1] !== Array[i][2]
        ) {
          regVar[Array[i][1] + "1"].classList.toggle("active2");
          regVar[Array[i][2] + "1"].classList.toggle("active2");
          regVar[Array[i][1] + "2"].classList.toggle("active2");
          regVar[Array[i][2] + "2"].classList.toggle("active2");
          await sleep(3000);
          refreshReg();
          refreshMem();
          alu.classList.toggle("active1");
          alutext.textContent =
            regVar[Array[i][1] + "1"].textContent +
            regVar[Array[i][1] + "2"].textContent +
            "|" +
            regVar[Array[i][2] + "1"].textContent +
            regVar[Array[i][2] + "2"].textContent;
          await sleep(3000);
          refreshReg();
          refreshMem();
          let ah1value = regVar[Array[i][1] + "1"].textContent;
          let al1value = regVar[Array[i][1] + "2"].textContent;
          let ah2value = regVar[Array[i][2] + "1"].textContent;
          let al2value = regVar[Array[i][2] + "2"].textContent;
          let first16 = hexToDecimal(ah1value + al1value);
          let second16 = hexToDecimal(ah2value + al2value);
          let result1 = xorFun(first16, second16);
          result1 = decimalToHex(result1);
          result1 = result1.padStart(4, "0");
          regVar[Array[i][1] + "1"].textContent = result1.slice(0, 2);
          regVar[Array[i][1] + "2"].textContent = result1.slice(2, 4);
          regVar[Array[i][1] + "1"].classList.toggle("active1");
          regVar[Array[i][1] + "2"].classList.toggle("active1");
        } else if (
          reg8.includes(Array[i][1]) &&
          reg8.includes(Array[i][2]) &&
          Array[i][1] !== Array[i][2]
        ) {
          regVar[Array[i][1]].classList.toggle("active2");
          regVar[Array[i][2]].classList.toggle("active2");
          await sleep(3000);
          refreshReg();
          refreshMem();
          alu.classList.toggle("active1");
          alutext.textContent =
            regVar[Array[i][1]].textContent +
            "|" +
            regVar[Array[i][2]].textContent;
          await sleep(3000);
          refreshReg();
          refreshMem();
          let reg8_1 = regVar[Array[i][1]].textContent;
          let reg8_2 = regVar[Array[i][2]].textContent;
          reg8_1 = hexToDecimal(reg8_1);
          reg8_2 = hexToDecimal(reg8_2);
          let result = xorFun(reg8_1, reg8_2);
          result = decimalToHex(result);
          result = result.padStart(2, "0");
          regVar[Array[i][1]].textContent = result;
          regVar[Array[i][1]].classList.toggle("active1");
        } else if (
          Array[i][1][0] === "[" &&
          Array[i][1][Array[i][1].length - 1] === "]" &&
          reg16.includes(Array[i][2])
        ) {
          regVar[Array[i][2] + "1"].classList.toggle("active2");
          regVar[Array[i][2] + "2"].classList.toggle("active2");
          memArr[memLoc(Array[i][1])].classList.toggle("active2");
          await sleep(3000);
          refreshReg();
          refreshMem();
          alu.classList.toggle("active1");
          alutext.textContent =
            dataArr[memLoc(Array[i][1])].textContent +
            "|" +
            regVar[Array[i][2] + "1"].textContent +
            regVar[Array[i][2] + "2"].textContent;
          await sleep(3000);
          refreshReg();
          refreshMem();
          let ah1value = regVar[Array[i][2] + "1"].textContent;
          let al1value = regVar[Array[i][2] + "2"].textContent;
          let memData = dataArr[memLoc(Array[i][1])].textContent;
          let first16 = hexToDecimal(ah1value + al1value);
          memData = hexToDecimal(memData);
          let result = xorFun(first16, memData);
          result = decimalToHex(result);
          result = result.padStart(4, "0");
          memArr[memLoc(Array[i][1])].classList.toggle("active1");
          dataArr[memLoc(Array[i][1])].textContent = result;
        } else if (
          Array[i][2][0] === "[" &&
          Array[i][2][Array[i][2].length - 1] === "]" &&
          reg16.includes(Array[i][1])
        ) {
          memArr[memLoc(Array[i][2])].classList.toggle("active2");
          regVar[Array[i][1] + "1"].classList.toggle("active2");
          regVar[Array[i][1] + "2"].classList.toggle("active2");
          await sleep(3000);
          refreshReg();
          refreshMem();
          alu.classList.toggle("active1");
          alutext.textContent =
            regVar[Array[i][1] + "1"].textContent +
            regVar[Array[i][1] + "2"].textContent +
            "|" +
            dataArr[memLoc(Array[i][2])].textContent;
          await sleep(3000);
          refreshReg();
          refreshMem();
          let ah1value = regVar[Array[i][1] + "1"].textContent;
          let al1value = regVar[Array[i][1] + "2"].textContent;
          let memData = dataArr[memLoc(Array[i][2])].textContent;
          let first16 = hexToDecimal(ah1value + al1value);
          memData = hexToDecimal(memData);
          let result = xorFun(first16, memData);
          result = decimalToHex(result);
          result = result.toUpperCase();
          result = result.padStart(4, "0");
          regVar[Array[i][1] + "1"].textContent = result.slice(0, 2);
          regVar[Array[i][1] + "2"].textContent = result.slice(2, 4);
          regVar[Array[i][1] + "1"].classList.toggle("active1");
          regVar[Array[i][1] + "2"].classList.toggle("active1");
        }
        break;
      case "neg":
        op.textContent = opcode[Array[i][0]];
        op.textContent = opcode["neg"];
        if (reg16.includes(Array[i][1])) {
          regVar[Array[i][1] + "1"].classList.toggle("active2");
          regVar[Array[i][1] + "2"].classList.toggle("active2");
          await sleep(3000);
          refreshReg();
          refreshMem();
          alu.classList.toggle("active1");
          alutext.textContent =
            "-" +
            regVar[Array[i][1] + "1"].textContent +
            regVar[Array[i][1] + "2"].textContent;
          await sleep(3000);
          refreshReg();
          refreshMem();
          var num =
            regVar[Array[i][1] + "1"].textContent +
            regVar[Array[i][1] + "2"].textContent;
          regVar[Array[i][1] + "1"].classList.toggle("active1");
          regVar[Array[i][1] + "2"].classList.toggle("active1");
          num = Number(hexToDecimal(num));
          num = num.toString(2);
          num = num.padStart(16, "0");
          var x = num[15];
          num = negt(15, num) + x;
          num = Number(parseInt(num, 2));
          num = num.toString(16);
          num = num.padStart(4, "0");
          regVar[Array[i][1] + "2"].textContent = num.slice(2, 4);
          regVar[Array[i][1] + "1"].textContent = num.slice(0, 2);
        } else if (reg8.includes(Array[i][1])) {
          regVar[Array[i][1]].classList.toggle("active2");
          await sleep(3000);
          refreshReg();
          refreshMem();
          alu.classList.toggle("active1");
          alutext.textContent = "-" + regVar[Array[i][1]].textContent;
          await sleep(3000);
          refreshReg();
          refreshMem();
          var num = regVar[Array[i][1]].textContent;
          regVar[Array[i][1]].classList.toggle("active1");
          num = Number(hexToDecimal(num));
          num = num.toString(2);
          num = num.padStart(8, "0");
          var x = num[7];
          num = negt(7, num) + x;
          num = Number(parseInt(num, 2));
          num = num.toString(16);
          num = num.padStart(2, "0");
          regVar[Array[i][1]].textContent = num;
        } else if (
          Array[i][1][0] === "[" &&
          Array[i][1][Array[i][1].length - 1] === "]" &&
          Array[i][1].length < 4 &&
          isHexadecimal(Array[i][1][1])
        ) {
          memArr[memLoc(Array[i][1])].classList.toggle("active2");
          await sleep(3000);
          refreshReg();
          refreshMem();
          alu.classList.toggle("active1");
          alutext.textContent = "-" + dataArr[memLoc(Array[i][1])].textContent;
          await sleep(3000);
          refreshReg();
          refreshMem();
          var num = dataArr[memLoc(Array[i][1])].textContent;
          memArr[memLoc(Array[i][1])].classList.toggle("active1");
          num = Number(hexToDecimal(num));
          num = num.toString(2);
          num = num.padStart(16, "0");
          var x = num[15];
          num = negt(15, num) + x;
          num = Number(parseInt(num, 2));
          num = num.toString(16);
          num = num.padStart(4, "0");
          dataArr[memLoc(Array[i][1])].textContent = num;
        }
        break;
      case "mul":
        op.textContent = opcode[Array[i][0]];
        op.textContent = opcode["mul"];
        if (reg8.includes(Array[i][1]) && Array[i][1] != "al") {
          regVar[Array[i][1]].classList.toggle("active2");
          await sleep(3000);
          refreshReg();
          refreshMem();
          alu.classList.toggle("active1");
          alutext.textContent =
            regVar[Array[i][1]].textContent + "*" + regVar["al"].textContent;
          await sleep(3000);
          refreshReg();
          refreshMem();
          //  const tempresult=hexToDecimal(regVar["al"].textContent)*hexToDecimal(regVar[Array[i][1]])

          var result = decimalToHex(
            Number(hexToDecimal(regVar["al"].textContent)) *
              Number(hexToDecimal(regVar[Array[i][1]].textContent))
          ).toUpperCase();
          result = result.padStart(4, "0");

          regVar["ax1"].classList.toggle("active1");
          regVar["ax2"].classList.toggle("active1");
          regVar["ah"].textContent = result.slice(0, 2);
          regVar["al"].textContent = result.slice(2, 4);
        } else if (reg16.includes(Array[i][1]) && Array[i][1] != "al") {
          regVar[Array[i][1] + "1"].classList.toggle("active2");
          regVar[Array[i][1] + "2"].classList.toggle("active2");
          await sleep(3000);
          refreshReg();
          refreshMem();
          alu.classList.toggle("active1");
          alutext.textContent =
            regVar[Array[i][1] + "1"].textContent +
            regVar[Array[i][1] + "2"].textContent +
            "*" +
            regVar["al"].textContent;
          await sleep(3000);
          refreshReg();
          refreshMem();
          const tempresult =
            Number(hexToDecimal(regVar["al"].textContent)) *
            Number(
              hexToDecimal(
                regVar[Array[i][1] + "1"].textContent +
                  regVar[Array[i][1] + "2"].textContent
              )
            );

          regVar["ax1"].classList.toggle("active1");
          regVar["ax2"].classList.toggle("active1");
          if (tempresult < 65535) {
            var result = decimalToHex(tempresult).toUpperCase();

            result = result.padStart(4, "0");

            regVar["ah"].textContent = result.slice(0, 2);
            regVar["al"].textContent = result.slice(2, 4);
          } else {
            console.log("overflow");
          }
        } else if (
          Array[i][1][0] === "[" &&
          Array[i][1][Array[i][1].length - 1] === "]"
        ) {
          memArr[memLoc(Array[i][1])].classList.toggle("active2");
          await sleep(3000);
          refreshReg();
          refreshMem();
          alu.classList.toggle("active1");
          alutext.textContent =
            dataArr[memLoc(Array[i][1])].textContent +
            "*" +
            regVar["al"].textContent;
          await sleep(3000);
          refreshReg();
          refreshMem();

          regVar["ax1"].classList.toggle("active1");
          regVar["ax2"].classList.toggle("active1");
          const tempAns =
            Number(hexToDecimal(dataArr[memLoc(Array[i][1])].textContent)) *
            Number(hexToDecimal(regVar["al"].textContent));
          if (tempAns < 65535) {
            var result = decimalToHex(tempAns).toUpperCase();
            result = result.padStart(4, "0");

            regVar["ah"].textContent = result.slice(0, 2);
            regVar["al"].textContent = result.slice(2, 4);
          } else {
            console.log("overflow");
          }
          break;
        }
    }
    await waitForPress();
  }
  next.removeEventListener("click", btnResolver);
}

function translate() {
  let instructArr = instruct.value.split("\n");
  let instructArr2d = new Array();
  for (var i = 0; i < instructArr.length; i++) {
    instructArr2d[i] = instructArr[i].split(/[, ]+/);
  }
  doIt(instructArr2d);
}

simBut.addEventListener("click", translate);

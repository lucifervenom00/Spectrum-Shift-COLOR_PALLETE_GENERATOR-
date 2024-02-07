let palleteBox = document.querySelectorAll(".pallete");
let codeTitle = document.querySelectorAll(".pallete-hex");
let palleteHex = document.querySelectorAll(".pallete-hex-code");
let palleteRGB = document.querySelectorAll(".pallete-rgb-code");
let palleteHSV = document.querySelectorAll(".pallete-hsv-code");
let colorInfo = document.querySelectorAll(".color-info");
let alertBox = document.querySelector("#alert-box");
let exportPdf=document.querySelector("#export-pdf");

let generatePallete, color_name;
let previous_pallete = [];
let current_pallete = [];
let count = 0;
let prevCount, info;
let temp_array = [];
//hextorgb
const hexToRGB = (hex) => {
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
  // return `${r},${g},${b}`;
};
//rgbtohsv
const RGBtoHSV = (code) => {
  let hue, delta,s,v;
  let r = (hexToRGB(code).r) / 255;
  let g = (hexToRGB(code).g) / 255;
  let b = (hexToRGB(code).b) / 255;

  let Cmax = Math.max(r, g, b);
  let Cmin = Math.min(r, g, b);
  delta = Cmax - Cmin;
  if (delta != 0) {
      switch (Cmax) {
          case r: hue = (60 * ((g - b) / delta) + 360) % 360; break;
          case g: hue = (60 * ((b - r) / delta) + 120) % 360; break;
          case b: hue = (60 * ((r - g) / delta) + 240) % 360; break;
      }
      // hue /= 6;
  }else{
    hue=0;
  }
  s = Cmax == 0 ? 0 : delta / Cmax;
          v=Cmax
          return{hue,s,v}
};
const checkBrightness = (code, i) => {
  var brightness = Math.floor(
    0.299 * hexToRGB(code).r +
      0.587 * hexToRGB(code).g +
      0.114 * hexToRGB(code).b
  );
  // console.log(brightness)
  if (brightness < 128) {
    codeTitle[i].style.color = "white";
    colorInfo[i].style.color = "white";
    palleteHex[i].style.color = "white";
    palleteRGB[i].style.color = "white";
  } else {
    codeTitle[i].style.color = "black";
    colorInfo[i].style.color = "black";
    palleteHex[i].style.color = "black";
    palleteRGB[i].style.color = "black";
  }
};
//api
// function colorApi(code){
//     let api = `https://www.thecolorapi.com/id?hex=${code}`;
//     fetch(api)
//       .then((response) => response.json())
//       .then((data) => {
//         color_name=data.name.value;
//         // console.log(data)
//         // for(let i=0;i<=4;i++){
//         //     colorInfo[i].innerHTML = data.name.value;
//         // }

//       });
//       console.l
//       return color_name;
// }
function randomColor() {
  generatePallete = Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padStart(6, "0");
  return generatePallete;
}
//color generator
const color = () => {
  for (let i = 0; i <= 4; i++) {
    let color = randomColor();
    let colorHex = `#${color}`;
    palleteRGB[i].innerHTML = `${hexToRGB(colorHex).r},${hexToRGB(colorHex).g},${
      hexToRGB(colorHex).b
    }`;
    checkBrightness(colorHex, i);
    // console.log(RGBtoHSV(colorHex))
    palleteHSV[i].innerHTML=`${Math.floor(RGBtoHSV(colorHex).hue)},${Math.floor(RGBtoHSV(colorHex).s)},${Math.floor(RGBtoHSV(colorHex).v)}`;
    current_pallete[i] = color;
    palleteHex[i].innerHTML = colorHex.toUpperCase();
    // colorInfo[i].innerHTML = color_name;
    let api = `https://www.thecolorapi.com/id?hex=${color}`;
    fetch(api)
      .then((response) => response.json())
      .then((data) => {
        // console.log(data)
        colorInfo[i].innerHTML = data.name.value;
      });
    palleteBox[i].style.backgroundColor = colorHex;
    palleteHex[i].setAttribute("data-hex",colorHex);
    // previousPallete.push(randomColor);
    // console.log(palleteBox[i].style.backgroundColor)
  }
  temp_array = current_pallete;
  current_pallete = [];
  //   console.log("The previous pallete:" + previousPallete);
};
//Events
window.addEventListener("DOMContentLoaded", color());
window.addEventListener("keydown", (e) => {
  if (e.key == 0 || e.key == 32) {
    previous_pallete[count] = temp_array;
    temp_array = [];
    prevCount = count;
    count++;
    color();
    // console.log(previous_pallete)
  } else if (e.key == 0 || e.key == "ArrowLeft") {
    if (prevCount >= 0) {
      let previous_colors = previous_pallete[prevCount];
      // console.log(previous_colors)
      for (let i = 0; i <= 4; i++) {
        let prevClr=`#${previous_colors[i]}`
        palleteBox[i].style.backgroundColor = prevClr;
        palleteHex[i].innerHTML = previous_colors[i].toUpperCase();
        palleteRGB[i].innerHTML = `${hexToRGB(prevClr).r},${hexToRGB(prevClr).g},${
          hexToRGB(prevClr).b
        }`;
        checkBrightness(prevClr, i);
        // console.log(RGBtoHSV(colorHex))
        palleteHSV[i].innerHTML=`${Math.floor(RGBtoHSV(prevClr).hue)},${Math.floor(RGBtoHSV(prevClr).s)},${Math.floor(RGBtoHSV(prevClr).v)}`;
        let api = `https://www.thecolorapi.com/id?hex=${previous_colors[i]}`;
        fetch(api)
          .then((response) => response.json())
          .then((data) => {
            // console.log(data)
            colorInfo[i].innerHTML = data.name.value;
          });
      }
      prevCount--;
    }
  }
});
exportPdf.addEventListener("click",()=>{
  let content = document.getElementById("pallete-holder");
  // console.log(content)
  function filter (palleteBox) {
    return (palleteBox.tagName !== 'span');
}
  domtoimage.toPng(content,{filter: filter})
    .then(function (dataUrl) {
        var link = document.createElement('a');
        link.download = 'my-image-name.png';
        link.href = dataUrl;
        link.click();
    });
//   html2canvas(content).then(function(dataUrl) {
//     var link = document.createElement("a");
//     // document.body.appendChild(link);
//     link.download = "myDiv.png";
//     link.href = dataUrl;
//     // link.target = '_blank';
//     link.click();
// });
 })
  palleteHex.forEach(copyHex=>{
    copyHex.addEventListener("click",()=>{
      let text=copyHex.getAttribute("data-hex")
      console.log(text)
      alertBox.style.visibility="visible"
      navigator.clipboard.writeText(text)
      setTimeout(()=>{
        alertBox.style.visibility="hidden"
      },2000)
    })
  })
 
  // palleteHex.forEach(hex=>{
  //   hex.addEventListener("click",()=>{
  //     hex.getAttribute("data-hex")
  //     navigator.clipboard.writeText(hex.value)
  //   })
  // })
// window.addEventListener("keydown", (e) => {
//   if (e.key == 0 || e.key == 'ArrowLeft') {
//     if(prevCount>=0){
//         console.log(previous_pallete[prevCount])
//         // palleteBox[i].style.backgroundColor = previous_pallete[prevCount];
//           }
//           prevCount--;
//   }
// });
//     let prevBtn = document.querySelector("#prev-btn");
// let nextBtn = document.querySelector("#next-btn");
// let textHld = document.querySelector("#text");
// let current_numbers = [];
// let previous_numbers = [];
// let count = 0;
// let randomNum,prevCount;
// let array = [];
// function randNum() {
//   for (let i = 0; i <= 4; i++) {
//     current_numbers[i] = Math.floor(Math.random() * 100);
//   }
//   array = current_numbers;
//   // console.log("Array:"+array);
//   textHld.innerHTML=current_numbers;
//   current_numbers = [];
// }
// prevBtn.addEventListener("click", () => {
//   if(prevCount>=1){
//     console.log(previous_numbers[prevCount])
//   }
//   prevCount--;

// });
// nextBtn.addEventListener("click", () => {
//   previous_numbers[count]=array;
//   array = [];
//   prevCount=count
//   count++;
//   randNum();
//   console.log(previous_numbers);
// });

//async
// Function to fetch JSON using PHP
// const getJSON = async () => {
//   // Generate the Response object
//   const response = await fetch("getJSON.php");
//   if (response.ok) {
//     // Get JSON value from the response body
//     return response.json();
//   }
//   throw new Error("*** PHP file not found");
// };

// // Call the function and output value or error message to console
// getJSON()
//   .then((result) => console.log(result))
//   .catch((error) => console.error(error));

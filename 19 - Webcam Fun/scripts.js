const video = document.querySelector(".player");
const canvas = document.querySelector(".photo");
const ctx = canvas.getContext("2d");
const strip = document.querySelector(".strip");
const snap = document.querySelector(".snap");

function getVideo() {
    navigator.mediaDevices
        .getUserMedia({ video: true, audio: false })
        .then((localMediaStream) => {
            video.srcObject = localMediaStream;
            video.play();
        })
        .catch((err) => {
            console.error("NO!", err);
        });
}

function paintToCanvas() {
    const width = video.videoWidth;
    const height = video.videoHeight;
    console.log(width, height);

    canvas.width = width;
    canvas.height = height;

    return setInterval(() => {
        ctx.drawImage(video, 0, 0, width, height);
        //先取得畫面每個pixel的數值
        let pixels = ctx.getImageData(0, 0, width, height);
        //將它全部修改
        // pixels = redEffect(pixels);
        // pixels = rgbSplit(pixels);
        greenScreen(pixels);
        //再放回畫面上
        // ctx.globalAlpha = 0.5;
        ctx.putImageData(pixels, 0, 0);
    }, 16);
}

function redEffect(pixels) {
    for (let i = 0; i <= pixels.data.length; i += 4) {
        pixels.data[i + 0] = pixels.data[i + 0] + 100; //r
        pixels.data[i + 1] = pixels.data[i + 1] - 50; //g
        pixels.data[i + 2] = pixels.data[i + 2] * 0.5; //b
    }

    return pixels;
}

function rgbSplit(pixels) {
    for (let i = 0; i <= pixels.data.length; i += 4) {
        pixels.data[i - 100] = pixels.data[i + 0]; //r
        pixels.data[i + 500] = pixels.data[i + 1]; //g
        pixels.data[i - 550] = pixels.data[i + 2]; //b
    }

    return pixels;
}

function greenScreen(pixels) {
    const levels = {};
    document.querySelectorAll(".rgb input").forEach((input) => {
        levels[input.name] = input.value;
    });

    for (let i = 0; i <= pixels.data.length; i += 4) {
        red = pixels.data[i + 0];
        green = pixels.data[i + 1];
        blue = pixels.data[i + 2];
        alpha = pixels.data[i + 3];

        if (
            red >= levels.rmin &&
            green >= levels.gmin &&
            blue >= levels.bmin &&
            red <= levels.rmax &&
            green <= levels.gmax &&
            blue <= levels.bmax
        ) {
            pixels.data[i + 3] = 0;
        }
    }

    return pixels;
}

function takePhoto() {
    snap.currentTime = 0;
    snap.play();

    const data = canvas.toDataURL("image/jpeg");
    const link = document.createElement("a");
    link.href = data;

    link.setAttribute("download", "screenshot");
    link.innerHTML = `<img src="${data}" alt="screenshot" />`;
    strip.insertBefore(link, strip.firstChild);
}

getVideo();

video.addEventListener("canplay", paintToCanvas);

const container = document.getElementById('container');
const canvas = document.getElementById('canvas');
const file = document.getElementById('fileupload');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');
let audioSource;
let analyser;

file.addEventListener('change', function(){
    console.log(this.files);
    const files = this.files;
    const audio = document.getElementById('audio');
    audio.src = URL.createObjectURL(files[0]);
    const audioContext = new AudioContext(); //Remove if necessary when uncommenting above code
    audio.load();
    audio.play();
    audioSource = audioContext.createMediaElementSource(audio);  //Gets audio variable and sets it as the audio source
    analyser = audioContext.createAnalyser();
    audioSource.connect(analyser);
    analyser.connect(audioContext.destination); //defaults to default audio output device (speakers)
    analyser.fftSize = 256; //Higher number = more samples = more visualized bars
    const bufferLength = analyser.frequencyBinCount;
    //Buffer length is half of the value of fft and outputs that number in animated bars. So 64 fftSize = 32 bars.

    const dataArray = new Uint8Array(bufferLength); // Converts buffer length data into Uint8 which can only contain elements assigned 8 bit integers.


    const barWidth = (canvas.width / 2) / bufferLength;
    let barHeight;
    let x; //Each time a bar is drawn, jumps to right to draw another bar until all 32 bars are drawn horizontally.


    function animate() {
        x = 0;
        ctx.clearRect(0, 0, canvas.width, canvas.height); //Clears entire canvas
        analyser.getByteFrequencyData(dataArray); //references line 23. Takes frequency value from bufferLength variable, passes it to var dataArray and converts the value to Uint8Array, then uses this value to get the byte frequency data.
        drawVisualiser(bufferLength, x, barWidth, barHeight, dataArray);
        requestAnimationFrame(animate);
    }
    animate();
})



function drawVisualiser(bufferLength, x, barWidth, barHeight, dataArray){

    //Bars Original
    for (let i = 0; i < bufferLength; i++) {
        let randomGen = Math.floor(Math.random() * 2); //Generates a number to multiple dataArray[i] by in barHeight variable. Helps randomize the bar height for visual effect.
        barHeight = dataArray[i] * randomGen;
  


        const red = i * barHeight / 20;
        const green = i * 4;
        const blue = barHeight / 2;

        ctx.fillStyle = 'rgb(' + red + ',' + green + ',' + blue + ')';
    

        ctx.fillRect(canvas.width / 2 - x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth;
    }
    //Bars Mirrored
    for (let i = 0; i < bufferLength; i++) {
        let randomGen = Math.floor(Math.random() * 2); //Generates a number to multiple dataArray[i] by in barHeight variable. Helps randomize the bar height for visual effect.
        barHeight = dataArray[i] * randomGen;
      


        const red = i * barHeight / 20;
        const green = i * 4;
        const blue = barHeight / 2;

        ctx.fillStyle = 'rgb(' + red + ',' + green + ',' + blue + ')';
 

        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth;
    }

    //Faded Bars
    for (let i = 0; i < bufferLength; i++) {
        let randomGen = Math.floor(Math.random() * 8); //Generates a number to multiple dataArray[i] by in barHeight variable. Helps randomize the bar height for visual effect.
        barHeight = dataArray[i] * randomGen;
      


        const red = i * barHeight / 20;
        const green  = i * 8;
        const blue  = barHeight / 4;

        ctx.fillStyle = 'rgb(' + red + ',' + green + ',' + blue + ')';
 

        ctx.fillRect(canvas.width / 2 + x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth;
    }
}
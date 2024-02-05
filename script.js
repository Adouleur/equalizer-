document.getElementById('audioFile').addEventListener('change', function (e) {
    const audioPlayer = document.getElementById('audioPlayer');
    const gridContainer = document.getElementById('grid-container');

    const file = e.target.files[0];
    const objectURL = URL.createObjectURL(file);

    audioPlayer.src = objectURL;

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaElementSource(audioPlayer);

    source.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = 256;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    gridContainer.innerHTML = '';

    for (let i = 0; i < 36; i++) {
        const bar = document.createElement('div');
        bar.classList.add('bar');
        gridContainer.appendChild(bar);
    }
    const gridBars = document.querySelectorAll('.bar');

    function draw() {
        analyser.getByteFrequencyData(dataArray);
        gridBars.forEach((bar, index) => {
            const frequencyValue = dataArray[index];
            const yellow = frequencyValue;
            bar.style.backgroundColor = `rgb(255, 255, ${yellow})`;
        });
        requestAnimationFrame(draw);
    }
    draw();
});
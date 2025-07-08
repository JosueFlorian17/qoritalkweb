const audios = [
    {
        id: 1,
        url: "https://qoritalk.com/api/tts?text=Hoy%20me%20gusta%20la%20vida%20mucho%20menos,%20pero%20siempre%20me%20gusta%20vivir.&voice=es-ES-Standard-A"
    },
    {
        id: 2,
        url: "https://qoritalk.com/api/tts?text=Hoy%20me%20gusta%20la%20vida%20mucho%20menos,%20pero%20siempre%20me%20gusta%20vivir.&voice=es-ES-Standard-B"
    },
    {
        id: 3,
        url: "https://qoritalk.com/api/tts?text=Hoy%20me%20gusta%20la%20vida%20mucho%20menos,%20pero%20siempre%20me%20gusta%20vivir.&voice=es-ES-Standard-C"
    }
];

let currentRound = 0;
let responses = [];

function nextAudio() {
    const audioPlayer = document.getElementById("audio-player");
    const slider = document.getElementById("naturalness-slider");
    const radioOrigin = document.querySelector('input[name="voice"]:checked');
    const region = document.getElementById("departamento").value;
    const stars = document.querySelectorAll(".fa-star.checked-star");
    const qualities = [...document.querySelectorAll('input[name="qualities"]:checked')].map(q => q.value);

    // Guardar respuesta
    responses.push({
        audio_id: audios[currentRound].id,
        origin: radioOrigin ? radioOrigin.value : null,
        region: radioOrigin && radioOrigin.value === "Perú" ? region : null,
        qualities,
        human_confidence: parseInt(slider.value),
        stars: stars.length
    });

    currentRound++;

    if (currentRound < audios.length) {
        // Cargar siguiente audio
        audioPlayer.src = audios[currentRound].url;
        resetForm();
    } else {
        // Enviar respuestas al backend
        fetch("/guardar_respuestas", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(responses)
        })
        .then(res => res.json())
        .then(data => {
            alert("¡Gracias! Tus respuestas fueron guardadas.");
            location.reload(); // o redirige a otra página
        })
        .catch(err => {
            console.error("Error:", err);
            alert("Ocurrió un error al guardar tus respuestas.");
        });
    }
}

function resetForm() {
    document.getElementById("naturalness-slider").value = 5;
    document.getElementById("slider-value").textContent = 5;
    document.querySelectorAll(".fa-star").forEach(s => s.classList.remove("checked-star"));
    document.querySelectorAll('input[name="qualities"]').forEach(c => c.checked = false);
    document.qurySelector('input[name="voice"][value="Perú"]').checked = true;
    document.getElementById("departamento").value = "";
    document.getElementById("departamento-container").style.display = "block";
}


// funcionamiento de estrellas
function rateVoice(rating) {
    const stars = document.querySelectorAll('.stars-rating .fa-star');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('checked-star');
        } else {
            star.classList.remove('checked-star');
        }
    });
}

const slider = document.getElementById("naturalness-slider");
const sliderValue = document.getElementById("slider-value");

function updateSliderText(value) {
    const iaPercent = value * 10;
    const humanPercent = 100 - iaPercent;
    sliderValue.innerHTML = `${iaPercent}% IA, ${humanPercent}% humano`;
}

slider.oninput = function () {
    updateSliderText(this.value);
};

// Inicializar el texto al cargar
updateSliderText(slider.value);


function toggleDepartamento(el) {
    const container = document.getElementById("departamento-container");
    container.style.display = el.value === "Perú" ? "block" : "none";
}

function rateVoice(rating) {
    const stars = document.querySelectorAll('.fa-star');
    stars.forEach((star, index) => {
        star.classList.toggle('checked-star', index < rating);
    });
}

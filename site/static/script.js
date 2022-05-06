let fog_patterns = [
	{
		highlightColor: 0xf29492,
		baseColor: 0x114357
	},
	{
		highlightColor: 0xdbd65c,
		baseColor: 0x5614b0
	},
	{
		highlightColor: 0x2c3e50,
		baseColor: 0xfd746c
	},
	{
		highlightColor: 0xff00cc,
		baseColor: 0x333399
	},
	{
		highlightColor: 0xf0ff,
		baseColor: 0xff56
	},
	{
		blurFactor: 0.50,
		highlightColor: 0x5d6dff,
		midtoneColor: 0x303ff,
		lowlightColor: 0x580084,
		baseColor: 0xcf78ff
	}
]

// config = fog_patterns[Math.floor(Math.random() * fog_patterns.length)]
config = fog_patterns.slice(-1)[0]

const effect = VANTA.FOG({
	el: "#background",
	zoom: 1.1,
	speed: 1.33,

	...config
})

// document.getElementById("background").addEventListener("mousemove", e => {
// 	let progress = e.offsetY / innerHeight
// 	effect.setOptions({speed: progress * 5})
// })

// debug functionality
const debug_elem = document.getElementById("debug")
const debug_elems = {
	volume: document.createElement("p")
}
for (let elem of Object.values(debug_elems)) {
	debug_elem.appendChild(elem)
}



window.wallpaperRegisterAudioListener(audio_array => {
	let average_volume = audio_array.reduce((prev, current) => prev + current, 0) / audio_array.length

	debug_elems.volume.innerHTML = `Avg Volume: ${average_volume}`

})
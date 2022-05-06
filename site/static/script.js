// default settings for fog effect:
// {
// 	highlightColor: 0xffc300, // 0xaaffff
// 	midtoneColor: 0xff1f00, // 0x00002a
// 	lowlightColor: 0x2d00ff, // 0xaaaa7e
// 	baseColor: 0xffebeb, // 0x1a9eaa
// 	blurFactor: 0.6,
// 	speed: 1.0,
// 	zoom: 1.0,
// 	scale: 2,
// 	scaleMobile: 4
// }

let fog_patterns = [
	{
		highlightColor: 0xf29492,
		baseColor: 0x114357,

		midtoneColor: 0xff1f00,
		lowlightColor: 0x2d00ff
	},
	{
		highlightColor: 0xdbd65c,
		baseColor: 0x5614b0,

		midtoneColor: 0xff1f00,
		lowlightColor: 0x2d00ff
	},
	{
		highlightColor: 0x2c3e50,
		baseColor: 0xfd746c,

		midtoneColor: 0xff1f00,
		lowlightColor: 0x2d00ff
	},
	{
		highlightColor: 0xff00cc,
		baseColor: 0x333399,
		
		midtoneColor: 0xff1f00,
		lowlightColor: 0x2d00ff
	},
	{
		highlightColor: 0xf0ff,
		baseColor: 0xff56,

		midtoneColor: 0xff1f00,
		lowlightColor: 0x2d00ff
	},
	
]



// debug functionality
const debug_elem = document.getElementById("debug")
const debug_elems = {
	volume: document.createElement("p"),
	speed: document.createElement("p"),
	extra: document.createElement("p"),
}
for (let elem of Object.values(debug_elems)) {
	debug_elem.appendChild(elem)
}



// for vanta.js fog effect
let effect_profile = {
	blurFactor: 0.5,
	speed: 1.3,
	zoom: 1.3,
	scale: 2,
	scaleMobile: 4,

	highlightColor: 0x5d6dff,
	midtoneColor: 0x303ff,
	lowlightColor: 0x580084,
	baseColor: 0xcf78ff
}

const effect = VANTA.FOG({
	el: "#background",
	...effect_profile
})

// this is only supposed to store user-defined settings (and defaults)
// settings put directly below are for debug only and will be overwritten "in production"
// (this is due to wallpaper engine not providing default-set settings when debugging)
let config = {
	debug: true,
	audio_sensitivity: .25,
	profile: 0
}

// for some reason, wp engine doesn't allow upper case letters in property keys
// so this is here to help translate them
let wp_engine_key_dict = {
	blurfactor: "blurFactor",
	highlightcolor: "highlightColor",
	midtonecolor: "midtoneColor",
	lowlightcolor: "lowlightColor",
	basecolor: "baseColor"
}

window.wallpaperPropertyListener = {
	// wallpaper engine callback for applying custom settings
	applyUserProperties: properties => {

		for (let [prop, val] of Object.entries(properties)) {
			// key translate if applicable
			if (Object.keys(wp_engine_key_dict).includes(prop)) {
				prop = wp_engine_key_dict[prop]
			}

			// if a setting is defined, write it to `config`
			if (val) {
				if (["audio_sensitivity", "blurFactor", "speed", "zoom"].includes(prop)) {
					// slider value: divide by 100 for correct value
					config[prop] = val.value / 100
					// write to `effect_profile` to store changes
					effect_profile[prop] = val.value / 100
				}
				else if (["highlightColor", "midtoneColor", "lowlightColor", "baseColor"].includes(prop)) {
					// color value: format is: 1.0 0.1 0.25 (example)
					let hex = val.value.split(" ").map((v, i) => Math.round(v * 255).toString(16).padStart(2, 0)).join("")
					// write the new color to the config to show changes
					config[prop] = parseInt(hex, 16)
					// write to `effect_profile` to store changes
					effect_profile[prop] = parseInt(hex, 16)
				}
				else {
					config[prop] = val.value
					// write to `effect_profile` to store changes
					effect_profile[prop] = val.value
				}
			}
		}

		// color profile (0 is custom/default colors)
		let color_profile = config.profile == 0 ? effect_profile : fog_patterns[config.profile - 1]
		for (let [prop, val] of Object.entries(color_profile)) {
			config[prop] = val
		}

		// find which are wallpaper settings in `config`, then update wp options
		let alt = {}
		for (let alt_key of Object.keys(effect_profile).filter((value, index) => Object.keys(config).includes(value))) {
			alt[alt_key] = config[alt_key]
		}
		effect.setOptions(alt)

		// debug visibility
		debug_elem.style.visibility = config.debug ? "visible" : "hidden"

	}
}



function round(n, precision) {
	return Math.round(n * precision) / precision
}



// wallpaper engine responsive audio callback
window.wallpaperRegisterAudioListener(audio_array => {

	let average_volume = audio_array.reduce((prev, current) => prev + current, 0) / audio_array.length
	let speed = average_volume * 5 * (1 / config.audio_sensitivity)
	effect.setOptions({speed: speed})

	if (config.debug) {
		debug_elems.volume.innerHTML = `Avg Volume: ${round(average_volume, 1000)}`
		debug_elems.speed.innerHTML = `Speed: ${round(speed, 1000)}`
	}

})
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/CustomEase';
import { SplitText } from 'gsap/SplitText';
import { InertiaPlugin } from 'gsap/InertiaPlugin';

gsap.registerPlugin(ScrollTrigger, CustomEase, SplitText, InertiaPlugin);

// Brand motion signature. "hop" is decisive — wipes and transitions.
// "glide" is long — grounds, parallax, anything scrubbed.
CustomEase.create('hop', '0.9, 0, 0.1, 1');
CustomEase.create('glide', '0.8, 0, 0.2, 1');

export { gsap, ScrollTrigger, SplitText, InertiaPlugin };

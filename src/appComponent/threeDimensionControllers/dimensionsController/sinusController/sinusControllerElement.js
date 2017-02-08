import { h } from 'preact';

/**
 * @param {number} width sinus width
 * @param {number} step steps in x
 * @param {number} start start sinus at
 * @param {function} onChange event callback
 * @param {function} onRemove event callback
 * @return {object} presentation element
 */
const SinusControllerElement = ({onChange, onRemove, width=5, step=1, start=0}) => (
	<div class="dimensionInputs">
		<input type="number" name="width" onInput={onChange} value={width} />
		<input type="number" name="step" onInput={onChange} value={step} />
		<input type="number" name="start" onInput={onChange} value={start} />
		<button onClick={onRemove}>-</button>
	</div>
);

export default SinusControllerElement;